import { Component, type ReactNode } from 'react';
import { SITE_NAME, SiteBrand } from './site-brand';

type Props = { children: ReactNode; fallback: (error: Error, retry: () => void) => ReactNode };

export class RenderBoundary extends Component<Props, { error: Error | null }> {
  state: { error: Error | null } = { error: null };

  static getDerivedStateFromError(error: unknown) {
    return { error: error instanceof Error ? error : new Error(String(error)) };
  }

  retry = () => this.setState({ error: null });

  render() {
    return this.state.error ? this.props.fallback(this.state.error, this.retry) : this.props.children;
  }
}

export function AppRenderBoundary({ children }: { children: ReactNode }) {
  return <RenderBoundary fallback={(error, retry) => <div className="app-shell">
    <header className="site-header"><div className="header-inner"><a href="/" className="brand" aria-label={`${SITE_NAME} 学習ホーム`}><SiteBrand /></a></div></header>
    <div className="main-shell"><main className="main-content">
      <section className="empty-state" role="alert">
        <h1>画面を表示できませんでした</h1>
        <p>同じ画面を開き直して、学習を続けられます。</p>
        <button type="button" className="ui-button button-primary" onClick={retry}>同じ画面に戻る</button>
        <details className="render-error-details"><summary>エラーの詳細</summary><p>解消しない場合は、この内容をお知らせください。</p><pre>{error.stack ?? error.message}</pre></details>
      </section>
    </main></div>
  </div>}>{children}</RenderBoundary>;
}
