import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function AdminBreadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  return (
    <nav className="flex mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
      <ol className="inline-flex items-center space-x-1 md:space-x-3">
        <li className="inline-flex items-center">
          <Link to="/admin" className="inline-flex items-center hover:text-foreground transition-colors">
            <Home className="w-4 h-4 mr-2" />
            Admin
          </Link>
        </li>
        {pathnames.slice(1).map((value, index) => {
          const to = `/admin/${pathnames.slice(1, index + 2).join('/')}`;
          const isLast = index === pathnames.length - 2;
          const title = value.charAt(0).toUpperCase() + value.slice(1).replace('-', ' ');

          return (
            <li key={to}>
              <div className="flex items-center">
                <ChevronRight className="w-4 h-4 mx-1" />
                {isLast ? (
                  <span className="text-foreground font-medium ml-1 md:ml-2">
                    {title}
                  </span>
                ) : (
                  <Link to={to} className="hover:text-foreground transition-colors ml-1 md:ml-2">
                    {title}
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
