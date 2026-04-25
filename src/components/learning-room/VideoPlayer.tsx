/* eslint-disable @next/next/no-img-element */
import React from 'react';
import type { LessonDetail } from '@/types';
import type { MediaListItem } from '@/services/media.service';
import {
  getEmbeddedVideoUrl,
  isEmbeddableVideo,
  normalizeMediaKey,
  resolveMediaUrl,
} from '@/lib/media';

interface VideoPlayerProps {
  lesson?: LessonDetail & { moduleTitle?: string };
  fallbackMediaItems?: MediaListItem[];
  mediaError?: boolean;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function pickFallbackVideoUrl(
  lesson: (LessonDetail & { moduleTitle?: string }) | undefined,
  fallbackMediaItems: MediaListItem[] | undefined,
) {
  if (!lesson || !fallbackMediaItems?.length) {
    return null;
  }

  const lessonKey = normalizeMediaKey(lesson.title);

  const exactMatch =
    fallbackMediaItems.find((item) =>
      normalizeMediaKey(item.originalFilename).includes(lessonKey),
    ) ?? fallbackMediaItems.find((item) => normalizeMediaKey(item.publicId).includes(lessonKey));

  return exactMatch?.playbackUrl ?? fallbackMediaItems[0]?.playbackUrl ?? null;
}

export const VideoPlayer = ({
  lesson,
  fallbackMediaItems,
  mediaError = false,
}: VideoPlayerProps) => {
  const totalDuration = lesson?.durationSeconds ? formatDuration(lesson.durationSeconds) : '--:--';

  // If lesson has videoUrl, show it in an iframe/video player
  // For now, keep the visual placeholder but use lesson data
  const resourceVideoUrl =
    lesson?.resources?.find((resource) => resource.resourceType === 'video')?.fileUrl ?? null;
  const fallbackCloudinaryVideoUrl = pickFallbackVideoUrl(lesson, fallbackMediaItems);
  const videoUrl = resolveMediaUrl(
    lesson?.videoUrl ?? resourceVideoUrl ?? fallbackCloudinaryVideoUrl,
  );
  const embeddedVideoUrl = getEmbeddedVideoUrl(videoUrl);
  const shouldRenderIframe = isEmbeddableVideo(videoUrl);

  return (
    <div className="w-full flex-shrink-0 border-b border-slate-200 bg-black">
      <div className="mx-auto w-full max-w-6xl">
        <div className="video-container group">
          {videoUrl ? (
            shouldRenderIframe && embeddedVideoUrl ? (
              <iframe
                src={embeddedVideoUrl}
                className="h-full min-h-[420px] w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={lesson?.title ?? 'Video lesson'}
              />
            ) : (
              <video
                key={videoUrl}
                src={videoUrl}
                className="h-full w-full object-contain"
                controls
                controlsList="nodownload"
              />
            )
          ) : (
            <>
              <img
                src="https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1500&q=80"
                className="h-full w-full object-cover opacity-80"
                alt="Video frame"
              />
              <div className="absolute inset-0 bg-black/20"></div>
              <div className="absolute top-4 left-4 z-20 max-w-md rounded-md bg-black/60 px-3 py-2 text-xs text-white">
                {mediaError ? 'Không tải được video.' : 'Chưa tìm thấy video cho bài học này.'}
              </div>

              <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="bg-primary/90 pointer-events-auto flex h-16 w-16 transform cursor-pointer items-center justify-center rounded-full text-white shadow-[0_0_30px_rgba(22,119,255,0.5)] backdrop-blur-sm transition-transform group-hover:scale-110">
                  <i className="fa-solid fa-play ml-1 text-2xl"></i>
                </div>
              </div>

              <div className="video-controls absolute bottom-0 left-0 flex w-full flex-col justify-end px-4 pt-10 pb-4">
                <div className="group/progress relative mb-3 w-full">
                  <div className="vid-progress-bar rounded-full">
                    <div className="vid-progress-filled rounded-full"></div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center gap-4">
                    <button className="hover:text-primary transition-colors">
                      <i className="fa-solid fa-play text-lg"></i>
                    </button>
                    <div className="font-mono text-[12px] font-medium tracking-wide">
                      0:00 <span className="mx-1 text-white/50">/</span> {totalDuration}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <button className="hover:text-primary hover:border-primary rounded border border-white/30 px-2 py-0.5 text-[12px] font-bold transition-colors">
                      1x
                    </button>
                    <button
                      className="hover:text-primary ml-2 transition-colors"
                      title="Toàn màn hình"
                    >
                      <i className="fa-solid fa-expand text-lg"></i>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
