import React from 'react';

export const ForbiddenTerminal = () => {
  return (
    <div className="order-1 w-full max-w-lg lg:order-2 lg:w-1/2">
      <div className="security-shadow relative flex h-[340px] w-full flex-col overflow-hidden rounded-xl border border-red-500/30 bg-slate-900 sm:h-[400px]">
        <div className="animate-scan-line pointer-events-none absolute top-0 left-0 z-20 h-8 w-full bg-gradient-to-b from-transparent via-red-500/20 to-transparent"></div>

        <div className="z-10 flex h-10 flex-shrink-0 items-center justify-between border-b border-red-500/20 bg-slate-800/80 px-4 backdrop-blur-sm">
          <div className="flex items-center gap-2 font-mono text-[10px] tracking-widest text-red-400 uppercase">
            <span className="h-2 w-2 animate-[pulse_2s_ease-in-out_infinite] rounded-full bg-red-500"></span>
            Firewall Active
          </div>
          <div className="font-mono text-[10px] text-slate-500">IP: 192.168.1.105</div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-hidden p-6">
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div
              className="animate-pulse-ring absolute h-24 w-24 rounded-full border-2 border-red-500/50"
              style={{ animationDelay: '0s' }}
            ></div>
            <div
              className="animate-pulse-ring absolute h-24 w-24 rounded-full border-2 border-red-500/30"
              style={{ animationDelay: '0.8s' }}
            ></div>
            <div
              className="animate-pulse-ring absolute h-24 w-24 rounded-full border-2 border-red-500/10"
              style={{ animationDelay: '1.6s' }}
            ></div>
          </div>

          <div className="relative z-10 mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-red-500/50 bg-slate-800 shadow-[0_0_30px_rgba(255,77,79,0.3)]">
            <i className="fa-solid fa-lock animate-flicker text-4xl text-red-500"></i>
            <i className="fa-solid fa-ban absolute -right-2 -bottom-2 rounded-full border-2 border-slate-900 bg-slate-900 text-2xl text-slate-400"></i>
          </div>

          <div
            className="glitch-text z-10 font-mono text-xl font-bold tracking-widest text-red-500"
            data-text="[ACCESS_DENIED]"
          >
            [ACCESS_DENIED]
          </div>

          <div className="z-10 mt-6 w-full rounded border border-white/5 bg-black/50 p-3 font-mono text-[10px] leading-relaxed text-slate-300">
            <div>
              {`>`} <span className="text-[#c678dd]">const</span>{' '}
              <span className="text-[#e06c75]">user</span> = Auth.getUser();
            </div>
            <div>
              {`>`} <span className="text-[#c678dd]">const</span>{' '}
              <span className="text-[#e06c75]">route</span> ={' '}
              <span className="text-[#98c379]">&quot;/instructor/course-builder&quot;</span>;
            </div>
            <div className="mt-1">
              {`>`} <span className="text-[#c678dd]">if</span> (!user.roles.includes(
              <span className="text-[#98c379]">&apos;INSTRUCTOR&apos;</span>)) {`{`}
            </div>
            <div>
              {`>`} &nbsp;&nbsp;<span className="text-[#c678dd]">throw</span>{' '}
              <span className="text-[#c678dd]">new</span> Error(
              <span className="text-[#98c379]">&apos;Forbidden&apos;</span>);
            </div>
            <div>
              {`>`} {`}`}
            </div>
            <div className="mt-2 font-bold text-red-400">
              {`>`} Exception: User has insufficient roles.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
