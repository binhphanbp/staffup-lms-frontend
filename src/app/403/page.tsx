import React from 'react';
import { ForbiddenHeader } from '@/components/errors/ForbiddenHeader';
import { ForbiddenMessage } from '@/components/errors/ForbiddenMessage';
import { ForbiddenTerminal } from '@/components/errors/ForbiddenTerminal';
import { ForbiddenFooter } from '@/components/errors/ForbiddenFooter';

export default function Custom403Page() {
  return (
    <div className="page-403-container relative flex h-full w-full flex-col text-slate-800">
      {/* Background Patterns */}
      <div className="bg-security-pattern pointer-events-none absolute inset-0 z-0"></div>
      <div className="pointer-events-none absolute top-[10%] left-[-10%] z-0 h-[40%] w-[40%] rounded-full bg-red-400 opacity-10 mix-blend-multiply blur-[120px] filter"></div>
      <div className="pointer-events-none absolute right-[10%] bottom-[-10%] z-0 h-[30%] w-[30%] rounded-full bg-orange-400 opacity-10 mix-blend-multiply blur-[100px] filter"></div>

      <ForbiddenHeader />

      <main className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-10 px-6 py-10 lg:flex-row lg:gap-20 lg:px-12">
        <ForbiddenMessage />
        <ForbiddenTerminal />
      </main>

      <ForbiddenFooter />
    </div>
  );
}
