import React from 'react';

const Breadcrumbs: React.FC = () => {
  return (
    <nav
      className="mb-6 flex justify-center px-4 text-xs text-rose-300 md:px-0"
      aria-label="Breadcrumb"
    >
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a href="#" className="transition-colors hover:text-rose-500">
            TOP
          </a>
        </li>
        <li>
          <div className="flex items-center">
            <span className="mx-2">/</span>
            <span className="font-medium text-rose-500">SYSTEM</span>
          </div>
        </li>
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
