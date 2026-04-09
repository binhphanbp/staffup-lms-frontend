'use client';

import React, { useState, useEffect } from 'react';

// Cấu trúc dữ liệu code
const CODE_LINES = [
  { text: '// Khởi tạo request lấy dữ liệu khóa học', color: 'text-[#5c6370] italic' },
  {
    text: "<span class='text-[#c678dd]'>const</span> requestUrl = <span class='text-[#98c379]'>window.location.href</span>;",
    color: '',
  },
  { text: '<br/>', color: '' },
  { text: "<span class='text-[#c678dd]'>try</span> {", color: '' },
  {
    text: "&nbsp;&nbsp;<span class='text-[#c678dd]'>await</span> <span class='text-[#61afef]'>fetchCourseData</span>(requestUrl);",
    color: '',
  },
  { text: "} <span class='text-[#c678dd]'>catch</span> (error) {", color: '' },
  {
    text: "&nbsp;&nbsp;<span class='text-[#61afef]'>console</span>.error(<span class='text-[#98c379]'>'Lỗi định tuyến'</span>, error);",
    color: '',
  },
  { text: '<br/>', color: '' },
  {
    text: "&nbsp;&nbsp;<span class='text-red-400 font-bold'>[ERROR] 404: Route Not Found.</span>",
    color: '',
  },
  {
    text: "&nbsp;&nbsp;<span class='text-[#5c6370] italic'>// Dev note: Ai đó đã xóa nhầm table trên Database chăng? 😅</span>",
    color: '',
  },
  { text: '}', color: '' },
];

export const NotFoundTerminal = () => {
  const [visibleLines, setVisibleLines] = useState<number>(0);

  useEffect(() => {
    if (visibleLines >= CODE_LINES.length) return;

    // Random tốc độ gõ (typing speed) cho giống thật
    const typingSpeed = Math.floor(Math.random() * 300) + 100;
    const timeout = setTimeout(() => {
      setVisibleLines((prev) => prev + 1);
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [visibleLines]);

  return (
    <div className="animate-float order-1 w-full max-w-lg lg:order-2 lg:w-1/2">
      <div className="terminal-shadow flex h-[320px] w-full flex-col overflow-hidden rounded-xl border border-slate-700 bg-slate-900 sm:h-[380px]">
        {/* Header Terminal */}
        <div className="flex h-10 flex-shrink-0 items-center border-b border-slate-700 bg-slate-800 px-4">
          <div className="flex gap-2">
            <div className="h-3 w-3 rounded-full border border-red-600 bg-red-500"></div>
            <div className="h-3 w-3 rounded-full border border-yellow-600 bg-yellow-500"></div>
            <div className="h-3 w-3 rounded-full border border-green-600 bg-green-500"></div>
          </div>
          <div className="mx-auto flex items-center gap-2 font-mono text-xs text-slate-400">
            <i className="fa-brands fa-node-js text-green-500"></i> server.js — error_log
          </div>
        </div>

        {/* Nội dung Terminal */}
        <div className="custom-scrollbar relative flex-1 overflow-y-auto bg-[#1e293b] p-4 font-mono text-[11px] leading-relaxed sm:p-5 sm:text-[13px]">
          <div className="absolute top-0 bottom-0 left-0 flex w-8 flex-col items-end border-r border-slate-700 bg-slate-900/50 pt-4 pr-2 text-slate-600 select-none sm:w-10 sm:pt-5">
            {CODE_LINES.map((_, i) => (
              <span key={i}>{i + 1}</span>
            ))}
          </div>

          <div className="pl-6 text-slate-300 sm:pl-8">
            {CODE_LINES.slice(0, visibleLines).map((line, idx) => (
              <div
                key={idx}
                className={line.color}
                dangerouslySetInnerHTML={{ __html: line.text }}
              />
            ))}
          </div>

          <div className="mt-1 pl-6 sm:pl-8">
            <span className="animate-cursor-blink inline-block h-3.5 w-2 bg-[#1677ff] align-middle sm:h-4 sm:w-2.5"></span>
          </div>
        </div>

        {/* Footer Terminal */}
        <div className="flex h-8 flex-shrink-0 items-center justify-between border-t border-slate-700 bg-slate-800 px-4 font-mono text-[10px] text-slate-400">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-circle-xmark text-red-500"></i> 1 Error
            <span className="text-slate-600">|</span>
            <i className="fa-solid fa-triangle-exclamation text-yellow-500"></i> 0 Warnings
          </div>
          <div>UTF-8</div>
        </div>
      </div>
    </div>
  );
};
