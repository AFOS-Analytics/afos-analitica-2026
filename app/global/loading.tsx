import { MAP_TOKENS } from '../lib/map-colors';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: MAP_TOKENS.bg }}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4" style={{ borderColor: MAP_TOKENS.primary }} />
        <p className="font-semibold text-sm" style={{ color: MAP_TOKENS.text }}>Loading Global Map...</p>
        <p className="text-xs mt-1" style={{ color: MAP_TOKENS.textMuted }}>Fetching election data from prediction markets</p>
      </div>
    </div>
  );
}
