import type { NewsData, NewsItem } from '../types';
import { SectionTitle } from './ui';
import { LogicLink } from './LogicLink';
import { useTranslation } from '../i18n/context';

/** Validar URL para prevenir javascript: protocol injection (OWASP A03) */
function isSafeUrl(url: string | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

interface Props {
  news: NewsData | null;
}

export function NewsSection({ news }: Props) {
  const { t } = useTranslation();
  if (!news || news.totalNews <= 0) return null;

  return (
    <section>
      <SectionTitle icon="📰" rightSlot={<LogicLink anchor="live-news" />}>{t('sections.news')}</SectionTitle>
      <div className="bg-light-bg border border-light-border rounded-xl p-4 sm:p-6 mb-4">
        <div className="flex flex-wrap justify-between items-center mb-4">
          <p className="text-xs text-gray-500">🔄 {t('sections.newsUpdated')} | {t('sections.lastUpdate')}: <span className="font-semibold text-primary">{news.updatedAt} BRT</span></p>
          <span className="text-xs text-gray-400">{news.totalNews} {t('sections.newsCollected')}</span>
        </div>
        <p className="text-xs text-gray-500 mb-4">{t('sections.newsSources')} | CNN Brasil, TV Globo, Folha de S.Paulo, Estadão, Metrópoles, Poder360, Valor Econômico, Gazeta do Povo, Jovem Pan, Correio Braziliense, Band, Record, SBT, Veja, IstoÉ, Época, X/Twitter</p>

        <div className="space-y-4">
          {Object.entries(news.grouped || {}).map(([cat, items]) => {
            const newsItems = items as NewsItem[];
            return (
            newsItems && newsItems.length > 0 ? (
              <div key={cat}>
                <h4 className="font-bold text-sm text-primary mb-2 border-b border-light-border pb-1">{cat}</h4>
                <div className="space-y-2">
                  {newsItems.map((n: NewsItem, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-xs border-b border-gray-100 pb-2">
                      <span className="text-gray-400 flex-shrink-0 mt-0.5 min-w-[70px]">{n.time || '—'}</span>
                      <div className="flex-1">
                        {isSafeUrl(n.url) ? (
                          <a href={n.url} target="_blank" rel="noopener noreferrer" className="text-dark hover:text-primary hover:underline leading-snug font-medium">
                            {n.title}
                          </a>
                        ) : (
                          <span className="text-dark leading-snug font-medium">{n.title}</span>
                        )}
                        <span className="text-gray-400 ml-1">— {n.source}</span>
                        {n.summary && <p className="text-gray-500 mt-1 leading-relaxed">{n.summary}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null);
          })}
        </div>
      </div>
    </section>
  );
}
