'use client'
import { useRouter } from 'next/navigation'

// Client-side "jump to a specific date" control for the AFOS Daily archive.
// Native date input keeps it accessible and browser-localized; min/max bound it
// to the available range. Editions are consecutive (no gaps), so any in-range
// date resolves; if a gap ever appears, the [date] page 404s gracefully.
export function DailyArchiveJump({
  locale,
  min,
  max,
  label,
  isBlue = false,
}: {
  locale: string
  min: string
  max: string
  label: string
  isBlue?: boolean
}) {
  const router = useRouter()
  return (
    <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-3">
      <label htmlFor="daily-jump" className={`text-sm font-medium ${isBlue ? 'text-blue-100' : 'text-gray-600'}`}>
        {label}
      </label>
      <input
        id="daily-jump"
        type="date"
        min={min}
        max={max}
        defaultValue={max}
        onChange={(e) => {
          if (e.target.value) router.push(`/${locale}/daily/${e.target.value}`)
        }}
        className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  )
}
