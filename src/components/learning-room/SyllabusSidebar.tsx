'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import type { ModuleDetail, LessonProgressStatus } from '@/types';

interface LessonProgress {
  lessonId: string;
  status: LessonProgressStatus;
  watchTimeSeconds: number;
  lastPositionSeconds: number;
}

interface SyllabusSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  modules: ModuleDetail[];
  activeLessonId: string | null;
  lessonProgressMap: Map<string, LessonProgress>;
  completedLessons: number;
  totalLessons: number;
  onSelectLesson: (lessonId: string) => void;
  courseId?: string | null;
  enrollmentId?: string | null;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function formatModuleDuration(lessons: ModuleDetail['lessons']): string {
  const totalSec = lessons.reduce((sum, l) => sum + (l.durationSeconds ?? 0), 0);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function lessonTypeIcon(type: string): string {
  switch (type) {
    case 'video':
      return 'fa-solid fa-video';
    case 'article':
    case 'document':
      return 'fa-solid fa-file-lines';
    case 'quiz':
      return 'fa-solid fa-flask-vial';
    default:
      return 'fa-solid fa-video';
  }
}

export const SyllabusSidebar = ({
  isOpen,
  onToggle,
  modules,
  activeLessonId,
  lessonProgressMap,
  completedLessons,
  totalLessons,
  onSelectLesson,
  courseId,
  enrollmentId,
}: SyllabusSidebarProps) => {
  const sortedModules = [...modules].sort((a, b) => a.orderIndex - b.orderIndex);
  // Open module containing active lesson by default
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const mod of sortedModules) {
      const hasActive = mod.lessons.some((l) => l.id === activeLessonId);
      initial[mod.id] = hasActive;
    }
    // If no active, open first
    if (sortedModules.length > 0 && !Object.values(initial).some(Boolean)) {
      initial[sortedModules[0].id] = true;
    }
    return initial;
  });

  const toggleSection = (id: string) => {
    setOpenSections((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div
      className={`z-40 flex shrink-0 flex-col bg-slate-50 shadow-[-10px_0_20px_rgba(0,0,0,0.03)] transition-all duration-300 ease-in-out ${
        isOpen
          ? 'fixed inset-y-0 right-0 h-full w-80 border-l border-slate-200 md:relative md:inset-auto md:h-auto md:w-80 lg:w-96'
          : 'relative w-0 border-l-0'
      } `}
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
            {completedLessons} / {totalLessons} Bài
          </span>
        </div>

        <div className="dark-scrollbar flex-1 overflow-y-auto pb-10">
          {sortedModules.map((mod, modIdx) => {
            const isOpen = openSections[mod.id] ?? false;
            const sortedLessons = [...mod.lessons].sort((a, b) => a.orderIndex - b.orderIndex);
            const completedInModule = sortedLessons.filter(
              (l) => lessonProgressMap.get(l.id)?.status === 'completed',
            ).length;

            return (
              <div key={mod.id} className="border-b border-gray-200">
                <button
                  className="group flex w-full items-center justify-between bg-white p-3.5 transition-colors hover:bg-slate-50"
                  onClick={() => toggleSection(mod.id)}
                >
                  <div className="flex flex-col text-left">
                    <span className="group-hover:text-primary text-[12px] font-bold text-slate-800 transition-colors">
                      Phần {modIdx + 1}: {mod.title}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {completedInModule} / {sortedLessons.length} |{' '}
                      {formatModuleDuration(sortedLessons)}
                    </span>
                  </div>
                  <i
                    className={`fa-solid fa-chevron-down transform text-[10px] text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                  ></i>
                </button>
                <div
                  className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[2000px]' : 'max-h-0'}`}
                >
                  {sortedLessons.map((lesson) => {
                    const lp = lessonProgressMap.get(lesson.id);
                    const isActive = lesson.id === activeLessonId;
                    const isCompleted = lp?.status === 'completed';

                    if (isActive) {
                      return (
                        <div
                          key={lesson.id}
                          className="bg-primary-bg/50 border-primary flex cursor-pointer items-start gap-3 border-l-2 p-3 transition-colors"
                        >
                          <div className="mt-0.5 flex h-3 w-4 items-end justify-center gap-px">
                            <div className="eq-bar"></div>
                            <div className="eq-bar"></div>
                            <div className="eq-bar"></div>
                          </div>
                          <div className="flex-1">
                            <div className="text-primary mb-1 text-[12px] leading-snug font-bold">
                              {lesson.title}
                            </div>
                            <div className="text-primary font-mono text-[10px]">
                              <i className={`${lessonTypeIcon(lesson.lessonType)} mr-1`}></i>
                              {lesson.durationSeconds > 0
                                ? formatDuration(lesson.durationSeconds)
                                : ''}
                            </div>
                          </div>
                        </div>
                      );
                    }

                    return (
                      <button
                        key={lesson.id}
                        onClick={() => onSelectLesson(lesson.id)}
                        className="flex w-full items-start gap-3 border-l-2 border-transparent bg-white p-3 text-left transition-colors hover:bg-slate-50"
                      >
                        <i
                          className={`mt-0.5 text-[12px] ${
                            isCompleted
                              ? 'fa-solid fa-circle-check text-success/60'
                              : `${lessonTypeIcon(lesson.lessonType)} text-slate-400`
                          }`}
                        ></i>
                        <div className="flex-1">
                          <div
                            className={`mb-1 text-[12px] leading-snug font-medium ${
                              isCompleted ? 'text-slate-400' : 'text-slate-700'
                            }`}
                          >
                            {lesson.title}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400/80">
                            <i className={`${lessonTypeIcon(lesson.lessonType)} mr-1`}></i>
                            {lesson.durationSeconds > 0
                              ? formatDuration(lesson.durationSeconds)
                              : ''}
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* ── Module-level quizzes ──────────────────────── */}
                  {mod.quizzes && mod.quizzes.length > 0 && courseId && enrollmentId
                    ? mod.quizzes.map((quiz) => (
                        <Link
                          key={quiz.id}
                          href={`/quiz-assessment/start?courseId=${courseId}&moduleId=${mod.id}&quizId=${quiz.id}&enrollmentId=${enrollmentId}`}
                          className="group flex w-full items-start gap-3 border-l-2 border-amber-400 bg-gradient-to-r from-amber-50 to-amber-50/50 p-3 text-left transition-colors hover:from-amber-100 hover:to-amber-50"
                        >
                          <i className="fa-solid fa-flask-vial mt-0.5 text-[13px] text-amber-500"></i>
                          <div className="flex-1">
                            <div className="mb-1 flex items-center gap-1.5 text-[12px] leading-snug font-bold text-amber-900">
                              <span>{quiz.title}</span>
                              <span className="rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] font-bold tracking-wider text-white uppercase">
                                Quiz
                              </span>
                            </div>
                            <div className="font-mono text-[10px] text-amber-700/80">
                              <i className="fa-solid fa-list-ol mr-1"></i>
                              {quiz.totalQuestions ?? quiz._count?.quizQuestions ?? 0} câu
                              {quiz.timeLimitMinutes && (
                                <>
                                  {' · '}
                                  <i className="fa-regular fa-clock mr-1"></i>
                                  {quiz.timeLimitMinutes}p
                                </>
                              )}
                              {' · '}
                              Đạt {quiz.passScorePercent}%
                            </div>
                          </div>
                          <i className="fa-solid fa-chevron-right mt-1 text-[10px] text-amber-400 transition-transform group-hover:translate-x-0.5"></i>
                        </Link>
                      ))
                    : null}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
