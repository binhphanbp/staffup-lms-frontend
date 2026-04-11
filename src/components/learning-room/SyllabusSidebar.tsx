'use client';

import React, { useState } from 'react';
import type { ModuleDetail, LessonProgressStatus } from '@/types';

interface LessonProgress {
  lessonId: string;
  status: LessonProgressStatus;
  watchTimeSeconds: number;
  lastPositionSeconds: number;
}

interface QuizInfo {
  id: string;
  title: string;
  lessonId: string | null;
  questionsToPull: number | null;
  timeLimitMinutes: number | null;
  passScorePercent: number | null;
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
  quizzes?: QuizInfo[];
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
  quizzes = [],
  enrollmentId,
}: SyllabusSidebarProps) => {
  const sortedModules = [...modules].sort((a, b) => a.orderIndex - b.orderIndex);
  
  // Create a map of lessonId -> quiz
  const lessonQuizMap = React.useMemo(() => {
    const map = new Map<string, QuizInfo>();
    quizzes.forEach((quiz) => {
      if (quiz.lessonId) {
        map.set(quiz.lessonId, quiz);
      }
    });
    return map;
  }, [quizzes]);
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
      {/* Toggle button - Udemy style */}
      <button
        onClick={onToggle}
        className={`absolute top-20 z-20 hidden md:flex items-center justify-center transition-all duration-300 ${
          isOpen 
            ? '-left-12 h-12 w-12 rounded-full border-2 border-slate-300 bg-white shadow-xl hover:border-slate-400 hover:shadow-2xl' 
            : '-left-14 h-14 w-14 rounded-full border-2 border-slate-700 bg-slate-800 shadow-2xl hover:border-slate-600 hover:bg-slate-700'
        }`}
        title={isOpen ? 'Đóng giáo trình' : 'Mở giáo trình'}
      >
        {isOpen ? (
          <i className="fa-solid fa-chevron-right text-xl text-slate-700"></i>
        ) : (
          <div className="flex flex-col items-center gap-0.5">
            <i className="fa-solid fa-bars text-lg text-white"></i>
            <span className="text-[9px] font-bold text-white">Menu</span>
          </div>
        )}
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
                    const hasQuiz = lessonQuizMap.has(lesson.id);
                    const quiz = hasQuiz ? lessonQuizMap.get(lesson.id) : null;

                    if (isActive) {
                      return (
                        <React.Fragment key={lesson.id}>
                          <div
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
                          
                          {/* Quiz item right after active lesson */}
                          {hasQuiz && quiz && enrollmentId && (
                            <a
                              href={`/quiz-assessment?quizId=${quiz.id}&enrollmentId=${enrollmentId}`}
                              className="flex w-full items-start gap-3 border-l-2 border-transparent bg-purple-50 p-3 text-left transition-colors hover:bg-purple-100"
                            >
                              <i className="fa-solid fa-clipboard-question mt-0.5 text-[12px] text-purple-600"></i>
                              <div className="flex-1">
                                <div className="mb-1 text-[12px] font-medium leading-snug text-purple-700">
                                  {quiz.title}
                                </div>
                                <div className="font-mono text-[10px] text-purple-600/80">
                                  <i className="fa-solid fa-list-check mr-1"></i>
                                  {quiz.questionsToPull || 0} câu
                                  {quiz.timeLimitMinutes && ` • ${quiz.timeLimitMinutes} phút`}
                                </div>
                              </div>
                              <i className="fa-solid fa-arrow-right mt-1 text-[10px] text-purple-600"></i>
                            </a>
                          )}
                        </React.Fragment>
                      );
                    }

                    return (
                      <React.Fragment key={lesson.id}>
                        <button
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
                        
                        {/* Quiz item right after lesson */}
                        {hasQuiz && quiz && enrollmentId && (
                          <a
                            href={`/quiz-assessment?quizId=${quiz.id}&enrollmentId=${enrollmentId}`}
                            className="flex w-full items-start gap-3 border-l-2 border-transparent bg-purple-50 p-3 text-left transition-colors hover:bg-purple-100"
                          >
                            <i className="fa-solid fa-clipboard-question mt-0.5 text-[12px] text-purple-600"></i>
                            <div className="flex-1">
                              <div className="mb-1 text-[12px] font-medium leading-snug text-purple-700">
                                {quiz.title}
                              </div>
                              <div className="font-mono text-[10px] text-purple-600/80">
                                <i className="fa-solid fa-list-check mr-1"></i>
                                {quiz.questionsToPull || 0} câu
                                {quiz.timeLimitMinutes && ` • ${quiz.timeLimitMinutes} phút`}
                              </div>
                            </div>
                            <i className="fa-solid fa-arrow-right mt-1 text-[10px] text-purple-600"></i>
                          </a>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
