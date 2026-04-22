'use client';

import Link from 'next/link';
import { useLocale, useTranslation } from '../i18n/context';

interface LogicLinkProps {
  anchor: string;
}

export function LogicLink({ anchor }: LogicLinkProps) {
  const locale = useLocale();
  const { t } = useTranslation();
  const label = t('sections.logic');

  return (
    <Link
      href={`/${locale}/how-it-works#${anchor}`}
      className="inline-flex items-center gap-1 text-xs font-normal text-gray-400 hover:text-primary hover:underline transition-colors whitespace-nowrap"
      aria-label={label}
    >
      ⓘ {label} →
    </Link>
  );
}
