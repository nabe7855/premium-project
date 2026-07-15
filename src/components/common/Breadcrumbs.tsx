import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export interface BreadcrumbItem {
  name: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className={`w-full py-2 px-4 text-xs md:text-sm text-slate-500 bg-white/80 backdrop-blur border-b border-slate-100 ${className}`}>
      <div className="container mx-auto max-w-7xl flex items-center overflow-x-auto whitespace-nowrap scrollbar-hide">
        <ol className="flex items-center space-x-1 md:space-x-2">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={index} className="flex items-center">
                {index > 0 && <ChevronRight className="w-3 h-3 md:w-4 md:h-4 mx-1 text-slate-400 shrink-0" />}
                
                {isLast || !item.href ? (
                  <span className="text-slate-800 font-medium truncate max-w-[150px] md:max-w-none" aria-current={isLast ? 'page' : undefined}>
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center hover:text-rose-500 transition-colors truncate max-w-[120px] md:max-w-none"
                  >
                    {index === 0 && <Home className="w-3 h-3 md:w-4 md:h-4 mr-1 shrink-0" />}
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
