'use client';

import React from 'react';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';

interface LessonNavigationProps {
  onPrevious?: () => void;
  onNext?: () => void;
  onComplete?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  isCompleted: boolean;
  currentLessonTitle?: string;
  nextLessonTitle?: string;
}

export const LessonNavigation = ({
  onPrevious,
  onNext,
  onComplete,
  hasPrevious,
  hasNext,
  isCompleted,
  currentLessonTitle,
  nextLessonTitle,
}: LessonNavigationProps) => {
  return (
    <div className="border-t border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Previous Button */}
        <button
          onClick={onPrevious}
          disabled={!hasPrevious}
          className="flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="hidden sm:inline">Bài trước</span>
        </button>

        {/* Complete Button (if not completed) */}
        {!isCompleted && onComplete && (
          <button
            onClick={onComplete}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4" />
            Hoàn thành bài học
          </button>
        )}

        {/* Next Button */}
        <div className="flex flex-col items-end">
          <button
            onClick={onNext}
            disabled={!hasNext}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-blue-600"
          >
            <span className="hidden sm:inline">Bài tiếp theo</span>
            <ChevronRight className="h-4 w-4" />
          </button>
          {hasNext && nextLessonTitle && (
            <span className="mt-1 hidden text-xs text-gray-500 md:block">
              {nextLessonTitle}
            </span>
          )}
        </div>
      </div>

      {/* Completed Badge */}
      {isCompleted && (
        <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-green-50 py-2 text-sm font-medium text-green-700">
          <CheckCircle className="h-4 w-4" />
          Bạn đã hoàn thành bài học này
        </div>
      )}
    </div>
  );
};
