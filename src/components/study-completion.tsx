import { Link } from 'react-router';
import { ArrowRight, Check, Circle, CircleHelp, Target, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { Attempt } from '@/lib/model';
import { cn } from '@/lib/utils';

export function StudyCompletion({ attempts }: { attempts: readonly Attempt[] }) {
  const total = attempts.length;
  const correct = attempts.filter(attempt => attempt.correct).length;
  const unknown = attempts.filter(attempt => attempt.confidence === 'unknown').length;
  const incorrect = total - correct - unknown;
  const remaining = Math.ceil(total * 3 / 5) - correct;
  const reached = remaining <= 0;
  // Keep a score below the target from rounding up to 60%.
  const percent = Math.floor(correct * 1000 / total) / 10;
  const status = reached ? '60%以上を達成' : `60%まであと${remaining}問正解`;
  const segments = [
    { key: 'correct', count: correct, offset: 0, label: '正解', icon: Circle },
    { key: 'incorrect', count: incorrect, offset: correct, label: '不正解', icon: X },
    { key: 'unknown', count: unknown, offset: correct + incorrect, label: 'わからない', icon: CircleHelp },
  ];
  const arc = 'M 28 150 A 112 112 0 0 1 252 150';
  // A radial mark at 60% of the semicircle, independent of the current score.
  const angle = Math.PI * (1 - 0.6);
  const marker = (radius: number) => ({ x: 140 + radius * Math.cos(angle), y: 150 - radius * Math.sin(angle) });
  const inner = marker(96);
  const outer = marker(130);

  return <div className="session-complete">
    <h1>学習完了</h1>
    <section className={cn('completion-score', reached && 'completion-score-reached')} aria-label="今回の正答率と目標">
      <svg className="completion-gauge" viewBox="0 0 280 180" role="img" aria-label={`正答率${percent}%。${status}。正解${correct}問、不正解${incorrect}問、わからない${unknown}問、全${total}問。`}>
        <g fill="none" strokeWidth="20" aria-hidden="true">
          <path className="completion-gauge-track" d={arc} />
          {segments.filter(segment => segment.count > 0).map(segment => <path key={segment.key}
            className={`completion-gauge-segment completion-${segment.key}`} d={arc} pathLength="100"
            strokeDasharray={`${segment.count / total * 100} 100`} strokeDashoffset={-segment.offset / total * 100} />)}
          <line className="completion-gauge-marker-halo" x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} strokeWidth="6" />
          <line className="completion-gauge-marker" x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y} strokeWidth="2" />
        </g>
        <g aria-hidden="true">
          <text className="completion-gauge-goal" x="190" y="24">目標 60%</text>
          <text className="completion-gauge-value" x="140" y="126" textAnchor="middle">{percent}<tspan className="completion-gauge-unit">%</tspan></text>
          <text className="completion-gauge-total" x="140" y="149" textAnchor="middle">{correct} / {total}問</text>
          <text className="completion-gauge-end" x="28" y="173" textAnchor="middle">0</text>
          <text className="completion-gauge-end" x="252" y="173" textAnchor="middle">100%</text>
        </g>
      </svg>
      <div className="completion-target" aria-label={status}>
        {reached ? <Check size={18} aria-hidden="true" /> : <Target size={18} aria-hidden="true" />}
        <span>{reached ? '達成' : `あと${remaining}問`}</span>
      </div>
      <div className="completion-stats">
        {segments.map(segment => <div key={segment.key} className={`completion-stat completion-${segment.key}`}>
          <segment.icon size={22} aria-hidden="true" />
          <strong>{segment.count}<small>問</small></strong><span>{segment.label}</span>
        </div>)}
      </div>
    </section>
    <div className="actions"><Button asChild><Link to="/reviews">復習ノートを見る<ArrowRight size={16} /></Link></Button><Button variant="outline" asChild><Link to="/">学習ホームへ</Link></Button></div>
  </div>;
}
