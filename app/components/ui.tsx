'use client';

export function SectionTitle({ children, icon }: { children: React.ReactNode; icon?: string }) {
  return (
    <h2 className="text-2xl font-bold text-[#1a1a1a] mb-4 flex items-center gap-2">
      {icon && <span>{icon}</span>}
      {children}
    </h2>
  );
}

export function Card({ children, className = '', style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={`bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-6 ${className}`} style={style}>
      {children}
    </div>
  );
}

export function HBar({ value, max, color, label, suffix = '%' }: { value: number; max: number; color: string; label: string; suffix?: string }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-semibold text-[#1a1a1a]">{label}</span>
        <span className="font-bold" style={{ color }}>{value.toFixed(1)}{suffix}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-5 overflow-hidden">
        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

export function Stars({ count }: { count: number }) {
  return (
    <span className="inline-flex gap-0.5 text-sm" aria-label={`${count} de 5 estrelas`}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} style={{ color: i < count ? '#0F52BA' : '#D1D5DB' }} aria-hidden="true">★</span>
      ))}
    </span>
  );
}
