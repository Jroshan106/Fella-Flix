const fs = require('fs');
const content = `import React from 'react';

export function Pagination({ currentPage, totalPages, onPageChange }: { currentPage: number, totalPages: number, onPageChange: (p: number) => void }) {
  if (totalPages <= 1) return null;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getVisiblePages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', totalPages);
      } else if (currentPage >= totalPages - 3) {
        pages.push(1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }
    return pages;
  };

  const pages = getVisiblePages();

  return (
    <div className="flex justify-center mt-12 mb-8">
      <nav className="flex items-center gap-x-1" aria-label="Pagination">
        <button 
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          type="button" 
          className="min-h-9 min-w-9 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-foreground hover:bg-primary/10 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none" aria-label="Previous">
          <svg className="shrink-0 w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          <span className="sr-only">Previous</span>
        </button>
        <div className="flex items-center gap-x-1">
          {pages.map((p, idx) => {
            if (p === '...') {
              return (
                <div key={\`ellipsis-\${idx}\`} className="inline-block">
                  <div className="min-h-9 min-w-9 flex justify-center items-center text-foreground/50 p-2 text-sm rounded-lg">
                    <span className="text-xs">...</span>
                  </div>
                </div>
              );
            }
            const isCurrent = p === currentPage;
            return (
              <button 
                key={p}
                onClick={() => handlePageChange(p as number)}
                type="button" 
                className={\`min-h-9 min-w-9 flex justify-center items-center py-2 px-3 text-sm rounded-lg focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none \${isCurrent ? 'border border-primary text-primary bg-primary/10 font-bold' : 'border border-transparent text-foreground hover:bg-primary/5'}\`}
                aria-current={isCurrent ? "page" : undefined}
              >
                {p}
              </button>
            );
          })}
        </div>
        <button 
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          type="button" 
          className="min-h-9 min-w-9 py-2 px-2.5 inline-flex justify-center items-center gap-x-2 text-sm rounded-lg border border-transparent text-foreground hover:bg-primary/10 focus:outline-hidden disabled:opacity-50 disabled:pointer-events-none" aria-label="Next">
          <span className="sr-only">Next</span>
          <svg className="shrink-0 w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>
      </nav>
    </div>
  );
}
`;
fs.writeFileSync('src/app/components/Pagination.tsx', content, 'utf8');
