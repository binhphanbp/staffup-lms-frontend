'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { ModuleDetail, LessonDetail } from '@/types';

interface CourseCurriculumProps {
  modules?: ModuleDetail[];
  totalModules?: number;
  totalLessons?: number;
  totalDurationMinutes?: number;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatModuleDuration(lessons: LessonDetail[]): string {
  const totalSec = lessons.reduce((sum, l) => sum + (l.durationSeconds ?? 0), 0);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m} phút`;
}

function lessonIcon(type: string): string {
  switch (type) {
    case 'video':
      return 'fa-solid fa-circle-play';
    case 'article':
    case 'document':
      return 'fa-solid fa-file-lines';
    case 'quiz':
      return 'fa-solid fa-code';
    default:
      return 'fa-solid fa-circle-play';
  }
}

export const CourseCurriculum = ({ modules, totalModules, totalLessons, totalDurationMinutes }: CourseCurriculumProps) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggle = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const summaryParts: string[] = [];
  if (totalModules) summaryParts.push(`${totalModules} Phần`);
  if (totalLessons) summaryParts.push(`${totalLessons} Bài học`);
  if (totalDurationMinutes) {
    const h = Math.floor(totalDurationMinutes / 60);
    const m = totalDurationMinutes % 60;
    summaryParts.push(`Thời lượng ${h > 0 ? `${h}h ` : ''}${m}m`);
  }

  return (
    <section id="curriculum" className="scroll-mt-20">
      <div className="mb-4 flex items-end justify-between">
        <h2 className="text-lg font-bold text-slate-800">Giáo trình chi tiết</h2>
        {summaryParts.length > 0 && (
          <div className="text-[12px] font-medium text-slate-500">
            {summaryParts.join(' • ')}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {modules && modules.length > 0 ? (
          modules.map((mod, idx) => {
            const isOpen = openSections[mod.id] ?? idx === 0;
            return (
              <div
                key={mod.id}
                className={`accordion-item card overflow-hidden border border-gray-200 ${isOpen ? 'active' : ''}`}
              >
                <button
                  className="flex w-full items-center justify-between bg-slate-50 p-4 transition-colors hover:bg-slate-100"
                  onClick={() => toggle(mod.id)}
                >
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-chevron-down accordion-icon text-xs text-slate-400 transition-transform duration-300"></i>
                    <span className="text-[14px] font-bold text-slate-800">
                      Phần {idx + 1}: {mod.title}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    {mod.lessons.length} bài giảng • {formatModuleDuration(mod.lessons)}
                  </div>
                </button>
                <div className="accordion-content border-t border-gray-100">
                  <div className="p-2">
                    {mod.lessons.map((lesson, lIdx) => (
                      <Link
                        key={lesson.id}
                        href="#"
                        className="group flex items-center justify-between rounded-md p-3 transition-colors hover:bg-slate-50"
                      >
                        <div className="flex items-center gap-3">
                          <i className={`${lessonIcon(lesson.lessonType)} group-hover:text-primary text-slate-400 transition-colors`}></i>
                          <span className="group-hover:text-primary text-[13px] font-medium text-slate-700 transition-colors">
                            {lIdx + 1}. {lesson.title}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {lesson.durationSeconds > 0 ? formatDuration(lesson.durationSeconds) : ''}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-8 text-center text-sm text-slate-400">
            Chưa có giáo trình cho khóa học này.
          </div>
        )}
      </div>
    </section>
  );
};
