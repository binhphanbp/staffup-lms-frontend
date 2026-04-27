/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import type { LessonDetail } from '@/types';
import { resolveMediaUrl } from '@/lib/media';
import { CourseQAChat } from '@/components/learning-room/CourseQAChat';
import { VideoSummaryPanel } from '@/components/learning-room/VideoSummaryPanel';

interface LearningTabsProps {
  lesson?: LessonDetail & { moduleTitle?: string };
  trainer?: { id: string; fullName: string; email: string; avatarUrl: string | null };
  enrollmentId?: string | null;
  courseId?: string | null;
  courseTitle?: string;
  onSeekVideo?: (seconds: number) => void;
}

type TabId = 'overview' | 'summary' | 'ai' | 'notes' | 'qa';

export const LearningTabs = ({
  lesson,
  trainer,
  enrollmentId,
  courseId,
  courseTitle,
  onSeekVideo,
}: LearningTabsProps) => {
  const isVideoLesson = lesson?.lessonType === 'video';
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  // Drop to overview if current tab no longer applies (e.g. non-video lesson with summary tab open)
  useEffect(() => {
    if (activeTab === 'summary' && !isVideoLesson) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveTab('overview');
    }
  }, [activeTab, isVideoLesson]);
  const downloadableResource = lesson?.resources?.find((resource) => resource.fileUrl);
  const downloadUrl = resolveMediaUrl(downloadableResource?.fileUrl);
  const quizHref =
    lesson?.quiz && enrollmentId && courseId
      ? `/quiz-assessment/start?courseId=${courseId}&lessonId=${lesson.id}&quizId=${lesson.quiz.id}&enrollmentId=${enrollmentId}`
      : null;

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-6 lg:px-10">
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-start">
        <div>
          <h2 className="mb-2 text-2xl font-bold tracking-tight text-slate-900">
            {lesson?.title ?? 'Đang tải bài học...'}
          </h2>
          <div className="flex items-center gap-3 text-sm text-slate-500">
            {trainer && (
              <>
                <img
                  src={
                    trainer.avatarUrl ??
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(trainer.fullName)}&background=0f172a&color=fff`
                  }
                  className="h-6 w-6 rounded-full"
                  alt={trainer.fullName}
                />
                <span className="font-medium text-slate-700">{trainer.fullName}</span>
                <span className="text-slate-300">•</span>
              </>
            )}
            {lesson?.moduleTitle && <span>{lesson.moduleTitle}</span>}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            className="hover:text-primary hover:border-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 shadow-sm transition-colors"
            title="Lưu khóa học"
          >
            <i className="fa-regular fa-bookmark"></i>
          </button>

          {downloadUrl ? (
            <Link
              href={downloadUrl}
              target="_blank"
              className="hover:text-primary hover:border-primary flex h-10 w-10 items-center justify-center rounded-full border border-gray-200 bg-white text-slate-500 shadow-sm transition-colors"
              title="Tải tài liệu"
            >
              <i className="fa-solid fa-download"></i>
            </Link>
          ) : (
            <button
              disabled
              className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-gray-200 bg-slate-100 text-slate-300 shadow-sm"
              title="Chưa có tài liệu"
            >
              <i className="fa-solid fa-download"></i>
            </button>
          )}
        </div>
      </div>

      <div className="mb-6 border-b border-gray-200">
        <nav className="flex gap-6 text-[13px] font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`border-b-2 py-3 transition-colors ${activeTab === 'overview' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Tổng quan
          </button>
          {isVideoLesson && (
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-1.5 border-b-2 py-3 transition-colors ${activeTab === 'summary' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <i className="fa-solid fa-layer-group text-[11px]"></i>
              Tóm tắt AI
              <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                MỚI
              </span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 border-b-2 py-3 transition-colors ${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <i className="fa-solid fa-wand-magic-sparkles text-[11px]"></i>
            Trợ lý AI
          </button>
          {isVideoLesson && (
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex items-center gap-1.5 border-b-2 py-3 transition-colors ${activeTab === 'summary' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
            >
              <i className="fa-solid fa-layer-group text-[11px]"></i>
              Tóm tắt AI
              <span className="rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-1.5 py-0.5 text-[9px] font-bold text-white">
                MỚI
              </span>
            </button>
          )}
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-1.5 border-b-2 py-3 transition-colors ${activeTab === 'ai' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            <i className="fa-solid fa-wand-magic-sparkles text-[11px]"></i>
            Trợ lý AI
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`flex items-center gap-1 border-b-2 py-3 transition-colors ${activeTab === 'notes' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Ghi chú
            <span className="bg-primary rounded-full px-1.5 py-0.5 text-[9px] text-white">2</span>
          </button>
          <button
            onClick={() => setActiveTab('qa')}
            className={`border-b-2 py-3 transition-colors ${activeTab === 'qa' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
          >
            Hỏi đáp (Q&A)
          </button>
        </nav>
      </div>

      <div className="flex-1 pb-10">
        {activeTab === 'overview' && (
          <div className="max-w-4xl animate-[fadeIn_0.3s_ease-in-out] space-y-4 text-[14px] leading-relaxed text-slate-600">
            {quizHref && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="mb-2 flex items-center gap-2 text-sm font-bold text-amber-900">
                  <i className="fa-solid fa-flask-vial"></i> Bài test cho bài học này
                </div>
                <p className="mb-3 text-sm text-amber-800">
                  {lesson?.quiz?.title ?? 'Bài test'} sẵn sàng. Bạn có thể bắt đầu ngay từ bài học
                  hiện tại.
                </p>
                <Link
                  href={quizHref}
                  className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-amber-600"
                >
                  <i className="fa-solid fa-play"></i> Bắt đầu bài test
                </Link>
              </div>
            )}

            {lesson?.contentText ? (
              <div dangerouslySetInnerHTML={{ __html: lesson.contentText }} />
            ) : (
              <p className="text-slate-400">Chưa có nội dung mô tả cho bài học này.</p>
            )}

            {lesson?.resources && lesson.resources.length > 0 && (
              <div className="mt-8 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <h4 className="mb-2 flex items-center gap-2 text-sm font-bold text-blue-800">
                  <i className="fa-solid fa-link"></i> Tài liệu đính kèm
                </h4>
                <div className="flex flex-col gap-2">
                  {lesson.resources.map((res) => (
                    <Link
                      key={res.id}
                      href={resolveMediaUrl(res.fileUrl) ?? '#'}
                      target="_blank"
                      className="text-primary flex items-center gap-2 text-[13px] hover:underline"
                    >
                      <i
                        className={`fa-regular ${res.resourceType === 'pdf' ? 'fa-file-pdf' : 'fa-file'}`}
                      ></i>
                      {res.fileName}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'notes' && (
          <div className="max-w-4xl animate-[fadeIn_0.3s_ease-in-out]">
            <div className="mb-8 rounded-lg border border-gray-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Tạo ghi chú mới</span>
                <button className="hover:bg-primary flex items-center gap-1 rounded bg-slate-200 px-2 py-1 font-mono text-[11px] font-bold text-slate-700 transition-colors hover:text-white">
                  <i className="fa-solid fa-thumbtack"></i> Đính kèm lúc 10:05
                </button>
              </div>
              <textarea
                className="focus:ring-primary focus:border-primary h-24 w-full resize-none rounded-md border border-gray-300 p-3 font-mono text-[13px] transition-all outline-none focus:ring-1"
                placeholder="Ghi chú hoặc đoạn code vào đây... Markdown được hỗ trợ."
              ></textarea>
              <div className="mt-3 flex items-center justify-between">
                <div className="text-[10px] text-slate-400">
                  Ghi chú của bạn được lưu riêng tư và không ai khác có thể xem.
                </div>
                <button className="rounded bg-slate-800 px-4 py-1.5 text-xs font-bold text-white transition-colors hover:bg-black">
                  Lưu ghi chú
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'summary' && isVideoLesson && (
          <div className="max-w-4xl animate-[fadeIn_0.3s_ease-in-out]">
            <VideoSummaryPanel
              lessonId={lesson?.id}
              lessonTitle={lesson?.title}
              durationSeconds={lesson?.durationSeconds}
              onSeek={onSeekVideo}
            />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="animate-[fadeIn_0.3s_ease-in-out]">
            {courseId ? (
              <CourseQAChat
                key={courseId}
                courseId={courseId}
                courseTitle={courseTitle}
                currentLessonTitle={lesson?.title}
              />
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Chưa có khóa học để hỏi AI.
              </div>
            )}
          </div>
        )}

        {activeTab === 'summary' && isVideoLesson && (
          <div className="max-w-4xl animate-[fadeIn_0.3s_ease-in-out]">
            <VideoSummaryPanel
              lessonId={lesson?.id}
              lessonTitle={lesson?.title}
              durationSeconds={lesson?.durationSeconds}
              onSeek={onSeekVideo}
            />
          </div>
        )}

        {activeTab === 'ai' && (
          <div className="animate-[fadeIn_0.3s_ease-in-out]">
            {courseId ? (
              <CourseQAChat
                key={courseId}
                courseId={courseId}
                courseTitle={courseTitle}
                currentLessonTitle={lesson?.title}
              />
            ) : (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-6 text-center text-sm text-slate-500">
                Chưa có khóa học để hỏi AI.
              </div>
            )}
          </div>
        )}

        {activeTab === 'qa' && (
          <div className="max-w-4xl animate-[fadeIn_0.3s_ease-in-out]">
            <div className="mb-8 flex gap-3">
              <div className="relative flex-1">
                <i className="fa-solid fa-magnifying-glass absolute top-1/2 left-3 -translate-y-1/2 text-sm text-slate-400"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm câu hỏi trong bài này..."
                  className="focus:border-primary focus:ring-primary w-full rounded-md border border-gray-200 bg-slate-50 py-2 pr-4 pl-9 text-[13px] outline-none focus:bg-white focus:ring-1"
                />
              </div>
              <button className="hover:border-primary hover:text-primary rounded-md border border-slate-300 bg-white px-4 py-2 text-[13px] font-bold whitespace-nowrap text-slate-700 transition-colors">
                Đặt câu hỏi mới
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
