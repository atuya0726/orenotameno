#!/usr/bin/env python3
"""Fetch one IPA past-exam section and prepare everything needed to add it to the app.

Usage: scripts/past-exam/fetch.sh <exam> <year> <season> <section>
  exam     sc | koudo (common 午前Ⅰ) | any IPA file code
  year     western year, e.g. 2025
  season   autumn | spring
  section  am1 | am2

Outputs under .cache/past-exam/<key>/ (key = e.g. 2025r07a_sc_am2):
  qs.pdf, ans.pdf     official IPA PDFs
  pages/pNN.png       rendered question pages, for checking figures/tables and wording by eye
  draft.json          per question: prompt and choices (third-party transcription, choices only),
                      the official answer, and flags that need a visual check
  skeleton.ts         a data file with prompts/choices/answers filled and explanations left as TODO
The transcription is only a typing aid. Always check it against pages/*.png; the answers come from the official PDF.
"""
import json
import re
import sys
import urllib.request
from html import unescape
from pathlib import Path

import fitz  # pymupdf

ROOT = Path(__file__).resolve().parents[2]
LABELS = ['ア', 'イ', 'ウ', 'エ']
OPTION_IDS = ['a', 'b', 'c', 'd']
SECTION_NAMES = {'am1': '午前Ⅰ', 'am2': '午前Ⅱ'}
COURSES = {'am1': 'A1', 'am2': 'A2'}


def get(url: str) -> bytes:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (orenotameno past-exam importer)'})
    with urllib.request.urlopen(req, timeout=60) as res:
        return res.read()


def ipa_urls(key: str, listing_url: str) -> tuple[str, str]:
    html = get(listing_url).decode('utf-8', 'replace')
    found = {}
    for kind in ('qs', 'ans'):
        m = re.search(rf'href="([^"]*{re.escape(key)}_{kind}\.pdf)"', html)
        if not m:
            sys.exit(f'{key}_{kind}.pdf is not listed on {listing_url}')
        found[kind] = 'https://www.ipa.go.jp' + m.group(1) if m.group(1).startswith('/') else m.group(1)
    return found['qs'], found['ans']


def official_answers(pdf: Path) -> dict[int, str]:
    text = '\n'.join(page.get_text() for page in fitz.open(pdf))
    pairs = re.findall(r'問\s*(\d+)\s*\n?\s*([アイウエ])', text)
    return {int(n): a for n, a in pairs}


def transcription(pasuteku_key: str) -> dict[int, dict]:
    try:
        html = get(f'https://pasuteku.com/sets/{pasuteku_key}').decode('utf-8', 'replace')
    except Exception as error:  # noqa: BLE001 - a missing transcription only means more manual typing
        print(f'warning: transcription unavailable ({error}); type the questions from pages/*.png', file=sys.stderr)
        return {}
    html = re.sub(r'<script.*?</script>|<style.*?</style>', '', html, flags=re.S)
    lines = [l.strip() for l in unescape(re.sub(r'<[^>]+>', '\n', html)).split('\n') if l.strip()]
    result: dict[int, dict] = {}
    i = 0
    while i < len(lines):
        m = re.fullmatch(r'問(\d+)', lines[i])
        if not m:
            i += 1
            continue
        number, i = int(m.group(1)), i + 1
        block = []
        # Only the question and its choices are kept; the site's own explanation from 「解説」 on is discarded.
        while i < len(lines) and lines[i] != '解説' and not re.fullmatch(r'問\d+', lines[i]):
            if lines[i] != '正解':
                block.append(lines[i])
            i += 1
        if block and block[-1] in LABELS and block.count(block[-1]) > 1:
            block.pop()  # the site's answer letter just before 「解説」
        try:
            starts = [block.index(label) for label in LABELS]
        except ValueError:
            result[number] = {'prompt': '\n'.join(block), 'options': [], 'parseError': True}
            continue
        prompt = normalize('\n'.join(block[:starts[0]]))
        options = [normalize('\n'.join(block[s + 1:e])) for s, e in zip(starts, starts[1:] + [len(block)])]
        result[number] = {'prompt': prompt, 'options': options}
    return result


JA = r'\u3000-\u30ff\u4e00-\u9fff\uff00-\uffef'


def normalize(text: str) -> str:
    # IPA PDFs put spaces between Latin and Japanese text; the app's data omits them.
    text = re.sub(rf'(?<=[{JA}])[ \u3000]+(?=[A-Za-z0-9])|(?<=[A-Za-z0-9.])[ \u3000]+(?=[{JA}])', '', text)
    return text.replace('\n', '')


def needs_visual_check(prompt: str, options: list[str]) -> list[str]:
    flags = []
    if re.search(r'図|表|次の(特徴|条件|手順|記述|設定|ログ|規則)', prompt):
        flags.append('figure/table/list in prompt')
    if any(len(o) == 0 for o in options):
        flags.append('empty choice')
    if re.search(r'[=＋×÷∑√^_]|\d+\s*[／/]\s*\d+', prompt + ''.join(options)):
        flags.append('math notation')
    return flags


def ts_string(text: str) -> str:
    return "'" + text.replace('\\', '\\\\').replace("'", "\\'").replace('\n', '') + "'"


def main() -> None:
    if len(sys.argv) != 5:
        sys.exit(__doc__)
    exam, year, season, section = sys.argv[1], int(sys.argv[2]), sys.argv[3], sys.argv[4]
    reiwa = year - 2018
    s = {'autumn': 'a', 'spring': 'h'}[season]
    key = f'{year}r{reiwa:02d}{s}_{exam}_{section}'
    listing = f'https://www.ipa.go.jp/shiken/mondai-kaiotu/{year}r{reiwa:02d}.html'
    out = ROOT / '.cache' / 'past-exam' / key
    (out / 'pages').mkdir(parents=True, exist_ok=True)

    qs_url, ans_url = ipa_urls(key, listing)
    for name, url in (('qs.pdf', qs_url), ('ans.pdf', ans_url)):
        if not (out / name).exists():
            (out / name).write_bytes(get(url))
    for i, page in enumerate(fitz.open(out / 'qs.pdf')):
        if i == 0:
            continue  # cover page with exam instructions
        pix = page.get_pixmap(dpi=110)
        # Skip the blank 〔メモ用紙〕 pages: almost every pixel is white.
        if sum(1 for b in pix.samples[::pix.n * 7] if b < 128) < 300:
            continue
        pix.save(out / 'pages' / f'p{i + 1:02d}.png')

    answers = official_answers(out / 'ans.pdf')
    text = transcription(key.replace('_', '-'))
    count = max(answers)
    if sorted(answers) != list(range(1, count + 1)):
        sys.exit(f'official answers are not contiguous: {sorted(answers)}')

    draft = []
    for n in range(1, count + 1):
        t = text.get(n, {'prompt': '', 'options': []})
        flags = needs_visual_check(t['prompt'], t['options'])
        if not t['options'] or t.get('parseError'):
            flags.append('transcription missing: type from pages/*.png')
        draft.append({'number': n, 'answer': answers[n], 'correct': OPTION_IDS[LABELS.index(answers[n])],
                      'prompt': t['prompt'], 'options': t['options'], 'check': flags})
    (out / 'draft.json').write_text(json.dumps({
        'key': key, 'exam': exam, 'year': year, 'season': season, 'section': section,
        'sectionName': SECTION_NAMES.get(section, section), 'course': COURSES.get(section),
        'questionUrl': qs_url, 'answerUrl': ans_url, 'listingUrl': listing, 'questions': draft,
    }, ensure_ascii=False, indent=2))

    var = re.sub(r'[-_](\w)', lambda m: m.group(1).upper(), f'{exam}-{year}-{season}-{COURSES.get(section, section).lower()}')
    lines = [
        "import { ipaQuestion, type IpaQuestionSet } from './ipa';",
        '',
        f'// IPA公式解答例の問1〜{count}。解説はこのサイトの独自作成。',
        f'const set: IpaQuestionSet = {{',
        f"  idPrefix: '{exam}-{year}-{season}-{COURSES.get(section, section).lower()}', examId: '{exam}', course: '{COURSES.get(section)}',",
        f"  year: {year}, season: '{season}', section: '{SECTION_NAMES.get(section, section)}', examName: 'TODO 試験名',",
        f"  questionUrl: '{qs_url}',",
        f"  answerUrl: '{ans_url}',",
        f"  listingUrl: '{listing}',",
        f"  answers: [{', '.join(repr(q['correct']) for q in draft)}],",
        '  calculation: [],',
        '};',
        'const q = ipaQuestion.bind(null, set);',
        '',
        f'export const {var} = [',
    ]
    for q in draft:
        opts = q['options'] + [''] * (4 - len(q['options']))
        lines.append(f"  q({q['number']}, 'TODO分野', 'TODO見出し', {ts_string(q['prompt'])}, [" + (f"  // check: {', '.join(q['check'])}" if q['check'] else ''))
        lines += [f"    [{ts_string(o)}, 'TODO'],{'  // 正解' if i == OPTION_IDS.index(q['correct']) else ''}" for i, o in enumerate(opts)]
        lines.append("  ], 'TODO'),")
    lines.append('];')
    (out / 'skeleton.ts').write_text('\n'.join(lines) + '\n')

    print(f'{key}: {count} questions -> {out.relative_to(ROOT)}')
    print('answers:', ''.join(q['answer'] for q in draft))
    for q in draft:
        if q['check']:
            print(f"  問{q['number']}: {', '.join(q['check'])}")


if __name__ == '__main__':
    main()
