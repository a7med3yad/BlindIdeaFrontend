import type { ReactNode } from 'react';

interface PageHeaderProps {
  title: string;
  subtitle: string;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, action }: PageHeaderProps) {
  return (
    <div className="border-b border-[#1A1A1A] bg-[#000000]">
      <div className="max-w-6xl mx-auto px-8 py-8 flex items-start justify-between gap-6">
        <div className="min-w-0">
          <h1 className="text-3xl font-black text-white tracking-tight">
            {title}
          </h1>
          <p className="text-[#555555] text-sm mt-1 leading-relaxed">
            {subtitle}
          </p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
    </div>
  );
}

