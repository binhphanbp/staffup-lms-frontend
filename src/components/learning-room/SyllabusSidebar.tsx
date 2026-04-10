'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface SyllabusSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export const SyllabusSidebar = ({ isOpen, onToggle }: SyllabusSidebarProps) => {
  const [openSection1, setOpenSection1] = useState(true);
  const [openSection2, setOpenSection2] = useState(true);

  return (
    <div
      className={`
        z-40 flex shrink-0 flex-col bg-slate-50 shadow-[-10px_0_20px_rgba(0,0,0,0.03)]
        transition-all duration-300 ease-in-out
        ${isOpen
          ? 'fixed inset-y-0 right-0 h-full w-80 border-l border-slate-200 md:relative md:inset-auto md:h-auto md:w-80 lg:w-96'
          : 'relative w-0 border-l-0'
        }
      `}
    >
      <button
        onClick={onToggle}
        className="hover:text-primary hover:border-primary tooltip absolute top-4 -left-4 z-20 hidden h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 shadow-md transition-colors md:flex"
        title="Bật/Tắt Giáo trình"
      >
        <i className={`fa-solid ${isOpen ? 'fa-chevron-right' : 'fa-chevron-left'} text-xs`}></i>
      </button>

      <div
        className={`flex h-full w-80 flex-col overflow-hidden transition-opacity duration-300 lg:w-96 ${isOpen ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-gray-200 bg-white p-4">
          <h3 className="text-[14px] font-bold text-slate-800">Nội dung bài học</h3>
          <span className="text-primary bg-primary-bg rounded px-2 py-0.5 text-[11px] font-medium">
            6 / 48 Bài
          </span>
        </div>

        <div className="dark-scrollbar flex-1 overflow-y-auto pb-10">
          {/* Accordion Phần 1 */}
          <div className="border-b border-gray-200">
            <button
              className="group flex w-full items-center justify-between bg-slate-100/50 p-3.5 transition-colors hover:bg-slate-100"
              onClick={() => setOpenSection1(!openSection1)}
            >
              <div className="flex flex-col text-left">
                <span className="group-hover:text-primary text-[12px] font-bold text-slate-700 transition-colors">
                  Phần 1: Nền tảng thiết kế
                </span>
                <span className="text-[10px] text-slate-400">4 / 4 | 45m</span>
              </div>
              <i
                className={`fa-solid fa-chevron-down transform text-[10px] text-slate-400 transition-transform duration-300 ${openSection1 ? 'rotate-180' : ''}`}
              ></i>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${openSection1 ? 'max-h-250' : 'max-h-0'}`}
            >
              <Link
                href="#"
                className="flex items-start gap-3 border-l-2 border-transparent bg-white p-3 transition-colors hover:bg-slate-50"
              >
                <i className="fa-solid fa-circle-check text-success/60 mt-0.5 text-[12px]"></i>
                <div className="flex-1">
                  <div className="mb-1 text-[12px] leading-snug font-medium text-slate-400">
                    1. Giới thiệu về System Design
                  </div>
                  <div className="font-mono text-[10px] text-slate-400/80">
                    <i className="fa-solid fa-video mr-1"></i> 12:30
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Accordion Phần 2 */}
          <div className="border-b border-gray-200">
            <button
              className="group flex w-full items-center justify-between bg-white p-3.5 transition-colors hover:bg-slate-50"
              onClick={() => setOpenSection2(!openSection2)}
            >
              <div className="flex flex-col text-left">
                <span className="group-hover:text-primary text-[12px] font-bold text-slate-800 transition-colors">
                  Phần 2: Database Subsystem
                </span>
                <span className="text-primary text-[10px] font-medium">2 / 8 | 2h 15m</span>
              </div>
              <i
                className={`fa-solid fa-chevron-down transform text-[10px] text-slate-400 transition-transform duration-300 ${openSection2 ? 'rotate-180' : ''}`}
              ></i>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ${openSection2 ? 'max-h-250' : 'max-h-0'}`}
            >
              <Link
                href="#"
                className="flex items-start gap-3 border-l-2 border-transparent bg-white p-3 transition-colors hover:bg-slate-50"
              >
                <i className="fa-solid fa-circle-check text-success/60 mt-0.5 text-[12px]"></i>
                <div className="flex-1">
                  <div className="mb-1 text-[12px] leading-snug font-medium text-slate-400">
                    3. Relational vs Non-relational DB
                  </div>
                  <div className="font-mono text-[10px] text-slate-400/80">
                    <i className="fa-solid fa-video mr-1"></i> 15:00
                  </div>
                </div>
              </Link>
              <div className="bg-primary-bg/50 border-primary flex cursor-pointer items-start gap-3 border-l-2 p-3 transition-colors">
                <div className="mt-0.5 flex h-3 w-4 items-end justify-center gap-px">
                  <div className="eq-bar"></div>
                  <div className="eq-bar"></div>
                  <div className="eq-bar"></div>
                </div>
                <div className="flex-1">
                  <div className="text-primary mb-1 text-[12px] leading-snug font-bold">
                    4. Database Replication & Partitioning
                  </div>
                  <div className="text-primary font-mono text-[10px]">
                    <i className="fa-solid fa-video mr-1"></i> 22:10
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
