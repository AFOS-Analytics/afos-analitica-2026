import type { ReactNode } from 'react'

export function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="bg-blue-50 border-l-4 border-primary rounded-r-lg p-5 my-5">
      <div className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{title}</div>
      <div className="text-gray-700 text-sm leading-relaxed [&>p]:mb-2 [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-1">
        {children}
      </div>
    </div>
  )
}

export function Card({ title, children, id }: { title: string; children: ReactNode; id?: string }) {
  return (
    <div id={id} className="bg-white border-l-4 border-primary rounded-lg p-5 my-4 shadow-sm scroll-mt-24">
      <div className="font-bold text-primary text-base mb-2">{title}</div>
      <div className="text-gray-700 text-sm leading-relaxed [&>p]:mb-2 [&>p>strong]:text-primary">
        {children}
      </div>
    </div>
  )
}

export function SectionIntro({ children }: { children: ReactNode }) {
  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded-r-md p-4 my-5 text-sm text-yellow-900">
      {children}
    </div>
  )
}

export function NavFlag({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-primary to-blue-600 text-white rounded-xl p-6 my-12 text-center">
      <h2 className="text-xl font-bold m-0 border-0 text-white">{title}</h2>
      <p className="text-white/90 text-sm mt-2">{description}</p>
    </div>
  )
}

export function SummaryFrame({ children }: { children: ReactNode }) {
  return (
    <div className="bg-white border-2 border-primary rounded-xl p-7 my-10 text-center">
      <p className="text-lg font-semibold text-primary italic leading-relaxed m-0">{children}</p>
    </div>
  )
}

export function TocCol({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-1 mb-2 m-0">{heading}</h4>
      <ul className="list-none m-0 p-0 text-sm">{children}</ul>
    </div>
  )
}

export function TocLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li className="py-0.5">
      <a href={href} className="text-slate-700 hover:text-primary hover:underline no-underline transition-colors">
        {children}
      </a>
    </li>
  )
}
