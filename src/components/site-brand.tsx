import { BookMarked } from 'lucide-react';

export const SITE_NAME = '俺のための情報処理安全確保支援士過去問対策サイト';

export function SiteBrand() {
  return <><span className="brand-icon"><BookMarked size={23} strokeWidth={1.8} aria-hidden="true" /></span><span className="brand-text">{SITE_NAME}</span></>;
}
