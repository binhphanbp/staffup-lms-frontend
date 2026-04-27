'use client';

import React, { useRef, useCallback, useState, useEffect } from 'react';
import type { LessonDetail } from '@/types';
import type { MediaListItem } from '@/services/media.service';
import {
  getEmbeddedVideoUrl,
  isEmbeddableVideo,
  normalizeMediaKey,
  resolveMediaUrl,
} from '@/lib/media';
import { useStartLesson, useUpdateLessonProgress, useCompleteLesson } from '@/hooks/useEnrollments';

export interface VideoPlayerProps {
  lesson?: LessonDetail & { moduleTitle?: string };
  fallbackMediaItems?: MediaListItem[];
  mediaError?: boolean;
  enrollmentId?: string | null;
  isCompleted?: boolean;
  lastPositionSeconds?: number;
  onLessonComplete?: () => void;
  onNextLesson?: () => void;
  onPrevLesson?: () => void;
  hasNextLesson?: boolean;
  hasPrevLesson?: boolean;
}

function fmtTime(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
}

function pickFallbackUrl(
  lesson: (LessonDetail & { moduleTitle?: string }) | undefined,
  items: MediaListItem[] | undefined,
): string | null {
  if (!lesson || !items?.length) return null;
  const key = normalizeMediaKey(lesson.title);
  return (
    (
      items.find((i) => normalizeMediaKey(i.originalFilename).includes(key)) ??
      items.find((i) => normalizeMediaKey(i.publicId).includes(key)) ??
      items[0]
    )?.playbackUrl ?? null
  );
}

function buildEmbedUrl(raw: string | null): string | null {
  const embedUrl = getEmbeddedVideoUrl(raw);
  if (!embedUrl) return null;
  const sep = embedUrl.includes('?') ? '&' : '?';
  if (embedUrl.includes('youtube.com/embed/'))
    return `${embedUrl}${sep}enablejsapi=1&rel=0&modestbranding=1`;
  if (embedUrl.includes('player.vimeo.com')) return `${embedUrl}${sep}api=1`;
  return embedUrl;
}

export const VideoPlayer = ({
  lesson,
  fallbackMediaItems,
  mediaError = false,
  enrollmentId,
  isCompleted: isCompletedProp = false,
  lastPositionSeconds = 0,
  onLessonComplete,
  onNextLesson,
  onPrevLesson,
  hasNextLesson = false,
  hasPrevLesson = false,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [localPct, setLocalPct] = useState(0);
  const [localTime, setLocalTime] = useState(0);
  const [localDuration, setLocalDuration] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);
  const completedRef = useRef(false);
  const lastSyncRef = useRef(0);

  const startLesson = useStartLesson();
  const completeLesson = useCompleteLesson();
  const updateProgress = useUpdateLessonProgress();

  const lessonId = lesson?.id;

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShowBanner(isCompletedProp);
    setLocalPct(0);
    setLocalTime(0);
    setLocalDuration(0);
    setCountdown(null);
    startedRef.current = false;
    completedRef.current = isCompletedProp;
    lastSyncRef.current = 0;
    if (countdownRef.current) clearInterval(countdownRef.current);
  }, [lessonId, isCompletedProp]);

  useEffect(() => {
    if (videoRef.current && lastPositionSeconds > 0) {
      videoRef.current.currentTime = lastPositionSeconds;
    }
  }, [lessonId, lastPositionSeconds]);

  const triggerStart = useCallback(() => {
    if (!enrollmentId || !lessonId || startedRef.current) return;
    startedRef.current = true;
    startLesson.mutate({ enrollmentId, lessonId });
  }, [enrollmentId, lessonId, startLesson]);

  const startCountdown = useCallback(() => {
    if (!hasNextLesson || countdownRef.current) return;
    setCountdown(5);
    countdownRef.current = setInterval(() => {
      setCountdown((c) => {
        if (c === null || c <= 1) {
          clearInterval(countdownRef.current!);
          countdownRef.current = null;
          onNextLesson?.();
          return null;
        }
        return c - 1;
      });
    }, 1000);
  }, [hasNextLesson, onNextLesson]);

  const triggerComplete = useCallback(() => {
    if (!enrollmentId || !lessonId || completedRef.current) return;
    completedRef.current = true;
    setShowBanner(true);
    completeLesson.mutate(
      { enrollmentId, lessonId },
      {
        onSuccess: () => {
          onLessonComplete?.();
          startCountdown();
        },
      },
    );
  }, [enrollmentId, lessonId, completeLesson, onLessonComplete, startCountdown]);

  const handleTimeUpdate = useCallback(
    (current: number, total: number) => {
      if (!total) return;
      const pct = (current / total) * 100;
      setLocalPct(pct);
      setLocalTime(current);
      setLocalDuration(total);
      if (pct >= 90 && !completedRef.current) triggerComplete();
      const now = Date.now();
      if (now - lastSyncRef.current > 15_000 && enrollmentId && lessonId && startedRef.current) {
        lastSyncRef.current = now;
        updateProgress.mutate({
          enrollmentId,
          lessonId,
          payload: {
            watchTimeSeconds: Math.round(current),
            lastPositionSeconds: Math.round(current),
          },
        });
      }
    },
    [enrollmentId, lessonId, triggerComplete, updateProgress],
  );

  const resVideoUrl = resolveMediaUrl(
    lesson?.videoUrl ??
      lesson?.resources?.find((r) => r.resourceType === 'video')?.fileUrl ??
      pickFallbackUrl(lesson, fallbackMediaItems),
  );
  const isIframe = isEmbeddableVideo(resVideoUrl);
  const embedUrl = buildEmbedUrl(resVideoUrl);

  useEffect(() => {
    if (!isIframe) return;
    const onMsg = (e: MessageEvent) => {
      try {
        const d = typeof e.data === 'string' ? JSON.parse(e.data) : e.data;
        if (d.event === 'onStateChange') {
          if (d.info === 1) triggerStart();
          if (d.info === 0) triggerComplete();
        }
        if (d.event === 'finish') triggerComplete();
        if (d.event === 'play') triggerStart();
        if (d.event === 'timeupdate' && d.data?.duration)
          handleTimeUpdate(d.data.seconds, d.data.duration);
      } catch {}
    };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [isIframe, triggerStart, triggerComplete, handleTimeUpdate]);

  // Listen for external seek requests (e.g. chapter clicks in the AI summary panel).
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<{ seconds?: number; lessonId?: string }>).detail;
      if (!detail || typeof detail.seconds !== 'number') return;
      if (detail.lessonId && lessonId && detail.lessonId !== lessonId) return;
      const seconds = Math.max(0, detail.seconds);
      if (videoRef.current) {
        try {
          videoRef.current.currentTime = seconds;
          void videoRef.current.play?.();
        } catch {}
        return;
      }
      if (isIframe) {
        const iframe = document.querySelector(
          'iframe[data-learning-video]',
        ) as HTMLIFrameElement | null;
        if (!iframe?.contentWindow) return;
        if (embedUrl?.includes('youtube.com/embed/')) {
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'seekTo', args: [seconds, true] }),
            '*',
          );
          iframe.contentWindow.postMessage(
            JSON.stringify({ event: 'command', func: 'playVideo' }),
            '*',
          );
        } else if (embedUrl?.includes('player.vimeo.com')) {
          iframe.contentWindow.postMessage(
            JSON.stringify({ method: 'setCurrentTime', value: seconds }),
            '*',
          );
          iframe.contentWindow.postMessage(JSON.stringify({ method: 'play' }), '*');
        }
      }
    };
    window.addEventListener('learning-room:seek', handler);
    return () => window.removeEventListener('learning-room:seek', handler);
  }, [isIframe, embedUrl, lessonId]);

  const cancelCountdown = () => {
    if (countdownRef.current) {
      clearInterval(countdownRef.current);
      countdownRef.current = null;
    }
    setCountdown(null);
  };

  return (
    <div className="relative w-full flex-shrink-0 bg-black">
      {/* ── Video / Iframe ─────────────────────────────── */}
      <div className="relative aspect-video w-full bg-black">
        {resVideoUrl ? (
          isIframe && embedUrl ? (
            <iframe
              key={embedUrl}
              src={embedUrl}
              data-learning-video=""
              className="h-full w-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title={lesson?.title ?? 'Video lesson'}
            />
          ) : (
            <video
              key={lessonId}
              ref={videoRef}
              src={resVideoUrl}
              className="h-full w-full object-contain"
              controls
              controlsList="nodownload"
              onPlay={triggerStart}
              onEnded={triggerComplete}
              onTimeUpdate={(e) => {
                const v = e.currentTarget;
                handleTimeUpdate(v.currentTime, v.duration);
              }}
            />
          )
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-slate-900">
            <div className="text-center">
              <i className="fa-solid fa-video-slash mb-3 block text-3xl text-slate-600"></i>
              <p className="text-sm text-slate-400">
                {mediaError ? 'Không tải được video.' : 'Chưa có video cho bài học này.'}
              </p>
            </div>
          </div>
        )}

        {/* ── Completion Overlay ─────────────────────── */}
        {showBanner && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/75 backdrop-blur-[2px]">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/20 ring-4 ring-green-500/30">
              <i className="fa-solid fa-check text-2xl text-green-400"></i>
            </div>
            <p className="mb-1 text-lg font-bold text-white">Bài học hoàn thành!</p>
            <p className="mb-6 text-sm text-slate-300">{lesson?.title}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setShowBanner(false);
                  cancelCountdown();
                }}
                className="rounded-lg border border-white/20 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                <i className="fa-solid fa-rotate-left mr-2"></i>Xem lại
              </button>
              {hasNextLesson && (
                <button
                  onClick={() => {
                    cancelCountdown();
                    onNextLesson?.();
                  }}
                  className="bg-primary hover:bg-primary-hover flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold text-white shadow-lg shadow-blue-500/30 transition-all"
                >
                  Bài tiếp theo
                  {countdown !== null && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 text-[11px] font-black">
                      {countdown}
                    </span>
                  )}
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </button>
              )}
            </div>
          </div>
        )}

        {/* ── Prev / Next floating buttons (non-completion) ── */}
        {!showBanner && (hasPrevLesson || hasNextLesson) && (
          <div className="pointer-events-none absolute top-1/2 flex w-full -translate-y-1/2 items-center justify-between px-3">
            {hasPrevLesson ? (
              <button
                onClick={onPrevLesson}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                style={{ opacity: 1 }}
              >
                <i className="fa-solid fa-chevron-left text-xs"></i>
              </button>
            ) : (
              <div />
            )}
            {hasNextLesson ? (
              <button
                onClick={onNextLesson}
                className="pointer-events-auto flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-black/80"
              >
                <i className="fa-solid fa-chevron-right text-xs"></i>
              </button>
            ) : (
              <div />
            )}
          </div>
        )}
      </div>

      {/* ── Progress bar (native video only) ─────────── */}
      {!isIframe && resVideoUrl && (
        <div className="h-0.5 w-full bg-slate-800">
          <div
            className="bg-primary h-full transition-[width] duration-500"
            style={{ width: `${localPct}%` }}
          />
        </div>
      )}

      {/* ── Lesson meta bar ────────────────────────────── */}
      <div className="flex items-center justify-between bg-slate-900 px-4 py-2 text-[12px] text-slate-400">
        <div className="flex items-center gap-3">
          {lesson?.lessonType && (
            <span className="flex items-center gap-1.5 rounded bg-slate-800 px-2 py-0.5 font-medium capitalize">
              <i
                className={`fa-solid ${lesson.lessonType === 'video' ? 'fa-circle-play' : lesson.lessonType === 'quiz' ? 'fa-flask-vial' : 'fa-file-lines'} text-primary text-[10px]`}
              ></i>
              {lesson.lessonType}
            </span>
          )}
          {lesson?.moduleTitle && <span className="truncate">{lesson.moduleTitle}</span>}
        </div>
        {localDuration > 0 && (
          <span className="font-mono text-[11px]">
            {fmtTime(localTime)} <span className="text-slate-600">/</span> {fmtTime(localDuration)}
          </span>
        )}
      </div>
    </div>
  );
};
