import type { Term } from './model';

export const terms: Term[] = [
  {
    "id": "digital-signature",
    "name": "ディジタル署名",
    "reading": "Digital signature",
    "category": "暗号・認証",
    "definition": "署名者の秘密鍵で署名を作り、対応する公開鍵で検証する仕組みです。データの改ざんの検知と署名者の確認に使います。署名だけでは本文の秘密は守れません。",
    "example": "ソフトウェアの配布元が秘密鍵で署名し、利用者が配布元の公開鍵で署名を検証して、改ざんされていないかを確認します。",
    "related": [
      "hash",
      "tls"
    ],
    "criteria": [
      {
        "id": "sign",
        "title": "署名は署名者の秘密鍵で作る",
        "hint": "誰の、どちらの鍵で署名を作りますか？"
      },
      {
        "id": "verify",
        "title": "署名者の公開鍵で検証する",
        "hint": "受け取った人は、どの鍵で検証しますか？"
      },
      {
        "id": "purpose",
        "title": "改ざんの検知・署名者の確認・否認防止に使う",
        "hint": "署名があると、何を確認でき、署名者は何を否定できなくなりますか？"
      },
      {
        "id": "digest",
        "title": "本文のハッシュ値（メッセージダイジェスト）に署名する",
        "hint": "本文そのものではなく、何に対して署名を作りますか？",
        "level": "deep"
      },
      {
        "id": "certificate",
        "title": "公開鍵が本人のものであることは認証局の証明書（PKI）で保証する",
        "hint": "検証に使う公開鍵が本当に署名者のものだと、どうやって確かめますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "「公開鍵で署名を作る」と読める部分があります。生成に使うのは署名者の秘密鍵です。",
      "「秘密鍵で署名を検証する」と読める部分があります。通常の署名検証には公開鍵を使います。",
      "署名と暗号化は役割が異なります。署名だけで本文を秘密にはできません。"
    ]
  },
  {
    "id": "hash",
    "name": "ハッシュ関数",
    "aliases": [
      "ハッシュアルゴリズム"
    ],
    "reading": "Hash function",
    "category": "暗号・認証",
    "definition": "任意長の入力から一定長のハッシュ値を計算する関数です。暗号学的ハッシュでは、値から元の入力を求めることや、同じ値になる異なる入力を見つけることが計算上困難な性質を求めます。",
    "example": "配布ファイルのハッシュ値を再計算して公開済みの値と比較すると、内容が変わっていないかを確認できます。",
    "related": [
      "salt",
      "digital-signature"
    ],
    "criteria": [
      {
        "id": "fixed",
        "title": "任意の入力から一定長の値を計算する",
        "hint": "入力の長さと出力の長さには、どのような関係がありますか？"
      },
      {
        "id": "oneway",
        "title": "値から元の入力を求めるのは困難",
        "hint": "暗号化のように、ハッシュ値を復号して元に戻せますか？"
      },
      {
        "id": "collision",
        "title": "同じハッシュ値を生む異なる入力を見つけることが困難である",
        "hint": "同じ値になる別の入力を簡単に見つけられると、何が問題ですか？"
      },
      {
        "id": "use",
        "title": "改ざんの検知やパスワードの保存などに使う",
        "hint": "ハッシュ値はどんな場面で何のために使いますか？",
        "level": "deep"
      },
      {
        "id": "deprecated",
        "title": "MD5やSHA-1は衝突が見つかっており、SHA-256などを使う",
        "hint": "今は使うべきでないハッシュ関数と、その理由は何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "ハッシュ値は通常、復号して元の入力に戻すためのものではありません。",
      "有限長の出力なので衝突はあり得ます。「絶対に同じ値にならない」とは言えません。"
    ]
  },
  {
    "id": "salt",
    "name": "ソルト",
    "reading": "Salt",
    "category": "暗号・認証",
    "definition": "パスワードのハッシュ計算などに加える、利用者ごとに異なるランダムな値です。同じパスワードでも保存値が同じになるのを避け、事前計算の使い回しを難しくします。ソルト自体は秘密にする必要はありません。",
    "example": "同じパスワードを使う二人でも別々のソルトを使えば、保存するハッシュ値は異なります。",
    "related": [
      "hash"
    ],
    "criteria": [
      {
        "id": "random",
        "title": "利用者ごとに異なるランダムな値",
        "hint": "全員に同じ値を使うのでしょうか？"
      },
      {
        "id": "add",
        "title": "パスワードに加えてハッシュを計算する",
        "hint": "その値を何に加えて、どの処理をしますか？"
      },
      {
        "id": "purpose",
        "title": "同じパスワードの判別やレインボーテーブルなどの事前計算攻撃を防ぐ",
        "hint": "ソルトがあると、どんな攻撃が難しくなりますか？",
        "level": "deep"
      },
      {
        "id": "public",
        "title": "ソルト自体は秘密にしなくてよく、ハッシュ値と一緒に保存する",
        "hint": "ソルトは秘密にする必要がありますか？どこに保存しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "ソルトはハッシュ値と共に保存できます。秘密値であるペッパーとは区別します。",
      "利用者ごとに異なる値にする点を確認しましょう。"
    ]
  },
  {
    "id": "tls",
    "name": "TLS",
    "reading": "Transport Layer Security",
    "category": "暗号・認証",
    "definition": "通信相手の認証、通信内容の暗号化、改ざんの検知などを提供するプロトコルです。HTTPSはHTTPをTLSで保護した通信です。",
    "example": "HTTPSでWebサイトを開くと、サーバ証明書などで相手を確認し、ブラウザとサーバ間の通信を保護します。",
    "related": [
      "digital-signature"
    ],
    "criteria": [
      {
        "id": "encrypt",
        "title": "通信内容を暗号化する",
        "hint": "通信内容にどのような保護を与えますか？"
      },
      {
        "id": "auth",
        "title": "証明書などで通信相手を認証する",
        "hint": "通信相手が正当かどうかは、何で確認しますか？"
      },
      {
        "id": "integrity",
        "title": "通信の改ざんを検知する",
        "hint": "盗聴への対策以外に、書き換えにはどう備えますか？"
      },
      {
        "id": "hybrid",
        "title": "ハンドシェイクで鍵を共有し、通信本体は共通鍵暗号で暗号化する",
        "hint": "通信本体の暗号化には、どの方式の暗号を使いますか？その鍵はどう共有しますか？",
        "level": "deep"
      },
      {
        "id": "forward-secrecy",
        "title": "一時的な鍵交換（ECDHEなど）で前方秘匿性を確保し、サーバの秘密鍵が漏れても過去の通信を守る",
        "hint": "サーバの秘密鍵が後から漏れたとき、過去の通信を守るには何が必要ですか？",
        "level": "deep"
      },
      {
        "id": "mutual",
        "title": "クライアント証明書を使えば、サーバだけでなく利用者側も認証できる",
        "hint": "サーバだけでなく、接続してくる利用者側を認証するにはどうしますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "TLSは通信路の保護です。アプリケーション内の脆弱性まで解消するものではありません。"
    ]
  },
  {
    "id": "sql-injection",
    "name": "SQLインジェクション",
    "reading": "Structured Query Language injection",
    "category": "Webセキュリティ",
    "definition": "入力値などがSQLの命令として解釈され、意図しない問合せやデータ操作を起こす攻撃です。プレースホルダとパラメータバインドでSQLの構造とデータを分離します。",
    "example": "検索語をSQL文へ直接連結すると、入力に含まれる記号や命令でSQLの意味を変えられる場合があります。",
    "related": [
      "xss",
      "csrf"
    ],
    "criteria": [
      {
        "id": "entry",
        "title": "入力値がSQLの命令として解釈される",
        "hint": "利用者の入力は、サーバ側で何として扱われてしまいますか？"
      },
      {
        "id": "impact",
        "title": "DBからの漏えいや不正操作が起きる",
        "hint": "攻撃が成立すると何が起きますか？",
        "level": "deep"
      },
      {
        "id": "defense",
        "title": "パラメータ化して命令と値を分離する",
        "hint": "安全にSQLを組み立てる方法を説明できますか？",
        "level": "deep"
      },
      {
        "id": "mitigation",
        "title": "DBアカウントの権限の最小化やエラー詳細を表示しないなどで被害を抑える",
        "hint": "パラメータ化のほかに、被害を小さくする対策は何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "HTTPSにしても、入力を危険な形でSQLへ連結する問題は残ります。"
    ]
  },
  {
    "id": "xss",
    "name": "XSS",
    "aliases": [
      "エスケープ",
      "クロスサイトスクリプティング"
    ],
    "reading": "Cross-site scripting",
    "category": "Webセキュリティ",
    "definition": "信頼できない入力などに含まれるスクリプトが、Webページの一部として利用者のブラウザで実行される攻撃です。出力先に応じたエスケープなどでデータをコードとして実行させないようにします。",
    "example": "掲示板の投稿をそのままHTMLに埋め込むと、投稿に仕込まれたスクリプトが閲覧者のブラウザで動く場合があります。",
    "related": [
      "csrf",
      "sql-injection"
    ],
    "criteria": [
      {
        "id": "inject",
        "title": "悪意のあるスクリプトがページに混入する",
        "hint": "攻撃者はページに何を混入させますか？"
      },
      {
        "id": "browser",
        "title": "被害者のブラウザで実行される",
        "hint": "そのコードはどこで動きますか？"
      },
      {
        "id": "defense",
        "title": "出力先に応じてエスケープする",
        "hint": "入力内容を画面に出すとき、どう処理しますか？",
        "level": "deep"
      },
      {
        "id": "impact",
        "title": "Cookieの盗用によるセッションハイジャックや偽の画面表示などの被害が起きる",
        "hint": "スクリプトが実行されると、どんな被害が起きますか？",
        "level": "deep"
      },
      {
        "id": "types",
        "title": "反射型・格納型（持続型）・DOMベースの種類がある",
        "hint": "攻撃用スクリプトがページに入り込む経路には、どんな種類がありますか？",
        "level": "deep"
      },
      {
        "id": "mitigation",
        "title": "Cookie の HttpOnly 属性やCSP（Content Security Policy）で被害を緩和する",
        "hint": "エスケープ漏れがあっても、Cookie窃取やスクリプト実行を抑える仕組みは何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "XSSでのスクリプト実行場所は主に利用者のブラウザです。"
    ]
  },
  {
    "id": "csrf",
    "name": "CSRF",
    "aliases": [
      "クロスサイトリクエストフォージェリ",
      "トークン"
    ],
    "reading": "Cross-site request forgery",
    "category": "Webセキュリティ",
    "definition": "ログイン済みの利用者のブラウザを通じて、本人が意図しないリクエストを送らせる攻撃です。CSRFトークンの検証などで対策します。",
    "example": "ログイン中のサービスに対して、別のページから本人の意図しない設定変更リクエストを送らせるような攻撃です。",
    "related": [
      "xss"
    ],
    "criteria": [
      {
        "id": "session",
        "title": "ログイン済みの認証状態を利用する",
        "hint": "利用者は対象サービスに対してどのような状態ですか？"
      },
      {
        "id": "request",
        "title": "ブラウザから意図しない要求を送らせる",
        "hint": "攻撃者は利用者のブラウザに何をさせますか？"
      },
      {
        "id": "defense",
        "title": "CSRFトークンなどで正当な要求か検証する",
        "hint": "正規画面からの要求かを確認する対策は何ですか？",
        "level": "deep"
      },
      {
        "id": "token-reason",
        "title": "トークンは攻撃者が知り得ない値なので、偽のリクエストと区別できる",
        "hint": "CSRFトークンで偽のリクエストを見分けられるのはなぜですか？",
        "level": "deep"
      },
      {
        "id": "samesite",
        "title": "Cookieの SameSite 属性やOrigin・Refererヘッダの検証も対策になる",
        "hint": "トークン以外に、他サイトからのリクエストを防ぐ仕組みは何ですか？",
        "level": "deep"
      },
      {
        "id": "reauth",
        "title": "送金や設定変更などの重要な処理では、パスワードの再入力を求める",
        "hint": "特に重要な処理には、トークン以外にどんな確認を加えますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "CSRFは意図しないリクエストを送らせる攻撃です。XSSと混同していないか確認しましょう。"
    ]
  },
  {
    "id": "mfa",
    "name": "多要素認証",
    "reading": "Multi-factor authentication",
    "category": "暗号・認証",
    "definition": "知識情報・所持情報・生体情報のうち、異なる種類の要素を二つ以上組み合わせる認証です。認証を二回するだけでは多要素とは限りません。",
    "example": "知っているパスワードと、持っているセキュリティキーを組み合わせてログインします。",
    "related": [
      "least-privilege"
    ],
    "criteria": [
      {
        "id": "types",
        "title": "知識・所持・生体という要素の種類",
        "hint": "認証要素はどのような種類に分けられますか？"
      },
      {
        "id": "combine",
        "title": "異なる種類を二つ以上組み合わせる",
        "hint": "同じ種類の要素を二つ使ってもよいのでしょうか？"
      },
      {
        "id": "reason",
        "title": "一つの要素が漏れても他の種類の要素がなければ突破できない",
        "hint": "要素の種類を分けると、なぜ安全性が上がるのですか？",
        "level": "deep"
      },
      {
        "id": "realtime-phishing",
        "title": "偽サイトが入力をそのまま中継するリアルタイムフィッシングでは、ワンタイムパスワードも突破され得る",
        "hint": "多要素認証を使っていても突破されるのは、どんな攻撃ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "二つのパスワードはどちらも知識要素です。異なる種類を組み合わせる必要があります。",
      "パスワードと秘密の質問は、どちらも知識要素です。"
    ]
  },
  {
    "id": "least-privilege",
    "name": "最小権限の原則",
    "aliases": [
      "最小権限"
    ],
    "reading": "Principle of least privilege",
    "category": "アクセス制御",
    "definition": "利用者やプログラムに、業務や処理に必要な最小限の権限だけを与える原則です。不要な権限や過剰なアクセスを減らし、誤操作・侵害時の被害を限定します。",
    "example": "参照だけが必要なアプリには、データベースの読取り権限を与え、書込みや管理者権限は与えません。",
    "related": [
      "mfa",
      "zero-trust"
    ],
    "criteria": [
      {
        "id": "minimum",
        "title": "必要な最小限の権限だけを与える",
        "hint": "権限はどの範囲まで付与しますか？"
      },
      {
        "id": "subject",
        "title": "利用者やプログラムの役割に合わせる",
        "hint": "誰に対して、何を基準に制限しますか？"
      },
      {
        "id": "impact",
        "title": "誤操作や侵害時の被害を限定する",
        "hint": "権限を絞ることで、どのようなリスクを減らせますか？",
        "level": "deep"
      },
      {
        "id": "review",
        "title": "権限を定期的に見直し、異動・退職などで不要になった権限を削除する",
        "hint": "一度与えた権限は、その後どう管理しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "管理者権限を全員に与える考え方は、最小権限の原則と逆です。"
    ]
  },
  {
    "id": "dns",
    "name": "DNS",
    "aliases": [
      "正引き",
      "逆引き"
    ],
    "reading": "Domain Name System",
    "category": "ネットワーク",
    "definition": "ドメイン名に対応するIPアドレスなどを調べるための分散した名前解決の仕組みです。A・AAAA・MXなど、用途ごとに異なるレコードを扱います。",
    "example": "ブラウザがexample.comへ接続するとき、DNSで接続先のIPアドレスを調べます。",
    "related": [
      "spf",
      "dkim"
    ],
    "criteria": [
      {
        "id": "mapping",
        "title": "ドメイン名からIPアドレスなどを調べる（名前解決）",
        "hint": "DNSは何から何を調べる仕組みですか？"
      },
      {
        "id": "servers",
        "title": "フルリゾルバ（キャッシュDNSサーバ）が権威DNSサーバに問い合わせて名前解決する",
        "hint": "名前解決では、どんな役割のDNSサーバが関わりますか？",
        "level": "deep"
      },
      {
        "id": "distributed",
        "title": "ルートから階層的に分散してレコードを管理する",
        "hint": "DNSのデータは、どのように分担して管理されていますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "端末へのIPアドレス自動配布はDHCPの役割です。"
    ]
  },
  {
    "id": "reverse-proxy",
    "name": "リバースプロキシ",
    "reading": "Reverse proxy",
    "category": "ネットワーク",
    "definition": "公開サーバの代理としてクライアントからの要求を受け付け、内部のサーバへ中継する仕組みです。負荷分散やTLSの終端、キャッシュなどにも利用されます。",
    "example": "外部からのWebアクセスを一度受け付け、複数のアプリケーションサーバへ振り分けます。",
    "related": [
      "tls",
      "forward-proxy"
    ],
    "criteria": [
      {
        "id": "side",
        "title": "サーバ側の代理になる",
        "hint": "クライアント側とサーバ側の、どちらの代理ですか？"
      },
      {
        "id": "direction",
        "title": "外部からサーバへの要求を中継する",
        "hint": "どの向きの通信を取り次ぎますか？"
      },
      {
        "id": "use",
        "title": "負荷分散・TLS終端・キャッシュなどの用途",
        "hint": "中継以外に、どのような機能を担当できますか？",
        "level": "deep"
      },
      {
        "id": "hide",
        "title": "内部のサーバを直接公開せずに済み、WAFなどの防御を前段に置ける",
        "hint": "セキュリティの面では、どんな利点がありますか？",
        "level": "deep"
      },
      {
        "id": "client-ip",
        "title": "サーバからは接続元がプロキシに見えるため、X-Forwarded-Forなどで元の送信元を引き継ぐ",
        "hint": "リバースプロキシの後ろにあるサーバからは、利用者のIPアドレスがどう見えますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "その向きは通常のフォワードプロキシの説明です。"
    ]
  },
  {
    "id": "dkim",
    "name": "DKIM",
    "reading": "DomainKeys Identified Mail",
    "category": "メールセキュリティ",
    "definition": "メールに送信ドメインの秘密鍵で署名し、受信側がDNSに公開された鍵を使って検証する送信ドメイン認証技術です。署名対象部分の改ざんも検知できます。",
    "example": "送信側がDKIM-Signatureヘッダーを付け、受信側はドメインのDNSから公開鍵を取得して検証します。",
    "related": [
      "spf",
      "digital-signature"
    ],
    "criteria": [
      {
        "id": "sign",
        "title": "送信側がメールに署名する",
        "hint": "送信側はメールに何を付けますか？"
      },
      {
        "id": "verify",
        "title": "DNSの公開鍵で受信側が検証する",
        "hint": "検証用の公開鍵はどこで公開されていますか？"
      },
      {
        "id": "purpose",
        "title": "送信ドメインの認証や改ざんの検知",
        "hint": "何を認証し、何の書き換えを検知できますか？"
      },
      {
        "id": "forwarding",
        "title": "転送で接続元IPアドレスが変わっても、署名対象が変更されなければ検証できる",
        "hint": "転送時に何が変わらなければ、署名を検証できますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "IPアドレスに基づくSPFと、署名を使うDKIMを区別しましょう。"
    ]
  },
  {
    "id": "spf",
    "name": "SPF",
    "reading": "Sender Policy Framework",
    "category": "メールセキュリティ",
    "definition": "ドメインがメール送信を許可するサーバのIPアドレスなどをDNSに公開し、受信側が実際の接続元と照合する送信ドメイン認証技術です。メール本文の改ざんは検知しません。",
    "example": "受信サーバが接続元IPアドレスを確認し、送信ドメインのSPFレコードで許可されているか調べます。",
    "related": [
      "dkim",
      "dns"
    ],
    "criteria": [
      {
        "id": "dns",
        "title": "送信を許可するサーバをDNSに公開する",
        "hint": "許可する送信サーバの情報は、どこに置きますか？"
      },
      {
        "id": "ip",
        "title": "受信側が送信元IPアドレスを照合する",
        "hint": "受信側は何のアドレスを照合しますか？"
      },
      {
        "id": "limit",
        "title": "本文の改ざんは検知しない",
        "hint": "DKIMとは違い、本文の書き換えまで分かりますか？",
        "level": "deep"
      },
      {
        "id": "forwarding",
        "title": "メールが転送されると接続元IPアドレスが変わり、認証に失敗しやすい",
        "hint": "メールが転送されると、SPFの照合はどうなりますか？",
        "level": "deep"
      },
      {
        "id": "record",
        "title": "送信許可情報はDNSのTXTレコードに記述する",
        "hint": "送信を許可する情報は、DNSのどの種類のレコードに記しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "SPFはIPアドレスなどに基づく認証です。本文への署名検証はDKIMなどと区別します。"
    ]
  },
  {
    "id": "base",
    "name": "BASE特性",
    "aliases": [
      "BASE"
    ],
    "reading": "Basically Available / Soft state / Eventually consistent",
    "category": "データベース",
    "definition": "分散システムで可用性を重視し、一時的な状態の不一致を許容しつつ、最終的には更新が行き渡る結果整合性を目指す考え方です。",
    "example": "複数ノードの参照結果が更新直後に一時的に異なっても、更新が伝播すれば一致するようにします。",
    "related": [
      "acid",
      "nosql",
      "eventual-consistency"
    ],
    "criteria": [
      {
        "id": "available",
        "title": "基本的な可用性を重視する",
        "hint": "整合性と比べて、どの性質を優先しますか？"
      },
      {
        "id": "temporary",
        "title": "一時的な不一致を許容する",
        "hint": "更新直後の各ノードは、必ず同じ値を返しますか？"
      },
      {
        "id": "eventual",
        "title": "最終的に更新が行き渡る結果整合性",
        "hint": "時間が経ち更新が反映されると、どのような状態になりますか？"
      },
      {
        "id": "nosql",
        "title": "NoSQLのデータベースなど、大規模な分散システムで採用される",
        "hint": "BASE特性は、どんなデータベースで採用されていますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "BASEでは更新伝播中の不一致を許容します。常に同じ値という説明を見直しましょう。"
    ]
  },
  {
    "id": "acid",
    "name": "ACID特性",
    "reading": "Atomicity / Consistency / Isolation / Durability",
    "category": "データベース",
    "definition": "トランザクションに求める原子性（全部成功するか全部取り消す）・一貫性・独立性（隔離性）・耐久性の四つの性質です。一貫性は整合性制約を保つこと、独立性は並行実行の干渉を防ぐこと、耐久性はコミットした結果を障害後も保持することを指します。",
    "example": "送金で出金だけが確定するのを防ぎ、同時操作でも整合性を保ち、コミットした結果を障害後も保持する、といった性質です。",
    "related": [
      "base"
    ],
    "criteria": [
      {
        "id": "transaction",
        "title": "トランザクションの性質である",
        "hint": "何という処理単位に求める性質ですか？"
      },
      {
        "id": "atomic",
        "title": "原子性は全部成功か全部取消し",
        "hint": "途中までの更新だけが残らない性質を説明できますか？"
      },
      {
        "id": "consistency",
        "title": "一貫性はトランザクションの前後で整合性制約を保つ性質",
        "hint": "処理の前後で、データはどのような制約を満たしますか？"
      },
      {
        "id": "isolation",
        "title": "独立性・隔離性は並行するトランザクションの干渉を防ぐ性質",
        "hint": "複数の処理が同時に動くとき、どのような性質が必要ですか？"
      },
      {
        "id": "durability",
        "title": "耐久性はコミットした結果を障害後も保持する性質",
        "hint": "確定した結果は、障害が起きたときにどう扱われますか？"
      },
      {
        "id": "recovery",
        "title": "障害時はログを使い、ロールバックやロールフォワードで原子性と耐久性を守る",
        "hint": "障害が起きたとき、DBMSはどのようにデータを元に戻したり復元したりしますか？",
        "level": "deep"
      },
      {
        "id": "locking",
        "title": "ロック（2相ロックなど）で独立性を守る",
        "hint": "同時に実行されるトランザクションが干渉しないよう、どうしますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "原子性は途中までの更新だけが残ることを防ぐ性質です。"
    ]
  },
  {
    "id": "lru",
    "name": "LRU",
    "reading": "Least Recently Used",
    "category": "コンピュータ構成",
    "definition": "キャッシュなどの置換対象として、最後に参照されてから最も長い時間が経ったデータを選ぶ方式です。ロード順や参照回数とは区別します。",
    "example": "最後の利用が10:05、10:10、10:20の三つのデータなら、最も長く使われていない10:05のデータを置き換えます。",
    "related": [],
    "criteria": [
      {
        "id": "oldest",
        "title": "キャッシュなどで、最後の参照から最も長い時間が経ったデータを置換対象にする",
        "hint": "参照された時刻に注目すると、どのデータを置き換えますか？"
      }
    ],
    "commonMistakes": [
      "参照回数が少ないものを選ぶのはLFUです。LRUは最終参照時刻に注目します。",
      "ロード順で古いものを選ぶのはFIFOです。"
    ]
  },
  {
    "id": "zero-trust",
    "name": "ゼロトラスト",
    "reading": "Zero trust",
    "category": "アクセス制御",
    "definition": "ネットワークの内側にいることだけで信頼せず、利用者・端末・要求の状態などに基づいてアクセスを検証し、必要最小限の権限で許可する考え方です。",
    "example": "社内ネットワークからのアクセスでも、利用者の認証、端末の状態、対象資源への権限を確認します。",
    "related": [
      "least-privilege",
      "mfa"
    ],
    "criteria": [
      {
        "id": "boundary",
        "title": "社内にいるだけでは信頼しない",
        "hint": "社内ネットワークからなら無条件に許可しますか？"
      },
      {
        "id": "verify",
        "title": "利用者や端末の状態から検証する",
        "hint": "アクセスを許可するとき、何を確認しますか？"
      },
      {
        "id": "least",
        "title": "最小限の権限を適用する",
        "hint": "認証した人には、どの範囲の権限を与えますか？"
      },
      {
        "id": "continuous",
        "title": "アクセスのたびに継続的に検証する",
        "hint": "一度認証したら、その後のアクセスはどう扱いますか？",
        "level": "deep"
      },
      {
        "id": "vs-perimeter",
        "title": "侵入後の横展開やクラウド利用に弱い境界型防御の限界を踏まえた考え方",
        "hint": "なぜ従来の境界型防御では不十分になったのですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "ネットワークの内側という理由だけで信頼する考え方は、ゼロトラストと異なります。"
    ]
  },
  {
    "id": "ids-ips",
    "name": "IDS",
    "aliases": [
      "侵入検知システム"
    ],
    "reading": "Intrusion Detection System",
    "category": "ネットワークセキュリティ",
    "definition": "通信やホストの動作を監視して、不正アクセスや攻撃の兆候を検知し、管理者に警告する仕組みです。",
    "example": "不審な通信を検知して管理者に通知します。",
    "related": [
      "ips",
      "reverse-proxy"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "不正な通信や動作を検知し、警告・通知する",
        "hint": "不正を見つけた後、何をしますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ips",
    "name": "IPS",
    "aliases": [
      "侵入防止システム"
    ],
    "reading": "Intrusion Prevention System",
    "category": "ネットワークセキュリティ",
    "definition": "不正な通信や攻撃を検知し、通信の遮断などによって侵入を防止する仕組みです。",
    "example": "攻撃と判断したパケットを遮断します。",
    "related": [
      "ids-ips",
      "reverse-proxy"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "不正な通信を検知し、遮断などによって侵入を防止する",
        "hint": "検知するだけでなく、どのように対処しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "pki",
    "name": "PKI（公開鍵基盤）",
    "reading": "Public Key Infrastructure",
    "category": "暗号・認証",
    "definition": "公開鍵とその持ち主の対応を、認証局（CA）が発行するデジタル証明書で保証する仕組みです。登録局（RA）が本人確認と申請の審査を行い、CAが証明書に署名して発行し、失効した証明書はCRLやOCSPで確認できるようにします。",
    "example": "Webサーバの証明書をブラウザが検証し、信頼するルート証明書までの署名の連鎖をたどって、接続先の公開鍵が本物かを確かめます。",
    "related": [
      "digital-signature",
      "tls"
    ],
    "criteria": [
      {
        "id": "binding",
        "title": "公開鍵と持ち主の対応をデジタル証明書で保証する",
        "hint": "公開鍵が本当にその人のものだと、何で確かめますか？"
      },
      {
        "id": "ca",
        "title": "認証局（CA）が証明書に自らの秘密鍵で署名して発行する",
        "hint": "証明書が偽物でないことは、誰の何によって保証されますか？"
      },
      {
        "id": "revocation",
        "title": "失効した証明書はCRLやOCSPで確認する",
        "hint": "秘密鍵が漏えいした証明書を、有効期限前に使えなくするにはどうしますか？",
        "level": "deep"
      },
      {
        "id": "chain",
        "title": "ルートCAまで署名をたどる証明書チェーンで信頼を確認する",
        "hint": "中間CAが発行した証明書は、どこまでたどって検証しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "証明書に署名して発行するのはCAです。RAは本人確認と申請の審査を担います。",
      "証明書には公開鍵を載せます。秘密鍵は載せません。"
    ]
  },
  {
    "id": "cryptrec",
    "name": "CRYPTREC暗号リスト",
    "reading": "Cryptography Research and Evaluation Committees Ciphers List",
    "category": "暗号・認証",
    "definition": "電子政府での調達のために参照すべき暗号を示すリストです。電子政府推奨暗号リスト・推奨候補暗号リスト・運用監視暗号リストの三つから成ります。",
    "example": "政府のシステムで暗号を選ぶとき、電子政府推奨暗号リストに載っているAESやSHA-256を使い、運用監視暗号リストの暗号は互換性維持の目的に限ります。",
    "related": [
      "pqc"
    ],
    "criteria": [
      {
        "id": "purpose",
        "title": "電子政府の調達で参照すべき暗号を示すリスト",
        "hint": "誰が、何のために参照するリストですか？"
      },
      {
        "id": "lists",
        "title": "電子政府推奨暗号リスト・推奨候補暗号リスト・運用監視暗号リストから成る",
        "hint": "どのようなリストで構成されていますか？"
      },
      {
        "id": "transition",
        "title": "危殆化の進んだ暗号は運用監視リストへ移り、新規の利用を避けて移行する",
        "hint": "暗号が弱くなったと分かったとき、リスト上の扱いと利用者の対応はどう変わりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "「互換性維持のために継続利用を認める」のは運用監視暗号リストです。電子政府推奨暗号リストではありません。",
      "証明書失効リスト（CRL）はPKIの仕組みで、CRYPTREC暗号リストには含まれません。"
    ]
  },
  {
    "id": "pqc",
    "name": "耐量子計算機暗号（PQC）",
    "reading": "Post-Quantum Cryptography",
    "category": "暗号・認証",
    "definition": "量子コンピュータによる攻撃にも耐えるよう設計された暗号です。格子問題など量子コンピュータでも解くのが難しい問題に基づき、従来のコンピュータで実装・運用します。",
    "example": "量子コンピュータで解読されるおそれのあるRSA暗号や楕円曲線暗号による鍵交換を、ML-KEMなどのPQCの方式へ置き換えます。",
    "related": [
      "one-time-pad",
      "cryptrec",
      "lattice-problem"
    ],
    "criteria": [
      {
        "id": "quantum",
        "title": "量子コンピュータによる攻撃にも安全性を保てる",
        "hint": "どんな攻撃者を想定した暗号ですか？"
      },
      {
        "id": "classical",
        "title": "量子コンピュータではなく従来のコンピュータで動作する",
        "hint": "PQCを使うには量子コンピュータが必要ですか？"
      },
      {
        "id": "threat",
        "title": "RSA暗号や楕円曲線暗号は、量子コンピュータで解読されるおそれがある",
        "hint": "なぜPQCへの移行が必要なのですか？",
        "level": "deep"
      },
      {
        "id": "math",
        "title": "量子コンピュータでも解くのが難しいと考えられる数学的問題に基づく",
        "hint": "量子計算による攻撃への安全性は、何に基づきますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "PQCは量子コンピュータを使う暗号ではありません。従来のコンピュータで動作します。",
      "量子鍵配送（量子暗号）とPQCを混同しないようにしましょう。"
    ]
  },
  {
    "id": "one-time-pad",
    "name": "ワンタイムパッド",
    "reading": "One-time pad",
    "category": "暗号・認証",
    "definition": "平文と同じ長さの真の乱数を鍵とし、一度だけ使う暗号です。条件を守れば、攻撃者の計算能力に関係なく解読できない情報理論的安全性を持ちます。",
    "example": "平文の各ビットと乱数の鍵の各ビットの排他的論理和を取って暗号文を作り、使った鍵は二度と使いません。",
    "related": [
      "pqc"
    ],
    "criteria": [
      {
        "id": "key",
        "title": "平文と同じ長さの真の乱数を鍵にする",
        "hint": "鍵の長さと性質には、どんな条件がありますか？"
      },
      {
        "id": "once",
        "title": "鍵は一度だけ使い、使い回さない",
        "hint": "同じ鍵を二回使うと、どうなりますか？"
      },
      {
        "id": "its",
        "title": "計算能力が無限でも解読できない情報理論的安全性を持つ",
        "hint": "量子コンピュータを使っても解読できないのはなぜですか？",
        "level": "deep"
      },
      {
        "id": "distribution",
        "title": "長い鍵を安全に共有するのが難しく、実用は限られる",
        "hint": "理論的に安全なのに、広く使われないのはなぜですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "鍵を再利用すると、暗号文同士から平文の関係が漏れ、安全性が失われます。"
    ]
  },
  {
    "id": "xml-signature",
    "name": "XMLデジタル署名",
    "aliases": [
      "XML Signature"
    ],
    "reading": "Extensible Markup Language Signature",
    "category": "暗号・認証",
    "definition": "XML文書に対するデジタル署名の規格です。文書全体だけでなく一部の要素も署名対象にでき、署名の情報もXMLで記述します。署名と対象の位置関係により、エンベロープ署名、エンベローピング署名、デタッチ署名があります。",
    "example": "SAMLのアサーションのうち必要な要素にXMLデジタル署名を付け、受け取ったサービスがIdPの公開鍵で検証します。",
    "related": [
      "digital-signature",
      "pki",
      "enveloped-signature",
      "enveloping-signature"
    ],
    "criteria": [
      {
        "id": "partial",
        "title": "XML文書の一部の要素だけを署名対象にできる",
        "hint": "文書全体以外に、どんな範囲に署名できますか？"
      },
      {
        "id": "xml-syntax",
        "title": "署名の情報をXMLで記述する（CMSやASN.1は使わない）",
        "hint": "署名対象やアルゴリズムは、どんな形式で書きますか？"
      },
      {
        "id": "types",
        "title": "エンベロープ署名は対象の中に署名、エンベローピング署名は署名の中に対象、デタッチ署名は対象と署名が別の要素",
        "hint": "署名と署名対象の位置関係で、どんな種類がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "CMSはS/MIMEなどで使う構文です。XMLデジタル署名の構文ではありません。",
      "エンベローピング署名は「署名の中に対象を含める」形式です。複数の署名を付ける方式ではありません。"
    ]
  },
  {
    "id": "pass-the-hash",
    "name": "Pass the Hash攻撃",
    "reading": "Pass the Hash",
    "category": "攻撃手法",
    "definition": "パスワードのハッシュ値だけで認証が成立する仕組みを悪用し、盗んだハッシュ値を解読せずにそのまま使ってログインする攻撃です。WindowsのNTLM認証などが狙われます。",
    "example": "侵入した端末のメモリから管理者アカウントのハッシュ値を取り出し、そのハッシュ値で別のサーバへ認証して横展開します。",
    "related": [
      "hash",
      "mfa"
    ],
    "criteria": [
      {
        "id": "hash-auth",
        "title": "ハッシュ値だけで認証できる仕組みを悪用する",
        "hint": "どんな認証の仕組みが狙われますか？"
      },
      {
        "id": "no-crack",
        "title": "ハッシュ値を解読せず、そのまま認証に使う",
        "hint": "盗んだハッシュ値から、元のパスワードを割り出す必要はありますか？"
      },
      {
        "id": "lateral",
        "title": "侵入した端末から盗んだ資格情報で、他のサーバへ横展開する",
        "hint": "攻撃者は盗んだハッシュ値を何に使いますか？",
        "level": "deep"
      },
      {
        "id": "mitigation",
        "title": "特権アカウントの利用先を制限し、資格情報の窃取と横展開を抑える",
        "hint": "盗まれた資格情報が他の端末でも使われることを、どう抑えますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "ハッシュ値から平文パスワードを求めて使う攻撃は、Pass the Hashではありません。"
    ]
  },
  {
    "id": "syn-flood",
    "name": "SYNフラッド攻撃",
    "aliases": [
      "SYN/ACK",
      "バックスキャッタ"
    ],
    "reading": "Synchronize flood",
    "category": "攻撃手法",
    "definition": "TCPの接続開始要求（SYN）を大量に送り、サーバに応答待ちの接続を溜めさせて、正規の接続を受け付けられなくするサービス妨害攻撃です。送信元IPアドレスを偽装することが多く、偽の送信元へサーバのSYN/ACKが返ります。",
    "example": "未使用のIPアドレス宛てに、あるWebサーバからのSYN/ACKが大量に届くのが観測された場合、そのWebサーバがSYNフラッド攻撃を受けていると推定します（バックスキャッタ）。",
    "related": [
      "ids-ips"
    ],
    "criteria": [
      {
        "id": "syn",
        "title": "SYNを大量に送り、応答待ち（ハーフオープン）の接続を溜めさせる",
        "hint": "3ウェイハンドシェイクのどの段階を悪用しますか？"
      },
      {
        "id": "dos",
        "title": "サーバの資源を枯渇させ、正規の接続を妨げるサービス妨害攻撃",
        "hint": "攻撃の結果、サーバはどうなりますか？"
      },
      {
        "id": "spoof",
        "title": "送信元IPアドレスを偽装して行われることがあり、偽装先へSYN/ACKが返る",
        "hint": "送信元が偽装されていると、応答はどこへ返りますか？",
        "level": "deep"
      },
      {
        "id": "backscatter",
        "title": "未使用アドレス宛てのSYN/ACK（バックスキャッタ）を観測すると、送信元のサーバが攻撃先だと推定できる",
        "hint": "誰も使っていないアドレスにSYN/ACKが届いたら、何が起きていますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "SYN/ACKを送っているのは攻撃を受けている側です。攻撃元と攻撃先を取り違えないようにしましょう。"
    ]
  },
  {
    "id": "domain-fronting",
    "name": "ドメインフロンティング",
    "reading": "Domain fronting",
    "category": "攻撃手法",
    "definition": "CDNなどで、外から見える接続先（DNSやTLSのSNI）には正規のドメインを示し、暗号化されたHTTPのHostヘッダーで別の宛先を指定して、実際の通信先を隠す手法です。マルウェアのC&C通信の隠蔽に悪用されます。",
    "example": "マルウェアが有名サイトのドメイン名でCDNにHTTPS接続し、Hostヘッダーに攻撃者のサーバを指定して命令を受け取ります。",
    "related": [
      "tls",
      "dns"
    ],
    "criteria": [
      {
        "id": "cdn",
        "title": "CDNなど、同じ基盤で複数のドメインを扱う仕組みを悪用する",
        "hint": "どんなサービスの機能を悪用しますか？"
      },
      {
        "id": "hide",
        "title": "外から見える接続先は正規のドメインにして、実際の通信先を隠す",
        "hint": "通信の監視者には、どの宛先が見えますか？"
      },
      {
        "id": "c2",
        "title": "マルウェアのC&C通信を、フィルタリングを避けて行うのに悪用される",
        "hint": "攻撃者は何の通信を隠したいのですか？",
        "level": "deep"
      },
      {
        "id": "countermeasure",
        "title": "外から見える接続先と実際の転送先の不整合を検査し、不正な中継を制限する",
        "hint": "表向きの接続先と実際の通信先に注目すると、どう対策できますか？",
        "level": "deep"
      },
      {
        "id": "sni-host",
        "title": "TLSのSNIとHTTPのHostヘッダーに、異なるドメインを指定する",
        "hint": "暗号化される前と後で、どの値を使い分けますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "DNSキャッシュサーバに偽の情報を蓄積させるのはDNSキャッシュポイズニングです。ドメインフロンティングとは異なります。"
    ]
  },
  {
    "id": "model-inversion",
    "name": "モデルインバージョン攻撃",
    "aliases": [
      "Model Inversion"
    ],
    "reading": "Model inversion attack",
    "category": "攻撃手法",
    "definition": "AIモデルへの入力と出力を繰り返し観察・解析し、学習に使われた元のデータを推測する攻撃です。学習データに個人情報が含まれると、プライバシーの侵害につながります。",
    "example": "顔認識モデルに入力を少しずつ変えながら問い合わせ、出力の確信度を手掛かりに、学習に使われた人物の顔画像を復元します。",
    "related": [],
    "criteria": [
      {
        "id": "infer",
        "title": "出力結果から、学習に使われた元のデータを推測する",
        "hint": "攻撃者は何を手に入れようとしていますか？"
      },
      {
        "id": "query",
        "title": "入力を調整しながら、出力の取得を繰り返して解析する",
        "hint": "どのような手順で推測しますか？"
      },
      {
        "id": "defense",
        "title": "出力する確信度を丸める、問合せ回数を制限する、差分プライバシーを用いるなどで対策する",
        "hint": "推測の手掛かりを減らすには、どうしますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "出力を観察してモデルそのものを複製するのは、モデル抽出攻撃です。"
    ]
  },
  {
    "id": "biometrics",
    "name": "生体認証",
    "aliases": [
      "虹彩認証"
    ],
    "reading": "Biometric authentication",
    "category": "暗号・認証",
    "definition": "指紋、静脈、虹彩、顔などの身体的特徴や、署名などの行動的特徴を使う本人確認です。忘れたり失くしたりしない一方、情報が漏れても変更できず、本人を拒否したり他人を受け入れたりする誤りが起こり得ます。",
    "example": "入退室管理に静脈認証を使い、本人拒否率と他人受入率のバランスを見てしきい値を調整します。",
    "related": [
      "mfa"
    ],
    "criteria": [
      {
        "id": "feature",
        "title": "身体的特徴や行動的特徴を使って本人を確認する",
        "hint": "何を手掛かりに本人を確認しますか？"
      },
      {
        "id": "errors",
        "title": "本人拒否率（FRR）と他人受入率（FAR）の二つの誤りがあり、しきい値で調整する",
        "hint": "生体認証で起こる誤りには、どんな種類がありますか？",
        "level": "deep"
      },
      {
        "id": "irrevocable",
        "title": "生体情報は漏えいしても変更できない",
        "hint": "パスワードと比べて、漏えいしたときの問題は何ですか？",
        "level": "deep"
      },
      {
        "id": "liveness",
        "title": "偽造した指紋や写真によるなりすましを、生体検知（ライブネス検知）で防ぐ",
        "hint": "作り物の指や写真で認証を突破されないようにするには？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "静電容量方式の指紋センサーは電気的な差を読み取るため、照明の光の影響を受けにくい方式です。"
    ]
  },
  {
    "id": "identity-proofing",
    "name": "身元確認（Identity Proofing）",
    "aliases": [
      "当人認証",
      "本人確認",
      "NIST SP 800-63-3"
    ],
    "reading": "Identity proofing",
    "category": "暗号・認証",
    "definition": "利用者の登録時などに、身分証明書などの証拠で、申請者が主張する実在の人物であることを確かめる手続です。",
    "example": "口座開設の申請時に、本人の顔と写真付きの身分証を照合してから、アカウントを作成します。",
    "related": [
      "mfa",
      "pki"
    ],
    "criteria": [
      {
        "id": "timing",
        "title": "利用者の登録時に行う",
        "hint": "ログインのたびに行うものですか？"
      },
      {
        "id": "evidence",
        "title": "写真付き身分証などの証拠で、申請者が実在の本人であることを確かめる",
        "hint": "何を使って、何を確かめますか？"
      }
    ],
    "commonMistakes": [
      "利用者IDの重複の確認やログイン通知は、身元確認ではありません。"
    ]
  },
  {
    "id": "mitre-attack",
    "name": "MITRE ATT&CK",
    "aliases": [
      "MITRE",
      "ATT&CK"
    ],
    "reading": "MITRE Adversarial Tactics, Techniques, and Common Knowledge",
    "category": "セキュリティ運用",
    "definition": "米国の非営利団体MITREが公開する、実際の攻撃で観測された攻撃者の戦術（Tactics）と技術（Techniques）の知識ベースです。MITREは脆弱性の識別番号CVEの運営も行っています。",
    "example": "SOCが検知した不審な動きをATT&CKの技術に対応付け、どの段階の攻撃をまだ検知できていないかを洗い出します。",
    "related": [
      "psirt",
      "ids-ips"
    ],
    "criteria": [
      {
        "id": "kb",
        "title": "攻撃者の戦術と技術を体系化した知識ベース",
        "hint": "ATT&CKには何がまとめられていますか？"
      },
      {
        "id": "observed",
        "title": "実際の攻撃で観測された事例に基づく",
        "hint": "理論上の攻撃と、観測された攻撃のどちらに基づきますか？"
      },
      {
        "id": "tactics",
        "title": "戦術は攻撃者の目的（初期アクセス、権限昇格、横展開など）、技術はその実現方法",
        "hint": "戦術と技術は、それぞれ何を表しますか？",
        "level": "deep"
      },
      {
        "id": "usage",
        "title": "検知ルールの網羅性の評価や、攻撃を模したレッドチーム演習の計画に使う",
        "hint": "防御側はATT&CKを具体的にどう活用しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "サイバーセキュリティフレームワーク（CSF）を発行しているのはNISTです。MITREではありません。"
    ]
  },
  {
    "id": "psirt",
    "name": "PSIRT",
    "reading": "Product Security Incident Response Team",
    "category": "セキュリティ運用",
    "definition": "自社が提供する製品やサービスの脆弱性に対応する組織です。脆弱性の報告の受付、調査、修正版の提供、利用者への公表を行います。自社の情報システムのインシデントに対応するCSIRTとは対象が異なります。",
    "example": "外部の研究者から自社製ルーターの脆弱性の報告を受け、修正したファームウェアとセキュリティ情報を公開します。",
    "related": [
      "mitre-attack"
    ],
    "criteria": [
      {
        "id": "target",
        "title": "自社が提供する製品・サービスの脆弱性に対応する",
        "hint": "PSIRTが守る対象は何ですか？"
      },
      {
        "id": "flow",
        "title": "脆弱性の報告の受付、調査、修正版の提供、利用者への公表を行う",
        "hint": "脆弱性の報告を受けてから、どんな対応をしますか？"
      },
      {
        "id": "cvd",
        "title": "発見者や調整機関（JPCERT/CCなど）と連携し、修正の準備ができてから公表する調整された脆弱性開示を行う",
        "hint": "脆弱性の情報は、いつ、誰と調整して公表しますか？",
        "level": "deep"
      },
      {
        "id": "sbom",
        "title": "SBOMで製品に含まれる部品を把握し、部品の脆弱性の影響を素早く判断する",
        "hint": "製品に使ったOSSに脆弱性が見つかったとき、影響範囲をどう調べますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "自社の業務システムが攻撃を受けたときの対応はCSIRTの役割です。"
    ]
  },
  {
    "id": "ueba",
    "name": "UEBA",
    "aliases": [
      "内部不正"
    ],
    "reading": "User and Entity Behavior Analytics",
    "category": "セキュリティ運用",
    "definition": "ログなどから利用者や端末・サーバの通常の振る舞いを学習し、そこから外れた異常な振る舞いを検知する技術です。内部不正や、窃取されたアカウントの悪用の発見に役立ちます。",
    "example": "普段は日中に少量のファイルしか扱わない社員のアカウントが、深夜に大量のファイルをダウンロードしたことを検知して警告します。",
    "related": [
      "ids-ips",
      "zero-trust"
    ],
    "criteria": [
      {
        "id": "baseline",
        "title": "利用者や機器の通常の振る舞いを学習する",
        "hint": "何を基準に異常を判断しますか？"
      },
      {
        "id": "anomaly",
        "title": "通常から外れた異常な振る舞いを検知する",
        "hint": "UEBAは何を見つけますか？"
      },
      {
        "id": "entity",
        "title": "利用者だけでなく、端末やサーバなどのエンティティも対象にする",
        "hint": "UEBAのEは何を表しますか？"
      },
      {
        "id": "insider",
        "title": "シグネチャでは見つけにくい内部不正や、正規の資格情報の悪用の発見に向く",
        "hint": "パターン照合では見つけにくい脅威は何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "生体認証やアクセス制御そのものはUEBAの機能ではありません。"
    ]
  },
  {
    "id": "cspm",
    "name": "CSPM",
    "aliases": [
      "設定ミス"
    ],
    "reading": "Cloud Security Posture Management",
    "category": "クラウドセキュリティ",
    "definition": "クラウドサービスの設定を継続的に監視し、基準やベストプラクティスと照合して、不適切な設定を検知する仕組みです。設定ミスによる情報漏えいを防ぎます。",
    "example": "誰でも閲覧できる公開設定になったストレージや、過大な権限を持つアカウントを自動で検出し、管理者に通知します。",
    "related": [
      "least-privilege",
      "zero-trust"
    ],
    "criteria": [
      {
        "id": "config",
        "title": "クラウドサービスの設定を継続的に監視する",
        "hint": "CSPMは何を監視しますか？"
      },
      {
        "id": "detect",
        "title": "基準と照合して、不適切な設定（設定ミス）を検知する",
        "hint": "監視して何を見つけますか？"
      },
      {
        "id": "remediation",
        "title": "検知した設定ミスの自動修正や、IaCのテンプレートの事前検査で再発を防ぐ",
        "hint": "見つけた設定ミスを繰り返さないためには、どうしますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "マルウェア感染の検知や不正アクセスの遮断は、CSPMの中心的な機能ではありません。"
    ]
  },
  {
    "id": "ieee8021x",
    "name": "IEEE 802.1X",
    "aliases": [
      "認証VLAN"
    ],
    "reading": "Port-Based Network Access Control",
    "category": "ネットワークセキュリティ",
    "definition": "有線・無線LANで、接続しようとする機器を認証してからネットワークの利用を許可するポート単位のアクセス制御の規格です。端末（サプリカント）、アクセスポイントやスイッチ（オーセンティケータ）、認証サーバがEAPでやり取りします。",
    "example": "社内の無線LANで、端末がEAP-TLSのクライアント証明書を提示し、RADIUSサーバが認証に成功した端末だけを接続させます。",
    "related": [
      "pki",
      "mfa"
    ],
    "criteria": [
      {
        "id": "authn",
        "title": "接続する機器を認証してから、ネットワークの利用を許可する",
        "hint": "認証の前後で、通信はどう扱われますか？"
      },
      {
        "id": "eap",
        "title": "EAPを使って認証する枠組み",
        "hint": "認証のやり取りに使うプロトコルは何ですか？",
        "level": "deep"
      },
      {
        "id": "roles",
        "title": "サプリカント（端末）、オーセンティケータ（アクセスポイントなど）、認証サーバ（RADIUSなど）の三者で構成する",
        "hint": "登場する三つの役割は何ですか？",
        "level": "deep"
      },
      {
        "id": "methods",
        "title": "EAP-TLSはクライアント証明書、PEAPはID・パスワードで認証する",
        "hint": "EAPの方式によって、何で認証するかがどう違いますか？",
        "level": "deep"
      },
      {
        "id": "wpa-enterprise",
        "title": "WPA3／WPA2エンタープライズで使われ、利用者ごとに異なる暗号鍵を配布できる",
        "hint": "共通のパスフレーズを使う方式と比べた利点は何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "WPSは接続設定を簡単にする仕様で、IEEE 802.1Xではありません。",
      "CSMA/CDは有線イーサネットの方式です。無線LANはCSMA/CAを使います。"
    ]
  },
  {
    "id": "wal",
    "name": "ログ先行書込み（WAL）",
    "aliases": [
      "ログバッファ",
      "ログファイル"
    ],
    "reading": "Write-Ahead Logging",
    "category": "データベース",
    "definition": "データベース本体を更新する前に、更新内容をログへ書き込む方式です。コミット情報が不揮発のログファイルに書き込まれた時点でコミット完了とし、障害時にはログから回復します。",
    "example": "コミット直後にDBMSが停止しても、ログファイルに残った更新情報を使って、再起動時にロールフォワードで反映します。",
    "related": [
      "acid"
    ],
    "criteria": [
      {
        "id": "order",
        "title": "データベース本体より先に、更新内容をログに書き込む",
        "hint": "ログとデータベース本体は、どちらを先に書きますか？"
      },
      {
        "id": "commit",
        "title": "コミット情報がログファイルに書き込まれた時点でコミット完了とする",
        "hint": "コミット処理はどの時点で完了しますか？",
        "level": "deep"
      },
      {
        "id": "durability",
        "title": "障害が起きても、ログからコミット済みの更新を回復でき、永続性を保証する",
        "hint": "ACID特性のどの性質を支えますか？",
        "level": "deep"
      },
      {
        "id": "buffer",
        "title": "主記憶上のログバッファへの書込みだけでは、障害で失われるため不十分",
        "hint": "ログバッファに書いた時点でコミット完了にしないのはなぜですか？",
        "level": "deep"
      },
      {
        "id": "recovery",
        "title": "チェックポイント以降のログを使い、コミット済みはロールフォワード、未コミットはロールバックする",
        "hint": "障害からの回復で、ログをどう使い分けますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "チェックポイント処理の完了は、コミット完了の条件ではありません。"
    ]
  },
  {
    "id": "ospf",
    "name": "OSPF",
    "aliases": [
      "リンクステート型"
    ],
    "reading": "Open Shortest Path First",
    "category": "ネットワーク",
    "definition": "リンクステート型のルーティングプロトコルです。各ルータがネットワーク全体のリンク状態のデータベースを持ち、コストを基に最短経路を計算します。変化があったときに更新を送るため、収束が速くなります。",
    "example": "回線の帯域からコストを決め、障害で回線が切れると、リンク状態の変化を受けて各ルータが迂回経路を計算し直します。",
    "related": [],
    "criteria": [
      {
        "id": "link-state",
        "title": "リンクステート型で、リンク状態のデータベースを使う",
        "hint": "OSPFのルータは、どんな情報を持って経路を決めますか？"
      },
      {
        "id": "cost",
        "title": "コストを基に最短経路を計算する（ダイクストラ法）",
        "hint": "経路を選ぶ基準は何ですか？"
      },
      {
        "id": "area",
        "title": "エリアに分割して、リンク状態の情報の量と再計算の範囲を抑える",
        "hint": "大きなネットワークで、データベースが大きくなりすぎないようにするには？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "30秒ごとの定期更新はRIPの特徴です。"
    ]
  },
  {
    "id": "risk-approach",
    "name": "リスク・アプローチ（システム監査）",
    "aliases": [
      "固有リスク",
      "統制リスク",
      "発見リスク"
    ],
    "reading": "Risk-based audit approach",
    "category": "システム監査",
    "definition": "リスクの大きさを評価し、重要なリスクのある監査対象に監査資源を重点的に配分して、監査リスクを合理的に低い水準に抑える監査の考え方です。環境の変化でリスクが変われば、監査計画を見直します。",
    "example": "個人情報を大量に扱う新システムの監査に多くの工数を割き、変更のない安定したシステムは手続を絞ります。",
    "related": [],
    "criteria": [
      {
        "id": "focus",
        "title": "リスクの高い対象に監査資源を重点的に配分する",
        "hint": "監査資源は全ての対象に均等に配りますか？"
      },
      {
        "id": "review",
        "title": "環境の変化でリスクが相当程度変われば、監査計画を見直す",
        "hint": "計画を立てた後にリスクが変わったら、どうしますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "監査対象に係るリスクは、固有リスクと統制リスクです。残存リスクではありません。"
    ]
  },
  {
    "id": "mm1-queue",
    "name": "M/M/1待ち行列",
    "aliases": [
      "M/M/1",
      "待ち行列",
      "平均待ち時間",
      "サービス時間",
      "利用率"
    ],
    "reading": "M/M/1 queue",
    "category": "基礎理論",
    "definition": "到着がポアソン過程、サービス時間が指数分布に従い、窓口が一つである待ち行列モデルです。到着率と処理時間から利用率や平均待ち時間を見積もります。",
    "example": "平均サービス時間Tsの窓口で利用率が0.5なら、平均待ち時間は0.5÷(1−0.5)×Ts＝Tsです。",
    "related": [],
    "criteria": [
      {
        "id": "model",
        "title": "ポアソン到着・指数分布のサービス時間・窓口1つのモデル",
        "hint": "M、M、1はそれぞれ何を表しますか？"
      },
      {
        "id": "utilization",
        "title": "利用率ρは到着率×平均サービス時間（窓口が使われている割合）",
        "hint": "利用率はどのように求めますか？",
        "level": "deep"
      },
      {
        "id": "formula",
        "title": "平均待ち時間はρ／(1−ρ)×平均サービス時間",
        "hint": "平均待ち時間を利用率とサービス時間で表すとどうなりますか？",
        "level": "deep"
      },
      {
        "id": "nonlinear",
        "title": "利用率が1に近づくと待ち時間は急激に増える",
        "hint": "利用率が0.5から0.9に上がると、待ち時間はどう変わりますか？",
        "level": "deep"
      },
      {
        "id": "merge",
        "title": "窓口を統合して到着が2倍になると利用率も2倍になり、式のρを置き換えて考える",
        "hint": "二つの窓口を1台にまとめたとき、利用率はどうなりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "平均待ち時間に平均サービス時間を含めるかどうかを、問題文で確認せずに計算してしまいがちです。",
      "窓口を統合したときに、分子だけ又は分母だけの利用率を置き換える誤りが選択肢になります。"
    ]
  },
  {
    "id": "availability",
    "name": "稼働率",
    "reading": "Availability",
    "category": "システム構成",
    "definition": "システムや機器が利用可能な状態にある割合です。修理可能な機器の定常的な稼働率は、MTBF÷（MTBF＋MTTR）で求めます。",
    "example": "MTBFが990時間、MTTRが10時間なら、稼働率は990÷1,000＝0.99です。",
    "related": [],
    "criteria": [
      {
        "id": "formula",
        "title": "稼働率＝MTBF÷(MTBF＋MTTR)",
        "hint": "MTBFとMTTRを使うと、稼働率はどう表せますか？"
      },
      {
        "id": "series-parallel",
        "title": "直列は稼働率の積、並列は1−(1−稼働率)の積で求める",
        "hint": "装置を直列・並列につないだとき、全体の稼働率はどう計算しますか？",
        "level": "deep"
      },
      {
        "id": "ratio",
        "title": "稼働率はMTTR／MTBFの比だけで決まり、MTBFやMTTR個々の値は決まらない",
        "hint": "稼働率が同じ二つのシステムは、MTBFも同じといえますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "稼働率が等しければMTBFとMTTRもそれぞれ等しい、と考える誤りが選択肢になります。",
      "並列構成の稼働率を、単純に稼働率の和で求めてしまう誤りがあります。"
    ]
  },
  {
    "id": "normalization",
    "name": "正規化",
    "aliases": [
      "第3正規形",
      "第2正規形"
    ],
    "reading": "Normalization",
    "category": "データベース",
    "definition": "関係データベースの表を、関数従属性などに基づいて整理することです。データの重複と、更新・挿入・削除に伴う不整合を減らします。",
    "example": "受注表に顧客名を持たせると、顧客名を変えるときに全ての受注行を直す必要があります。顧客表に分けると1行の更新で済みます。",
    "related": [],
    "criteria": [
      {
        "id": "purpose",
        "title": "データの重複をなくし、更新時異状を防ぐ",
        "hint": "正規化しないと、データを更新するときに何が起きますか？"
      },
      {
        "id": "1nf",
        "title": "第1正規形は繰返し項目をなくし、各属性を単一の値にする",
        "hint": "一つの属性に複数の値が入っているとき、どうしますか？",
        "level": "deep"
      },
      {
        "id": "2nf",
        "title": "第2正規形は候補キーの一部への従属（部分関数従属）を取り除く",
        "hint": "複合キーの一部だけで決まる属性があるとき、どうしますか？",
        "level": "deep"
      },
      {
        "id": "3nf",
        "title": "第3正規形は非キー属性間の従属（推移的関数従属）を取り除く",
        "hint": "キー以外の属性で決まる属性があるとき、どうしますか？",
        "level": "deep"
      },
      {
        "id": "denormalize",
        "title": "検索性能のために、あえて非正規化することがある",
        "hint": "結合が多すぎて遅いとき、どのような判断がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "部分関数従属の除去（第2正規化）と、推移的関数従属の除去（第3正規化）を取り違えやすいです。"
    ]
  },
  {
    "id": "deadlock",
    "name": "デッドロック",
    "aliases": [
      "プロセス",
      "資源"
    ],
    "reading": "Deadlock",
    "category": "ソフトウェア",
    "definition": "複数のプロセスが互いに相手の占有する資源の解放を待ち、どちらも処理を進められなくなる状態です。",
    "example": "プロセスAが資源Xを持ってYを待ち、プロセスBがYを持ってXを待つと、両方とも止まってしまいます。",
    "related": [],
    "criteria": [
      {
        "id": "mutual-wait",
        "title": "互いに相手の資源を待って処理が進まなくなる",
        "hint": "どのような待ち合いが起きていますか？"
      },
      {
        "id": "order",
        "title": "資源を占有する順序がプロセスごとに異なると起こり得る",
        "hint": "どんなときに互いの資源を待つ状況が生まれますか？",
        "level": "deep"
      },
      {
        "id": "prevent",
        "title": "全プロセスで資源の確保順序をそろえると防げる",
        "hint": "デッドロックを防ぐ簡単な決まりは何ですか？",
        "level": "deep"
      },
      {
        "id": "conditions",
        "title": "相互排他・保持と待ち・横取り不可・循環待ちの4条件がそろうと発生する",
        "hint": "デッドロックが起きるための条件は何ですか？",
        "level": "deep"
      },
      {
        "id": "detect",
        "title": "待ちグラフで循環を検出し、一方を中断して資源を解放する回復方法がある",
        "hint": "起きてしまったデッドロックは、どう見つけて解消しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "同じ順序で資源を占有するプロセスどうしでも、デッドロックが起きると考えてしまう誤りがあります。"
    ]
  },
  {
    "id": "hamming-code",
    "name": "ハミング符号",
    "aliases": [
      "誤り訂正",
      "符号語",
      "情報ビット"
    ],
    "reading": "Hamming code",
    "category": "基礎理論",
    "definition": "情報ビットに複数の検査ビットを付け、1ビットの誤りの位置を特定して訂正できる誤り訂正符号です。",
    "example": "4ビットの情報に3ビットの検査ビットを付けた7ビットの符号では、検査結果を2進数として読むと誤りのビット位置が分かります。",
    "related": [],
    "criteria": [
      {
        "id": "correct",
        "title": "検査ビットを用いて1ビットの誤りを訂正できる符号",
        "hint": "どの程度の誤りを訂正する符号ですか？"
      },
      {
        "id": "check-bits",
        "title": "情報ビットに複数の検査ビットを加える",
        "hint": "誤りの位置を知るために、何を付け加えますか？"
      },
      {
        "id": "syndrome",
        "title": "検査結果の組合せから誤りのビット位置を求める",
        "hint": "誤りの位置は、どのように特定しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "2ビットの誤りまで訂正できると考える誤りが選択肢になります。"
    ]
  },
  {
    "id": "fault-tolerance",
    "name": "フォールトトレランス",
    "reading": "Fault tolerance",
    "category": "システム構成",
    "definition": "一部の機器などが故障しても、必要な機能を維持できるようにする設計の考え方です。冗長化などを用いて実現します。",
    "example": "サーバを二重化しておき、一方が故障しても他方で処理を続けます。",
    "related": [
      "availability",
      "fault-avoidance"
    ],
    "criteria": [
      {
        "id": "continue",
        "title": "故障が起きても機能を維持する",
        "hint": "故障が起きた後、システムはどうなりますか？"
      },
      {
        "id": "redundancy",
        "title": "冗長化（多重化）によって実現する",
        "hint": "どのような仕組みで機能を保ちますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "安全な状態に固定するのはフェールセーフです。フォールトトレランスの説明と入れ替えた選択肢がよく出ます。",
      "フェールソフトは機能を縮退させてでも動き続ける考え方です。「縮退させずに」とするのは誤りです。"
    ]
  },
  {
    "id": "overfitting",
    "name": "過学習",
    "aliases": [
      "汎化性能",
      "正則化",
      "データ拡張"
    ],
    "reading": "Overfitting",
    "category": "AI・機械学習",
    "definition": "機械学習のモデルが訓練データに過剰に適合し、未知のデータに対する予測精度（汎化性能）が下がる状態です。",
    "example": "訓練データでは正答率99％なのに、テストデータでは70％しか当たらないモデルは過学習が疑われます。",
    "related": [],
    "criteria": [
      {
        "id": "definition",
        "title": "訓練データには高い精度だが、未知のデータでは精度が低い",
        "hint": "訓練データとテストデータで、精度はどう違いますか？"
      },
      {
        "id": "remedy",
        "title": "学習データの追加やモデルの複雑さの抑制などで汎化性能を改善する",
        "hint": "訓練データだけに合いすぎることを、どう抑えますか？",
        "level": "deep"
      },
      {
        "id": "cross-validation",
        "title": "交差検証で汎化性能を評価し、過学習を見つける",
        "hint": "汎化性能を評価する方法は何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "モデルを複雑にする、汎化性能を下げる、といった逆向きの対策が選択肢になります。",
      "訓練データをテストに使うと、過学習を見逃します。"
    ]
  },
  {
    "id": "sbom",
    "name": "SBOM",
    "aliases": [
      "コンポーネント"
    ],
    "reading": "Software Bill of Materials",
    "category": "セキュリティ運用",
    "definition": "ソフトウェアを構成するコンポーネント（OSSなど）とそのバージョン、ライセンス、依存関係を一覧にした部品表です。脆弱性管理やライセンス管理に使います。",
    "example": "あるライブラリの脆弱性が公表されたとき、SBOMを検索して、そのライブラリを含む自社製品をすぐに特定します。",
    "related": [
      "psirt"
    ],
    "criteria": [
      {
        "id": "list",
        "title": "ソフトウェアの構成部品の一覧",
        "hint": "SBOMには何が記載されていますか？"
      },
      {
        "id": "vuln",
        "title": "脆弱性が公表された部品を含む製品を素早く特定できる",
        "hint": "脆弱性管理にどう役立ちますか？",
        "level": "deep"
      },
      {
        "id": "license",
        "title": "OSSのライセンス管理にも使える",
        "hint": "脆弱性以外に、どのような管理に使えますか？",
        "level": "deep"
      },
      {
        "id": "supply-chain",
        "title": "ソフトウェアサプライチェーンの透明性を高め、供給元から利用者まで情報を共有する",
        "hint": "なぜ供給元と利用者がSBOMを共有するのですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "ソースコードのバージョン管理や改ざん防止の仕組みと混同した選択肢が出ます。SBOMは部品の一覧です。"
    ]
  },
  {
    "id": "os-command-injection",
    "name": "OSコマンドインジェクション",
    "aliases": [
      "シェル"
    ],
    "reading": "Operating system command injection",
    "category": "Webセキュリティ",
    "definition": "Webアプリケーションに入力した値にOSのコマンドを紛れ込ませ、サーバ上でシェル経由で実行させる攻撃です。",
    "example": "ファイル名の入力欄に「a.txt; rm -rf /」のような文字列を入れ、アプリケーションがそれをシェルに渡すとコマンドが実行されてしまいます。",
    "related": [
      "sql-injection"
    ],
    "criteria": [
      {
        "id": "attack",
        "title": "入力値に紛れ込ませたOSコマンドを実行させる",
        "hint": "攻撃者は何を実行させようとしますか？"
      },
      {
        "id": "shell",
        "title": "アプリケーションが入力をシェルに渡すことが原因",
        "hint": "どのような実装で、この攻撃が成立しますか？"
      },
      {
        "id": "avoid-shell",
        "title": "シェルを起動する関数を使わない実装が根本的な対策",
        "hint": "最も根本的な対策は何ですか？",
        "level": "deep"
      },
      {
        "id": "escape",
        "title": "やむを得ずシェルを使う場合は、入力値の許可リスト検査やエスケープを行う",
        "hint": "シェルを使わざるを得ないときはどうしますか？",
        "level": "deep"
      },
      {
        "id": "least-priv",
        "title": "アプリケーションの実行権限を最小にして被害を抑える",
        "hint": "攻撃が成功した場合の被害を小さくするには？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "プレースホルダ（SQLインジェクション対策）やディレクトリ名のチェック（ディレクトリトラバーサル対策）と取り違えた選択肢が出ます。"
    ]
  },
  {
    "id": "ipsec",
    "name": "IPsec",
    "reading": "Internet Protocol Security",
    "category": "ネットワークセキュリティ",
    "definition": "ネットワーク層でIPパケットの暗号化や認証を行うプロトコル群です。上位のアプリケーションを変えずに通信を保護でき、VPNで使われます。",
    "example": "拠点間をインターネットで結ぶとき、ルータどうしでIPsecのトンネルを張って通信を暗号化します。",
    "related": [
      "tls"
    ],
    "criteria": [
      {
        "id": "layer",
        "title": "ネットワーク層で動作する",
        "hint": "OSI基本参照モデルのどの層で暗号化しますか？"
      },
      {
        "id": "protect",
        "title": "IPパケットの暗号化と認証（改ざん検知）を行う",
        "hint": "IPsecで何を守れますか？"
      },
      {
        "id": "vpn",
        "title": "VPNの構築に使われる",
        "hint": "代表的な用途は何ですか？",
        "level": "deep"
      },
      {
        "id": "mode",
        "title": "ペイロードだけを守るトランスポートモードと、元のパケット全体を包むトンネルモードがある",
        "hint": "二つの動作モードの違いは何ですか？",
        "level": "deep"
      },
      {
        "id": "esp-ah",
        "title": "暗号化と認証を行うESP、認証だけを行うAH、鍵交換のIKEで構成される",
        "hint": "IPsecを構成するプロトコルには何がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "TLSと位置関係を取り違える選択肢が出ます。IPsecはTLSより下位のネットワーク層です。",
      "L2TPはデータリンク層のトンネリングで、暗号化はIPsecと組み合わせて行います。"
    ]
  },
  {
    "id": "cve",
    "name": "CVE",
    "aliases": [
      "JVN",
      "CCE"
    ],
    "reading": "Common Vulnerabilities and Exposures",
    "category": "セキュリティ運用",
    "definition": "製品に含まれる個々の脆弱性に付けられる共通の識別子です。「CVE-年-番号」の形式で、異なる情報源でも同じ脆弱性を指していると分かります。",
    "example": "JVNの脆弱性情報やベンダーのセキュリティ情報に同じCVE番号が載っていれば、同じ脆弱性の情報だと判断できます。",
    "related": [
      "psirt"
    ],
    "criteria": [
      {
        "id": "identifier",
        "title": "個々の脆弱性を識別するための識別子",
        "hint": "CVEは何に付けられる番号ですか？"
      },
      {
        "id": "common",
        "title": "異なる情報源で同じ脆弱性を共通に参照できる",
        "hint": "共通の識別子があると、何が便利ですか？"
      },
      {
        "id": "format",
        "title": "CVE-年-番号の形式で表す",
        "hint": "CVE識別子はどのような形式ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "セキュリティ設定項目の識別子（CCE）や製品の種別と取り違えた選択肢が出ます。"
    ]
  },
  {
    "id": "dns-cache-poisoning",
    "name": "DNSキャッシュポイズニング",
    "reading": "Domain Name System cache poisoning",
    "category": "攻撃手法",
    "definition": "キャッシュDNSサーバに偽の応答を受け入れさせ、誤った名前解決の情報をキャッシュさせる攻撃です。利用者を偽のサーバに誘導できます。",
    "example": "攻撃者が正規の応答より先に、銀行のドメイン名に対して攻撃者のIPアドレスを返す偽の応答を送り込みます。",
    "related": [
      "dns"
    ],
    "criteria": [
      {
        "id": "fake",
        "title": "偽の応答をキャッシュDNSサーバにキャッシュさせる",
        "hint": "攻撃者はキャッシュDNSサーバに何をさせますか？"
      },
      {
        "id": "redirect",
        "title": "利用者を偽のサーバに誘導できる",
        "hint": "攻撃が成功すると、利用者はどうなりますか？",
        "level": "deep"
      },
      {
        "id": "random",
        "title": "問合せのIDと送信元ポート番号をランダムにして推測を難しくする",
        "hint": "偽の応答を受け入れにくくするには、何をランダムにしますか？",
        "level": "deep"
      },
      {
        "id": "dnssec",
        "title": "DNSSECで応答に署名し、正当性を検証する",
        "hint": "応答が正しいことを暗号で確かめる仕組みは何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "送信元ポート番号を53番に固定するのは逆効果です。推測しやすくなります。"
    ]
  },
  {
    "id": "rainbow-table",
    "name": "レインボーテーブル攻撃",
    "aliases": [
      "レインボーテーブル"
    ],
    "reading": "Rainbow table attack",
    "category": "攻撃手法",
    "definition": "平文とハッシュ値の対応をチェーンにして圧縮した表を事前に作っておき、盗んだハッシュ値から元のパスワードを効率よく求める攻撃です。",
    "example": "漏えいしたパスワードのハッシュ値を、事前に作ったレインボーテーブルで照合し、元のパスワードを割り出します。",
    "related": [
      "salt",
      "hash"
    ],
    "criteria": [
      {
        "id": "precompute",
        "title": "ハッシュ値と平文の対応表を事前に計算しておく",
        "hint": "攻撃の前に何を準備しますか？"
      },
      {
        "id": "reverse",
        "title": "盗んだハッシュ値から元のパスワードを求める",
        "hint": "攻撃者は何から何を求めますか？"
      },
      {
        "id": "salt",
        "title": "ソルトを付けてハッシュ化すると、事前計算の表が使えなくなる",
        "hint": "この攻撃を防ぐ対策は何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "総当たりでログインを試すブルートフォース攻撃や、使い回しを狙うパスワードリスト攻撃と区別します。"
    ]
  },
  {
    "id": "dmarc",
    "name": "DMARC",
    "aliases": [
      "送信ドメイン認証"
    ],
    "reading": "Domain-based Message Authentication, Reporting and Conformance",
    "category": "メールセキュリティ",
    "definition": "SPFやDKIMの認証結果を基に、認証に失敗したメールの扱い（そのまま・隔離・拒否）を送信ドメイン側がDNSで宣言し、結果の報告を受け取る仕組みです。",
    "example": "自社ドメインのDMARCポリシーをrejectにしておくと、なりすましメールを受信側で拒否してもらえます。",
    "related": [
      "spf",
      "dkim"
    ],
    "criteria": [
      {
        "id": "policy",
        "title": "認証失敗時の扱いをポリシーとしてDNSに登録する",
        "hint": "送信ドメイン側は何を公開しますか？"
      },
      {
        "id": "based-on",
        "title": "SPFやDKIMの認証結果を利用する",
        "hint": "DMARCは、どの認証技術の結果を使いますか？"
      },
      {
        "id": "alignment",
        "title": "ヘッダーFromのドメインとSPF・DKIMで認証されたドメインの一致（アライメント）を確認する",
        "hint": "SPFやDKIMだけでは防げない点を、DMARCはどう補いますか？"
      },
      {
        "id": "report",
        "title": "受信側から認証結果のレポートを受け取り、なりすましを監視できる",
        "hint": "送信ドメイン側は何を受け取れますか？",
        "level": "deep"
      },
      {
        "id": "staged",
        "title": "none→quarantine→rejectと段階的にポリシーを強める運用",
        "hint": "いきなりrejectにしないのはなぜですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "IPアドレスを照合するSPF、署名を検証するDKIMの説明と取り違えた選択肢が出ます。"
    ]
  },
  {
    "id": "submission-port",
    "name": "サブミッションポート",
    "aliases": [
      "POP before SMTP"
    ],
    "reading": "Submission port",
    "category": "メールセキュリティ",
    "definition": "メールクライアントからメールサーバへの送信に使うポート587番です。SMTP-AUTHで送信者を認証してからメールを受け付けます。",
    "example": "OP25Bでポート25の外向き通信が止められていても、利用者はポート587にSMTP-AUTHで接続してメールを送れます。",
    "related": [
      "spf"
    ],
    "criteria": [
      {
        "id": "port",
        "title": "ポート番号587を使う",
        "hint": "サブミッションポートは何番ですか？"
      },
      {
        "id": "auth",
        "title": "SMTP-AUTHで送信者を認証する",
        "hint": "このポートでは、送信の前に何を行いますか？"
      },
      {
        "id": "op25b",
        "title": "OP25Bと組み合わせ、正規の利用者の送信経路を確保する",
        "hint": "ポート25の外向き通信を止める対策と、どう組み合わせますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "SPFレコードの問合せやDKIMの署名検証と取り違えた選択肢が出ます。サブミッションポートは送信者認証のためのものです。"
    ]
  },
  {
    "id": "deepfake",
    "name": "ディープフェイク",
    "reading": "Deepfake",
    "category": "攻撃手法",
    "definition": "深層学習などのAI技術で、実在の人物の映像や音声を本物と見分けにくいように合成・加工する技術、又はその生成物です。なりすましや詐欺に悪用されます。",
    "example": "AIで合成した経営者の声で経理担当者に電話をかけ、送金を指示する詐欺が報告されています。",
    "related": [
      "biometrics"
    ],
    "criteria": [
      {
        "id": "ai",
        "title": "AI（深層学習）で映像や音声を合成・加工する",
        "hint": "どのような技術で作られますか？"
      },
      {
        "id": "realistic",
        "title": "本物と見分けにくい偽の人物像や音声を作る",
        "hint": "生成物にはどのような特徴がありますか？"
      },
      {
        "id": "abuse",
        "title": "なりすましによる詐欺や偽情報の拡散に悪用される",
        "hint": "どのような攻撃に使われますか？",
        "level": "deep"
      },
      {
        "id": "verify",
        "title": "別経路での本人確認（コールバックなど）や、送金手続の多重承認で被害を防ぐ",
        "hint": "声や映像だけで判断しないために、どんな手続が有効ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "名前の似たディープウェブ（検索エンジンで見つからない領域）と混同しやすいです。"
    ]
  },
  {
    "id": "botnet",
    "name": "ボットネット",
    "reading": "Botnet",
    "category": "攻撃手法",
    "definition": "マルウェア（ボット）に感染した多数の端末が、攻撃者のC&Cサーバからの指令で一斉に動くネットワークです。DDoS攻撃やスパム送信、情報窃取に使われます。",
    "example": "感染した数万台のIoT機器が、C&Cサーバの指示で特定のWebサイトに大量のリクエストを送ります。",
    "related": [
      "syn-flood"
    ],
    "criteria": [
      {
        "id": "infected",
        "title": "ボットに感染した多数の端末で構成される",
        "hint": "ボットネットは何から構成されますか？"
      },
      {
        "id": "c2",
        "title": "C&Cサーバが感染端末に指令を出す",
        "hint": "感染した端末は、誰の指示で動きますか？"
      },
      {
        "id": "use",
        "title": "DDoS攻撃・スパム送信・情報窃取などに使われる",
        "hint": "ボットネットは何に使われますか？",
        "level": "deep"
      },
      {
        "id": "detect",
        "title": "C&Cサーバへの通信（定期的な外向き通信）を検知・遮断して対策する",
        "hint": "感染端末を見つけるには、どんな通信に注目しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "C&Cサーバは攻撃を遮断する側ではなく、攻撃を指示する側です。"
    ]
  },
  {
    "id": "digital-forensics",
    "name": "デジタルフォレンジックス",
    "reading": "Digital forensics",
    "category": "セキュリティ運用",
    "definition": "インシデントや犯罪の後に、コンピュータなどに残る電子的な証拠を収集・検査・分析し、法的にも通用する形で報告する手法です。",
    "example": "不正アクセスを受けたサーバのディスクを複製して解析し、削除されたログを復元して侵入経路を明らかにします。",
    "related": [
      "mitre-attack"
    ],
    "criteria": [
      {
        "id": "evidence",
        "title": "電子的な証拠を収集・分析して事実を明らかにする",
        "hint": "フォレンジックスで扱う対象は何ですか？"
      },
      {
        "id": "integrity",
        "title": "証拠の完全性を保つため、複製を取りハッシュ値で同一性を示す",
        "hint": "証拠が改変されていないことは、どう示しますか？",
        "level": "deep"
      },
      {
        "id": "chain-custody",
        "title": "誰がいつ証拠を扱ったかを記録する証拠保全の手続（Chain of Custody）",
        "hint": "法廷で証拠として通用させるために、何を記録しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "SIEMによるリアルタイムの相関分析や、マルウェアの検知と取り違えた選択肢が出ます。"
    ]
  },
  {
    "id": "evm",
    "name": "EVM",
    "aliases": [
      "アーンド・バリュー・マネジメント",
      "Earned Value Management"
    ],
    "reading": "Earned Value Management",
    "category": "プロジェクト管理",
    "definition": "計画価値（PV）、出来高（EV）、実コスト（AC）を同じ金額の尺度で比べ、プロジェクトのコストとスケジュールの状況を評価する手法です。",
    "example": "PV 100、EV 80、AC 90なら、EV＜PVで進捗が遅れ、AC＞EVでコストが超過しています。",
    "related": [
      "evm-pv",
      "evm-ev",
      "evm-ac",
      "evm-cpi",
      "evm-spi",
      "evm-tcpi",
      "evm-bac"
    ],
    "criteria": [
      {
        "id": "three",
        "title": "PV（計画価値）・EV（出来高）・AC（実コスト）を使う",
        "hint": "EVMで使う三つの値は何ですか？"
      },
      {
        "id": "cost",
        "title": "コストはEVとACで評価する（CPI＝EV÷AC）",
        "hint": "コストの効率は、どの値を比べますか？",
        "level": "deep"
      },
      {
        "id": "schedule",
        "title": "スケジュールはEVとPVで評価する（SPI＝EV÷PV）",
        "hint": "進捗の効率は、どの値を比べますか？",
        "level": "deep"
      },
      {
        "id": "index",
        "title": "CPI・SPIは1より大きいほど良く、1未満ならコスト超過・遅延",
        "hint": "CPIが0.9なら、どのような状態ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "コストの評価にPVを使ったり、CPIとSPIの意味を逆に読んだりする誤りが選択肢になります。"
    ]
  },
  {
    "id": "evm-pv",
    "name": "PV（計画価値）",
    "aliases": [
      "PV",
      "計画価値"
    ],
    "reading": "Planned Value",
    "category": "プロジェクト管理",
    "definition": "ある時点までに完了する予定の作業に割り当てた予算額です。実際の支出ではなく、計画上の作業量を金額で表します。",
    "example": "総予算200万円の作業を半分まで終える計画なら、その時点のPVは100万円です。",
    "related": [
      "evm",
      "evm-ev"
    ],
    "criteria": [
      {
        "id": "planned-budget",
        "title": "その時点までに完了予定の作業に割り当てた予算額",
        "hint": "どの時点の、予定と実績のどちらの作業を金額で表しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "evm-ev",
    "name": "EV（出来高）",
    "aliases": [
      "EV",
      "出来高"
    ],
    "reading": "Earned Value",
    "category": "プロジェクト管理",
    "definition": "実際に完了した作業を、その作業に割り当てた予算額で評価した値です。実際に支払った金額とは区別します。",
    "example": "総予算200万円の作業が40％完了していれば、EVは80万円です。",
    "related": [
      "evm",
      "evm-pv",
      "evm-ac"
    ],
    "criteria": [
      {
        "id": "completed-budget",
        "title": "実際に完了した作業を予算額で評価した値",
        "hint": "完了した作業量を、どの金額に基づいて評価しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "evm-ac",
    "name": "AC（実コスト）",
    "aliases": [
      "AC",
      "実コスト"
    ],
    "reading": "Actual Cost",
    "category": "プロジェクト管理",
    "definition": "ある時点までに実施した作業のために、実際に発生した費用です。計画上の予算や、完了した作業の予算額とは区別します。",
    "example": "完了した作業の予算額が80万円でも、実際に90万円かかっていればACは90万円です。",
    "related": [
      "evm",
      "evm-ev"
    ],
    "criteria": [
      {
        "id": "actual-cost",
        "title": "実施した作業のために実際に発生した費用",
        "hint": "予定の予算ではなく、何にかかった費用ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "evm-cpi",
    "name": "CPI（コスト効率指数）",
    "aliases": [
      "コスト効率指数"
    ],
    "reading": "Cost Performance Index",
    "category": "プロジェクト管理",
    "definition": "出来高を実コストで割って求める、コストの効率を示す指標です。CPI＝EV÷ACで、1未満なら完了した作業の予算額より実際の費用が大きく、コスト超過を示します。",
    "example": "EVが80万円、ACが100万円ならCPIは0.8で、コスト超過と判断します。",
    "related": [
      "evm",
      "evm-ev",
      "evm-ac",
      "evm-tcpi"
    ],
    "criteria": [
      {
        "id": "cost-ratio",
        "title": "出来高を実コストで割ってコスト効率を表す（CPI＝EV÷AC）",
        "hint": "どの二つの値を、どちらを分子にして割りますか？"
      },
      {
        "id": "interpretation",
        "title": "1未満ならコスト超過、1より大きければ予算に対して効率が良い",
        "hint": "CPIが0.9のとき、コストをどう評価しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "evm-spi",
    "name": "SPI（スケジュール効率指数）",
    "aliases": [
      "SPI",
      "スケジュール効率指数"
    ],
    "reading": "Schedule Performance Index",
    "category": "プロジェクト管理",
    "definition": "出来高を計画価値で割って求める、スケジュールの効率を示す指標です。SPI＝EV÷PVで、1未満なら予定より作業が遅れ、1より大きければ予定より進んでいます。",
    "example": "EVが80万円、PVが100万円ならSPIは0.8で、予定より作業が遅れています。",
    "related": [
      "evm",
      "evm-ev",
      "evm-pv"
    ],
    "criteria": [
      {
        "id": "schedule-ratio",
        "title": "出来高を計画価値で割って進捗の効率を表す（SPI＝EV÷PV）",
        "hint": "予定に対する進捗を、どの二つの値の比で表しますか？"
      },
      {
        "id": "interpretation",
        "title": "1未満なら遅れ、1より大きければ予定より進んでいる",
        "hint": "SPIが1.1のとき、進捗をどう評価しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "evm-tcpi",
    "name": "TCPI（残作業効率指数）",
    "aliases": [
      "TCPI",
      "残作業効率指数"
    ],
    "reading": "To-Complete Performance Index",
    "category": "プロジェクト管理",
    "definition": "目標の総コスト内で完成させるために、残りの作業で必要となるコスト効率です。完成時総予算BACを目標にする場合、（BAC－EV）÷（BAC－AC）で求めます。",
    "example": "BACが200万円、EVが80万円、ACが100万円ならTCPIは1.2で、残りの費用1円当たり1.2円分の予算上の作業を進める必要があります。",
    "related": [
      "evm",
      "evm-bac",
      "evm-ev",
      "evm-ac",
      "evm-cpi"
    ],
    "criteria": [
      {
        "id": "remaining-efficiency",
        "title": "目標の総コスト内で完成するために残作業で必要なコスト効率",
        "hint": "現在までの実績ではなく、どの作業に必要な効率を表しますか？"
      },
      {
        "id": "budget-formula",
        "title": "BACを目標にする場合は（BAC－EV）÷（BAC－AC）で求める",
        "hint": "残りの作業の予算額と残りの予算を、どう使って計算しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "evm-bac",
    "name": "BAC（完成時総予算）",
    "aliases": [
      "BAC",
      "完成時総予算"
    ],
    "reading": "Budget at Completion",
    "category": "プロジェクト管理",
    "definition": "プロジェクトの計画された全作業に割り当てた予算の総額です。完了時の実コストや、現時点での完成までのコスト予測とは区別します。",
    "example": "計画された全作業の予算が200万円なら、途中の実支出にかかわらず、その計画のBACは200万円です。",
    "related": [
      "evm",
      "evm-tcpi"
    ],
    "criteria": [
      {
        "id": "total-budget",
        "title": "計画された全作業に割り当てた予算の総額",
        "hint": "実績や将来の予測ではなく、何の総額ですか？"
      }
    ],
    "commonMistakes": []
  },

  {
    "id": "critical-path",
    "name": "クリティカルパス",
    "reading": "Critical path",
    "category": "プロジェクト管理",
    "definition": "作業の順序関係をつないだ経路のうち、所要日数の合計が最も長い経路です。この経路上の作業が遅れると、プロジェクト全体が遅れます。",
    "example": "A→B→Eが28日、A→B→Dが27日なら、A→B→Eがクリティカルパスで、全体の期間は28日です。",
    "related": [
      "schedule-compression",
      "fast-tracking",
      "dummy-activity",
      "duration"
    ],
    "criteria": [
      {
        "id": "longest",
        "title": "所要日数の合計が最も長い経路",
        "hint": "どの経路をクリティカルパスと呼びますか？"
      },
      {
        "id": "no-slack",
        "title": "この経路上の作業には余裕（フロート）がなく、遅れると全体が遅れる",
        "hint": "クリティカルパス上の作業が1日遅れると、どうなりますか？"
      },
      {
        "id": "shorten",
        "title": "全体を短縮するにはクリティカルパス上の作業を短縮する",
        "hint": "全体の期間を縮めるには、どの作業を短くしますか？",
        "level": "deep"
      },
      {
        "id": "shift",
        "title": "短縮するとクリティカルパスが別の経路に移り、短縮量が限られることがある",
        "hint": "ある経路を大きく短縮しても、全体がそれほど縮まないのはなぜですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "最も短い経路をクリティカルパスと考える誤りがあります。",
      "作業を短縮した後も、元の経路がクリティカルパスのままだと考えてしまいがちです。"
    ]
  },
  {
    "id": "rto-rpo",
    "name": "RTO",
    "aliases": [
      "復旧目標時間"
    ],
    "reading": "Recovery Time Objective",
    "category": "サービス管理",
    "definition": "障害などで業務やサービスが中断してから、復旧するまでに許容する時間の目標です。復旧目標時間とも呼びます。",
    "example": "障害発生から4時間以内に業務を再開する、と定めます。",
    "related": [
      "rpo"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "中断から復旧までの目標時間を表す",
        "hint": "「いつまでに復旧するか」を表す指標は？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rpo",
    "name": "RPO",
    "aliases": [
      "復旧目標時点"
    ],
    "reading": "Recovery Point Objective",
    "category": "サービス管理",
    "definition": "障害から復旧するとき、どの時点のデータまで戻せるようにするかの目標です。復旧目標時点とも呼びます。",
    "example": "障害発生の1時間前の時点までのデータを復旧できるようにします。",
    "related": [
      "rto-rpo"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "どの時点のデータまで復旧するかの目標を表す",
        "hint": "復旧までの時間ではなく、何の時点を表しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "application-control",
    "name": "業務処理統制",
    "aliases": [
      "IT業務処理統制"
    ],
    "reading": "Information technology application controls",
    "category": "システム監査",
    "definition": "販売や会計など個々の業務システムに組み込まれ、データが正確・網羅的に処理されることを確保する統制です。その基盤となる運用・開発・アクセス管理などは全般統制です。",
    "example": "受注入力時の値のチェック機能や、入力結果の一覧（プルーフリスト）と元の伝票との照合は業務処理統制です。",
    "related": [
      "risk-approach"
    ],
    "criteria": [
      {
        "id": "business",
        "title": "個々の業務システムの処理に組み込まれた統制",
        "hint": "どの範囲の統制ですか？"
      },
      {
        "id": "examples",
        "title": "入力チェック、照合、承認、エラー処理などが例",
        "hint": "具体的にはどのような統制がありますか？",
        "level": "deep"
      },
      {
        "id": "assertions",
        "title": "網羅性（漏れなく）・正確性・正当性（承認済み）などの観点を確保する",
        "hint": "業務処理統制は、データのどのような性質を確保しますか？",
        "level": "deep"
      },
      {
        "id": "dependency",
        "title": "全般統制が有効でないと、業務処理統制の有効性も信頼できない",
        "hint": "二つの統制はどのような関係にありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "ファイアウォールの運用や入退室管理は、システム全体を支える全般統制です。"
    ]
  },
  {
    "id": "soa",
    "name": "SOA",
    "aliases": [
      "サービス指向アーキテクチャ"
    ],
    "reading": "Service Oriented Architecture",
    "category": "システム戦略",
    "definition": "業務の機能をサービスという独立した部品にし、それらを組み合わせてシステムを構築する設計の考え方です。業務プロセスとの対応付けや他システムとの連携がしやすくなります。",
    "example": "在庫照会や与信チェックをサービスとして公開し、受注システムやECサイトから共通に呼び出します。",
    "related": [],
    "criteria": [
      {
        "id": "service",
        "title": "業務の機能をサービスという部品に分ける",
        "hint": "SOAでは、システムを何の単位に分けますか？"
      },
      {
        "id": "combine",
        "title": "サービスを組み合わせてシステムを構築する",
        "hint": "分けたサービスをどのように使いますか？"
      },
      {
        "id": "benefit",
        "title": "業務プロセスとの対応付けや、他システムとの連携・再利用がしやすい",
        "hint": "SOAの利点は何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "ERP、フィット＆ギャップ分析、BPRの説明と入れ替えた選択肢が出ます。"
    ]
  },
  {
    "id": "ppm",
    "name": "PPM",
    "aliases": [
      "市場成長率",
      "相対的市場シェア"
    ],
    "reading": "Product Portfolio Management",
    "category": "経営戦略",
    "definition": "市場成長率と相対的市場シェアの二つの軸で事業や製品を四つに分類し、経営資源の配分を考える手法です。",
    "example": "成長率が低くシェアの高い「金のなる木」で得た資金を、成長率が高い「問題児」に投資して「花形」に育てます。",
    "related": [],
    "criteria": [
      {
        "id": "axes",
        "title": "市場成長率と相対的市場シェアの二軸を使う",
        "hint": "PPMの縦軸と横軸は何ですか？"
      },
      {
        "id": "four",
        "title": "花形・金のなる木・問題児・負け犬の四つに分類する",
        "hint": "四つの分類の名前は何ですか？"
      },
      {
        "id": "allocation",
        "title": "事業間の資源（資金）配分を決めるために使う",
        "hint": "PPMの目的は何ですか？",
        "level": "deep"
      },
      {
        "id": "cash-flow",
        "title": "金のなる木の資金を問題児や花形に回す",
        "hint": "資金はどこからどこへ流しますか？",
        "level": "deep"
      },
      {
        "id": "limits",
        "title": "事業間の相乗効果や、シェアを高める以外の戦略を考慮しにくい",
        "hint": "PPMにはどのような限界がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "3C分析やSWOT分析、バランススコアカードと取り違えた選択肢が出ます。"
    ]
  },
  {
    "id": "break-even-point",
    "name": "損益分岐点",
    "aliases": [
      "損益分岐点売上高",
      "限界利益",
      "限界利益率",
      "固定費",
      "変動費",
      "変動費率",
      "販売単価"
    ],
    "reading": "Break-even point",
    "category": "経営管理",
    "definition": "売上高と費用が等しくなり、利益がちょうど0になる売上高です。固定費÷(1−変動費率)で求めます。",
    "example": "固定費180、変動費率0.6なら、損益分岐点売上高は180÷0.4＝450です。",
    "related": [],
    "criteria": [
      {
        "id": "zero",
        "title": "利益が0になる売上高",
        "hint": "損益分岐点では、利益はいくらですか？"
      },
      {
        "id": "formula",
        "title": "固定費÷(1−変動費率)で求める",
        "hint": "損益分岐点売上高の式は何ですか？",
        "level": "deep"
      },
      {
        "id": "split",
        "title": "費用を固定費と変動費に分けて考える",
        "hint": "計算の前に、費用をどう分けますか？",
        "level": "deep"
      },
      {
        "id": "marginal",
        "title": "1−変動費率は限界利益率で、二つの売上高と利益から求められる",
        "hint": "利益の増え方から、限界利益率をどう求めますか？",
        "level": "deep"
      },
      {
        "id": "safety",
        "title": "実際の売上高が損益分岐点をどれだけ上回るかを安全余裕率で表す",
        "hint": "売上が少し減っても赤字にならないかは、何で判断しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "変動費の一部だけを変動費率に含めたり、固定費と変動費を足したりする誤りが選択肢の値になります。"
    ]
  },
  {
    "id": "five-forces",
    "name": "ファイブフォース分析",
    "reading": "Five forces analysis",
    "category": "経営戦略",
    "definition": "業界の収益性を、新規参入の脅威、代替品の脅威、売り手（供給者）の交渉力、買い手の交渉力、既存企業間の競争の五つの要因から分析する手法です。",
    "example": "代替品が多く、買い手の交渉力が強い業界では、価格を上げにくく収益性が低くなりやすいと分析します。",
    "related": [
      "ppm"
    ],
    "criteria": [
      {
        "id": "industry",
        "title": "業界の競争状態と収益性を分析する",
        "hint": "何を分析する手法ですか？"
      },
      {
        "id": "five",
        "title": "新規参入・代替品・売り手・買い手・既存企業間の競争の五つの要因",
        "hint": "五つの要因は何ですか？"
      }
    ],
    "commonMistakes": [
      "PEST分析やVRIO分析と取り違えた選択肢が出ます。"
    ]
  },
  {
    "id": "worker-dispatch",
    "name": "労働者派遣",
    "aliases": [
      "労働者派遣法",
      "派遣先",
      "派遣元",
      "指揮命令",
      "派遣先管理台帳",
      "派遣先責任者"
    ],
    "reading": "Worker dispatching",
    "category": "法務",
    "definition": "派遣元が雇用する労働者を、派遣先の指揮命令の下で働かせる形態です。雇用関係は派遣元、指揮命令関係は派遣先にあります。",
    "example": "B社に雇用されたエンジニアが、A社の指示を受けてA社のシステム開発に従事します。",
    "related": [],
    "criteria": [
      {
        "id": "relations",
        "title": "雇用関係は派遣元、指揮命令は派遣先",
        "hint": "派遣労働者は誰に雇われ、誰の指示で働きますか？"
      },
      {
        "id": "no-select",
        "title": "派遣先が事前面接などで派遣労働者を特定することは禁止",
        "hint": "派遣先は、派遣される人を選べますか？",
        "level": "deep"
      },
      {
        "id": "vs-contract",
        "title": "請負では発注者が労働者に直接指示できず、指示すると偽装請負になる",
        "hint": "請負契約との違いは何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "派遣先が履歴書で書類選考したり、年齢・性別を指定したりする選択肢は不適切です。",
      "派遣先管理台帳や派遣先責任者は派遣先の義務です。派遣元の措置と取り違えやすいです。"
    ]
  },
  {
    "id": "module-coupling",
    "name": "モジュール結合度",
    "aliases": [
      "データ結合",
      "スタンプ結合",
      "制御結合",
      "外部結合",
      "共通結合"
    ],
    "reading": "Module coupling",
    "category": "ソフトウェア設計",
    "definition": "モジュール間の結び付きの強さです。結合度が低いほどモジュールの独立性が高く、変更の影響が広がりにくくなります。",
    "example": "必要なデータ項目だけを引数で渡すデータ結合は、共通域のデータを参照し合う共通結合より結合度が低くなります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "モジュール間の依存の強さを表す",
        "hint": "結合度は何を表しますか？"
      },
      {
        "id": "low-good",
        "title": "結合度は低いほど望ましい",
        "hint": "結合度は高い方と低い方、どちらが望ましいですか？",
        "level": "deep"
      },
      {
        "id": "data",
        "title": "必要なデータだけを引数で渡すデータ結合が最も低い",
        "hint": "最も結合度が低い受渡し方法は何ですか？",
        "level": "deep"
      },
      {
        "id": "order",
        "title": "低い順にデータ・スタンプ・制御・外部・共通・内容結合",
        "hint": "結合の種類を、結合度の低い順に並べると？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "共通域や外部宣言によるデータ共有は結合度が高い方式です。"
    ]
  },
  {
    "id": "edge-computing",
    "name": "エッジコンピューティング",
    "aliases": [
      "エッジAI"
    ],
    "reading": "Edge computing",
    "category": "技術戦略",
    "definition": "データの発生源（端末やセンサー）の近くに処理の資源を置き、そこでデータを処理する方式です。応答の遅延と通信量を抑えられます。",
    "example": "工場のカメラ映像をクラウドに送らず、近くのエッジサーバで学習済みモデルによる推論を行い、不良品をすぐに判定します。",
    "related": [],
    "criteria": [
      {
        "id": "near",
        "title": "データの発生源の近くで処理する",
        "hint": "どこで処理を行いますか？"
      },
      {
        "id": "latency",
        "title": "応答の遅延を小さくできる",
        "hint": "クラウドで処理する場合と比べて、何が速くなりますか？",
        "level": "deep"
      },
      {
        "id": "traffic",
        "title": "クラウドへ送る通信量を減らせる",
        "hint": "ネットワークにはどのような利点がありますか？",
        "level": "deep"
      },
      {
        "id": "privacy",
        "title": "個人情報などをクラウドに送らずに済むため、プライバシー保護にも役立つ",
        "hint": "データを外に出さないことには、どんな利点がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "複数のコンピュータを結ぶグリッドコンピューティングや、環境からエネルギーを得るエネルギーハーベスティングと取り違えた選択肢が出ます。"
    ]
  },
  {
    "id": "poisson-exponential",
    "name": "ポアソン分布",
    "reading": "Poisson distribution",
    "category": "基礎理論",
    "definition": "事象が一定の割合で独立して発生するとき、一定時間や一定範囲で発生する回数を表す確率分布です。",
    "example": "1時間に平均6人がランダムに到着する窓口で、1時間に到着する人数を扱います。",
    "related": [
      "exponential-distribution",
      "mm1-queue"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "一定時間や一定範囲に起こる事象の回数を表す分布",
        "hint": "到着の間隔ではなく、何の分布ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "exponential-distribution",
    "name": "指数分布",
    "reading": "Exponential distribution",
    "category": "基礎理論",
    "definition": "事象が一定の割合で独立して発生するとき、次の事象が起きるまでの時間などを表す確率分布です。",
    "example": "平均10分間隔でランダムに到着する窓口で、次の人が来るまでの時間を扱います。",
    "related": [
      "poisson-exponential",
      "mm1-queue"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "次の事象が起きるまでの時間や間隔を表す分布",
        "hint": "到着する人数ではなく、何の分布ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "roc-curve",
    "name": "ROC曲線",
    "aliases": [
      "ROC",
      "Receiver Operating Characteristic curve"
    ],
    "reading": "Receiver Operating Characteristic curve",
    "category": "AI・機械学習",
    "definition": "2クラス分類器のしきい値を変えながら、横軸に偽陽性率、縦軸に真陽性率をとって描いた曲線です。左上に近いほど性能が良く、曲線下の面積（AUC）で比較します。",
    "example": "迷惑メール判定のしきい値を下げると、迷惑メールの検出率（真陽性率）は上がるが、普通のメールの誤判定（偽陽性率）も増えます。",
    "related": [
      "overfitting",
      "false-positive-rate",
      "binary-classification"
    ],
    "criteria": [
      {
        "id": "axes",
        "title": "横軸が偽陽性率、縦軸が真陽性率",
        "hint": "縦軸と横軸に何をとりますか？"
      },
      {
        "id": "threshold",
        "title": "判定のしきい値を変えた点を結んだ曲線",
        "hint": "曲線の各点は何を変えたときの結果ですか？"
      },
      {
        "id": "upperleft",
        "title": "左上に近い（AUCが大きい）ほど良い分類器",
        "hint": "良い分類器の曲線はどこに寄りますか？",
        "level": "deep"
      },
      {
        "id": "diagonal",
        "title": "対角線はランダムな判定と同じ性能（AUC=0.5）を表す",
        "hint": "原点から右上への直線は何を意味しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "縦軸を適合率（Precision）とする誤りがあります。適合率と再現率の曲線はPR曲線です。"
    ]
  },
  {
    "id": "false-positive-rate",
    "name": "偽陽性率",
    "aliases": [
      "False Positive Rate",
      "FPR"
    ],
    "reading": "False Positive Rate",
    "category": "AI・機械学習",
    "definition": "実際には陰性であるもののうち、誤って陽性と判定したものの割合です。偽陽性の件数を、実際に陰性であるものの総数で割って求めます。",
    "example": "通常のメール100件のうち5件を迷惑メールと誤判定した場合、偽陽性率は5％です。",
    "related": [
      "roc-curve",
      "false-positive",
      "binary-classification"
    ],
    "criteria": [
      {
        "id": "negative-denominator",
        "title": "実際に陰性のもののうち、誤って陽性と判定した割合",
        "hint": "分母にする集団と、その中で数える誤判定は何ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "binary-classification",
    "name": "2クラス分類",
    "aliases": [
      "二値分類",
      "二項分類"
    ],
    "reading": "Binary classification",
    "category": "AI・機械学習",
    "definition": "入力されたデータを、二つのクラスのいずれかに分類することです。例えば、メールを迷惑メールと通常のメールに分けます。",
    "example": "メールの特徴から、迷惑メールか通常のメールかを判定します。",
    "related": [
      "machine-learning",
      "roc-curve",
      "false-positive-rate"
    ],
    "criteria": [
      {
        "id": "two-classes",
        "title": "データを二つのクラスのいずれかに分類する",
        "hint": "分類先のクラスはいくつありますか？"
      }
    ],
    "commonMistakes": []
  },

  {
    "id": "machine-learning",
    "name": "機械学習",
    "reading": "Machine learning",
    "category": "AI・機械学習",
    "definition": "データから規則やパターンを学び、未知のデータの予測や分類などに利用する手法です。学習済みのモデルを新しいデータに適用することを推論と呼びます。",
    "example": "過去の販売データから傾向を学習し、新しい条件での販売数を予測します。",
    "related": [
      "overfitting",
      "supervised-learning",
      "unsupervised-learning",
      "reinforcement-learning",
      "inference"
    ],
    "criteria": [
      {
        "id": "learn",
        "title": "データから規則を自動で学習して予測・分類する",
        "hint": "人がルールを書く代わりに何をしますか？"
      },
      {
        "id": "inference",
        "title": "学習済みモデルで新しいデータを予測することを推論という",
        "hint": "学習の後、モデルを使う段階を何と呼びますか？",
        "level": "deep"
      },
      {
        "id": "generalize",
        "title": "目的は訓練データではなく未知データでの性能（汎化性能）",
        "hint": "訓練データだけで正解率が高ければよいですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "クラスタリングを教師あり学習とする誤りがあります。"
    ]
  },
  {
    "id": "deep-learning",
    "name": "深層学習",
    "reading": "Deep learning",
    "category": "AI・機械学習",
    "definition": "多層のニューラルネットワークを使う機械学習です。特徴量を人が設計しなくても、データから段階的に特徴を学習できる点が特徴で、画像認識や生成AIの基盤になっています。",
    "example": "大量の顔画像から、輪郭→目鼻→顔全体と特徴を段階的に学び、本人を見分けます。",
    "related": [
      "machine-learning"
    ],
    "criteria": [
      {
        "id": "layers",
        "title": "多層のニューラルネットワークを用いる",
        "hint": "何を何層も重ねますか？"
      },
      {
        "id": "features",
        "title": "特徴量をデータから自動で学習する",
        "hint": "特徴を人が決める必要がありますか？"
      },
      {
        "id": "data",
        "title": "大量のデータと計算資源（GPUなど）を必要とする",
        "hint": "学習に何が多く必要ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "機械学習と深層学習を別物とする誤りがあります。深層学習は機械学習の一種です。"
    ]
  },
  {
    "id": "generative-ai",
    "name": "生成AI",
    "reading": "Generative artificial intelligence",
    "category": "AI・機械学習",
    "definition": "学習したデータの傾向をもとに、文章・画像・音声などの新しいコンテンツを生成するAIです。もっともらしい誤り（ハルシネーション）や、著作権・情報漏えいへの配慮が必要です。",
    "example": "指示文から報告書の下書きを作ったり、説明文から画像を作ったりします。",
    "related": [
      "deep-learning"
    ],
    "criteria": [
      {
        "id": "generate",
        "title": "学習データの傾向から新しいコンテンツを生成する",
        "hint": "分類ではなく何をしますか？"
      },
      {
        "id": "hallucination",
        "title": "事実と異なる内容をもっともらしく出力することがある",
        "hint": "出力をそのまま信じてよいですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cross-validation",
    "name": "交差検証",
    "reading": "Cross validation",
    "category": "AI・機械学習",
    "definition": "データを複数のグループに分け、学習用と検証用を入れ替えながら評価を繰り返し、その平均でモデルの汎化性能を見積もる方法です。k分割交差検証が代表です。",
    "example": "データを5分割し、4つで学習・1つで検証を5回繰り返して平均の正解率を求めます。",
    "related": [
      "overfitting"
    ],
    "criteria": [
      {
        "id": "split",
        "title": "データを分割し、学習用と検証用を入れ替えて評価を繰り返す",
        "hint": "データをどう使い回しますか？"
      },
      {
        "id": "generalization",
        "title": "未知データへの性能（汎化性能）を見積もる目的",
        "hint": "何を確かめるための方法ですか？",
        "level": "deep"
      },
      {
        "id": "leakage",
        "title": "検証用データが学習に混ざると性能を過大評価する（データ漏えい）",
        "hint": "分け方で注意することは？",
        "level": "deep"
      },
      {
        "id": "kfold",
        "title": "k分割ではk回学習・検証して平均をとる",
        "hint": "k分割交差検証の手順は？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "複数のモデルを組み合わせるアンサンブル学習と混同する誤りがあります。"
    ]
  },
  {
    "id": "ensemble-learning",
    "name": "アンサンブル学習",
    "reading": "Ensemble learning",
    "category": "AI・機械学習",
    "definition": "複数の学習モデルの予測を組み合わせて、単独のモデルより精度や安定性を高める手法です。バギング（ランダムフォレストなど）やブースティングがあります。",
    "example": "100本の決定木の多数決で分類するランダムフォレストは、アンサンブル学習の例です。",
    "related": [
      "machine-learning",
      "multitask-learning"
    ],
    "criteria": [
      {
        "id": "combine",
        "title": "複数のモデルの予測を組み合わせる（多数決・平均など）",
        "hint": "何を組み合わせますか？"
      },
      {
        "id": "accuracy",
        "title": "単独のモデルより精度や安定性を高める",
        "hint": "何のために組み合わせますか？",
        "level": "deep"
      },
      {
        "id": "diversity",
        "title": "効果を出すには個々のモデルの誤りが互いに異なる（多様性）ことが必要",
        "hint": "同じモデルを並べても効果がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "search-linear-binary",
    "name": "線形探索",
    "aliases": [
      "逐次探索"
    ],
    "reading": "Linear search",
    "category": "基礎理論",
    "definition": "データを先頭から順番に調べ、目的の値を探す方法です。データが整列されていなくても使えます。",
    "example": "名簿を上から1件ずつ確認して名前を探します。",
    "related": [
      "binary-search",
      "average-comparisons",
      "ascending-order"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "データを先頭から順に比較して目的の値を探す",
        "hint": "どの順番でデータを調べますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "binary-search",
    "name": "2分探索",
    "aliases": [
      "二分探索"
    ],
    "reading": "Binary search",
    "category": "基礎理論",
    "definition": "整列済みのデータの中央と目的の値を比較し、探索範囲を半分ずつに絞って探す方法です。",
    "example": "昇順の配列で中央の値と比較し、大きければ後半だけを探します。",
    "related": [
      "search-linear-binary",
      "average-comparisons",
      "ascending-order"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "整列済みのデータで、比較のたびに探索範囲を半分にする",
        "hint": "データの前提条件と、探索範囲の絞り方は？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "average-comparisons",
    "name": "平均比較回数",
    "reading": "Average number of comparisons",
    "category": "基礎理論",
    "definition": "探索などの処理で、1回の処理当たりに値を比較する回数の平均です。入力や探索位置ごとの比較回数を、その起こりやすさも考慮して求めます。",
    "example": "n件から等確率で見つかる線形探索では、平均比較回数は(n＋1)÷2回です。",
    "related": [
      "search-linear-binary",
      "binary-search",
      "ascending-order"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "処理に必要な比較回数の平均を表す",
        "hint": "何の回数を平均したものですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ascending-order",
    "name": "昇順",
    "reading": "Ascending order",
    "category": "基礎理論",
    "definition": "値を小さいものから大きいものへ順に並べることです。",
    "example": "数値の1、3、5、8という並びは昇順です。",
    "related": [
      "search-linear-binary",
      "binary-search",
      "average-comparisons"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "小さい値から大きい値へ並べる順序",
        "hint": "値が増える順ですか、減る順ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "bisection",
    "name": "二分法",
    "aliases": [
      "近似値"
    ],
    "reading": "Bisection method",
    "category": "基礎理論",
    "definition": "方程式の解を含む区間を半分ずつ狭めて近似値を求める方法です。区間の両端で関数の符号が異なることを利用し、1回ごとに区間の幅が半分になります。",
    "example": "幅1の区間から誤差0.001以下まで狭めるには、2¹⁰=1024なので10回繰り返します。",
    "related": [],
    "criteria": [
      {
        "id": "halve",
        "title": "解を含む区間を毎回半分にして近似値を求める",
        "hint": "繰り返すたびに区間はどうなりますか？"
      },
      {
        "id": "sign",
        "title": "区間の両端で関数の符号が異なることを使う",
        "hint": "解が区間内にあるとどう判断しますか？"
      },
      {
        "id": "count",
        "title": "必要な回数は「幅÷2ⁿ ≦ 許容誤差」となる最小のn",
        "hint": "幅を1/1000にするには何回必要ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "stack",
    "name": "スタック",
    "aliases": [
      "後入れ先出し",
      "LIFO"
    ],
    "reading": "Stack",
    "category": "基礎理論",
    "definition": "最後に入れたデータを最初に取り出す後入れ先出し（LIFO）のデータ構造です。入れる操作をプッシュ、取り出す操作をポップと呼び、関数呼出しや逆ポーランド表記法の計算に使います。",
    "example": "1,2,3の順にプッシュしてからポップすると、3,2,1の順に取り出されます。",
    "related": [],
    "criteria": [
      {
        "id": "lifo",
        "title": "後入れ先出し（LIFO）で、最後に入れたものから取り出す",
        "hint": "どの順に取り出されますか？"
      },
      {
        "id": "pushpop",
        "title": "プッシュで積み、ポップで取り出す",
        "hint": "二つの基本操作は？"
      },
      {
        "id": "use",
        "title": "関数呼出しの戻り先や逆ポーランド表記法の計算に使う",
        "hint": "どんな処理に使われますか？",
        "level": "deep"
      },
      {
        "id": "overflow",
        "title": "領域を超えて積むとスタックオーバーフローになる",
        "hint": "積みすぎると何が起きますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "先入れ先出し（FIFO）のキューと取り違える誤りがあります。"
    ]
  },
  {
    "id": "fifo",
    "name": "FIFO",
    "aliases": [
      "先入れ先出し"
    ],
    "reading": "First In First Out",
    "category": "コンピュータ構成",
    "definition": "最初に入れたものを最初に取り出す先入れ先出しの方式です。データ構造ではキュー、ページやキャッシュの置換では「最も古く読み込んだもの」を追い出す方式を指します。",
    "example": "ページ置換をFIFOで行うと、よく使うページでも読み込みが最も古ければ追い出されます。",
    "related": [
      "lru"
    ],
    "criteria": [
      {
        "id": "order",
        "title": "最初に入れた（読み込んだ）ものから取り出す・追い出す",
        "hint": "どれから出されますか？"
      },
      {
        "id": "queue",
        "title": "データ構造ではキュー（待ち行列）として使う",
        "hint": "FIFOのデータ構造は何ですか？",
        "level": "deep"
      },
      {
        "id": "replace",
        "title": "ページ置換では参照の新しさではなく読み込んだ順で追い出すため、よく使うページも追い出し得る",
        "hint": "LRUとの違いは何ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "最後の参照が古い順に追い出すLRUと混同する誤りがあります。"
    ]
  },
  {
    "id": "lfu",
    "name": "LFU",
    "reading": "Least Frequently Used",
    "category": "コンピュータ構成",
    "definition": "キャッシュやページの置換で、参照された回数が最も少ないものを追い出す方式です。最後に参照された時刻で選ぶLRUとは基準が異なります。",
    "example": "参照回数が10回・3回・7回のデータなら、3回のものを置き換えます。",
    "related": [
      "lru",
      "fifo"
    ],
    "criteria": [
      {
        "id": "frequency",
        "title": "参照回数が最も少ないものを追い出す",
        "hint": "何を基準に選びますか？"
      },
      {
        "id": "old-popular",
        "title": "過去によく使われたデータが、使われなくなっても残り続けやすい",
        "hint": "LFUの弱点は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "reverse-polish",
    "name": "逆ポーランド表記法",
    "aliases": [
      "後置記法",
      "オペランド",
      "演算子"
    ],
    "reading": "Reverse Polish notation",
    "category": "基礎理論",
    "definition": "演算子をオペランド（演算対象）の後ろに書く後置記法です。かっこが不要で、スタックを使って左から順に計算できます。通常の書き方は中置記法、演算子を前に書くのは前置記法です。",
    "example": "(A+B)×C は逆ポーランド表記法で AB+C× と書きます。",
    "related": [
      "stack",
      "prefix-notation",
      "infix-notation"
    ],
    "criteria": [
      {
        "id": "postfix",
        "title": "演算子をオペランドの後ろに書く後置記法",
        "hint": "演算子はどこに置きますか？"
      },
      {
        "id": "noparen",
        "title": "かっこを使わずに計算順序を表せる",
        "hint": "かっこは必要ですか？"
      },
      {
        "id": "stack",
        "title": "スタックにオペランドを積み、演算子でポップして計算する",
        "hint": "どのデータ構造で評価しますか？",
        "level": "deep"
      },
      {
        "id": "convert",
        "title": "中置記法から変換するときは優先順位の高い演算から後置にする",
        "hint": "(A+B)×Cをどう書きますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "hash-table",
    "name": "ハッシュ表",
    "aliases": [
      "衝突"
    ],
    "reading": "Hash table",
    "category": "基礎理論",
    "definition": "キーをハッシュ関数で変換した値を格納位置として使う表です。データ量によらずほぼ一定時間で探索できますが、異なるキーが同じ位置になる衝突（シノニム）への対処が必要です。",
    "example": "キーを13で割った余りを位置とする表で、14と27はどちらも1になり衝突します。",
    "related": [
      "hash"
    ],
    "criteria": [
      {
        "id": "address",
        "title": "キーのハッシュ値から格納位置を決めるデータ構造",
        "hint": "キーからどのように格納場所を決めますか？"
      },
      {
        "id": "fast",
        "title": "衝突が少なければ件数によらずほぼ一定時間で探索できる",
        "hint": "探索時間はデータ量に比例しますか？",
        "level": "deep"
      },
      {
        "id": "collision",
        "title": "異なるキーが同じ位置になる衝突（シノニム）が起き得る",
        "hint": "どんな問題が起きますか？",
        "level": "deep"
      },
      {
        "id": "resolve",
        "title": "衝突はチェイン法（リスト）やオープンアドレス法で解決する",
        "hint": "衝突への対処法は？",
        "level": "deep"
      },
      {
        "id": "load",
        "title": "格納率（負荷率）が高いほど衝突が増えて遅くなる",
        "hint": "表が埋まってくると何が起きますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "binary-tree",
    "name": "2分木",
    "aliases": [
      "ノード",
      "根"
    ],
    "reading": "Binary tree",
    "category": "基礎理論",
    "definition": "各ノード（節）が最大二つの子を持つ木構造です。最上位のノードを根と呼びます。左右の部分木をたどる順番（前順・中順・後順）で、出力の並びが変わります。",
    "example": "中順（左→根→右）でたどると、2分探索木の値は昇順に出力されます。",
    "related": [],
    "criteria": [
      {
        "id": "two",
        "title": "各ノードの子が最大二つ",
        "hint": "子は何個まで持てますか？"
      },
      {
        "id": "root",
        "title": "最上位のノードを根、子のないノードを葉と呼ぶ",
        "hint": "木の頂点を何と呼びますか？"
      },
      {
        "id": "traverse",
        "title": "前順・中順・後順でたどる順序が異なる",
        "hint": "ノードをたどる順番の種類は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "recursion",
    "name": "再帰処理",
    "reading": "Recursion",
    "category": "基礎理論",
    "definition": "関数が自分自身を呼び出して、問題を同じ形の小さな問題に分けて解く処理です。必ず呼出しを止める終了条件が必要で、木構造のたどりや階乗の計算に使います。",
    "example": "n! を n×(n−1)! と定義し、0! = 1 を終了条件にして計算します。",
    "related": [
      "binary-tree",
      "stack"
    ],
    "criteria": [
      {
        "id": "self",
        "title": "関数が自分自身を呼び出す",
        "hint": "どの関数を呼び出しますか？"
      },
      {
        "id": "base",
        "title": "終了条件がないと無限に呼び出し続ける",
        "hint": "必ず必要な条件は？"
      },
      {
        "id": "stack",
        "title": "呼出しごとに戻り先や変数がスタックに積まれる",
        "hint": "呼出し情報はどこに保存されますか？",
        "level": "deep"
      },
      {
        "id": "loop",
        "title": "再帰は繰返し（ループ）に書き換えられる",
        "hint": "再帰を使わずに書けますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "quantum-computer",
    "name": "量子コンピュータ",
    "reading": "Quantum computer",
    "category": "基礎理論",
    "definition": "量子ビットの重ね合わせなど、量子の性質を利用して計算するコンピュータです。特定の問題で高速化が期待され、十分な規模になればRSAなど一部の公開鍵暗号の安全性に影響する可能性があります。",
    "example": "量子ビットの重ね合わせを計算に使います。特定の問題を高速に解けることは、計算の難しさに依存する暗号への脅威にもなります。",
    "related": [
      "pqc",
      "quantum-bit",
      "superposition",
      "quantum-gate"
    ],
    "criteria": [
      {
        "id": "qubit",
        "title": "量子ビットの重ね合わせを利用して計算するコンピュータ",
        "hint": "従来のビットとは異なる、どんな性質を計算に使いますか？"
      },
      {
        "id": "crypto",
        "title": "十分な規模の量子コンピュータは、RSAなど一部の公開鍵暗号の解読を高速化する可能性がある",
        "hint": "特定の問題を高速に解けることは、暗号の安全性にどのような影響がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "量子コンピュータがあらゆる計算を高速化する、とする誤りがあります。"
    ]
  },
  {
    "id": "quicksort",
    "name": "クイックソート",
    "aliases": [
      "基準値"
    ],
    "reading": "Quicksort",
    "category": "基礎理論",
    "definition": "基準値（ピボット）を選び、それより小さい要素と大きい要素に分割する操作を再帰的に繰り返して整列する方法です。平均計算量はO(n log n)ですが、基準値の選び方が悪いと最悪O(n²)になります。",
    "example": "[5,3,8,1,9] で5を基準にすると [3,1] と [8,9] に分け、それぞれをまた分割します。",
    "related": [
      "recursion"
    ],
    "criteria": [
      {
        "id": "pivot",
        "title": "基準値を選び、小さいグループと大きいグループに分割する",
        "hint": "最初に何を選びますか？"
      },
      {
        "id": "recursive",
        "title": "分割を再帰的に繰り返して整列する",
        "hint": "分割した後はどうしますか？"
      },
      {
        "id": "order",
        "title": "平均O(n log n)、基準値の選び方が悪いと最悪O(n²)",
        "hint": "計算量は？",
        "level": "deep"
      },
      {
        "id": "unstable",
        "title": "同じ値の並びが保たれない（安定ではない）",
        "hint": "安定な整列ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sorting",
    "name": "整列アルゴリズム",
    "reading": "Sorting algorithms",
    "category": "基礎理論",
    "definition": "データを値などの基準に従って昇順・降順に並べるアルゴリズムの総称です。手法によって計算時間、必要な記憶領域、同じ値の順序を保つ性質などが異なります。",
    "example": "利用者を年齢順に並べ、同年齢の人の元の並び順も残したいときは、安定性のある手法を選びます。",
    "related": [
      "quicksort",
      "bubble-sort",
      "insertion-sort",
      "heap-sort"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "データを一定の順序に並べるアルゴリズムの総称",
        "hint": "データにどのような処理をする方法の総称ですか？"
      },
      {
        "id": "choice",
        "title": "同じ値のデータの相対順を保ちたい場合は、安定性のある整列手法を選ぶ",
        "hint": "同じ値のデータの並び順を残したいとき、どの性質に注目しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "normal-distribution",
    "name": "正規分布",
    "aliases": [
      "平均",
      "標準偏差",
      "変曲点"
    ],
    "reading": "Normal distribution",
    "category": "基礎理論",
    "definition": "平均を中心に左右対称な釣鐘型の確率分布です。平均±1標準偏差の範囲に約68%、±2標準偏差に約95%が入り、平均±1標準偏差の位置が曲線の変曲点になります。",
    "example": "平均60点・標準偏差10点の試験では、約68%の人が50〜70点に入ります。",
    "related": [],
    "criteria": [
      {
        "id": "bell",
        "title": "平均を中心に左右対称な釣鐘型",
        "hint": "グラフの形は？"
      },
      {
        "id": "sd",
        "title": "標準偏差が大きいほど山が低く横に広がる",
        "hint": "標準偏差でグラフはどう変わりますか？",
        "level": "deep"
      },
      {
        "id": "ratio",
        "title": "平均±1σに約68%、±2σに約95%が含まれる",
        "hint": "±1σの範囲に何%入りますか？",
        "level": "deep"
      },
      {
        "id": "inflection",
        "title": "平均±1σの位置が曲線の変曲点になる",
        "hint": "曲がり方が変わる点はどこですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "bit-error-rate",
    "name": "ビット誤り率",
    "aliases": [
      "期待値"
    ],
    "reading": "Bit error rate",
    "category": "基礎理論",
    "definition": "送ったビットのうち誤って届くビットの割合です。パケットのビット数と誤り率を掛ければ、1パケットに含まれる誤りの期待値（平均個数）が求まり、誤りを含むパケットの数も見積もれます。",
    "example": "誤り率10⁻⁶で1パケット1,000ビットなら、1パケット当たりの誤りの期待値は0.001個です。",
    "related": [],
    "criteria": [
      {
        "id": "ratio",
        "title": "誤って届くビットの割合",
        "hint": "何の割合ですか？"
      },
      {
        "id": "expected",
        "title": "ビット数×誤り率で誤りの期待値を求める",
        "hint": "1パケットの平均の誤り数はどう求めますか？",
        "level": "deep"
      },
      {
        "id": "packet",
        "title": "誤りを含むパケットの確率は 1−(1−p)^n、pが小さければ約n×p",
        "hint": "誤りを含むパケットの割合は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "logic-operation",
    "name": "論理演算",
    "aliases": [
      "真理値表",
      "2進数"
    ],
    "reading": "Logical operations",
    "category": "基礎理論",
    "definition": "真偽値やビットに対して、論理積・論理和・否定・排他的論理和などを行う演算です。条件の判定や、ビット列の一部を取り出す処理などに使います。",
    "example": "2進数の下位3ビットを取り出すには、00000111との論理積（マスク）をとります。",
    "related": [
      "logical-and",
      "logical-or"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "真偽値やビットに対してAND・OR・NOT・XORなどの演算を行う",
        "hint": "どのような値を扱い、どんな種類の演算がありますか？"
      },
      {
        "id": "mask",
        "title": "論理積で特定のビットを取り出し、論理和で特定のビットを1にする（マスク演算）",
        "hint": "ビットを取り出すには？",
        "level": "deep"
      },
      {
        "id": "xor-twice",
        "title": "同じ値で2回XORすると元に戻る性質は暗号やパリティに使われる",
        "hint": "XORの面白い性質は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "nand",
    "name": "NAND素子",
    "aliases": [
      "NAND"
    ],
    "reading": "NOT AND gate",
    "category": "基礎理論",
    "definition": "論理積（AND）の結果を反転する論理素子です。二つの入力がともに1のときだけ出力が0になり、それ以外は1になります。NAND素子の組合せで様々な論理回路を構成できます。",
    "example": "A NAND A は NOT A になり、(A NAND A) NAND (B NAND B) は A OR B になります。",
    "related": [
      "logic-operation",
      "nor",
      "de-morgan"
    ],
    "criteria": [
      {
        "id": "nand",
        "title": "NANDは論理積の否定で、両方1のときだけ0",
        "hint": "NANDはいつ0になりますか？"
      },
      {
        "id": "universal",
        "title": "NAND（またはNOR）だけで任意の論理回路を構成できる",
        "hint": "NANDだけで何が作れますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "combinational-circuit",
    "name": "組合せ回路",
    "aliases": [
      "論理回路",
      "多数決回路",
      "タイムチャート"
    ],
    "reading": "Combinational circuit",
    "category": "基礎理論",
    "definition": "出力がその時点の入力だけで決まる論理回路です。過去の状態を記憶する順序回路（フリップフロップなど）と区別します。真理値表やタイムチャートから回路を求められます。",
    "example": "3入力のうち2つ以上が1なら1を出す多数決回路は AB + BC + CA で作れます。",
    "related": [
      "logic-operation",
      "nand"
    ],
    "criteria": [
      {
        "id": "input-only",
        "title": "出力が現在の入力だけで決まる",
        "hint": "出力は何で決まりますか？"
      },
      {
        "id": "timechart",
        "title": "タイムチャートの各時点の入出力から真理値表を作って回路を判定する",
        "hint": "タイムチャートからどう回路を選びますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "parity",
    "name": "パリティチェック",
    "aliases": [
      "パリティビット",
      "水平垂直パリティ"
    ],
    "reading": "Parity check",
    "category": "基礎理論",
    "definition": "データに1のビットの数が偶数（または奇数）になるようパリティビットを付けて誤りを検出する方法です。1ビットの誤りは検出できますが訂正はできません。水平垂直パリティでは行と列のパリティから誤りの位置を特定して1ビットを訂正できます。",
    "example": "1011001の1の数は4なので、偶数パリティならパリティビットは0です。",
    "related": [
      "hamming-code"
    ],
    "criteria": [
      {
        "id": "bit",
        "title": "1の個数を偶数（奇数）にそろえるパリティビットを付ける",
        "hint": "パリティビットはどう決めますか？"
      },
      {
        "id": "detect",
        "title": "単純なパリティは1ビット誤りの検出のみで訂正はできない",
        "hint": "パリティで訂正できますか？",
        "level": "deep"
      },
      {
        "id": "even-errors",
        "title": "2ビット同時の誤りは単純なパリティでは検出できない",
        "hint": "誤りが2ビットあるとどうなりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rendering",
    "name": "レンダリング",
    "aliases": [
      "コンピュータグラフィックス"
    ],
    "reading": "Rendering",
    "category": "マルチメディア",
    "definition": "3次元モデルなどのデータから、画面に表示する画像を生成する処理です。光や材質、視点などを反映し、目的に応じた見え方の画像を作ります。",
    "example": "3次元の建物モデルに光や材質の条件を与え、完成時の見え方を画像にします。",
    "related": [
      "ray-tracing",
      "radiosity",
      "texture-mapping",
      "metaball",
      "hidden-surface-removal"
    ],
    "criteria": [
      {
        "id": "generate",
        "title": "3次元などのデータから表示用の画像を生成する",
        "hint": "何から何を作る処理ですか？"
      },
      {
        "id": "quality",
        "title": "光や材質などの条件を反映し、画像の品質と描画時間のバランスを考えて処理する",
        "hint": "画像の見え方と処理時間には、どのような関係がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "virtual-reality",
    "name": "バーチャルリアリティ",
    "reading": "Virtual reality (VR)",
    "category": "マルチメディア",
    "definition": "コンピュータが作った仮想空間を、あたかも現実のように体験させる技術です。頭の動きに合わせて映像をすぐ描き直す（低遅延のレンダリング）ことが没入感と酔いの防止に重要です。",
    "example": "ヘッドマウントディスプレイで、頭を右に向けると右側の景色が表示されます。",
    "related": [
      "rendering"
    ],
    "criteria": [
      {
        "id": "immerse",
        "title": "仮想空間を現実のように体験させる",
        "hint": "何を体験させますか？"
      },
      {
        "id": "tracking",
        "title": "利用者の動きに合わせて映像を即座に描き直す",
        "hint": "頭を動かすと何が起きますか？",
        "level": "deep"
      },
      {
        "id": "latency",
        "title": "描画の遅延が大きいとVR酔いの原因になる",
        "hint": "遅延が大きいと何が問題ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "svg",
    "name": "SVG",
    "reading": "Scalable Vector Graphics",
    "category": "マルチメディア",
    "definition": "W3Cが標準化した、XMLで記述するベクター形式の画像フォーマットです。図形を座標と命令で表すため、拡大しても画質が劣化しません。点（ピクセル）の集まりで表すラスタ形式（PNG・TIFFなど）と対になります。",
    "example": "ロゴやアイコンをSVGで作ると、スマートフォンでも大画面でもくっきり表示されます。",
    "related": [
      "raster-format",
      "vector-format",
      "png",
      "tiff",
      "w3c"
    ],
    "criteria": [
      {
        "id": "vector",
        "title": "図形を座標と命令で表すベクター形式",
        "hint": "画像をどう表現しますか？"
      },
      {
        "id": "xml",
        "title": "XMLで記述され、W3Cが標準化した",
        "hint": "何の言語で書かれますか？"
      },
      {
        "id": "scale",
        "title": "拡大しても画質が劣化しない",
        "hint": "拡大するとどうなりますか？",
        "level": "deep"
      },
      {
        "id": "script",
        "title": "テキストなのでスクリプトを埋め込め、アップロードを許すとXSSの原因になり得る",
        "hint": "セキュリティ上の注意点は？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "SVGをラスタ形式とする誤りがあります。"
    ]
  },
  {
    "id": "xml",
    "name": "XML",
    "reading": "Extensible Markup Language",
    "category": "マルチメディア",
    "definition": "タグを利用者が定義できるマークアップ言語です。データの構造を表すのに使われ、SVGやXMLデジタル署名、各種設定ファイルの基盤になっています。",
    "example": "<order><item>ペン</item></order> のように、意味を持つタグでデータを表します。",
    "related": [
      "xml-signature",
      "svg"
    ],
    "criteria": [
      {
        "id": "tag",
        "title": "タグを自由に定義してデータの構造を表す",
        "hint": "HTMLとの違いは？"
      },
      {
        "id": "structured",
        "title": "データ交換用の構造化テキストとして使われる",
        "hint": "何に使われますか？"
      },
      {
        "id": "xxe",
        "title": "外部実体参照を許すと XXE 攻撃でファイルを読まれる",
        "hint": "XML特有の脆弱性は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "dom-sax",
    "name": "DOM",
    "reading": "Document Object Model",
    "category": "マルチメディア",
    "definition": "XMLやHTMLの文書を木構造のオブジェクトとして扱い、要素などをプログラムから参照・変更するための仕組みです。",
    "example": "JavaScriptから文書中の要素を取得して表示を書き換えます。",
    "related": [
      "sax",
      "xml"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "文書を木構造のオブジェクトとして参照・変更できる仕組み",
        "hint": "文書をどのような構造として扱いますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sax",
    "name": "SAX",
    "reading": "Simple Application Programming Interface for Extensible Markup Language",
    "category": "マルチメディア",
    "definition": "XMLを先頭から順番に読み、要素の開始や終了などをイベントとして通知して処理する仕組みです。文書全体を木構造として保持せずに処理できます。",
    "example": "大量のXMLを読みながら、必要な要素の値を順次集計します。",
    "related": [
      "dom-sax",
      "xml"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "XMLを順に読み、要素などのイベントに応じて処理する",
        "hint": "文書全体を保持せず、どのように読み進めますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "outline-font",
    "name": "アウトラインフォント",
    "reading": "Outline font",
    "category": "マルチメディア",
    "definition": "文字の形を輪郭線（座標と曲線）で表すフォントです。拡大・縮小しても滑らかに表示できます。点の集まりで表すビットマップフォントは、拡大するとギザギザになります。",
    "example": "同じフォントで見出しを72ポイントにしても、アウトラインフォントなら輪郭が滑らかです。",
    "related": [
      "svg",
      "bitmap-font"
    ],
    "criteria": [
      {
        "id": "outline",
        "title": "文字の輪郭を座標と曲線で表す",
        "hint": "文字の形をどう持ちますか？"
      },
      {
        "id": "scale",
        "title": "拡大しても滑らか",
        "hint": "拡大するとどうなりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "bandwidth",
    "name": "帯域幅",
    "aliases": [
      "フレーム",
      "ピクセル"
    ],
    "reading": "Bandwidth",
    "category": "ネットワーク",
    "definition": "回線が単位時間に送れるデータ量（ビット/秒）です。動画配信では「1フレームのデータ量×1秒当たりのフレーム数」で必要な帯域幅を見積もります。",
    "example": "1フレーム1Mビットを30フレーム/秒で送るには、30Mビット/秒が必要です。",
    "related": [],
    "criteria": [
      {
        "id": "rate",
        "title": "単位時間に送れるデータ量（bps）",
        "hint": "単位は何ですか？"
      },
      {
        "id": "calc",
        "title": "1フレームのデータ量×フレーム数/秒で必要量を求める",
        "hint": "動画の必要帯域はどう計算しますか？",
        "level": "deep"
      },
      {
        "id": "compress",
        "title": "圧縮率や伝送効率を考慮して実際の必要量を求める",
        "hint": "圧縮されているときは？",
        "level": "deep"
      },
      {
        "id": "pixel",
        "title": "1フレームのデータ量は画素数×1画素のビット数",
        "hint": "1フレームのデータ量は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "risc-cisc",
    "name": "RISC",
    "reading": "Reduced Instruction Set Computer",
    "category": "コンピュータ構成",
    "definition": "単純な命令を中心に構成するCPUの設計方式です。命令の実行をそろえやすく、パイプライン処理などによる高速化に適しています。",
    "example": "単純なロード命令や演算命令を組み合わせて処理します。",
    "related": [
      "cisc",
      "instruction-set"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "単純な命令を中心とした命令セットを採用するCPUの方式",
        "hint": "命令の複雑さにどのような特徴がありますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cisc",
    "name": "CISC",
    "reading": "Complex Instruction Set Computer",
    "category": "コンピュータ構成",
    "definition": "複雑で多機能な命令を含む命令セットを採用するCPUの設計方式です。1命令で複数の操作を行える命令などを持ちます。",
    "example": "メモリのデータを読み出して演算する処理を、一つの命令で指定します。",
    "related": [
      "risc-cisc",
      "instruction-set"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "複雑で多機能な命令を含む命令セットを採用するCPUの方式",
        "hint": "1命令で行う処理にどのような特徴がありますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "instruction-set",
    "name": "命令セット",
    "reading": "Instruction set",
    "category": "コンピュータ構成",
    "definition": "CPUが実行できる機械語命令の集合です。演算やデータ転送、分岐などの命令の種類や形式を定めます。",
    "example": "CPUごとに、実行できる加算命令や分岐命令の形式が決まっています。",
    "related": [
      "risc-cisc",
      "cisc"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "CPUが実行できる命令の集合",
        "hint": "何の命令を集めたものですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "vliw",
    "name": "VLIW",
    "reading": "Very Long Instruction Word",
    "category": "コンピュータ構成",
    "definition": "同時に実行できる複数の命令を、コンパイル時に1つの長い命令語にまとめておき、CPUがそれを並列に実行する方式です。並列化をハードウェアではなくコンパイラが行う点が特徴です。",
    "example": "加算・乗算・ロードを1つの長い命令に詰め、3つの演算器で同時に実行します。",
    "related": [
      "risc-cisc"
    ],
    "criteria": [
      {
        "id": "pack",
        "title": "複数の命令を1つの長い命令語にまとめる",
        "hint": "命令をどうまとめますか？"
      },
      {
        "id": "compiler",
        "title": "並列に実行できる命令の組合せをコンパイラが決める",
        "hint": "並列化を決めるのは誰ですか？"
      }
    ],
    "commonMistakes": [
      "実行時にCPUが命令を並べ替える方式（アウトオブオーダー実行）と混同する誤りがあります。"
    ]
  },
  {
    "id": "flynn",
    "name": "フリンの分類",
    "aliases": [
      "MIMD",
      "SIMD"
    ],
    "reading": "Flynn's taxonomy",
    "category": "コンピュータ構成",
    "definition": "コンピュータの並列処理方式を、命令の流れとデータの流れが単一か複数かという二つの軸で整理する分類です。SISD・SIMD・MISD・MIMDの四つの区分があります。",
    "example": "GPUのように1つの命令で多数のデータを処理するのはSIMD、マルチコアCPUが別々の命令を実行するのはMIMDです。",
    "related": [],
    "criteria": [
      {
        "id": "axes",
        "title": "命令の流れとデータの流れが単一か複数かで分類する",
        "hint": "何と何で分類しますか？"
      },
      {
        "id": "types",
        "title": "命令流とデータ流の単一・複数の組合せでSISD・SIMD・MISD・MIMDに分類する",
        "hint": "二つの分類軸の組合せで、どのような区分になりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "capacity-planning",
    "name": "キャパシティプランニング",
    "aliases": [
      "ボトルネック",
      "チューニング",
      "リソース"
    ],
    "reading": "Capacity planning",
    "category": "システム構成",
    "definition": "将来の業務量を予測し、それを処理するために必要なCPU・メモリ・ディスク・回線などのリソースを計画することです。現状の性能を測ってボトルネックを見つけ、増強やチューニングの時期と規模を決めます。",
    "example": "来年の注文が1.5倍になる予測から、CPU使用率が上限を超える時期を見積もり、サーバを増やします。",
    "related": [],
    "criteria": [
      {
        "id": "forecast",
        "title": "将来の業務量を予測して必要なリソースを見積もる",
        "hint": "何をもとに計画しますか？"
      },
      {
        "id": "bottleneck",
        "title": "性能を制約しているボトルネックを特定する",
        "hint": "まず何を見つけますか？",
        "level": "deep"
      },
      {
        "id": "steps",
        "title": "現状把握→予測→構成の決定→監視と見直しの流れで進める",
        "hint": "計画の手順は？",
        "level": "deep"
      },
      {
        "id": "tuning",
        "title": "増強の前に設定やプログラムのチューニングで改善できることもある",
        "hint": "機器を増やす以外の手は？",
        "level": "deep"
      },
      {
        "id": "margin",
        "title": "ピーク時の負荷と余裕率を考慮する",
        "hint": "平均値だけで計画してよいですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "throughput",
    "name": "スループット",
    "reading": "Throughput",
    "category": "システム構成",
    "definition": "システムが単位時間当たりに処理できる仕事やデータの量を表す性能指標です。",
    "example": "1秒間に500件の注文を処理するなら、500件/秒です。",
    "related": [
      "response-time",
      "turnaround-time",
      "capacity-planning"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "単位時間当たりの処理量を表す",
        "hint": "何を時間で割った指標ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "response-time",
    "name": "応答時間",
    "aliases": [
      "レスポンスタイム"
    ],
    "reading": "Response time",
    "category": "システム構成",
    "definition": "要求を出してから、その要求に対する応答が返るまでにかかる時間を表す性能指標です。測定では応答開始や完了などの終点を定めます。",
    "example": "検索ボタンを押してから結果が返るまでの時間を測ります。",
    "related": [
      "throughput",
      "turnaround-time",
      "capacity-planning"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "要求を出してから応答が返るまでにかかる時間",
        "hint": "どの時点からどの時点までの時間ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "turnaround-time",
    "name": "ターンアラウンドタイム",
    "reading": "Turnaround time",
    "category": "システム構成",
    "definition": "ジョブなどを依頼してから、処理が完了して結果をすべて受け取るまでにかかる時間です。",
    "example": "夜間バッチを依頼してから、出力結果を受け取るまでの時間を測ります。",
    "related": [
      "throughput",
      "response-time",
      "capacity-planning"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "処理を依頼してから結果をすべて受け取るまでの時間",
        "hint": "処理のどの時点までを測りますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cache-memory",
    "name": "キャッシュメモリ",
    "aliases": [
      "キャッシュ",
      "主記憶",
      "ヒット率",
      "実効メモリアクセス時間"
    ],
    "reading": "Cache memory",
    "category": "コンピュータ構成",
    "definition": "CPUと主記憶の速度差を埋めるために置く、小容量で高速なメモリです。必要なデータがキャッシュにある割合をヒット率といい、実効メモリアクセス時間は「キャッシュの時間×ヒット率＋主記憶の時間×(1−ヒット率)」で求めます。",
    "example": "キャッシュ10ns、主記憶60ns、ヒット率90%なら、実効アクセス時間は10×0.9＋60×0.1＝15nsです。",
    "related": [
      "lru"
    ],
    "criteria": [
      {
        "id": "gap",
        "title": "CPUと主記憶の速度差を埋める高速・小容量のメモリ",
        "hint": "何のために置きますか？"
      },
      {
        "id": "hit",
        "title": "ヒット率はデータがキャッシュにある割合",
        "hint": "ヒット率とは？",
        "level": "deep"
      },
      {
        "id": "effective",
        "title": "ヒット時とミス時の所要時間を、それぞれの発生割合で加重平均して実効アクセス時間を求める",
        "hint": "ミス時に必要な処理も含め、平均時間をどう求めますか？",
        "level": "deep"
      },
      {
        "id": "locality",
        "title": "参照の局所性があるためキャッシュが効く",
        "hint": "なぜ小容量でも効果がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "embedded-system",
    "name": "組込みシステム",
    "reading": "Embedded system",
    "category": "システム構成",
    "definition": "家電・自動車・産業機器などに組み込まれ、特定の機能を実現するコンピュータシステムです。限られた資源で、決められた時間内に確実に応答するリアルタイム性が求められます。",
    "example": "炊飯器のマイコンが温度センサーの値を読み、ヒーターを制御します。",
    "related": [
      "rtos"
    ],
    "criteria": [
      {
        "id": "dedicated",
        "title": "機器に組み込まれ特定の機能を実現する",
        "hint": "汎用PCとの違いは？"
      },
      {
        "id": "realtime",
        "title": "決められた時間内に応答するリアルタイム性が求められる",
        "hint": "どんな性能が求められますか？",
        "level": "deep"
      },
      {
        "id": "resource",
        "title": "メモリや電力など限られた資源で動作する",
        "hint": "どんな制約がありますか？",
        "level": "deep"
      },
      {
        "id": "update",
        "title": "出荷後の更新が難しく、脆弱性が長く残りやすい",
        "hint": "セキュリティ上の課題は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "chattering",
    "name": "チャタリング",
    "reading": "Chattering",
    "category": "システム構成",
    "definition": "機械式スイッチを押したり離したりした直後に、接点が細かく振動して信号がON/OFFを短時間に繰り返す現象です。一定時間待ってから状態を読み直す（ソフトウェアでの待ち、またはハードウェアの回路）ことで対策します。",
    "example": "ボタンを1回押しただけなのに、カウンタが3回増えてしまう原因になります。",
    "related": [
      "embedded-system"
    ],
    "criteria": [
      {
        "id": "bounce",
        "title": "スイッチの接点が振動しON/OFFが短時間に繰り返される",
        "hint": "押した直後に信号はどうなりますか？"
      },
      {
        "id": "measure",
        "title": "一定時間待って状態を再確認するなどで除去する",
        "hint": "どう対策しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cpi",
    "name": "CPI",
    "aliases": [
      "クロック周期",
      "動作周波数",
      "IPC"
    ],
    "reading": "Cycles Per Instruction",
    "category": "コンピュータ構成",
    "definition": "1命令の実行に平均何クロックかかるかを表す値です。処理時間は「命令数×CPI×クロック周期」、クロック周期は動作周波数の逆数です。逆数のIPCは1クロックに実行できる命令数です。",
    "example": "2GHz（周期0.5ns）でCPI=4なら、1命令に2ns、1秒に5億命令を実行します。",
    "related": [],
    "criteria": [
      {
        "id": "def",
        "title": "1命令当たりの平均クロック数",
        "hint": "CPIは何を表しますか？"
      },
      {
        "id": "time",
        "title": "処理時間＝命令数×CPI×クロック周期",
        "hint": "処理時間はどう求めますか？",
        "level": "deep"
      },
      {
        "id": "period",
        "title": "クロック周期は動作周波数の逆数",
        "hint": "2GHzのクロック周期は？",
        "level": "deep"
      },
      {
        "id": "average",
        "title": "命令の種類ごとのCPIを出現率で加重平均して平均CPIを求める",
        "hint": "命令ごとに違うときは？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "EVMのCPI（コスト効率指数）と同じ略語なので文脈で区別します。"
    ]
  },
  {
    "id": "mtbf-mttr",
    "name": "MTBF",
    "aliases": [
      "平均故障間隔"
    ],
    "reading": "Mean Time Between Failures",
    "category": "システム構成",
    "definition": "修理して使用するシステムなどが、故障と故障の間に正常に稼働する時間の平均です。平均故障間隔とも呼び、信頼性の指標になります。",
    "example": "合計990時間稼働する間に10回故障したなら、MTBFは99時間です。",
    "related": [
      "mttr",
      "availability"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "故障と故障の間の正常稼働時間の平均",
        "hint": "修理している時間ではなく、何の平均ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "mttr",
    "name": "MTTR",
    "aliases": [
      "平均修理時間"
    ],
    "reading": "Mean Time To Repair",
    "category": "システム構成",
    "definition": "故障したシステムなどの修理にかかる時間の平均です。平均修理時間とも呼び、保守性の指標になります。",
    "example": "10回の修理に合計20時間かかったなら、MTTRは2時間です。",
    "related": [
      "mtbf-mttr",
      "availability"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "故障から修理完了までにかかる時間の平均",
        "hint": "稼働時間ではなく、何の平均ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "virtual-memory",
    "name": "仮想記憶",
    "aliases": [
      "ページ置換え",
      "ページイン",
      "ページング方式",
      "セグメンテーション方式"
    ],
    "reading": "Virtual memory",
    "category": "ソフトウェア",
    "definition": "主記憶より大きなアドレス空間を、補助記憶を使って仮想的に提供する仕組みです。ページング方式では固定長のページ単位で、セグメンテーション方式では可変長の論理的なまとまり単位で管理し、必要なページを主記憶に読み込み（ページイン）、足りなければページ置換えで追い出します。",
    "example": "8GBのメモリしかないPCでも、使っていないページをディスクに退避して大きなプログラムを動かせます。",
    "related": [
      "lru",
      "fifo"
    ],
    "criteria": [
      {
        "id": "larger",
        "title": "補助記憶を使い主記憶より大きなアドレス空間を提供する",
        "hint": "何を実現する仕組みですか？"
      },
      {
        "id": "paging",
        "title": "ページング方式は固定長のページ単位で管理する",
        "hint": "ページング方式の単位は？",
        "level": "deep"
      },
      {
        "id": "replace",
        "title": "主記憶が足りないとページ置換えで追い出し、必要なページをページインする",
        "hint": "空きがないときは？",
        "level": "deep"
      },
      {
        "id": "pagefault",
        "title": "主記憶にないページを参照するとページフォールトが起きる",
        "hint": "ないページを参照すると？",
        "level": "deep"
      },
      {
        "id": "thrashing",
        "title": "ページ置換えが頻発して処理が進まない状態をスラッシングという",
        "hint": "置換えが多すぎるとどうなりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "fragmentation",
    "name": "断片化（フラグメンテーション）",
    "aliases": [
      "外部断片化",
      "内部断片化"
    ],
    "reading": "Fragmentation",
    "category": "ソフトウェア",
    "definition": "メモリの割当てと解放を繰り返すうちに、使えない小さな空きができる現象です。空き領域が細切れになって大きな領域を確保できない外部断片化と、割り当てた領域の内部に使われない余りが出る内部断片化があります。",
    "example": "固定長4KBのページに1KBのデータを置くと3KBが無駄になる（内部断片化）。",
    "related": [
      "virtual-memory"
    ],
    "criteria": [
      {
        "id": "external",
        "title": "外部断片化は空きが細切れになり合計は足りても連続領域を確保できない",
        "hint": "空きの合計は足りているのに確保できないのは？"
      },
      {
        "id": "internal",
        "title": "内部断片化は割り当てた固定長領域の中に未使用部分が残る",
        "hint": "割当て単位の中の無駄は？"
      },
      {
        "id": "paging",
        "title": "ページングは外部断片化が起きないが内部断片化が起き得る",
        "hint": "ページング方式の長所は？",
        "level": "deep"
      },
      {
        "id": "compaction",
        "title": "空き領域をまとめ直すことで、外部断片化を解消できる場合がある",
        "hint": "細切れの空き領域には、どのような対処ができますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "iot",
    "name": "IoT",
    "aliases": [
      "センサーノード",
      "ゲートウェイ"
    ],
    "reading": "Internet of Things",
    "category": "システム構成",
    "definition": "センサーや機器など様々なモノをネットワークにつなぎ、データを収集・活用したり遠隔から制御したりする仕組みです。センサーノードのデータはゲートウェイを経由してクラウドなどに送られます。",
    "example": "工場の機械の振動センサーのデータを集め、故障の予兆を検知します。",
    "related": [
      "edge-computing"
    ],
    "criteria": [
      {
        "id": "connect",
        "title": "モノをネットワークにつないでデータを収集・活用する",
        "hint": "何をネットワークにつなぎますか？"
      },
      {
        "id": "gateway",
        "title": "センサーノードのデータはゲートウェイで集約・変換して上位へ送る",
        "hint": "センサーとクラウドの間に何を置きますか？",
        "level": "deep"
      },
      {
        "id": "constraint",
        "title": "IoT機器は電力・計算能力が限られ、セキュリティ対策が難しい",
        "hint": "IoT機器の課題は？",
        "level": "deep"
      },
      {
        "id": "mirai",
        "title": "初期パスワードのままの機器がボットネットに悪用された（Mirai）",
        "hint": "実際に起きた被害は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "intermittent",
    "name": "間欠動作",
    "aliases": [
      "平均電流"
    ],
    "reading": "Intermittent operation",
    "category": "システム構成",
    "definition": "機器を常に動かさず、必要なときだけ動作させて残りは休止（スリープ）させ、消費電力を抑える方法です。平均電流は「動作時の電流×動作時間の割合＋休止時の電流×休止時間の割合」で求めます。",
    "example": "10秒ごとに1秒だけ20mAで動き、残り9秒は0.1mAなら、平均電流は2.09mAです。",
    "related": [
      "iot"
    ],
    "criteria": [
      {
        "id": "sleep",
        "title": "必要なときだけ動作し、他は休止して電力を抑える",
        "hint": "どうやって省電力にしますか？"
      },
      {
        "id": "average",
        "title": "平均電流は動作と休止の電流を時間の割合で加重平均する",
        "hint": "平均電流はどう求めますか？",
        "level": "deep"
      },
      {
        "id": "battery",
        "title": "電池の寿命は容量÷平均電流で見積もる",
        "hint": "電池が何時間もつか求めるには？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "poe",
    "name": "PoE",
    "reading": "Power over Ethernet",
    "category": "ネットワーク",
    "definition": "LANケーブルを通じて、データと一緒に電力を供給する技術です。無線LANのアクセスポイントやネットワークカメラなど、電源を取りにくい場所の機器に使います。",
    "example": "天井の無線LANアクセスポイントに、PoE対応スイッチからLANケーブル1本で給電します。",
    "related": [],
    "criteria": [
      {
        "id": "power",
        "title": "LANケーブルでデータと同時に電力を供給する",
        "hint": "何を一緒に送りますか？"
      },
      {
        "id": "use",
        "title": "電源工事が難しい場所の無線LANアクセスポイントやカメラに使う",
        "hint": "どんな機器に使いますか？",
        "level": "deep"
      },
      {
        "id": "budget",
        "title": "スイッチ全体で供給できる電力の上限に注意する",
        "hint": "多数の機器をつなぐときの注意は？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "電力線で通信するPLCと混同する誤りがあります。"
    ]
  },
  {
    "id": "plc",
    "name": "PLC",
    "reading": "Programmable Logic Controller",
    "category": "システム構成",
    "definition": "工場の機械や設備などを制御するためのプログラム可能な装置です。入力信号や設定した手順に従って出力を制御します。ここではProgrammable Logic Controllerを扱います。",
    "example": "生産ラインのベルトコンベアの動きはPLCが制御し、MESはその上位で作業指示を出します。",
    "related": [],
    "criteria": [
      {
        "id": "controller",
        "title": "制御用のPLCは機械や設備をシーケンス制御する装置",
        "hint": "工場でのPLCの役割は？"
      },
      {
        "id": "layer",
        "title": "製造業の階層では、PLCは制御層、MESは実行層、ERPは計画層に位置づく",
        "hint": "製造システムの階層での位置は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ups",
    "name": "UPS",
    "reading": "Uninterruptible Power Supply",
    "category": "システム構成",
    "definition": "停電や瞬断のときに、内蔵バッテリーから一定時間電力を供給する無停電電源装置です。その間にシステムを安全に停止したり、自家発電に切り替えたりします。",
    "example": "停電時、UPSが10分間給電している間にサーバを正常にシャットダウンします。",
    "related": [],
    "criteria": [
      {
        "id": "battery",
        "title": "停電時にバッテリーから一定時間給電する",
        "hint": "停電時に何をしますか？"
      },
      {
        "id": "shutdown",
        "title": "その間に安全な停止や発電機への切替えを行う",
        "hint": "給電中に何をしますか？",
        "level": "deep"
      },
      {
        "id": "surge",
        "title": "瞬断や電圧変動からも機器を守る",
        "hint": "停電以外に防げるものは？",
        "level": "deep"
      },
      {
        "id": "capacity",
        "title": "接続機器の消費電力と必要時間から容量を決める",
        "hint": "UPSの容量はどう決めますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cluster",
    "name": "クラスタ構成",
    "aliases": [
      "コールドスタンバイ",
      "セッション"
    ],
    "reading": "Cluster",
    "category": "システム構成",
    "definition": "複数のサーバを連携させて1つのシステムとして動かし、可用性や処理能力を高める構成です。待機系の状態により、ホットスタンバイ（すぐ切替え）、ウォームスタンバイ、コールドスタンバイ（停止状態から起動）に分かれます。",
    "example": "2台のWebサーバでセッション情報を共有しておけば、1台が止まっても利用者は再ログインせずに続けられます。",
    "related": [
      "fault-tolerance"
    ],
    "criteria": [
      {
        "id": "multiple",
        "title": "複数のサーバを1つのシステムとして運用する",
        "hint": "クラスタとは？"
      },
      {
        "id": "session",
        "title": "切替え後も処理を続けるには、セッション情報を共有する必要がある",
        "hint": "利用者のログイン状態を保つには？",
        "level": "deep"
      },
      {
        "id": "loadbalance",
        "title": "負荷分散型は全サーバで処理を分担する",
        "hint": "現用・待機以外の方式は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "compiler",
    "name": "コンパイラ",
    "aliases": [
      "コンパイル",
      "字句解析",
      "構文解析",
      "意味解析",
      "最適化",
      "コード生成"
    ],
    "reading": "Compiler",
    "category": "ソフトウェア",
    "definition": "ソースプログラムを、機械語などの目的プログラムへ翻訳するソフトウェアです。字句解析・構文解析などを経てコードを生成し、必要に応じて最適化します。",
    "example": "C言語のソースをコンパイルして実行ファイルを作り、その後は翻訳なしで実行します。",
    "related": [
      "ide"
    ],
    "criteria": [
      {
        "id": "translate",
        "title": "ソースプログラムを一括して目的プログラムに翻訳する",
        "hint": "何をするソフトウェアですか？"
      },
      {
        "id": "order",
        "title": "字句解析→構文解析→意味解析→最適化→コード生成の順に処理する",
        "hint": "処理の順序は？",
        "level": "deep"
      },
      {
        "id": "optimize",
        "title": "最適化では実行速度やサイズを改善するようコードを変換する",
        "hint": "最適化で何をしますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ide",
    "name": "統合開発環境（IDE）",
    "aliases": [
      "リンカ",
      "デバッガ"
    ],
    "reading": "Integrated Development Environment",
    "category": "開発技術",
    "definition": "ソースコードの編集、ビルド、実行、デバッグなどを一つの環境で行えるようにした開発支援ソフトウェアです。",
    "example": "IDEでソースを書き、ボタン一つでビルドし、ブレークポイントで止めて変数を確認します。",
    "related": [
      "compiler"
    ],
    "criteria": [
      {
        "id": "integrate",
        "title": "エディタ・コンパイラ・デバッガなどを統合した環境",
        "hint": "何をまとめていますか？"
      },
      {
        "id": "flow",
        "title": "編集・ビルド・実行・デバッグを1つの環境で行える",
        "hint": "IDEで何ができますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "actuator",
    "name": "アクチュエーター",
    "reading": "Actuator",
    "category": "システム構成",
    "definition": "コンピュータからの電気信号を、回転・移動などの物理的な動きに変換する装置です。モーターや電磁弁が代表です。逆に、温度や光など物理量を電気信号に変えるのがセンサーです。",
    "example": "エアコンは温度センサーで室温を測り、アクチュエーターのファンや弁を動かして調整します。",
    "related": [
      "feedback-control",
      "sensor"
    ],
    "criteria": [
      {
        "id": "motion",
        "title": "電気信号を物理的な動きに変える",
        "hint": "何を何に変えますか？"
      },
      {
        "id": "example",
        "title": "モーター、電磁弁、油圧シリンダなどがある",
        "hint": "代表例は？",
        "level": "deep"
      },
      {
        "id": "loop",
        "title": "センサー→制御→アクチュエーターでフィードバック制御を構成する",
        "hint": "三つの関係は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "feedback-control",
    "name": "フィードバック制御",
    "reading": "Feedback control",
    "category": "システム構成",
    "definition": "制御した結果をセンサーで測って目標値と比べ、その差をなくすように操作量を調整し続ける制御方式です。外乱があっても目標に近づけられます。",
    "example": "エアコンが室温を測り、設定温度より高ければ冷房を強めます。",
    "related": [
      "actuator"
    ],
    "criteria": [
      {
        "id": "compare",
        "title": "結果を測って目標値と比較する",
        "hint": "何と何を比べますか？"
      },
      {
        "id": "correct",
        "title": "差（偏差）をなくすよう操作量を調整する",
        "hint": "差があればどうしますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "fail-safe",
    "name": "フェールセーフ",
    "reading": "Fail-safe",
    "category": "システム構成",
    "definition": "装置やシステムが故障したとき、安全な状態に移行するように設計する考え方です。",
    "example": "制御装置が故障したら機械を停止して、事故を防ぐようにします。",
    "related": [
      "fail-soft",
      "foolproof",
      "fail-secure",
      "fault-tolerance"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "故障したときに安全な状態になるよう設計する",
        "hint": "故障時にどのような状態へ移しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "fail-soft",
    "name": "フェールソフト",
    "reading": "Fail-soft",
    "category": "システム構成",
    "definition": "システムの一部が故障しても、機能や性能を縮小して動作を継続できるようにする考え方です。",
    "example": "故障した装置を切り離し、残りの装置でサービスを続けます。",
    "related": [
      "fail-safe",
      "foolproof",
      "fail-secure",
      "fault-tolerance"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "故障時に機能や性能を縮小しながら稼働を続ける",
        "hint": "すべて止める代わりに、どのように動き続けますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "foolproof",
    "name": "フールプルーフ",
    "reading": "Foolproof",
    "category": "システム構成",
    "definition": "人が誤操作をしにくくし、誤操作をしても危険な状態にならないように設計する考え方です。",
    "example": "扉が開いている間は機械が動かないようにします。",
    "related": [
      "fail-safe",
      "fail-soft",
      "fail-secure",
      "fault-tolerance"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "人の誤操作を防ぎ、誤って操作しても危険にならないよう設計する",
        "hint": "機器の故障ではなく、誰のミスへの対策ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "fail-secure",
    "name": "フェールセキュア",
    "reading": "Fail-secure",
    "category": "システム構成",
    "definition": "故障などの異常が起きても、アクセスを拒否するなどしてセキュリティを維持する設計の考え方です。",
    "example": "認証機能が故障したとき、認証できない利用者のアクセスを拒否します。",
    "related": [
      "fail-safe",
      "fail-soft",
      "foolproof",
      "fault-tolerance"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "異常時にもアクセス拒否などによってセキュリティを維持する",
        "hint": "認証できない状態になったらアクセスをどう扱いますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "pipeline",
    "name": "パイプライン",
    "aliases": [
      "分岐予測",
      "投機実行",
      "遅延分岐"
    ],
    "reading": "Pipeline",
    "category": "コンピュータ構成",
    "definition": "命令の実行を取出し・解読・実行などの段階に分け、複数の命令を少しずつずらして並行に処理する方式です。分岐命令などで流れが乱れる（ハザード）と効率が落ちるため、分岐予測や投機実行、遅延分岐で対処します。",
    "example": "5段のパイプラインでは、理想的には毎クロック1命令ずつ完了します。",
    "related": [
      "risc-cisc"
    ],
    "criteria": [
      {
        "id": "stage",
        "title": "命令の処理を段階に分け、ずらして並行に実行する",
        "hint": "どうやって高速化しますか？"
      },
      {
        "id": "hazard",
        "title": "分岐やデータの依存で流れが乱れる（ハザード）",
        "hint": "何で効率が落ちますか？",
        "level": "deep"
      },
      {
        "id": "speculative",
        "title": "分岐予測で先の命令を投機実行し、外れたら結果を捨てる",
        "hint": "分岐の結果を待たずに進めるには？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "out-of-order",
    "name": "アウトオブオーダー実行",
    "aliases": [
      "レジスタリネーミング"
    ],
    "reading": "Out-of-order execution",
    "category": "コンピュータ構成",
    "definition": "命令をプログラムの順序どおりではなく、実行できるものから順に実行してCPUの演算器を有効に使う方式です。レジスタリネーミングで見かけ上の依存をなくし、結果はプログラムの順序で確定させます。",
    "example": "メモリ読込みを待っている命令を後回しにして、後ろの独立した加算命令を先に実行します。",
    "related": [
      "pipeline"
    ],
    "criteria": [
      {
        "id": "reorder",
        "title": "実行可能な命令から順序を入れ替えて実行する",
        "hint": "命令の順序はどう扱われますか？"
      },
      {
        "id": "commit",
        "title": "結果はプログラム順に確定させ、正しさを保つ",
        "hint": "結果の反映順序は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "scaling",
    "name": "スケールアウト",
    "reading": "Scale out",
    "category": "システム構成",
    "definition": "サーバーなどの台数を増やして、システム全体の処理能力を高める方法です。",
    "example": "Webサーバーを4台から8台に増やして負荷を分散します。",
    "related": [
      "scale-up",
      "scale-in",
      "scale-down"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "サーバーなどの台数を増やして処理能力を高める",
        "hint": "増やすのは1台の性能ですか、台数ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "scale-up",
    "name": "スケールアップ",
    "reading": "Scale up",
    "category": "システム構成",
    "definition": "CPUやメモリなどを増強し、1台のサーバーなどの処理能力を高める方法です。",
    "example": "サーバーのメモリを増やして処理能力を高めます。",
    "related": [
      "scaling",
      "scale-in",
      "scale-down"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "1台の機器の性能を上げて処理能力を高める",
        "hint": "台数ではなく、何を増強しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "scale-in",
    "name": "スケールイン",
    "reading": "Scale in",
    "category": "システム構成",
    "definition": "サーバーなどの台数を減らし、必要な規模にシステムを縮小する方法です。",
    "example": "アクセスが減ったのでWebサーバーを8台から4台に減らします。",
    "related": [
      "scaling",
      "scale-up",
      "scale-down"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "サーバーなどの台数を減らす",
        "hint": "減らすのは性能ですか、台数ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "scale-down",
    "name": "スケールダウン",
    "reading": "Scale down",
    "category": "システム構成",
    "definition": "CPUやメモリなどの割当てを減らし、1台のサーバーなどの性能を下げる方法です。",
    "example": "負荷の小さい仮想サーバーのメモリ割当てを減らします。",
    "related": [
      "scaling",
      "scale-up",
      "scale-in"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "1台の機器の性能や資源の割当てを下げる",
        "hint": "台数ではなく、何を減らしますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "grid-computing",
    "name": "グリッドコンピューティング",
    "reading": "Grid computing",
    "category": "システム構成",
    "definition": "ネットワーク上の多数のコンピュータの計算資源を結び付け、1つの大きな計算機のように使って大規模な計算を行う方式です。",
    "example": "世界中のPCの空き時間を使って、たんぱく質の構造解析を分担して計算します。",
    "related": [
      "edge-computing"
    ],
    "criteria": [
      {
        "id": "pool",
        "title": "ネットワーク上の多数のコンピュータの資源を束ねる",
        "hint": "何を結び付けますか？"
      },
      {
        "id": "large",
        "title": "大規模な計算を分担して処理する",
        "hint": "何に使いますか？",
        "level": "deep"
      },
      {
        "id": "heterogeneous",
        "title": "異なる場所や管理主体の計算資源を連携させて利用できる",
        "hint": "資源の場所や管理者に注目すると、どのような特徴がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "energy-harvesting",
    "name": "エネルギーハーベスティング",
    "reading": "Energy harvesting",
    "category": "システム構成",
    "definition": "周囲の光・振動・熱・電波などのわずかなエネルギーを集めて電力に変える技術です。電池交換や配線が難しいIoTのセンサーなどの電源に使います。",
    "example": "橋に付けたセンサーが、車の通行による振動で発電して計測データを送ります。",
    "related": [
      "iot",
      "intermittent"
    ],
    "criteria": [
      {
        "id": "ambient",
        "title": "周囲の光・振動・熱などから微小な電力を得る",
        "hint": "何から電力を得ますか？"
      },
      {
        "id": "iot",
        "title": "電池交換が難しいIoT機器の電源に使う",
        "hint": "どんな機器に向きますか？",
        "level": "deep"
      },
      {
        "id": "lowpower",
        "title": "得られる電力は小さいため、間欠動作などの低消費電力設計と組み合わせる",
        "hint": "電力が小さい点はどう補いますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "wearable",
    "name": "ウェアラブルデバイス",
    "reading": "Wearable device",
    "category": "システム構成",
    "definition": "腕時計や眼鏡のように身に着けて使うコンピュータ機器です。心拍や歩数などを常時計測し、スマートフォンやクラウドと連携します。",
    "example": "スマートウォッチが睡眠中の心拍を記録し、アプリで睡眠の質を表示します。",
    "related": [
      "iot"
    ],
    "criteria": [
      {
        "id": "wear",
        "title": "身に着けて使う機器",
        "hint": "どう使う機器ですか？"
      },
      {
        "id": "sense",
        "title": "体の情報を継続的に計測して連携する",
        "hint": "何を計測しますか？",
        "level": "deep"
      },
      {
        "id": "privacy",
        "title": "健康情報など機微な個人情報を扱うため保護が重要",
        "hint": "注意すべき情報は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "provisioning",
    "name": "プロビジョニング",
    "aliases": [
      "サーバプロビジョニングツール"
    ],
    "reading": "Provisioning",
    "category": "システム構成",
    "definition": "利用者や業務の需要に応じて、サーバ・ネットワーク・アカウントなどの資源を準備し、すぐ使える状態に設定することです。サーバプロビジョニングツールを使うと、OSやソフトウェアの設定を自動で行えます。",
    "example": "クラウドで新しい開発環境を申請すると、数分でサーバとアカウントが用意されます。",
    "related": [
      "iac"
    ],
    "criteria": [
      {
        "id": "prepare",
        "title": "需要に応じて資源を準備し使える状態にする",
        "hint": "何をすることですか？"
      },
      {
        "id": "auto",
        "title": "ツールで設定を自動化し、手作業の誤りや時間を減らす",
        "hint": "ツールを使う利点は？",
        "level": "deep"
      },
      {
        "id": "account",
        "title": "アカウントのプロビジョニングでは入社・異動・退職に合わせて権限を付与・削除する",
        "hint": "IDの管理では？",
        "level": "deep"
      },
      {
        "id": "deprovision",
        "title": "不要になった資源・権限の削除（デプロビジョニング）も重要",
        "hint": "終わったときに必要なことは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "iac",
    "name": "IaC",
    "aliases": [
      "インフラ",
      "Infrastructure as Code"
    ],
    "reading": "Infrastructure as Code",
    "category": "システム構成",
    "definition": "サーバやネットワークなどのインフラの構成をコードとして記述し、そのコードから自動で構築・変更する手法です。手作業による設定のばらつきを防ぎ、同じ環境を何度でも再現できます。",
    "example": "構成ファイルを実行するだけで、本番と同じ構成の検証環境を作ります。",
    "related": [
      "provisioning",
      "ci"
    ],
    "criteria": [
      {
        "id": "code",
        "title": "インフラの構成をコードで記述する",
        "hint": "構成をどう管理しますか？"
      },
      {
        "id": "reproduce",
        "title": "同じ環境を自動で何度でも再現でき、手作業の誤りを減らす",
        "hint": "利点は？",
        "level": "deep"
      },
      {
        "id": "vcs",
        "title": "コードなのでバージョン管理やレビューができる",
        "hint": "コード化で何ができるようになりますか？",
        "level": "deep"
      },
      {
        "id": "secret",
        "title": "コードに秘密情報を書かない、設定ミスを自動検査する",
        "hint": "セキュリティ上の注意は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "alive-monitoring",
    "name": "死活監視",
    "reading": "Alive monitoring",
    "category": "システム構成",
    "definition": "サーバや機器、サービスが動いているかどうかを定期的に確認する監視です。pingの応答やポートへの接続、プロセスの有無などで判断し、停止を検知したら通知します。",
    "example": "1分ごとにWebサーバへアクセスし、3回続けて応答がなければ担当者に通知します。",
    "related": [],
    "criteria": [
      {
        "id": "check",
        "title": "対象が稼働しているかを定期的に確認する",
        "hint": "何を確かめますか？"
      },
      {
        "id": "notify",
        "title": "停止を検知したら通知・対応する",
        "hint": "停止を見つけたらどうしますか？",
        "level": "deep"
      },
      {
        "id": "method",
        "title": "pingの応答、ポート接続、プロセスの確認など方法がある",
        "hint": "どうやって確認しますか？",
        "level": "deep"
      },
      {
        "id": "service",
        "title": "ping応答があってもサービスが止まっていることがあるため、サービスレベルで監視する",
        "hint": "pingだけで十分ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cloud-deployment",
    "name": "クラウドの配置モデル",
    "aliases": [
      "オンプレミス",
      "コミュニティクラウド"
    ],
    "reading": "Cloud deployment models",
    "category": "システム構成",
    "definition": "クラウドの利用者の範囲や、設備を共有する方法による分類です。パブリック・プライベート・コミュニティ・ハイブリッドなどの配置モデルがあります。",
    "example": "複数の自治体が共同で利用する行政システム基盤は、コミュニティクラウドの例です。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用者の範囲や設備の共有の仕方でクラウドを分類する",
        "hint": "クラウドをどのような観点で分類しますか？"
      },
      {
        "id": "selection",
        "title": "専用利用による管理の自由度と、共同利用による資源の効率化などを考えてモデルを選ぶ",
        "hint": "専用利用と共同利用には、どのような利点がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "system-integration",
    "name": "システムインテグレーション",
    "reading": "System integration",
    "category": "システム戦略",
    "definition": "顧客の要望に合わせて、システムの企画・設計・開発・構築・運用までを一括して請け負うサービスです。請け負う事業者をSIerと呼びます。",
    "example": "銀行の新しい勘定系システムを、ハードウェアの選定から運用まで一括で請け負います。",
    "related": [],
    "criteria": [
      {
        "id": "combine",
        "title": "複数のハードウェアやソフトウェアを組み合わせて1つのシステムにする",
        "hint": "インテグレーションとは何を統合しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rtos",
    "name": "リアルタイムOS",
    "aliases": [
      "プリエンプティブ",
      "優先度",
      "周期タスク",
      "スケジューリング"
    ],
    "reading": "Real-time operating system",
    "category": "ソフトウェア",
    "definition": "処理を決められた時間内に確実に終えることを重視したOSです。優先度に基づくプリエンプティブなスケジューリングで、優先度の高いタスクが来たら実行中のタスクを中断して切り替えます。",
    "example": "エアバッグ制御では、衝突の検知から数ミリ秒以内に展開の処理を必ず実行します。",
    "related": [
      "embedded-system"
    ],
    "criteria": [
      {
        "id": "deadline",
        "title": "決められた時間内に処理を終えることを保証する",
        "hint": "何を重視したOSですか？"
      },
      {
        "id": "preemptive",
        "title": "優先度の高いタスクが来ると実行中のタスクを中断して切り替える（プリエンプティブ）",
        "hint": "高い優先度のタスクが来たら？",
        "level": "deep"
      },
      {
        "id": "periodic",
        "title": "周期タスクは決まった周期で起動し、その周期内に終える必要がある",
        "hint": "周期タスクのスケジューリングで確認することは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ci",
    "name": "継続的インテグレーション",
    "reading": "Continuous Integration (CI)",
    "category": "開発技術",
    "definition": "開発者が変更したコードを頻繁に共有のリポジトリに統合し、そのたびに自動でビルドとテストを行う開発手法です。不具合を早く見つけ、統合時の手戻りを減らします。",
    "example": "コードを登録するたびに自動テストが走り、失敗したらすぐ開発者に通知されます。",
    "related": [
      "iac"
    ],
    "criteria": [
      {
        "id": "frequent",
        "title": "変更を頻繁に統合する",
        "hint": "どのくらいの頻度で統合しますか？"
      },
      {
        "id": "auto",
        "title": "統合のたびに自動でビルド・テストする",
        "hint": "統合時に何が自動で行われますか？"
      },
      {
        "id": "early",
        "title": "変更を小さく頻繁に検証し、統合時の不具合を早期に見つける",
        "hint": "頻繁に統合・テストすることで、どのような問題を減らせますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "two-phase-commit",
    "name": "2相コミット",
    "reading": "Two-phase commit",
    "category": "データベース",
    "definition": "分散データベースで、複数のサイトにまたがるトランザクションを全体としてコミットするか、全体として取り消すかをそろえるための手順です。第1相で各サイトにコミット可能かを問い合わせ、全員が可能なら第2相でコミットを指示します。",
    "example": "支店Aと支店Bの口座を同時に更新するとき、両方が準備完了と答えた場合だけ確定します。",
    "related": [
      "acid",
      "base"
    ],
    "criteria": [
      {
        "id": "phase1",
        "title": "第1相で調停者が各サイトにコミット可能か問い合わせる",
        "hint": "最初に何を確認しますか？"
      },
      {
        "id": "phase2",
        "title": "全サイトが可能ならコミット、1つでも不可ならロールバックを指示する",
        "hint": "結果がそろわないときは？"
      },
      {
        "id": "acid",
        "title": "分散環境でも原子性を守るための方式",
        "hint": "ACIDのどの性質を守りますか？",
        "level": "deep"
      },
      {
        "id": "block",
        "title": "調停者が障害で止まると参加者が待ち続ける（ブロッキング）ことがある",
        "hint": "2相コミットの弱点は？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "結果整合性を前提とするBASE特性の方式と混同する誤りがあります。"
    ]
  },
  {
    "id": "primary-key",
    "name": "主キー",
    "aliases": [
      "顧客ID"
    ],
    "reading": "Primary key",
    "category": "データベース",
    "definition": "表の中で行を一意に識別するために選んだ列（の組合せ）です。値の重複とNULLが許されません。行を一意に識別できる列の候補を候補キーといい、その中から1つを主キーに選びます。",
    "example": "顧客表では、同姓同名がいても重ならない顧客IDを主キーにします。",
    "related": [
      "normalization"
    ],
    "criteria": [
      {
        "id": "unique",
        "title": "行を一意に識別する",
        "hint": "主キーの役割は？"
      },
      {
        "id": "notnull",
        "title": "重複もNULLも許されない",
        "hint": "主キーに許されない値は？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "relational-database",
    "name": "関係データベース",
    "aliases": [
      "属性",
      "DBMS",
      "データモデル"
    ],
    "reading": "Relational database",
    "category": "データベース",
    "definition": "データを行と列からなる表（関係）で表し、表どうしを共通の値で関連付けて扱うデータベースです。DBMSがSQLによる検索や更新、整合性の維持、同時実行の制御を行います。",
    "example": "顧客表と注文表を顧客IDで結び付け、顧客ごとの注文一覧を取り出します。",
    "related": [
      "normalization",
      "primary-key"
    ],
    "criteria": [
      {
        "id": "table",
        "title": "データを行と列の表で表し、列を属性と呼ぶ",
        "hint": "データをどんな形で表しますか？"
      },
      {
        "id": "relate",
        "title": "表どうしを共通の列の値で関連付ける",
        "hint": "表どうしをどうつなぎますか？"
      },
      {
        "id": "dbms",
        "title": "DBMSがSQLによる操作や整合性・同時実行を管理する",
        "hint": "DBMSの役割は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "view",
    "name": "ビュー",
    "reading": "View",
    "category": "データベース",
    "definition": "1つ以上の表から必要な行や列を取り出して定義した仮想的な表です。実体のデータは持たず、参照するたびに元の表から求めます。利用者に見せる範囲を限定するアクセス制御にも使えます。",
    "example": "社員表から給与の列を除いたビューを作り、一般社員にはそのビューだけを参照させます。",
    "related": [
      "relational-database"
    ],
    "criteria": [
      {
        "id": "virtual",
        "title": "元の表から定義した仮想的な表で、データの実体は持たない",
        "hint": "ビューはデータを保存していますか？"
      },
      {
        "id": "restrict",
        "title": "見せる行や列を限定してアクセス制御に使える",
        "hint": "セキュリティ上の使い道は？",
        "level": "deep"
      },
      {
        "id": "update",
        "title": "結合や集計を含むビューは更新できないことがある",
        "hint": "ビューはいつでも更新できますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "relational-algebra",
    "name": "関係演算",
    "aliases": [
      "結合",
      "和両立",
      "和集合",
      "UNION",
      "WHERE"
    ],
    "reading": "Relational algebra",
    "category": "データベース",
    "definition": "表で表す関係に対して操作を行い、新しい関係を得るための演算体系です。選択・射影・結合・集合演算などを扱います。",
    "example": "東京支店の顧客表と大阪支店の顧客表を UNION で1つの一覧にします。",
    "related": [
      "relational-database"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "表で表す関係に選択・射影・結合・集合演算などを行い、新たな関係を得る",
        "hint": "どのようなデータを対象に、どんな種類の操作を行いますか？"
      },
      {
        "id": "compatible",
        "title": "和・差・積には列の数と型が対応する和両立が必要",
        "hint": "UNIONできる条件は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "functional-dependency",
    "name": "関数従属性",
    "aliases": [
      "推移的関数従属",
      "部分関数従属"
    ],
    "reading": "Functional dependency",
    "category": "データベース",
    "definition": "ある列Aの値が決まると列Bの値が1つに決まる関係（A→B）です。主キーの一部だけに従属する部分関数従属を除くと第2正規形、主キー以外の列を介して従属する推移的関数従属を除くと第3正規形になります。",
    "example": "{受注番号, 商品番号}→数量 のとき、商品番号→商品名 は部分関数従属です。",
    "related": [
      "normalization"
    ],
    "criteria": [
      {
        "id": "def",
        "title": "Aの値が決まればBの値が一意に決まる関係",
        "hint": "A→Bとはどういう意味ですか？"
      },
      {
        "id": "partial",
        "title": "部分関数従属は主キーの一部に従属すること（除くと第2正規形）",
        "hint": "第2正規形で除くのは？",
        "level": "deep"
      },
      {
        "id": "transitive",
        "title": "推移的関数従属は非キー列を介して従属すること（除くと第3正規形）",
        "hint": "第3正規形で除くのは？",
        "level": "deep"
      },
      {
        "id": "anomaly",
        "title": "従属が残ると更新時異状（更新・挿入・削除の不整合）が起きる",
        "hint": "正規化しないと何が困りますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "referential-constraint",
    "name": "参照制約",
    "aliases": [
      "CASCADE",
      "RESTRICT",
      "SET NULL"
    ],
    "reading": "Referential integrity constraint",
    "category": "データベース",
    "definition": "外部キーの値が、参照先の表の主キーに必ず存在するようにする制約です。参照先の行を削除・更新したときの動作として、CASCADE（連動して削除）、RESTRICT（拒否）、SET NULL（NULLにする）を指定できます。",
    "example": "部署を削除すると、ON DELETE CASCADE なら所属する社員の行も削除されます。",
    "related": [
      "primary-key"
    ],
    "criteria": [
      {
        "id": "fk",
        "title": "外部キーで参照先に存在する値との対応を保ち、表どうしの不整合を防ぐ",
        "hint": "参照先にない値が登録されることを、どのように防ぎますか？"
      },
      {
        "id": "cascade",
        "title": "CASCADEは参照先の削除に連動して参照元も削除する",
        "hint": "CASCADEの動作は？",
        "level": "deep"
      },
      {
        "id": "restrict",
        "title": "RESTRICTは参照されている行の削除を拒否し、SET NULLは外部キーをNULLにする",
        "hint": "他の指定の動作は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "stored-procedure",
    "name": "ストアドプロシージャ",
    "aliases": [
      "実行計画",
      "通信量"
    ],
    "reading": "Stored procedure",
    "category": "データベース",
    "definition": "一連のSQL処理をまとめてDBMSに登録しておき、名前を指定して呼び出す仕組みです。クライアントとサーバ間の通信量が減り、構文解析や実行計画の作成を事前に済ませられるため、処理が速くなります。",
    "example": "「月末締め処理」を登録しておき、アプリからは1回の呼出しで数十のSQLを実行します。",
    "related": [],
    "criteria": [
      {
        "id": "stored",
        "title": "一連のSQLをDBMSに登録して呼び出す",
        "hint": "どこに処理を置きますか？"
      },
      {
        "id": "traffic",
        "title": "1回の呼出しで済み、通信量が減る",
        "hint": "ネットワーク面の利点は？",
        "level": "deep"
      },
      {
        "id": "privilege",
        "title": "表への直接の権限を与えず、プロシージャ経由に限定できる",
        "hint": "セキュリティ面の利点は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "db-recovery",
    "name": "障害回復",
    "reading": "Database recovery",
    "category": "データベース",
    "definition": "障害によって失われたり不整合になったりしたデータベースを、バックアップやログなどを用いて正しい状態に戻すことです。",
    "example": "ディスク障害後、バックアップと更新ログを使ってデータを復元します。",
    "related": [
      "rollback",
      "rollforward",
      "checkpoint",
      "commit",
      "transaction",
      "wal",
      "acid"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "障害後のデータベースをバックアップやログなどで正しい状態に戻す",
        "hint": "障害の後に、何をどのような状態へ戻しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rollback",
    "name": "ロールバック",
    "reading": "Rollback",
    "category": "データベース",
    "definition": "トランザクションの処理による更新を取り消し、処理前の状態に戻すことです。障害回復では更新前のログなどを使います。",
    "example": "振込処理の途中で失敗したので、口座残高の更新を取り消します。",
    "related": [
      "db-recovery",
      "rollforward",
      "checkpoint",
      "commit",
      "transaction",
      "wal",
      "acid"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "トランザクションによる更新を取り消して処理前の状態に戻す",
        "hint": "失敗した処理の更新をどう扱いますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rollforward",
    "name": "ロールフォワード",
    "reading": "Rollforward",
    "category": "データベース",
    "definition": "バックアップなどから戻したデータに更新後のログを適用し、確定済みの更新を再現することです。",
    "example": "前日のバックアップを戻し、その後の確定済みの更新ログを適用します。",
    "related": [
      "db-recovery",
      "rollback",
      "checkpoint",
      "commit",
      "transaction",
      "wal",
      "acid"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "更新後のログを適用して確定済みの更新を再現する",
        "hint": "確定済みの更新をログからどう反映しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "checkpoint",
    "name": "チェックポイント",
    "reading": "Checkpoint",
    "category": "データベース",
    "definition": "障害回復を効率よく行うために、データベースの更新状況を記録する処理上の区切りです。回復時に確認するログの範囲を絞る基準になります。",
    "example": "障害回復では、チェックポイントの情報を基に必要なログを確認します。",
    "related": [
      "db-recovery",
      "rollback",
      "rollforward",
      "commit",
      "transaction",
      "wal",
      "acid"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "障害回復でログを調べる範囲などの基準になる処理上の区切り",
        "hint": "回復処理の効率化に、どのように役立ちますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "commit",
    "name": "コミット",
    "reading": "Commit",
    "category": "データベース",
    "definition": "トランザクションの処理結果を確定し、データベースへの更新を正式に反映させることです。",
    "example": "振込元と振込先の残高更新が両方終わったら、コミットして確定します。",
    "related": [
      "db-recovery",
      "rollback",
      "rollforward",
      "checkpoint",
      "transaction",
      "wal",
      "acid"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "トランザクションの処理結果を確定する",
        "hint": "処理結果を取り消すことですか、確定することですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "transaction",
    "name": "トランザクション",
    "reading": "Transaction",
    "category": "データベース",
    "definition": "データベースなどで、関連する複数の処理を一まとまりの仕事として扱う単位です。",
    "example": "振込元の残高減少と振込先の残高増加を、一つの処理単位として扱います。",
    "related": [
      "db-recovery",
      "rollback",
      "rollforward",
      "checkpoint",
      "commit",
      "wal",
      "acid"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "関連する処理を一まとまりの仕事として扱う単位",
        "hint": "複数の処理をどのような単位として扱いますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "packet",
    "name": "パケット",
    "aliases": [
      "ヘッダー"
    ],
    "reading": "Packet",
    "category": "ネットワーク",
    "definition": "ネットワークで送るデータを一定の大きさに分割し、宛先などの制御情報（ヘッダー）を付けたものです。送信時間はデータ量（ビット数）を回線速度で割って求め、1バイトは8ビットです。",
    "example": "1,500バイトのパケットを100Mビット/秒で送ると、1,500×8÷10⁸＝120マイクロ秒かかります。",
    "related": [],
    "criteria": [
      {
        "id": "split",
        "title": "データを分割し、宛先などのヘッダーを付けて送る",
        "hint": "パケットとは？"
      },
      {
        "id": "time",
        "title": "送信時間＝データ量（ビット）÷伝送速度",
        "hint": "送るのにかかる時間は？",
        "level": "deep"
      },
      {
        "id": "overhead",
        "title": "ヘッダーの分だけ実際に送るデータ量が増える",
        "hint": "ヘッダーは送信時間に影響しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "lan",
    "name": "LAN",
    "reading": "Local Area Network",
    "category": "ネットワーク",
    "definition": "建物やフロアなど限られた範囲のコンピュータを結ぶネットワークです。有線LANは主にイーサネット、無線LANはIEEE 802.11で構成し、広い範囲を結ぶWANと区別します。",
    "example": "社内のPCとプリンタをスイッチにつなぎ、ファイルや印刷を共有します。",
    "related": [
      "ethernet"
    ],
    "criteria": [
      {
        "id": "range",
        "title": "建物内など限られた範囲を結ぶ",
        "hint": "どの範囲のネットワークですか？"
      },
      {
        "id": "ethernet",
        "title": "有線LANの代表はイーサネット",
        "hint": "有線LANの代表的な規格は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "web-server",
    "name": "Webサーバ",
    "reading": "Web server",
    "category": "ネットワーク",
    "definition": "HTTP（HTTPS）でブラウザからの要求を受け、HTMLや画像などのコンテンツを返すサーバです。前段にリバースプロキシや負荷分散装置を置くことがあります。",
    "example": "ブラウザで社外向けサイトを開くと、Webサーバがトップページを返します。",
    "related": [
      "reverse-proxy"
    ],
    "criteria": [
      {
        "id": "http",
        "title": "HTTPで要求を受けてコンテンツを返す",
        "hint": "どんなプロトコルで通信しますか？"
      },
      {
        "id": "dmz",
        "title": "公開するWebサーバを内部ネットワークと分離した領域に置き、侵害時の影響を抑える",
        "hint": "公開サーバの配置では、内部への影響をどう抑えますか？",
        "level": "deep"
      },
      {
        "id": "proxy",
        "title": "前段にリバースプロキシを置き、負荷分散やWAFを行う",
        "hint": "前に置く装置は？",
        "level": "deep"
      },
      {
        "id": "banner",
        "title": "サーバの種類やバージョン情報を返さないよう設定する",
        "hint": "設定で気を付けることは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "vpn",
    "name": "VPN",
    "aliases": [
      "トンネリング"
    ],
    "reading": "Virtual Private Network",
    "category": "ネットワークセキュリティ",
    "definition": "インターネットなどの共有の回線上に、暗号化や認証を使って仮想的な専用回線を作る技術です。元のパケットを別のパケットで包むトンネリングを使います。IPsecはネットワーク層、L2TPはデータリンク層のフレームを運び、SSL/TLSを使うものもあります。",
    "example": "在宅勤務のPCからVPNで社内ネットワークにつなぎ、社内システムを使います。",
    "related": [
      "ipsec"
    ],
    "criteria": [
      {
        "id": "virtual",
        "title": "共有の回線上に仮想的な専用回線を作る",
        "hint": "VPNとは？"
      },
      {
        "id": "tunnel",
        "title": "パケットを別のパケットで包んで運ぶトンネリングを使う",
        "hint": "どうやって専用線のようにしますか？",
        "level": "deep"
      },
      {
        "id": "crypto",
        "title": "通信の秘匿性が必要なVPNでは、暗号化や認証によって盗聴やなりすましを防ぐ",
        "hint": "安全な通信路を構成するためには、どのような保護が必要ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "osi-model",
    "name": "OSI基本参照モデル",
    "aliases": [
      "ネットワーク層"
    ],
    "reading": "Open Systems Interconnection reference model",
    "category": "ネットワーク",
    "definition": "通信の機能を7つの層に分けたモデルです。下から物理層、データリンク層、ネットワーク層、トランスポート層、セション層、プレゼンテーション層、アプリケーション層です。",
    "example": "IPはネットワーク層、TCPはトランスポート層、イーサネットはデータリンク層の規約です。",
    "related": [],
    "criteria": [
      {
        "id": "seven",
        "title": "通信機能を7層に分ける",
        "hint": "何層ありますか？"
      },
      {
        "id": "layers",
        "title": "下から物理・データリンク・ネットワーク・トランスポート・セション・プレゼンテーション・アプリケーション",
        "hint": "各層の順序は？"
      },
      {
        "id": "protocols",
        "title": "IPは第3層、TCP/UDPは第4層、イーサネットは第2層",
        "hint": "代表的なプロトコルはどの層ですか？",
        "level": "deep"
      },
      {
        "id": "devices",
        "title": "ルータは第3層、スイッチは第2層、リピータは第1層で中継する",
        "hint": "中継装置と層の関係は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ethernet",
    "name": "イーサネット",
    "aliases": [
      "カプセル化"
    ],
    "reading": "Ethernet",
    "category": "ネットワーク",
    "definition": "有線LANの代表的な規格（IEEE 802.3）です。データをフレームという単位で送り、宛先はMACアドレスで指定します。上位のIPパケットはフレームの中にカプセル化されます。",
    "example": "イーサネットフレームの中にIPパケット、その中にTCPセグメントが入っています。",
    "related": [
      "mac-address"
    ],
    "criteria": [
      {
        "id": "frame",
        "title": "フレーム単位で送り、宛先はMACアドレスで指定する",
        "hint": "宛先は何で指定しますか？"
      },
      {
        "id": "encap",
        "title": "上位層のデータはヘッダーを付けて下位層に包まれる（カプセル化）",
        "hint": "IPパケットはどう運ばれますか？",
        "level": "deep"
      },
      {
        "id": "order",
        "title": "フレームの中では宛先MAC→（IPヘッダーの）宛先IP→（TCPヘッダーの）宛先ポートの順に現れる",
        "hint": "宛先情報はどの順に並びますか？",
        "level": "deep"
      },
      {
        "id": "collision",
        "title": "昔の共有型ではCSMA/CDで衝突を制御していた",
        "hint": "共有型のアクセス制御は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "mac-address",
    "name": "MACアドレス",
    "reading": "Media Access Control address",
    "category": "ネットワーク",
    "definition": "ネットワーク機器のインタフェースに割り当てる48ビットの物理アドレスです。同じLAN内での通信に使い、IPアドレスからMACアドレスを調べるのがARPです。調べた結果はARPキャッシュに保存され、arpコマンドで確認できます。",
    "example": "PCは宛先IPに対応するMACアドレスをARPで問い合わせ、そのMACアドレス宛てにフレームを送ります。",
    "related": [
      "ethernet"
    ],
    "criteria": [
      {
        "id": "physical",
        "title": "データリンク層でネットワークインタフェースを識別するアドレス",
        "hint": "通信のどの部分で、何を識別するためのアドレスですか？"
      },
      {
        "id": "random",
        "title": "MACアドレスは偽装できるため認証には使えない",
        "hint": "MACアドレスで端末を認証してよいですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ip-address",
    "name": "IPアドレス",
    "aliases": [
      "グローバルIPアドレス"
    ],
    "reading": "Internet Protocol address",
    "category": "ネットワーク",
    "definition": "ネットワーク層で通信相手を識別するアドレスです。IPv4は32ビットで、ネットワーク部とホスト部に分かれます。インターネットで一意なグローバルIPアドレスと、組織内で使うプライベートIPアドレスがあります。",
    "example": "192.168.1.10 はプライベートIPアドレスで、インターネットへはNATでグローバルIPアドレスに変換して出ます。",
    "related": [
      "subnet-mask"
    ],
    "criteria": [
      {
        "id": "layer3",
        "title": "ネットワーク層で通信相手を識別する",
        "hint": "IPアドレスは何を識別しますか？"
      },
      {
        "id": "parts",
        "title": "ネットワーク部とホスト部からなる",
        "hint": "IPアドレスの構成は？"
      },
      {
        "id": "global",
        "title": "グローバルIPアドレスはインターネットで一意、プライベートは組織内で使う",
        "hint": "二つの種類の違いは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "subnet-mask",
    "name": "サブネットマスク",
    "aliases": [
      "サブネットワーク",
      "可変長サブネットマスク"
    ],
    "reading": "Subnet mask",
    "category": "ネットワーク",
    "definition": "IPアドレスのうち、どこまでがネットワーク（サブネットワーク）部かを示す値です。IPアドレスとの論理積をとるとサブネットワークのアドレスが求まります。サブネットごとに長さを変えるのが可変長サブネットマスクです。",
    "example": "172.16.35.20 と 255.255.240.0 の論理積をとると、サブネットワークアドレスは 172.16.32.0 です。",
    "related": [
      "ip-address"
    ],
    "criteria": [
      {
        "id": "mask",
        "title": "ネットワーク部を1、ホスト部を0で示す",
        "hint": "サブネットマスクの意味は？"
      },
      {
        "id": "and",
        "title": "IPアドレスとの論理積でサブネットワークアドレスを求める",
        "hint": "サブネットのアドレスはどう求めますか？",
        "level": "deep"
      },
      {
        "id": "hosts",
        "title": "通常のIPv4サブネットでは、ネットワーク・ブロードキャスト用を除いてホスト数を求める",
        "hint": "ホスト部の全ての値を端末に割り当てられますか？",
        "level": "deep"
      },
      {
        "id": "vlsm",
        "title": "可変長サブネットマスクでサブネットごとに大きさを変える",
        "hint": "サブネットの大きさを変えるには？",
        "level": "deep"
      },
      {
        "id": "cidr",
        "title": "/20のようにプレフィックス長で表す（CIDR表記）",
        "hint": "短く表す書き方は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "port-number",
    "name": "ポート番号",
    "aliases": [
      "送信元ポート番号"
    ],
    "reading": "Port number",
    "category": "ネットワーク",
    "definition": "TCPやUDPで、同じコンピュータ上の通信相手のアプリケーションを識別する番号です。Webは80や443、メール送信は25や587のように、よく使うサービスには決まった番号があります。",
    "example": "Webブラウザは宛先ポート443でHTTPSサーバにつなぎ、送信元ポートには空いている番号を使います。",
    "related": [],
    "criteria": [
      {
        "id": "app",
        "title": "同じホスト上のアプリケーション（サービス）を識別する",
        "hint": "IPアドレスとの役割の違いは？"
      },
      {
        "id": "wellknown",
        "title": "よく使うサービスには決まった番号（ウェルノウンポート）がある",
        "hint": "Web（HTTPS）は何番ですか？",
        "level": "deep"
      },
      {
        "id": "source",
        "title": "送信元ポート番号はランダムに選ぶことで推測されにくくする（DNSキャッシュポイズニング対策など）",
        "hint": "送信元ポートをランダムにする理由は？",
        "level": "deep"
      },
      {
        "id": "scan",
        "title": "ポートスキャンで開いているポートを調べられるため不要なポートを閉じる",
        "hint": "攻撃者は何を調べますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "mobile-network",
    "name": "ハンドオーバー",
    "aliases": [
      "基地局"
    ],
    "reading": "Handover",
    "category": "ネットワーク",
    "definition": "移動中も通信を継続するため、端末が接続する基地局などを切り替える仕組みです。",
    "example": "電車で移動しながら通話していても、ハンドオーバーで途切れずに話し続けられます。",
    "related": [
      "roaming",
      "tethering",
      "fallback"
    ],
    "criteria": [
      {
        "id": "switch",
        "title": "通信を続けたまま接続する基地局を切り替える",
        "hint": "ハンドオーバーとは？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "network-commands",
    "name": "ネットワーク管理コマンド",
    "reading": "Network commands",
    "category": "ネットワーク",
    "definition": "ネットワークの設定・到達性・接続状態などを確認し、通信障害の切り分けに使うコマンドの総称です。確認したい対象によって使うコマンドを選びます。",
    "example": "接続できない原因を調べるため、自端末の設定と相手への到達性をそれぞれ確認します。",
    "related": [
      "mac-address",
      "ping",
      "ipconfig",
      "netstat"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ネットワークの設定や接続状態を確認・診断するコマンドの総称",
        "hint": "何を確認するために使うコマンドですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "csma-cd",
    "name": "CSMA/CD",
    "aliases": [
      "トークンリング",
      "トークンバス"
    ],
    "reading": "Carrier Sense Multiple Access with Collision Detection",
    "category": "ネットワーク",
    "definition": "共有型のイーサネットで使われたアクセス制御方式です。送信前に回線が空いているか確認し、送信中に衝突を検知したら、ランダムな時間待って再送します。トークンを持つ端末だけが送信するトークンリング・トークンバスとは方式が異なります。",
    "example": "2台が同時に送信して衝突すると、それぞれ乱数で決めた時間待ってから再送します。",
    "related": [],
    "criteria": [
      {
        "id": "sense",
        "title": "送信前に回線の使用状況を確認する",
        "hint": "送信前に何をしますか？"
      },
      {
        "id": "detect",
        "title": "衝突を検知したらランダムな時間待って再送する",
        "hint": "衝突したら？"
      },
      {
        "id": "switch",
        "title": "全二重のスイッチ接続では衝突が起きずCSMA/CDは使われない",
        "hint": "今のLANでは使われていますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "無線LANの方式（CSMA/CA）と取り違える誤りがあります。"
    ]
  },
  {
    "id": "csma-ca",
    "name": "CSMA/CA",
    "reading": "Carrier Sense Multiple Access with Collision Avoidance",
    "category": "ネットワーク",
    "definition": "無線LANで使うアクセス制御方式です。無線では送信中に衝突を検知できないため、回線が空いても一定時間とランダムな時間待ってから送信して衝突を避け、受信側からのACKで届いたことを確認します。",
    "example": "複数のスマートフォンが同じアクセスポイントに送るとき、それぞれ待ち時間をずらして送信します。",
    "related": [
      "csma-cd"
    ],
    "criteria": [
      {
        "id": "avoid",
        "title": "空いていても待ち時間を置いて衝突を回避する",
        "hint": "衝突をどう扱いますか？"
      },
      {
        "id": "ack",
        "title": "受信確認（ACK）で送達を確かめる",
        "hint": "届いたかどうかはどう分かりますか？",
        "level": "deep"
      },
      {
        "id": "vs-cd",
        "title": "無線では衝突を検知できないためCDではなくCAを使う",
        "hint": "なぜCSMA/CDではないのですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ipv6",
    "name": "IPv6",
    "reading": "Internet Protocol version 6",
    "category": "ネットワーク",
    "definition": "128ビットのアドレスを使うインターネットプロトコルです。IPv4のアドレス枯渇を解消し、ヘッダーを簡素化しました。IPsecの利用を前提に設計された点も特徴です。",
    "example": "2001:db8::1 のように16ビットずつ16進数で表し、0の連続は::で省略します。",
    "related": [
      "ip-address",
      "ipsec"
    ],
    "criteria": [
      {
        "id": "128",
        "title": "アドレスが128ビットで枯渇問題を解消する",
        "hint": "IPv4との最大の違いは？"
      },
      {
        "id": "notation",
        "title": "16ビットずつ16進数で区切り、0の連続は::で省略する",
        "hint": "どう表記しますか？",
        "level": "deep"
      },
      {
        "id": "dual",
        "title": "IPv4との併用（デュアルスタック）では両方のファイアウォール設定が必要",
        "hint": "移行期の注意は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ppp",
    "name": "PPP",
    "reading": "Point-to-Point Protocol",
    "category": "ネットワーク",
    "definition": "2点間を結んでデータを送るデータリンク層のプロトコルです。リンクの確立や認証（PAP・CHAP）、IPアドレスの割当てなどを行い、ダイヤルアップやPPPoEによるインターネット接続で使われました。",
    "example": "PPPoEでは、イーサネットの上でPPPを使って利用者を認証し、接続します。",
    "related": [
      "osi-model"
    ],
    "criteria": [
      {
        "id": "p2p",
        "title": "2点間をつなぐデータリンク層のプロトコル",
        "hint": "どの層のプロトコルですか？"
      },
      {
        "id": "auth",
        "title": "PAPやCHAPで接続相手を認証できる",
        "hint": "PPPにはどんな機能がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ssh",
    "name": "SSH",
    "reading": "Secure Shell",
    "category": "ネットワークセキュリティ",
    "definition": "ネットワーク越しにほかのコンピュータへ安全にログインし、コマンドを実行するためのプロトコルです。通信を暗号化し、サーバとの間で公開鍵認証などを行います。アプリケーション層で動作し、ポート22を使います。",
    "example": "管理者は自分のPCからSSHでサーバに接続し、公開鍵認証でログインして設定を変更します。",
    "related": [],
    "criteria": [
      {
        "id": "remote",
        "title": "暗号化された通信で遠隔ログインやコマンド実行を行う",
        "hint": "何のためのプロトコルですか？"
      },
      {
        "id": "auth",
        "title": "パスワードのほか公開鍵認証が使える",
        "hint": "どんな認証方式がありますか？",
        "level": "deep"
      },
      {
        "id": "hostkey",
        "title": "初回接続時にサーバの鍵の指紋を確認して中間者攻撃を防ぐ",
        "hint": "初回接続で確認することは？",
        "level": "deep"
      },
      {
        "id": "forward",
        "title": "ポートフォワーディングで他の通信を中継できる",
        "hint": "SSHで他の通信を運ぶには？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "SSHをネットワーク層で暗号化するプロトコルとする誤りがあります（それはIPsec）。"
    ]
  },
  {
    "id": "multicast",
    "name": "マルチキャスト",
    "reading": "Multicast",
    "category": "ネットワーク",
    "definition": "特定のグループに属する複数の宛先に、1回の送信でデータを届ける通信です。1対1はユニキャスト、ネットワーク内の全員に送るのはブロードキャストです。RIP-2やOSPFは経路情報の交換にマルチキャストを使います。",
    "example": "社内の会議映像を、視聴を申し込んだPCのグループにだけマルチキャストで配信します。",
    "related": [],
    "criteria": [
      {
        "id": "group",
        "title": "特定のグループの複数宛先に1回の送信で届ける",
        "hint": "誰に届けますか？"
      },
      {
        "id": "routing",
        "title": "RIP-2やOSPFはルーティング情報の交換にマルチキャストを使う",
        "hint": "マルチキャストの使用例は？",
        "level": "deep"
      },
      {
        "id": "address",
        "title": "IPv4では224.0.0.0〜239.255.255.255（クラスD）を使う",
        "hint": "マルチキャストのアドレス範囲は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rip",
    "name": "RIP",
    "aliases": [
      "RIP-2",
      "ディスタンスベクタ型"
    ],
    "reading": "Routing Information Protocol",
    "category": "ネットワーク",
    "definition": "ホップ数（経由するルータの数）で経路を選ぶディスタンスベクタ型のルーティングプロトコルです。30秒ごとに経路表を隣接ルータに送ります。RIP-2では可変長サブネットマスクや認証、マルチキャストでの送信に対応しました。",
    "example": "宛先までのルータが3台の経路と5台の経路があれば、3台の経路を選びます。",
    "related": [
      "ospf"
    ],
    "criteria": [
      {
        "id": "hop",
        "title": "経路の評価にホップ数を使う",
        "hint": "経路を何で選びますか？"
      },
      {
        "id": "dv",
        "title": "ディスタンスベクタ型で、隣接ルータと経路表を定期的に交換する",
        "hint": "どのタイプのプロトコルですか？"
      },
      {
        "id": "rip2",
        "title": "RIP-2は可変長サブネットマスク、認証、マルチキャストに対応する",
        "hint": "RIP-2で何が加わりましたか？",
        "level": "deep"
      },
      {
        "id": "limit",
        "title": "最大ホップ数は15で大規模網に向かない",
        "hint": "RIPの制約は？",
        "level": "deep"
      },
      {
        "id": "converge",
        "title": "経路の変化が伝わるのに時間がかかる（収束が遅い）",
        "hint": "ディスタンスベクタ型の弱点は？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "帯域などのコストで選び、トポロジ全体を把握するOSPF（リンクステート型）と混同する誤りがあります。"
    ]
  },
  {
    "id": "dhcp",
    "name": "DHCP",
    "reading": "Dynamic Host Configuration Protocol",
    "category": "ネットワーク",
    "definition": "ネットワークに接続した端末に、IPアドレスやデフォルトゲートウェイ、DNSサーバなどの設定を自動で配布するプロトコルです。端末は最初にブロードキャストでDHCPサーバを探します。",
    "example": "社内LANにPCをつなぐと、DHCPサーバから自動でIPアドレスが割り当てられます。",
    "related": [],
    "criteria": [
      {
        "id": "auto",
        "title": "IPアドレスなどの設定を自動で配布する",
        "hint": "何を自動化しますか？"
      },
      {
        "id": "broadcast",
        "title": "DHCPv4では、アドレス未設定の端末がブロードキャストでサーバを探す",
        "hint": "IPv4アドレスがまだない端末は、どうやってサーバを探しますか？",
        "level": "deep"
      },
      {
        "id": "lease",
        "title": "アドレスは期限付きで貸し出す（リース）",
        "hint": "割り当ては永久ですか？",
        "level": "deep"
      },
      {
        "id": "rogue",
        "title": "偽のDHCPサーバで不正なゲートウェイやDNSを配られる攻撃がある",
        "hint": "DHCPに関する攻撃は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "dns-records",
    "name": "DNSのリソースレコード",
    "aliases": [
      "MXレコード",
      "NSレコード",
      "CNAMEレコード"
    ],
    "reading": "Domain Name System resource records",
    "category": "ネットワーク",
    "definition": "DNSで名前に対応する情報を保持するデータです。IPアドレス、メールの配送先、別名など、情報の用途に応じた種類のレコードを設定します。",
    "example": "example.jp 宛てのメールは、MXレコードに書かれたメールサーバに届けられます。",
    "related": [
      "dns"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "DNSで名前に対応するIPアドレスや配送先などの情報を種別付きで保持するデータ",
        "hint": "DNSでは、名前に対応する情報をどのように保持しますか？"
      },
      {
        "id": "selection",
        "title": "A/AAAAによる名前解決やMXによるメール配送など、情報の用途ごとにレコードを設定する",
        "hint": "名前解決やメール配送には、どのようにレコードを使い分けますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "http-status",
    "name": "HTTPステータスコード",
    "aliases": [
      "ステータスコード",
      "リダイレクト",
      "クライアントエラー",
      "サーバエラー"
    ],
    "reading": "Hypertext Transfer Protocol status codes",
    "category": "Webセキュリティ",
    "definition": "HTTP応答で、リクエストの処理結果を示す3桁のコードです。先頭の数字によって成功・リダイレクト・エラーなどに分類されます。",
    "example": "存在しないページは404 Not Found、ログインが必要なページへは302で誘導、サーバ内部の異常は500になります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "HTTP応答で要求の処理結果を示す3桁のコード",
        "hint": "どの通信で、何を知らせるためのコードですか？"
      },
      {
        "id": "classes",
        "title": "2xx成功、3xxリダイレクト、4xxクライアントエラー、5xxサーバエラー",
        "hint": "百の位はそれぞれ何を表しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ajax",
    "name": "Ajax",
    "aliases": [
      "非同期通信"
    ],
    "reading": "Asynchronous JavaScript and Extensible Markup Language",
    "category": "Webセキュリティ",
    "definition": "ブラウザ上のJavaScriptが、ページ全体を読み直さずにサーバと非同期に通信し、受け取ったデータでDOMを書き換えて画面の一部を更新する技術です。",
    "example": "地図をドラッグすると、ページを読み直さずに周辺の地図画像だけが読み込まれます。",
    "related": [
      "dom-sax"
    ],
    "criteria": [
      {
        "id": "async",
        "title": "JavaScriptがサーバと非同期に通信する",
        "hint": "どのように通信しますか？"
      },
      {
        "id": "partial",
        "title": "受け取ったデータで画面の一部だけを更新する",
        "hint": "画面はどう変わりますか？"
      },
      {
        "id": "dom",
        "title": "取得したデータをDOM操作で反映する",
        "hint": "画面の更新に使う仕組みは？",
        "level": "deep"
      },
      {
        "id": "cors",
        "title": "別のオリジンへの通信は同一オリジンポリシーとCORSで制限される",
        "hint": "他のサイトのAPIを自由に呼べますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "css",
    "name": "CSS",
    "reading": "Cascading Style Sheets",
    "category": "Webセキュリティ",
    "definition": "HTMLで記述した文書の見た目（色・大きさ・配置など）を指定する言語です。文書の構造（HTML）と見た目（CSS）を分けて管理できます。",
    "example": "h1 { color: navy; } と書くと、見出しがすべて紺色になります。",
    "related": [],
    "criteria": [
      {
        "id": "style",
        "title": "HTML文書の見た目を指定する",
        "hint": "CSSの役割は？"
      },
      {
        "id": "separate",
        "title": "構造と見た目を分離して管理できる",
        "hint": "HTMLとどう役割を分けますか？",
        "level": "deep"
      },
      {
        "id": "cascade",
        "title": "複数の指定が重なるときは詳細度や順序で優先が決まる",
        "hint": "指定が重なったら？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "vlan",
    "name": "VLAN",
    "aliases": [
      "スタティックVLAN"
    ],
    "reading": "Virtual Local Area Network",
    "category": "ネットワークセキュリティ",
    "definition": "物理的な配線とは別に、スイッチの設定で論理的にLANを分割する技術です。ポートごとに固定でVLANを割り当てるのがスタティックVLAN、利用者の認証結果に応じて割り当てるのが認証VLANです。",
    "example": "同じフロアでも経理部のPCだけを別のVLANにして、他部署から直接通信できないようにします。",
    "related": [
      "ieee8021x"
    ],
    "criteria": [
      {
        "id": "logical",
        "title": "スイッチの設定で論理的にLANを分割する",
        "hint": "物理的な配線を変える必要がありますか？"
      },
      {
        "id": "static",
        "title": "スタティックVLANはポートごとに固定でVLANを割り当てる",
        "hint": "ポートで決めるVLANは？",
        "level": "deep"
      },
      {
        "id": "auth",
        "title": "認証VLANは利用者の認証結果に応じてVLANを動的に割り当て、フリーアドレス制でも同じセグメントにつなげる",
        "hint": "席が自由な職場で使うVLANは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ip-masquerade",
    "name": "IPマスカレード",
    "aliases": [
      "NAPT"
    ],
    "reading": "Internet Protocol masquerade / Network Address Port Translation",
    "category": "ネットワークセキュリティ",
    "definition": "複数の端末のプライベートIPアドレスとポート番号を、1つのグローバルIPアドレスと別のポート番号に変換してインターネットに接続する技術（NAPT）です。外部から内部の端末に直接アクセスされにくくなります。",
    "example": "家庭のルータが、スマートフォンとPCの通信を1つのグローバルIPアドレスでまとめて送ります。",
    "related": [
      "ip-address"
    ],
    "criteria": [
      {
        "id": "convert",
        "title": "IPアドレスとポート番号を合わせて変換する",
        "hint": "何を変換しますか？"
      },
      {
        "id": "share",
        "title": "1つのグローバルIPアドレスを複数の端末で共有する",
        "hint": "何のために使いますか？"
      },
      {
        "id": "inbound",
        "title": "動的な変換表だけでは外部から開始する通信を届けられず、公開には転送設定などが必要になる",
        "hint": "外部から通信を始めるとき、変換先はどう決まりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "free-address",
    "name": "フリーアドレス制",
    "reading": "Free address",
    "category": "経営管理",
    "definition": "社員の固定席を設けず、出社した人が空いている席を自由に使う働き方です。座席の利用効率が上がり部署を超えた交流が増える一方、どの席からでも所属部署のネットワークに安全につながる仕組み（認証VLANなど）が必要です。",
    "example": "出社率が6割の部署では、席数を人数より減らしてフリーアドレス制にします。",
    "related": [
      "vlan"
    ],
    "criteria": [
      {
        "id": "free",
        "title": "固定席を設けず空いた席を使う",
        "hint": "フリーアドレス制とは？"
      },
      {
        "id": "network",
        "title": "どの席でも所属に応じたネットワークにつなぐ仕組みが要る",
        "hint": "ネットワーク面の課題は？",
        "level": "deep"
      },
      {
        "id": "authvlan",
        "title": "認証VLANなら利用者の認証結果で所属VLANに接続できる",
        "hint": "どの席でも同じ部署のVLANにつなぐには？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "domain-name",
    "name": "ドメイン名",
    "reading": "Domain name",
    "category": "ネットワーク",
    "definition": "インターネット上の組織やサービスを識別する名前です。DNSでIPアドレスなどに対応づけられます。不正な利益を得る目的で他人の商品名などと同一・類似のドメイン名を取得・使用することは、不正競争防止法で禁止されています。",
    "example": "有名ブランドに似たドメイン名を取って高値で売りつける行為は、不正競争に当たります。",
    "related": [
      "dns"
    ],
    "criteria": [
      {
        "id": "identify",
        "title": "組織やサービスを識別する名前で、DNSでIPアドレスに対応づける",
        "hint": "ドメイン名の役割は？"
      },
      {
        "id": "hijack",
        "title": "登録情報やDNS設定を乗っ取られるとドメイン名ハイジャックになる",
        "hint": "ドメインに関する攻撃は？",
        "level": "deep"
      },
      {
        "id": "expire",
        "title": "更新を忘れて失効したドメインを第三者に取得される危険がある",
        "hint": "期限切れの危険は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cyber-kill-chain",
    "name": "サイバーキルチェーン",
    "aliases": [
      "デリバリ"
    ],
    "reading": "Cyber Kill Chain",
    "category": "セキュリティ運用",
    "definition": "標的型攻撃の流れを、偵察→武器化→デリバリ（配送）→エクスプロイト（攻撃）→インストール→C&C（遠隔操作）→目的の実行の7段階に分けたモデルです。どこかの段階で連鎖を断ち切れば被害を防げる、という考え方で対策を整理します。",
    "example": "メールの添付ファイルでマルウェアを送り込む段階がデリバリ、脆弱性を突いて実行させる段階がエクスプロイトです。",
    "related": [
      "mitre-attack"
    ],
    "criteria": [
      {
        "id": "stages",
        "title": "攻撃を偵察から目的の実行までの段階に分ける",
        "hint": "どんな段階に分けますか？"
      },
      {
        "id": "break",
        "title": "途中の段階で連鎖を断てば被害を防げる",
        "hint": "この考え方で何を整理しますか？",
        "level": "deep"
      },
      {
        "id": "order",
        "title": "偵察→武器化→デリバリ→エクスプロイト→インストール→C&C→目的の実行",
        "hint": "段階の順序は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "exploit",
    "name": "エクスプロイト",
    "aliases": [
      "エクスプロイトコード"
    ],
    "reading": "Exploit",
    "category": "攻撃手法",
    "definition": "ソフトウェアの脆弱性を突いて、攻撃者の意図した動作（任意コードの実行や権限昇格など）を起こさせる攻撃、またはそのためのコード（エクスプロイトコード）です。",
    "example": "公開された脆弱性のエクスプロイトコードが出回ると、修正プログラムを当てていないサーバが次々に攻撃されます。",
    "related": [
      "vulnerability"
    ],
    "criteria": [
      {
        "id": "use-vuln",
        "title": "脆弱性を突いて意図しない動作をさせる",
        "hint": "何を利用しますか？"
      },
      {
        "id": "code",
        "title": "そのための攻撃コードをエクスプロイトコードという",
        "hint": "エクスプロイトコードとは？"
      },
      {
        "id": "patch",
        "title": "悪用が確認・想定される脆弱性を評価し、修正や緩和策を速やかに適用する",
        "hint": "脆弱性を突くコードが使われる場合、どのように被害を抑えますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "vulnerability",
    "name": "脆弱性",
    "aliases": [
      "脆弱性管理"
    ],
    "reading": "Vulnerability",
    "category": "セキュリティ運用",
    "definition": "ソフトウェアの不具合や設定の不備など、攻撃に悪用され得るセキュリティ上の弱点です。発見・公表・修正・適用の流れで管理し、CVEなどの識別子で共有されます。",
    "example": "Webアプリの入力チェック漏れは、SQLインジェクションの脆弱性になります。",
    "related": [
      "cve",
      "sbom"
    ],
    "criteria": [
      {
        "id": "weakness",
        "title": "攻撃に悪用され得るセキュリティ上の弱点",
        "hint": "脆弱性とは？"
      },
      {
        "id": "fix",
        "title": "修正プログラムの適用や設定変更で解消する",
        "hint": "どう対処しますか？",
        "level": "deep"
      },
      {
        "id": "manage",
        "title": "資産を把握し、情報収集→評価→対応の脆弱性管理を継続する",
        "hint": "組織としてどう管理しますか？",
        "level": "deep"
      },
      {
        "id": "cvss",
        "title": "深刻度はCVSSで評価する",
        "hint": "深刻度は何で表しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "malware",
    "name": "マルウェア",
    "reading": "Malware",
    "category": "攻撃手法",
    "definition": "ウイルス、ワーム、トロイの木馬、ランサムウェア、スパイウェアなど、悪意を持って作られたソフトウェアの総称です。メールの添付ファイルや不正なWebサイト、脆弱性を通じて感染します。",
    "example": "請求書を装った添付ファイルを開くと、マルウェアが情報を外部に送信し始めます。",
    "related": [
      "ransomware",
      "botnet"
    ],
    "criteria": [
      {
        "id": "general",
        "title": "悪意のあるソフトウェアの総称",
        "hint": "マルウェアとは？"
      },
      {
        "id": "route",
        "title": "メール、Web、脆弱性などから感染する",
        "hint": "どこから入ってきますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ransomware",
    "name": "ランサムウェア",
    "reading": "Ransomware",
    "category": "攻撃手法",
    "definition": "感染したコンピュータのファイルを暗号化して使えなくし、元に戻すことと引き換えに身代金を要求するマルウェアです。近年は暗号化の前にデータを盗み、公開すると脅す二重恐喝が主流です。",
    "example": "VPN装置の脆弱性から侵入され、社内のファイルサーバがすべて暗号化されました。",
    "related": [
      "malware"
    ],
    "criteria": [
      {
        "id": "encrypt",
        "title": "ファイルを暗号化して使えなくし身代金を要求する",
        "hint": "どんな被害を与えますか？"
      },
      {
        "id": "backup",
        "title": "オフラインのバックアップを用意して復旧できるようにする",
        "hint": "最も重要な備えは？",
        "level": "deep"
      },
      {
        "id": "double",
        "title": "データを盗んで公開すると脅す二重恐喝が多い",
        "hint": "最近の手口の特徴は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "bec",
    "name": "ビジネスメール詐欺",
    "reading": "Business Email Compromise",
    "category": "攻撃手法",
    "definition": "取引先や経営者になりすました電子メールで、偽の口座に送金させる詐欺です。マルウェアを使わず、事前に盗み見たメールのやり取りなどを利用するため、技術的な検知が難しいのが特徴です。",
    "example": "取引先を装って「振込先口座が変わりました」というメールが届き、偽の口座に代金を振り込んでしまいます。",
    "related": [
      "deepfake"
    ],
    "criteria": [
      {
        "id": "impersonate",
        "title": "取引先や経営者になりすましたメールで送金させる",
        "hint": "どんな手口ですか？"
      },
      {
        "id": "verify",
        "title": "口座変更などは電話など別の経路で確認する",
        "hint": "有効な対策は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "deep-web",
    "name": "ディープウェブ",
    "reading": "Deep web",
    "category": "攻撃手法",
    "definition": "認証が必要なページや検索結果に登録されないページなど、一般的な検索エンジンでは見つけられないWeb上の情報の領域です。",
    "example": "会員制サイトのマイページはディープウェブ、Torでしか開けない闇市場はダークウェブです。",
    "related": [],
    "criteria": [
      {
        "id": "hidden",
        "title": "検索エンジンに載らない領域",
        "hint": "ディープウェブとは？"
      }
    ],
    "commonMistakes": [
      "ディープフェイク（偽の映像・音声）と名前が似ていますが別のものです。"
    ]
  },
  {
    "id": "certificates",
    "name": "サーバー証明書",
    "aliases": [
      "サーバ証明書"
    ],
    "reading": "Server certificate",
    "category": "暗号・認証",
    "definition": "TLS通信で接続先のサーバーを認証するために、サーバーが提示するデジタル証明書です。サーバーのドメイン名などと公開鍵を結び付け、認証局の署名によってその対応を確認できるようにします。",
    "example": "HTTPSのWebサイトを開くと、ブラウザは提示された証明書の署名・有効期限・接続先ドメイン名などを検証して、接続先を確認します。",
    "related": [
      "pki",
      "tls",
      "client-certificate",
      "ev-ssl-certificate"
    ],
    "criteria": [
      {
        "id": "server",
        "title": "TLS通信で、接続先のサーバーを認証するために使う証明書",
        "hint": "TLS通信で、どちら側の正当性を確かめる証明書ですか？"
      }
    ],
    "commonMistakes": [
      "証明書の検証が成功しても、Webサイトの内容や運営者が安全であることまで保証するわけではありません。"
    ]
  },
  {
    "id": "client-certificate",
    "name": "クライアント証明書",
    "reading": "Client certificate",
    "category": "暗号・認証",
    "definition": "接続してきた利用者や端末を認証するために、クライアント側が提示するデジタル証明書です。対応する秘密鍵を持っていることを示して、サービスへのアクセスなどで本人や端末を確認してもらいます。",
    "example": "社内システムへの接続時に、会社が配布したクライアント証明書を端末から提示して、その端末や利用者であることを認証してもらいます。",
    "related": [
      "certificates",
      "pki"
    ],
    "criteria": [
      {
        "id": "client",
        "title": "接続してきた利用者や端末を認証するために使う証明書",
        "hint": "サーバーではなく、誰を認証するための証明書ですか？"
      }
    ],
    "commonMistakes": [
      "接続先のサーバーを認証するサーバー証明書とは、認証する対象が異なります。"
    ]
  },
  {
    "id": "code-signing-certificate",
    "name": "コードサイニング証明書",
    "reading": "Code signing certificate",
    "category": "暗号・認証",
    "definition": "ソフトウェアへのディジタル署名を検証し、発行元を確認するための証明書です。対応する秘密鍵でプログラムに署名し、利用者は証明書の公開鍵で検証して、発行元と署名後の改ざんの有無を確認します。",
    "example": "配布するインストーラに署名し、ダウンロードした利用者が発行元と改ざんの有無を確認できるようにします。",
    "related": [
      "digital-signature",
      "pki"
    ],
    "criteria": [
      {
        "id": "code",
        "title": "ソフトウェアの署名に使い、発行元の確認と改ざんの検知に役立つ証明書",
        "hint": "プログラムの署名によって、何を確認できますか？"
      }
    ],
    "commonMistakes": [
      "署名があってもソフトウェアの安全性は保証されません。秘密鍵が盗まれると、マルウェアに正規の署名が付けられるおそれもあります。"
    ]
  },
  {
    "id": "ev-ssl-certificate",
    "name": "EV SSL証明書",
    "aliases": [
      "EV証明書"
    ],
    "reading": "Extended Validation certificate",
    "category": "暗号・認証",
    "definition": "申請した組織の法的な実在性やドメインの利用権限などを、認証局が厳格に確認して発行するサーバー証明書です。EVはExtended Validationの略で、発行前の組織確認を重視した証明書です。",
    "example": "企業がWebサイト用のEV SSL証明書を取得するとき、認証局は組織の登記情報や申請者の権限なども確認します。",
    "related": [
      "certificates",
      "pki"
    ],
    "criteria": [
      {
        "id": "ev",
        "title": "組織の実在性などを厳格に審査して発行するサーバー証明書",
        "hint": "発行前に、何を厳格に確認しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "security-properties",
    "name": "情報セキュリティの3要素",
    "aliases": [
      "情報セキュリティの要素",
      "CIA",
      "CIAトライアド"
    ],
    "reading": "Confidentiality, Integrity, Availability",
    "category": "セキュリティ運用",
    "definition": "情報を守るための基本的な3つの性質である、機密性・完全性・可用性の総称です。英語の頭文字からCIAとも呼びます。",
    "example": "情報を秘密に保つこと、正確な状態を守ること、必要なときに利用できることの3つを考えます。",
    "related": [
      "confidentiality",
      "integrity",
      "information-availability",
      "authenticity",
      "reliability",
      "accountability",
      "non-repudiation",
      "entity"
    ],
    "criteria": [
      {
        "id": "cia",
        "title": "情報セキュリティの基本の3要素は機密性・完全性・可用性",
        "hint": "基本の3要素を挙げてください。"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "confidentiality",
    "name": "機密性",
    "reading": "Confidentiality",
    "category": "セキュリティ運用",
    "definition": "許可されていない人や組織、処理などに、情報を使わせたり開示したりしない性質です。",
    "example": "顧客情報を閲覧できる担当者を限定します。",
    "related": [
      "security-properties",
      "least-privilege"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "認可されていない者に情報を使用・開示させない性質",
        "hint": "許可されていない相手に、情報をどう扱わせない性質ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "integrity",
    "name": "完全性",
    "reading": "Integrity",
    "category": "セキュリティ運用",
    "definition": "情報が正確で欠落のない状態に保たれる性質です。不正な変更や破壊などによって、情報が損なわれるのを防ぎます。",
    "example": "売上データが不正に書き換えられたり、一部欠けたりしないようにします。",
    "related": [
      "security-properties",
      "hash",
      "digital-signature"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "情報の正確さと欠落のない状態を保つ性質",
        "hint": "情報がどのような状態に保たれることですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "information-availability",
    "name": "可用性",
    "reading": "Availability",
    "category": "セキュリティ運用",
    "definition": "認可された利用者などが、必要なときに情報やシステムへアクセスし、利用できる性質です。",
    "example": "必要な業務時間にシステムを使えるように備えます。",
    "related": [
      "security-properties",
      "availability"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "認可された者が必要なときに情報やシステムを利用できる性質",
        "hint": "必要なとき、誰が何をできる性質ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "authenticity",
    "name": "真正性",
    "reading": "Authenticity",
    "category": "セキュリティ運用",
    "definition": "人や機器、情報などが、それ自身の主張するとおりのものであるという性質です。名乗っている主体が本物であることなどを指します。",
    "example": "利用者が他人を名乗っているのではなく、本人であることを確かめます。",
    "related": [
      "entity",
      "reliability",
      "identity-proofing"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "主体や情報などが主張するとおりのものである性質",
        "hint": "名乗っているものと実体の関係がどうなっていることですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "reliability",
    "name": "信頼性",
    "reading": "Reliability",
    "category": "セキュリティ運用",
    "definition": "意図した行動と結果が一貫しているという性質です。ここでは、情報セキュリティの用語としての信頼性を扱います。",
    "example": "同じ条件で処理すると、意図した動作と結果が一貫して得られます。",
    "related": [
      "authenticity"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "意図した行動と結果が一貫している性質",
        "hint": "行動と結果にどのような一貫性がありますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "accountability",
    "name": "責任追跡性",
    "reading": "Accountability",
    "category": "セキュリティ運用",
    "definition": "ある主体が行った動作を、その主体に一意にたどれる性質です。誰がどの操作をしたかを特定できるようにします。",
    "example": "利用者IDと操作内容をログに記録し、実行した利用者を特定できるようにします。",
    "related": [
      "entity",
      "non-repudiation"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "行われた動作を、その動作を行った主体に一意に追跡できる性質",
        "hint": "誰の動作だったかを特定できる性質は何ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "non-repudiation",
    "name": "否認防止",
    "reading": "Non-repudiation",
    "category": "セキュリティ運用",
    "definition": "ある事象や行為が実際に起きたことと、その主体を後から証明できるようにする性質です。実行した主体が、その行為をしていないと否定することを防ぎます。",
    "example": "送信者が後から送っていないと否定できないように、署名などの証拠を残します。",
    "related": [
      "digital-signature",
      "accountability"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "事象や行為とその主体を後から証明でき、否定されることを防ぐ性質",
        "hint": "後から行為を否定されないために、何を証明できるようにしますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "entity",
    "name": "エンティティ",
    "reading": "Entity",
    "category": "セキュリティ運用",
    "definition": "ここでは、人・組織・機器・プロセスなど、認証やアクセス制御などの対象として識別する実体を指します。",
    "example": "システムにログインする利用者や、通信相手の端末を識別します。",
    "related": [
      "authenticity",
      "authorization"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "人・組織・機器・プロセスなど、識別の対象となる実体",
        "hint": "情報セキュリティの文脈では、どのような実体を指しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "authorization",
    "name": "認可",
    "reading": "Authorization",
    "category": "アクセス制御",
    "definition": "利用者やアプリケーションなどに、どの資源に対してどの操作を行う権限を認めるかを決めることです。アクセス制御は、この権限に基づいて操作を許可・拒否します。",
    "example": "ログインした社員（認証）に、自部署のフォルダだけ書込みを許す（認可）。",
    "related": [
      "least-privilege"
    ],
    "criteria": [
      {
        "id": "permission",
        "title": "どの資源に何をしてよいかを決めて与える",
        "hint": "認可とは？"
      },
      {
        "id": "access-control",
        "title": "アクセス制御はこの認可に基づいて操作を許可・拒否する",
        "hint": "認可とアクセス制御の関係は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "smime",
    "name": "S/MIME",
    "reading": "Secure/Multipurpose Internet Mail Extensions",
    "category": "メールセキュリティ",
    "definition": "公開鍵暗号とデジタル証明書を使って、電子メールの本文を暗号化したり、デジタル署名を付けたりする規格です。送信者のなりすましや改ざん、盗聴を防げます。",
    "example": "取引先の公開鍵（証明書）でメールを暗号化し、自分の秘密鍵で署名して送ります。",
    "related": [
      "digital-signature",
      "dkim"
    ],
    "criteria": [
      {
        "id": "encrypt",
        "title": "受信者の証明書を利用し、メールの内容を受信者が復号できる形で暗号化する",
        "hint": "メールの秘密を守るため、誰に対応する鍵や証明書を使いますか？"
      },
      {
        "id": "sign",
        "title": "送信者の秘密鍵で署名して、なりすましと改ざんを検知する",
        "hint": "署名に誰の鍵を使いますか？"
      },
      {
        "id": "e2e",
        "title": "端末間で暗号化するので経路上のサーバでも中身を読めない",
        "hint": "どこまで保護されますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "oss",
    "name": "OSS",
    "reading": "Open Source Software",
    "category": "セキュリティ運用",
    "definition": "ソースコードが公開され、利用・改変・再配布が許されたソフトウェアです。ライセンスの条件（著作権表示、ソース公開の義務など）を守る必要があり、使っているOSSの脆弱性を管理するためにSBOMが役立ちます。",
    "example": "Webサーバに使っているOSSのライブラリに脆弱性が見つかったら、SBOMで影響のある製品をすぐ特定します。",
    "related": [
      "sbom"
    ],
    "criteria": [
      {
        "id": "open",
        "title": "ソースコードが公開され、利用・改変・再配布ができる",
        "hint": "OSSとは？"
      },
      {
        "id": "license",
        "title": "ライセンスの条件を守る必要がある",
        "hint": "利用時に注意することは？"
      },
      {
        "id": "vuln",
        "title": "利用しているOSSの脆弱性を把握・更新する必要がある",
        "hint": "セキュリティ面の注意は？",
        "level": "deep"
      },
      {
        "id": "copyleft",
        "title": "GPLなどでは、改変物の配布時に同じライセンスやソースコード提供などの条件を守る",
        "hint": "改変して配布するとき、ライセンスによってどのような条件がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "directory-traversal",
    "name": "ディレクトリトラバーサル",
    "reading": "Directory traversal",
    "category": "Webセキュリティ",
    "definition": "ファイル名を受け取るWebアプリに「../」などを含む値を渡して、公開を想定していないディレクトリのファイルを読み出す攻撃です。外部から渡されたファイル名を直接使わない、ファイル名だけを取り出して検証する、といった対策をとります。",
    "example": "?file=../../etc/passwd を指定され、サーバのパスワードファイルが表示されてしまいます。",
    "related": [
      "os-command-injection"
    ],
    "criteria": [
      {
        "id": "parent",
        "title": "「../」で上位ディレクトリをたどり想定外のファイルを読む",
        "hint": "どんな文字列を使いますか？"
      },
      {
        "id": "measure",
        "title": "外部から渡されたファイル名を直接使わない、ファイル名だけに限定して検証する",
        "hint": "対策は？",
        "level": "deep"
      },
      {
        "id": "privilege",
        "title": "アプリの実行権限を最小にして被害を抑える",
        "hint": "被害を小さくするには？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "OSコマンドインジェクションやSQLインジェクションの対策と取り違える誤りがあります。"
    ]
  },
  {
    "id": "buffer-overflow",
    "name": "バッファオーバーフロー",
    "reading": "Buffer overflow",
    "category": "Webセキュリティ",
    "definition": "確保した領域（バッファ）の大きさを超えるデータを書き込み、隣のメモリ領域を上書きしてしまう脆弱性です。戻り先アドレスを書き換えられると、攻撃者のコードを実行されます。",
    "example": "16文字分しか用意していない領域に100文字の入力を書き込み、戻り先アドレスが書き換えられます。",
    "related": [],
    "criteria": [
      {
        "id": "overwrite",
        "title": "領域を超えて書き込み、隣のメモリを上書きする",
        "hint": "何が起きる脆弱性ですか？"
      },
      {
        "id": "code",
        "title": "戻り先アドレスを書き換えられ任意のコードを実行される",
        "hint": "何が危険ですか？",
        "level": "deep"
      },
      {
        "id": "measure",
        "title": "入力長の検査、安全な関数の使用、メモリ安全な言語の採用",
        "hint": "開発での対策は？",
        "level": "deep"
      },
      {
        "id": "mitigation",
        "title": "ASLRやスタック保護、DEPで悪用を難しくする",
        "hint": "OSやコンパイラでの対策は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ids-signature",
    "name": "シグネチャ",
    "reading": "Signature",
    "category": "ネットワークセキュリティ",
    "definition": "IDSやウイルス対策ソフトで、既知の攻撃やマルウェアの特徴をパターンとして登録したものです。通信やファイルをシグネチャと照合して検知します。既知の攻撃は正確に検知できますが、未知の攻撃は見逃しやすくなります。",
    "example": "特定のマルウェアが通信に含む文字列をシグネチャとして登録し、一致したら警告します。",
    "related": [
      "ids-ips"
    ],
    "criteria": [
      {
        "id": "pattern",
        "title": "既知の攻撃やマルウェアの特徴を登録したパターン",
        "hint": "シグネチャとは？"
      },
      {
        "id": "match",
        "title": "通信やファイルと照合して一致したら検知する",
        "hint": "どうやって検知しますか？"
      },
      {
        "id": "unknown",
        "title": "未知の攻撃は検知できないため、振る舞い（アノマリ）型と組み合わせる",
        "hint": "シグネチャ型の弱点は？",
        "level": "deep"
      },
      {
        "id": "update",
        "title": "定期的にシグネチャを更新する必要がある",
        "hint": "運用で欠かせないことは？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "デジタル署名（signature）と混同する誤りがあります。"
    ]
  },
  {
    "id": "mac",
    "name": "メッセージ認証符号",
    "reading": "Message Authentication Code (MAC)",
    "category": "暗号・認証",
    "definition": "メッセージと共通の秘密鍵から計算する短い値です。受信者が同じ鍵で計算し直して一致すれば、メッセージが改ざんされておらず、鍵を持つ相手から送られたことを確認できます。HMACが代表です。",
    "example": "送信者と受信者が同じ鍵を持ち、受信者はMACが一致することで改ざんがないと判断します。",
    "related": [
      "hash",
      "digital-signature"
    ],
    "criteria": [
      {
        "id": "key",
        "title": "メッセージと共通鍵からMAC値を計算する",
        "hint": "何を使って計算しますか？"
      },
      {
        "id": "integrity",
        "title": "改ざんの検知と送信者の確認ができる",
        "hint": "何を確認できますか？"
      },
      {
        "id": "nonrepudiation",
        "title": "共通鍵なので第三者に対する否認防止はできない（デジタル署名との違い）",
        "hint": "デジタル署名との違いは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "otp",
    "name": "ワンタイムパスワード",
    "reading": "One-time password",
    "category": "暗号・認証",
    "definition": "1回限り有効なパスワードです。時刻や回数をもとに認証デバイスやアプリが生成したり、SMSなどで届けたりします。盗聴されても再利用できないため、リプレイ攻撃に強くなります。",
    "example": "スマートフォンのアプリに30秒ごとに表示される6桁の数字を入力してログインします。",
    "related": [
      "mfa"
    ],
    "criteria": [
      {
        "id": "once",
        "title": "1回限り（短時間）しか使えない",
        "hint": "普通のパスワードとの違いは？"
      },
      {
        "id": "replay",
        "title": "盗まれても再利用できずリプレイ攻撃を防ぐ",
        "hint": "どんな攻撃に強いですか？",
        "level": "deep"
      },
      {
        "id": "phishing",
        "title": "リアルタイムに中継するフィッシングには弱い",
        "hint": "ワンタイムパスワードでも防げない攻撃は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "risk-based-auth",
    "name": "リスクベース認証",
    "aliases": [
      "3Dセキュア2.0",
      "本人認証"
    ],
    "reading": "Risk-based authentication",
    "category": "暗号・認証",
    "definition": "いつもと違う端末・場所・時間帯からのアクセスなど、リスクが高いと判断したときだけ追加の認証を求める方式です。3Dセキュア2.0では、カード会社が取引のリスクを評価し、低リスクなら追加の本人認証なしで決済します。",
    "example": "海外のIPアドレスから深夜にログインされたときだけ、ワンタイムパスワードの入力を求めます。",
    "related": [
      "mfa"
    ],
    "criteria": [
      {
        "id": "adaptive",
        "title": "リスクが高いと判断したときだけ追加の認証を行う",
        "hint": "いつ追加の認証をしますか？"
      },
      {
        "id": "signals",
        "title": "端末・場所・時間帯・取引内容などからリスクを評価する",
        "hint": "何でリスクを判断しますか？"
      },
      {
        "id": "3ds",
        "title": "3Dセキュア2.0はリスクベース認証でネット決済の本人認証を行う",
        "hint": "クレジットカード決済での例は？",
        "level": "deep"
      },
      {
        "id": "ux",
        "title": "普段は追加操作がないため利便性と安全性を両立できる",
        "hint": "利用者にとっての利点は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "captcha",
    "name": "CAPTCHA",
    "reading": "Completely Automated Public Turing test to tell Computers and Humans Apart",
    "category": "暗号・認証",
    "definition": "ゆがんだ文字の読取りや画像の選択など、人間には簡単でプログラムには難しい課題を出して、操作しているのが人間かどうかを判定する仕組みです。自動化されたアカウント作成や不正ログインの試行を防ぎます。",
    "example": "ログインに5回失敗したら、信号機の写っている画像を選ぶ課題を表示します。",
    "related": [],
    "criteria": [
      {
        "id": "human",
        "title": "人間かプログラムかを判定する",
        "hint": "何を判定しますか？"
      },
      {
        "id": "bot",
        "title": "ボットによる自動登録や総当たりを防ぐ",
        "hint": "何を防ぎますか？",
        "level": "deep"
      },
      {
        "id": "limit",
        "title": "本人であることは確認しない（認証ではない）",
        "hint": "CAPTCHAで本人確認ができますか？",
        "level": "deep"
      },
      {
        "id": "solver",
        "title": "人を雇って解かせるサービスやAIで突破されることがある",
        "hint": "CAPTCHAの限界は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "public-key-crypto",
    "name": "公開鍵暗号方式",
    "reading": "Public-key cryptography",
    "category": "暗号・認証",
    "definition": "暗号化と復号に異なる鍵を使う方式です。誰でも使える公開鍵で暗号化し、本人だけが持つ秘密鍵で復号します。鍵を事前に安全に共有しなくてよく、n人が互いに通信するのに必要な鍵は2n個で済みます。共通鍵暗号方式は同じ鍵で暗号化・復号し、n(n−1)/2個の鍵が必要です。",
    "example": "100人が互いに暗号通信するなら、公開鍵暗号方式は200個、共通鍵暗号方式は4,950個の鍵が必要です。",
    "related": [
      "pki",
      "digital-signature",
      "symmetric-key-crypto"
    ],
    "criteria": [
      {
        "id": "pair",
        "title": "暗号化と復号に異なる鍵（公開鍵と秘密鍵）を使う",
        "hint": "鍵はいくつ使いますか？"
      },
      {
        "id": "encrypt",
        "title": "受信者の公開鍵で暗号化し、受信者の秘密鍵で復号する",
        "hint": "誰の鍵で暗号化しますか？"
      },
      {
        "id": "count",
        "title": "n人が公開鍵と秘密鍵を1組ずつ持つと、合計2n個の鍵になる",
        "hint": "各利用者が持つ鍵の組と合計個数は？",
        "level": "deep"
      },
      {
        "id": "hybrid",
        "title": "公開鍵暗号で共通鍵を安全に共有し、通信データは共通鍵暗号で保護する構成が使われる",
        "hint": "大量のデータの暗号化には、どう組み合わせて使いますか？",
        "level": "deep"
      },
      {
        "id": "trust",
        "title": "公開鍵が本人のものか確かめるためにPKIが必要",
        "hint": "公開鍵の正しさは誰が保証しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "csirt",
    "name": "CSIRT",
    "aliases": [
      "コーディネーションセンター",
      "CSIRTガイド",
      "JPCERTコーディネーションセンター",
      "JPCERT/CC"
    ],
    "reading": "Computer Security Incident Response Team",
    "category": "セキュリティ運用",
    "definition": "セキュリティインシデントに対応するための組織（チーム）です。インシデントの受付・分析・対応・再発防止を行います。対象により、組織内CSIRT、国の窓口となるナショナルCSIRT、CSIRT間の調整を行うコーディネーションセンター（日本ではJPCERT/CC）などに分類されます。",
    "example": "社内でマルウェア感染が見つかると、CSIRTが感染端末の隔離や原因の調査、関係者への連絡を指揮します。",
    "related": [
      "psirt"
    ],
    "criteria": [
      {
        "id": "respond",
        "title": "インシデントの受付・分析・対応・再発防止を行う組織",
        "hint": "CSIRTの役割は？"
      },
      {
        "id": "types",
        "title": "組織内CSIRT、ナショナルCSIRT、コーディネーションセンターなどの種類がある",
        "hint": "どんな種類がありますか？",
        "level": "deep"
      },
      {
        "id": "soc",
        "title": "SOCは監視して検知し、CSIRTが対応を担うという分担が多い",
        "hint": "SOCとの違いは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "soc",
    "name": "SOC",
    "reading": "Security Operation Center",
    "category": "セキュリティ運用",
    "definition": "ネットワークや機器のログを24時間監視し、サイバー攻撃の兆候を検知・分析して通知する組織です。SIEMなどのツールを使い、検知したインシデントはCSIRTに引き継ぎます。",
    "example": "SOCが深夜に不審な外部通信を検知し、CSIRTに連絡して調査を依頼します。",
    "related": [
      "csirt",
      "siem"
    ],
    "criteria": [
      {
        "id": "monitor",
        "title": "ログや通信を常時監視して攻撃の兆候を検知・分析する",
        "hint": "SOCの仕事は？"
      },
      {
        "id": "handover",
        "title": "検知したインシデントをCSIRTなどに通知・連携する",
        "hint": "検知した後は？",
        "level": "deep"
      },
      {
        "id": "siem",
        "title": "SIEMで様々なログを集めて相関分析する",
        "hint": "どんなツールを使いますか？",
        "level": "deep"
      },
      {
        "id": "mssp",
        "title": "外部の専門事業者に監視を委託することも多い",
        "hint": "自社で持たない場合は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "siem",
    "name": "SIEM",
    "aliases": [
      "不正アクセス"
    ],
    "reading": "Security Information and Event Management",
    "category": "セキュリティ運用",
    "definition": "サーバ、ネットワーク機器、セキュリティ製品などのログを一か所に集め、相関分析して不審な事象を検知・通知する仕組みです。不正アクセスの早期発見や、インシデント発生後の調査に使います。",
    "example": "同じアカウントで短時間に東京と海外からログインされたことを、複数の機器のログを突き合わせて検知します。",
    "related": [
      "soc",
      "digital-forensics"
    ],
    "criteria": [
      {
        "id": "collect",
        "title": "多様な機器のログを一元的に収集する",
        "hint": "何を集めますか？"
      },
      {
        "id": "correlate",
        "title": "ログを相関分析して不審な事象を検知・通知する",
        "hint": "集めたログで何をしますか？"
      },
      {
        "id": "forensic",
        "title": "保存したログはインシデント後の調査（フォレンジック）にも使う",
        "hint": "検知以外の用途は？",
        "level": "deep"
      },
      {
        "id": "tuning",
        "title": "誤検知が多いと重要な警告が埋もれるため、検知ルールを調整する",
        "hint": "運用上の課題は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "whois",
    "name": "WHOIS",
    "reading": "WHOIS",
    "category": "セキュリティ運用",
    "definition": "ドメイン名やIPアドレスの登録者などの情報を検索できるサービスです。不審な通信先や攻撃元の管理者を調べるときに使います。",
    "example": "不審なメールの送信元ドメインをWHOISで調べると、数日前に登録されたばかりだと分かりました。",
    "related": [],
    "criteria": [
      {
        "id": "lookup",
        "title": "ドメイン名やIPアドレスの登録情報を調べる",
        "hint": "WHOISで何が分かりますか？"
      },
      {
        "id": "use",
        "title": "不審な通信先や攻撃元の管理者の調査に使う",
        "hint": "インシデント対応での使い道は？",
        "level": "deep"
      },
      {
        "id": "privacy",
        "title": "登録者情報は代理公開などで隠されていることも多い",
        "hint": "いつも登録者が分かりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ddos",
    "name": "DDoS攻撃",
    "aliases": [
      "サービス妨害攻撃"
    ],
    "reading": "Distributed Denial of Service attack",
    "category": "攻撃手法",
    "definition": "多数のコンピュータ（ボットネットなど）から一斉に大量の通信を送り、サーバや回線を過負荷にしてサービスを提供できなくするサービス妨害攻撃です。送信元が分散しているため、単純に送信元を遮断するだけでは防げません。",
    "example": "ボットに感染した数万台のIoT機器から一斉にアクセスされ、ECサイトが閲覧できなくなりました。",
    "related": [
      "botnet",
      "syn-flood"
    ],
    "criteria": [
      {
        "id": "distributed",
        "title": "多数の機器から一斉に大量の通信を送る",
        "hint": "DoS攻撃との違いは？"
      },
      {
        "id": "unavailable",
        "title": "サーバや回線を過負荷にしてサービスを妨害する",
        "hint": "何を狙う攻撃ですか？"
      },
      {
        "id": "measure",
        "title": "CDNやDDoS対策サービスで攻撃の通信を吸収・遮断する",
        "hint": "対策は？",
        "level": "deep"
      },
      {
        "id": "reflection",
        "title": "送信元を偽ったDNSなどの応答を標的に集中させるリフレクション攻撃もある",
        "hint": "増幅させる手口は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "password-attacks",
    "name": "パスワードリスト攻撃",
    "reading": "Password list attack",
    "category": "攻撃手法",
    "definition": "他のサービスから漏えいしたIDとパスワードの組をリストにして、別のサービスにログインを試す攻撃です。パスワードを使い回している利用者が被害に遭います。考えられる文字の組合せをすべて試すのはブルートフォース攻撃（総当たり）です。",
    "example": "あるショッピングサイトから漏れたIDとパスワードで、銀行のサイトにログインされてしまいます。",
    "related": [
      "mfa"
    ],
    "criteria": [
      {
        "id": "reuse",
        "title": "漏えいしたIDとパスワードの組を他のサービスで試す",
        "hint": "どんな手口ですか？"
      },
      {
        "id": "measure",
        "title": "パスワードを使い回さない、多要素認証を使う",
        "hint": "有効な対策は？",
        "level": "deep"
      },
      {
        "id": "lockout",
        "title": "パスワードリスト攻撃は1アカウント当たりの試行が少なくロックアウトで防ぎにくい",
        "hint": "アカウントロックで防げますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "social-engineering",
    "name": "ソーシャルエンジニアリング",
    "reading": "Social engineering",
    "category": "攻撃手法",
    "definition": "技術ではなく人の心理的な隙や行動のミスにつけ込んで、パスワードなどの重要な情報を盗み出す手口です。なりすましの電話、肩越しののぞき見（ショルダーハッキング）、ごみ箱あさり（トラッシング）などがあります。",
    "example": "システム部門を名乗る電話で「障害対応のためにパスワードを教えて」と聞き出します。",
    "related": [],
    "criteria": [
      {
        "id": "human",
        "title": "人の心理や行動の隙を突く",
        "hint": "何を利用する手口ですか？"
      },
      {
        "id": "examples",
        "title": "なりすまし電話、のぞき見、ごみ箱あさりなど",
        "hint": "具体的な手口は？",
        "level": "deep"
      },
      {
        "id": "training",
        "title": "教育・訓練と、電話でパスワードを聞かない等のルールで防ぐ",
        "hint": "対策は？",
        "level": "deep"
      },
      {
        "id": "pretext",
        "title": "緊急性や権威を装って判断を急がせるのが典型",
        "hint": "よく使われる心理的なテクニックは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "open-relay",
    "name": "第三者中継",
    "aliases": [
      "メールサーバ"
    ],
    "reading": "Open relay",
    "category": "メールセキュリティ",
    "definition": "メールサーバが、自組織と関係のない第三者どうしのメールを中継してしまうことです。迷惑メールの送信に悪用されるため、送信元か宛先のどちらかが自組織のドメインである場合だけ中継するよう設定します。",
    "example": "社外の送信者から社外の宛先へのメールを受け付けて転送してしまうサーバは、第三者中継を許しています。",
    "related": [
      "submission-port"
    ],
    "criteria": [
      {
        "id": "relay",
        "title": "自組織と無関係な第三者間のメールを中継してしまう",
        "hint": "第三者中継とは？"
      },
      {
        "id": "spam",
        "title": "迷惑メールの送信に悪用される",
        "hint": "何が問題ですか？",
        "level": "deep"
      },
      {
        "id": "judge",
        "title": "送信元・宛先とも自組織外なら中継を拒否する",
        "hint": "中継してよいかはどう判断しますか？",
        "level": "deep"
      },
      {
        "id": "blacklist",
        "title": "中継を許すとサーバのIPアドレスがブラックリストに載り、自社のメールも届かなくなる",
        "hint": "自社にとっての不利益は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "crl",
    "name": "証明書失効リスト",
    "aliases": [
      "CRL"
    ],
    "reading": "Certificate Revocation List (CRL)",
    "category": "暗号・認証",
    "definition": "有効期限前に失効させたデジタル証明書のシリアル番号を並べ、認証局が署名して公開するリストです。秘密鍵の漏えい（危殆化）などで証明書を使えなくしたときに、利用者はCRLやOCSPで失効していないかを確認します。",
    "example": "サーバの秘密鍵が漏れたので証明書を失効させると、その証明書のシリアル番号がCRLに載ります。",
    "related": [
      "pki"
    ],
    "criteria": [
      {
        "id": "list",
        "title": "失効した証明書のシリアル番号を認証局が署名して公開する",
        "hint": "CRLには何が載りますか？"
      },
      {
        "id": "check",
        "title": "利用者は証明書を使う前に失効していないか確認する",
        "hint": "利用者は何をしますか？",
        "level": "deep"
      },
      {
        "id": "compromise",
        "title": "秘密鍵の危殆化（漏えいなど）が失効の代表的な理由",
        "hint": "どんなときに失効させますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "quantum-crypto",
    "name": "量子暗号",
    "reading": "Quantum cryptography",
    "category": "暗号・認証",
    "definition": "量子の性質（観測すると状態が変わる）を利用して、盗聴されると必ず分かる方法で暗号鍵を配送する技術（量子鍵配送）です。量子コンピュータでも解読できない暗号を、量子力学で実現します。量子計算機に耐える数学的な暗号である耐量子計算機暗号（PQC）とは別のものです。",
    "example": "光子で鍵を送り、途中で盗聴されて状態が乱れていれば、その鍵を捨てます。",
    "related": [
      "pqc",
      "quantum-computer"
    ],
    "criteria": [
      {
        "id": "qkd",
        "title": "量子の性質で盗聴を検知できる鍵配送を行う",
        "hint": "何を実現する技術ですか？"
      },
      {
        "id": "distance",
        "title": "専用の装置と伝送路が必要で、距離に制約がある",
        "hint": "実用上の課題は？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "量子コンピュータを使って暗号化する技術、とする誤りがあります。"
    ]
  },
  {
    "id": "timing-attack",
    "name": "タイミング攻撃",
    "reading": "Timing attack",
    "category": "攻撃手法",
    "definition": "暗号処理にかかる時間の違いを測定して、秘密鍵などの秘密情報を推測するサイドチャネル攻撃です。処理時間が秘密の値によって変わらない実装（定数時間の処理）で防ぎます。",
    "example": "パスワードの比較が1文字目から順に不一致で終了する実装だと、時間の差から正しい文字を1文字ずつ推測されます。",
    "related": [
      "pqc"
    ],
    "criteria": [
      {
        "id": "time",
        "title": "処理時間の差から秘密情報を推測する",
        "hint": "何を測る攻撃ですか？"
      },
      {
        "id": "constant",
        "title": "秘密の値によらず処理時間を一定にする",
        "hint": "対策は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "attribute-certificate",
    "name": "属性証明書",
    "reading": "Attribute certificate",
    "category": "暗号・認証",
    "definition": "公開鍵証明書の所有者に対して、役職や権限などの属性を結び付けて証明する証明書です。属性認証局が発行し、公開鍵は含まず、公開鍵証明書と組み合わせて使います。",
    "example": "「医師である」という資格を属性証明書で示し、医療情報システムでの権限付与に使います。",
    "related": [
      "pki"
    ],
    "criteria": [
      {
        "id": "attr",
        "title": "所有者の役職や権限などの属性を証明する",
        "hint": "何を証明しますか？"
      },
      {
        "id": "nokey",
        "title": "公開鍵は含まず、公開鍵証明書と組み合わせて使う",
        "hint": "公開鍵証明書との違いは？"
      },
      {
        "id": "lifetime",
        "title": "属性は変わりやすいため有効期間を短くできる",
        "hint": "属性を分ける利点は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "model-extraction",
    "name": "モデル抽出攻撃",
    "reading": "Model extraction attack",
    "category": "攻撃手法",
    "definition": "機械学習モデルに大量の入力を与えて出力を集め、その組から元のモデルと同等の機能を持つモデルを複製する攻撃です。学習データを推測するモデルインバージョン攻撃や、学習データに悪意のあるデータを混ぜるデータポイズニングとは目的が異なります。",
    "example": "APIで公開された画像判定モデルに何万枚も問い合わせ、その結果を学習させて同じ性能のモデルを作ります。",
    "related": [
      "model-inversion",
      "data-poisoning"
    ],
    "criteria": [
      {
        "id": "copy",
        "title": "入力と出力の組から同等のモデルを複製する",
        "hint": "何を盗む攻撃ですか？"
      },
      {
        "id": "query",
        "title": "大量の問い合わせを行う",
        "hint": "どうやって情報を集めますか？"
      },
      {
        "id": "measure",
        "title": "問い合わせ回数の制限や出力の情報量を減らすことで対策する",
        "hint": "対策は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "reverse-engineering",
    "name": "リバースエンジニアリング",
    "reading": "Reverse engineering",
    "category": "攻撃手法",
    "definition": "完成した製品やプログラムを分解・解析して、その構造や仕組み、ソースコードに相当する情報を明らかにすることです。マルウェアの解析や互換製品の開発に使われる一方、ソフトウェアの使用許諾で禁止されていることもあります。",
    "example": "マルウェアを逆アセンブルして、通信先のC&Cサーバのアドレスを突き止めます。",
    "related": [],
    "criteria": [
      {
        "id": "analyze",
        "title": "製品やプログラムを解析して構造や仕組みを明らかにする",
        "hint": "何をすることですか？"
      },
      {
        "id": "use",
        "title": "マルウェア解析や互換性の確認に使われる",
        "hint": "正当な用途は？",
        "level": "deep"
      },
      {
        "id": "license",
        "title": "使用許諾契約で禁止されていることがある",
        "hint": "法的な注意点は？",
        "level": "deep"
      },
      {
        "id": "obfuscate",
        "title": "難読化で解析を困難にする対策がある",
        "hint": "解析されにくくするには？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cms-asn1",
    "name": "CMS",
    "reading": "Cryptographic Message Syntax",
    "category": "暗号・認証",
    "definition": "署名や暗号化を施したメッセージの形式を定める規格です。データ構造をASN.1で定義し、S/MIMEなどで利用されます。",
    "example": "S/MIMEでメールの署名や暗号化データを格納する形式として使います。",
    "related": [
      "asn1",
      "xml-signature",
      "smime"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "署名・暗号化したメッセージの形式を定める規格",
        "hint": "何のデータ形式を定める規格ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "asn1",
    "name": "ASN.1",
    "reading": "Abstract Syntax Notation One",
    "category": "暗号・認証",
    "definition": "通信などでやり取りするデータの型や構造を定義するための記法です。デジタル証明書やCMSなどのデータ構造の定義に使います。",
    "example": "証明書の発行者や有効期間などの項目を、データ構造として定義します。",
    "related": [
      "cms-asn1",
      "xml-signature",
      "smime"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "データの型や構造を定義する記法",
        "hint": "データのどのような性質を定義する記法ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cdn",
    "name": "CDN",
    "reading": "Content Delivery Network",
    "category": "ネットワーク",
    "definition": "Webコンテンツのコピーを世界各地のサーバ（エッジサーバ）に配置し、利用者に近いサーバから配信する仕組みです。表示を速くし、元のサーバの負荷を減らすほか、DDoS攻撃の緩和にも使われます。",
    "example": "動画サイトが、日本の利用者には東京のエッジサーバから動画を配信します。",
    "related": [
      "domain-fronting",
      "ddos"
    ],
    "criteria": [
      {
        "id": "edge",
        "title": "コンテンツを各地のサーバにキャッシュし、近いサーバから配信する",
        "hint": "どこから配信しますか？"
      },
      {
        "id": "load",
        "title": "表示の高速化と元のサーバの負荷軽減",
        "hint": "利点は？",
        "level": "deep"
      },
      {
        "id": "ddos",
        "title": "大量の通信を分散して受け止め、DDoS攻撃を緩和する",
        "hint": "セキュリティ面の効果は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sni",
    "name": "SNI",
    "reading": "Server Name Indication",
    "category": "ネットワークセキュリティ",
    "definition": "TLSの接続開始時に、クライアントが接続したいサーバのホスト名を伝える拡張です。1つのIPアドレスで複数のドメインのHTTPSサイトを運用でき、サーバは適切な証明書を返せます。",
    "example": "同じIPアドレスの共用サーバで、SNIに書かれたホスト名を見て a.example と b.example の証明書を使い分けます。",
    "related": [
      "tls",
      "domain-fronting"
    ],
    "criteria": [
      {
        "id": "hostname",
        "title": "TLSの開始時に接続先のホスト名を伝える",
        "hint": "SNIで何を伝えますか？"
      },
      {
        "id": "multi",
        "title": "1つのIPアドレスで複数ドメインの証明書を使い分けられる",
        "hint": "何ができるようになりますか？",
        "level": "deep"
      },
      {
        "id": "plain",
        "title": "通常の暗号化されていないClientHelloでは、経路上から接続先のホスト名を読み取れる",
        "hint": "接続開始時に暗号化されていない場合、経路上に何が見えますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "dns-reflection",
    "name": "DNSリフレクション攻撃",
    "reading": "Domain Name System reflection attack",
    "category": "攻撃手法",
    "definition": "送信元IPアドレスを攻撃対象に偽装して、オープンリゾルバなどのDNSサーバに問合せを送り、大きな応答を攻撃対象に集中させるDDoS攻撃です。小さな問合せで大きな応答を返させるため、通信量が増幅されます（DNSアンプ攻撃）。",
    "example": "60バイトの問合せで4,000バイトの応答を返させ、攻撃対象の回線をあふれさせます。",
    "related": [
      "ddos",
      "dns"
    ],
    "criteria": [
      {
        "id": "spoof",
        "title": "送信元IPアドレスを攻撃対象に偽装して問い合わせる",
        "hint": "どうやって応答を攻撃対象に向けますか？"
      },
      {
        "id": "amplify",
        "title": "小さな問合せで大きな応答を返させて通信量を増幅する",
        "hint": "なぜ効果が大きいのですか？"
      },
      {
        "id": "measure",
        "title": "DNSサーバをオープンリゾルバにしない、送信元偽装のパケットを出口で遮断する",
        "hint": "対策は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "domain-hijack",
    "name": "ドメイン名ハイジャック",
    "reading": "Domain name hijacking",
    "category": "攻撃手法",
    "definition": "ドメイン名の登録情報やDNSの設定を不正に書き換えて、正規のドメイン名へのアクセスを攻撃者のサーバに誘導する攻撃です。登録事業者のアカウントの乗っ取りや、権威DNSサーバの改ざんで行われます。",
    "example": "登録事業者の管理画面に不正ログインされ、ネームサーバの設定を書き換えられて偽サイトに誘導されました。",
    "related": [
      "dns-cache-poisoning",
      "domain-name"
    ],
    "criteria": [
      {
        "id": "rewrite",
        "title": "登録情報やDNS設定を不正に書き換える",
        "hint": "どうやって乗っ取りますか？"
      },
      {
        "id": "redirect",
        "title": "正規のドメインへのアクセスを攻撃者のサーバへ誘導する",
        "hint": "何が起きますか？",
        "level": "deep"
      },
      {
        "id": "measure",
        "title": "登録事業者アカウントの多要素認証とレジストリロックで守る",
        "hint": "対策は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "provable-security",
    "name": "情報理論的安全性",
    "reading": "Information-theoretic security",
    "category": "暗号・認証",
    "definition": "攻撃者の計算能力に制限を置かなくても、暗号文から元の情報を解読できないという安全性です。正しい条件で使うワンタイムパッドが代表例です。",
    "example": "計算能力が無限にあっても、暗号文だけから平文を特定できません。",
    "related": [
      "computational-security",
      "dh-key-exchange",
      "rsa",
      "ecc",
      "one-time-pad",
      "pqc"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "攻撃者の計算能力によらず解読できない安全性",
        "hint": "計算能力が無限でも成り立つ安全性ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "computational-security",
    "name": "計算量的安全性",
    "reading": "Computational security",
    "category": "暗号・認証",
    "definition": "暗号の解読などに必要な計算が、現実的な時間や資源では実行できないことに基づく安全性です。",
    "example": "解読に必要な計算量が非常に大きく、実用上の時間では終わりません。",
    "related": [
      "provable-security",
      "dh-key-exchange",
      "rsa",
      "ecc",
      "one-time-pad",
      "pqc"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "解読などに現実的でない計算量が必要なことに基づく安全性",
        "hint": "安全性を何の大きさに基づいて判断しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "dh-key-exchange",
    "name": "DH鍵共有",
    "reading": "Diffie–Hellman key exchange",
    "category": "暗号・認証",
    "definition": "通信相手と公開情報を交換し、第三者に秘密を送らずに共通の秘密値を導くための方式です。単独では相手の認証は行いません。",
    "example": "両者が公開値を交換し、それぞれの秘密値を使って同じ共有秘密を計算します。",
    "related": [
      "provable-security",
      "computational-security",
      "rsa",
      "ecc",
      "one-time-pad",
      "pqc"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "公開情報の交換から共通の秘密値を導く鍵共有方式",
        "hint": "秘密値そのものを送らずに、何を共有しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rsa",
    "name": "RSA暗号",
    "reading": "Rivest–Shamir–Adleman",
    "category": "暗号・認証",
    "definition": "大きな整数の素因数分解の難しさを安全性の基礎とする公開鍵暗号方式です。公開鍵と秘密鍵を使い分けて暗号化や署名に利用します。",
    "example": "公開鍵で暗号化したデータを、対応する秘密鍵で復号します。",
    "related": [
      "provable-security",
      "computational-security",
      "dh-key-exchange",
      "ecc",
      "one-time-pad",
      "pqc"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "素因数分解の難しさを基礎とする公開鍵暗号方式",
        "hint": "どの問題の難しさを利用する方式ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ecc",
    "name": "楕円曲線暗号",
    "aliases": [
      "ECC"
    ],
    "reading": "Elliptic curve cryptography",
    "category": "暗号・認証",
    "definition": "楕円曲線上の離散対数問題の難しさを利用する公開鍵暗号技術です。鍵共有や署名などに使います。",
    "example": "楕円曲線上の計算を利用して、鍵共有や署名を行います。",
    "related": [
      "provable-security",
      "computational-security",
      "dh-key-exchange",
      "rsa",
      "one-time-pad",
      "pqc"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "楕円曲線上の離散対数問題の難しさを利用する公開鍵暗号技術",
        "hint": "どの数学的な問題の難しさを利用しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ic-card",
    "name": "ICカード",
    "aliases": [
      "接触型ICカード",
      "非接触型ICカード"
    ],
    "reading": "Integrated circuit card",
    "category": "暗号・認証",
    "definition": "ICチップを埋め込んだカードです。端子を読取り機に接触させる接触型と、電波で通信する非接触型があります。ICチップ内で秘密鍵の処理を行えるため、磁気カードより偽造が困難です。",
    "example": "交通系ICカードは非接触型、クレジットカードのICチップは接触型が一般的です。",
    "related": [
      "biometrics",
      "capacitive-sensing"
    ],
    "criteria": [
      {
        "id": "chip",
        "title": "ICチップを内蔵し、内部で暗号処理ができる",
        "hint": "磁気カードとの違いは？"
      },
      {
        "id": "contact",
        "title": "接触型は端子を接触させ、非接触型は電波で通信する",
        "hint": "二つの方式の違いは？",
        "level": "deep"
      },
      {
        "id": "tamper",
        "title": "耐タンパ性があり内部の秘密情報を取り出しにくい",
        "hint": "偽造しにくい理由は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "security-orgs",
    "name": "NIST",
    "aliases": [
      "米国国立標準技術研究所"
    ],
    "reading": "National Institute of Standards and Technology",
    "category": "セキュリティ運用",
    "definition": "米国国立標準技術研究所です。標準や技術に関する研究を行い、情報セキュリティ分野でもSP 800シリーズなどの標準・ガイドラインを公開しています。",
    "example": "情報セキュリティ対策を検討するとき、NISTのガイドラインを参照します。",
    "related": [
      "enisa",
      "mitre-attack"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "米国の国立標準技術研究所で、セキュリティの標準やガイドラインも公開する",
        "hint": "どの国の、何を扱う機関ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "enisa",
    "name": "ENISA",
    "reading": "European Union Agency for Cybersecurity",
    "category": "セキュリティ運用",
    "definition": "欧州連合（EU）のサイバーセキュリティ機関です。EU域内のサイバーセキュリティの向上に向けた支援や情報提供などを行います。",
    "example": "EUのサイバーセキュリティに関する調査報告を参照します。",
    "related": [
      "security-orgs",
      "mitre-attack"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "EUのサイバーセキュリティ機関",
        "hint": "どの地域の、何を扱う機関ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cnapp-family",
    "name": "CWPP",
    "reading": "Cloud Workload Protection Platform",
    "category": "クラウドセキュリティ",
    "definition": "クラウドなどで稼働する仮想マシンやコンテナといったワークロードを保護するための製品・機能の分類です。",
    "example": "クラウド上のサーバーやコンテナに対する脅威を検知・防御します。",
    "related": [
      "casb",
      "cspm"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "仮想マシンやコンテナなどのワークロードを保護する",
        "hint": "クラウド上の何を保護する仕組みですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "casb",
    "name": "CASB",
    "reading": "Cloud Access Security Broker",
    "category": "クラウドセキュリティ",
    "definition": "利用者によるクラウドサービスの利用状況を可視化し、組織のセキュリティ方針に従って利用を制御する仕組みです。",
    "example": "社員が無許可で利用するクラウドサービスを検知し、利用を制御します。",
    "related": [
      "cnapp-family",
      "cspm"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "クラウドサービスの利用を可視化・制御する",
        "hint": "利用者とクラウドサービスの間で何を管理しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "wps",
    "name": "WPS",
    "reading": "Wi-Fi Protected Setup",
    "category": "ネットワークセキュリティ",
    "definition": "無線LANの接続設定を、ボタンを押すかPINを入力するだけで簡単に行える規格です。PIN方式には総当たりで突破される脆弱性があるため、使わないよう無効にすることが推奨されます。",
    "example": "ルータのWPSボタンを押してから、プリンタのWPSボタンを押すと自動で接続されます。",
    "related": [
      "ieee8021x"
    ],
    "criteria": [
      {
        "id": "easy",
        "title": "ボタンやPINで無線LANの設定を簡単に行う",
        "hint": "WPSとは？"
      },
      {
        "id": "pin",
        "title": "PIN方式は総当たりで突破されやすい",
        "hint": "セキュリティ上の問題は？",
        "level": "deep"
      },
      {
        "id": "disable",
        "title": "使わない場合は無効にする",
        "hint": "推奨される設定は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "physical-security",
    "name": "入退室管理",
    "reading": "Physical access control",
    "category": "セキュリティ運用",
    "definition": "ICカードや生体認証などで、建物やサーバ室に入る人を確認・記録・制限する物理的な対策です。ITに係る全般統制の一つでもあり、共連れ（認証した人の後ろについて入る）を防ぐ仕組みも重要です。",
    "example": "サーバ室の扉をICカードで開け、入室と退室の記録が残るようにします。",
    "related": [
      "application-control"
    ],
    "criteria": [
      {
        "id": "control",
        "title": "建物やサーバ室への入室を確認・制限・記録する",
        "hint": "入退室管理とは？"
      },
      {
        "id": "tailgate",
        "title": "一人ずつ通すゲートなどで、認証を受けずに後ろから入る共連れを防ぐ",
        "hint": "認証された人に続いて無認証で入ることを、どう防ぎますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "firewall",
    "name": "ファイアウォール",
    "reading": "Firewall",
    "category": "ネットワークセキュリティ",
    "definition": "ネットワークの境界で、あらかじめ決めたルールに従って通信を許可・遮断する仕組みです。IPアドレスやポート番号で判定するパケットフィルタリング型が基本で、外部と内部の間にDMZを設けて公開サーバを置きます。",
    "example": "外部からはWebサーバの443番ポートへの通信だけを許可し、他はすべて遮断します。",
    "related": [
      "ids-ips"
    ],
    "criteria": [
      {
        "id": "rule",
        "title": "ルールに従って通信を許可・遮断する",
        "hint": "ファイアウォールの働きは？"
      },
      {
        "id": "filter",
        "title": "IPアドレスやポート番号などで判定する",
        "hint": "何を見て判断しますか？"
      },
      {
        "id": "stateful",
        "title": "ステートフルインスペクションは通信の状態を記録して戻りの通信を判断する",
        "hint": "往復の通信をどう扱いますか？",
        "level": "deep"
      },
      {
        "id": "dmz",
        "title": "公開サーバは内部LANと分けたDMZに置く",
        "hint": "公開サーバはどこに置きますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "uml",
    "name": "UML",
    "aliases": [
      "アクティビティ図",
      "オブジェクト図",
      "コンポーネント図",
      "ユースケース図",
      "クラス図",
      "状態マシン図",
      "多重度"
    ],
    "reading": "Unified Modeling Language",
    "category": "ソフトウェア設計",
    "definition": "システムの分析・設計で使うモデルの表記法を統一したものです。構造や振る舞いなど、表したい内容に応じて図を使い分けます。",
    "example": "システムの構造を確認したいときと、処理の流れを確認したいときで、目的に合う図を使い分けます。",
    "related": [
      "oop"
    ],
    "criteria": [
      {
        "id": "notation",
        "title": "オブジェクト指向の設計で使う図の標準的な表記法",
        "hint": "UMLとは？"
      },
      {
        "id": "selection",
        "title": "構造・処理の流れ・相互作用など、表したい内容に応じて図を選ぶ",
        "hint": "どのような内容をモデル化するときに、図を使い分けますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "oop",
    "name": "オブジェクト指向",
    "aliases": [
      "インスタンス",
      "サブクラス",
      "スーパークラス",
      "オーバーライド",
      "集約",
      "継承"
    ],
    "reading": "Object-oriented",
    "category": "ソフトウェア設計",
    "definition": "データとそれを操作する手続をオブジェクトとしてまとめ、オブジェクトの組合せでシステムを作る考え方です。カプセル化、継承（スーパークラスの性質をサブクラスが引き継ぐ）、多態性が特徴で、クラスから作った実体をインスタンスと呼びます。",
    "example": "「動物」クラスを継承した「犬」クラスで、「鳴く」メソッドをオーバーライドして「ワン」と鳴くようにします。",
    "related": [
      "uml"
    ],
    "criteria": [
      {
        "id": "object",
        "title": "データと手続をオブジェクトにまとめる（カプセル化）",
        "hint": "オブジェクトとは？"
      },
      {
        "id": "inherit",
        "title": "サブクラスはスーパークラスの性質を継承する",
        "hint": "継承とは？"
      },
      {
        "id": "poly",
        "title": "多態性（ポリモーフィズム）で同じ呼出しでもオブジェクトごとに異なる動作をする",
        "hint": "同じメッセージで違う動作をする性質は？"
      },
      {
        "id": "instance",
        "title": "クラスから生成した実体をインスタンスという",
        "hint": "インスタンスとは？",
        "level": "deep"
      },
      {
        "id": "override",
        "title": "オーバーライドはスーパークラスのメソッドをサブクラスで再定義する",
        "hint": "オーバーライドとは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "tuckman",
    "name": "タックマンモデル",
    "aliases": [
      "成立期",
      "動乱期",
      "安定期",
      "遂行期"
    ],
    "reading": "Tuckman model",
    "category": "プロジェクト管理",
    "definition": "チームが成長する過程を、成立期（形成期）→動乱期（混乱期）→安定期（統一期）→遂行期（機能期）の段階で表したモデルです。動乱期にはメンバーの考え方の違いから対立が起き、それを乗り越えると規範ができて成果を出せるようになります。",
    "example": "新しいプロジェクトで役割分担を巡って意見がぶつかるのは動乱期です。",
    "related": [],
    "criteria": [
      {
        "id": "stages",
        "title": "チームが成立期・動乱期・安定期・遂行期を経て成長すると捉えるモデル",
        "hint": "チームの成長を、どのような段階で捉えますか？"
      },
      {
        "id": "storming",
        "title": "動乱期は考え方の違いから対立が生じる段階",
        "hint": "対立が起きるのはどの段階ですか？",
        "level": "deep"
      },
      {
        "id": "norming",
        "title": "安定期にはチームの規範や役割が確立する",
        "hint": "共通のルールができるのは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "man-month",
    "name": "人月",
    "reading": "Person-month",
    "category": "プロジェクト管理",
    "definition": "1人が1か月働いたときの作業量を1とする、工数の単位です。期間そのものではなく、人数と期間を掛けた作業量を表します。",
    "example": "3人が4か月働く作業量は12人月です。",
    "related": [
      "effort",
      "productivity",
      "handover",
      "labor-cost"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "1人が1か月で行う作業量を表す工数の単位",
        "hint": "人数と期間を使って、どのような量を表しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "effort",
    "name": "工数",
    "reading": "Effort",
    "category": "プロジェクト管理",
    "definition": "作業に必要な労働量です。人数と作業時間・期間の積で表し、人時・人日・人月などを単位に使います。",
    "example": "2人で5日かかる作業の工数は10人日です。",
    "related": [
      "man-month",
      "productivity",
      "handover",
      "labor-cost"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "人数と時間・期間の積で表す作業量",
        "hint": "人数と期間からどのように求めますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "productivity",
    "name": "生産性",
    "reading": "Productivity",
    "category": "プロジェクト管理",
    "definition": "投入した資源や労力に対して、どれだけの成果を生み出したかを表す指標です。開発では単位工数当たりの成果物量などで測ります。",
    "example": "10人日で20機能を作った場合、生産性は2機能/人日です。",
    "related": [
      "man-month",
      "effort",
      "handover",
      "labor-cost"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "投入した資源・労力当たりに得られる成果の量",
        "hint": "成果を何で割った指標ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "handover",
    "name": "引継ぎ",
    "reading": "Handover",
    "category": "プロジェクト管理",
    "definition": "担当が変わるときに、業務内容や作業状況、必要な知識などを次の担当者に伝えることです。",
    "example": "途中参加した担当者に、作業手順と未完了の作業を説明します。",
    "related": [
      "man-month",
      "effort",
      "productivity",
      "labor-cost"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "次の担当者に業務内容や作業状況などを伝える",
        "hint": "担当が変わるとき、何を伝えますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "labor-cost",
    "name": "人件費",
    "reading": "Labor cost",
    "category": "プロジェクト管理",
    "definition": "人の労働に対してかかる費用です。プロジェクトでは、必要な工数に単位工数当たりの単価を掛けるなどして見積もります。",
    "example": "10人月の作業で単価が80万円/人月なら、人件費は800万円です。",
    "related": [
      "man-month",
      "effort",
      "productivity",
      "handover"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "人の労働に対する費用で、工数と単価などから見積もる",
        "hint": "工数と単価からどのように見積もりますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "effort-distribution",
    "name": "作業配分モデル",
    "aliases": [
      "工数比",
      "期間比"
    ],
    "reading": "Effort distribution model",
    "category": "プロジェクト管理",
    "definition": "ソフトウェア開発の各工程に、全体の工数と期間をどんな割合で配分するかを示したモデルです。工数比と期間比で表し、完了した工程から残りの工数や日数を見積もるのに使います。",
    "example": "設計の工数比が0.3、全体の工数が100人月なら、設計に30人月を配分します。",
    "related": [
      "man-month"
    ],
    "criteria": [
      {
        "id": "ratio",
        "title": "各工程に全体の工数と期間を割合で配分する",
        "hint": "何を表すモデルですか？"
      },
      {
        "id": "two",
        "title": "工数比と期間比を別々に持つ",
        "hint": "どんな比率がありますか？",
        "level": "deep"
      },
      {
        "id": "estimate",
        "title": "終わった工程の実績から全体や残りの工数・期間を見積もる",
        "hint": "進捗の見積りにどう使いますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "itsm",
    "name": "サービスマネジメント",
    "aliases": [
      "サービス要求",
      "変更要求",
      "リリース"
    ],
    "reading": "Information technology service management",
    "category": "サービス管理",
    "definition": "ITサービスを計画・提供・管理・改善し、利用者や事業に価値を届けるための活動の体系です。要求に合ったサービスを提供し、その達成状況を評価して改善します。",
    "example": "サービスの目標と実績を比べ、利用者への応答時間が目標を超えていれば運用や構成の改善を検討します。",
    "related": [
      "incident-problem"
    ],
    "criteria": [
      {
        "id": "value",
        "title": "ITサービスを計画・提供・改善して価値を届ける活動の体系",
        "hint": "サービスマネジメントとは？"
      },
      {
        "id": "improve",
        "title": "サービスの目標と実績の差を評価し、改善する事項や運用の変更を決める",
        "hint": "提供したサービスの達成状況を、どのように改善へつなげますか？",
        "level": "deep"
      },
      {
        "id": "standard",
        "title": "JIS Q 20000-1が要求事項を定める",
        "hint": "規格は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "incident-problem",
    "name": "インシデント管理",
    "reading": "Incident management",
    "category": "サービス管理",
    "definition": "サービスの中断や品質低下が起きたとき、できるだけ早く通常のサービスを回復させる活動です。",
    "example": "サーバーの再起動によって業務を早く再開します。",
    "related": [
      "incident",
      "problem-management",
      "root-cause",
      "itsm"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "中断・低下したサービスを迅速に回復させる活動",
        "hint": "まず何を回復させることを目指しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "incident",
    "name": "インシデント",
    "reading": "Incident",
    "category": "サービス管理",
    "definition": "サービスの予期しない中断や品質低下などの事象です。情報セキュリティの文脈では、不正アクセスや情報漏えいなどの事象も指します。",
    "example": "システム停止によって利用者がサービスを使えなくなります。",
    "related": [
      "incident-problem",
      "problem-management",
      "root-cause",
      "itsm"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "サービスの中断や品質低下、セキュリティ上の事故などの事象",
        "hint": "サービスやセキュリティに、どのようなことが起きた状態ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "problem-management",
    "name": "問題管理",
    "reading": "Problem management",
    "category": "サービス管理",
    "definition": "インシデントの原因を調べ、根本原因の除去や回避策によって再発などを防ぐ活動です。",
    "example": "繰り返す障害の原因を調べ、メモリリークを修正します。",
    "related": [
      "incident-problem",
      "incident",
      "root-cause",
      "itsm"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "インシデントの根本原因を調べ、再発などを防ぐ活動",
        "hint": "単なる復旧にとどまらず、何を解消しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "root-cause",
    "name": "根本原因",
    "reading": "Root cause",
    "category": "サービス管理",
    "definition": "事象や問題を引き起こしている根底の原因です。表面的な症状だけでなく、再発防止のために取り除く対象になります。",
    "example": "再起動で一時的に直る障害の根本原因として、プログラムのメモリリークを突き止めます。",
    "related": [
      "incident-problem",
      "incident",
      "problem-management",
      "itsm"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "問題や事象を引き起こしている根底の原因",
        "hint": "症状そのものではなく、何を指しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "slm",
    "name": "サービスレベル管理",
    "aliases": [
      "SLA",
      "サービスレベル目標"
    ],
    "reading": "Service level management",
    "category": "サービス管理",
    "definition": "サービスの提供者と利用者の間で、提供するサービスの内容と品質の目標（サービスレベル目標）を合意し、SLA（サービスレベル合意書）として文書化して、達成状況を監視・報告・見直す活動です。",
    "example": "「稼働率99.9%以上、障害の一次回答は30分以内」をSLAで合意し、毎月の実績を報告します。",
    "related": [
      "itsm"
    ],
    "criteria": [
      {
        "id": "agree",
        "title": "サービスの内容と品質の目標を合意する（SLA）",
        "hint": "何を合意しますか？"
      },
      {
        "id": "monitor",
        "title": "達成状況を監視し報告する",
        "hint": "合意した後は？"
      },
      {
        "id": "review",
        "title": "JIS Q 20000-1ではサービスレベル目標の達成状況を計画した間隔でレビューする",
        "hint": "どのくらいの頻度で見直しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "service-availability",
    "name": "サービス可用性",
    "reading": "Service availability",
    "category": "サービス管理",
    "definition": "合意したサービス提供時間のうち、実際にサービスを利用できた時間の割合です。（サービス提供時間－停止時間）÷サービス提供時間で求め、あらかじめ合意した計画停止は停止時間に含めないのが一般的です。",
    "example": "月の提供時間が600時間で可用性99.5%なら、許容される停止時間は3時間です。",
    "related": [
      "slm",
      "availability"
    ],
    "criteria": [
      {
        "id": "ratio",
        "title": "合意したサービス提供時間に対する利用可能時間の割合",
        "hint": "サービス可用性とは？"
      },
      {
        "id": "calc",
        "title": "(提供時間－停止時間)÷提供時間で求める",
        "hint": "どう計算しますか？"
      },
      {
        "id": "planned",
        "title": "合意した計画停止は停止時間に含めない",
        "hint": "計画停止は含めますか？",
        "level": "deep"
      },
      {
        "id": "vs-availability",
        "title": "機器の稼働率（MTBF/MTTR）ではなく利用者から見た可用性",
        "hint": "機器の稼働率との違いは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "capacity-continuity",
    "name": "容量・能力管理",
    "reading": "Capacity management",
    "category": "サービス管理",
    "definition": "現在と将来の需要を満たせるように、ITサービスの資源や性能を計画し、監視・調整する活動です。",
    "example": "利用者の増加を予測して、サーバーの資源と性能を計画します。",
    "related": [
      "service-continuity",
      "slm",
      "capacity-planning"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "需要を満たすためにIT資源や性能を計画・監視する活動",
        "hint": "現在と将来の何に合わせて資源を管理しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "service-continuity",
    "name": "サービス継続管理",
    "reading": "Service continuity management",
    "category": "サービス管理",
    "definition": "災害などの重大な事態でも、合意したレベルでサービスを継続・復旧できるように備える活動です。",
    "example": "別拠点でサービスを復旧する計画を作り、定期的に訓練します。",
    "related": [
      "capacity-continuity",
      "slm",
      "capacity-planning"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "重大な事態でも合意したレベルでサービスを継続・復旧するために備える",
        "hint": "どのような事態に備え、何を維持・復旧しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "audit-standards",
    "name": "システム監査基準",
    "aliases": [
      "所見",
      "正当な懐疑心",
      "正当な注意",
      "独立性",
      "再現性"
    ],
    "reading": "System audit standards",
    "category": "システム監査",
    "definition": "経済産業省が定める、システム監査の実施に関する規範です。監査人の独立性・客観性、専門職としての正当な注意と正当な懐疑心、監査計画、監査手続と監査証拠、監査調書、報告とフォローアップなどを定めています。",
    "example": "監査人は、被監査部門の説明をうのみにせず、正当な懐疑心を持って証拠を確かめます。",
    "related": [
      "risk-approach"
    ],
    "criteria": [
      {
        "id": "norm",
        "title": "システム監査の実施に関する規範",
        "hint": "システム監査基準とは？"
      },
      {
        "id": "independence",
        "title": "監査人は監査対象から独立し、客観的な立場を保つ",
        "hint": "監査人に求められる立場は？",
        "level": "deep"
      },
      {
        "id": "skepticism",
        "title": "正当な注意と正当な懐疑心を持って監査する",
        "hint": "監査人の心構えは？",
        "level": "deep"
      },
      {
        "id": "finding",
        "title": "監査証拠から得た事実に基づく評価を所見（監査意見の根拠）とする",
        "hint": "所見とは？",
        "level": "deep"
      },
      {
        "id": "reproducible",
        "title": "第三者が同じ結論に至れるよう監査調書に記録する",
        "hint": "なぜ調書を残すのですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "audit-procedure",
    "name": "監査手続",
    "reading": "Audit procedures",
    "category": "システム監査",
    "definition": "監査意見の根拠となる監査証拠を入手・評価するために、監査人が実施する具体的な手続です。",
    "example": "アクセス権一覧と人事情報を突き合わせ、不要な権限がないか確かめます。",
    "related": [
      "audit-evidence",
      "audit-standards",
      "audit-techniques"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "監査証拠を入手・評価するために実施する手続",
        "hint": "何を入手・評価するための手続ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "audit-evidence",
    "name": "監査証拠",
    "reading": "Audit evidence",
    "category": "システム監査",
    "definition": "監査人が監査の結論や意見の根拠として用いる情報です。結論を支えるために十分かつ適切であることが求められます。",
    "example": "権限設定の記録や操作ログを、統制が適切か判断する根拠にします。",
    "related": [
      "audit-procedure",
      "audit-standards",
      "audit-techniques"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "監査の結論・意見の根拠となる情報",
        "hint": "監査で集めた情報を、何の根拠にしますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "preliminary-survey",
    "name": "予備調査",
    "reading": "Preliminary survey",
    "category": "システム監査",
    "definition": "監査対象の実態を把握し、本調査で行う監査手続を具体化するための調査です。資料の確認やヒアリングなどを行います。",
    "example": "業務マニュアルを読んで対象の業務を理解し、本調査で確かめる事項を決めます。",
    "related": [
      "main-survey",
      "audit-procedure"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "監査対象の実態を把握し、本調査の監査手続を具体化する調査",
        "hint": "本調査に向けて、何を把握して決めますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "main-survey",
    "name": "本調査",
    "reading": "Main survey",
    "category": "システム監査",
    "definition": "監査計画などに沿って監査手続を実施し、監査証拠を入手・評価する調査です。",
    "example": "決めた手続に従って操作ログや権限設定を確認し、統制を評価します。",
    "related": [
      "preliminary-survey",
      "audit-procedure"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "監査手続を実施して監査証拠を入手・評価する調査",
        "hint": "監査の手続を実施して、何を集めますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "audit-techniques",
    "name": "監査技法",
    "aliases": [
      "ウォークスルー法",
      "ドキュメントレビュー法",
      "インタビュー法",
      "テストデータ法",
      "チェックリスト法",
      "突合・照合法",
      "現地調査法",
      "コンピュータ支援監査技法"
    ],
    "reading": "Audit techniques",
    "category": "システム監査",
    "definition": "監査の目的に応じて、証拠を集めて確かめるための具体的な調査・検証の方法です。文書の確認、聞き取り、現場の観察、データの検証などを使い分けます。",
    "example": "規程の記載だけで判断せず、記録の確認や現場での観察も行って、決められた手続が実行されているか確かめます。",
    "related": [
      "audit-procedure"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "監査証拠を集めて確かめるための具体的な調査・検証の方法",
        "hint": "何を得るために使う方法ですか？"
      },
      {
        "id": "selection",
        "title": "監査目的と対象に応じ、文書・聞き取り・観察・データ検証などの方法を選ぶ",
        "hint": "何を確かめたいかに応じて、どのように調査方法を選びますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "proof-list",
    "name": "プルーフリスト",
    "aliases": [
      "網羅性"
    ],
    "reading": "Proof list",
    "category": "システム監査",
    "definition": "データを入力したあとに、入力した内容を一覧で出力したものです。元の伝票と突き合わせて、入力漏れや重複、誤りがないこと（網羅性・正確性）を確認するのに使います。",
    "example": "1日の受注伝票とプルーフリストの件数・合計金額を照合し、入力漏れがないことを確かめます。",
    "related": [
      "application-control"
    ],
    "criteria": [
      {
        "id": "list",
        "title": "入力したデータを一覧にして出力したもの",
        "hint": "プルーフリストとは？"
      },
      {
        "id": "match",
        "title": "元の伝票と突き合わせ入力の漏れ・重複・誤りを確かめる",
        "hint": "何に使いますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "audit-follow-up",
    "name": "フォローアップ",
    "aliases": [
      "改善提案"
    ],
    "reading": "Follow-up",
    "category": "システム監査",
    "definition": "システム監査で、監査報告書に記載した改善提案に対して、被監査部門が改善を実施しているかを確認する活動です。改善を実施するのは被監査部門で、監査人は状況を確認して評価します。",
    "example": "前回の監査で指摘したパスワード管理の改善が、半年後に実施されているかを確認します。",
    "related": [
      "audit-standards"
    ],
    "criteria": [
      {
        "id": "confirm",
        "title": "改善提案に対する改善の実施状況を確認する",
        "hint": "フォローアップで何をしますか？"
      },
      {
        "id": "who",
        "title": "改善を実施するのは監査人ではなく被監査部門",
        "hint": "誰が改善しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "監査人が自ら改善を実施する、とする誤りがあります（独立性を損ないます）。"
    ]
  },
  {
    "id": "it-governance",
    "name": "ITガバナンス",
    "aliases": [
      "ガバナンス",
      "マネジメント",
      "コントロール",
      "IT投資",
      "PDCAサイクル"
    ],
    "reading": "Information technology governance",
    "category": "システム戦略",
    "definition": "経営陣が、ITの活用について方針を示し、IT投資や利用が組織の目標に沿っているかを評価・指示・モニタリングする仕組みです。ガバナンスは経営陣による方向付け、マネジメントはその方針に沿った計画と実行、コントロールは目標どおりに進むよう管理する仕組みを指します。",
    "example": "経営会議がIT投資の優先順位を決め、その効果を定期的に評価するのはITガバナンスの活動です。",
    "related": [],
    "criteria": [
      {
        "id": "edm",
        "title": "経営陣が評価・指示・モニタリング（EDM）を行う",
        "hint": "ITガバナンスで経営陣は何をしますか？"
      },
      {
        "id": "investment",
        "title": "IT投資が経営目標に貢献しているかを評価する",
        "hint": "IT投資との関係は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "program-management",
    "name": "プログラムマネジメント",
    "aliases": [
      "プロジェクトマネジメント",
      "相乗効果",
      "経営資源"
    ],
    "reading": "Program management",
    "category": "プロジェクト管理",
    "definition": "互いに関連する複数のプロジェクトをまとめて管理し、個々のプロジェクトでは得られない相乗効果（シナジー）で戦略的な目標を達成することです。個々のプロジェクトを計画どおり完了させるのはプロジェクトマネジメントです。",
    "example": "新物流センターの建設、システム刷新、組織再編の3つのプロジェクトを、物流改革という1つのプログラムとして管理します。",
    "related": [],
    "criteria": [
      {
        "id": "multi",
        "title": "関連する複数のプロジェクトをまとめて管理する",
        "hint": "何を管理しますか？"
      },
      {
        "id": "synergy",
        "title": "相乗効果により戦略目標を達成する",
        "hint": "何を目指しますか？",
        "level": "deep"
      },
      {
        "id": "resource",
        "title": "プロジェクト間で経営資源（人・もの・金・情報）を配分・調整する",
        "hint": "プロジェクト間で調整するものは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "pmbok",
    "name": "PMBOK",
    "aliases": [
      "コストの管理"
    ],
    "reading": "Project Management Body of Knowledge",
    "category": "プロジェクト管理",
    "definition": "米国PMIがまとめたプロジェクトマネジメントの知識体系です。スコープ、スケジュール、コスト、品質、資源、コミュニケーション、リスク、調達、ステークホルダーなどの知識エリアで、必要な管理を整理しています。",
    "example": "コストの管理では、EVMで予算と実績の差を監視し、必要なら是正処置をとります。",
    "related": [
      "evm"
    ],
    "criteria": [
      {
        "id": "body",
        "title": "プロジェクトマネジメントの知識体系",
        "hint": "PMBOKとは？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "project-charter",
    "name": "プロジェクト憲章",
    "aliases": [
      "プロジェクトマネジメント計画書"
    ],
    "reading": "Project charter",
    "category": "プロジェクト管理",
    "definition": "プロジェクトを正式に認可し、プロジェクトマネージャーに組織の資源を使う権限を与える文書です。目的、概要、主要な成果物、マイルストーン、予算の概略などを記します。詳細な進め方は、その後に作るプロジェクトマネジメント計画書にまとめます。",
    "example": "スポンサーが憲章に署名して初めて、プロジェクトマネージャーは要員を集め始められます。",
    "related": [
      "pmbok",
      "scope-statement"
    ],
    "criteria": [
      {
        "id": "authorize",
        "title": "プロジェクトを正式に認可し、PMに権限を与える",
        "hint": "何のための文書ですか？"
      },
      {
        "id": "content",
        "title": "目的や主要な成果物、マイルストーン、予算の概略を記す",
        "hint": "何を書きますか？",
        "level": "deep"
      },
      {
        "id": "plan",
        "title": "詳細な実行方法はプロジェクトマネジメント計画書にまとめる",
        "hint": "憲章の後に作る計画書は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "scope-statement",
    "name": "プロジェクト・スコープ記述書",
    "aliases": [
      "スコープ",
      "除外事項"
    ],
    "reading": "Project scope statement",
    "category": "プロジェクト管理",
    "definition": "プロジェクトで作る成果物と、そのための作業（スコープ）を記述した文書です。成果物、受入れ基準、除外事項（スコープに含めないもの）、制約条件、前提条件などを明確にし、スコープの膨張を防ぎます。",
    "example": "「データ移行は含むが、旧システムの撤去は除外事項とする」と記述します。",
    "related": [
      "wbs"
    ],
    "criteria": [
      {
        "id": "scope",
        "title": "プロジェクトの成果物と作業範囲を記述する",
        "hint": "何を記述しますか？"
      },
      {
        "id": "exclusion",
        "title": "含めないもの（除外事項）を明記する",
        "hint": "範囲外のことはどう扱いますか？",
        "level": "deep"
      },
      {
        "id": "wbs",
        "title": "スコープ記述書を基にWBSを作成する",
        "hint": "この文書の後に作るものは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "wbs",
    "name": "WBS",
    "reading": "Work Breakdown Structure",
    "category": "プロジェクト管理",
    "definition": "プロジェクトの成果物と作業を、管理しやすい大きさ（ワークパッケージ）まで階層的に分解したものです。スケジュール作成、見積り、担当の割当ての基礎になります。",
    "example": "「新システム構築」を「設計」「開発」「テスト」に、さらに「画面設計」「帳票設計」…と分解します。",
    "related": [
      "scope-statement"
    ],
    "criteria": [
      {
        "id": "decompose",
        "title": "成果物と作業を階層的に分解する",
        "hint": "WBSとは？"
      },
      {
        "id": "package",
        "title": "最下位はワークパッケージで、見積りや割当ての単位になる",
        "hint": "どこまで分解しますか？",
        "level": "deep"
      },
      {
        "id": "100",
        "title": "すべての作業を漏れなく含める（100%ルール）",
        "hint": "分解のルールは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "schedule-compression",
    "name": "クラッシング",
    "reading": "Crashing",
    "category": "プロジェクト管理",
    "definition": "クリティカルパス上の作業に人員や設備などの資源を追加し、プロジェクトの期間を短縮する技法です。追加費用と短縮できる日数を考えて実施します。",
    "example": "テスト要員を追加して、完了までの日数を短縮します。",
    "related": [
      "fast-tracking",
      "critical-path"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "資源を追加して、クリティカルパス上の作業期間を短縮する",
        "hint": "期間を短縮するために、何を追加しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "fast-tracking",
    "name": "ファストトラッキング",
    "reading": "Fast tracking",
    "category": "プロジェクト管理",
    "definition": "通常は順番に進める作業を、並行又は一部重ねて進めてプロジェクトの期間を短縮する技法です。先行作業の変更によって手戻りが生じるリスクがあります。",
    "example": "設計がすべて終わる前に、確定した部分から開発を始めます。",
    "related": [
      "schedule-compression",
      "critical-path"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "通常は順番に進める作業を並行させて、期間を短縮する",
        "hint": "作業の進め方をどう変えて短縮しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "emv",
    "name": "期待金額価値",
    "aliases": [
      "投資額"
    ],
    "reading": "Expected Monetary Value (EMV)",
    "category": "プロジェクト管理",
    "definition": "不確実な結果について、それぞれの金額に発生確率を掛けて合計した値です。デシジョンツリーで複数の案を比べるとき、投資額を差し引いた期待金額価値の大きい案を選びます。",
    "example": "成功確率60%で1,000万円、失敗で200万円の案は、0.6×1,000＋0.4×200＝680万円です。",
    "related": [],
    "criteria": [
      {
        "id": "calc",
        "title": "金額×発生確率の合計で求める",
        "hint": "どう計算しますか？"
      },
      {
        "id": "choose",
        "title": "費用も含めて同じ基準の期待値を求め、案の比較や意思決定に使う",
        "hint": "投資額や損失も考慮して、どのように案を比較しますか？",
        "level": "deep"
      },
      {
        "id": "tree",
        "title": "デシジョンツリーで分岐ごとに計算し、投資額を差し引いて比較する",
        "hint": "案ごとの比較の仕方は？",
        "level": "deep"
      },
      {
        "id": "risk",
        "title": "リスクの定量的分析で使う",
        "hint": "どんな場面で使いますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "contingency-plan",
    "name": "コンティンジェンシープラン",
    "aliases": [
      "コンティンジェンシー予備費",
      "リスク",
      "外注先"
    ],
    "reading": "Contingency plan",
    "category": "プロジェクト管理",
    "definition": "リスクが実際に起きたときに備えて、あらかじめ用意しておく対応計画です。プロジェクトでは、特定したリスクに対するコンティンジェンシー予備費（予算）や予備期間を確保します。リスクへの対応には回避・転嫁・軽減・受容があります。",
    "example": "外注先が倒産した場合に備えて、別の外注先候補と移行手順を決めておきます。",
    "related": [],
    "criteria": [
      {
        "id": "prepare",
        "title": "リスクが顕在化したときの対応をあらかじめ決めておく",
        "hint": "コンティンジェンシープランとは？"
      },
      {
        "id": "reserve",
        "title": "特定したリスクに備えてコンティンジェンシー予備費を確保する",
        "hint": "予算面の備えは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "design-review",
    "name": "デザインレビュー",
    "aliases": [
      "品質保証",
      "出荷判定"
    ],
    "reading": "Design review",
    "category": "開発技術",
    "definition": "設計の各段階で、関係者が設計書を評価し、誤りや問題点を早く見つけるための会議や活動です。後工程での手戻りを減らし、品質を確保します。製品の出荷可否を判断する出荷判定とは目的が異なります。",
    "example": "基本設計が終わった時点で、業務部門と開発者が設計書を確認し、要件の漏れを見つけます。",
    "related": [],
    "criteria": [
      {
        "id": "early",
        "title": "設計段階で誤りを早期に発見する",
        "hint": "デザインレビューの目的は？"
      },
      {
        "id": "rework",
        "title": "後工程での手戻りを減らす",
        "hint": "早く見つけるとどんな利点がありますか？",
        "level": "deep"
      },
      {
        "id": "qa",
        "title": "品質保証の活動の一つで、工程ごとに実施する",
        "hint": "どの活動に位置づきますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "scrum",
    "name": "スクラム",
    "aliases": [
      "スプリントプランニング",
      "デイリースクラム",
      "ステークホルダ"
    ],
    "reading": "Scrum",
    "category": "開発技術",
    "definition": "アジャイル開発の代表的な手法です。スプリントという短い期間を繰り返し、スプリントプランニングで作業を決め、毎日デイリースクラムで状況を共有し、スプリントレビューで成果物をステークホルダーに見せてフィードバックを受け、レトロスペクティブで進め方を振り返ります。",
    "example": "2週間のスプリントの最後に、動くソフトウェアを利用部門に見せて意見をもらいます。",
    "related": [],
    "criteria": [
      {
        "id": "sprint",
        "title": "短い期間（スプリント）を繰り返して開発する",
        "hint": "開発をどう区切りますか？"
      },
      {
        "id": "review",
        "title": "スプリントレビューで成果物を確認しフィードバックを受ける",
        "hint": "成果物を見せるイベントは？",
        "level": "deep"
      },
      {
        "id": "retro",
        "title": "レトロスペクティブでプロセスを振り返り改善する",
        "hint": "進め方を改善するイベントは？",
        "level": "deep"
      },
      {
        "id": "planning",
        "title": "スプリントプランニングで何をするかを決め、デイリースクラムで毎日同期する",
        "hint": "スプリントの始めと毎日のイベントは？",
        "level": "deep"
      },
      {
        "id": "roles",
        "title": "プロダクトオーナーは価値や優先順位、スクラムマスターはスクラムの実践支援、開発者は成果物の作成を担う",
        "hint": "スクラムのチームでは、主な責任をどのように分担しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "スプリントレビューを進め方の振り返りとする誤りがあります（それはレトロスペクティブ）。"
    ]
  },
  {
    "id": "quality-characteristics",
    "name": "品質特性",
    "aliases": [
      "使用性",
      "保守性",
      "機能適合性"
    ],
    "reading": "Software quality characteristics",
    "category": "開発技術",
    "definition": "ソフトウェアなどの品質を評価するため、その性質を複数の観点に整理したものです。特性ごとに評価したい内容や測定量を決めて品質を確認します。",
    "example": "品質を一つの数値だけで決めず、性能や保守のしやすさなど、目的に合う複数の観点で確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ソフトウェアなどの品質を評価するため、性質を複数の観点で整理したもの",
        "hint": "品質を評価するとき、どのような役割を持つ分類ですか？"
      },
      {
        "id": "measure",
        "title": "品質特性ごとに測定量（メトリクス）を決めて評価する",
        "hint": "どうやって評価しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "reliability-growth",
    "name": "ソフトウェア信頼度成長モデル",
    "aliases": [
      "ゴンペルツ曲線",
      "累積誤り検出数"
    ],
    "reading": "Software reliability growth model",
    "category": "開発技術",
    "definition": "テストの進み具合と、見つかった誤りの累積数の関係を表すモデルです。累積誤り検出数はゴンペルツ曲線やロジスティック曲線のようなS字を描き、曲線が飽和に近づけば残っている誤りが少ないと判断できます。",
    "example": "テスト工数を増やしても累積誤り検出数がほぼ増えなくなったので、品質が安定してきたと判断します。",
    "related": [],
    "criteria": [
      {
        "id": "cumulative",
        "title": "テストの進み具合と累積誤り検出数の関係を表す",
        "hint": "何と何の関係ですか？"
      },
      {
        "id": "saturate",
        "title": "曲線が飽和に近づけば残存誤りが少ないと判断できる",
        "hint": "テストの終わりをどう判断しますか？",
        "level": "deep"
      },
      {
        "id": "early",
        "title": "初期に増えないのは誤りが少ないのではなくテストが進んでいないこともある",
        "hint": "初期の傾きが小さいとき注意することは？",
        "level": "deep"
      },
      {
        "id": "scurve",
        "title": "ゴンペルツ曲線などのS字曲線を描く",
        "hint": "曲線の形は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "low-code",
    "name": "ローコード開発",
    "aliases": [
      "ノーコード開発"
    ],
    "reading": "Low-code development",
    "category": "開発技術",
    "definition": "プログラムをほとんど書かず、画面上で部品を組み合わせたり設定したりしてアプリケーションを作る開発手法です。コードを全く書かないものはノーコード開発といいます。開発が速く、業務部門でも作れる一方、複雑な処理には向きません。",
    "example": "業務部門が、画面の部品を並べて申請フォームと承認フローを1日で作ります。",
    "related": [],
    "criteria": [
      {
        "id": "gui",
        "title": "画面上の部品の組合せや設定で開発し、コードをほとんど書かない",
        "hint": "どうやって開発しますか？"
      },
      {
        "id": "speed",
        "title": "開発が速く、専門家でなくても作れる",
        "hint": "利点は？",
        "level": "deep"
      },
      {
        "id": "limit",
        "title": "複雑な処理や大規模なシステムには向かず、プラットフォームへの依存が生じる",
        "hint": "欠点は？",
        "level": "deep"
      },
      {
        "id": "shadow",
        "title": "業務部門が管理外で作ると、統制や情報漏えいの問題が生じる",
        "hint": "統制面の課題は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "prototyping",
    "name": "プロトタイピング",
    "reading": "Prototyping",
    "category": "開発技術",
    "definition": "開発の早い段階で試作品（プロトタイプ）を作って利用者に見せ、意見をもとに要求を明確にしたり設計を改良したりする開発手法です。利用者の要求があいまいなときに有効です。",
    "example": "画面だけの試作品を見せたら、「この項目は一覧で見たい」という要望が出てきました。",
    "related": [],
    "criteria": [
      {
        "id": "prototype",
        "title": "早い段階で試作品を作り利用者に評価してもらう",
        "hint": "どう進めますか？"
      },
      {
        "id": "clarify",
        "title": "要求を明確にでき、認識のずれを減らせる",
        "hint": "どんなときに有効ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "integration-test",
    "name": "結合テスト",
    "reading": "Integration test",
    "category": "開発技術",
    "definition": "複数のモジュールやサブシステムを組み合わせ、呼出しやデータの受渡しなどのインタフェースが正しく動くかを確認するテストです。",
    "example": "注文処理から在庫管理を呼び出したときに、商品番号や数量が正しく渡され、結果を受け取れるか確かめます。",
    "related": [
      "bottom-up-test",
      "big-bang-test",
      "test-stub",
      "test-driver"
    ],
    "criteria": [
      {
        "id": "interface",
        "title": "モジュール間のインタフェースを確かめる",
        "hint": "何を確かめるテストですか？"
      },
      {
        "id": "selection",
        "title": "結合の順序に応じて代替モジュールを用意し、不具合の切り分けやすさを考えて進める",
        "hint": "まだ完成していない部分をどう補い、どのように結合を進めますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "スタブとドライバを取り違える誤りがあります。"
    ]
  },
  {
    "id": "backup",
    "name": "バックアップ方式",
    "aliases": [
      "復旧",
      "バックアップ"
    ],
    "reading": "Backup methods",
    "category": "サービス管理",
    "definition": "障害や誤操作でデータを失った場合に復旧できるよう、データの複製を別に保存することです。取得に必要な時間や容量と、復旧時に必要な世代や時間を考えて方式を選びます。",
    "example": "バックアップを定期的に取得するだけでなく、必要な時点のデータに復旧できるか、復元手順も確認します。",
    "related": [
      "rto-rpo",
      "full-backup",
      "differential-backup",
      "incremental-backup"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "障害や誤操作によるデータ喪失に備えて、復旧に使うデータの複製を別に保存する",
        "hint": "何に備えて、どのようなデータを保存しますか？"
      },
      {
        "id": "restore",
        "title": "取得時間や容量に加え、復旧時に必要な世代と復旧時間を考えて方式を選ぶ",
        "hint": "取得の手間だけでなく、復旧時には何を考慮しますか？",
        "level": "deep"
      },
      {
        "id": "offline",
        "title": "ランサムウェアに備えてネットワークから切り離した世代を残す（3-2-1ルール）",
        "hint": "最近重視される備えは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rlo",
    "name": "RLO",
    "reading": "Recovery Level Objective",
    "category": "サービス管理",
    "definition": "災害などでサービスが止まったとき、どの水準（レベル）まで業務やサービスを復旧させるかの目標です。いつまでに（RTO）、どの時点のデータまで（RPO）と組み合わせて復旧の目標を定めます。",
    "example": "「震災時は3日以内（RTO）に、通常の50%の処理能力（RLO）で受注業務を再開する」と定めます。",
    "related": [
      "rto-rpo",
      "rpo"
    ],
    "criteria": [
      {
        "id": "level",
        "title": "どの水準まで復旧させるかの目標",
        "hint": "RLOは何を表しますか？"
      },
      {
        "id": "bcp",
        "title": "事業継続計画（BCP）で、優先業務ごとに目標を決める",
        "hint": "どの計画で定めますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "traceability",
    "name": "トレーサビリティ",
    "aliases": [
      "システム要件定義",
      "利害関係者",
      "要件定義"
    ],
    "reading": "Traceability",
    "category": "開発技術",
    "definition": "要件定義から設計・プログラム・テストまで、成果物どうしの対応関係を追跡できることです。どの要件がどの設計とテストで実現・確認されたかが分かり、漏れの発見や変更の影響範囲の特定に役立ちます。",
    "example": "要件番号R-12に対応する設計書と試験項目を一覧表で追えるようにし、変更時の影響範囲を調べます。",
    "related": [],
    "criteria": [
      {
        "id": "trace",
        "title": "要件から設計・実装・テストまでの対応関係を追跡できる",
        "hint": "何を追跡できますか？"
      },
      {
        "id": "benefit",
        "title": "漏れの発見や変更の影響範囲の特定に役立つ",
        "hint": "利点は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rfi-rfp",
    "name": "RFI",
    "aliases": [
      "情報提供依頼書"
    ],
    "reading": "Request for Information",
    "category": "システム戦略",
    "definition": "システムなどの調達に先立ち、技術動向や製品・サービスに関する情報をベンダーから集めるための依頼書です。",
    "example": "候補となる製品の機能や提供条件について、各社に情報提供を依頼します。",
    "related": [
      "rfp"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ベンダーから製品や技術などの情報を集めるための依頼書",
        "hint": "具体的な提案より前に、何を集めますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rfp",
    "name": "RFP",
    "aliases": [
      "提案依頼書"
    ],
    "reading": "Request for Proposal",
    "category": "システム戦略",
    "definition": "調達するシステムなどの要件や条件を提示し、ベンダーに具体的な提案を求めるための依頼書です。",
    "example": "必要な機能や予算・納期を示して、実現方法と見積りの提案を求めます。",
    "related": [
      "rfi-rfp"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "要件や条件を示して、ベンダーに具体的な提案を求める依頼書",
        "hint": "ベンダーに何を提示し、何を求めますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "model-contract",
    "name": "モデル契約",
    "aliases": [
      "準委任型",
      "請負型",
      "請負",
      "運用テスト"
    ],
    "reading": "Model contract",
    "category": "法務",
    "definition": "情報システム開発などの取引で、当事者の役割・責任・契約条件を明確にするための契約書のひな型です。工程や取引の実態に応じて利用・調整します。",
    "example": "開発工程ごとに、作業の範囲、発注者と受注者の役割、成果や責任について契約で明らかにします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "システム開発などの契約で、当事者の役割・責任・取引条件を整理するためのひな型",
        "hint": "契約の何を明らかにするためのモデルですか？"
      },
      {
        "id": "phase",
        "title": "工程や成果の性質に応じ、当事者が負う作業・完成などの責任を契約で明らかにする",
        "hint": "作業の性質によって、契約上の責任をどのように整理しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "copyright",
    "name": "著作権",
    "aliases": [
      "職務著作",
      "類似性",
      "依拠性",
      "アルゴリズム",
      "通信プロトコル"
    ],
    "reading": "Copyright",
    "category": "法務",
    "definition": "思想や感情を創作的に表現した著作物を保護し、複製などの利用を管理する権利です。登録を要せず創作した時点で発生し、アイデアそのものは保護の対象になりません。著作者人格権は譲渡できない別の権利として区別します。",
    "example": "プログラムに書かれた創作的な表現は保護されますが、その処理のアイデア自体を独占できるわけではありません。",
    "related": [
      "author-moral-rights",
      "right-of-integrity"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "創作的な表現を保護し、複製などの利用を権利者が管理できる権利",
        "hint": "何を保護し、どのような行為に関する権利ですか？"
      },
      {
        "id": "auto",
        "title": "創作した時点で発生し、登録は不要",
        "hint": "権利はいつ発生しますか？"
      },
      {
        "id": "scope",
        "title": "アルゴリズムやプロトコルなどのアイデアは保護されない",
        "hint": "プログラムのどの部分が保護されませんか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "同一性保持権を譲渡できるとする誤りがあります。契約では「著作者人格権を行使しない」と定めます。"
    ]
  },
  {
    "id": "design-act",
    "name": "意匠法",
    "aliases": [
      "GUI"
    ],
    "reading": "Design Act",
    "category": "法務",
    "definition": "物品や建築物、画像のデザイン（形状・模様・色彩など）を保護する法律です。登録によって権利が発生します。2020年の改正で、物品に表示されない画像（操作画面などのGUI）も保護対象になりました。",
    "example": "新しいスマートフォンアプリの操作画面のデザインを、意匠登録して模倣を防ぎます。",
    "related": [
      "copyright"
    ],
    "criteria": [
      {
        "id": "design",
        "title": "物品などの外観のデザインを保護する",
        "hint": "何を保護する法律ですか？"
      },
      {
        "id": "register",
        "title": "権利の発生には登録が必要",
        "hint": "著作権との違いは？"
      },
      {
        "id": "gui",
        "title": "操作画面などの画像（GUI）も保護対象になった",
        "hint": "画面デザインは保護されますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "patent",
    "name": "特許権",
    "aliases": [
      "ビジネスモデル"
    ],
    "reading": "Patent right",
    "category": "法務",
    "definition": "自然法則を利用した技術的なアイデア（発明）を、出願・審査・登録を経て一定期間独占的に利用できる権利です。ITを使った新しい事業の仕組みも、技術的な特徴があればビジネスモデル特許として認められることがあります。",
    "example": "ネット通販の「ワンクリック注文」の仕組みは、ビジネスモデル特許として知られています。",
    "related": [
      "copyright"
    ],
    "criteria": [
      {
        "id": "invention",
        "title": "自然法則を利用した技術的な発明を保護する",
        "hint": "何を保護しますか？"
      },
      {
        "id": "register",
        "title": "出願して審査を受け、登録によって権利が発生する",
        "hint": "発明しただけで権利は発生しますか？"
      },
      {
        "id": "business",
        "title": "技術的な特徴を伴えばビジネスモデルも特許になり得る",
        "hint": "ビジネスの仕組みは特許になりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "unfair-competition",
    "name": "不正競争防止法",
    "aliases": [
      "商品等表示"
    ],
    "reading": "Unfair Competition Prevention Act",
    "category": "法務",
    "definition": "事業者間の公正な競争を守るため、不正な競争行為を規制する法律です。営業秘密の不正取得や、他社との混同を招く表示などを規制します。",
    "example": "他社の有名ブランド名に似たドメイン名を取り、転売目的で保有するのは不正競争です。",
    "related": [
      "domain-name"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "事業者間の公正な競争を守るため、不正な競争行為を規制する法律",
        "hint": "何を守るため、どのような行為を規制しますか？"
      },
      {
        "id": "examples",
        "title": "営業秘密の不正取得や他社との混同を招く表示などが規制対象になる",
        "hint": "規制される不正な競争行為の例を説明できますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "trademark",
    "name": "商標権",
    "reading": "Trademark right",
    "category": "法務",
    "definition": "商品やサービスに使う文字・図形・記号などのマーク（商標）を、登録によって独占的に使用できる権利です。存続期間は登録から10年で、更新を繰り返せます。",
    "example": "自社の新製品の名前とロゴを商標登録し、他社が似た名前で販売するのを防ぎます。",
    "related": [
      "unfair-competition"
    ],
    "criteria": [
      {
        "id": "mark",
        "title": "商品・サービスに使うマークを保護する",
        "hint": "何を保護しますか？"
      },
      {
        "id": "register",
        "title": "権利の発生には登録が必要で、更新により維持できる",
        "hint": "使用し始めただけで登録商標の権利が発生しますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "anonymized-info",
    "name": "匿名加工情報",
    "aliases": [
      "個人情報保護法",
      "第三者提供",
      "個人情報保護委員会"
    ],
    "reading": "Anonymized information",
    "category": "法務",
    "definition": "特定の個人を識別できないように個人情報を加工し、元に戻せないようにした情報です。個人情報保護法の定める基準に従って加工し、作成したことや第三者提供する項目を公表すれば、本人の同意なしに第三者提供できます。所管は個人情報保護委員会です。",
    "example": "購買履歴から氏名や会員番号を削除し、生年月日を年代に丸めて、商品開発のために他社へ提供します。",
    "related": [],
    "criteria": [
      {
        "id": "irreversible",
        "title": "特定の個人を識別できず、復元できないよう加工する",
        "hint": "どんな加工をしますか？"
      },
      {
        "id": "consent",
        "title": "公表などの手続をすれば本人の同意なく第三者提供できる",
        "hint": "第三者提供に同意は要りますか？",
        "level": "deep"
      },
      {
        "id": "publish",
        "title": "提供時に提供する情報の項目と方法を公表し、相手に匿名加工情報であることを明示する",
        "hint": "提供時の義務は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "erp",
    "name": "ERP",
    "aliases": [
      "業務プロセス",
      "フィット＆ギャップ分析"
    ],
    "reading": "Enterprise Resource Planning",
    "category": "システム戦略",
    "definition": "販売・生産・会計・人事など企業の基幹業務を統合し、経営資源を一元的に管理して有効に活用する考え方、またはそのためのパッケージソフトウェア（ERPパッケージ）です。導入時はフィット＆ギャップ分析で、パッケージの機能と自社の業務プロセスの合う点・合わない点を洗い出します。",
    "example": "受注を入力すると、在庫・生産計画・会計に自動で反映されます。",
    "related": [
      "soa",
      "bpr"
    ],
    "criteria": [
      {
        "id": "integrate",
        "title": "基幹業務を統合して経営資源を一元管理する",
        "hint": "ERPとは？"
      },
      {
        "id": "package",
        "title": "ERPパッケージとして導入されることが多い",
        "hint": "どう導入しますか？",
        "level": "deep"
      },
      {
        "id": "fitgap",
        "title": "フィット＆ギャップ分析でパッケージ機能と業務の差異を洗い出す",
        "hint": "導入前に行う分析は？",
        "level": "deep"
      },
      {
        "id": "adapt",
        "title": "差異は業務をパッケージに合わせるか、追加開発で埋める",
        "hint": "合わない部分はどうしますか？",
        "level": "deep"
      },
      {
        "id": "addon",
        "title": "追加開発が多いとバージョンアップが難しくなる",
        "hint": "カスタマイズしすぎの問題は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "bpr",
    "name": "BPR",
    "aliases": [
      "BPM",
      "外部委託"
    ],
    "reading": "Business Process Reengineering",
    "category": "システム戦略",
    "definition": "業務の目的に立ち返って、既存の業務プロセスを抜本的に再設計し、コスト・品質・スピードなどを劇的に改善することです。ITの活用や外部委託を組み合わせます。継続的に業務プロセスを改善していくのはBPM（ビジネスプロセスマネジメント）です。",
    "example": "紙の申請と三段階の押印による承認を廃止し、ワークフローシステムで即日承認に変えます。",
    "related": [
      "erp"
    ],
    "criteria": [
      {
        "id": "radical",
        "title": "業務プロセスを抜本的に再設計する",
        "hint": "BPRとは？"
      },
      {
        "id": "effect",
        "title": "コスト・品質・スピードを劇的に改善する",
        "hint": "何を目指しますか？",
        "level": "deep"
      },
      {
        "id": "money",
        "title": "効果は人件費や外部委託費の削減などで金額として評価する",
        "hint": "効果をどう評価しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "investment-evaluation",
    "name": "投資評価手法",
    "aliases": [
      "NPV",
      "PBP法",
      "NPV法",
      "IRR法",
      "キャッシュフロー",
      "割引率",
      "回収期間"
    ],
    "reading": "Investment appraisal",
    "category": "経営管理",
    "definition": "投資に必要な費用と将来の効果を評価し、実行の可否や案の選択に役立てる手法の総称です。投資効率・回収期間・貨幣の時間価値など、評価したい観点に応じて手法を使い分けます。",
    "example": "投資額1,000万円で毎年400万円の効果があれば、回収期間は2.5年です。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "投資に必要な費用と将来の効果を評価して、実行の可否や案の選択に役立てる手法",
        "hint": "投資の何を評価し、どのような判断に使いますか？"
      },
      {
        "id": "comparison",
        "title": "投資効率・回収期間・貨幣の時間価値など、重視する観点に応じて手法を使い分ける",
        "hint": "評価の目的によって、どのような観点を選びますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "balanced-scorecard",
    "name": "バランススコアカード",
    "aliases": [
      "BSC",
      "戦略マップ",
      "内部ビジネスプロセス",
      "学習と成長"
    ],
    "reading": "Balanced Scorecard (BSC)",
    "category": "経営戦略",
    "definition": "企業の戦略を、財務・顧客・内部ビジネスプロセス・学習と成長の4つの視点で目標と指標に落とし込み、バランスよく管理する手法です。視点間の因果関係（学習と成長→業務プロセス→顧客→財務）を図にしたのが戦略マップです。",
    "example": "社員教育（学習と成長）→作業ミスの減少（業務プロセス）→顧客満足度（顧客）→売上（財務）という因果を戦略マップで示します。",
    "related": [],
    "criteria": [
      {
        "id": "four",
        "title": "財務・顧客・内部ビジネスプロセス・学習と成長の4視点で戦略と業績を捉える",
        "hint": "どのような視点から、戦略や業績を評価しますか？"
      },
      {
        "id": "kpi",
        "title": "視点ごとに目標と評価指標を設定する",
        "hint": "視点ごとに何を決めますか？",
        "level": "deep"
      },
      {
        "id": "map",
        "title": "戦略マップは4つの視点の目標の因果関係を図示する",
        "hint": "戦略マップとは？",
        "level": "deep"
      },
      {
        "id": "balance",
        "title": "財務指標だけに偏らない管理をする",
        "hint": "なぜ「バランス」なのですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ansoff",
    "name": "アンゾフの成長マトリクス",
    "aliases": [
      "市場浸透戦略",
      "新製品開発戦略",
      "新市場開拓戦略",
      "多角化戦略"
    ],
    "reading": "Ansoff matrix",
    "category": "経営戦略",
    "definition": "製品（既存・新規）と市場（既存・新規）の組合せで、企業の成長戦略を4つに分類したものです。既存製品×既存市場は市場浸透戦略、新製品×既存市場は新製品開発戦略、既存製品×新市場は新市場開拓戦略、新製品×新市場は多角化戦略です。",
    "example": "既存の顧客に既存の商品をもっと買ってもらうための値引きキャンペーンは市場浸透戦略です。",
    "related": [
      "ppm"
    ],
    "criteria": [
      {
        "id": "axes",
        "title": "製品と市場をそれぞれ既存・新規に分けた4分類",
        "hint": "どの2軸で分けますか？"
      },
      {
        "id": "penetration",
        "title": "既存製品×既存市場は市場浸透戦略",
        "hint": "既存の顧客に既存の商品を売るのは？",
        "level": "deep"
      },
      {
        "id": "others",
        "title": "新製品開発・新市場開拓・多角化の各戦略",
        "hint": "残りの3つの戦略は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "mes",
    "name": "MES",
    "aliases": [
      "生産計画",
      "工程管理",
      "製造管理",
      "計画層",
      "実行層",
      "制御層"
    ],
    "reading": "Manufacturing Execution System",
    "category": "技術戦略",
    "definition": "工場の生産現場で、生産計画に基づく作業指示、工程管理、品質や実績の収集などを行う製造実行システムです。企業全体の計画を立てるERPなどの計画層と、機械を直接動かすPLCなどの制御層の間の実行層に位置します。",
    "example": "ERPの生産計画をもとに、MESが今日の作業指示をラインに出し、実績を集めてERPに返します。",
    "related": [
      "plc",
      "erp"
    ],
    "criteria": [
      {
        "id": "execute",
        "title": "生産現場の作業指示・工程管理・実績収集を行う",
        "hint": "MESの役割は？"
      },
      {
        "id": "layer",
        "title": "計画層（ERP）と制御層（PLC）の間の実行層に位置する",
        "hint": "どの層に位置しますか？",
        "level": "deep"
      },
      {
        "id": "flow",
        "title": "計画層の生産計画を作業指示に落とし、実績を計画層に返す",
        "hint": "上下の層とどう連携しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "dx-certification",
    "name": "DX認定制度",
    "aliases": [
      "DX戦略",
      "デジタルガバナンス・コード",
      "経営ビジョン"
    ],
    "reading": "Digital transformation certification",
    "category": "システム戦略",
    "definition": "経済産業省が、デジタルガバナンス・コードに沿って、DXに取り組む準備ができている（DX-Ready）事業者を認定する制度です。経営ビジョンやDX戦略の策定・公表、推進体制、成果指標、経営者のメッセージ、課題の把握などが基準になっています。",
    "example": "経営ビジョンとDX戦略を取締役会で承認して公表し、認定を申請します。",
    "related": [
      "dx-index"
    ],
    "criteria": [
      {
        "id": "ready",
        "title": "DXの準備ができている事業者を国が認定する",
        "hint": "何を認定する制度ですか？"
      },
      {
        "id": "code",
        "title": "デジタルガバナンス・コードに沿った基準で審査する",
        "hint": "基準は何に基づきますか？",
        "level": "deep"
      },
      {
        "id": "criteria",
        "title": "経営ビジョン・DX戦略の策定と公表、推進体制、成果指標などが求められる",
        "hint": "主な認定基準は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "dx-index",
    "name": "DX推進指標",
    "aliases": [
      "スピード・アジリティ",
      "全社最適",
      "個別最適"
    ],
    "reading": "Digital transformation promotion index",
    "category": "システム戦略",
    "definition": "経済産業省が示した、企業がDXの取組み状況を自己診断するための指標です。経営のあり方・仕組みと、ITシステムの構築の2つの枠組みで構成されます。ITシステムには、データを活用できること、変化に迅速に対応できること（スピード・アジリティ）、部門ごとの個別最適ではなく全社最適であることなどが求められます。",
    "example": "各部門が別々に作ったシステムを、全社でデータを共有できる構成に見直します。",
    "related": [
      "dx-certification"
    ],
    "criteria": [
      {
        "id": "self",
        "title": "企業がDXの取組み状況を自己診断する指標",
        "hint": "何のための指標ですか？"
      },
      {
        "id": "two",
        "title": "経営の仕組みとITシステムの構築の2つで構成する",
        "hint": "どんな枠組みですか？",
        "level": "deep"
      },
      {
        "id": "it",
        "title": "ITシステムにはデータ活用、スピード・アジリティ、全社最適が求められる",
        "hint": "ITシステムに求められる要素は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "environment-analysis",
    "name": "環境分析のフレームワーク",
    "reading": "Strategic analysis frameworks",
    "category": "経営戦略",
    "definition": "組織の内外の状況を整理し、経営戦略の立案に役立てる分析の枠組みの総称です。自社の資源、顧客や競合、社会環境など、分析する対象に応じて枠組みを選びます。",
    "example": "新事業を検討する際に、社会環境の変化と、自社の資源や顧客の状況を整理します。",
    "related": [
      "five-forces",
      "ppm",
      "swot",
      "three-c",
      "pest",
      "vrio",
      "value-chain"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "組織の内外の状況を整理し、戦略の立案に役立てる分析の枠組み",
        "hint": "どのような状況を整理し、何の判断に使いますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "smart-factory",
    "name": "スマートファクトリー",
    "aliases": [
      "マシンビジョン",
      "目視検査",
      "需要予測"
    ],
    "reading": "Smart factory",
    "category": "技術戦略",
    "definition": "工場の機器や設備をIoTでつなぎ、収集したデータをAIなどで分析して、生産の効率化や品質の向上を図る工場です。カメラ画像で製品の外観を自動検査するマシンビジョンや、AIによる需要予測に基づく生産計画などが例です。",
    "example": "人が行っていた目視検査を、カメラとAIのマシンビジョンに置き換えて、不良品を自動で判定します。",
    "related": [
      "iot",
      "mes"
    ],
    "criteria": [
      {
        "id": "data",
        "title": "設備をIoTでつなぎ、データを分析して生産を最適化する",
        "hint": "スマートファクトリーとは？"
      },
      {
        "id": "forecast",
        "title": "需要予測に基づいて生産計画を最適化する",
        "hint": "データを生産計画にどう生かしますか？",
        "level": "deep"
      },
      {
        "id": "ot",
        "title": "工場の制御システム（OT）がネットワークにつながり、サイバー攻撃の対象になる",
        "hint": "セキュリティ上の課題は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "open-innovation",
    "name": "オープンイノベーション",
    "aliases": [
      "クローズドイノベーション",
      "自前主義"
    ],
    "reading": "Open innovation",
    "category": "技術戦略",
    "definition": "自社の中だけで研究開発を完結させる（クローズドイノベーション、自前主義）のではなく、大学や他社など外部の技術やアイデアを積極的に取り入れ、また自社の技術を外部に提供して、新しい価値を生み出す考え方です。",
    "example": "自社の研究所だけでなく、スタートアップと共同で新製品を開発します。",
    "related": [
      "co-creation"
    ],
    "criteria": [
      {
        "id": "external",
        "title": "外部の技術やアイデアを取り入れて革新を起こす",
        "hint": "オープンイノベーションとは？"
      },
      {
        "id": "outbound",
        "title": "自社の技術を外部に提供（ライセンスなど）することも含む",
        "hint": "外に出す方向もありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "co-creation",
    "name": "コ・クリエーション",
    "reading": "Co-creation",
    "category": "経営戦略",
    "definition": "企業が顧客や取引先などと協働して、新しい製品・サービスや価値を共に創り出す戦略です。自社だけで作り込む自前主義や、他社を買収して取り込むM&Aとは異なります。",
    "example": "利用者の投稿したアイデアを製品化し、開発段階から利用者と意見を交わします。",
    "related": [
      "open-innovation",
      "mergers-acquisitions"
    ],
    "criteria": [
      {
        "id": "together",
        "title": "顧客や取引先と協働して価値を共に創る",
        "hint": "コ・クリエーションとは？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "darwin-sea",
    "name": "ダーウィンの海",
    "aliases": [
      "死の谷",
      "魔の川"
    ],
    "reading": "Darwinian sea",
    "category": "技術戦略",
    "definition": "製品化・事業化した技術が、市場で他の製品との競争に勝ち残り、事業として定着するまでに直面する障壁を指します。",
    "example": "製品を発売したが、競合製品との価格競争に勝てず撤退するのは、ダーウィンの海を越えられなかった例です。",
    "related": [
      "chasm"
    ],
    "criteria": [
      {
        "id": "darwin",
        "title": "ダーウィンの海は市場での競争に勝ち残る障壁",
        "hint": "ダーウィンの海とは？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "chasm",
    "name": "キャズム",
    "reading": "Chasm",
    "category": "経営戦略",
    "definition": "新しい製品が普及していく過程で、新しいもの好きの初期採用者（アーリーアダプター）から、実利を重視する前期多数派（アーリーマジョリティ）へ広がる間にある深い溝のことです。この溝を越えられないと、製品は主流の市場に普及しません。",
    "example": "一部の愛好家には売れたが、一般の会社員には広まらず販売が伸び悩むのは、キャズムを越えられない状態です。",
    "related": [
      "darwin-sea"
    ],
    "criteria": [
      {
        "id": "gap",
        "title": "初期採用者と前期多数派の間の溝",
        "hint": "キャズムとはどこにある溝ですか？"
      },
      {
        "id": "mainstream",
        "title": "越えないと主流の市場に普及しない",
        "hint": "越えられないとどうなりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "mrp",
    "name": "MRP（資材所要量計画）",
    "aliases": [
      "構成表",
      "正味所要量",
      "総所要量",
      "在庫"
    ],
    "reading": "Material Requirements Planning",
    "category": "経営管理",
    "definition": "生産計画と部品の構成表から、必要な部品や資材の量と時期を計算する手法です。製品に必要な総所要量から、手持ちの在庫や発注済みの量を差し引いて正味所要量を求めます。",
    "example": "製品Aを10個作るのに部品Bが2個ずつ必要なら総所要量は20個、在庫が5個あれば正味所要量は15個です。",
    "related": [],
    "criteria": [
      {
        "id": "bom",
        "title": "生産計画と構成表から必要な部品の量と時期を計算する",
        "hint": "何から計算しますか？"
      },
      {
        "id": "net",
        "title": "正味所要量＝総所要量－引当可能在庫（－発注残）",
        "hint": "正味所要量の求め方は？",
        "level": "deep"
      },
      {
        "id": "level",
        "title": "構成表を上位から順に展開し、下位部品の所要量を求める",
        "hint": "多段階の部品はどう計算しますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "corporate-philosophy",
    "name": "経営理念",
    "aliases": [
      "経営戦略",
      "事業戦略"
    ],
    "reading": "Corporate philosophy",
    "category": "経営戦略",
    "definition": "企業が存在する目的や大切にする価値観を示したものです。経営理念に基づいて全社の方向性を示す経営戦略を立て、それを事業ごとに具体化したものが事業戦略です。",
    "example": "「食で人々を健康にする」という経営理念のもとで、健康食品事業を伸ばす経営戦略を立て、事業部が販売チャネルの戦略を決めます。",
    "related": [],
    "criteria": [
      {
        "id": "purpose",
        "title": "企業の存在目的や価値観を示す",
        "hint": "経営理念とは？"
      },
      {
        "id": "hierarchy",
        "title": "経営理念を基に経営戦略や事業の判断の方向を定める",
        "hint": "企業の戦略や日々の判断に対して、どのような役割がありますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ems",
    "name": "EMS",
    "aliases": [
      "相手先ブランド"
    ],
    "reading": "Electronics Manufacturing Service",
    "category": "経営戦略",
    "definition": "他社ブランドの電子機器の製造を請け負うサービス、またはその事業者です。設計から製造までを受託することもあります。委託側は工場を持たずに製品を提供できます。相手先ブランドで製品を製造するのはOEMと呼ばれます。",
    "example": "スマートフォンメーカーが、組立てをEMS事業者に委託します。",
    "related": [
      "fabless"
    ],
    "criteria": [
      {
        "id": "contract",
        "title": "他社の電子機器の製造を受託する",
        "hint": "EMSとは？"
      },
      {
        "id": "brand",
        "title": "製品は委託元（相手先）のブランドで販売される",
        "hint": "どのブランドで売られますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "fabless",
    "name": "ファブレス",
    "reading": "Fabless",
    "category": "経営戦略",
    "definition": "自社の製造工場を持たず、製品の企画や設計を行い、製造を外部に委託する企業の形態です。",
    "example": "半導体の設計を自社で行い、製造を外部企業に委託します。",
    "related": [
      "foundry",
      "ems"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "自社工場を持たず、企画・設計を行って製造を外部委託する",
        "hint": "工場を持ちますか、製造をどう行いますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "foundry",
    "name": "ファウンドリー",
    "reading": "Foundry",
    "category": "経営戦略",
    "definition": "他社から委託を受けて、半導体などの製造を専門に行う企業です。",
    "example": "顧客が設計した半導体を、製造設備を使って受託生産します。",
    "related": [
      "fabless",
      "ems"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "他社から委託を受けて半導体などの製造を行う企業",
        "hint": "他社から何を受託する企業ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "franchise",
    "name": "フランチャイズ",
    "reading": "Franchise",
    "category": "経営戦略",
    "definition": "本部（フランチャイザー）が加盟店（フランチャイジー）に、商標やノウハウを使って営業する権利を与え、その対価としてロイヤルティを受け取る事業形態です。",
    "example": "コンビニエンスストアの多くは、本部のブランドと仕組みを使って加盟店のオーナーが経営しています。",
    "related": [],
    "criteria": [
      {
        "id": "right",
        "title": "本部が加盟店に商標やノウハウを使う権利を与える",
        "hint": "フランチャイズとは？"
      },
      {
        "id": "royalty",
        "title": "加盟店は対価としてロイヤルティを支払う",
        "hint": "加盟店が支払うものは？"
      },
      {
        "id": "benefit",
        "title": "本部は少ない資本で店舗網を広げられる",
        "hint": "本部にとっての利点は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "segmentation",
    "name": "市場セグメンテーション",
    "aliases": [
      "人口統計的変数",
      "地理的変数",
      "心理的変数",
      "行動的変数",
      "セグメント",
      "ポジショニングマップ"
    ],
    "reading": "Market segmentation",
    "category": "経営戦略",
    "definition": "市場を、共通の特徴を持つ顧客の集まり（セグメント）に分けることです。分ける基準には、年齢・性別・所得などの人口統計的変数、地域などの地理的変数、価値観やライフスタイルなどの心理的変数、購買頻度などの行動的変数があります。",
    "example": "「30代の共働き世帯」で区切るのは人口統計的変数、「健康志向の人」で区切るのは心理的変数です。",
    "related": [],
    "criteria": [
      {
        "id": "divide",
        "title": "市場を共通の特徴を持つ顧客群（セグメント）に分ける",
        "hint": "セグメンテーションとは？"
      },
      {
        "id": "variables",
        "title": "人口統計的・地理的・心理的・行動的変数で分ける",
        "hint": "分ける基準は？",
        "level": "deep"
      },
      {
        "id": "stp",
        "title": "セグメンテーション→ターゲティング→ポジショニングの順に進める（STP）",
        "hint": "その後に行うことは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "qc-tools",
    "name": "QC七つ道具",
    "reading": "Seven quality control tools",
    "category": "経営管理",
    "definition": "品質に関するデータや原因を、図表などで整理して改善に役立てる七つの基本的な道具の総称です。不良の多さや分布、原因の関係などを調べるために使います。",
    "example": "品質データを図表に整理し、件数の多い問題や、原因として調べるべき項目を見つけます。",
    "related": [
      "pareto-chart",
      "cause-effect-diagram",
      "matrix-diagram",
      "relations-diagram"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "品質に関するデータや原因を図表などで整理し、改善に使う七つの基本的な道具の総称",
        "hint": "どのような情報を、何のために整理する道具ですか？"
      },
      {
        "id": "selection",
        "title": "不良の多さ・分布・原因の関係など、調べたい内容に応じて道具を選ぶ",
        "hint": "優先する問題や原因を調べるため、道具をどう使い分けますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "backcasting",
    "name": "バックキャスティング",
    "reading": "Backcasting",
    "category": "経営戦略",
    "definition": "目指す将来の姿を先に描き、そこから現在に向かってさかのぼって、今何をすべきかを考える方法です。現在の延長線上で将来を予測して計画するのはフォアキャスティングです。",
    "example": "「2050年に温室効果ガス排出ゼロ」から逆算して、2030年までに必要な対策を決めます。",
    "related": [
      "forecasting"
    ],
    "criteria": [
      {
        "id": "future",
        "title": "望ましい将来像から逆算して今の行動を決める",
        "hint": "バックキャスティングとは？"
      },
      {
        "id": "use",
        "title": "現状の延長では届かない大きな目標に向く",
        "hint": "どんなときに向きますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "feasibility-study",
    "name": "フィージビリティスタディ",
    "reading": "Feasibility study",
    "category": "技術戦略",
    "definition": "新しい事業や計画について、技術・経済性・運用などの面から実現可能性を調べることです。本格的に投資する前に、実行するかどうかを判断する材料にします。",
    "example": "新システムの導入前に、技術的に実現できるか、費用に見合う効果があるかを調査します。",
    "related": [],
    "criteria": [
      {
        "id": "feasible",
        "title": "計画の実現可能性を多面的に調べる",
        "hint": "フィージビリティスタディとは？"
      },
      {
        "id": "decide",
        "title": "本格的な投資の前に実行の可否を判断する",
        "hint": "何に使いますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "delphi",
    "name": "デルファイ法",
    "reading": "Delphi method",
    "category": "技術戦略",
    "definition": "複数の専門家に匿名でアンケートを行い、その結果を示して再びアンケートを行うことを繰り返し、意見を収束させて将来を予測する方法です。ブレーンストーミングのように集まって自由に発言し、批判せずに多くのアイデアを出す方法とは異なります。",
    "example": "10年後の技術動向について専門家に3回アンケートを繰り返し、予測をまとめます。",
    "related": [
      "brainstorming"
    ],
    "criteria": [
      {
        "id": "repeat",
        "title": "専門家への匿名アンケートを繰り返して意見を収束させる",
        "hint": "デルファイ法の手順は？"
      },
      {
        "id": "forecast",
        "title": "主に将来予測に使う",
        "hint": "何に使いますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "product-lifecycle",
    "name": "プロダクトライフサイクル",
    "reading": "Product life cycle",
    "category": "経営戦略",
    "definition": "製品が市場に出てから消えるまでを、導入期・成長期・成熟期・衰退期の4段階で表したものです。段階ごとに売上や利益、競合の状況が変わるため、とるべき戦略も変わります。",
    "example": "成熟期には売上の伸びが止まり競合が増えるため、差別化や新しい用途の開拓を図ります。",
    "related": [
      "ppm"
    ],
    "criteria": [
      {
        "id": "stages",
        "title": "導入期・成長期・成熟期・衰退期の4段階",
        "hint": "4つの段階は？"
      },
      {
        "id": "strategy",
        "title": "段階ごとに適した戦略が異なる",
        "hint": "段階によって何が変わりますか？",
        "level": "deep"
      },
      {
        "id": "mature",
        "title": "成熟期は売上の伸びが鈍化し競争が激しくなる",
        "hint": "成熟期の特徴は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "benchmarking",
    "name": "ベンチマーキング",
    "reading": "Benchmarking",
    "category": "経営戦略",
    "definition": "業界内外の優れた企業のやり方（ベストプラクティス）と自社を比べて、差を分析し、業務の改善目標を立てる手法です。",
    "example": "物流で定評のある他業界の企業の出荷手順と比べ、自社の出荷時間を半分にする目標を立てます。",
    "related": [],
    "criteria": [
      {
        "id": "compare",
        "title": "優れた企業のベストプラクティスと自社を比較する",
        "hint": "ベンチマーキングとは？"
      },
      {
        "id": "improve",
        "title": "差を分析して改善目標を立てる",
        "hint": "比較の後に何をしますか？",
        "level": "deep"
      },
      {
        "id": "other",
        "title": "同業他社だけでなく他業界も比較対象になる",
        "hint": "比べる相手は同業者だけですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "aggregation-service",
    "name": "アグリゲーションサービス",
    "reading": "Aggregation service",
    "category": "経営戦略",
    "definition": "複数の企業やサービスが提供する情報や商品を集約し、1つの窓口でまとめて利用できるようにするサービスです。",
    "example": "複数の銀行やクレジットカードの明細を1つのアプリでまとめて見られる家計簿サービスです。",
    "related": [
      "omni-channel"
    ],
    "criteria": [
      {
        "id": "collect",
        "title": "複数のサービスの情報を集約して1つの窓口で提供する",
        "hint": "アグリゲーションサービスとは？"
      },
      {
        "id": "example",
        "title": "複数の口座をまとめて見られる家計簿アプリなど",
        "hint": "具体例は？",
        "level": "deep"
      },
      {
        "id": "api",
        "title": "金融ではAPI連携で口座情報を取得する",
        "hint": "情報はどうやって集めますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "omni-channel",
    "name": "オムニチャネル",
    "reading": "Omni-channel",
    "category": "経営戦略",
    "definition": "実店舗、通販サイト、アプリなどすべての販売チャネルを統合し、顧客がどのチャネルでも同じように買い物できるようにする戦略です。",
    "example": "アプリで注文した商品を近くの店舗で受け取り、ポイントも共通で貯まります。",
    "related": [],
    "criteria": [
      {
        "id": "integrate",
        "title": "実店舗とネットなどすべての販売チャネルを統合する",
        "hint": "オムニチャネルとは？"
      },
      {
        "id": "seamless",
        "title": "顧客はどのチャネルでも同じように購入・受取りができる",
        "hint": "顧客にとっての利点は？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "escrow",
    "name": "エスクローサービス",
    "reading": "Escrow service",
    "category": "経営戦略",
    "definition": "商取引で、第三者が買い手からの代金をいったん預かり、商品が届いたことを確認してから売り手に支払う仲介サービスです。ネットオークションなど、互いに信頼関係のない取引の安全性を高めます。",
    "example": "フリマアプリで、購入者が「受取り完了」を押すまで、運営会社が代金を預かります。",
    "related": [],
    "criteria": [
      {
        "id": "hold",
        "title": "第三者が代金を預かり、取引の完了を確認してから支払う",
        "hint": "エスクローサービスとは？"
      },
      {
        "id": "trust",
        "title": "信頼関係のない取引の安全性を高める",
        "hint": "何のためのサービスですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cost-accounting",
    "name": "原価計算基準",
    "aliases": [
      "製造原価",
      "経費",
      "支払利息"
    ],
    "reading": "Cost accounting standards",
    "category": "経営管理",
    "definition": "原価を計算・集計・配分する際の基本的な考え方を示す基準です。費用の性質や製品との関係などに応じて分類し、原価を把握します。",
    "example": "工場の電気代や機械の減価償却費は製造原価の経費ですが、借入金の支払利息は含めません。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "原価の計算・集計や配分の方法についての基本的な考え方を示す基準",
        "hint": "どのような費用の計算を、何に従って行うための基準ですか？"
      },
      {
        "id": "three",
        "title": "製造原価は材料費・労務費・経費からなる",
        "hint": "製造原価の構成は？",
        "level": "deep"
      },
      {
        "id": "exclude",
        "title": "支払利息などの財務費用は製造原価に入れない",
        "hint": "製造原価に含めない費用は？",
        "level": "deep"
      },
      {
        "id": "direct",
        "title": "製品に直接結び付くかで直接費と間接費に分ける",
        "hint": "直接費と間接費の違いは？",
        "level": "deep"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "dummy-activity",
    "name": "ダミー作業",
    "reading": "Dummy activity",
    "category": "プロジェクト管理",
    "definition": "アローダイアグラムで、作業間の順序関係だけを表すための所要時間0の作業です。",
    "example": "実際の作業は発生しないが、先行関係を表すために点線の矢印を置きます。",
    "related": [
      "critical-path"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "所要時間0で、作業の順序関係だけを表す",
        "hint": "実際に時間のかかる作業ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "duration",
    "name": "所要日数",
    "reading": "Duration",
    "category": "プロジェクト管理",
    "definition": "作業や処理が開始してから完了するまでに必要な日数です。人数と日数を掛けた作業量とは区別します。",
    "example": "3人で作業しても完了まで5日かかるなら、所要日数は5日です。",
    "related": [
      "critical-path"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "作業の開始から完了までに必要な日数",
        "hint": "人数を掛けた作業量ではなく、どの期間ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "drdos",
    "name": "DRDoS攻撃",
    "reading": "Distributed Reflection Denial of Service",
    "category": "攻撃手法",
    "definition": "送信元IPアドレスを標的のものに偽装し、多数の第三者サーバからの応答を標的へ集中させてサービスを妨害する攻撃です。",
    "example": "標的を送信元にしたDNS問合せを多数のサーバへ送り、その応答で標的の回線を圧迫します。",
    "related": [
      "ddos",
      "dns"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "送信元を標的に偽装し第三者サーバの応答を集中させる",
        "hint": "誰に要求を送り、誰に応答を集めますか？"
      }
    ],
    "commonMistakes": [
      "単に多数の端末から直接攻撃するだけでなく、第三者の応答を反射させる点が特徴です。"
    ]
  },
  {
    "id": "zero-day-attack",
    "name": "ゼロデイ攻撃",
    "reading": "Zero-day attack",
    "category": "攻撃手法",
    "definition": "脆弱性への修正プログラムなどの対策が提供される前に、その脆弱性を悪用する攻撃です。",
    "example": "製品の未知の脆弱性を、修正プログラムの公開前に悪用して侵入します。",
    "related": [
      "vulnerability"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "対策が提供される前の脆弱性を悪用する",
        "hint": "修正プログラムが提供される時期と攻撃の時期の関係は？"
      }
    ],
    "commonMistakes": [
      "パッチが提供済みなのに未適用の状態を狙う攻撃とは区別します。"
    ]
  },
  {
    "id": "saml",
    "name": "SAML",
    "reading": "Security Assertion Markup Language",
    "category": "暗号・認証",
    "definition": "認証結果や属性などの情報をXML形式のアサーションで連携する仕様です。シングルサインオンでは、IdPが認証し、SPがアサーションを検証してサービスへのアクセスを認めます。",
    "example": "社内のIdPでログインした結果を外部の業務サービスへ伝え、再度パスワードを入力せずに利用します。",
    "related": [
      "single-sign-on"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "IdPの認証結果をアサーションでSPへ連携する",
        "hint": "認証を行う側とサービスを提供する側は何を受け渡しますか？"
      },
      {
        "id": "verification",
        "title": "SPが受け取ったアサーションを検証する",
        "hint": "サービス側は受け取った認証情報をどう扱いますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "Kerberosのチケットや、各サービスへのパスワードの配布による連携ではありません。"
    ]
  },
  {
    "id": "single-sign-on",
    "name": "シングルサインオン",
    "aliases": [
      "SSO"
    ],
    "reading": "Single sign-on",
    "category": "暗号・認証",
    "definition": "一度の認証によって、複数のシステムやサービスを再認証なしで利用できるようにする仕組みです。",
    "example": "社内ポータルへのログイン後、経費精算と勤怠管理の画面も追加のログインなしで開きます。",
    "related": [
      "saml",
      "kerberos"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "一度の認証で複数のサービスを利用できる",
        "hint": "何回の認証で、いくつのサービスを利用しますか？"
      }
    ],
    "commonMistakes": [
      "全サービスで同じパスワードを使い回すだけでは、シングルサインオンにはなりません。"
    ]
  },
  {
    "id": "kerberos",
    "name": "Kerberos",
    "reading": "Kerberos",
    "category": "暗号・認証",
    "definition": "信頼する鍵配布センターが発行するチケットを使い、ネットワーク上のサービスへの認証を行う仕組みです。共通鍵暗号を用います。",
    "example": "利用者は認証基盤からサービス用のチケットを取得し、ファイルサーバへ提示して認証を受けます。",
    "related": [
      "single-sign-on"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "信頼する認証基盤が発行するチケットでサービスを利用する",
        "hint": "パスワードを各サーバへ送る代わりに、何を使いますか？"
      }
    ],
    "commonMistakes": [
      "SAMLのXMLアサーションを使う認証方式とは異なります。"
    ]
  },
  {
    "id": "sha-512-256",
    "name": "SHA-512/256",
    "reading": "Secure Hash Algorithm 512/256",
    "category": "暗号・認証",
    "definition": "SHA-512に基づくハッシュ計算を行い、最終的な512ビットの値を256ビットに切り詰める方式です。通常のSHA-512とは異なる初期値を使います。",
    "example": "ファイルから256ビットのダイジェストを計算します。同じ入力でも、通常のSHA-512を半分に切った値やSHA-256の値とは異なります。",
    "related": [
      "sha-512",
      "sha-256",
      "hash"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "SHA-512に基づく計算結果を256ビットに切り詰める",
        "hint": "どのハッシュ関数に基づき、何ビットを出力しますか？"
      },
      {
        "id": "initial-value",
        "title": "通常のSHA-512とは異なる初期値を使う",
        "hint": "通常のSHA-512の出力を切るだけで同じ値になりますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "512回や256回の繰返しを意味しません。また通常のSHA-512の出力を切るだけではありません。"
    ]
  },
  {
    "id": "sha-512",
    "name": "SHA-512",
    "reading": "Secure Hash Algorithm 512",
    "category": "暗号・認証",
    "definition": "SHA-2系列の暗号学的ハッシュ関数で、任意長の入力から512ビットのハッシュ値を計算します。",
    "example": "配布ファイルのSHA-512値を計算して、公表された512ビットの値と一致するか確認します。",
    "related": [
      "hash",
      "sha-512-256"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "SHA-2系列で512ビットのハッシュ値を出力する",
        "hint": "何ビットの値を計算するハッシュ関数ですか？"
      }
    ],
    "commonMistakes": [
      "512は繰返し回数ではなく、出力のビット数です。"
    ]
  },
  {
    "id": "sha-256",
    "name": "SHA-256",
    "reading": "Secure Hash Algorithm 256",
    "category": "暗号・認証",
    "definition": "SHA-2系列の暗号学的ハッシュ関数で、任意長の入力から256ビットのハッシュ値を計算します。",
    "example": "ダウンロードしたファイルのSHA-256値を計算して、配布元が示す値と比較します。",
    "related": [
      "hash",
      "sha-512-256"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "SHA-2系列で256ビットのハッシュ値を出力する",
        "hint": "入力の長さに対して出力は何ビットですか？"
      }
    ],
    "commonMistakes": [
      "同じ256ビットの出力でも、SHA-512/256とは異なる方式です。"
    ]
  },
  {
    "id": "kaminsky-attack",
    "name": "カミンスキー攻撃",
    "reading": "Kaminsky attack",
    "category": "攻撃手法",
    "definition": "未キャッシュの名前へのDNS問合せを次々に発生させ、偽応答を送り込んでキャッシュに偽の情報を登録させる攻撃手法です。送信元ポート番号のランダム化が対策の一つです。",
    "example": "毎回異なるサブドメインを問い合わせさせ、正規の応答が来る前に偽の委任情報を注入しようとします。",
    "related": [
      "dns-cache-poisoning",
      "dns"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "未キャッシュ名への問合せと偽応答でDNSキャッシュを汚染する",
        "hint": "繰返し問合せを発生させ、何に偽情報を残しますか？"
      }
    ],
    "commonMistakes": [
      "DNSサーバの冗長化やSQLのプレースホルダだけでは防げません。"
    ]
  },
  {
    "id": "cryptojacking",
    "name": "クリプトジャッキング",
    "reading": "Cryptojacking",
    "category": "攻撃手法",
    "definition": "他人の端末やサーバの計算資源を無断で使い、暗号資産のマイニングを行う攻撃です。",
    "example": "侵入したクラウドサーバで採掘プログラムを動かし、攻撃者が報酬を得る一方で所有者の電気代や利用料金が増えます。",
    "related": [
      "crypto-mining",
      "malware"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "他人の計算資源を無断で暗号資産のマイニングに使う",
        "hint": "何を盗用し、どのように利益を得ますか？"
      }
    ],
    "commonMistakes": [
      "暗号資産を口座から盗む行為や、暗号資産で身代金を要求する行為とは異なります。"
    ]
  },
  {
    "id": "crypto-mining",
    "name": "マイニング",
    "reading": "Cryptocurrency mining",
    "category": "セキュリティ運用",
    "definition": "PoW方式の暗号資産などで、大量の計算を行って条件を満たす値を探し、ブロックを確定して報酬を得る仕組みです。",
    "example": "採掘者がナンスを変えながらハッシュ値を計算し、条件を満たすブロックを見つけます。",
    "related": [
      "cryptojacking",
      "hash"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "計算によってブロックを確定し報酬を得る",
        "hint": "どのような作業を行い、何を得る仕組みですか？"
      }
    ],
    "commonMistakes": [
      "マイニング自体が攻撃ではなく、他人の資源を無断利用するとクリプトジャッキングになります。"
    ]
  },
  {
    "id": "certificate-authority",
    "name": "認証局",
    "aliases": [
      "CA"
    ],
    "reading": "Certification Authority",
    "category": "暗号・認証",
    "definition": "主体と公開鍵の対応を証明するデジタル証明書を、自身の秘密鍵で署名して発行する機関です。証明書の失効なども管理します。",
    "example": "Webサイトの公開鍵を含む証明書を発行し、ブラウザは認証局の公開鍵でその署名を検証します。",
    "related": [
      "pki",
      "digital-certificate",
      "crl"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "自身の秘密鍵で署名してデジタル証明書を発行する",
        "hint": "誰のどちらの鍵で証明書に署名しますか？"
      }
    ],
    "commonMistakes": [
      "申請者の秘密鍵に署名するわけでも、認証局の公開鍵で署名を作るわけでもありません。"
    ]
  },
  {
    "id": "x509",
    "name": "X.509",
    "reading": "Information technology — Open Systems Interconnection — The Directory: Public-key and attribute certificate frameworks",
    "category": "暗号・認証",
    "definition": "公開鍵証明書などの形式を定める規格です。証明書には主体、公開鍵、発行者、有効期間、発行者の署名などが含まれます。",
    "example": "TLSで使うサーバー証明書は、X.509の形式で公開鍵や有効期間を表します。",
    "related": [
      "digital-certificate",
      "tls"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "主体や公開鍵、発行者の署名を含む公開鍵証明書の形式を定める",
        "hint": "どのような情報の形式を規定していますか？"
      }
    ],
    "commonMistakes": [
      "電子メールシステムのX.400と混同しないようにします。"
    ]
  },
  {
    "id": "mirai",
    "name": "Mirai",
    "reading": "Mirai",
    "category": "攻撃手法",
    "definition": "IoT機器などへ感染してボットネットを構成し、C&Cサーバの指令に従ってDDoS攻撃を行うマルウェアです。代表的な感染ではTelnetで弱い認証情報を試します。",
    "example": "初期パスワードのまま公開されたIoTカメラを侵害し、他の機器と一斉に標的へ通信させます。",
    "related": [
      "iot",
      "botnet",
      "command-control-server",
      "ddos"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "IoT機器を感染させC&CサーバからDDoS攻撃を指示する",
        "hint": "どの機器を感染させ、何に悪用しますか？"
      }
    ],
    "commonMistakes": [
      "Webページの改ざんやファイル共有ソフトからの情報流出を主な動作とする説明とは異なります。"
    ]
  },
  {
    "id": "connect-back",
    "name": "コネクトバック",
    "reading": "Connect back",
    "category": "攻撃手法",
    "definition": "侵害されたシステム側から攻撃者のサーバ側へ通信を開始する動作です。外向きの通信が許可されている環境で、攻撃者との通信経路の確立に悪用されます。",
    "example": "感染端末が外部サーバへ接続し、その接続を通じて攻撃者から指令を受け取ります。",
    "related": [
      "backdoor",
      "command-control-server"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "侵害されたシステムから攻撃者のサーバへ接続を開始する",
        "hint": "通信を開始する側は攻撃者側ですか、侵害された側ですか？"
      }
    ],
    "commonMistakes": [
      "バックドアの埋込みや、身代金要求そのものを指す用語ではありません。"
    ]
  },
  {
    "id": "trojan-horse",
    "name": "トロイの木馬",
    "reading": "Trojan horse",
    "category": "攻撃手法",
    "definition": "正常で有益なプログラムに見せかけ、実行されると利用者の意図しない不正な処理を行うプログラムです。",
    "example": "便利なツールを装ってインストールさせ、裏で入力情報を盗みます。",
    "related": [
      "malware",
      "backdoor"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "有益なプログラムを装い不正な処理を実行する",
        "hint": "どのように利用者を実行へ誘導しますか？"
      }
    ],
    "commonMistakes": [
      "自己増殖することは必須の性質ではありません。"
    ]
  },
  {
    "id": "backdoor",
    "name": "バックドア",
    "reading": "Backdoor",
    "category": "攻撃手法",
    "definition": "通常の認証やアクセス制御を迂回してシステムへ入るための隠された経路や機能です。",
    "example": "侵入した攻撃者が再侵入用の不正なアカウントや待受けプログラムを残します。",
    "related": [
      "malware",
      "connect-back"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "通常の認証などを迂回する隠れた侵入口",
        "hint": "正規の入口に対して、どのような経路を残しますか？"
      }
    ],
    "commonMistakes": [
      "通信を侵害先から開始する動作はコネクトバックであり、バックドアという機能と同義ではありません。"
    ]
  },
  {
    "id": "cps",
    "name": "CPS",
    "aliases": [
      "認証局運用規程"
    ],
    "reading": "Certification Practice Statement",
    "category": "暗号・認証",
    "definition": "認証局が証明書の発行、管理、失効、鍵管理などを実際にどのように行うかを記述する認証局運用規程です。",
    "example": "申請者の本人確認方法や、失効依頼を受け付けて反映するまでの手順を公開します。",
    "related": [
      "certificate-authority",
      "certificate-policy"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "認証局の認証業務の具体的な実施方法を定める",
        "hint": "誰の業務の、どのような内容を記述しますか？"
      }
    ],
    "commonMistakes": [
      "証明書所有者や監査機関のセキュリティ宣言ではありません。"
    ]
  },
  {
    "id": "certificate-policy",
    "name": "証明書ポリシー",
    "aliases": [
      "CP"
    ],
    "reading": "Certificate Policy",
    "category": "暗号・認証",
    "definition": "ある種類の証明書の適用範囲や、認証局などが満たすべき要求事項を定める規則です。",
    "example": "決済用証明書に必要な本人確認の水準や利用目的を定めます。",
    "related": [
      "cps",
      "pki"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "証明書の適用範囲と満たすべき要求事項を定める",
        "hint": "どの証明書をどの用途に使い、どの水準を求める文書ですか？"
      }
    ],
    "commonMistakes": [
      "認証局の具体的な実施方法を詳述するCPSとは区別します。"
    ]
  },
  {
    "id": "threat",
    "name": "脅威",
    "reading": "Threat",
    "category": "セキュリティ運用",
    "definition": "システムや組織に損害を与える可能性がある、望ましくないインシデントの潜在的な原因です。",
    "example": "不正侵入を試みる攻撃者や、設備を破損させる自然災害が脅威となります。",
    "related": [
      "vulnerability",
      "risk-identification"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "損害をもたらすインシデントの潜在的な原因",
        "hint": "被害の原因と、それに付け込まれる弱点のどちらですか？"
      }
    ],
    "commonMistakes": [
      "資産や管理策の弱点は脆弱性です。"
    ]
  },
  {
    "id": "risk-identification",
    "name": "リスク特定",
    "reading": "Risk identification",
    "category": "セキュリティ運用",
    "definition": "リスクを発見し、認識し、記述するプロセスです。リスク源、事象、原因、起こり得る結果などを明らかにします。",
    "example": "重要な業務で個人情報が漏れる事象と、その原因や影響を洗い出します。",
    "related": [
      "risk-evaluation",
      "risk-management"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "リスクを発見・認識・記述する",
        "hint": "リスクの大きさを判定する前に、何を洗い出しますか？"
      }
    ],
    "commonMistakes": [
      "リスク基準と比較して受容可能かを決める段階はリスク評価です。"
    ]
  },
  {
    "id": "risk-evaluation",
    "name": "リスク評価",
    "reading": "Risk evaluation",
    "category": "セキュリティ運用",
    "definition": "リスク分析の結果をリスク基準と比較し、リスクが受容可能または許容可能かを判断するプロセスです。",
    "example": "分析した情報漏えいリスクを自社の許容基準と比べ、追加対策が必要と判断します。",
    "related": [
      "risk-identification",
      "risk-management"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "分析結果をリスク基準と比較し受容可能か判断する",
        "hint": "分析した大きさを何と比較し、何を決めますか？"
      }
    ],
    "commonMistakes": [
      "リスクを発見する特定や、リスクを修正する対応とは区別します。"
    ]
  },
  {
    "id": "ismap",
    "name": "ISMAP",
    "reading": "Information system Security Management and Assessment Program",
    "category": "クラウドセキュリティ",
    "definition": "政府が求めるセキュリティ要求を満たすクラウドサービスをあらかじめ評価・登録し、政府のクラウドサービス調達でセキュリティ水準を確保する制度です。",
    "example": "政府機関がクラウドサービスを調達する際に、ISMAPの登録サービスリストを確認します。",
    "related": [
      "cloud-service"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "政府調達向けにクラウドサービスのセキュリティを評価・登録する",
        "hint": "誰の調達を支えるため、何を評価する制度ですか？"
      }
    ],
    "commonMistakes": [
      "個人情報保護の体制だけを評価するマーク制度や、外国へのデータ移転の制度ではありません。"
    ]
  },
  {
    "id": "cloud-service",
    "name": "クラウドサービス",
    "reading": "Cloud service",
    "category": "システム構成",
    "definition": "ネットワークを通じて、サーバ、ストレージ、実行基盤、ソフトウェアなどのIT資源を必要に応じて利用するサービスです。",
    "example": "自社でサーバを購入する代わりに、事業者の仮想サーバを必要な期間だけ利用します。",
    "related": [
      "ismap"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ネットワーク経由でIT資源を必要に応じて利用する",
        "hint": "IT資源をどのように利用するサービスですか？"
      }
    ],
    "commonMistakes": [
      "利用者側の設定やデータ管理の責任まで、全て事業者へ移るわけではありません。"
    ]
  },
  {
    "id": "privacy-mark",
    "name": "プライバシーマーク",
    "reading": "PrivacyMark",
    "category": "法務",
    "definition": "個人情報を適切に取り扱うための体制を整備した事業者を評価し、適合を示すマークの使用を認める制度です。JIS Q 15001に基づきます。",
    "example": "事業者が個人情報保護マネジメントシステムを整え、審査を受けます。",
    "related": [
      "isms"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "事業者の個人情報保護の体制を評価する制度",
        "hint": "情報全般ではなく、何の取扱いを対象に評価しますか？"
      }
    ],
    "commonMistakes": [
      "政府調達向けのクラウドサービス登録制度であるISMAPとは異なります。"
    ]
  },
  {
    "id": "isms",
    "name": "情報セキュリティマネジメントシステム",
    "aliases": [
      "ISMS"
    ],
    "reading": "Information Security Management System",
    "category": "セキュリティ運用",
    "definition": "組織が情報セキュリティの方針や目標を定め、リスクに応じた管理策を運用・評価し、継続的に改善するための管理の仕組みです。",
    "example": "情報資産のリスクを評価し、アクセス管理の運用状況を監査して改善します。",
    "related": [
      "risk-management"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "情報セキュリティをリスクに応じて管理し継続的に改善する仕組み",
        "hint": "管理策を導入した後も組織として何を繰り返しますか？"
      }
    ],
    "commonMistakes": [
      "単一のセキュリティ製品や技術の名称ではありません。"
    ]
  },
  {
    "id": "csf-2",
    "name": "CSF 2.0",
    "reading": "National Institute of Standards and Technology Cybersecurity Framework 2.0",
    "category": "セキュリティ運用",
    "definition": "組織のサイバーセキュリティリスクを管理するためのNISTのフレームワークです。コアを統治、特定、防御、検知、対応、復旧の六つの機能で整理します。",
    "example": "現在の対策と目標の状態を六つの機能に沿って整理し、改善の優先順位を決めます。",
    "related": [
      "security-orgs",
      "csf-govern"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "コアをGOVERN・IDENTIFY・PROTECT・DETECT・RESPOND・RECOVERで整理する",
        "hint": "2.0で追加された機能を含め、六つを挙げられますか？"
      }
    ],
    "commonMistakes": [
      "2.0ではGOVERNが加わったため、機能は五つではなく六つです。"
    ]
  },
  {
    "id": "csf-govern",
    "name": "GOVERN",
    "reading": "Govern",
    "category": "セキュリティ運用",
    "definition": "NIST CSF 2.0の統治機能です。組織のサイバーセキュリティリスク管理の戦略、方針、責任などを定め、伝達し、監督します。",
    "example": "経営層が許容するリスクや責任分担を決め、方針に沿った活動か監督します。",
    "related": [
      "csf-2",
      "risk-management"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "サイバーセキュリティの戦略・方針・責任を定め監督する統治機能",
        "hint": "技術対策の前提として、組織で何を定め監督しますか？"
      }
    ],
    "commonMistakes": [
      "CSF 2.0の機能名はCONTROLやDIRECTではなくGOVERNです。"
    ]
  },
  {
    "id": "risk-management",
    "name": "リスク管理",
    "reading": "Risk management",
    "category": "セキュリティ運用",
    "definition": "リスクに関して組織を指揮・統制するための調整された活動です。リスクの把握、対応、監視などを方針に沿って継続します。",
    "example": "情報漏えいのリスクを把握し、対策後の残るリスクも定期的に見直します。",
    "related": [
      "risk-identification",
      "risk-evaluation"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "リスクに関して組織を指揮・統制する継続的な活動",
        "hint": "一度の対策に限らず、リスクを組織としてどう扱いますか？"
      }
    ],
    "commonMistakes": [
      "全てのリスクを完全になくすことだけを意味しません。"
    ]
  },
  {
    "id": "ioc",
    "name": "IoC",
    "reading": "Indicator of Compromise",
    "category": "セキュリティ運用",
    "definition": "システムが侵害された可能性を示す痕跡や指標です。悪性の通信先、マルウェアのハッシュ値、特徴的なファイルなどが調査や検知に使われます。",
    "example": "既知のC&Cサーバへの通信履歴が端末に見つかり、侵害の調査を進めます。",
    "related": [
      "command-control-server",
      "digital-forensics"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "システムの侵害を示す痕跡や指標",
        "hint": "防御の設定や弱点の情報と異なり、何を示しますか？"
      }
    ],
    "commonMistakes": [
      "脆弱性情報やファイアウォールのルール自体は、侵害の痕跡とは限りません。"
    ]
  },
  {
    "id": "side-channel-attack",
    "name": "サイドチャネル攻撃",
    "reading": "Side-channel attack",
    "category": "攻撃手法",
    "definition": "暗号などの処理に伴う時間、消費電力、電磁波などを観測し、秘密情報を推測する攻撃の総称です。",
    "example": "ICカードの演算中に消費電力や処理時間を測り、秘密鍵の手掛かりを得ます。",
    "related": [
      "timing-attack",
      "power-analysis-attack"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "処理時間や消費電力などの観測情報から秘密を推測する",
        "hint": "入出力データ以外の、何を観測する攻撃ですか？"
      }
    ],
    "commonMistakes": [
      "暗号アルゴリズムが数学的に強くても、実装の情報漏えいを防げるとは限りません。"
    ]
  },
  {
    "id": "power-analysis-attack",
    "name": "電力解析攻撃",
    "reading": "Power analysis attack",
    "category": "攻撃手法",
    "definition": "暗号処理中などの消費電力の変化を測定・解析し、秘密鍵などを推測するサイドチャネル攻撃です。",
    "example": "ICカードの演算時の電力波形を収集し、処理データとの関係を解析します。",
    "related": [
      "side-channel-attack",
      "timing-attack"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "消費電力の変化から秘密情報を推測する",
        "hint": "どの物理量を観測しますか？"
      }
    ],
    "commonMistakes": [
      "処理時間を測るタイミング攻撃とは、主に観測する情報が異なります。"
    ]
  },
  {
    "id": "tamper-resistance",
    "name": "耐タンパー性",
    "reading": "Tamper resistance",
    "category": "セキュリティ運用",
    "definition": "機器やソフトウェアの不正な解析、改変、内部情報の読取りなどに抵抗する性質です。保護構造や異常検知、秘密情報の消去などで高めます。",
    "example": "ICカードの筐体を開けると秘密鍵を消去する仕組みを設けます。",
    "related": [
      "side-channel-attack"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "不正な解析・改変・内部情報の読取りに抵抗する性質",
        "hint": "機器内部へ不正に触れようとする行為に、どう備える性質ですか？"
      }
    ],
    "commonMistakes": [
      "耐タンパー対策を設けるだけで、処理時間の差も必ずなくなるわけではありません。"
    ]
  },
  {
    "id": "volatility",
    "name": "揮発性",
    "reading": "Volatility",
    "category": "セキュリティ運用",
    "definition": "証拠保全では、電源断や時間経過によって情報が消失・変化しやすい性質を指します。揮発性の高い情報から優先して収集します。",
    "example": "メモリ上のプロセス情報を、ディスクのファイルより先に保存します。",
    "related": [
      "digital-forensics",
      "routing-table"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "電源断や時間経過で消失・変化しやすい情報を優先して保全する",
        "hint": "どのような情報を先に集めるべきですか？"
      }
    ],
    "commonMistakes": [
      "ディスクのファイルの収集を優先して電源を切ると、メモリ上の証拠を失うことがあります。"
    ]
  },
  {
    "id": "routing-table",
    "name": "ルーティングテーブル",
    "reading": "Routing table",
    "category": "ネットワーク",
    "definition": "宛先ネットワークに対する次の転送先や出力インタフェースなど、パケットの経路選択に使う情報を保持する表です。",
    "example": "宛先IPアドレスに最も長く一致する経路を選び、指定された次のルータへ転送します。",
    "related": [
      "router",
      "volatility"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "宛先に応じたパケットの転送先を保持する表",
        "hint": "どの宛先へ、どこを通って送るかを何で決めますか？"
      }
    ],
    "commonMistakes": [
      "動的に追加された経路は、電源断や経路変更によって失われる可能性があります。"
    ]
  },
  {
    "id": "oauth2",
    "name": "OAuth 2.0",
    "reading": "The OAuth 2.0 Authorization Framework",
    "category": "暗号・認証",
    "definition": "リソースオーナーの許可に基づき、クライアントへリソースへのアクセス権限を委譲するための認可の枠組みです。権限はアクセストークンで表します。",
    "example": "写真編集アプリに、利用者のクラウド上の写真を読み出す権限だけを付与します。",
    "related": [
      "authorization",
      "access-token",
      "authentication"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用者の許可に基づきクライアントへアクセス権限を委譲する",
        "hint": "誰に何の権限を与える枠組みですか？"
      }
    ],
    "commonMistakes": [
      "OAuth 2.0だけを、利用者の本人確認結果をクライアントへ伝える認証プロトコルとして扱いません。"
    ]
  },
  {
    "id": "authentication",
    "name": "認証",
    "reading": "Authentication",
    "category": "暗号・認証",
    "definition": "利用者や機器などが主張する身元を確認することです。パスワード、所持物、生体情報などの認証要素を利用します。",
    "example": "ログイン時に入力されたパスワードを確認し、登録した利用者本人かを確かめます。",
    "related": [
      "authorization",
      "mfa"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用者や機器などの主張する身元を確認する",
        "hint": "誰なのかと何を許可するかの、どちらを確認しますか？"
      }
    ],
    "commonMistakes": [
      "アクセス権限を与える認可と区別します。"
    ]
  },
  {
    "id": "access-token",
    "name": "アクセストークン",
    "reading": "Access token",
    "category": "暗号・認証",
    "definition": "保護されたリソースへのアクセス権限を表す情報です。OAuth 2.0では、クライアントが認可サーバから取得し、リソースサーバへの要求時に提示します。",
    "example": "写真の読取り権限を表すトークンをAPIへ提示して写真を取得します。",
    "related": [
      "oauth2",
      "authorization"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "リソースへのアクセス権限を表し要求時に提示する情報",
        "hint": "パスワードの代わりに何の権限を示して提示しますか？"
      }
    ],
    "commonMistakes": [
      "利用者の身元情報を伝えるIDトークンとは役割が異なります。"
    ]
  },
  {
    "id": "smtp",
    "name": "SMTP",
    "reading": "Simple Mail Transfer Protocol",
    "category": "メールセキュリティ",
    "definition": "電子メールを送信・転送するためのプロトコルです。メールサーバ間での転送や、クライアントからのメール投稿に使います。",
    "example": "送信側のメールサーバが宛先のメールサーバへメールを転送します。",
    "related": [
      "submission-port",
      "op25b"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "電子メールの送信・転送に使うプロトコル",
        "hint": "メールの送信と受信箱からの取出しのどちらに使いますか？"
      }
    ],
    "commonMistakes": [
      "受信箱からの取出しに使うPOPやIMAPとは役割が異なります。"
    ]
  },
  {
    "id": "router",
    "name": "ルータ",
    "reading": "Router",
    "category": "ネットワーク",
    "definition": "ネットワーク層で宛先IPアドレスと経路情報に基づき、異なるネットワーク間でパケットを転送する機器です。",
    "example": "社内LANからインターネットへ向かうパケットを、経路表に従って中継します。",
    "related": [
      "routing-table",
      "broadcast-domain",
      "collision-domain"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "宛先IPアドレスと経路情報に基づきネットワーク間を中継する",
        "hint": "どのアドレスを見て、何と何をつなぎますか？"
      }
    ],
    "commonMistakes": [
      "イーサネットのブロードキャストフレームを、そのまま全ての接続先へ中継する機器ではありません。"
    ]
  },
  {
    "id": "collision-domain",
    "name": "コリジョンドメイン",
    "reading": "Collision domain",
    "category": "ネットワーク",
    "definition": "イーサネットでフレームの衝突が伝わる範囲です。リピータハブでは共有され、ブリッジやスイッチ、ルータで分割されます。",
    "example": "リピータハブに接続した半二重の端末群では、ある端末の送信が他の端末の送信と衝突します。",
    "related": [
      "ethernet",
      "router",
      "bridge"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "イーサネットの衝突が伝わる範囲",
        "hint": "どの現象が伝搬する範囲ですか？"
      }
    ],
    "commonMistakes": [
      "ブロードキャストが届く範囲とは別です。全二重通信では衝突は起きません。"
    ]
  },
  {
    "id": "broadcast-domain",
    "name": "ブロードキャストドメイン",
    "reading": "Broadcast domain",
    "category": "ネットワーク",
    "definition": "同じリンク層のブロードキャストが届く範囲です。ルータやVLANによって分割します。",
    "example": "同じVLAN内の端末にはARP要求が届きますが、別のルータ配下へはそのまま届きません。",
    "related": [
      "router",
      "ethernet"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "リンク層のブロードキャストが届く範囲",
        "hint": "どの種類のフレームが届く範囲ですか？"
      }
    ],
    "commonMistakes": [
      "L2スイッチでコリジョンドメインを分けても、同じVLANならブロードキャストドメインは共有します。"
    ]
  },
  {
    "id": "spanning-tree",
    "name": "スパニングツリープロトコル",
    "aliases": [
      "STP"
    ],
    "reading": "Spanning Tree Protocol",
    "category": "ネットワーク",
    "definition": "複数のブリッジやスイッチで情報を交換し、冗長な接続の一部を転送に使わず、ループのない木構造の経路を作るプロトコルです。障害時には経路を再構成します。",
    "example": "三角形に結んだスイッチの一部のポートを待機させ、回線障害時に代替経路として使います。",
    "related": [
      "bridge"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "冗長なL2接続からループのない転送経路を作る",
        "hint": "複数のブリッジがつながるとき、何を防ぎますか？"
      }
    ],
    "commonMistakes": [
      "アプリケーション別に通信を振り分ける負荷分散や、MACアドレスのエージングではありません。"
    ]
  },
  {
    "id": "bridge",
    "name": "ブリッジ",
    "reading": "Bridge",
    "category": "ネットワーク",
    "definition": "データリンク層でMACアドレスに基づき、LANのセグメント間でフレームを中継・フィルタリングする機器です。",
    "example": "学習した宛先MACアドレスの側だけにフレームを送ることで、不要な転送を減らします。",
    "related": [
      "mac-address",
      "spanning-tree"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "MACアドレスに基づいてセグメント間のフレームを中継する",
        "hint": "どの層で、何のアドレスを使って中継しますか？"
      }
    ],
    "commonMistakes": [
      "IPアドレスに基づいてネットワーク間の経路を選ぶルータとは異なります。"
    ]
  },
  {
    "id": "load-balancing",
    "name": "負荷分散",
    "reading": "Load balancing",
    "category": "システム構成",
    "definition": "要求や処理を複数のサーバや経路などへ振り分け、特定の資源への負荷の集中を避ける仕組みです。",
    "example": "利用者のHTTPリクエストを複数のWebサーバへ分配します。",
    "related": [
      "spanning-tree"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "処理や通信を複数の資源へ振り分けて負荷の集中を避ける",
        "hint": "一つに集中する負荷をどのように扱いますか？"
      }
    ],
    "commonMistakes": [
      "ループ防止のために転送経路を限定するSTPそのものは、負荷分散の機能ではありません。"
    ]
  },
  {
    "id": "http-get",
    "name": "GETメソッド",
    "reading": "Hypertext Transfer Protocol GET method",
    "category": "ネットワーク",
    "definition": "指定したリソースの表現を取得するHTTPメソッドです。通常のHTMLフォームをGETで送信すると、入力値はURIのクエリに付加されます。",
    "example": "検索フォームの入力値が/search?q=wordというURIに含まれます。",
    "related": [
      "http-protocol",
      "http-post"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "リソースの取得に使いフォームデータはURIのクエリに含める",
        "hint": "何のためのメソッドで、フォームの入力値はどこに入りますか？"
      }
    ],
    "commonMistakes": [
      "HTTP/1.1のフォーム送信では、クエリはヘッダーではなくリクエスト行に現れます。"
    ]
  },
  {
    "id": "http-post",
    "name": "POSTメソッド",
    "reading": "Hypertext Transfer Protocol POST method",
    "category": "ネットワーク",
    "definition": "対象リソースにデータを送って処理を依頼するHTTPメソッドです。通常のHTMLフォームでは、入力値をリクエストのメッセージボディに含めます。",
    "example": "申込フォームの内容をメッセージボディへ格納してWebサーバに送ります。",
    "related": [
      "http-protocol",
      "http-get",
      "tls"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "処理するデータをメッセージボディに含めて送信する",
        "hint": "フォームの入力値はリクエストのどの部分に入りますか？"
      }
    ],
    "commonMistakes": [
      "POSTを使うだけではデータは暗号化されません。"
    ]
  },
  {
    "id": "not-exists",
    "name": "NOT EXISTS",
    "reading": "Structured Query Language NOT EXISTS",
    "category": "データベース",
    "definition": "副問合せの結果に行が一つも存在しないときに真となるSQLの条件です。相関副問合せと組み合わせて、対応する行がないデータを抽出できます。",
    "example": "上司として参照する従業員が存在しない行を選び、部下のいない従業員を抽出します。",
    "related": [
      "correlated-subquery",
      "sql-null"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "副問合せの結果が0行のときに真となる",
        "hint": "副問合せの結果が何行のとき成立しますか？"
      }
    ],
    "commonMistakes": [
      "NOT INと同じようにNULLで必ず真偽不明になるわけではありません。EXISTSは結果行の有無を判定します。"
    ]
  },
  {
    "id": "correlated-subquery",
    "name": "相関副問合せ",
    "reading": "Correlated subquery",
    "category": "データベース",
    "definition": "外側の問合せの列を参照する副問合せです。外側の行の値に対応するデータがあるかなどを条件にできます。",
    "example": "外側の従業員コードを内側の「上司」と比較し、その従業員に部下がいるかを調べます。",
    "related": [
      "not-exists"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "副問合せの中から外側の問合せの列を参照する",
        "hint": "内側の問合せがどこの行の値を使いますか？"
      }
    ],
    "commonMistakes": [
      "同じ表を使っていても、別名で区別した内側と外側の行は別々の役割を持ちます。"
    ]
  },
  {
    "id": "sql-null",
    "name": "NULL",
    "reading": "Structured Query Language NULL",
    "category": "データベース",
    "definition": "SQLで値が存在しない、または不明であることを表すものです。0や空文字とは区別し、判定にはIS NULLなどを使います。",
    "example": "上司が設定されていない従業員の「上司」列をNULLにします。",
    "related": [
      "not-exists"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "値の不存在や不明を表し通常の等値比較では真にならない",
        "hint": "0や空文字とどう異なり、どの条件で判定しますか？"
      }
    ],
    "commonMistakes": [
      "NULL同士を「=」で比較しても真にはなりません。"
    ]
  },
  {
    "id": "sonarqube",
    "name": "SonarQube",
    "reading": "SonarQube",
    "category": "開発技術",
    "definition": "ソースコードを静的解析し、バグ、脆弱性、重複などを検出してコード品質の管理を支援するツールです。",
    "example": "コード変更ごとに解析し、重複したコードや問題を起こす可能性のある記述を確認します。",
    "related": [
      "git",
      "jenkins"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ソースコードを静的解析してバグ・脆弱性・重複などを検出する",
        "hint": "ソースコードのどのような問題を何の方法で検出しますか？"
      }
    ],
    "commonMistakes": [
      "バージョン管理やネットワークの侵入検知を主目的とするツールではありません。"
    ]
  },
  {
    "id": "git",
    "name": "Git",
    "reading": "Git",
    "category": "開発技術",
    "definition": "ソースコードなどの変更履歴を管理する分散バージョン管理システムです。各開発者がリポジトリの履歴を保持し、ブランチやマージを使って共同開発します。",
    "example": "修正をコミットし、別の作業ブランチの変更をマージします。",
    "related": [
      "jenkins",
      "sonarqube"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "変更履歴を管理する分散バージョン管理システム",
        "hint": "コードを解析するのではなく、何を記録・管理しますか？"
      }
    ],
    "commonMistakes": [
      "バグや脆弱性を自動検出する静的解析ツールそのものではありません。"
    ]
  },
  {
    "id": "jenkins",
    "name": "Jenkins",
    "reading": "Jenkins",
    "category": "開発技術",
    "definition": "ビルド、テスト、デプロイなどの処理を自動実行するための自動化サーバです。継続的インテグレーションなどに使います。",
    "example": "リポジトリへの変更を契機に、ビルドとテストを順に実行します。",
    "related": [
      "git",
      "sonarqube"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ビルドやテストなどの処理を自動化する",
        "hint": "開発に伴うどのような作業を自動実行しますか？"
      }
    ],
    "commonMistakes": [
      "静的解析は連携する解析ツールが行い、Jenkins自体の主な役割は処理の自動化です。"
    ]
  },
  {
    "id": "snort",
    "name": "Snort",
    "reading": "Snort",
    "category": "ネットワークセキュリティ",
    "definition": "ネットワーク通信を解析し、ルールに基づいて不正侵入や攻撃を検知・防止するOSSのツールです。",
    "example": "ネットワーク上のパケットを監視し、既知の攻撃に一致する通信を検知します。",
    "related": [
      "ids-ips",
      "ips"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ネットワーク通信から不正侵入や攻撃を検知・防止する",
        "hint": "ソースコードではなく、何を監視して攻撃を見つけますか？"
      }
    ],
    "commonMistakes": [
      "ソースコードのバグや重複を検出するツールではありません。"
    ]
  },
  {
    "id": "kpt",
    "name": "KPT",
    "reading": "Keep Problem Try",
    "category": "開発技術",
    "definition": "振り返りの内容をKeep（続けたいこと）、Problem（問題点）、Try（次に試すこと）の三つで整理する手法です。",
    "example": "短いレビューを続けることをKeep、レビュー待ちをProblem、担当者の交代制をTryに挙げます。",
    "related": [
      "scrum",
      "sprint-retrospective"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "Keep・Problem・Tryで継続事項と問題点、次の改善行動を整理する",
        "hint": "K・P・Tはそれぞれ何を表しますか？"
      }
    ],
    "commonMistakes": [
      "KはKaizenやKnowledge、PはPersonaやPracticeではありません。"
    ]
  },
  {
    "id": "downtime",
    "name": "停止時間",
    "reading": "Downtime",
    "category": "サービス管理",
    "definition": "システムやサービスが利用できない時間です。サービス可用性の計算では、合意したサービス提供時間内の利用不能時間を対象にします。",
    "example": "6時〜20時のサービスが10時から12時まで利用できなければ、提供時間内の停止は2時間です。",
    "related": [
      "service-availability",
      "service-hours",
      "repair-time"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "サービスが利用できない時間で可用性では合意した提供時間内を数える",
        "hint": "サービスの可用性を計算するとき、どの時間帯の利用不能を数えますか？"
      }
    ],
    "commonMistakes": [
      "提供時間外に修復作業をしていても、その時間を提供時間内の停止にそのまま足しません。"
    ]
  },
  {
    "id": "repair-time",
    "name": "修復時間",
    "reading": "Repair time",
    "category": "サービス管理",
    "definition": "故障したシステムや機器を修復して利用可能な状態に戻すために要する時間です。サービス提供時間内の停止時間と必ずしも一致しません。",
    "example": "夜間に3時間の修復を行っても、朝までに復旧すれば日中だけのサービスの停止時間は増えません。",
    "related": [
      "downtime",
      "mttr"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "故障から利用可能な状態へ戻すために要する時間",
        "hint": "修復に要した時間は、サービス提供時間内とは限りますか？"
      }
    ],
    "commonMistakes": [
      "修復作業の全時間が、サービス可用性の停止時間になるわけではありません。"
    ]
  },
  {
    "id": "compliance",
    "name": "準拠性",
    "reading": "Compliance",
    "category": "システム監査",
    "definition": "業務や情報システムの運用が、適用される法令、規則、契約、組織内の規程などに従っていることです。",
    "example": "取引記録の保管期間やアクセス手続が法令と社内規程に適合しているか確認します。",
    "related": [
      "it-control-reliability"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "適用される法令・規則・契約などに従うこと",
        "hint": "どのような要求事項を守るという目標ですか？"
      }
    ],
    "commonMistakes": [
      "記録した取引に漏れや重複がないというデータ品質は、この設問の統制目標では信頼性に含まれます。"
    ]
  },
  {
    "id": "digital-certificate",
    "name": "デジタル証明書",
    "reading": "Digital certificate",
    "category": "暗号・認証",
    "definition": "主体と公開鍵の対応などを記載し、発行者のデジタル署名で保証する電子的な証明書です。秘密鍵は含みません。",
    "example": "ブラウザがサーバー証明書の署名とホスト名などを検証し、接続先の公開鍵を確認します。",
    "related": [
      "pki",
      "certificate-authority",
      "x509"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "主体と公開鍵の対応を発行者の署名で保証する",
        "hint": "何と何の対応を、何で保証するデータですか？"
      }
    ],
    "commonMistakes": [
      "公開鍵基盤という仕組み全体ではなく、その中で発行・検証する証明書です。秘密鍵は載せません。"
    ]
  },
  {
    "id": "command-control-server",
    "name": "C&Cサーバ",
    "reading": "Command and Control server",
    "category": "攻撃手法",
    "definition": "マルウェアに感染した端末などに指令を送り、不正な動作を制御するためのサーバです。",
    "example": "感染したIoT機器に、攻撃先のIPアドレスと攻撃開始の指令を送ります。",
    "related": [
      "botnet",
      "mirai"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "感染端末などへ指令を送り不正な動作を制御するサーバ",
        "hint": "多数の感染端末にどのような役割を果たしますか？"
      }
    ],
    "commonMistakes": [
      "感染端末群であるボットネット全体と、指令を送るサーバは同じ概念ではありません。"
    ]
  },
  {
    "id": "arp-cache",
    "name": "ARPキャッシュ",
    "reading": "Address Resolution Protocol cache",
    "category": "ネットワーク",
    "definition": "ARPによって得たIPv4アドレスとMACアドレスの対応を一時的に保持する情報です。一定時間で更新・削除されるため、証拠保全では早めに取得します。",
    "example": "同じLAN内のゲートウェイのIPv4アドレスとMACアドレスの対応を保存します。",
    "related": [
      "mac-address",
      "digital-forensics"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ARPで得たIPアドレスとMACアドレスの対応を一時保持する",
        "hint": "どの二つのアドレスの対応を記録しますか？"
      }
    ],
    "commonMistakes": [
      "MACアドレス自体や、宛先ネットワークの経路を保持する表とは異なります。"
    ]
  },
  {
    "id": "op25b",
    "name": "OP25B",
    "reading": "Outbound Port 25 Blocking",
    "category": "メールセキュリティ",
    "definition": "管理下のネットワークから外部のTCPの25番ポートへの接続を制限し、端末などによる直接のスパムメール送信を抑制する対策です。",
    "example": "ISPが加入者の感染端末から外部メールサーバへの直接送信を遮断します。",
    "related": [
      "submission-port",
      "smtp-auth",
      "smtp"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "外向きのTCP25番ポートへの接続を制限しスパム送信を抑える",
        "hint": "通信方向と対象ポート番号は何ですか？"
      }
    ],
    "commonMistakes": [
      "外部から入るメールや、ICMPによるDDoS攻撃を直接制限する仕組みではありません。"
    ]
  },
  {
    "id": "smtp-auth",
    "name": "SMTP-AUTH",
    "reading": "Simple Mail Transfer Protocol Authentication",
    "category": "メールセキュリティ",
    "definition": "SMTPでメールを投稿する利用者を認証する拡張です。許可された利用者だけがメール送信サービスを使えるようにします。",
    "example": "メールクライアントが認証情報を提示してから投稿用サーバにメールを送信します。",
    "related": [
      "smtp",
      "submission-port",
      "op25b"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "SMTPでメールを投稿する利用者を認証する",
        "hint": "どの利用者の何の操作を認証しますか？"
      }
    ],
    "commonMistakes": [
      "送信ドメインを検査するSPFや、外向き25番ポートを制限するOP25Bとは異なります。"
    ]
  },
  {
    "id": "http-protocol",
    "name": "HTTP",
    "reading": "Hypertext Transfer Protocol",
    "category": "ネットワーク",
    "definition": "クライアントとサーバがリクエストとレスポンスをやり取りし、Web上のリソースを取得・送信するためのアプリケーション層のプロトコルです。",
    "example": "ブラウザがGETリクエストを送り、Webサーバがステータスコードとページの内容を返します。",
    "related": [
      "http-status",
      "http-get",
      "http-post"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "Webのリソースをリクエストとレスポンスでやり取りするプロトコル",
        "hint": "クライアントとサーバはどのような単位でやり取りしますか？"
      }
    ],
    "commonMistakes": [
      "HTTPステータスコードはHTTPの応答結果を示す一要素で、プロトコル全体とは異なります。"
    ]
  },
  {
    "id": "sprint-retrospective",
    "name": "レトロスペクティブ",
    "reading": "Sprint retrospective",
    "category": "開発技術",
    "definition": "スクラムで、直近のスプリントの進め方や協働、プロセスなどを振り返り、品質と有効性を高める改善を計画するイベントです。",
    "example": "レビュー待ちで手戻りが増えた原因を話し合い、次のスプリントで試す改善を決めます。",
    "related": [
      "scrum",
      "kpt",
      "sprint-review"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "スプリントの進め方を振り返り次の改善を計画する",
        "hint": "成果物そのものではなく、何を振り返って改善しますか？"
      }
    ],
    "commonMistakes": [
      "成果をステークホルダーと確認するスプリントレビューとは目的が異なります。"
    ]
  },
  {
    "id": "sprint-review",
    "name": "スプリントレビュー",
    "reading": "Sprint review",
    "category": "開発技術",
    "definition": "スクラムで、スプリントの成果をステークホルダーと検査し、状況の変化も踏まえて今後の適応を決めるイベントです。",
    "example": "開発した機能を利用部門と確認し、得られた意見から今後の優先順位を見直します。",
    "related": [
      "scrum",
      "sprint-retrospective"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "スプリントの成果をステークホルダーと確認し今後に適応する",
        "hint": "誰と何を確認するイベントですか？"
      }
    ],
    "commonMistakes": [
      "チームの進め方を改善するためのレトロスペクティブとは区別します。"
    ]
  },
  {
    "id": "service-hours",
    "name": "サービス提供時間",
    "reading": "Agreed service time",
    "category": "サービス管理",
    "definition": "サービスを利用できるように提供することが顧客などとの間で合意された時間です。サービス可用性の計算の基準になります。",
    "example": "毎日6時から20時までを提供時間と合意した場合、1日当たり14時間が対象です。",
    "related": [
      "service-availability",
      "downtime"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "サービスを提供すると合意した時間",
        "hint": "可用性の分母には24時間全体と合意時間のどちらを使いますか？"
      }
    ],
    "commonMistakes": [
      "サービスが実際に使えた時間や、修復作業にかかった全時間とは異なります。"
    ]
  },
  {
    "id": "it-control-reliability",
    "name": "信頼性（ITの統制目標）",
    "reading": "Reliability in information technology control objectives",
    "category": "システム監査",
    "definition": "財務報告に係る内部統制のITの統制目標では、情報が組織の意図どおりに承認され、漏れや重複なく正確に記録・処理されることです。",
    "example": "売上取引を二重計上せず、全件を正しい金額と科目で記録します。",
    "related": [
      "compliance",
      "reliability"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "取引情報が承認され漏れや重複なく正確に記録・処理される",
        "hint": "財務報告に使う取引情報に、どのような性質を求めますか？"
      }
    ],
    "commonMistakes": [
      "情報セキュリティの「意図した行動と結果の一貫性」という信頼性とは、設問の文脈を区別します。"
    ]
  },
  {
    "id": "symmetric-key",
    "name": "共通鍵",
    "reading": "Symmetric Key",
    "category": "暗号・認証",
    "definition": "暗号化と復号、またはMACの生成と検証などで、当事者が共有して使う秘密の鍵です。",
    "example": "送受信者が同じAES鍵を安全に共有します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "当事者が共有して暗号処理などに使う秘密の鍵",
        "hint": "共通鍵の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "public-key",
    "name": "公開鍵",
    "reading": "Public Key",
    "category": "暗号・認証",
    "definition": "公開鍵暗号方式で公開して利用する鍵です。対応する秘密鍵で作った署名の検証や、秘密鍵の所有者宛ての暗号化などに使います。",
    "example": "認証局の公開鍵で証明書の署名を検証します。",
    "related": [
      "private-key",
      "public-key-crypto"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "秘密鍵と対になり公開して暗号化や署名検証などに使う鍵",
        "hint": "公開鍵の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "private-key",
    "name": "秘密鍵",
    "reading": "Private Key",
    "category": "暗号・認証",
    "definition": "公開鍵暗号方式で公開鍵と対になり、所有者が秘密に保持する鍵です。署名の生成や、自分宛ての暗号文の復号などに使います。",
    "example": "認証局が秘密鍵で証明書に署名します。",
    "related": [
      "public-key",
      "digital-signature"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "公開鍵と対になり秘密に保持して署名生成や復号などに使う鍵",
        "hint": "秘密鍵の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "forward-secrecy",
    "name": "前方秘匿性",
    "reading": "Forward Secrecy",
    "category": "暗号・認証",
    "definition": "認証用などの長期秘密鍵が後から漏えいしても、過去の通信のセッション鍵を復元できない性質です。",
    "example": "一時的なDH鍵を通信ごとに作り、利用後に破棄します。",
    "related": [
      "dh-key-exchange",
      "session-key"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "長期秘密鍵の将来の漏えいから過去の通信を守る",
        "hint": "前方秘匿性の目的や仕組みを説明できますか？"
      },
      {
        "id": "ephemeral-key",
        "title": "一時的な鍵共有と鍵の破棄などで実現する",
        "hint": "過去のセッション鍵を後から導出できなくするにはどうしますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "認証用の長期秘密鍵の漏えいに対する性質で、通信のセッション鍵自体の漏えいまで保護しません。"
    ]
  },
  {
    "id": "session-key",
    "name": "セッション鍵",
    "reading": "Session Key",
    "category": "暗号・認証",
    "definition": "個々の通信セッションのデータを暗号化・復号などするために使う鍵です。",
    "example": "TLSの鍵交換で得た情報から、実際の通信保護用の鍵を導出します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "個々の通信セッションを保護するための鍵",
        "hint": "セッション鍵の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "blockchain",
    "name": "ブロックチェーン",
    "reading": "Blockchain",
    "category": "暗号・認証",
    "definition": "データをブロックにまとめ、前のブロックのハッシュ値などで連結し、複数の参加者が履歴を共有する仕組みです。",
    "example": "過去の取引を変更すると後続のハッシュの対応が崩れます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ブロックをハッシュで連結して履歴を共有する",
        "hint": "ブロックチェーンの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "tls13",
    "name": "TLS 1.3",
    "reading": "Transport Layer Security 1.3",
    "category": "暗号・認証",
    "definition": "通信の暗号化・認証・完全性保護を提供するTLSの版です。古い暗号方式を除き、暗号スイートにはAEADとハッシュを含め、鍵交換や署名の方式は別に選びます。",
    "example": "TLS_AES_128_GCM_SHA256でWeb通信を保護します。",
    "related": [
      "tls",
      "aead",
      "cipher-suite"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "暗号化・認証・完全性保護を提供するTLSの版で、古い暗号方式を除いている",
        "hint": "何を保護するプロトコルの、どのような版ですか？"
      },
      {
        "id": "suite",
        "title": "暗号スイートではAEADとハッシュの組合せを選ぶ",
        "hint": "TLS 1.3の暗号スイートには、どの種類のアルゴリズムが含まれますか？",
        "level": "deep"
      },
      {
        "id": "separate-negotiation",
        "title": "鍵交換と署名の方式は暗号スイートと別に選ぶ",
        "hint": "TLS 1.2と暗号スイートの内容は同じですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "TLS 1.3ではAES-CBCは暗号スイートに含まれません。鍵交換・署名はスイートと別に選びます。"
    ]
  },
  {
    "id": "aead",
    "name": "AEAD",
    "reading": "Authenticated Encryption with Associated Data",
    "category": "暗号・認証",
    "definition": "平文の暗号化と認証を一体で行い、暗号化しない付加データも改ざん検知の対象にできる方式です。",
    "example": "AES-GCMで本文を暗号化し、ヘッダーの一部も認証します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "暗号化と完全性保護を行い付加データも認証する",
        "hint": "AEADの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cipher-suite",
    "name": "暗号スイート",
    "reading": "Cipher Suite",
    "category": "暗号・認証",
    "definition": "通信で用いる暗号アルゴリズムなどの組合せです。含む要素はプロトコルの版によって異なります。",
    "example": "TLS 1.3ではAEAD方式とハッシュ方式の組に合意します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "通信で使用する暗号アルゴリズムなどの組合せ",
        "hint": "暗号スイートの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "collision-resistance",
    "name": "衝突発見困難性",
    "reading": "Collision Resistance",
    "category": "暗号・認証",
    "definition": "同じハッシュ値になる異なる二つの入力を見つけることが計算上困難である性質です。",
    "example": "別の文書を用意して同じ署名対象ハッシュを作ることを難しくします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "同じハッシュ値を生む異なる二入力を見つけにくい",
        "hint": "衝突発見困難性の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "与えられたハッシュ値に対する入力の探索は原像計算困難性で、二入力の衝突探索とは違います。"
    ]
  },
  {
    "id": "preimage-resistance",
    "name": "原像計算困難性",
    "reading": "Preimage Resistance",
    "category": "暗号・認証",
    "definition": "与えられたハッシュ値に対応する入力を求めることが計算上困難である性質です。",
    "example": "ハッシュ値だけから元のメッセージを探すことを難しくします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "与えられたハッシュ値から対応する入力を求めにくい",
        "hint": "原像計算困難性の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "birthday-attack",
    "name": "誕生日攻撃",
    "reading": "Birthday Attack",
    "category": "暗号・認証",
    "definition": "ハッシュなどの出力の衝突を、候補同士の多数の組合せを利用して探索する攻撃です。理想的なnビット出力では約2のn/2乗が探索回数の目安です。",
    "example": "256ビットハッシュの衝突を約2の128乗回の試行で探すことを考えます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "候補間の組合せを利用して衝突を探す",
        "hint": "誕生日攻撃の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ctr-mode",
    "name": "CTRモード",
    "reading": "Counter mode",
    "category": "暗号・認証",
    "definition": "カウンタ値をブロック暗号で暗号化して鍵ストリームを作り、データとXORを取る暗号利用モードです。同じ鍵でカウンタを再利用しません。",
    "example": "各ブロックのカウンタを独立に処理し、暗号化を並列化します。",
    "related": [
      "block-cipher",
      "logic-operation"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "暗号化したカウンタの出力とデータのXORを取る",
        "hint": "CTRモードの目的や仕組みを説明できますか？"
      },
      {
        "id": "counter-unique",
        "title": "同じ鍵でカウンタを再利用しない",
        "hint": "鍵ストリームが再利用されると安全ですか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "パディングは不要で、暗号化も復号も並列化できます。同じ鍵とカウンタの再利用は避けます。"
    ]
  },
  {
    "id": "block-cipher",
    "name": "ブロック暗号",
    "reading": "Block Cipher",
    "category": "暗号・認証",
    "definition": "固定長のブロックごとに、鍵を使って暗号化・復号する共通鍵暗号です。長いデータには暗号利用モードを組み合わせます。",
    "example": "AESをCTRやGCMなどのモードで利用します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "固定長のブロック単位で処理する共通鍵暗号",
        "hint": "ブロック暗号の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "padding",
    "name": "パディング",
    "reading": "Padding",
    "category": "暗号・認証",
    "definition": "データを必要な長さや形式にそろえるため、規則に従って付加データを加えることです。",
    "example": "CBCモードで平文の長さをブロック長の倍数へそろえます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "規則に従い付加データを加えて長さや形式をそろえる",
        "hint": "パディングの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cprm",
    "name": "CPRM",
    "reading": "Content Protection for Recordable Media",
    "category": "暗号・認証",
    "definition": "記録可能な媒体上のコンテンツを保護する技術です。SDメモリカードなどで利用されます。",
    "example": "SDカードに記録した映像の不正なコピーを制限します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "記録可能な媒体のコンテンツを保護する",
        "hint": "CPRMの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cppm",
    "name": "CPPM",
    "reading": "Content Protection for Pre-recorded Media",
    "category": "暗号・認証",
    "definition": "記録済みの媒体のコンテンツを保護する技術です。DVD-Audioなどで利用されます。",
    "example": "販売される記録済み音楽メディアの内容を保護します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "記録済み媒体のコンテンツを保護する",
        "hint": "CPPMの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "dtcp",
    "name": "DTCP",
    "reading": "Digital Transmission Content Protection",
    "category": "暗号・認証",
    "definition": "デジタル機器間で伝送するコンテンツを、機器認証や暗号化などで保護する技術です。",
    "example": "対応する映像機器間で録画番組を保護して転送します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "デジタル機器間のコンテンツ伝送を保護する",
        "hint": "DTCPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "hdcp",
    "name": "HDCP",
    "reading": "High-bandwidth Digital Content Protection",
    "category": "暗号・認証",
    "definition": "HDMIなどのデジタル映像・音声の伝送路で、機器認証と暗号化によってコンテンツを保護する技術です。",
    "example": "プレーヤーからディスプレイへ送る映像を保護します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "映像・音声のデジタル伝送路を保護する",
        "hint": "HDCPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "left-outer-join",
    "name": "LEFT OUTER JOIN",
    "reading": "LEFT OUTER JOIN",
    "category": "データベース",
    "definition": "左側の表の全行を残し、結合条件に一致する右側の行を結び付ける外部結合です。一致しない右側の列はNULLになります。",
    "example": "顧客表を左に置き、受注がない顧客も一覧に残します。",
    "related": [
      "full-outer-join",
      "sql-null"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "左の全行を残し右に対応がない列をNULLにする",
        "hint": "LEFT OUTER JOINの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "右側だけに存在する行まで残すわけではありません。"
    ]
  },
  {
    "id": "join-condition",
    "name": "結合条件",
    "reading": "Join Condition",
    "category": "データベース",
    "definition": "複数の表の行をどの対応関係で組み合わせるかを指定する条件です。",
    "example": "顧客コードが等しい受注行と顧客行を結合します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "複数表の行を対応付ける条件",
        "hint": "結合条件の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "full-outer-join",
    "name": "完全外部結合",
    "reading": "Full Outer Join",
    "category": "データベース",
    "definition": "両方の表の全行を残す外部結合です。相手に一致する行がなければ、相手側の列をNULLにします。",
    "example": "片方だけにある商品コードも両方の一覧に残します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "両側の一致しない行も残して相手側をNULLにする",
        "hint": "完全外部結合の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sql-or",
    "name": "OR条件",
    "reading": "Structured Query Language OR",
    "category": "データベース",
    "definition": "複数の条件のうち、少なくとも一つが真なら全体を真とする条件です。SQLではNULLによる不明の扱いも考慮します。",
    "example": "勤続年数>10 OR 年齢>28で、どちらかを満たす社員を選びます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "いずれかの条件が真なら全体が真になる",
        "hint": "OR条件の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sql-and",
    "name": "AND条件",
    "reading": "Structured Query Language AND",
    "category": "データベース",
    "definition": "複数の条件が全て真のときに全体を真とする条件です。SQLではNULLによる不明の扱いも考慮します。",
    "example": "条件を満たし、かつ所属が総務部の社員を選びます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "全ての条件が真のとき全体が真になる",
        "hint": "AND条件の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "data-lineage",
    "name": "データリネージ",
    "reading": "Data Lineage",
    "category": "データベース",
    "definition": "データの発生源から変換・加工を経て現在の形になるまでの流れを示す情報です。",
    "example": "集計値がどの元データと処理から作られたかを追います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "データの発生源と変換・加工の経路を追跡する",
        "hint": "データリネージの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "metadata",
    "name": "メタデータ",
    "reading": "Metadata",
    "category": "データベース",
    "definition": "データの構造、意味、作成元、更新日時など、データを説明・管理するための情報です。",
    "example": "売上列の型や単位、集計の対象期間を記録します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "データの構造や意味などを説明する情報",
        "hint": "メタデータの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "data-warehouse",
    "name": "データウェアハウス",
    "reading": "Data Warehouse",
    "category": "データベース",
    "definition": "様々なシステムのデータを統合・蓄積し、分析や意思決定に利用するためのデータ基盤です。",
    "example": "販売・在庫・顧客の履歴をまとめて分析します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "業務データを統合・蓄積して分析に使う基盤",
        "hint": "データウェアハウスの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "odbc",
    "name": "ODBC",
    "reading": "Open Database Connectivity",
    "category": "データベース",
    "definition": "アプリケーションからドライバーを介し、様々なDBMSへ共通のインタフェースでアクセスするための仕組みです。",
    "example": "対応ドライバーを使って業務アプリからDBへSQLを送ります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ドライバーを介した共通のDBアクセスのインタフェース",
        "hint": "ODBCの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "data-dictionary",
    "name": "データディクショナリ",
    "reading": "Data Dictionary",
    "category": "データベース",
    "definition": "表や列、制約、利用者、権限など、DBMSがデータベースを管理するための情報を集めたものです。",
    "example": "表の定義や列の型を調べます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "データベースの構造や利用者などの管理情報を保持する",
        "hint": "データディクショナリの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "log",
    "name": "ログ",
    "reading": "Log",
    "category": "データベース",
    "definition": "システムの動作や操作、事象などを時系列で記録した情報です。調査や監査、障害回復などに使います。",
    "example": "誰がどのレコードを更新したか記録します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "動作・操作・事象の履歴を記録する",
        "hint": "ログの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sql-grant",
    "name": "GRANT",
    "reading": "GRANT",
    "category": "データベース",
    "definition": "SQLで、利用者などへ表や資源に対する操作権限を与える文です。",
    "example": "利用者BにA表のSELECT権限を付与します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用者などへ操作権限を付与するSQL文",
        "hint": "GRANTの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sql-grant-option",
    "name": "WITH GRANT OPTION",
    "reading": "WITH GRANT OPTION",
    "category": "データベース",
    "definition": "SQLのGRANTで、与えた権限を受領者が他者へ再付与することも認める指定です。",
    "example": "Bが受け取ったSELECT権限をCにも付与できるようにします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "付与した権限を他者へ再付与できるようにする",
        "hint": "WITH GRANT OPTIONの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sql-select",
    "name": "SELECT",
    "reading": "SELECT",
    "category": "データベース",
    "definition": "SQLで、指定した列や条件に基づいて表などからデータを取り出す文です。",
    "example": "条件に合う社員番号だけを取得します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "表などから条件に合うデータを取り出すSQL文",
        "hint": "SELECTの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sql-update",
    "name": "UPDATE",
    "reading": "UPDATE",
    "category": "データベース",
    "definition": "SQLで、表の既存の行の値を変更する文です。対象行はWHEREなどで指定します。",
    "example": "社員番号を指定し、その社員の所属を変更します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "既存の行の値を変更するSQL文",
        "hint": "UPDATEの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "referential-integrity",
    "name": "参照整合性",
    "reading": "Referential Integrity",
    "category": "データベース",
    "definition": "外部キーの値に対応する参照先が存在するなど、表間の参照関係に矛盾がない性質です。",
    "example": "存在しない顧客コードを受注表へ登録しないようにします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "外部キーと参照先の関係に矛盾がない",
        "hint": "参照整合性の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sql",
    "name": "SQL",
    "reading": "Structured Query Language",
    "category": "データベース",
    "definition": "関係データベースの定義、検索、更新、権限管理などを行うための言語です。",
    "example": "SELECTで検索し、GRANTで利用者に権限を与えます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "関係データベースの定義や操作などに使う言語",
        "hint": "SQLの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "reproduction-right",
    "name": "複製権",
    "reading": "Reproduction Right",
    "category": "法務",
    "definition": "著作物を有形的に再製する行為を専有する著作者の権利です。プログラムのコピーも対象になります。",
    "example": "ソフトウェアを別の媒体へコピーすることの許諾を確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "著作物をコピーする行為を専有する権利",
        "hint": "複製権の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "technological-protection",
    "name": "技術的保護手段",
    "reading": "Technological Protection",
    "category": "法務",
    "definition": "著作権などを侵害する行為を技術的に防止・抑止する手段です。コピー制御などが該当し、回避を伴う利用には法令や許諾の確認が必要です。",
    "example": "複製制御を解除してソフトウェアをコピーする行為が問題になります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "著作権侵害などを技術的に防止・抑止する手段",
        "hint": "技術的保護手段の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "software-license",
    "name": "使用許諾契約",
    "reading": "Software License",
    "category": "法務",
    "definition": "権利者が、利用者に対してソフトウェアなどの利用を認める範囲と条件を定める契約です。",
    "example": "利用台数や改変・複製の可否を契約で確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ソフトウェアなどの利用の範囲と条件を定める契約",
        "hint": "使用許諾契約の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "return-on-investment",
    "name": "投資利益率",
    "aliases": [
      "ROI"
    ],
    "reading": "Return On Investment",
    "category": "サービス管理",
    "definition": "投資によって得る利益の増加額を投資額で割り、投資効率を表す指標です。算定では対象期間と利益・投資の定義を合わせます。",
    "example": "投資額40、利益増加70なら175％です。",
    "related": [
      "initial-cost",
      "operating-cost",
      "incremental-profit"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "利益の増加額を投資額で割って投資効率を表す",
        "hint": "投資利益率の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "initial-cost",
    "name": "初期費用",
    "reading": "Initial Cost",
    "category": "サービス管理",
    "definition": "導入や開発などの開始時に必要となる費用です。運用開始後に継続して発生する費用とは分けます。",
    "example": "システム導入時に機器の購入と初期設定の費用を払います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "導入・開発などの開始時に必要な費用",
        "hint": "初期費用の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "operating-cost",
    "name": "運用費",
    "reading": "Operating Cost",
    "category": "サービス管理",
    "definition": "システムやサービスを継続して利用・運用するために発生する費用です。",
    "example": "保守、回線、クラウド利用の料金を毎年支払います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用・運用を継続するために発生する費用",
        "hint": "運用費の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "incremental-profit",
    "name": "利益の増加額",
    "reading": "Incremental Profit",
    "category": "サービス管理",
    "definition": "投資前などの基準と比較して増えた利益です。投資評価では、対象期間の効果から必要な費用を差し引いて求めます。",
    "example": "削減した業務費110から投資額40を引き、増加額70とします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "基準と比べて増えた利益を効果と費用から求める",
        "hint": "利益の増加額の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "business-continuity",
    "name": "事業継続",
    "reading": "Business Continuity",
    "category": "サービス管理",
    "definition": "災害や障害などが起きても重要業務を継続し、許容される時間内に復旧できるようにすることです。",
    "example": "拠点が使えなくなっても代替拠点で重要な受注業務を続けます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "中断に備え重要業務を継続・復旧する",
        "hint": "事業継続の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "supply-chain",
    "name": "サプライチェーン",
    "reading": "Supply Chain",
    "category": "サービス管理",
    "definition": "調達、生産、物流、販売など、製品やサービスを届けるまでにつながる企業や活動の連鎖です。",
    "example": "部品の供給元から販売先までの取引関係を把握します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "製品やサービスを届ける調達から販売などの連鎖",
        "hint": "サプライチェーンの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "saas",
    "name": "SaaS",
    "reading": "Software as a Service",
    "category": "サービス管理",
    "definition": "提供者が運用するアプリケーションをネットワーク経由で利用するクラウドサービスの区分です。",
    "example": "ブラウザで事業者の会計サービスを使います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "提供者が運用するアプリケーションをサービスとして利用する",
        "hint": "SaaSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "利用企業がサーバOSやDBMSの管理者IDまで管理するとは限りません。"
    ]
  },
  {
    "id": "paas",
    "name": "PaaS",
    "reading": "Platform as a Service",
    "category": "サービス管理",
    "definition": "アプリケーションの開発・実行に使う基盤を提供するクラウドサービスの区分です。利用者は主にアプリケーションやデータを管理します。",
    "example": "OSの管理を提供者へ任せ、自作アプリを実行します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "アプリの開発・実行基盤をサービスとして利用する",
        "hint": "PaaSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "通常、利用者がアプリケーションを開発し、提供者がOSなどの基盤を管理します。"
    ]
  },
  {
    "id": "iaas",
    "name": "IaaS",
    "reading": "Infrastructure as a Service",
    "category": "サービス管理",
    "definition": "仮想サーバやストレージ、ネットワークなどの基盤資源を提供するクラウドサービスの区分です。利用者は通常OSやアプリケーションを管理します。",
    "example": "仮想マシンに自分でOSやDBMSを導入します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "計算・ストレージ・ネットワークなどの基盤資源を利用する",
        "hint": "IaaSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "internal-audit",
    "name": "内部監査",
    "reading": "Internal Audit",
    "category": "サービス管理",
    "definition": "組織内の仕組みや活動が要求事項などを満たすかを、独立性と客観性を確保して評価する活動です。",
    "example": "SMSが規格と自社の要求に適合しているか定期的に確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "組織の活動や仕組みが要求に適合するか評価する",
        "hint": "内部監査の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "management-review",
    "name": "マネジメントレビュー",
    "reading": "Management Review",
    "category": "サービス管理",
    "definition": "経営層が、マネジメントシステムの適切性・妥当性・有効性などを定期的に評価し、改善や変更を判断する活動です。",
    "example": "監査結果や目標の達成状況を見て資源配分や方針を見直します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "経営層が管理の仕組みを評価し改善や変更を判断する",
        "hint": "マネジメントレビューの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sms",
    "name": "SMS",
    "reading": "Service Management System",
    "category": "サービス管理",
    "definition": "サービスを指揮・管理する方針や目標、プロセスなどから成るサービスマネジメントシステムです。",
    "example": "サービスの計画・提供・測定・改善の仕組みを整備します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "サービスを計画・提供・管理・改善するための仕組み",
        "hint": "SMSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ooda",
    "name": "OODAループ",
    "reading": "Observe / Orient / Decide / Act",
    "category": "サービス管理",
    "definition": "観察、状況判断、意思決定、行動を繰り返し、状況の変化へ適応して判断・行動する枠組みです。",
    "example": "現場の変化を把握して対応を選び、実行結果から次の行動を変えます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "観察・状況判断・意思決定・行動を繰り返す",
        "hint": "OODAループの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "continual-improvement",
    "name": "継続的改善",
    "reading": "Continual Improvement",
    "category": "サービス管理",
    "definition": "パフォーマンスを向上させるために繰り返し行う活動です。一度の改善で終わらず測定・評価などを次の改善につなげます。",
    "example": "毎月の障害傾向を分析し、対策の効果を確認して次の改善を行います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "パフォーマンス向上のために繰り返す活動",
        "hint": "継続的改善の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "degressive-charging",
    "name": "逓減課金方式",
    "reading": "Degressive Charging",
    "category": "サービス管理",
    "definition": "利用量が増えるほど追加利用分などの単価を下げる課金方式です。料金総額は増えても増え方が緩やかになります。",
    "example": "大量に利用する部分へ低い従量単価を適用します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用量が増えるほど追加利用分などの単価を下げる",
        "hint": "逓減課金方式の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "下がるのは追加利用分などの単価であり、利用料金の総額が減るという意味ではありません。"
    ]
  },
  {
    "id": "progressive-charging",
    "name": "逓増課金方式",
    "reading": "Progressive Charging",
    "category": "サービス管理",
    "definition": "利用量が増えるほど追加利用分などの単価を上げる課金方式です。",
    "example": "一定量を超えた利用分へ高い従量単価を適用します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用量が増えるほど追加利用分などの単価を上げる",
        "hint": "逓増課金方式の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "unit-price",
    "name": "単価",
    "reading": "Unit Price",
    "category": "サービス管理",
    "definition": "商品やサービスの単位量当たりの価格です。単価と利用量などから総額を求めます。",
    "example": "1Gバイト当たりの料金にデータ量を掛けて料金を計算します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "単位量当たりの価格",
        "hint": "単価の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "usage-charge",
    "name": "利用料金",
    "reading": "Usage Charge",
    "category": "サービス管理",
    "definition": "サービスや資源を利用する対価として支払う金額です。従量制では利用量と単価などから決まります。",
    "example": "利用した時間やデータ量に応じて月額の総料金を計算します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "サービスや資源の利用に対して支払う金額",
        "hint": "利用料金の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "permutation",
    "name": "順列",
    "reading": "Permutation",
    "category": "基礎理論",
    "definition": "複数の要素から、選んだ要素の並ぶ順序を区別して数える並べ方です。重複の可否により数え方が変わります。",
    "example": "異なるM個から重複なくn個を並べる数はM!/(M−n)!です。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "選んだ要素の順序を区別する並べ方",
        "hint": "順列の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "combination",
    "name": "組合せ",
    "reading": "Combination",
    "category": "基礎理論",
    "definition": "複数の要素から、選んだ要素の順序を区別せずに数える選び方です。",
    "example": "異なるM個から重複なくn個を選ぶ数はM!/(n!(M−n)!)です。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "選んだ要素の順序を区別しない選び方",
        "hint": "組合せの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "combination-with-repetition",
    "name": "重複組合せ",
    "reading": "Combination With Repetition",
    "category": "基礎理論",
    "definition": "同じ要素を繰り返し選ぶことを許し、選ぶ順序を区別しない組合せです。",
    "example": "M種類から合計n個を選ぶ数は(M+n−1)!/(n!(M−1)!)です。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "重複を許して順序を区別せずに選ぶ",
        "hint": "重複組合せの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "icmp",
    "name": "ICMP",
    "reading": "Internet Control Message Protocol",
    "category": "ネットワーク",
    "definition": "IP通信のエラーや制御情報を通知するプロトコルです。エコー要求・応答による到達性の確認にも使います。",
    "example": "ルータが時間切れや宛先への到達不能を送信元へ通知します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "IP通信のエラーや制御情報を通知する",
        "hint": "ICMPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ipv4",
    "name": "IPv4",
    "reading": "Internet Protocol version 4",
    "category": "ネットワーク",
    "definition": "32ビットのIPアドレスを使うインターネットプロトコルです。通常アドレスを8ビットずつの四つの十進数で表します。",
    "example": "192.0.2.1というアドレスを端末へ設定します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "32ビットのアドレスでIPパケットを配送する",
        "hint": "IPv4の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "udp",
    "name": "UDP",
    "reading": "User Datagram Protocol",
    "category": "ネットワーク",
    "definition": "コネクション確立や再送制御を行わず、ポート番号を用いてデータグラムを送受信するトランスポート層のプロトコルです。",
    "example": "遅延を抑えたい通信で、必要な損失対策をアプリケーション側に実装します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "接続確立や再送を行わないデータグラム通信",
        "hint": "UDPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "tcp",
    "name": "TCP",
    "reading": "Transmission Control Protocol",
    "category": "ネットワーク",
    "definition": "コネクションを確立し、再送や順序制御、フロー制御などによって信頼性のあるバイト列の通信を提供するプロトコルです。",
    "example": "Web通信のデータを欠落や順序の乱れから回復して受信します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "再送や順序制御で信頼性のあるバイト列を届ける",
        "hint": "TCPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "txt-record",
    "name": "TXTレコード",
    "reading": "Text record",
    "category": "ネットワーク",
    "definition": "DNSに文字列情報を公開するためのリソースレコードです。SPFやDKIMの公開情報などにも使います。",
    "example": "ドメインの送信許可方針をSPFの文字列として登録します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "DNSで文字列情報を公開するレコード",
        "hint": "TXTレコードの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "pgp",
    "name": "PGP",
    "reading": "Pretty Good Privacy",
    "category": "ネットワーク",
    "definition": "公開鍵暗号と共通鍵暗号などを組み合わせ、電子メールやファイルの暗号化・署名を行う仕組みです。",
    "example": "受信者の公開鍵を使ってメールの暗号鍵を保護します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "メールやファイルの暗号化とデジタル署名を行う",
        "hint": "PGPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "smtp-over-tls",
    "name": "SMTP over TLS",
    "reading": "Simple Mail Transfer Protocol over Transport Layer Security",
    "category": "ネットワーク",
    "definition": "SMTPの通信路をTLSで暗号化し、メール転送や投稿時の盗聴・改ざんを防ぐ方式です。",
    "example": "メールサーバ同士の接続でTLSを使い通信を保護します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "SMTPの通信路をTLSで保護する",
        "hint": "SMTP over TLSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "通信路単位の保護であり、PGPやS/MIMEのような利用者間のメール本文の保護とは異なります。"
    ]
  },
  {
    "id": "privacy-separator",
    "name": "プライバシーセパレータ",
    "aliases": [
      "アクセスポイントアイソレーション"
    ],
    "reading": "Privacy Separator",
    "category": "ネットワーク",
    "definition": "同じアクセスポイントに接続する無線端末同士の直接通信を禁止する機能です。",
    "example": "公衆無線LANの利用者が別の利用者のPCへ直接アクセスすることを抑えます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "同じAPに接続した無線端末間の通信を禁止する",
        "hint": "プライバシーセパレータの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ssid",
    "name": "SSID",
    "reading": "Service Set Identifier",
    "category": "ネットワーク",
    "definition": "無線LANのネットワークを識別するための識別子です。秘密の暗号鍵ではありません。",
    "example": "端末のWi-Fi設定で接続するネットワークのSSIDを選びます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "無線LANのネットワークを識別する",
        "hint": "SSIDの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "mac-filtering",
    "name": "MACアドレスフィルタリング",
    "reading": "Media Access Control address filtering",
    "category": "ネットワーク",
    "definition": "端末のMACアドレスに基づいて通信や接続を許可・拒否する機能です。MACアドレスは偽装され得るため強い認証の代わりにはなりません。",
    "example": "登録された端末のMACアドレスだけ接続を許可します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "MACアドレスを基に接続や通信を制限する",
        "hint": "MACアドレスフィルタリングの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "neighbor-discovery",
    "name": "近隣探索",
    "reading": "Neighbor Discovery",
    "category": "ネットワーク",
    "definition": "IPv6で同一リンク上のルータや近隣ノードの発見、アドレス解決などを行う仕組みです。ICMPv6を使います。",
    "example": "宛先IPv6アドレスに対応するリンク層アドレスを問い合わせます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ICMPv6で近隣ノードやリンク層アドレスを発見する",
        "hint": "近隣探索の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "private-address",
    "name": "プライベートアドレス",
    "reading": "Private Address",
    "category": "ネットワーク",
    "definition": "組織内などのネットワークで使うために予約されたIPアドレスです。インターネット上の公的な到達先としては使いません。",
    "example": "IPv4の192.168.0.0/16を社内LANへ割り当てます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "閉じたネットワークで使うために予約されたアドレス",
        "hint": "プライベートアドレスの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "class-d",
    "name": "クラスD",
    "reading": "Class D",
    "category": "ネットワーク",
    "definition": "IPv4の旧来のクラス分けで、224.0.0.0から239.255.255.255までのマルチキャスト用アドレスの範囲です。",
    "example": "239.0.1.1を受信者グループの宛先として使います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "IPv4のマルチキャスト用アドレスの範囲",
        "hint": "クラスDの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "vrrp",
    "name": "VRRP",
    "reading": "Virtual Router Redundancy Protocol",
    "category": "ネットワーク",
    "definition": "複数のルータで仮想ルータを構成し、障害時にゲートウェイ機能を引き継ぐためのプロトコルです。",
    "example": "端末のゲートウェイ設定を変えずに稼働中のルータを切り替えます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "仮想ルータでデフォルトゲートウェイを冗長化する",
        "hint": "VRRPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "default-gateway",
    "name": "デフォルトゲートウェイ",
    "reading": "Default Gateway",
    "category": "ネットワーク",
    "definition": "特定の経路がない宛先へパケットを送るときに使う、既定の転送先となるルータです。",
    "example": "LAN外の宛先へ向かうパケットを指定したルータへ渡します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "明示的な経路がない宛先への既定の転送先",
        "hint": "デフォルトゲートウェイの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rstp",
    "name": "RSTP",
    "reading": "Rapid Spanning Tree Protocol",
    "category": "ネットワーク",
    "definition": "スパニングツリープロトコルを改良し、L2ネットワークのループ防止と障害後の素早い経路切替えを行うプロトコルです。",
    "example": "冗長スイッチのリンク障害時に代替経路へ収束します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "L2のループを防ぎSTPより速い収束を図る",
        "hint": "RSTPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "rarp",
    "name": "RARP",
    "reading": "Reverse Address Resolution Protocol",
    "category": "ネットワーク",
    "definition": "MACアドレスなどの情報から、自分のIPv4アドレスをサーバへ問い合わせるための旧来のプロトコルです。",
    "example": "ディスクを持たない端末が起動時に自分のIPアドレスを得ます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "自端末のIPv4アドレスをMACアドレスなどから取得する",
        "hint": "RARPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "isp",
    "name": "ISP",
    "reading": "Internet Service Provider",
    "category": "ネットワーク",
    "definition": "利用者へインターネットへの接続サービスを提供する事業者です。",
    "example": "自宅の回線をインターネットへ接続し、割り当てるIPアドレスなどを管理します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "インターネット接続サービスを提供する事業者",
        "hint": "ISPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "https",
    "name": "HTTPS",
    "reading": "Hypertext Transfer Protocol Secure",
    "category": "ネットワーク",
    "definition": "HTTPの通信をTLSで保護する方式です。サーバの認証、通信内容の暗号化や改ざん検知を提供します。",
    "example": "ブラウザでhttpsから始まるURLへ接続します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "HTTP通信をTLSで保護する",
        "hint": "HTTPSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "imaps",
    "name": "IMAPS",
    "reading": "Internet Message Access Protocol over Transport Layer Security",
    "category": "ネットワーク",
    "definition": "メールボックスへアクセスするIMAPの通信をTLSで保護する方式です。認証情報やメール本文などを暗号化します。",
    "example": "スマートフォンがメールサーバ上の受信箱を安全に参照します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "IMAPの通信全体をTLSで保護する",
        "hint": "IMAPSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "APOPは認証方式であり、メール本文まで暗号化するものではありません。"
    ]
  },
  {
    "id": "apop",
    "name": "APOP",
    "reading": "Authenticated Post Office Protocol",
    "category": "ネットワーク",
    "definition": "POP3で平文パスワードをそのまま送らず、チャレンジに応じた値で認証する旧来の方式です。通信全体を暗号化するものではありません。",
    "example": "サーバのチャレンジと秘密から認証用のダイジェストを計算します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "POPの認証で平文パスワードの直接送信を避ける",
        "hint": "APOPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "pop3",
    "name": "POP3",
    "reading": "Post Office Protocol version 3",
    "category": "ネットワーク",
    "definition": "メールサーバのメールボックスから電子メールを取り出すためのプロトコルです。暗号化にはTLSなどが別途必要です。",
    "example": "メールクライアントがサーバのメールをダウンロードします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "メールボックスからメールを取り出す",
        "hint": "POP3の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sntp",
    "name": "SNTP",
    "reading": "Simple Network Time Protocol",
    "category": "ネットワーク",
    "definition": "NTPの仕組みを簡易な形で利用してネットワーク越しに時刻を同期するためのプロトコルです。",
    "example": "端末が時刻サーバへ問い合わせて時計を合わせます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "簡易なNTPで時刻を同期する",
        "hint": "SNTPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ntp",
    "name": "NTP",
    "reading": "Network Time Protocol",
    "category": "ネットワーク",
    "definition": "ネットワーク上の時刻サーバと情報を交換し、通信遅延などを考慮して時計を同期するプロトコルです。",
    "example": "複数の時刻源を使ってサーバ群の時刻を合わせます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ネットワーク越しに時計を同期する",
        "hint": "NTPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "nntp",
    "name": "NNTP",
    "reading": "Network News Transfer Protocol",
    "category": "ネットワーク",
    "definition": "ネットニュースの記事をサーバ間で配送したり、クライアントが取得・投稿したりするためのプロトコルです。",
    "example": "ニュースグループの記事を別のニュースサーバへ転送します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ネットニュースの記事を配送・取得する",
        "hint": "NNTPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "tftp",
    "name": "TFTP",
    "reading": "Trivial File Transfer Protocol",
    "category": "ネットワーク",
    "definition": "UDPを使う簡易なファイル転送プロトコルです。FTPのような利用者認証の機能は持ちません。",
    "example": "ネットワーク機器の起動用ファイルを転送します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "UDPを使う簡易なファイル転送",
        "hint": "TFTPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "igmp",
    "name": "IGMP",
    "reading": "Internet Group Management Protocol",
    "category": "ネットワーク",
    "definition": "IPv4で、端末と近隣ルータとの間でマルチキャストグループへの参加情報などを交換するプロトコルです。",
    "example": "ルータへ受信したいマルチキャストグループを知らせます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "IPv4のマルチキャストグループ参加を管理する",
        "hint": "IGMPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sip",
    "name": "SIP",
    "reading": "Session Initiation Protocol",
    "category": "ネットワーク",
    "definition": "音声通話などのセッションを確立・変更・終了するための制御用プロトコルです。",
    "example": "IP電話で相手を呼び出して通話セッションを開始します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "通話などのセッションを確立・制御する",
        "hint": "SIPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ldap",
    "name": "LDAP",
    "reading": "Lightweight Directory Access Protocol",
    "category": "ネットワーク",
    "definition": "利用者や組織、機器などを階層的に管理するディレクトリへアクセスするためのプロトコルです。",
    "example": "社内のディレクトリから利用者の属性を検索します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ディレクトリ情報を検索・更新する",
        "hint": "LDAPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "dmz",
    "name": "DMZ",
    "reading": "Demilitarized zone",
    "category": "ネットワーク",
    "definition": "内部ネットワークとインターネットの間などに設ける、公開サーバ用の隔離されたネットワーク領域です。",
    "example": "公開WebサーバをDMZへ置き、内部DBへの通信をFWで制限します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "公開サーバなどを内部ネットワークから隔離する領域",
        "hint": "DMZの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "pptp",
    "name": "PPTP",
    "reading": "Point-to-Point Tunneling Protocol",
    "category": "ネットワーク",
    "definition": "PPPのフレームをIPネットワークでトンネル転送するための旧来のプロトコルです。",
    "example": "離れた拠点間でPPP接続の内容を運びます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "PPPフレームをトンネル転送する",
        "hint": "PPTPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "network-address",
    "name": "ネットワークアドレス",
    "reading": "Network Address",
    "category": "ネットワーク",
    "definition": "IPアドレスのネットワーク部を示し、IPv4の通常のサブネットではホスト部を全て0にした値です。",
    "example": "192.168.10.0/24では192.168.10.0がネットワークを表します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ホスト部を0にしてネットワーク自体を表すアドレス",
        "hint": "ネットワークアドレスの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "broadcast-address",
    "name": "ブロードキャストアドレス",
    "reading": "Broadcast Address",
    "category": "ネットワーク",
    "definition": "同じ範囲の全端末へ送るための宛先アドレスです。IPv4のサブネットでは通常ホスト部を全て1にします。",
    "example": "192.168.10.0/24の全端末へ192.168.10.255を宛先として送ります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "範囲内の全端末へ送る宛先アドレス",
        "hint": "ブロードキャストアドレスの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "host-part",
    "name": "ホスト部",
    "reading": "Host Part",
    "category": "ネットワーク",
    "definition": "IPアドレスのうち、同じネットワーク内のホストを区別するために使う部分です。境界はプレフィックス長などで決まります。",
    "example": "/26のIPv4ネットワークでは下位6ビットがホスト部です。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "同じネットワーク内のホストを識別する部分",
        "hint": "ホスト部の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "loopback",
    "name": "ループバック",
    "reading": "Loopback",
    "category": "ネットワーク",
    "definition": "通信を自分自身へ戻し、同じ端末内のサービスへのアクセスや試験などに使う仕組みです。",
    "example": "IPv4の127.0.0.1で自分のWebサーバに接続します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "自分自身へ通信を戻す",
        "hint": "ループバックの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "wpa3-enterprise",
    "name": "WPA3-Enterprise",
    "reading": "Wi-Fi Protected Access 3 Enterprise",
    "category": "ネットワーク",
    "definition": "IEEE 802.1Xの認証基盤を用いる、組織向けのWPA3のセキュリティ方式です。利用者ごとの認証と動的な鍵の確立を行います。",
    "example": "社員ごとの認証情報で無線LANへ接続します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "802.1Xの利用者認証と動的な鍵で無線LANを保護する",
        "hint": "WPA3-Enterpriseの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "transmission-efficiency",
    "name": "伝送効率",
    "reading": "Transmission Efficiency",
    "category": "ネットワーク",
    "definition": "回線の理論上の伝送能力に対し、有効なデータの転送に使える割合です。制御情報や待ち時間などの影響を反映します。",
    "example": "1Gビット/秒で効率50％なら有効速度を500Mビット/秒と見積もります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "理論上の伝送能力のうち有効転送に使える割合",
        "hint": "伝送効率の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "designated-port",
    "name": "代表ポート",
    "reading": "Designated Port",
    "category": "ネットワーク",
    "definition": "STPで、各セグメントからルートブリッジへ最良の経路を提供する側のポートです。",
    "example": "リンク両端のルートまでのコストを比較して選びます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "セグメントからルートへの最良経路を提供するポート",
        "hint": "代表ポートの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "root-port",
    "name": "ルートポート",
    "reading": "Root Port",
    "category": "ネットワーク",
    "definition": "STPで、各非ルートブリッジがルートブリッジへ向かう最良経路として選ぶポートです。",
    "example": "非ルートのスイッチが最小コストでルートに到達する上流ポートを選びます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "非ルートブリッジからルートへ向かう最良経路のポート",
        "hint": "ルートポートの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "root-bridge",
    "name": "ルートブリッジ",
    "reading": "Root Bridge",
    "category": "ネットワーク",
    "definition": "STPで、ループのない木構造を計算する基準として選出されるブリッジです。",
    "example": "全てのスイッチがこのブリッジまでの経路コストを計算します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "STPの木構造の基準となるブリッジ",
        "hint": "ルートブリッジの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "directed-broadcast",
    "name": "ディレクテッドブロードキャスト",
    "reading": "Directed Broadcast",
    "category": "ネットワーク",
    "definition": "特定のIPv4ネットワークを宛先とするブロードキャストです。宛先ネットワークのホスト部を全て1にして表します。",
    "example": "192.168.10.255を192.168.10.0/24への一斉送信に使います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "特定のIPv4ネットワークを指定するブロードキャスト",
        "hint": "ディレクテッドブロードキャストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "limited-broadcast",
    "name": "リミテッドブロードキャスト",
    "reading": "Limited Broadcast",
    "category": "ネットワーク",
    "definition": "255.255.255.255を宛先にする、同一リンク内に限定されたIPv4ブロードキャストです。ルータは通常中継しません。",
    "example": "自分のネットワーク情報が未確定の端末がローカルへ送信します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "255.255.255.255でローカルに限定して送る",
        "hint": "リミテッドブロードキャストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "icmp-redirect",
    "name": "Redirect",
    "reading": "Redirect",
    "category": "ネットワーク",
    "definition": "ICMPで、送信元へより適切な次の転送先を知らせ、経路の変更を促すメッセージです。",
    "example": "同じLAN上の別ルータへ直接送る方がよいことを通知します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ICMPでより適切な経路を送信元へ通知する",
        "hint": "Redirectの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "icmp-time-exceeded",
    "name": "Time Exceeded",
    "reading": "Time Exceeded",
    "category": "ネットワーク",
    "definition": "IPパケットのTTLの超過や再組立ての時間切れなどを送信元へ通知するICMPメッセージです。",
    "example": "途中のルータでTTLが0になり、送信元へ時間切れを返します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "TTL超過や再組立ての時間切れを通知する",
        "hint": "Time Exceededの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ttl",
    "name": "TTL",
    "reading": "Time To Live",
    "category": "ネットワーク",
    "definition": "IPv4パケットがネットワーク内で無限に循環することを防ぐ値です。ルータで減らされ、0になったパケットは破棄されます。",
    "example": "転送のたびにTTLを減らしてループするパケットを止めます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "転送ごとに減らしてパケットの無限循環を防ぐ",
        "hint": "TTLの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "network-tap",
    "name": "ネットワークタップ",
    "reading": "Network Tap",
    "category": "ネットワーク",
    "definition": "通信回線の信号などを分岐し、監視装置へトラフィックを取り出すための装置です。",
    "example": "光回線の信号を光学的に分岐してセキュリティ監視へ渡します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "回線の信号を分岐して監視用に取り出す",
        "hint": "ネットワークタップの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "wavelength-division-multiplexing",
    "name": "波長分割多重",
    "reading": "Wavelength Division Multiplexing",
    "category": "ネットワーク",
    "definition": "波長の異なる複数の光信号を、1本の光ファイバに重ねて伝送する技術です。",
    "example": "複数の通信回線を異なる波長へ割り当ててまとめます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "異なる波長の光を一つの光ファイバで伝送する",
        "hint": "波長分割多重の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "layer2-switch",
    "name": "レイヤー2スイッチ",
    "reading": "Layer2 Switch",
    "category": "ネットワーク",
    "definition": "データリンク層で、学習したMACアドレスとポートの対応に基づきフレームを転送する装置です。",
    "example": "宛先MACアドレスを見て必要なポートへだけ送ります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "MACアドレスに基づいてフレームを転送する",
        "hint": "レイヤー2スイッチの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cache-control",
    "name": "Cache-Control",
    "reading": "Cache-Control",
    "category": "ネットワーク",
    "definition": "HTTPのキャッシュに保存や再利用の条件を伝えるヘッダーフィールドです。",
    "example": "機密情報の応答にno-storeを指定します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "HTTPキャッシュの保存や再利用を制御する",
        "hint": "Cache-Controlの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cache-no-store",
    "name": "no-store",
    "reading": "no-store",
    "category": "ネットワーク",
    "definition": "HTTPのCache-Controlで、要求や応答をキャッシュに保存しないよう指示するディレクティブです。",
    "example": "個人情報の応答をブラウザや共有キャッシュへ保存させません。",
    "related": [
      "cache-control",
      "cache-no-cache"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "HTTPの要求や応答をキャッシュへ保存させない",
        "hint": "no-storeの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cache-no-cache",
    "name": "no-cache",
    "reading": "no-cache",
    "category": "ネットワーク",
    "definition": "HTTPのCache-Controlで、保存した応答を再利用する前に元サーバで検証するよう要求するディレクティブです。保存自体の禁止ではありません。",
    "example": "キャッシュを使う前に条件付き要求で有効性を確認します。",
    "related": [
      "cache-control",
      "cache-no-store"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "保存済み応答の再利用前に検証を要求する",
        "hint": "no-cacheの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "キャッシュへの保存を禁止する指定ではありません。保存禁止はno-storeです。"
    ]
  },
  {
    "id": "shared-cache",
    "name": "共有キャッシュ",
    "reading": "Shared Cache",
    "category": "ネットワーク",
    "definition": "複数の利用者のために応答などを保存・再利用するキャッシュです。HTTPではプロキシなどが該当します。",
    "example": "社内プロキシが同じ公開コンテンツを複数人へ配信します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "複数の利用者で応答を保存・再利用するキャッシュ",
        "hint": "共有キャッシュの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "unicast",
    "name": "ユニキャスト",
    "reading": "Unicast",
    "category": "ネットワーク",
    "definition": "一つの送信先を指定してデータを送る通信方式です。",
    "example": "特定の端末のIPアドレスを宛先に通信します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "一つの宛先を指定して送信する",
        "hint": "ユニキャストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "broadcast",
    "name": "ブロードキャスト",
    "reading": "Broadcast",
    "category": "ネットワーク",
    "definition": "同じネットワークなどの範囲にある全ての端末へデータを送る通信方式です。",
    "example": "同じLANへARP要求を一斉送信します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "対象範囲の全端末へ送信する",
        "hint": "ブロードキャストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "aaa",
    "name": "AAA",
    "reading": "Authentication / Authorization / Accounting",
    "category": "セキュリティ",
    "definition": "認証・認可・アカウンティングをまとめた、ネットワークの利用を管理する枠組みです。RADIUSやDiameterなどで扱います。",
    "example": "利用者の身元、利用を許すサービス、接続時間の記録を一つの認証基盤で管理します。",
    "related": [
      "authentication",
      "authorization",
      "accounting",
      "radius",
      "diameter"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "認証・認可・アカウンティングの三つから成る",
        "hint": "AAAの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "三つ目のAはAuditではなくAccountingです。"
    ]
  },
  {
    "id": "diameter",
    "name": "Diameter",
    "reading": "Diameter",
    "category": "セキュリティ",
    "definition": "認証、認可、アカウンティングを扱うプロトコルです。RADIUSを発展させ、信頼性のある転送や拡張性などを備えます。",
    "example": "通信事業者のネットワークで加入者のサービス利用を管理します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "AAAを提供しRADIUSを発展させたプロトコル",
        "hint": "Diameterの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "accounting",
    "name": "アカウンティング",
    "reading": "Accounting",
    "category": "セキュリティ",
    "definition": "利用者がシステムやネットワークをいつどれだけ使ったかなどの利用記録を収集・管理することです。",
    "example": "無線LANの接続開始・終了時刻や通信量を記録します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用状況を記録し管理する",
        "hint": "アカウンティングの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "adversarial-examples",
    "name": "Adversarial Examples",
    "reading": "Adversarial Examples",
    "category": "セキュリティ",
    "definition": "学習済みモデルに誤った判断をさせるよう、微小な摂動などを加えた入力です。敵対的サンプルとも呼びます。",
    "example": "人には同じ標識に見える画像へノイズを加え、画像認識モデルの分類を変えます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "入力の微小な変化などでモデルを誤認識させる",
        "hint": "Adversarial Examplesの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "入力を改変して誤認識させる攻撃であり、学習データを推定するModel Inversionとは異なります。"
    ]
  },
  {
    "id": "cvss",
    "name": "CVSS",
    "reading": "Common Vulnerability Scoring System",
    "category": "セキュリティ",
    "definition": "脆弱性の深刻度を共通の指標と計算方法で評価する仕組みです。環境や脅威の状況と併せて対応の優先度を判断します。",
    "example": "遠隔から認証なしで悪用できる脆弱性のスコアを確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "脆弱性の深刻度を共通の尺度で評価する",
        "hint": "CVSSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "CWEは弱点の種類、CVSSは脆弱性の深刻度です。"
    ]
  },
  {
    "id": "stix",
    "name": "STIX",
    "reading": "Structured Threat Information Expression",
    "category": "セキュリティ",
    "definition": "サイバー脅威に関する情報を構造化して表現するための仕様です。攻撃手法や侵害指標などの関係も記述できます。",
    "example": "悪性IPアドレスと攻撃キャンペーンの関係を機械処理できる形で共有します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "サイバー脅威情報を構造化して記述する仕様",
        "hint": "STIXの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "情報をどう記述するかがSTIXで、どう交換するかがTAXIIです。"
    ]
  },
  {
    "id": "taxii",
    "name": "TAXII",
    "reading": "Trusted Automated Exchange of Intelligence Information",
    "category": "セキュリティ",
    "definition": "STIXなどで表現したサイバー脅威情報を交換するためのアプリケーション層のプロトコルです。",
    "example": "組織間で脅威情報のコレクションを取得し、検知ルールの更新に使います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "構造化された脅威情報を交換するプロトコル",
        "hint": "TAXIIの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "STIXのような表現形式自体ではなく、脅威情報を交換するためのプロトコルです。"
    ]
  },
  {
    "id": "ntp-reflection",
    "name": "NTPリフレクション攻撃",
    "reading": "Network Time Protocol reflection attack",
    "category": "セキュリティ",
    "definition": "送信元を標的のIPアドレスに偽装した要求をNTPサーバへ送り、その応答を標的へ集中させる攻撃です。大きな応答で通信量を増幅する場合があります。",
    "example": "小さなNTP要求に対する大きな応答を、多数のサーバから標的へ送らせます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "NTPの応答を標的へ反射・増幅させる",
        "hint": "NTPリフレクション攻撃の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "smurf",
    "name": "Smurf攻撃",
    "reading": "Smurf",
    "category": "セキュリティ",
    "definition": "標的のIPアドレスを送信元とするICMPエコー要求をブロードキャストし、多数の応答を標的へ集中させる攻撃です。",
    "example": "同じネットワーク内の複数端末から標的へエコー応答を送らせます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "偽装したICMP要求への多数の応答で標的を妨害する",
        "hint": "Smurf攻撃の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "passkey",
    "name": "パスキー",
    "reading": "Passkey",
    "category": "セキュリティ",
    "definition": "FIDOの仕組みを用いた公開鍵暗号方式の認証資格情報です。対応するサービスにだけ使える鍵で認証し、パスワードをサーバと共有しません。",
    "example": "端末の生体認証で秘密鍵の使用を許可し、サーバのチャレンジに署名してログインします。",
    "related": [
      "fido",
      "biometrics"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "サービスに結び付いた公開鍵の認証資格情報",
        "hint": "パスキーの目的や仕組みを説明できますか？"
      },
      {
        "id": "local-verification",
        "title": "生体情報を使う場合も認証器内で照合する",
        "hint": "生体情報そのものはサーバへ送りますか？",
        "level": "deep"
      }
    ],
    "commonMistakes": [
      "生体情報そのものをIdPやWebサーバへ送信して照合する方式ではありません。"
    ]
  },
  {
    "id": "fido",
    "name": "FIDO",
    "reading": "Fast IDentity Online",
    "category": "セキュリティ",
    "definition": "パスワードへの依存を減らすため、認証器内の秘密鍵とサービス側の公開鍵を使って認証する仕様群です。",
    "example": "指紋で端末の鍵を使用可能にし、署名した応答をサーバで検証します。",
    "related": [
      "passkey",
      "public-key",
      "private-key"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "認証器の秘密鍵とサーバの公開鍵で認証する",
        "hint": "FIDOの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "利用者確認に使う生体情報そのものは、通常は認証器の外へ送りません。"
    ]
  },
  {
    "id": "proxy-authentication-sso",
    "name": "代理認証方式",
    "reading": "Proxy authentication single sign-on",
    "category": "セキュリティ",
    "definition": "シングルサインオンで、利用者に代わって対象システムのログイン画面へ認証情報を入力する方式です。",
    "example": "端末のソフトウェアが業務アプリのログイン画面を検出してIDとパスワードを入力します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用者に代わってログイン画面へ認証情報を入力する",
        "hint": "代理認証方式の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "soar",
    "name": "SOAR",
    "reading": "Security Orchestration, Automation and Response",
    "category": "セキュリティ",
    "definition": "複数のセキュリティツールを連携し、調査や対応のワークフローを自動化・効率化する技術です。",
    "example": "SIEMの通知を受けて関連情報を収集し、承認後に端末を隔離します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ツールの連携と対応手順の自動化で運用を効率化する",
        "hint": "SOARの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "ログの集約・相関分析を中心に行うSIEMと、対応手順を連携・自動化するSOARを区別します。"
    ]
  },
  {
    "id": "waf",
    "name": "WAF",
    "reading": "Web Application Firewall",
    "category": "セキュリティ",
    "definition": "WebアプリケーションへのHTTP通信を検査し、SQLインジェクションやXSSなどの攻撃を検出・遮断する仕組みです。",
    "example": "公開Webサイトの前段で不正な入力を含むリクエストを遮断します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "HTTP通信を検査してWebアプリケーションへの攻撃を防ぐ",
        "hint": "WAFの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "false-positive",
    "name": "フォールスポジティブ",
    "reading": "False Positive",
    "category": "セキュリティ",
    "definition": "正常なものを誤って異常や攻撃として検知することです。誤検知とも呼びます。",
    "example": "WAFが正当な数式入力を攻撃と判断して遮断します。",
    "related": [
      "false-negative",
      "waf"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "正常なものを攻撃・異常と誤判定する",
        "hint": "フォールスポジティブの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "攻撃の見逃しはフォールスネガティブで、正常通信の誤検知とは逆です。"
    ]
  },
  {
    "id": "false-negative",
    "name": "フォールスネガティブ",
    "reading": "False Negative",
    "category": "セキュリティ",
    "definition": "実際には異常や攻撃であるものを、正常として見逃すことです。",
    "example": "不正なSQLを含むリクエストがWAFを通過します。",
    "related": [
      "false-positive",
      "waf"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "実際の攻撃・異常を見逃す",
        "hint": "フォールスネガティブの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "正常な通信を遮断する誤検知とは逆です。"
    ]
  },
  {
    "id": "inline-mode",
    "name": "インラインモード",
    "reading": "Inline Mode",
    "category": "セキュリティ",
    "definition": "監視・防御装置を通信経路に直列に配置し、通信を装置へ通過させる動作形態です。",
    "example": "IPSが全パケットを検査し、不正な通信をその場で遮断します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "通信を通過させる経路上に装置を配置する",
        "hint": "インラインモードの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "ミラーポートなどで経路外からコピーを受ける配置ではありません。"
    ]
  },
  {
    "id": "anomaly-detection",
    "name": "アノマリ型",
    "reading": "Anomaly Detection",
    "category": "セキュリティ",
    "definition": "通常の振る舞いを基準として、そこから外れたものを異常として検出する方式です。",
    "example": "普段と大きく異なる通信量や接続先への変化を検知します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "正常時の基準からの逸脱で異常を検出する",
        "hint": "アノマリ型の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "既知の攻撃パターンへの一致を見るシグネチャ型とは異なります。"
    ]
  },
  {
    "id": "signature-detection",
    "name": "シグネチャ型",
    "reading": "Signature Detection",
    "category": "セキュリティ",
    "definition": "既知の攻撃などの特徴を定義し、そのパターンに一致するものを検出する方式です。",
    "example": "攻撃リクエストに特徴的な文字列や通信パターンを照合します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "既知の攻撃パターンへの一致で検出する",
        "hint": "シグネチャ型の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "正常時からの逸脱で判定するアノマリ型とは異なります。"
    ]
  },
  {
    "id": "clickjacking",
    "name": "クリックジャッキング",
    "reading": "Clickjacking",
    "category": "セキュリティ",
    "definition": "透明なフレームなどで画面を重ね、利用者に見えている操作とは異なる操作を行わせる攻撃です。",
    "example": "無害なボタンの上に設定変更のボタンを透明に重ねます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "画面を重ねて意図しないクリック操作を誘導する",
        "hint": "クリックジャッキングの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "cookieのHttpOnlyやSecure、HTTPSを強制するHSTSだけではフレームの埋込みを防げません。"
    ]
  },
  {
    "id": "x-frame-options",
    "name": "X-Frame-Options",
    "reading": "X-Frame-Options",
    "category": "セキュリティ",
    "definition": "Webページをフレームへ埋め込めるかをブラウザへ伝えるHTTPレスポンスヘッダーです。クリックジャッキング対策に使います。",
    "example": "DENYを指定してページをフレーム内へ表示させません。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "フレームへの埋込みを制限するHTTPヘッダー",
        "hint": "X-Frame-Optionsの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "httponly-cookie",
    "name": "HttpOnly属性",
    "reading": "Httponly Cookie",
    "category": "セキュリティ",
    "definition": "JavaScriptなどからcookieを読み書きできないようにする属性です。XSSでcookieの値が盗まれる影響を抑えます。",
    "example": "セッションcookieへHttpOnlyを付け、document.cookieから読めなくします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "スクリプトからのcookieアクセスを制限する",
        "hint": "HttpOnly属性の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "secure-cookie",
    "name": "Secure属性",
    "reading": "Secure Cookie",
    "category": "セキュリティ",
    "definition": "cookieをHTTPSなどの安全な通信でのみ送信するように指定する属性です。",
    "example": "セッションcookieが暗号化されていないHTTPへ送られないようにします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "cookieの送信を安全な通信に限定する",
        "hint": "Secure属性の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "hsts",
    "name": "HSTS",
    "reading": "Hypertext Transfer Protocol Strict Transport Security",
    "category": "セキュリティ",
    "definition": "ブラウザに一定期間そのホストへHTTPSでのみ接続するよう要求する仕組みです。Strict-Transport-Securityヘッダーなどで設定します。",
    "example": "HTTPのURLを開いてもブラウザが送信前にHTTPSへ変更します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "指定期間ホストへの接続をHTTPSに限定する",
        "hint": "HSTSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "クリックジャッキング対策のフレーム制限や、EV証明書の表示を制御する仕組みではありません。"
    ]
  },
  {
    "id": "dtls",
    "name": "DTLS",
    "reading": "Datagram Transport Layer Security",
    "category": "セキュリティ",
    "definition": "TLSの保護をUDPなどのデータグラム通信に適用するプロトコルです。暗号化や改ざん検知を行い、損失や順序の変化を考慮します。",
    "example": "UDPで送るリアルタイム通信の内容を保護します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "データグラム通信に暗号化や完全性保護を提供する",
        "hint": "DTLSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "authorization-server",
    "name": "認可サーバ",
    "reading": "Authorization Server",
    "category": "セキュリティ",
    "definition": "OAuthなどで利用者の許可に基づいてクライアントへアクセストークンを発行するサーバです。",
    "example": "写真へのアクセスを利用者が許可した後、アプリにトークンを発行します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用者の許可に基づいてアクセストークンを発行する",
        "hint": "認可サーバの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "resource-owner",
    "name": "リソースオーナー",
    "reading": "Resource Owner",
    "category": "セキュリティ",
    "definition": "保護されたリソースへのアクセスを許可する権限を持つ主体です。OAuthでは利用者本人などが該当します。",
    "example": "自分の写真を編集アプリが読み出すことを許可します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "保護されたリソースへのアクセスを許可できる主体",
        "hint": "リソースオーナーの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "csrf-token",
    "name": "CSRFトークン",
    "reading": "Cross-site request forgery token",
    "category": "セキュリティ",
    "definition": "正規の画面からの要求であることをサーバが確認するため、フォームなどに含めて照合する推測困難な値です。",
    "example": "送信されたトークンをセッション側の値と照合し、不一致なら更新を拒否します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "推測困難な値の照合で要求の偽造を防ぐ",
        "hint": "CSRFトークンの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "HTMLの特殊文字の置換だけでは、利用者の権限を使った要求の偽造を防げません。"
    ]
  },
  {
    "id": "http-header-injection",
    "name": "HTTPヘッダインジェクション",
    "reading": "Hypertext Transfer Protocol header injection",
    "category": "セキュリティ",
    "definition": "外部入力に改行などを混入し、HTTP応答のヘッダーや本文の構成を不正に変える攻撃です。",
    "example": "Locationヘッダーの値に改行を混入し、別のヘッダーを追加します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "改行などでHTTPヘッダーや応答の構成を改変する",
        "hint": "HTTPヘッダインジェクションの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "session-hijacking",
    "name": "セッションハイジャック",
    "reading": "Session Hijacking",
    "category": "セキュリティ",
    "definition": "セッションIDの窃取や推測などにより、認証済み利用者のセッションを不正に利用する攻撃です。",
    "example": "盗んだcookieを使って本人として操作します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "セッションを不正に取得して利用者になりすます",
        "hint": "セッションハイジャックの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "mitb",
    "name": "MITB攻撃",
    "reading": "Man-in-the-Browser attack",
    "category": "セキュリティ",
    "definition": "ブラウザに侵入したマルウェアが、正規サイトとの通信内容や表示を改ざんする攻撃です。",
    "example": "送金先口座を送信直前に別の口座へ置き換えます。",
    "related": [
      "transaction-signing"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "侵害したブラウザ内で通信内容や表示を改ざんする",
        "hint": "MITB攻撃の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "TLSやログイン時だけのワンタイムパスワードでは、ブラウザ内の取引改ざんを防げません。"
    ]
  },
  {
    "id": "transaction-signing",
    "name": "トランザクション署名",
    "reading": "Transaction Signing",
    "category": "セキュリティ",
    "definition": "送金先や金額などの取引情報に結び付いた確認値を作り、利用者が確認した内容と受信側の内容の一致を検証する仕組みです。",
    "example": "別端末で入力した送金先と金額から確認値を生成します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "取引内容に結び付いた確認値で改ざんを検証する",
        "hint": "トランザクション署名の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "ログイン用のワンタイムパスワードとは異なり、送金先などの取引内容に結び付けます。"
    ]
  },
  {
    "id": "notice",
    "name": "NOTICE",
    "reading": "National Operation Towards IoT Clean Environment (IoT: Internet of Things)",
    "category": "セキュリティ",
    "definition": "インターネット上のIoT機器などを調査し、悪用のおそれのある機器の利用者へISPなどを通じて注意喚起する取組です。",
    "example": "推測しやすい認証情報を使う機器の利用者へ対策を促します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "悪用のおそれがあるIoT機器を調査し注意喚起する",
        "hint": "NOTICEの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "IoT機器メーカーへの情報提供だけや、申告者への無料の侵入テストの制度ではありません。"
    ]
  },
  {
    "id": "nict",
    "name": "NICT",
    "reading": "National Institute of Information and Communications Technology",
    "category": "セキュリティ",
    "definition": "情報通信分野の研究開発を行う国立研究開発法人情報通信研究機構です。IoT機器の調査やサイバー攻撃の観測などにも取り組みます。",
    "example": "NOTICEでセキュリティ上の問題がある機器を調査します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "情報通信研究を担いサイバーセキュリティにも取り組む機関",
        "hint": "NICTの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "scap",
    "name": "SCAP",
    "reading": "Security Content Automation Protocol",
    "category": "セキュリティ",
    "definition": "セキュリティ設定や脆弱性情報を標準化して表現・交換・処理し、管理や評価の自動化を支えるNISTの仕様群です。",
    "example": "機器の設定を基準と照合し、結果を共通形式で交換します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "脆弱性や設定の管理・評価を自動化するための仕様群",
        "hint": "SCAPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "SIEMのログ分析、SOARの対応自動化とは対象が異なります。"
    ]
  },
  {
    "id": "dnssec",
    "name": "DNSSEC",
    "reading": "Domain Name System Security Extensions",
    "category": "セキュリティ",
    "definition": "DNSのデータにデジタル署名を付け、検証側が作成元の正当性と改ざんの有無を確認できるようにする拡張です。",
    "example": "信頼の連鎖をたどって応答レコードの署名を検証します。",
    "related": [
      "dns",
      "digital-signature"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "DNSデータの真正性と完全性を署名で検証する",
        "hint": "DNSSECの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "データの検証であり、通信内容を暗号化する仕組みではありません。"
    ]
  },
  {
    "id": "ismap-liu",
    "name": "ISMAP-LIU",
    "reading": "Information system Security Management and Assessment Program for Low-Impact Use",
    "category": "セキュリティ",
    "definition": "ISMAPのうち、セキュリティ上のリスクの小さな業務・情報の処理に使うSaaSを対象とする仕組みです。",
    "example": "低リスクの業務向けSaaSの登録状況を調達時に確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "低リスクの業務・情報を扱うSaaSを対象とする",
        "hint": "ISMAP-LIUの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sim3",
    "name": "SIM3",
    "reading": "Security Incident Management Maturity Model",
    "category": "セキュリティ",
    "definition": "Open CSIRT Foundationが開発した、セキュリティインシデント管理の成熟度を評価するモデルです。組織、人材、ツール、プロセスを扱います。",
    "example": "CSIRTの体制や対応手順を評価して改善項目を見つけます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "セキュリティインシデント管理の成熟度を評価する",
        "hint": "SIM3の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "CMMIは開発などのプロセス、SAMMはソフトウェア保証の成熟度を扱います。"
    ]
  },
  {
    "id": "samm",
    "name": "SAMM",
    "reading": "Software Assurance Maturity Model",
    "category": "セキュリティ",
    "definition": "OWASPによる、ソフトウェア保証活動の成熟度を評価・改善するためのモデルです。",
    "example": "開発工程で実施するセキュリティ活動を評価して改善計画を立てます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ソフトウェア保証活動の成熟度を評価・改善する",
        "hint": "SAMMの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cwe",
    "name": "CWE",
    "reading": "Common Weakness Enumeration",
    "category": "セキュリティ",
    "definition": "ソフトウェアやハードウェアのセキュリティ上の弱点を種類ごとに分類した一覧です。個別の製品の脆弱性IDとは異なります。",
    "example": "SQLインジェクションという弱点の種類をCWEで確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "セキュリティ上の弱点の種類を分類する",
        "hint": "CWEの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "個別の脆弱性IDを割り当てるCVEや、深刻度を評価するCVSSとは異なります。"
    ]
  },
  {
    "id": "cpe",
    "name": "CPE",
    "reading": "Common Platform Enumeration",
    "category": "セキュリティ",
    "definition": "IT製品やプラットフォームを識別するための共通の命名体系です。",
    "example": "脆弱性が影響するOSやアプリケーションの種類とバージョンを指定します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "製品やプラットフォームを共通の名称で識別する",
        "hint": "CPEの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "shadow-it",
    "name": "シャドーIT",
    "reading": "Shadow information technology",
    "category": "セキュリティ",
    "definition": "組織の管理部門の許可や把握を経ずに、従業員などが業務でIT機器やサービスを利用することです。",
    "example": "個人契約のクラウドストレージへ業務ファイルを保存します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "組織の許可や管理を経ない業務上のIT利用",
        "hint": "シャドーITの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "enhanced-open",
    "name": "Enhanced Open",
    "reading": "Enhanced Open",
    "category": "セキュリティ",
    "definition": "パスワードなしの無線LANで、OWEを用いて接続ごとの無線区間の暗号化を行うための仕様です。接続先の認証は提供しません。",
    "example": "公衆Wi-Fiで共通パスワードを配らずに無線通信を暗号化します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "パスワードなしの無線LANで通信を暗号化する",
        "hint": "Enhanced Openの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "暗号化することと、正規のアクセスポイントだと認証することは別です。"
    ]
  },
  {
    "id": "owe",
    "name": "OWE",
    "reading": "Opportunistic Wireless Encryption",
    "category": "セキュリティ",
    "definition": "認証を行わずに鍵交換で通信の鍵を確立し、無線区間を暗号化する方式です。Enhanced Openで利用します。",
    "example": "公開Wi-Fiの接続ごとに異なる暗号化鍵を確立します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "事前共有パスワードなしで無線通信の鍵を確立する",
        "hint": "OWEの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "アクセスポイントの身元を認証する仕組みではありません。"
    ]
  },
  {
    "id": "dns-caa",
    "name": "DNS CAA",
    "reading": "Domain Name System Certification Authority Authorization",
    "category": "セキュリティ",
    "definition": "ドメインの証明書を発行してよい認証局をDNSで指定するレコードです。意図しない証明書発行のリスクを抑えます。",
    "example": "特定の認証局だけにexample.comの証明書発行を許可します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "証明書発行を許可する認証局をDNSで指定する",
        "hint": "DNS CAAの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "password-spray",
    "name": "パスワードスプレー攻撃",
    "reading": "Password Spray",
    "category": "セキュリティ",
    "definition": "少数のよく使われるパスワードを多数の利用者IDに試す攻撃です。単一IDの連続失敗によるロックを避けようとします。",
    "example": "よくあるパスワードを全社員のIDへ時間を空けて試します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "少数のパスワードを多数のIDへ試す",
        "hint": "パスワードスプレー攻撃の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "一つのIDに多数のパスワードを試す攻撃や、流出済みID・パスワードの組を使う攻撃とは異なります。"
    ]
  },
  {
    "id": "dictionary-attack",
    "name": "辞書攻撃",
    "reading": "Dictionary Attack",
    "category": "セキュリティ",
    "definition": "単語や人名、よく使われるパスワードなどの候補を辞書から選び、順に認証へ試す攻撃です。",
    "example": "辞書の単語と数字を組み合わせてログインを試します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "辞書にある候補をパスワードとして順に試す",
        "hint": "辞書攻撃の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "brute-force",
    "name": "総当たり攻撃",
    "aliases": [
      "ブルートフォース攻撃"
    ],
    "reading": "Brute Force",
    "category": "セキュリティ",
    "definition": "可能な候補を網羅的に試してパスワードや鍵などを探す攻撃です。ブルートフォース攻撃とも呼びます。",
    "example": "4桁の暗証番号を0000から9999まで全て試します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "可能な候補を網羅的に試す",
        "hint": "総当たり攻撃の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "keylogger",
    "name": "キーロガー",
    "reading": "Keylogger",
    "category": "セキュリティ",
    "definition": "キーボードの入力内容を記録するソフトウェアや装置です。不正に設置されるとパスワードなどの窃取に使われます。",
    "example": "入力したIDとパスワードを裏で記録して外部へ送ります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "キー入力を記録し情報窃取などに使われる",
        "hint": "キーロガーの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "man-in-the-middle",
    "name": "中間者攻撃",
    "reading": "Man In The Middle",
    "category": "セキュリティ",
    "definition": "通信する当事者の間へ介入し、相手になりすまして盗聴や改ざんなどを行う攻撃です。",
    "example": "偽のアクセスポイントを経由させて通信内容を中継・改変します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "当事者間へ介入して盗聴・改ざんなどを行う",
        "hint": "中間者攻撃の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "password",
    "name": "パスワード",
    "reading": "Password",
    "category": "セキュリティ",
    "definition": "利用者が知っている秘密の文字列を照合し、身元の確認などに用いる認証情報です。",
    "example": "ログイン時に入力した文字列をサーバが検証します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用者が知る秘密の文字列で認証する",
        "hint": "パスワードの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "osint",
    "name": "OSINT",
    "reading": "Open-source intelligence",
    "category": "セキュリティ",
    "definition": "公開されている情報を収集・分析し、目的に役立つ知見を得る活動です。",
    "example": "公式サイトや公開SNSから組織の構成や連絡先を調べます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "公開情報を収集・分析して知見を得る",
        "hint": "OSINTの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "security-action",
    "name": "SECURITY ACTION",
    "reading": "SECURITY ACTION",
    "category": "セキュリティ",
    "definition": "中小企業などが情報セキュリティ対策への取組を自己宣言するIPAの制度です。第三者が安全性を認証する制度ではありません。",
    "example": "自社の対策への取組を一つ星や二つ星として宣言します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "情報セキュリティ対策への取組を自己宣言する制度",
        "hint": "SECURITY ACTIONの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "取組の自己宣言であり、第三者の審査に合格したという認証ではありません。"
    ]
  },
  {
    "id": "ipa",
    "name": "IPA",
    "reading": "Information-technology Promotion Agency, Japan",
    "category": "セキュリティ",
    "definition": "情報処理推進機構の略称です。情報セキュリティ対策、デジタル人材育成、情報処理技術者試験などに取り組む独立行政法人です。",
    "example": "脆弱性対策の情報や中小企業向けのガイドラインを公開します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "日本の情報処理・セキュリティ・人材育成などを支援する機関",
        "hint": "IPAの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cybersecurity-management-guidelines",
    "name": "サイバーセキュリティ経営ガイドライン",
    "reading": "Cybersecurity Management Guidelines",
    "category": "セキュリティ",
    "definition": "経営者が認識すべき原則と、責任者へ指示すべき重要事項などをまとめた経済産業省・IPAの指針です。",
    "example": "経営者がセキュリティ投資や対応体制の方針を示します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "経営者の責任と指示すべきセキュリティ事項を示す指針",
        "hint": "サイバーセキュリティ経営ガイドラインの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cryptrec-project",
    "name": "CRYPTREC",
    "reading": "Cryptography Research and Evaluation Committees",
    "category": "セキュリティ",
    "definition": "電子政府で使用する暗号などの安全性・実装性能を評価・監視し、暗号の適切な利用を検討する取組です。",
    "example": "CRYPTREC暗号リストの対象暗号を評価し、安全性の変化を監視します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "暗号技術の評価・監視や適切な運用を検討する",
        "hint": "CRYPTRECの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ismap-criteria",
    "name": "ISMAP管理基準",
    "reading": "Information system Security Management and Assessment Program Control Criteria",
    "category": "セキュリティ",
    "definition": "政府向けクラウドサービスのセキュリティ評価で用いる基準です。国際規格やJASAのクラウド情報セキュリティ管理基準などを基礎とします。",
    "example": "クラウド事業者の管理策が調達要件を満たすか評価します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "ISMAPでクラウドサービスのセキュリティを評価する基準",
        "hint": "ISMAP管理基準の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "csf-1-1",
    "name": "CSF 1.1",
    "reading": "National Institute of Standards and Technology Cybersecurity Framework 1.1",
    "category": "セキュリティ",
    "definition": "NISTのサイバーセキュリティフレームワークの1.1版です。コアを識別・防御・検知・対応・復旧の五つの機能で整理します。",
    "example": "五つの機能で現状と目標の差を整理します。",
    "related": [
      "csf-2"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "識別・防御・検知・対応・復旧の五機能で整理する",
        "hint": "CSF 1.1の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "authentication-server",
    "name": "認証サーバ",
    "reading": "Authentication Server",
    "category": "セキュリティ",
    "definition": "利用者や機器の認証情報を検証し、認証の結果を返すサーバです。",
    "example": "RADIUSサーバがアクセスポイントからの要求を受け、利用者を認証します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "認証情報を検証して認証結果を返すサーバ",
        "hint": "認証サーバの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "privileged-id",
    "name": "特権ID",
    "reading": "Privileged identifier",
    "category": "セキュリティ",
    "definition": "通常の利用者より強い管理権限を持ち、システム設定やデータの直接変更などを行えるIDです。",
    "example": "DB管理者のIDで表の直接修正を行います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "システムやデータを管理する強い権限を持つID",
        "hint": "特権IDの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "audit-trail",
    "name": "監査証跡",
    "reading": "Audit Trail",
    "category": "セキュリティ",
    "definition": "誰がいつ何を行ったかなどを後から追跡・検証するための記録です。",
    "example": "特権IDによるデータの変更内容と実行者を保存します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "操作や変更を後から追跡・検証できる記録",
        "hint": "監査証跡の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "segregation-of-duties",
    "name": "職務の分離",
    "reading": "Segregation Of Duties",
    "category": "セキュリティ",
    "definition": "不正や誤りを抑えるため、相互に牽制すべき業務や権限を別の担当者などへ分けることです。",
    "example": "データ変更の依頼、承認、実行を一人で完結させません。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "相互に牽制する業務や権限を分ける",
        "hint": "職務の分離の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "access-management",
    "name": "アクセス管理",
    "reading": "Access Management",
    "category": "セキュリティ",
    "definition": "利用者の登録・変更・削除や権限の付与・見直しなどを通じ、資源へのアクセスを適切に管理する活動です。",
    "example": "退職した利用者のIDを無効にし、異動後の権限を見直します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用者IDや権限をライフサイクルに沿って管理する",
        "hint": "アクセス管理の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "access-control",
    "name": "アクセスコントロール",
    "aliases": [
      "アクセス制御"
    ],
    "reading": "Access Control",
    "category": "セキュリティ",
    "definition": "誰がどの資源にどの操作を行えるかを、決められた規則に従って制御することです。",
    "example": "担当者だけが顧客情報を更新できるようにします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "主体と資源と操作に応じてアクセスを制御する",
        "hint": "アクセスコントロールの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "access-rights",
    "name": "アクセス権限",
    "aliases": [
      "権限"
    ],
    "reading": "Access Rights",
    "category": "セキュリティ",
    "definition": "利用者やプログラムに許された、資源に対する読取り・更新・実行などの操作の範囲です。",
    "example": "参照だけできる利用者にはDELETEの権限を付けません。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "資源に対して許可された操作の範囲",
        "hint": "アクセス権限の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "user-id",
    "name": "利用者ID",
    "reading": "User identifier",
    "category": "セキュリティ",
    "definition": "システムで利用者を識別するための情報です。秘密であることを前提とするパスワードとは役割が異なります。",
    "example": "社員番号をログイン時の利用者IDとして使います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "利用者を識別する情報",
        "hint": "利用者IDの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "penetration-test",
    "name": "ペネトレーションテスト",
    "reading": "Penetration Test",
    "category": "セキュリティ",
    "definition": "許可された範囲で実際に攻撃や侵入を試み、セキュリティ対策の実効性や侵入可能性を確認するテストです。",
    "example": "公開サーバの弱点を利用して侵入や権限取得が可能か調べます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "攻撃・侵入を実際に試みて対策の実効性を確認する",
        "hint": "ペネトレーションテストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "shared-responsibility",
    "name": "責任共有モデル",
    "reading": "Shared Responsibility",
    "category": "セキュリティ",
    "definition": "クラウドサービスの種類などに応じ、利用者と提供者がセキュリティや運用の責任を分担する考え方です。",
    "example": "PaaSでは提供者がOSを管理し、利用者はアプリケーションの安全性を管理します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "サービス区分に応じて利用者と提供者の責任を分ける",
        "hint": "責任共有モデルの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "registration-authority",
    "name": "RA",
    "aliases": [
      "登録局"
    ],
    "reading": "Registration Authority",
    "category": "セキュリティ",
    "definition": "PKIの登録局であり、証明書申請者の本人確認や申請審査を行い、発行の承認・却下を担います。",
    "example": "申請者の確認資料を審査し、認証局へ証明書発行の承認を伝えます。",
    "related": [
      "pki",
      "certificate-authority",
      "validation-authority"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "本人確認を行い証明書の発行申請を審査する",
        "hint": "RAの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "証明書に署名して発行するのは認証局（CA）です。RAは申請者を審査します。"
    ]
  },
  {
    "id": "supplicant",
    "name": "サプリカント",
    "reading": "Supplicant",
    "category": "セキュリティ",
    "definition": "IEEE 802.1Xで認証を要求する端末側の機器やソフトウェアです。",
    "example": "無線LANへ接続するPCが認証情報を送ります。",
    "related": [
      "ieee8021x",
      "authenticator",
      "radius"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "802.1Xで認証を要求する端末側の機能",
        "hint": "サプリカントの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "authenticator",
    "name": "オーセンティケータ",
    "reading": "Authenticator",
    "category": "セキュリティ",
    "definition": "IEEE 802.1Xで端末と認証サーバの間を仲介し、認証結果に応じて接続を制御する機能です。",
    "example": "アクセスポイントが認証を仲介し、成功後に端末の通信を許可します。",
    "related": [
      "ieee8021x",
      "supplicant",
      "authentication-server"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "認証を仲介し結果に応じてネットワーク接続を制御する",
        "hint": "オーセンティケータの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "radius",
    "name": "RADIUS",
    "reading": "Remote Authentication Dial-In User Service",
    "category": "セキュリティ",
    "definition": "ネットワーク利用者などの認証・認可・アカウンティングを扱うプロトコルです。接続制御装置がクライアントとして認証サーバと連携します。",
    "example": "アクセスポイントが利用者の認証要求をRADIUSサーバへ送ります。",
    "related": [
      "aaa",
      "ieee8021x"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "接続制御装置と認証サーバ間でAAAを扱う",
        "hint": "RADIUSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "eap",
    "name": "EAP",
    "reading": "Extensible Authentication Protocol",
    "category": "セキュリティ",
    "definition": "様々な認証方式を運ぶための拡張可能な認証の枠組みです。IEEE 802.1Xなどで利用します。",
    "example": "EAP-TLSで証明書を使った認証を行います。",
    "related": [
      "ieee8021x"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "複数の認証方式を共通の枠組みで扱う",
        "hint": "EAPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ocsp",
    "name": "OCSP",
    "reading": "Online Certificate Status Protocol",
    "category": "セキュリティ",
    "definition": "公開鍵証明書の失効状態をオンラインで問い合わせるためのプロトコルです。",
    "example": "証明書のシリアル番号を基に、失効しているか応答を得ます。",
    "related": [
      "crl",
      "validation-authority"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "個々の証明書の失効状態をオンラインで確認する",
        "hint": "OCSPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "placeholder",
    "name": "プレースホルダ",
    "reading": "Placeholder",
    "category": "セキュリティ",
    "definition": "SQLの構造と値を分離するため、値を後から割り当てる位置を示す仕組みです。適切なバインドでSQLインジェクションを防ぎます。",
    "example": "WHERE id = ?の疑問符へ利用者IDを値として渡します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "SQLの構造と外部入力の値を分離する",
        "hint": "プレースホルダの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "wireless-lan",
    "name": "無線LAN",
    "reading": "Wireless Local Area Network",
    "category": "セキュリティ",
    "definition": "電波を使って端末とアクセスポイントなどを接続するLANです。IEEE 802.11系列などが使われます。",
    "example": "PCをWi-Fiアクセスポイントへ接続します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "電波で端末を接続するLAN",
        "hint": "無線LANの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "quantum-key-distribution",
    "name": "量子鍵配送",
    "reading": "Quantum Key Distribution",
    "category": "セキュリティ",
    "definition": "量子状態の性質を利用し、盗聴の影響を検出しながら暗号鍵を共有する技術です。",
    "example": "量子通信路と認証された古典通信路を用いて共有鍵を確立します。",
    "related": [
      "one-time-pad"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "量子状態を使い盗聴を検出しながら鍵を共有する",
        "hint": "量子鍵配送の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "parallel-simulation",
    "name": "並行シミュレーション",
    "aliases": [
      "並行シミュレーション法"
    ],
    "reading": "Parallel Simulation",
    "category": "セキュリティ",
    "definition": "監査対象と同じデータを独立した別のプログラムで処理し、結果を比較して正確性を確かめる監査技法です。",
    "example": "給与データを別の計算プログラムで処理し、実システムの結果と照合します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "独立したプログラムで同じ処理を再現して結果を比較する",
        "hint": "並行シミュレーションの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "general-it-controls",
    "name": "IT全般統制",
    "aliases": [
      "全般統制"
    ],
    "reading": "General information technology controls",
    "category": "セキュリティ",
    "definition": "業務処理統制を支える、システムの開発・保守、運用、アクセス管理などに関する統制です。",
    "example": "本番へのプログラム変更の承認手順を組織共通で定めます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "業務処理を支える開発・運用などの全体の統制",
        "hint": "IT全般統制の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "入力や業務別マスタなど、個々のアプリケーション内の処理の確認は業務処理統制です。"
    ]
  },
  {
    "id": "cryptographic-module",
    "name": "暗号モジュール",
    "reading": "Cryptographic Module",
    "category": "セキュリティ",
    "definition": "暗号化、署名、鍵管理などの暗号機能を実装するハードウェア・ソフトウェアなどのまとまりです。",
    "example": "暗号鍵の保管と署名処理を専用装置の境界内で行います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "暗号機能と鍵などを扱う実装のまとまり",
        "hint": "暗号モジュールの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "fips1403",
    "name": "FIPS 140-3",
    "reading": "Federal Information Processing Standard 140-3",
    "category": "セキュリティ",
    "definition": "暗号モジュールの設計・実装・運用などに関するセキュリティ要求事項を定めた米国の連邦標準です。",
    "example": "暗号装置が鍵の保護や物理的な保護の要求を満たすか評価します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "暗号モジュールのセキュリティ要求事項を定める",
        "hint": "FIPS 140-3の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "iso15408",
    "name": "ISO/IEC 15408",
    "reading": "Evaluation criteria for information technology security",
    "category": "セキュリティ",
    "definition": "IT製品などのセキュリティ機能とその保証を評価する共通の基準です。コモンクライテリアとも呼ばれます。",
    "example": "調達する機器のセキュリティ機能の評価結果を確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "IT製品などのセキュリティ機能を共通基準で評価する",
        "hint": "ISO/IEC 15408の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "iso27002",
    "name": "ISO/IEC 27002",
    "reading": "Information security, cybersecurity and privacy protection — Information security controls",
    "category": "セキュリティ",
    "definition": "情報セキュリティ管理策と、その実施のための指針を示す国際規格です。",
    "example": "アクセス管理や人的セキュリティの管理策を検討する際に参照します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "情報セキュリティ管理策の指針を示す",
        "hint": "ISO/IEC 27002の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "iso27017",
    "name": "ISO/IEC 27017",
    "reading": "Code of practice for information security controls based on ISO/IEC 27002 for cloud services",
    "category": "セキュリティ",
    "definition": "クラウドサービスの利用者と提供者向けに、情報セキュリティ管理策の実施指針を示す国際規格です。",
    "example": "クラウド固有の責任分担や仮想環境の分離に関する管理策を確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "クラウドサービス固有の情報セキュリティ管理策の指針",
        "hint": "ISO/IEC 27017の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "jisq15001",
    "name": "JIS Q 15001",
    "reading": "Personal information protection management systems — Requirements",
    "category": "セキュリティ",
    "definition": "個人情報保護マネジメントシステムの要求事項を定める日本産業規格です。",
    "example": "組織の個人情報保護の仕組みを整備・改善する基準として用います。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "個人情報保護マネジメントシステムの要求事項",
        "hint": "JIS Q 15001の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "validation-authority",
    "name": "VA",
    "reading": "Validation Authority",
    "category": "セキュリティ",
    "definition": "公開鍵証明書の失効状態など、有効性の検証に関する問合せに応答する検証局です。",
    "example": "証明書のシリアル番号に対して失効の有無を返します。",
    "related": [
      "crl",
      "ocsp",
      "pki"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "証明書の有効性検証に関する問合せへ応答する",
        "hint": "VAの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "soap",
    "name": "SOAP",
    "reading": "SOAP (originally Simple Object Access Protocol)",
    "category": "開発技術",
    "definition": "構造化されたメッセージをXMLで表現し、ネットワーク上で交換するための枠組みです。",
    "example": "WebサービスがSOAPメッセージで処理要求と結果をやり取りします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "XML形式のメッセージを交換する枠組み",
        "hint": "SOAPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "xkms",
    "name": "XKMS",
    "reading": "Extensible Markup Language Key Management Specification",
    "category": "開発技術",
    "definition": "デジタル署名などで使う公開鍵情報の登録や検証などを、Webサービスで扱うための仕様です。",
    "example": "利用する公開鍵の情報をサービスに問い合わせて確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "公開鍵情報の登録や検証をWebサービスで扱う",
        "hint": "XKMSの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cmmi",
    "name": "CMMI",
    "reading": "Capability Maturity Model Integration",
    "category": "開発技術",
    "definition": "組織の開発やサービス提供などのプロセスの能力・成熟度を評価し、改善を進めるためのモデルです。",
    "example": "開発プロセスの管理や標準化の状況を評価します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "組織のプロセスの能力や成熟度を評価・改善する",
        "hint": "CMMIの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "branch-coverage",
    "name": "判定条件網羅",
    "aliases": [
      "分岐網羅"
    ],
    "reading": "Branch Coverage",
    "category": "開発技術",
    "definition": "テストで、各判定全体の結果が真と偽になる分岐を少なくとも一度ずつ実行する基準です。分岐網羅とも呼びます。",
    "example": "A>6 OR B=0の結果が真になるケースと偽になるケースを用意します。",
    "related": [
      "white-box-test",
      "multiple-condition-coverage"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "判定全体の真と偽の分岐を全て通る",
        "hint": "判定条件網羅の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "各条件の全組合せを試す複数条件網羅とは異なり、判定全体の真・偽を確認します。"
    ]
  },
  {
    "id": "multiple-condition-coverage",
    "name": "複数条件網羅",
    "reading": "Multiple Condition Coverage",
    "category": "開発技術",
    "definition": "一つの判定を構成する各条件の真偽の組合せを、全て実行するテスト基準です。",
    "example": "二つの条件なら真真・真偽・偽真・偽偽を確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "判定内の個々の条件の真偽の全組合せを実行する",
        "hint": "複数条件網羅の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "white-box-test",
    "name": "ホワイトボックステスト",
    "reading": "White Box Test",
    "category": "開発技術",
    "definition": "プログラムの内部構造に着目し、文や分岐などを実行するテストケースを設計する方法です。",
    "example": "制御フローを見て全分岐を通す入力を作ります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "内部構造に基づいてテストを設計する",
        "hint": "ホワイトボックステストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "black-box-test",
    "name": "ブラックボックステスト",
    "reading": "Black Box Test",
    "category": "開発技術",
    "definition": "プログラムの内部構造によらず、仕様に基づく入力と期待する出力からテストを設計する方法です。",
    "example": "入力の同値クラスや境界値からテストケースを選びます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "仕様と入出力に基づいてテストを設計する",
        "hint": "ブラックボックステストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "boundary-value",
    "name": "境界値",
    "reading": "Boundary Value",
    "category": "開発技術",
    "definition": "条件が切り替わる境界上や、その直前・直後などの値です。条件式の誤りを見つけるテストに使います。",
    "example": "年齢>28の条件なら28と29などを確かめます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "条件の境界とその前後の値を確認する",
        "hint": "境界値の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "tailoring",
    "name": "テーラリング",
    "reading": "Tailoring",
    "category": "開発技術",
    "definition": "目的や状況に合わせて、ライフサイクルプロセスなどを選択・修正したり、新たに定義したりすることです。",
    "example": "小規模な開発でも必要な成果を保ちながら手順を調整します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "目的や状況に合わせてプロセスを選択・修正する",
        "hint": "テーラリングの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "life-cycle-process",
    "name": "ライフサイクルプロセス",
    "reading": "Life Cycle Process",
    "category": "開発技術",
    "definition": "システムやソフトウェアの構想から開発、利用、保守、廃棄などの期間にわたり実施するプロセスです。",
    "example": "開発だけでなく、取得や運用、保守の活動も計画します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "構想から廃棄などまでの期間にわたるプロセス",
        "hint": "ライフサイクルプロセスの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "simulation",
    "name": "シミュレーション",
    "reading": "Simulation",
    "category": "開発技術",
    "definition": "実際の対象の振る舞いをモデルで模擬し、条件を変えた結果などを調べることです。",
    "example": "利用者数を変えて待ち時間の変化をモデルで調べます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "モデルで対象の振る舞いを模擬して調べる",
        "hint": "シミュレーションの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "chaos-engineering",
    "name": "カオスエンジニアリング",
    "reading": "Chaos Engineering",
    "category": "開発技術",
    "definition": "制御した条件でシステムへ障害を注入し、挙動を観察して耐障害性を改善する手法です。",
    "example": "一部のサービスを停止し、利用者への影響と復旧を確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "意図的な障害実験から耐障害性を改善する",
        "hint": "カオスエンジニアリングの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "devops",
    "name": "DevOps",
    "reading": "Development and Operations",
    "category": "開発技術",
    "definition": "開発と運用が協調し、自動化やフィードバックなどを通じて継続的にソフトウェアの価値を提供・改善する取組です。",
    "example": "運用で見つかった課題を開発へ戻し、変更を素早く安全に届けます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "開発と運用が協調し継続的に提供・改善する",
        "hint": "DevOpsの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "test-driven-development",
    "name": "テスト駆動開発",
    "reading": "Test Driven Development",
    "category": "開発技術",
    "definition": "先に失敗するテストを書き、それを通す最小限の実装を作り、リファクタリングするサイクルで開発する手法です。",
    "example": "計算関数の期待する結果をテストにしてから関数を実装します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "テストを先に書き実装と改善を短いサイクルで行う",
        "hint": "テスト駆動開発の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "extreme-programming",
    "name": "XP",
    "reading": "Extreme Programming",
    "category": "開発技術",
    "definition": "コミュニケーションなどの価値を基礎に、テスト駆動開発やペアプログラミングなどの実践を組み合わせるアジャイル開発手法です。",
    "example": "短いサイクルでテストを通し、二人でコードを確認しながら実装します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "価値と具体的なプラクティスを組み合わせるアジャイル手法",
        "hint": "XPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "product-backlog",
    "name": "プロダクトバックログ",
    "reading": "Product Backlog",
    "category": "開発技術",
    "definition": "プロダクトを改善するために必要なことを、順序付けてまとめた一覧です。スクラムで今後の作業の源になります。",
    "example": "利用者の要望や技術的な改善を価値などに応じて並べます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "プロダクト改善に必要な作業を順序付けた一覧",
        "hint": "プロダクトバックログの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "gang-of-four",
    "name": "GoF",
    "reading": "Gang of Four",
    "category": "開発技術",
    "definition": "オブジェクト指向のデザインパターンをまとめた四人の著者の呼称です。パターンは生成・構造・振る舞いの三つに分類されます。",
    "example": "Factory MethodやObserverなどの設計パターンを参照します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "生成・構造・振る舞いに分類する設計パターンの著者群",
        "hint": "GoFの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "design-pattern",
    "name": "デザインパターン",
    "reading": "Design Pattern",
    "category": "開発技術",
    "definition": "ソフトウェアの設計で繰り返し現れる問題に対する、再利用可能な解決の構造を整理したものです。",
    "example": "Observerで状態変化の通知を疎結合に実現します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "繰り返し現れる設計問題の再利用可能な解決構造",
        "hint": "デザインパターンの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "architecture-pattern",
    "name": "アーキテクチャパターン",
    "reading": "Architecture Pattern",
    "category": "開発技術",
    "definition": "システム全体の構成や主要な要素の関係を定める、再利用可能な構造上の解決策です。",
    "example": "Layersで責任を階層へ分けます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "システム全体の構成を扱う再利用可能な構造",
        "hint": "アーキテクチャパターンの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "refactoring",
    "name": "リファクタリング",
    "reading": "Refactoring",
    "category": "開発技術",
    "definition": "外部から見た振る舞いを保ちながら、コードの内部構造を改善することです。",
    "example": "重複した処理を共通の関数へまとめます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "外部の振る舞いを保ちながら内部構造を改善する",
        "hint": "リファクタリングの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "test-coverage",
    "name": "カバレージ",
    "reading": "Test Coverage",
    "category": "開発技術",
    "definition": "対象とした文や分岐などのうち、テストで実行・確認した範囲や割合です。基準によって測る対象が異なります。",
    "example": "全分岐のうちテストで通った分岐の割合を測ります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "定めた対象をテストでどれだけ通したかの範囲・割合",
        "hint": "カバレージの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "walkthrough",
    "name": "ウォークスルー",
    "reading": "Walkthrough",
    "category": "開発技術",
    "definition": "成果物の作成者などと参加者が動作を机上で追い、欠陥や問題点を見つけるレビュー手法です。",
    "example": "入力例に沿って仕様書やコードの動作を説明し、問題を検討します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "複数人で成果物の動作を机上で追って問題を見つける",
        "hint": "ウォークスルーの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "formal-methods",
    "name": "形式手法",
    "reading": "Formal Methods",
    "category": "開発技術",
    "definition": "数学的に厳密な記法やモデルで仕様を表し、満たすべき性質を論理的に検証する手法です。",
    "example": "状態遷移モデルにデッドロックがないか検証します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "厳密なモデルと論理で仕様の性質を検証する",
        "hint": "形式手法の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "inspection",
    "name": "インスペクション",
    "reading": "Inspection",
    "category": "開発技術",
    "definition": "モデレーターや記録役などの役割と手順を定め、複数人で成果物の欠陥を見つける形式的なレビューです。",
    "example": "事前にコードを確認し、会議で欠陥を記録します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "役割と手順を定めて欠陥を検出するレビュー",
        "hint": "インスペクションの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "http-referer",
    "name": "Referer",
    "reading": "Referer",
    "category": "セキュリティ",
    "definition": "要求元のページのURIなどを伝えるHTTPリクエストヘッダーです。ブラウザの方針などで省略・制限される場合があります。",
    "example": "サーバが重要な要求のリンク元を検査します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "HTTP要求のリンク元を伝えるヘッダー",
        "hint": "Refererの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "l2tp",
    "name": "L2TP",
    "reading": "Layer Two Tunneling Protocol",
    "category": "セキュリティ",
    "definition": "PPPなどのデータリンク層のフレームをIPネットワーク上でトンネル転送するプロトコルです。暗号化にはIPsecなどを組み合わせます。",
    "example": "離れた拠点のPPP接続をトンネル化します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "データリンク層のフレームをトンネル転送する",
        "hint": "L2TPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "foreign-key",
    "name": "外部キー",
    "reading": "Foreign Key",
    "category": "セキュリティ",
    "definition": "他の表などの候補キーを参照する列や列の組です。対応する参照先を要求する制約で参照整合性を保ちます。",
    "example": "受注表の顧客コードから顧客表のキーを参照します。",
    "related": [
      "candidate-key",
      "referential-integrity"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "候補キーを参照する列または列の組",
        "hint": "外部キーの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "外部キーの値は、参照元の表で重複しても構いません。一つの表に複数の外部キーを設けることもできます。"
    ]
  },
  {
    "id": "candidate-key",
    "name": "候補キー",
    "reading": "Candidate Key",
    "category": "セキュリティ",
    "definition": "表の各行を一意に識別でき、どの列を除いてもその性質を失う最小の列の組です。主キーは候補キーから選びます。",
    "example": "社員番号とメールアドレスがそれぞれ一意なら、両方が候補キーになり得ます。",
    "related": [
      "primary-key"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "行を一意に識別する最小の列の組",
        "hint": "候補キーの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "候補キーは複数ある場合があり、そのうち一つを主キーに選びます。"
    ]
  },
  {
    "id": "jisq20000",
    "name": "JIS Q 20000-1",
    "reading": "Information technology — Service management — Part 1: Service management system requirements",
    "category": "セキュリティ",
    "definition": "サービスマネジメントシステムの要求事項を定める日本産業規格です。",
    "example": "サービス提供の仕組みが規格の要求に適合するか内部監査します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "サービスマネジメントシステムの要求事項を定める規格",
        "hint": "JIS Q 20000-1の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "top-down-test",
    "name": "トップダウンテスト",
    "reading": "Top Down Test",
    "category": "セキュリティ",
    "definition": "上位のモジュールから下位へ順に結合を進めるテスト方式です。未完成の下位モジュールはスタブで代用します。",
    "example": "画面側から結合し、呼出し先の未完成処理をスタブにします。",
    "related": [
      "integration-test"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "上位から結合を進め下位をスタブで代用する",
        "hint": "トップダウンテストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sandwich-test",
    "name": "サンドイッチテスト",
    "reading": "Sandwich Test",
    "category": "セキュリティ",
    "definition": "上位からと下位からの結合テストを並行して進め、中間で結び付ける方式です。",
    "example": "上位はスタブ、下位はドライバを使いながら両方向から結合します。",
    "related": [
      "integration-test"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "上位と下位の両方から結合を進める",
        "hint": "サンドイッチテストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "detached-signature",
    "name": "デタッチ署名",
    "reading": "Detached Signature",
    "category": "セキュリティ",
    "definition": "署名要素の外側にあるデータを参照して付ける署名です。XML署名では同じ文書中の別要素も対象にできます。",
    "example": "署名要素と同じXML文書にある別の要素をIDで参照します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "署名要素の外側にあるデータへ署名する",
        "hint": "デタッチ署名の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "dns-resolver",
    "name": "リゾルバ",
    "reading": "Domain Name System resolver",
    "category": "セキュリティ",
    "definition": "名前解決の要求を行い、DNS情報を取得する機能です。端末側のスタブや再帰問合せを処理するリゾルバなどがあります。",
    "example": "名前に対応するIPアドレスをDNSから得ます。",
    "related": [
      "dns",
      "dnssec"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "DNSで名前解決の要求を行い情報を取得する機能",
        "hint": "リゾルバの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "arp",
    "name": "ARP",
    "reading": "Address Resolution Protocol",
    "category": "セキュリティ",
    "definition": "同じリンク上で、IPv4アドレスに対応するMACアドレスを問い合わせるプロトコルです。アドレス重複の確認にも使います。",
    "example": "ゲートウェイのIPv4アドレスから送信先MACアドレスを調べます。",
    "related": [
      "arp-cache",
      "mac-address"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "IPv4アドレスから同一リンクのMACアドレスを解決する",
        "hint": "ARPの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cryptrec-recommended",
    "name": "電子政府推奨暗号リスト",
    "reading": "e-Government Recommended Ciphers List",
    "category": "セキュリティ",
    "definition": "CRYPTREC暗号リストのうち、安全性と実装性能を確認し、市場での利用実績なども踏まえて電子政府での利用を推奨する暗号技術の一覧です。",
    "example": "新たな政府システムで利用する暗号の候補を確認します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "電子政府での利用を推奨する暗号技術のリスト",
        "hint": "電子政府推奨暗号リストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cryptrec-candidate",
    "name": "推奨候補暗号リスト",
    "reading": "Candidate Recommended Ciphers List",
    "category": "セキュリティ",
    "definition": "CRYPTREC暗号リストのうち、安全性と実装性能が確認され、今後推奨リストへ掲載される可能性がある暗号技術の一覧です。",
    "example": "安全性が確認された新しい暗号の位置付けを調べます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "安全性などを確認し今後推奨へ移る可能性がある暗号のリスト",
        "hint": "推奨候補暗号リストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cryptrec-monitored",
    "name": "運用監視暗号リスト",
    "reading": "Monitored Ciphers List",
    "category": "セキュリティ",
    "definition": "CRYPTREC暗号リストのうち、積極的な推奨からは外れるものの、互換性維持などのために継続利用を扱う暗号技術の一覧です。",
    "example": "既存システムで使う古い暗号の移行方針を検討します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "互換性維持などのため継続利用を扱う暗号のリスト",
        "hint": "運用監視暗号リストの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cryptographic-compromise",
    "name": "危殆化",
    "reading": "Cryptographic Compromise",
    "category": "セキュリティ",
    "definition": "計算能力や解読技術の進歩、鍵の漏えいなどにより、暗号や鍵の安全性が低下・喪失することです。",
    "example": "秘密鍵が漏えいした証明書を失効させます。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "暗号や鍵の安全性が低下・喪失すること",
        "hint": "危殆化の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "hash-value",
    "name": "ハッシュ値",
    "reading": "Hash Value",
    "category": "セキュリティ",
    "definition": "入力データにハッシュ関数を適用して得られる、一定長の値です。ハッシュ関数そのものとは区別します。",
    "example": "配布ファイルから計算した値と公開値を比較します。",
    "related": [
      "hash"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ハッシュ関数の計算結果である一定長の値",
        "hint": "ハッシュ値の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "計算規則であるハッシュ関数と、その計算結果のハッシュ値は区別します。"
    ]
  },
  {
    "id": "ntlm",
    "name": "NTLM認証",
    "reading": "NT LAN Manager (LAN: Local Area Network)",
    "category": "セキュリティ",
    "definition": "Windowsなどで使われるチャレンジレスポンス型の認証方式です。パスワード由来の秘密に基づいて応答を作ります。",
    "example": "サーバからのチャレンジに対する応答で利用者を検証します。",
    "related": [
      "pass-the-hash"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "パスワード由来の秘密でチャレンジに応答する認証方式",
        "hint": "NTLM認証の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "plaintext-password",
    "name": "平文パスワード",
    "reading": "Plaintext Password",
    "category": "セキュリティ",
    "definition": "暗号化やハッシュ化などをしていない、元の文字列のままのパスワードです。",
    "example": "設定ファイルからそのまま読めるパスワードが漏えいします。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "変換されず元の文字列のままのパスワード",
        "hint": "平文パスワードの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "xor",
    "name": "排他的論理和",
    "aliases": [
      "XOR"
    ],
    "reading": "Exclusive OR",
    "category": "セキュリティ",
    "definition": "二つの論理値が異なるときに1、同じときに0になる論理演算です。XORとも呼びます。",
    "example": "同じ鍵ストリームで2回XORを取ると元のデータへ戻ります。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "二つの値が異なるとき1になる論理演算",
        "hint": "排他的論理和の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "bit",
    "name": "ビット",
    "reading": "Bit",
    "category": "セキュリティ",
    "definition": "0と1の二つの状態を表す情報量の単位です。通信速度などでは1秒当たりのビット数を使います。",
    "example": "1Gビット/秒を10の9乗ビット/秒として計算します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "0または1の二状態を表す情報量の単位",
        "hint": "ビットの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "byte",
    "name": "バイト",
    "reading": "Byte",
    "category": "セキュリティ",
    "definition": "通常8ビットをひとまとめにしたデータ量の単位です。通信のビット数との換算を区別します。",
    "example": "6Mバイトを48Mビットへ換算します。",
    "related": [],
    "criteria": [
      {
        "id": "meaning",
        "title": "通常8ビットから成るデータ量の単位",
        "hint": "バイトの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "audit-risk",
    "name": "監査リスク",
    "reading": "Audit Risk",
    "category": "セキュリティ",
    "definition": "対象の重要な不備などを見逃し、監査人が適切でない結論を示すリスクです。監査の計画と実施により合理的に低く抑えます。",
    "example": "重要なアクセス権限の不備を発見できず、適切と判断してしまいます。",
    "related": [
      "risk-approach"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "不備を見逃すなどして監査の結論を誤るリスク",
        "hint": "監査リスクの目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "reconnaissance",
    "name": "偵察",
    "reading": "Reconnaissance",
    "category": "セキュリティ",
    "definition": "攻撃を準備するため、標的の組織や人、システムなどについて情報を収集する段階です。",
    "example": "公開SNSから攻撃対象の関係者や利用サービスを調べます。",
    "related": [
      "cyber-kill-chain"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "攻撃の準備として標的の情報を収集する",
        "hint": "偵察の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "planned-downtime",
    "name": "計画停止",
    "reading": "Planned Downtime",
    "category": "セキュリティ",
    "definition": "保守や更新などのため、あらかじめ予定してサービスを止めることです。可用性での扱いは顧客と合意した提供時間などに従います。",
    "example": "顧客の合意に基づき、更新の停止時間を提供時間から除外します。",
    "related": [
      "service-availability",
      "service-hours"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "保守や更新などのために事前に予定する停止",
        "hint": "計画停止の目的や仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [
      "事前に計画したというだけで必ず可用性の計算から除外できるわけではなく、合意した提供時間に従います。"
    ]
  },
  {
    "id": "forward-proxy",
    "name": "フォワードプロキシ",
    "reading": "Forward proxy",
    "category": "ネットワーク",
    "definition": "クライアントの代理として外部サーバへの要求を中継する仕組みです。",
    "example": "社内端末からのWebアクセスを代理し、アクセス先の制限やキャッシュを行います。",
    "related": [
      "reverse-proxy"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "クライアントの代理として外部サーバへの要求を中継する仕組み",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "nosql",
    "name": "NoSQL",
    "reading": "Not only Structured Query Language",
    "category": "データベース",
    "definition": "関係データベース以外のモデルを用いるデータベースの総称です。",
    "example": "キーと値の組や文書などの形式でデータを保存します。",
    "related": [
      "base"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "関係データベース以外のモデルを用いるデータベースの総称",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "eventual-consistency",
    "name": "結果整合性",
    "reading": "Eventual consistency",
    "category": "データベース",
    "definition": "更新が新たに行われなければ、時間の経過とともに各ノードのデータが一致する性質です。",
    "example": "更新直後は参照する複製によって値が異なっても、更新の反映後は一致します。",
    "related": [
      "base"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "更新が新たに行われなければ、時間の経過とともに各ノードのデータが一致する性質",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "enveloped-signature",
    "name": "エンベロープ署名",
    "reading": "Enveloped signature",
    "category": "暗号・認証",
    "definition": "署名対象のXMLデータの内部に署名要素を置く形式です。",
    "example": "XML文書の内部に、その文書に対する署名を含めます。",
    "related": [
      "xml-signature"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "署名対象のXMLデータの内部に署名要素を置く形式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "enveloping-signature",
    "name": "エンベローピング署名",
    "reading": "Enveloping signature",
    "category": "暗号・認証",
    "definition": "署名要素の内部に署名対象のデータを含める形式です。",
    "example": "XMLの署名要素が、署名対象のデータを内側に持ちます。",
    "related": [
      "xml-signature"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "署名要素の内部に署名対象のデータを含める形式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "quantum-bit",
    "name": "量子ビット",
    "reading": "Quantum bit",
    "category": "基礎理論",
    "definition": "量子計算で情報を表す単位で、0と1の重ね合わせ状態を取れるものです。",
    "example": "通常のビットとは異なり、重ね合わせ状態を計算に利用します。",
    "related": [
      "quantum-computer"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "量子計算で情報を表す単位で、0と1の重ね合わせ状態を取れるもの",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "superposition",
    "name": "重ね合わせ",
    "reading": "Superposition",
    "category": "基礎理論",
    "definition": "量子の状態を、複数の基底状態の重なりとして表せる性質です。",
    "example": "量子ビットでは、0と1の重ね合わせ状態を扱います。",
    "related": [
      "quantum-computer"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "量子の状態を、複数の基底状態の重なりとして表せる性質",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "quantum-gate",
    "name": "量子ゲート",
    "reading": "Quantum gate",
    "category": "基礎理論",
    "definition": "量子ビットの状態に操作を加える、量子計算の基本的な処理です。",
    "example": "量子ビットにゲート操作を順に加えて計算を進めます。",
    "related": [
      "quantum-computer"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "量子ビットの状態に操作を加える、量子計算の基本的な処理",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "supervised-learning",
    "name": "教師あり学習",
    "reading": "Supervised learning",
    "category": "AI・機械学習",
    "definition": "正解ラベル付きのデータから、入力と出力の関係を学ぶ手法です。",
    "example": "正解の付いた画像で学習し、新しい画像を分類します。",
    "related": [
      "machine-learning"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "正解ラベル付きのデータから、入力と出力の関係を学ぶ手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "unsupervised-learning",
    "name": "教師なし学習",
    "reading": "Unsupervised learning",
    "category": "AI・機械学習",
    "definition": "正解ラベルのないデータから、構造やまとまりなどを見つける手法です。",
    "example": "購買傾向が似た顧客をグループに分けます。",
    "related": [
      "machine-learning"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "正解ラベルのないデータから、構造やまとまりなどを見つける手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "reinforcement-learning",
    "name": "強化学習",
    "reading": "Reinforcement learning",
    "category": "AI・機械学習",
    "definition": "環境との相互作用で得る報酬を基に、望ましい行動の選び方を学ぶ手法です。",
    "example": "行動した結果の報酬を使い、より良い行動を選ぶように学習します。",
    "related": [
      "machine-learning"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "環境との相互作用で得る報酬を基に、望ましい行動の選び方を学ぶ手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "inference",
    "name": "推論",
    "reading": "Inference",
    "category": "AI・機械学習",
    "definition": "学習済みモデルを新しいデータに適用して、予測や判断などの出力を得る処理です。",
    "example": "学習済みの分類モデルで、新しく届いたメールを判定します。",
    "related": [
      "machine-learning"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "学習済みモデルを新しいデータに適用して、予測や判断などの出力を得る処理",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "multitask-learning",
    "name": "マルチタスク学習",
    "reading": "Multitask learning",
    "category": "AI・機械学習",
    "definition": "関連する複数の課題を一緒に学習し、共通する情報を活用する手法です。",
    "example": "一つのモデルで、画像の分類と関連する属性の予測を学習します。",
    "related": [
      "ensemble-learning"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "関連する複数の課題を一緒に学習し、共通する情報を活用する手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "bubble-sort",
    "name": "バブルソート",
    "reading": "Bubble sort",
    "category": "基礎理論",
    "definition": "隣り合う要素を比較し、順序が逆なら交換する操作を繰り返して整列する手法です。",
    "example": "隣の値と比べて交換し、大きな値を端へ移動させます。",
    "related": [
      "sorting"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "隣り合う要素を比較し、順序が逆なら交換する操作を繰り返して整列する手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "insertion-sort",
    "name": "挿入ソート",
    "reading": "Insertion sort",
    "category": "基礎理論",
    "definition": "整列済みの部分へ次の要素を適切な位置に挿入していく整列手法です。",
    "example": "左側の整列済みの列に、新しい値を順に挿入します。",
    "related": [
      "sorting"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "整列済みの部分へ次の要素を適切な位置に挿入していく整列手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "heap-sort",
    "name": "ヒープソート",
    "reading": "Heap sort",
    "category": "基礎理論",
    "definition": "ヒープ構造から最大値や最小値を順に取り出して整列する手法です。",
    "example": "最大値を取り出して末尾へ置き、残りのヒープを調整します。",
    "related": [
      "sorting"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ヒープ構造から最大値や最小値を順に取り出して整列する手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "prefix-notation",
    "name": "前置記法",
    "reading": "Prefix notation",
    "category": "基礎理論",
    "definition": "演算子を、その演算の対象より前に置く表記法です。",
    "example": "足し算を「+ A B」の順に表します。",
    "related": [
      "reverse-polish"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "演算子を、その演算の対象より前に置く表記法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "infix-notation",
    "name": "中置記法",
    "reading": "Infix notation",
    "category": "基礎理論",
    "definition": "演算子を、その演算の対象の間に置く表記法です。",
    "example": "足し算を「A + B」の順に表します。",
    "related": [
      "reverse-polish"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "演算子を、その演算の対象の間に置く表記法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "logical-and",
    "name": "論理積",
    "reading": "Logical AND",
    "category": "基礎理論",
    "definition": "入力がともに真のときだけ真になる論理演算です。",
    "example": "二つの入力が1のときだけ、出力が1になります。",
    "related": [
      "logic-operation"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "入力がともに真のときだけ真になる論理演算",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "logical-or",
    "name": "論理和",
    "reading": "Logical OR",
    "category": "基礎理論",
    "definition": "入力の少なくとも一方が真なら真になる論理演算です。",
    "example": "二つの入力がともに0のときだけ、出力が0になります。",
    "related": [
      "logic-operation"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "入力の少なくとも一方が真なら真になる論理演算",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "nor",
    "name": "NOR素子",
    "reading": "NOT OR gate",
    "category": "基礎理論",
    "definition": "論理和の結果を反転し、入力がともに0のときだけ1を出力する論理素子です。",
    "example": "二つの入力のどちらかが1なら、出力は0になります。",
    "related": [
      "nand"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "論理和の結果を反転し、入力がともに0のときだけ1を出力する論理素子",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [],
    "aliases": [
      "NOR"
    ]
  },
  {
    "id": "de-morgan",
    "name": "ド・モルガンの法則",
    "reading": "De Morgan's laws",
    "category": "基礎理論",
    "definition": "論理積全体の否定は各入力を否定した論理和に、論理和全体の否定は各入力を否定した論理積になる法則です。",
    "example": "NOT(A AND B)を、(NOT A) OR (NOT B)に書き換えます。",
    "related": [
      "nand"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "論理積全体の否定は各入力を否定した論理和に、論理和全体の否定は各入力を否定した論理積になる法則",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ray-tracing",
    "name": "レイトレーシング",
    "reading": "Ray tracing",
    "category": "マルチメディア",
    "definition": "視点などから光線の経路を追跡し、物体の反射や屈折などを画像に反映する手法です。",
    "example": "鏡への映り込みや透明な物体を通る光を表現します。",
    "related": [
      "rendering"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "視点などから光線の経路を追跡し、物体の反射や屈折などを画像に反映する手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "radiosity",
    "name": "ラジオシティ法",
    "reading": "Radiosity",
    "category": "マルチメディア",
    "definition": "物体の面どうしの拡散光の相互反射を計算し、明るさや色を表現する手法です。",
    "example": "壁で反射した光が、別の面の明るさや色に影響する様子を表します。",
    "related": [
      "rendering"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "物体の面どうしの拡散光の相互反射を計算し、明るさや色を表現する手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "texture-mapping",
    "name": "テクスチャマッピング",
    "reading": "Texture mapping",
    "category": "マルチメディア",
    "definition": "物体の表面に画像を対応付け、模様や質感を表現する手法です。",
    "example": "立体モデルの表面に木目の画像を貼り付けます。",
    "related": [
      "rendering"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "物体の表面に画像を対応付け、模様や質感を表現する手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "metaball",
    "name": "メタボール",
    "reading": "Metaball",
    "category": "マルチメディア",
    "definition": "複数の影響場を合成して、融合するような滑らかな曲面を表す手法です。",
    "example": "近付けた球状の領域が、滑らかにつながる物体を表します。",
    "related": [
      "rendering"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "複数の影響場を合成して、融合するような滑らかな曲面を表す手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "hidden-surface-removal",
    "name": "隠面消去",
    "reading": "Hidden-surface removal",
    "category": "マルチメディア",
    "definition": "視点から見えない面を判定し、画像に描かないようにする処理です。",
    "example": "手前の物体に隠れる奥の面を描画から除きます。",
    "related": [
      "rendering"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "視点から見えない面を判定し、画像に描かないようにする処理",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "bitmap-font",
    "name": "ビットマップフォント",
    "reading": "Bitmap font",
    "category": "マルチメディア",
    "definition": "文字の形を画素の集まりとして表すフォントです。",
    "example": "拡大すると、元の画素の区切りが目立つことがあります。",
    "related": [
      "outline-font"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "文字の形を画素の集まりとして表すフォント",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "raster-format",
    "name": "ラスタ形式",
    "reading": "Raster format",
    "category": "マルチメディア",
    "definition": "画像を、格子状に並んだ画素の値で表す形式です。",
    "example": "写真を各画素の色の集まりとして保存します。",
    "related": [
      "svg"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "画像を、格子状に並んだ画素の値で表す形式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "vector-format",
    "name": "ベクター形式",
    "reading": "Vector format",
    "category": "マルチメディア",
    "definition": "線や曲線などの図形を、座標や描画命令で表す形式です。",
    "example": "図形の座標から描き直すため、拡大しても輪郭を滑らかに表示できます。",
    "related": [
      "svg"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "線や曲線などの図形を、座標や描画命令で表す形式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "png",
    "name": "PNG",
    "reading": "Portable Network Graphics",
    "category": "マルチメディア",
    "definition": "可逆圧縮や透過に対応するラスタ画像のファイル形式です。",
    "example": "画面の図やアイコンを、透過部分を保って保存します。",
    "related": [
      "svg"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "可逆圧縮や透過に対応するラスタ画像のファイル形式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "tiff",
    "name": "TIFF",
    "reading": "Tagged Image File Format",
    "category": "マルチメディア",
    "definition": "画像と関連情報をタグで保持する、ラスタ画像のファイル形式です。",
    "example": "スキャンした画像や高精細な画像を保存します。",
    "related": [
      "svg"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "画像と関連情報をタグで保持する、ラスタ画像のファイル形式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "w3c",
    "name": "W3C",
    "reading": "World Wide Web Consortium",
    "category": "マルチメディア",
    "definition": "Web技術に関する標準仕様の策定などを行う団体です。",
    "example": "Webの文書やデータを相互に扱えるようにする仕様を策定します。",
    "related": [
      "svg"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "Web技術に関する標準仕様の策定などを行う団体",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "sensor",
    "name": "センサー",
    "reading": "Sensor",
    "category": "システム構成",
    "definition": "温度や圧力などの物理量を検出し、電気信号などに変換する装置です。",
    "example": "温度を測り、その値を制御装置に送ります。",
    "related": [
      "actuator"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "温度や圧力などの物理量を検出し、電気信号などに変換する装置",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "fault-avoidance",
    "name": "フォールトアボイダンス",
    "reading": "Fault avoidance",
    "category": "システム構成",
    "definition": "部品や設計の品質を高め、故障そのものが起こりにくくする考え方です。",
    "example": "高品質な部品の採用や十分な試験で故障の発生を減らします。",
    "related": [
      "fault-tolerance"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "部品や設計の品質を高め、故障そのものが起こりにくくする考え方",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "roaming",
    "name": "ローミング",
    "reading": "Roaming",
    "category": "ネットワーク",
    "definition": "契約している事業者以外の通信網を利用してサービスを受ける仕組みです。",
    "example": "提携先の通信網を利用し、契約先の圏外でも通信します。",
    "related": [
      "mobile-network"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "契約している事業者以外の通信網を利用してサービスを受ける仕組み",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "tethering",
    "name": "テザリング",
    "reading": "Tethering",
    "category": "ネットワーク",
    "definition": "スマートフォンなどを中継して、他の端末をインターネットへ接続する機能です。",
    "example": "パソコンをスマートフォン経由でインターネットにつなぎます。",
    "related": [
      "mobile-network"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "スマートフォンなどを中継して、他の端末をインターネットへ接続する機能",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "fallback",
    "name": "フォールバック",
    "reading": "Fallback",
    "category": "ネットワーク",
    "definition": "通常の方式が使えないとき、利用できる代替方式に切り替えることです。",
    "example": "新しい通信方式が使えない場所で、別の対応方式に切り替えます。",
    "related": [
      "mobile-network"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "通常の方式が使えないとき、利用できる代替方式に切り替えること",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ping",
    "name": "ping",
    "reading": "Ping",
    "category": "ネットワーク",
    "definition": "ICMPの要求と応答などを使い、相手への到達性を確認するコマンドです。",
    "example": "相手から応答が返るかを確認して通信障害を切り分けます。",
    "related": [
      "network-commands"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ICMPの要求と応答などを使い、相手への到達性を確認するコマンド",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "ipconfig",
    "name": "ipconfig",
    "reading": "Internet Protocol configuration",
    "category": "ネットワーク",
    "definition": "Windowsで、自端末のIPアドレスなどのネットワーク設定を確認するコマンドです。",
    "example": "自端末のIPアドレスやデフォルトゲートウェイを確認します。",
    "related": [
      "network-commands"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "Windowsで、自端末のIPアドレスなどのネットワーク設定を確認するコマンド",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "netstat",
    "name": "netstat",
    "reading": "Network statistics",
    "category": "ネットワーク",
    "definition": "ネットワークの接続状態や待受けポートなどを確認するコマンドです。",
    "example": "どのポートで接続を待ち受けているかを確認します。",
    "related": [
      "network-commands"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "ネットワークの接続状態や待受けポートなどを確認するコマンド",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "data-poisoning",
    "name": "データポイズニング",
    "reading": "Data poisoning",
    "category": "攻撃手法",
    "definition": "学習データに不正なデータを混ぜ、モデルの学習結果や判断をゆがめる攻撃です。",
    "example": "誤ったラベルのデータを学習させ、特定の入力を誤分類させます。",
    "related": [
      "model-extraction"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "学習データに不正なデータを混ぜ、モデルの学習結果や判断をゆがめる攻撃",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "capacitive-sensing",
    "name": "静電容量方式",
    "reading": "Capacitive sensing",
    "category": "暗号・認証",
    "definition": "指などが近付いたときの静電容量の変化を利用して、接触位置などを検出する方式です。",
    "example": "タッチパネルで、指を触れた位置を検出します。",
    "related": [
      "ic-card"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "指などが近付いたときの静電容量の変化を利用して、接触位置などを検出する方式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "symmetric-key-crypto",
    "name": "共通鍵暗号方式",
    "reading": "Symmetric-key cryptography",
    "category": "暗号・認証",
    "definition": "暗号化と復号に同じ秘密の鍵を使う暗号方式です。",
    "example": "通信する両者が同じ鍵を安全に共有して使います。",
    "related": [
      "public-key-crypto"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "暗号化と復号に同じ秘密の鍵を使う暗号方式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "lattice-problem",
    "name": "格子問題",
    "reading": "Lattice problem",
    "category": "暗号・認証",
    "definition": "格子と呼ぶ点の集合に関する計算問題の総称で、耐量子計算機暗号の数学的な基盤に利用されます。",
    "example": "格子上の短いベクトルなどを求める問題の難しさを暗号に利用します。",
    "related": [
      "pqc"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "格子と呼ぶ点の集合に関する計算問題の総称で、耐量子計算機暗号の数学的な基盤に利用されます",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "full-backup",
    "name": "フルバックアップ",
    "reading": "Full backup",
    "category": "サービス管理",
    "definition": "対象の全データをまとめて複製するバックアップ方式です。",
    "example": "全データのバックアップを一つの世代として保存します。",
    "related": [
      "backup"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "対象の全データをまとめて複製するバックアップ方式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "differential-backup",
    "name": "差分バックアップ",
    "reading": "Differential backup",
    "category": "サービス管理",
    "definition": "直近のフルバックアップ以降に変更されたデータを複製する方式です。",
    "example": "復旧にはフルバックアップと最新の差分を使います。",
    "related": [
      "backup"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "直近のフルバックアップ以降に変更されたデータを複製する方式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "incremental-backup",
    "name": "増分バックアップ",
    "reading": "Incremental backup",
    "category": "サービス管理",
    "definition": "直前のバックアップ以降に変更されたデータを複製する方式です。",
    "example": "復旧にはフルバックアップと、それ以降の増分を順に適用します。",
    "related": [
      "backup"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "直前のバックアップ以降に変更されたデータを複製する方式",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "bottom-up-test",
    "name": "ボトムアップテスト",
    "reading": "Bottom-up test",
    "category": "開発技術",
    "definition": "下位のモジュールから順に結合し、未完成の上位部分をドライバで代用して行うテストです。",
    "example": "下位モジュールを呼び出すドライバを用意し、結合を進めます。",
    "related": [
      "integration-test"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "下位のモジュールから順に結合し、未完成の上位部分をドライバで代用して行うテスト",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "big-bang-test",
    "name": "ビッグバンテスト",
    "reading": "Big bang test",
    "category": "開発技術",
    "definition": "モジュールを一度に結合してテストする方法です。",
    "example": "全体をまとめて試験するため、不具合の箇所の切り分けが難しくなることがあります。",
    "related": [
      "integration-test"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "モジュールを一度に結合してテストする方法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "test-stub",
    "name": "スタブ",
    "reading": "Test stub",
    "category": "開発技術",
    "definition": "テスト対象から呼び出される未完成の下位モジュールなどを代用するプログラムです。",
    "example": "呼び出されたら、決められた値を返す代用品を作ります。",
    "related": [
      "integration-test"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "テスト対象から呼び出される未完成の下位モジュールなどを代用するプログラム",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "test-driver",
    "name": "ドライバ",
    "reading": "Test driver",
    "category": "開発技術",
    "definition": "テスト対象を呼び出す上位モジュールなどを代用するプログラムです。",
    "example": "引数を渡してテスト対象を実行し、戻り値を確認します。",
    "related": [
      "integration-test"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "テスト対象を呼び出す上位モジュールなどを代用するプログラム",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "swot",
    "name": "SWOT分析",
    "reading": "Strengths / Weaknesses / Opportunities / Threats analysis",
    "category": "経営戦略",
    "definition": "内部の強み・弱みと、外部の機会・脅威を整理する分析手法です。",
    "example": "自社の技術という強みを、市場の機会にどう生かすか検討します。",
    "related": [
      "environment-analysis"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "内部の強み・弱みと、外部の機会・脅威を整理する分析手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [],
    "aliases": [
      "SWOT"
    ]
  },
  {
    "id": "three-c",
    "name": "3C分析",
    "reading": "Customer / Competitor / Company analysis",
    "category": "経営戦略",
    "definition": "顧客・競合・自社という三つの視点で事業環境を分析する手法です。",
    "example": "顧客の要求、競合の提供内容、自社の強みを整理します。",
    "related": [
      "environment-analysis"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "顧客・競合・自社という三つの視点で事業環境を分析する手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": [],
    "aliases": [
      "3C"
    ]
  },
  {
    "id": "pest",
    "name": "PEST分析",
    "reading": "Political / Economic / Social / Technological analysis",
    "category": "経営戦略",
    "definition": "政治・経済・社会・技術という外部のマクロ環境を分析する手法です。",
    "example": "法規制や景気、社会の変化、技術動向を整理します。",
    "related": [
      "environment-analysis"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "政治・経済・社会・技術という外部のマクロ環境を分析する手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "vrio",
    "name": "VRIO分析",
    "reading": "Value / Rarity / Imitability / Organization analysis",
    "category": "経営戦略",
    "definition": "経営資源を、経済価値・希少性・模倣困難性・組織の観点で評価する手法です。",
    "example": "自社の技術が競争上の優位につながるかを評価します。",
    "related": [
      "environment-analysis"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "経営資源を、経済価値・希少性・模倣困難性・組織の観点で評価する手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "value-chain",
    "name": "バリューチェーン分析",
    "reading": "Value chain analysis",
    "category": "経営戦略",
    "definition": "事業活動を主活動や支援活動に分け、どこで価値が生まれるかを分析する手法です。",
    "example": "調達・製造・販売などの活動を分け、強化する活動を検討します。",
    "related": [
      "environment-analysis"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "事業活動を主活動や支援活動に分け、どこで価値が生まれるかを分析する手法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "pareto-chart",
    "name": "パレート図",
    "reading": "Pareto chart",
    "category": "経営管理",
    "definition": "項目を多い順に並べた棒グラフと累積比率で、重点的に扱う項目を示す図です。",
    "example": "不良件数を種類別に並べ、優先して改善する項目を見つけます。",
    "related": [
      "qc-tools"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "項目を多い順に並べた棒グラフと累積比率で、重点的に扱う項目を示す図",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "cause-effect-diagram",
    "name": "特性要因図",
    "reading": "Cause-and-effect diagram",
    "category": "経営管理",
    "definition": "結果となる特性と、その原因となる要因の関係を体系的に整理した図です。",
    "example": "不良が起こる原因を、人・機械・材料などの観点から整理します。",
    "related": [
      "qc-tools"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "結果となる特性と、その原因となる要因の関係を体系的に整理した図",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "matrix-diagram",
    "name": "マトリックス図",
    "reading": "Matrix diagram",
    "category": "経営管理",
    "definition": "行と列に並べた要素どうしの関係を、交点の記号などで整理する図です。",
    "example": "要求と担当部門の対応を表で確かめます。",
    "related": [
      "qc-tools"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "行と列に並べた要素どうしの関係を、交点の記号などで整理する図",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "relations-diagram",
    "name": "連関図",
    "reading": "Relations diagram",
    "category": "経営管理",
    "definition": "複雑に絡む原因と結果の関係を、矢印などでつないで整理する図です。",
    "example": "問題の要因がどのように影響し合うかを表します。",
    "related": [
      "qc-tools"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "複雑に絡む原因と結果の関係を、矢印などでつないで整理する図",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "brainstorming",
    "name": "ブレーンストーミング",
    "reading": "Brainstorming",
    "category": "技術戦略",
    "definition": "批判を控えて自由に多くの意見を出し、組合せや発展によって発想を広げる方法です。",
    "example": "会議の初期には評価を後回しにし、改善案を幅広く出します。",
    "related": [
      "delphi"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "批判を控えて自由に多くの意見を出し、組合せや発展によって発想を広げる方法",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "forecasting",
    "name": "フォアキャスティング",
    "reading": "Forecasting",
    "category": "経営戦略",
    "definition": "現在までのデータや傾向などを基に、将来の状態を予測する考え方です。",
    "example": "過去の販売傾向を延長して将来の需要を見積もります。",
    "related": [
      "backcasting"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "現在までのデータや傾向などを基に、将来の状態を予測する考え方",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "mergers-acquisitions",
    "name": "M&A",
    "reading": "Mergers and acquisitions",
    "category": "経営戦略",
    "definition": "企業の合併や買収によって、事業や経営資源を取得・統合することです。",
    "example": "他社の株式や事業を取得して経営資源を取り込みます。",
    "related": [
      "co-creation"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "企業の合併や買収によって、事業や経営資源を取得・統合すること",
        "hint": "この用語の意味や基本の仕組みを説明できますか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "author-moral-rights",
    "name": "著作者人格権",
    "reading": "Author's moral rights",
    "category": "法務",
    "definition": "著作者の人格的な利益を保護する権利で、著作者自身に属し譲渡できないものです。",
    "example": "著作物の氏名表示や、意に反する改変などに関する権利を扱います。",
    "related": [
      "copyright"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "著作者の人格的な利益を保護する権利で、著作者自身に属し譲渡できないもの",
        "hint": "どのような利益を保護する権利ですか？"
      }
    ],
    "commonMistakes": []
  },
  {
    "id": "right-of-integrity",
    "name": "同一性保持権",
    "reading": "Right of integrity",
    "category": "法務",
    "definition": "著作物などについて、著作者の意に反して改変されないことに関する権利です。",
    "example": "法律で認められる場合を除き、著作者の意に反する内容の変更を防ぎます。",
    "related": [
      "copyright"
    ],
    "criteria": [
      {
        "id": "meaning",
        "title": "著作物などについて、著作者の意に反して改変されないことに関する権利",
        "hint": "どのような利益を保護する権利ですか？"
      }
    ],
    "commonMistakes": []
  }
];

export const termById = new Map(terms.map(term => [term.id, term]));
// Question words find their term by name, by a part of the name in parentheses (PKI（公開鍵基盤）), or by an alias.
export const normalizeTermWord = (text: string) => text.normalize('NFKC').toLowerCase().replace(/ディジタル/g, 'デジタル').replace(/[\s・]/g, '');
const spellings = (term: Term) => [term.name, ...term.name.split(/[（）()]/).filter(Boolean), ...(term.aliases ?? [])];
const termByWord = new Map(terms.flatMap(term => spellings(term).map(word => [normalizeTermWord(word), term] as const)).reverse());
// Explicit names and aliases take priority over fragments inferred from parentheses.
// For example, CPI（コスト効率指数） must not replace the CPU term named CPI.
for (const term of terms.slice().reverse()) {
  for (const word of [term.name, ...(term.aliases ?? [])]) termByWord.set(normalizeTermWord(word), term);
}
export function termForWord(word: string): Term | undefined { return termByWord.get(normalizeTermWord(word)); }
export const termCategories = [...new Set(terms.map(term => term.category))];
