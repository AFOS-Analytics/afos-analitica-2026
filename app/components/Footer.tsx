'use client';

import { useTranslation, useLocale } from '../i18n/context';
import { EMAIL_CONTACT, EMAIL_SUPPORT, EMAIL_SECURITY, EMAIL_FOUNDER } from '../lib/contacts';

const GITHUB_URL = 'https://github.com/AFOS-Analytics/afos-analitica-2026';

const NAV_LABELS: Record<string, { title: string; dashboard: string; global: string; latam: string; eu: string; howItWorks: string }> = {
  'pt-BR': { title: 'Navegação', dashboard: 'Dashboard', global: 'Mapa Global', latam: 'América Latina', eu: 'Europa', howItWorks: 'O Método' },
  en:      { title: 'Navigation', dashboard: 'Dashboard', global: 'Global Map',  latam: 'Latin America',  eu: 'Europe', howItWorks: 'The Method' },
  es:      { title: 'Navegación', dashboard: 'Dashboard', global: 'Mapa Global', latam: 'América Latina', eu: 'Europa', howItWorks: 'El Método' },
}

const OSS_LABELS: Record<string, { title: string; license: string; github: string; security: string; contributing: string; conduct: string; governance: string; trademark: string }> = {
  'pt-BR': { title: 'Open Source', license: 'Licença Apache 2.0',  github: 'GitHub', security: 'Segurança', contributing: 'Contribuir',   conduct: 'Código de Conduta', governance: 'Governança',  trademark: 'Trademark' },
  en:      { title: 'Open Source', license: 'Apache 2.0 License',  github: 'GitHub', security: 'Security',  contributing: 'Contributing', conduct: 'Code of Conduct',   governance: 'Governance',  trademark: 'Trademark' },
  es:      { title: 'Open Source', license: 'Licencia Apache 2.0', github: 'GitHub', security: 'Seguridad', contributing: 'Contribuir',   conduct: 'Código de Conducta', governance: 'Gobernanza', trademark: 'Trademark' },
}

const LEGAL_LABELS: Record<string, { title: string; privacy: string; terms: string; sources: string; about: string }> = {
  'pt-BR': { title: 'Legal',          privacy: 'Política de Privacidade', terms: 'Termos de Uso', sources: 'Fontes de Dados', about: 'Sobre' },
  en:      { title: 'Legal',          privacy: 'Privacy Policy',           terms: 'Terms of Use',  sources: 'Data Sources',    about: 'About' },
  es:      { title: 'Legal',          privacy: 'Política de Privacidad',   terms: 'Términos de Uso', sources: 'Fuentes de Datos', about: 'Acerca de' },
}

type ContactKey = 'general' | 'support' | 'security' | 'founder'

const CONTACTS: Array<{ key: ContactKey; email: string; icon: string }> = [
  { key: 'general',  email: EMAIL_CONTACT,  icon: '📧' },
  { key: 'support',  email: EMAIL_SUPPORT,  icon: '💬' },
  { key: 'security', email: EMAIL_SECURITY, icon: '🔒' },
  { key: 'founder',  email: EMAIL_FOUNDER,  icon: '👤' },
]

const CONTACT_LABELS: Record<string, Record<ContactKey | 'title', string>> = {
  'pt-BR': { general: 'Contato',  support: 'Suporte', security: 'Segurança', founder: 'Founder', title: 'Fale Conosco' },
  en:      { general: 'Contact',  support: 'Support', security: 'Security',  founder: 'Founder', title: 'Get in Touch' },
  es:      { general: 'Contacto', support: 'Soporte', security: 'Seguridad', founder: 'Founder', title: 'Contáctenos' },
}

const SOCIAL_LABELS: Record<string, { title: string }> = {
  'pt-BR': { title: 'Redes Sociais' },
  en:      { title: 'Follow Us' },
  es:      { title: 'Síguenos' },
}

type SocialIconKey = 'github' | 'x' | 'bluesky' | 'producthunt'

const SOCIAL_PATHS: Record<SocialIconKey, string> = {
  github: 'M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12',
  x: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  bluesky: 'M12 10.8c-1.087-2.114-4.046-6.053-6.798-7.995C2.566.944 1.561 1.266.902 1.565.139 1.908 0 3.08 0 3.768c0 .69.378 5.65.624 6.479.815 2.736 3.713 3.66 6.383 3.364.136-.02.275-.039.415-.056-.138.022-.276.04-.415.056-3.912.58-7.387 2.005-2.83 7.078 5.013 5.19 6.87-1.113 7.823-4.308.953 3.195 2.05 9.271 7.733 4.308 4.267-4.308 1.172-6.498-2.74-7.078a8.741 8.741 0 01-.415-.056c.14.017.279.036.415.056 2.67.297 5.568-.628 6.383-3.364.246-.828.624-5.79.624-6.478 0-.69-.139-1.861-.902-2.206-.659-.298-1.664-.62-4.3 1.24C16.046 4.748 13.087 8.687 12 10.8z',
  producthunt: 'M13.604 8.4h-3.405V12h3.405a1.8 1.8 0 0 0 0-3.6zM12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zm1.604 14.4h-3.405V18H7.801V6h5.804a4.2 4.2 0 0 1 0 8.4z',
}

const SOCIALS: Array<{ name: string; url: string; icon: SocialIconKey }> = [
  { name: 'GitHub',       url: 'https://github.com/AFOS-Analytics/afos-analitica-2026', icon: 'github' },
  { name: 'X',            url: 'https://x.com/AFOS_Analytics',                          icon: 'x' },
  { name: 'Bluesky',      url: 'https://bsky.app/profile/afos-analytics.com',           icon: 'bluesky' },
  { name: 'Product Hunt', url: 'https://www.producthunt.com/@afosanalytics',            icon: 'producthunt' },
]

export function Footer() {
  const { t } = useTranslation();
  const locale = useLocale();
  const nav = NAV_LABELS[locale] || NAV_LABELS['en'];
  const oss = OSS_LABELS[locale] || OSS_LABELS['en'];
  const legal = LEGAL_LABELS[locale] || LEGAL_LABELS['en'];
  const labels = CONTACT_LABELS[locale] || CONTACT_LABELS['en'];
  const social = SOCIAL_LABELS[locale] || SOCIAL_LABELS['en'];

  return (
    <footer className="bg-primary text-white py-6 px-4 sm:px-8" role="contentinfo">
      <div className="max-w-6xl mx-auto">
        {/* BLOCO 1 + 2 + 3, Navegação + Open Source + Legal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6 text-xs">
          <div>
            <p className="font-semibold text-white/90 mb-2">{nav.title}</p>
            <a href={`/${locale}/dashboard`} className="block text-white/60 hover:text-white py-0.5">{nav.dashboard}</a>
            <a href={`/${locale}/global`} className="block text-white/60 hover:text-white py-0.5">{nav.global}</a>
            <a href={`/${locale}/latam`} className="block text-white/60 hover:text-white py-0.5">{nav.latam}</a>
            <a href={`/${locale}/eu`} className="block text-white/60 hover:text-white py-0.5">{nav.eu}</a>
            <a href={`/${locale}/how-it-works`} className="block text-white/60 hover:text-white py-0.5">{nav.howItWorks}</a>
          </div>
          <div>
            <p className="font-semibold text-white/90 mb-2">{oss.title}</p>
            <a href={`${GITHUB_URL}/blob/main/LICENSE`} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">{oss.license}</a>
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">⭐ {oss.github}</a>
            <a href={`${GITHUB_URL}/blob/main/SECURITY.md`} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">{oss.security}</a>
            <a href={`${GITHUB_URL}/blob/main/CONTRIBUTING.md`} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">{oss.contributing}</a>
            <a href={`${GITHUB_URL}/blob/main/CODE_OF_CONDUCT.md`} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">{oss.conduct}</a>
            <a href={`/${locale}/methodology/automated-governance`} className="block text-white/60 hover:text-white py-0.5">{oss.governance}</a>
            <a href={`${GITHUB_URL}/blob/main/TRADEMARK.md`} target="_blank" rel="noopener noreferrer" className="block text-white/60 hover:text-white py-0.5">{oss.trademark}</a>
          </div>
          <div>
            <p className="font-semibold text-white/90 mb-2">{legal.title}</p>
            <a href={`/${locale}/about`} className="block text-white/60 hover:text-white py-0.5">{legal.about}</a>
            <a href={`/${locale}/privacy`} className="block text-white/60 hover:text-white py-0.5">{legal.privacy}</a>
            <a href={`/${locale}/terms`} className="block text-white/60 hover:text-white py-0.5">{legal.terms}</a>
            <a href={`/${locale}/data-sources`} className="block text-white/60 hover:text-white py-0.5">{legal.sources}</a>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="border-t border-white/20 pt-4 pb-4 mb-4">
          <p className="text-[11px] uppercase tracking-widest text-white/50 mb-3 font-semibold">{social.title}</p>
          <div className="flex items-center gap-5">
            {SOCIALS.map(({ name, url, icon }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white transition-colors"
                aria-label={`${name} (opens in new tab)`}
                title={name}
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
                  <path d={SOCIAL_PATHS[icon]} />
                </svg>
              </a>
            ))}
          </div>
        </div>

        {/* BLOCO 3, Fale Conosco */}
        <div className="border-t border-white/20 pt-4 pb-4 mb-4">
          <p className="text-[11px] uppercase tracking-widest text-white/50 mb-3 font-semibold">{labels.title}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {CONTACTS.map(({ key, email, icon }) => (
              <a key={key} href={`mailto:${email}`} className="group flex items-start gap-2 p-2 rounded-lg hover:bg-white/5 transition-colors">
                <span aria-hidden className="text-base leading-none mt-0.5">{icon}</span>
                <span className="flex flex-col">
                  <span className="font-semibold text-white/90">{labels[key]}</span>
                  <span className="text-white/60 group-hover:text-white break-all">{email}</span>
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Rodapé, descrição + disclaimer + voltar ao topo */}
        <div className="text-center text-xs border-t border-white/20 pt-4">
          <p>{t('footer.description')}</p>
          <p className="mt-1 text-white/70">{t('footer.disclaimer')} <a href="https://polymarket.com/politics/brazil" target="_blank" rel="noopener noreferrer" className="underline hover:text-white" aria-label={t('footer.polymarketLink')}>{t('footer.polymarket')}</a> {t('footer.notAffiliated')}</p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/30 text-white/80 hover:text-white hover:bg-white/10 transition-all text-xs font-medium"
            aria-label={t('footer.backToTop')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M7 12V2M7 2L2.5 6.5M7 2L11.5 6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {t('footer.backToTop')}
          </button>
        </div>
      </div>
    </footer>
  );
}
