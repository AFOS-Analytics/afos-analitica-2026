import type { ReactNode } from 'react'

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/40 border-l-4 border-primary dark:border-blue-400 rounded-r-lg p-5 my-5">
      <div className="text-xs font-bold text-primary dark:text-blue-200 uppercase tracking-wider mb-2">{title}</div>
      <div className="text-gray-700 dark:text-blue-50 text-sm leading-relaxed [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1">
        {children}
      </div>
    </div>
  )
}

export function Card({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <div id={id} className="bg-white dark:bg-blue-900/40 border-l-4 border-primary dark:border-blue-400 rounded-lg p-5 my-4 shadow-sm scroll-mt-24">
      <div className="font-bold text-primary dark:text-blue-200 text-base mb-2">{title}</div>
      <div className="text-gray-700 dark:text-blue-50 text-sm leading-relaxed [&>p]:mb-2 [&>p>strong]:text-primary dark:[&>p>strong]:text-blue-200">
        {children}
      </div>
    </div>
  )
}

export function SectionIntro({ children }: { children: ReactNode }) {
  return (
    <div className="bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 rounded-r-md p-4 my-5 text-sm text-yellow-900 dark:text-yellow-100">
      {children}
    </div>
  )
}

export function NavFlag({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-primary to-blue-600 dark:bg-none dark:bg-white text-white rounded-xl p-6 my-12 text-center dark:shadow-lg">
      <h2 className="text-xl font-bold m-0 border-0 text-white dark:text-primary">{title}</h2>
      <p className="text-white/90 dark:text-gray-600 text-sm mt-2">{description}</p>
    </div>
  )
}

export function SummaryFrame({ children }: { children: ReactNode }) {
  return (
    <div className="bg-[#0a3d8f] dark:bg-white border-2 border-blue-400/40 dark:border-primary rounded-xl p-7 my-10 text-center shadow-lg">
      <p className="text-lg font-semibold text-white dark:text-primary italic leading-relaxed m-0">{children}</p>
    </div>
  )
}

export function TocCol({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-bold text-gray-700 dark:text-blue-100 uppercase tracking-wide border-b border-gray-200 dark:border-blue-800 pb-1 mb-2 m-0">{heading}</h4>
      <ul className="list-none m-0 p-0 text-sm">{children}</ul>
    </div>
  )
}

export function TocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li className="py-0.5">
      <a href={href} className="text-slate-700 dark:text-blue-100 hover:text-primary dark:hover:text-white hover:underline no-underline transition-colors">
        {children}
      </a>
    </li>
  )
}
