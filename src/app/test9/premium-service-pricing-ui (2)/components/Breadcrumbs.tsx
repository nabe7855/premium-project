
import React from 'react';

const Breadcrumbs: React.FC = () => {
  return (
    <nav className="flex text-rose-300 text-xs mb-6 px-4 md:px-0 justify-center" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <a href="#" className="hover:text-rose-500 transition-colors">TOP</a>
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
