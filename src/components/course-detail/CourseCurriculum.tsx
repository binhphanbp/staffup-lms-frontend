'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const CourseCurriculum = () => {
  const [openSection1, setOpenSection1] = useState(true);
  const [openSection2, setOpenSection2] = useState(false);

  return (
    <section id="curriculum" className="scroll-mt-20">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-bold text-slate-800">Giáo trình chi tiết</h2>
        <div className="text-[12px] font-medium text-slate-500">
          12 Phần • 48 Bài học • Thời lượng 24h 30m
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {/* Accordion 1 */}
        <div
          className={`accordion-item card overflow-hidden border border-gray-200 ${openSection1 ? 'active' : ''}`}
        >
          <button
            className="flex w-full items-center justify-between bg-slate-50 p-4 transition-colors hover:bg-slate-100"
            onClick={() => setOpenSection1(!openSection1)}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-chevron-down accordion-icon text-xs text-slate-400 transition-transform duration-300"></i>
              <span className="text-[14px] font-bold text-slate-800">
                Phần 1: Nền tảng thiết kế kiến trúc
              </span>
            </div>
            <div className="text-[11px] text-slate-500">4 bài giảng • 45 phút</div>
          </button>
          <div className="accordion-content border-t border-gray-100">
            <div className="p-2">
              <Link
                href="#"
                className="group flex items-center justify-between rounded-md p-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-play group-hover:text-primary text-slate-400 transition-colors"></i>
                  <span className="group-hover:text-primary text-[13px] font-medium text-slate-700 transition-colors">
                    1. Giới thiệu về System Design
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">12:30</span>
              </Link>
              <Link
                href="#"
                className="group flex items-center justify-between rounded-md p-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-check text-success"></i>
                  <span className="text-[13px] font-medium text-slate-700 line-through opacity-80">
                    2. Mở rộng theo chiều dọc vs Chiều ngang
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">18:45</span>
              </Link>
              <Link
                href="#"
                className="group flex items-center justify-between rounded-md p-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-file-lines group-hover:text-primary pl-[2px] text-slate-400 transition-colors"></i>
                  <span className="group-hover:text-primary text-[13px] font-medium text-slate-700 transition-colors">
                    3. Tài liệu: Load Balancing Algorithms
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">Đọc 10m</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Accordion 2 */}
        <div
          className={`accordion-item card overflow-hidden border border-gray-200 ${openSection2 ? 'active' : ''}`}
        >
          <button
            className="flex w-full items-center justify-between bg-slate-50 p-4 transition-colors hover:bg-slate-100"
            onClick={() => setOpenSection2(!openSection2)}
          >
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-chevron-down accordion-icon text-xs text-slate-400 transition-transform duration-300"></i>
              <span className="text-[14px] font-bold text-slate-800">
                Phần 2: Database & Storage Subsystem
              </span>
            </div>
            <div className="text-[11px] text-slate-500">8 bài giảng • 2h 15m</div>
          </button>
          <div className="accordion-content border-t border-gray-100">
            <div className="p-2">
              <Link
                href="#"
                className="group flex items-center justify-between rounded-md p-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-play text-slate-400"></i>
                  <span className="text-[13px] font-medium text-slate-700">
                    1. Database Replication & Partitioning (Sharding)
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">22:10</span>
              </Link>
              <Link
                href="#"
                className="group flex items-center justify-between rounded-md p-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-circle-play text-slate-400"></i>
                  <span className="text-[13px] font-medium text-slate-700">
                    2. CAP Theorem & PACELC
                  </span>
                </div>
                <span className="text-[11px] text-slate-400">15:20</span>
              </Link>
              <Link
                href="#"
                className="group flex items-center justify-between rounded-md p-3 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-3">
                  <i className="fa-solid fa-code rounded bg-purple-100 p-1 text-purple-500"></i>
                  <span className="text-[13px] font-bold text-slate-700 transition-colors group-hover:text-purple-600">
                    Bài Lab: Cấu hình Redis Cache
                  </span>
                </div>
                <span className="rounded bg-purple-50 px-2 py-0.5 text-[11px] font-bold text-purple-500">
                  Thực hành
                </span>
              </Link>
            </div>
          </div>
        </div>

        {/* Accordion 3 (Locked) */}
        <div className="accordion-item card overflow-hidden border border-gray-200 opacity-70">
          <button className="flex w-full cursor-not-allowed items-center justify-between bg-slate-50 p-4 transition-colors hover:bg-slate-100">
            <div className="flex items-center gap-3">
              <i className="fa-solid fa-lock text-xs text-slate-300"></i>
              <span className="text-[14px] font-bold text-slate-500">
                Phần 3: Message Queue & Event Driven Architecture
              </span>
            </div>
            <div className="text-[11px] text-slate-400">Hoàn thành Phần 2 để mở khóa</div>
          </button>
        </div>
      </div>
    </section>
  );
};
