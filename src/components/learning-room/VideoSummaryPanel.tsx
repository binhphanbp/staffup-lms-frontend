'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  Lightbulb,
  BookOpen,
  Layers,
  RefreshCw,
  FileText,
  Play,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { toast } from '@/lib/toast';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useVideoSummary, useGenerateVideoSummary } from '@/hooks/useVideoSummary';
import type { VideoSummaryChapter, VideoSummaryFlashcard } from '@/services/video-summary.service';

interface VideoSummaryPanelProps {
  lessonId: string | null | undefined;
  lessonTitle?: string;
  durationSeconds?: number;
  /** Fire when user clicks a chapter card to seek the player. */
  onSeek?: (seconds: number) => void;
}

const fmt = (s: number): string => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  return `${m}:${String(sec).padStart(2, '0')}`;
};

export const VideoSummaryPanel = ({
  lessonId,
  lessonTitle,
  durationSeconds,
  onSeek,
}: VideoSummaryPanelProps) => {
  const hasRole = useAuthStore((s) => s.hasRole);
  const canGenerate = hasRole('admin') || hasRole('trainer');

  const { data, isLoading, isError, refetch } = useVideoSummary(lessonId);
  const generateMutation = useGenerateVideoSummary(lessonId);

  const [showTranscript, setShowTranscript] = useState(false);
  const [flippedCardKeys, setFlippedCardKeys] = useState<Record<string, boolean>>({});

  const chapters = data?.chapters ?? [];
  const keyPoints = data?.keyPoints ?? [];
  const flashcards = data?.flashcards ?? [];

  const generatedAt = data?.generatedAt ? new Date(data.generatedAt).toLocaleString('vi-VN') : null;

  const doGenerate = async (regenerate: boolean) => {
    try {
      await generateMutation.mutateAsync({
        regenerate,
        language: 'vi',
        chapterCount: 5,
        flashcardCount: 8,
      });
      toast.success(regenerate ? 'Đã làm mới tóm tắt bằng AI.' : 'Đã sinh tóm tắt bằng AI.');
      refetch();
    } catch (error) {
      const message =
        (error as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        'Không thể sinh tóm tắt. Vui lòng thử lại sau.';
      toast.error(message);
    }
  };

  if (!lessonId) {
    return (
      <EmptyState
        icon={<Sparkles className="size-6" aria-hidden />}
        title="Chưa có bài học"
        description="Chọn một bài học video để xem tóm tắt AI."
      />
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-5">
        <div className="grid gap-3 md:grid-cols-2">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (isError) {
    return (
      <EmptyState
        icon={<Sparkles className="size-6" aria-hidden />}
        title="Không tải được tóm tắt"
        description="Thử lại hoặc liên hệ quản trị viên."
        action={
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="size-4" />
            Thử lại
          </Button>
        }
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        icon={<Sparkles className="size-6" aria-hidden />}
        title="Bài học chưa có tóm tắt AI"
        description={
          canGenerate
            ? 'Bấm nút bên dưới để Gemini sinh transcript, chương, điểm chính và flashcard ôn tập.'
            : 'Giảng viên/admin sẽ sinh tóm tắt AI cho bài học này.'
        }
        action={
          canGenerate ? (
            <Button
              onClick={() => doGenerate(false)}
              disabled={generateMutation.isPending}
              className="bg-gradient-to-r from-indigo-500 to-violet-500 text-white hover:from-indigo-600 hover:to-violet-600"
            >
              {generateMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Sparkles className="size-4" />
              )}
              Sinh tóm tắt AI
            </Button>
          ) : null
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-3 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 via-white to-violet-50 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
            <Sparkles className="size-5" aria-hidden />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Tóm tắt AI</h3>
              <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-semibold text-indigo-600 ring-1 ring-indigo-200">
                Gemini
              </span>
            </div>
            <p className="text-xs text-slate-500">
              {lessonTitle ? `${lessonTitle} · ` : ''}
              {generatedAt ? `Cập nhật ${generatedAt}` : 'Vừa cập nhật'}
            </p>
          </div>
        </div>
        {canGenerate && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => doGenerate(true)}
              disabled={generateMutation.isPending}
            >
              {generateMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <RefreshCw className="size-4" />
              )}
              Sinh lại
            </Button>
          </div>
        )}
      </div>

      {/* Key points */}
      {keyPoints.length > 0 && (
        <section>
          <h4 className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
            <Lightbulb className="size-4 text-amber-500" aria-hidden />
            Điểm chính cần nhớ
          </h4>
          <ul className="space-y-2">
            {keyPoints.map((kp, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 rounded-lg border border-amber-100 bg-amber-50/60 px-3 py-2 text-[13px] leading-relaxed text-slate-700"
              >
                <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                  {idx + 1}
                </span>
                <span>{kp}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Chapters */}
      {chapters.length > 0 && (
        <section>
          <h4 className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
            <Layers className="size-4 text-indigo-500" aria-hidden />
            Chương / Mốc thời gian
            {durationSeconds ? (
              <span className="ml-auto text-[11px] font-medium text-slate-400 normal-case">
                Thời lượng: {fmt(durationSeconds)}
              </span>
            ) : null}
          </h4>
          <ol className="space-y-2">
            {chapters.map((ch: VideoSummaryChapter, idx: number) => (
              <li key={`${ch.startSec}-${idx}`}>
                <button
                  type="button"
                  onClick={() => onSeek?.(ch.startSec)}
                  className={cn(
                    'group w-full rounded-lg border border-slate-200 bg-white p-3 text-left transition-all hover:border-indigo-300 hover:shadow-sm',
                    onSeek ? 'cursor-pointer' : 'cursor-default',
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600 group-hover:bg-indigo-100 group-hover:text-indigo-700">
                      {onSeek ? (
                        <Play
                          className="size-3 fill-current opacity-0 transition-opacity group-hover:opacity-100"
                          aria-hidden
                        />
                      ) : null}
                      <span className={onSeek ? 'group-hover:hidden' : ''}>{idx + 1}</span>
                    </span>
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <h5 className="text-[13px] font-semibold text-slate-900">{ch.title}</h5>
                        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-semibold text-slate-600">
                          {fmt(ch.startSec)}
                        </span>
                      </div>
                      {ch.summary ? (
                        <p className="mt-1 line-clamp-2 text-[12.5px] leading-relaxed text-slate-500">
                          {ch.summary}
                        </p>
                      ) : null}
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* Flashcards */}
      {flashcards.length > 0 && (
        <section>
          <h4 className="mb-2 flex items-center gap-2 text-xs font-bold tracking-wide text-slate-500 uppercase">
            <BookOpen className="size-4 text-emerald-500" aria-hidden />
            Flashcards ôn tập ({flashcards.length})
            <span className="ml-auto text-[11px] font-medium text-slate-400 normal-case">
              Bấm thẻ để lật
            </span>
          </h4>
          <div className="grid gap-3 sm:grid-cols-2">
            {flashcards.map((fc: VideoSummaryFlashcard, idx: number) => {
              const key = `${idx}-${fc.front.slice(0, 12)}`;
              const flipped = Boolean(flippedCardKeys[key]);
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFlippedCardKeys((prev) => ({ ...prev, [key]: !prev[key] }))}
                  className={cn(
                    'group relative min-h-[110px] w-full rounded-xl border p-4 text-left transition-all',
                    flipped
                      ? 'border-emerald-300 bg-emerald-50'
                      : 'border-slate-200 bg-white hover:border-emerald-200 hover:shadow-sm',
                  )}
                  aria-pressed={flipped}
                >
                  <span
                    className={cn(
                      'absolute top-3 right-3 rounded-full px-2 py-0.5 text-[10px] font-bold',
                      flipped
                        ? 'bg-emerald-500 text-white'
                        : 'bg-slate-100 text-slate-500 group-hover:bg-emerald-100 group-hover:text-emerald-700',
                    )}
                  >
                    {flipped ? 'Mặt sau' : 'Mặt trước'}
                  </span>
                  <div className="pr-16 text-[13.5px] leading-relaxed text-slate-800">
                    {flipped ? fc.back : fc.front}
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* Transcript (collapsible) */}
      {data.transcript && (
        <section>
          <button
            type="button"
            onClick={() => setShowTranscript((v) => !v)}
            className="flex w-full items-center justify-between rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] font-semibold text-slate-700 transition-colors hover:bg-slate-100"
            aria-expanded={showTranscript}
          >
            <span className="flex items-center gap-2">
              <FileText className="size-4 text-slate-500" aria-hidden />
              Transcript / Ghi chú chi tiết
            </span>
            {showTranscript ? (
              <ChevronUp className="size-4" aria-hidden />
            ) : (
              <ChevronDown className="size-4" aria-hidden />
            )}
          </button>
          {showTranscript && (
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4 text-[13px] leading-relaxed whitespace-pre-line text-slate-700">
              {data.transcript}
            </div>
          )}
        </section>
      )}

      <p className="rounded-md bg-slate-50 px-3 py-2 text-[11px] text-slate-400 italic">
        Nội dung do AI sinh tự động dựa trên bài học. Vui lòng đối chiếu với video gốc cho các chi
        tiết quan trọng.
      </p>
    </div>
  );
};
