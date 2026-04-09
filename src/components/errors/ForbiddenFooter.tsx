import React from 'react';

export const ForbiddenFooter = () => {
  return (
    <footer className="relative z-10 flex w-full flex-shrink-0 justify-between px-6 py-4 text-center text-[11px] text-slate-400 lg:px-12">
      <span>&copy; 2026 TechCorp Internal System.</span>
      <span className="font-mono">HTTP_403_FORBIDDEN</span>
    </footer>
  );
};
