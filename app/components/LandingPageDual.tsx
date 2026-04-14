'use client';

import { useState, useRef, useEffect } from 'react';

/**
 * Landing Page — AFOS Analytics (Dual Theme)
 *
 * Abre em fundo branco. Botão seletor alterna para fundo azul primary.
 * Mesma estrutura e conteúdo das versões anteriores.
 *
 * Preview: /[locale]/preview-landing-dual
 */

interface LandingPageProps {
  locale?: 'pt-BR' | 'en' | 'es';
}

type Theme = 'light' | 'blue';

const CONTENT = {
  'pt-BR': {
    nav: { dashboard: 'Dashboard', about: 'Sobre', github: 'GitHub' },
    hero: {
      badge: 'Eleições 2026 — Dados em tempo real',
      title: 'Inteligência Eleitoral',
      titleHighlight: 'Global em Tempo Real',
      subtitle: 'Polymarket, pesquisas de 17+ institutos, notícias ao vivo e análises estratégicas — tudo em um único painel, gratuito e aberto.',
      cta: 'Acessar Dashboard',
      ctaSecondary: 'Saiba mais',
    },
    stats: [
      { value: '14', label: 'Países monitorados' },
      { value: '17+', label: 'Institutos de pesquisa' },
      { value: '60s', label: 'Atualização dos mercados' },
      { value: '100%', label: 'Gratuito e aberto' },
    ],
    features: {
      title: 'Tudo que você precisa para acompanhar eleições',
      subtitle: 'Dados de múltiplas fontes cruzados em tempo real',
      items: [
        { icon: 'chart', title: 'Mercados de Previsão', desc: 'Odds do Polymarket com dinheiro real — o indicador mais preciso de probabilidade eleitoral, atualizado a cada 60 segundos.' },
        { icon: 'poll', title: 'Pesquisas Eleitorais', desc: 'Dados oficiais do TSE + 17 institutos brasileiros. Cruzamento automático com odds dos mercados de previsão.' },
        { icon: 'globe', title: 'Mapa Global Interativo', desc: '14 países com eleições monitoradas. Visualização D3.js com dados agregados por região e candidato.' },
        { icon: 'news', title: 'Notícias ao Vivo', desc: 'Agregação automática de notícias políticas com categorização por tema e relevância eleitoral.' },
        { icon: 'brain', title: 'Análises Estratégicas', desc: 'Sentimento político, riscos econômicos e análise de cenários — atualizado com inteligência artificial.' },
        { icon: 'shield', title: 'Transparente e Seguro', desc: 'Código aberto no GitHub. Conformidade LGPD. Sem rastreamento invasivo. Seus dados são seus.' },
      ],
    },
    countries: { title: 'Eleições que monitoramos', subtitle: 'Cobertura global com foco na América Latina' },
    cta: {
      title: 'Pronto para acompanhar as eleições?',
      subtitle: 'Acesse o dashboard agora — sem cadastro, sem custo.',
      button: 'Acessar Dashboard',
      email: 'Ou receba análises semanais no seu email',
      placeholder: 'seu@email.com',
      subscribe: 'Inscrever-se',
      consent: 'Concordo em receber emails. Posso cancelar a qualquer momento.',
      success: 'Inscrito com sucesso!',
    },
    footer: {
      desc: 'Plataforma de inteligência eleitoral. Dados do Polymarket, TSE e fontes públicas.',
      disclaimer: 'Não somos afiliados ao Polymarket. Dados são informativos, não constituem recomendação.',
    },
  },
  en: {
    nav: { dashboard: 'Dashboard', about: 'About', github: 'GitHub' },
    hero: {
      badge: 'Elections 2026 — Real-time data',
      title: 'Global Election',
      titleHighlight: 'Intelligence in Real Time',
      subtitle: 'Polymarket, polls from 17+ institutes, live news and strategic analysis — all in one panel, free and open.',
      cta: 'Open Dashboard',
      ctaSecondary: 'Learn more',
    },
    stats: [
      { value: '14', label: 'Countries monitored' },
      { value: '17+', label: 'Polling institutes' },
      { value: '60s', label: 'Market refresh rate' },
      { value: '100%', label: 'Free and open source' },
    ],
    features: {
      title: 'Everything you need to track elections',
      subtitle: 'Multi-source data cross-referenced in real time',
      items: [
        { icon: 'chart', title: 'Prediction Markets', desc: 'Real-money Polymarket odds — the most accurate probability indicator for elections, updated every 60 seconds.' },
        { icon: 'poll', title: 'Electoral Polls', desc: 'Official TSE data + 17 Brazilian institutes. Automatic cross-analysis with prediction market odds.' },
        { icon: 'globe', title: 'Interactive Global Map', desc: '14 countries with monitored elections. D3.js visualization with data aggregated by region and candidate.' },
        { icon: 'news', title: 'Live News', desc: 'Automatic political news aggregation with categorization by topic and electoral relevance.' },
        { icon: 'brain', title: 'Strategic Analysis', desc: 'Political sentiment, economic risks and scenario analysis — updated with artificial intelligence.' },
        { icon: 'shield', title: 'Transparent & Secure', desc: 'Open source on GitHub. LGPD compliant. No invasive tracking. Your data is yours.' },
      ],
    },
    countries: { title: 'Elections we monitor', subtitle: 'Global coverage with focus on Latin America' },
    cta: {
      title: 'Ready to track elections?',
      subtitle: 'Access the dashboard now — no signup, no cost.',
      button: 'Open Dashboard',
      email: 'Or receive weekly analysis in your email',
      placeholder: 'you@email.com',
      subscribe: 'Subscribe',
      consent: 'I agree to receive emails. I can unsubscribe anytime.',
      success: 'Subscribed successfully!',
    },
    footer: {
      desc: 'Election intelligence platform. Data from Polymarket, TSE and public sources.',
      disclaimer: 'Not affiliated with Polymarket. Data is informational, not a recommendation.',
    },
  },
  es: {
    nav: { dashboard: 'Dashboard', about: 'Acerca de', github: 'GitHub' },
    hero: {
      badge: 'Elecciones 2026 — Datos en tiempo real',
      title: 'Inteligencia Electoral',
      titleHighlight: 'Global en Tiempo Real',
      subtitle: 'Polymarket, encuestas de 17+ institutos, noticias en vivo y analisis estrategicos — todo en un panel, gratuito y abierto.',
      cta: 'Abrir Dashboard',
      ctaSecondary: 'Saber mas',
    },
    stats: [
      { value: '14', label: 'Paises monitoreados' },
      { value: '17+', label: 'Institutos de encuestas' },
      { value: '60s', label: 'Actualizacion de mercados' },
      { value: '100%', label: 'Gratuito y abierto' },
    ],
    features: {
      title: 'Todo lo que necesitas para seguir elecciones',
      subtitle: 'Datos de multiples fuentes cruzados en tiempo real',
      items: [
        { icon: 'chart', title: 'Mercados de Prediccion', desc: 'Probabilidades de Polymarket con dinero real — el indicador mas preciso de probabilidad electoral, actualizado cada 60 segundos.' },
        { icon: 'poll', title: 'Encuestas Electorales', desc: 'Datos oficiales del TSE + 17 institutos brasilenhos. Cruce automatico con probabilidades de mercados.' },
        { icon: 'globe', title: 'Mapa Global Interactivo', desc: '14 paises con elecciones monitoreadas. Visualizacion D3.js con datos agregados por region y candidato.' },
        { icon: 'news', title: 'Noticias en Vivo', desc: 'Agregacion automatica de noticias politicas con categorizacion por tema y relevancia electoral.' },
        { icon: 'brain', title: 'Analisis Estrategico', desc: 'Sentimiento politico, riesgos economicos y analisis de escenarios — actualizado con inteligencia artificial.' },
        { icon: 'shield', title: 'Transparente y Seguro', desc: 'Codigo abierto en GitHub. Cumplimiento LGPD. Sin rastreo invasivo. Tus datos son tuyos.' },
      ],
    },
    countries: { title: 'Elecciones que monitoreamos', subtitle: 'Cobertura global con foco en America Latina' },
    cta: {
      title: 'Listo para seguir las elecciones?',
      subtitle: 'Accede al dashboard ahora — sin registro, sin costo.',
      button: 'Abrir Dashboard',
      email: 'O recibe analisis semanales en tu email',
      placeholder: 'tu@email.com',
      subscribe: 'Suscribirse',
      consent: 'Acepto recibir emails. Puedo cancelar en cualquier momento.',
      success: 'Suscrito con exito!',
    },
    footer: {
      desc: 'Plataforma de inteligencia electoral. Datos de Polymarket, TSE y fuentes publicas.',
      disclaimer: 'No estamos afiliados a Polymarket. Los datos son informativos, no constituyen recomendacion.',
    },
  },
};

const COUNTRIES = [
  { code: 'br', name: 'Brasil', year: '2026' },
  { code: 'fr', name: 'France', year: '2027' },
  { code: 'de', name: 'Germany', year: '2025' },
  { code: 'gb', name: 'UK', year: '2029' },
  { code: 'ca', name: 'Canada', year: '2025' },
  { code: 'co', name: 'Colombia', year: '2026' },
  { code: 'cl', name: 'Chile', year: '2025' },
  { code: 'kr', name: 'South Korea', year: '2027' },
  { code: 'au', name: 'Australia', year: '2025' },
  { code: 'in', name: 'India', year: '2029' },
  { code: 'mx', name: 'Mexico', year: '2030' },
  { code: 'ng', name: 'Nigeria', year: '2027' },
  { code: 'ph', name: 'Philippines', year: '2028' },
  { code: 'us', name: 'USA', year: '2028' },
];

function Icon({ name }: { name: string }) {
  const icons: Record<string, JSX.Element> = {
    chart: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        <path d="M7 16l4-6 4 4 5-8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    poll: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="3" y="12" width="4" height="9" rx="1" fill="currentColor" opacity="0.3" />
        <rect x="10" y="7" width="4" height="14" rx="1" fill="currentColor" opacity="0.6" />
        <rect x="17" y="3" width="4" height="18" rx="1" fill="currentColor" />
      </svg>
    ),
    globe: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
        <path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    news: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <rect x="3" y="4" width="18" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
        <path d="M7 8h4v4H7zM13 8h4M13 12h4M7 16h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    brain: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 2a7 7 0 00-5.6 11.2L12 22l5.6-8.8A7 7 0 0012 2z" stroke="currentColor" strokeWidth="2" />
        <circle cx="12" cy="9" r="2.5" stroke="currentColor" strokeWidth="2" />
      </svg>
    ),
    shield: (
      <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
        <path d="M12 3l7 3v5c0 4.5-3 8.5-7 10-4-1.5-7-5.5-7-10V6l7-3z" stroke="currentColor" strokeWidth="2" />
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  };
  return icons[name] || null;
}

// ─── Hook: fechar dropdown ao clicar fora ───────────────────────────

function useClickOutside(ref: React.RefObject<HTMLDivElement | null>, onClose: () => void) {
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onCloseRef.current();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [ref]);
}

// ─── Seletor de Idioma (Globo + código) ─────────────────────────────

type Locale = 'pt-BR' | 'en' | 'es';
const LOCALE_LABELS: Record<Locale, string> = { 'pt-BR': 'BR', en: 'EN', es: 'ES' };

function LangSwitcher({ current, onSelect, isBlue }: { current: Locale; onSelect: (l: Locale) => void; isBlue: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const color = isBlue ? '#ffffff' : '#1a1a1a';
  const hoverBg = isBlue ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)';

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', gap: 4, cursor: 'pointer', padding: '6px 8px', borderRadius: 8 }}
        onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8">
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3c2.5 2.5 4 5.5 4 9s-1.5 6.5-4 9c-2.5-2.5-4-5.5-4-9s1.5-6.5 4-9z" />
        </svg>
        <span style={{ fontSize: 13, fontWeight: 700, color, letterSpacing: 0.5 }}>{LOCALE_LABELS[current]}</span>
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 40, right: 0, zIndex: 100,
          background: isBlue ? '#0a3d8f' : '#ffffff',
          border: isBlue ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e2e8f0',
          borderRadius: 10, padding: 4, minWidth: 100,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}>
          {(['pt-BR', 'en', 'es'] as Locale[]).map((loc) => (
            <div
              key={loc}
              onClick={() => { onSelect(loc); setOpen(false); }}
              style={{
                padding: '8px 12px', cursor: 'pointer', borderRadius: 7, fontSize: 13, fontWeight: 600,
                color: current === loc ? (isBlue ? '#ffffff' : '#0F52BA') : (isBlue ? 'rgba(255,255,255,0.6)' : '#64748b'),
                background: current === loc ? (isBlue ? 'rgba(255,255,255,0.12)' : 'rgba(15,82,186,0.08)') : 'transparent',
                display: 'flex', alignItems: 'center', gap: 8,
              }}
              onMouseEnter={(e) => { if (current !== loc) e.currentTarget.style.background = isBlue ? 'rgba(255,255,255,0.08)' : '#f1f5f9'; }}
              onMouseLeave={(e) => { if (current !== loc) e.currentTarget.style.background = 'transparent'; }}
            >
              <span>{LOCALE_LABELS[loc]}</span>
              <span style={{ fontWeight: 400, fontSize: 11, opacity: 0.6 }}>
                {loc === 'pt-BR' ? 'Portugues' : loc === 'en' ? 'English' : 'Espanol'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Seletor de Tema (Sol) ──────────────────────────────────────────

function ThemeSwitcher({ current, onSelect, isBlue }: { current: Theme; onSelect: (t: Theme) => void; isBlue: boolean }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useClickOutside(ref, () => setOpen(false));

  const color = isBlue ? '#ffffff' : '#1a1a1a';
  const hoverBg = isBlue ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.05)';

  return (
    <div ref={ref} style={{ position: 'relative', flexShrink: 0 }}>
      <div
        onClick={() => setOpen(!open)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, cursor: 'pointer', borderRadius: 8 }}
        onMouseEnter={(e) => (e.currentTarget.style.background = hoverBg)}
        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      </div>

      {open && (
        <div style={{
          position: 'absolute', top: 40, right: 0, zIndex: 100,
          background: isBlue ? '#0a3d8f' : '#ffffff',
          border: isBlue ? '1px solid rgba(255,255,255,0.15)' : '1px solid #e2e8f0',
          borderRadius: 10, padding: 4,
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
          display: 'flex', gap: 6,
        }}>
          {/* Branco */}
          <div
            onClick={() => { onSelect('light'); setOpen(false); }}
            style={{
              width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
              background: '#ffffff',
              border: current === 'light' ? '2.5px solid #0F52BA' : (isBlue ? '1.5px solid rgba(255,255,255,0.25)' : '1.5px solid #e2e8f0'),
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {current === 'light' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0F52BA" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
          {/* Azul */}
          <div
            onClick={() => { onSelect('blue'); setOpen(false); }}
            style={{
              width: 34, height: 34, borderRadius: 8, cursor: 'pointer',
              background: '#0F52BA',
              border: current === 'blue' ? '2.5px solid #ffffff' : '1.5px solid rgba(15,82,186,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            {current === 'blue' && (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 13l4 4L19 7" />
              </svg>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Tokens por tema ────────────────────────────────────────────────

function useThemeTokens(theme: Theme) {
  if (theme === 'blue') {
    return {
      pageBg: 'bg-primary',
      navBg: 'rgba(15, 82, 186, 0.9)',
      navBorder: 'border-white/15',
      logo: 'text-white',
      navLink: 'text-white/60 hover:text-white',
      navBtn: 'bg-white text-primary hover:bg-blue-50',
      badge: 'bg-white/15 text-white',
      title: 'text-white',
      highlight: 'text-blue-200',
      subtitle: 'text-blue-200/80',
      ctaPrimary: 'bg-white text-primary hover:bg-blue-50 shadow-lg shadow-black/15',
      ctaSecondary: 'border border-white/30 text-white hover:bg-white/10',
      statsBg: 'bg-primary-dark border-white/15',
      statValue: 'text-white',
      statLabel: 'text-blue-200/60',
      sectionBg: '',
      cardBg: 'bg-white/10 border-white/15 hover:bg-white/15 hover:border-white/25',
      iconBox: 'bg-white/15 text-white group-hover:bg-white group-hover:text-primary',
      cardTitle: 'text-white',
      cardDesc: 'text-blue-200/60',
      sectionTitle: 'text-white',
      sectionSub: 'text-blue-200/60',
      countriesBg: 'bg-primary-dark border-white/15',
      countryCard: 'bg-white/10 border-white/15 hover:bg-white/15 hover:border-white/25',
      countryName: 'text-white',
      countryYear: 'text-blue-200/40',
      ctaTitle: 'text-white',
      ctaSub: 'text-blue-200/60',
      ctaBtn: 'bg-white text-primary hover:bg-blue-50 shadow-lg shadow-black/15',
      divider: 'border-white/15',
      emailHint: 'text-blue-200/50',
      inputBg: 'bg-white/10 border-white/20 text-white placeholder-blue-200/40 focus:border-white/40 focus:ring-white/15',
      subscribeBtn: 'bg-white text-primary hover:bg-blue-50',
      consentText: 'text-blue-200/50',
      checkAccent: 'accent-white',
      successColor: 'text-green-300',
      footerBg: 'bg-primary-dark border-white/15',
      footerText: 'text-white/60',
      footerDim: 'text-white/40',
      footerLink: 'text-white/50 hover:text-white',
    };
  }
  return {
    pageBg: 'bg-white',
    navBg: 'rgba(255, 255, 255, 0.8)',
    navBorder: 'border-light-border',
    logo: 'text-primary',
    navLink: 'text-gray-500 hover:text-dark',
    navBtn: 'bg-primary text-white hover:bg-primary-dark',
    badge: 'bg-primary/10 text-primary',
    title: 'text-dark',
    highlight: 'text-primary',
    subtitle: 'text-gray-500',
    ctaPrimary: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25',
    ctaSecondary: 'border border-light-border text-dark hover:bg-light-bg',
    statsBg: 'bg-light-bg border-light-border',
    statValue: 'text-primary',
    statLabel: 'text-gray-500',
    sectionBg: '',
    cardBg: 'border-light-border hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
    iconBox: 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white',
    cardTitle: 'text-dark',
    cardDesc: 'text-gray-500',
    sectionTitle: 'text-dark',
    sectionSub: 'text-gray-500',
    countriesBg: 'bg-light-bg border-light-border',
    countryCard: 'bg-white border-light-border hover:border-primary/30 hover:shadow-sm',
    countryName: 'text-dark',
    countryYear: 'text-gray-400',
    ctaTitle: 'text-dark',
    ctaSub: 'text-gray-500',
    ctaBtn: 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/25',
    divider: 'border-light-border',
    emailHint: 'text-gray-400',
    inputBg: 'border-light-border text-dark placeholder-gray-400 focus:border-primary focus:ring-primary/20 bg-white',
    subscribeBtn: 'bg-primary text-white hover:bg-primary-dark',
    consentText: 'text-gray-400',
    checkAccent: 'accent-primary',
    successColor: 'text-green-600',
    footerBg: 'bg-primary border-transparent',
    footerText: 'text-white/70',
    footerDim: 'text-white/50',
    footerLink: 'text-white/60 hover:text-white',
  };
}

// ─── Component ──────────────────────────────────────────────────────

import { getOrCreateVisitorId } from '../../lib/visitor/id';
import { SUBSCRIBED_LS_KEY } from '../../lib/visitor/constants';
import { SubscribeForm } from './SubscribeForm';

export function LandingPageDual({ locale: initialLocale = 'pt-BR' }: LandingPageProps) {
  const [locale, setLocale] = useState<Locale>(initialLocale);
  const t = CONTENT[locale];
  const [theme, setTheme] = useState<Theme>('light');
  const [visitorId, setVisitorId] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const featuresRef = useRef<HTMLElement>(null);
  const tk = useThemeTokens(theme);

  const dashboardUrl = `/${locale}/dashboard`;

  useEffect(() => {
    setVisitorId(getOrCreateVisitorId());
    try { if (localStorage.getItem(SUBSCRIBED_LS_KEY) === 'true') setSubscribed(true); } catch {}
  }, []);

  const handleSubscribeSuccess = () => {
    setSubscribed(true);
    try { localStorage.setItem(SUBSCRIBED_LS_KEY, 'true'); } catch {}
  };

  const isBlueTheme = theme === 'blue';

  // Sync body background with theme (overrides !important in globals.css)
  useEffect(() => {
    const bg = isBlueTheme ? '#0F52BA' : '#ffffff';
    document.documentElement.style.cssText = `background: ${bg} !important`;
    document.body.style.cssText = `background: ${bg} !important; color: ${isBlueTheme ? '#ffffff' : '#1a1a1a'}; font-family: Arial, Helvetica, sans-serif; overflow-x: hidden; width: 100%; max-width: 100vw; min-height: 100vh; margin: 0; padding: 0;`;
    return () => {
      // Reset on unmount (navigating away from landing)
      document.documentElement.style.cssText = '';
      document.body.style.cssText = '';
    };
  }, [isBlueTheme]);

  return (
    <div className="min-h-screen transition-colors duration-500" style={{ background: isBlueTheme ? '#0F52BA' : '#ffffff' }}>
      {/* ─── Nav ─────────────────────────────────────────────── */}
      <nav className={`fixed top-0 w-full z-50 border-b ${tk.navBorder} transition-colors duration-500`} style={{ background: tk.navBg, backdropFilter: 'blur(12px)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span className={`font-extrabold text-lg tracking-tight transition-colors duration-500 ${tk.logo}`}>AFOS Analytics</span>
          <div className="flex items-center gap-2 sm:gap-3">
            <LangSwitcher current={locale} onSelect={setLocale} isBlue={isBlueTheme} />
            <ThemeSwitcher current={theme} onSelect={setTheme} isBlue={isBlueTheme} />
            <a href={dashboardUrl} className={`text-xs sm:text-sm font-semibold px-4 py-2 rounded-lg transition-colors duration-500 ${tk.navBtn}`}>
              {t.nav.dashboard}
            </a>
          </div>
        </div>
      </nav>

      {/* ─── Hero ────────────────────────────────────────────── */}
      <section className="pt-28 sm:pt-36 pb-16 sm:pb-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <span className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mb-6 transition-colors duration-500 ${tk.badge}`}>
            {t.hero.badge}
          </span>
          <h1 className={`text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight transition-colors duration-500 ${tk.title}`}>
            {t.hero.title}{' '}
            <span className={`transition-colors duration-500 ${tk.highlight}`}>{t.hero.titleHighlight}</span>
          </h1>
          <p className={`mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed transition-colors duration-500 ${tk.subtitle}`}>
            {t.hero.subtitle}
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href={dashboardUrl} className={`w-full sm:w-auto font-semibold px-8 py-3.5 rounded-xl transition-all duration-500 text-center ${tk.ctaPrimary}`}>
              {t.hero.cta}
            </a>
            <button onClick={() => featuresRef.current?.scrollIntoView({ behavior: 'smooth' })} className={`w-full sm:w-auto font-semibold px-8 py-3.5 rounded-xl transition-all duration-500 text-center ${tk.ctaSecondary}`}>
              {t.hero.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      {/* ─── Stats ───────────────────────────────────────────── */}
      <section className={`border-y py-10 px-4 transition-colors duration-500 ${tk.statsBg}`}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
          {t.stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className={`text-3xl sm:text-4xl font-extrabold transition-colors duration-500 ${tk.statValue}`}>{s.value}</p>
              <p className={`text-xs sm:text-sm mt-1 transition-colors duration-500 ${tk.statLabel}`}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── Features ────────────────────────────────────────── */}
      <section ref={featuresRef} className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className={`text-2xl sm:text-3xl font-extrabold transition-colors duration-500 ${tk.sectionTitle}`}>{t.features.title}</h2>
            <p className={`mt-2 text-sm sm:text-base transition-colors duration-500 ${tk.sectionSub}`}>{t.features.subtitle}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {t.features.items.map((f) => (
              <div key={f.title} className={`group rounded-2xl p-6 border transition-all duration-500 ${tk.cardBg}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 transition-colors duration-500 ${tk.iconBox}`}>
                  <Icon name={f.icon} />
                </div>
                <h3 className={`font-bold text-base mb-2 transition-colors duration-500 ${tk.cardTitle}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed transition-colors duration-500 ${tk.cardDesc}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Countries ───────────────────────────────────────── */}
      <section className={`border-y py-16 sm:py-20 px-4 transition-colors duration-500 ${tk.countriesBg}`}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className={`text-2xl sm:text-3xl font-extrabold transition-colors duration-500 ${tk.sectionTitle}`}>{t.countries.title}</h2>
            <p className={`mt-2 text-sm sm:text-base transition-colors duration-500 ${tk.sectionSub}`}>{t.countries.subtitle}</p>
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            {COUNTRIES.map((c) => (
              <div key={c.name} className={`flex items-center gap-2 rounded-xl px-4 py-2.5 border transition-all duration-500 ${tk.countryCard}`}>
                <img src={`/flags/${c.code}.svg`} alt={c.name} width={24} height={16} className="rounded-sm object-cover" style={{ width: 24, height: 16 }} />
                <span className={`text-sm font-medium transition-colors duration-500 ${tk.countryName}`}>{c.name}</span>
                <span className={`text-[10px] font-mono transition-colors duration-500 ${tk.countryYear}`}>{c.year}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── CTA Final ───────────────────────────────────────── */}
      <section className="py-16 sm:py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className={`text-2xl sm:text-3xl font-extrabold transition-colors duration-500 ${tk.ctaTitle}`}>{t.cta.title}</h2>
          <p className={`mt-2 text-sm sm:text-base transition-colors duration-500 ${tk.ctaSub}`}>{t.cta.subtitle}</p>
          <a href={dashboardUrl} className={`inline-block mt-6 font-semibold px-10 py-4 rounded-xl transition-all duration-500 ${tk.ctaBtn}`}>
            {t.cta.button}
          </a>

          <div className={`mt-12 pt-10 border-t transition-colors duration-500 ${tk.divider}`}>
            <p className={`text-sm mb-4 transition-colors duration-500 ${tk.emailHint}`}>{t.cta.email}</p>
            {subscribed ? (
              <div className={`flex items-center justify-center gap-2 font-semibold ${tk.successColor}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {t.cta.success}
              </div>
            ) : (
              <div className="max-w-sm mx-auto">
                <SubscribeForm
                  visitorId={visitorId}
                  captureSource="landing"
                  onSuccess={handleSubscribeSuccess}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Footer ──────────────────────────────────────────── */}
      <footer className={`border-t py-8 px-4 transition-colors duration-500 ${tk.footerBg}`}>
        <div className="max-w-4xl mx-auto text-center text-xs">
          <p className="font-bold text-white text-base mb-2">AFOS Analytics</p>
          <p className={`transition-colors duration-500 ${tk.footerText}`}>{t.footer.desc}</p>
          <p className={`mt-2 transition-colors duration-500 ${tk.footerDim}`}>{t.footer.disclaimer}</p>
          <div className={`mt-4 flex items-center justify-center gap-4 transition-colors duration-500 ${tk.footerLink}`}>
            <a href={dashboardUrl} className="hover:text-white transition-colors">Dashboard</a>
            <a href="https://github.com/andrefelipe-afos/afos-analitica-2026" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
