/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, SkipForward } from 'lucide-react';
import type { LessonDetail } from '@/types';
import { useUpdateLessonProgress, useCompleteLesson } from '@/hooks/useEnrollments';

interface VideoPlayerProps {
  lesson?: LessonDetail & { moduleTitle?: string };
  enrollmentId: string | null;
  onLessonComplete?: () => void;
  onNextLesson?: () => void;
  onPreviousLesson?: () => void;
  hasNextLesson?: boolean;
  hasPreviousLesson?: boolean;
  onTimeUpdate?: (time: number) => void;
  lastPositionSeconds?: number;
}

export const VideoPlayerWithTracking = ({ 
  lesson, 
  enrollmentId,
  onLessonComplete,
  onNextLesson,
  onPreviousLesson,
  hasNextLesson,
  hasPreviousLesson,
  onTimeUpdate,
  lastPositionSeconds = 0,
}: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [hasStarted, setHasStarted] = useState(false);
  const [isPiP, setIsPiP] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const [isCompleting, setIsCompleting] = useState(false);

  const updateProgress = useUpdateLessonProgress();
  const completeLesson = useCompleteLesson();

  // Keyboard shortcuts (Space, Arrow keys)
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight':
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (videoRef.current) {
            const newVol = Math.min(videoRef.current.volume + 0.1, 1);
            videoRef.current.volume = newVol;
            setVolume(newVol);
            setIsMuted(false);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (videoRef.current) {
            const newVol = Math.max(videoRef.current.volume - 0.1, 0);
            videoRef.current.volume = newVol;
            setVolume(newVol);
            if (newVol === 0) setIsMuted(true);
          }
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Auto-hide controls after 3 seconds
  useEffect(() => {
    if (!showControls) return;
    const timer = setTimeout(() => {
      if (isPlaying) setShowControls(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, [showControls, isPlaying]);

  // Save progress every 10 seconds
  useEffect(() => {
    if (!enrollmentId || !lesson?.id || !hasStarted) return;

    const interval = setInterval(() => {
      if (videoRef.current && !videoRef.current.paused) {
        const watchTime = Math.floor(videoRef.current.currentTime);
        const lastPosition = Math.floor(videoRef.current.currentTime);
        
        updateProgress.mutate({
          enrollmentId,
          lessonId: lesson.id,
          payload: {
            watchTimeSeconds: watchTime,
            lastPositionSeconds: lastPosition,
            status: 'in_progress',
          },
        });
      }
    }, 10000); // Save every 10 seconds

    return () => clearInterval(interval);
  }, [enrollmentId, lesson?.id, hasStarted, updateProgress]);

  // Check if video is near end (95%) to mark as complete
  useEffect(() => {
    if (!videoRef.current || !lesson?.id || !enrollmentId) return;

    const video = videoRef.current;
    const handleTimeUpdate = () => {
      const progress = (video.currentTime / video.duration) * 100;
      
      // Auto-complete when reaching 95% (only once)
      if (progress >= 95 && !lesson.isPreview && !isCompleting) {
        setIsCompleting(true);
        completeLesson.mutate(
          { enrollmentId, lessonId: lesson.id },
          {
            onSuccess: () => {
              onLessonComplete?.();
            },
            onError: () => {
              setIsCompleting(false); // Reset on error to allow retry
            },
          }
        );
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    return () => video.removeEventListener('timeupdate', handleTimeUpdate);
  }, [enrollmentId, lesson?.id, lesson?.isPreview, completeLesson, onLessonComplete, isCompleting]);

  // Reset isCompleting when lesson changes
  useEffect(() => {
    setIsCompleting(false);
  }, [lesson?.id]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
      if (!hasStarted) setHasStarted(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    setCurrentTime(time);
    onTimeUpdate?.(time);
  };

  const handleLoadedMetadata = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
    setIsLoading(false);
    
    // Resume from last position if available (and > 5 seconds)
    if (lastPositionSeconds > 5) {
      videoRef.current.currentTime = lastPositionSeconds;
      setCurrentTime(lastPositionSeconds);
    }
  };

  const handleCanPlay = () => {
    setIsLoading(false);
  };

  const handleWaiting = () => {
    setIsLoading(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const time = parseFloat(e.target.value);
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current) return;
    const vol = parseFloat(e.target.value);
    videoRef.current.volume = vol;
    setVolume(vol);
    setIsMuted(vol === 0);
  };

  const changePlaybackRate = () => {
    if (!videoRef.current) return;
    const rates = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
    const currentIndex = rates.indexOf(playbackRate);
    const nextRate = rates[(currentIndex + 1) % rates.length];
    videoRef.current.playbackRate = nextRate;
    setPlaybackRate(nextRate);
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const togglePiP = async () => {
    if (!videoRef.current) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
        setIsPiP(false);
      } else {
        await videoRef.current.requestPictureInPicture();
        setIsPiP(true);
      }
    } catch (err) {
      console.error('PiP error:', err);
    }
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(
      videoRef.current.currentTime + 10,
      videoRef.current.duration
    );
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    }
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  if (!lesson) {
    return (
      <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-white">
            <i className="fa-solid fa-spinner fa-spin mb-4 text-4xl opacity-50"></i>
            <p className="text-sm opacity-75">Đang tải bài học...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!lesson.videoUrl) {
    return (
      <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-white">
            <i className="fa-solid fa-video-slash mb-4 text-4xl opacity-50"></i>
            <p className="text-sm opacity-75">Bài học này chưa có video</p>
          </div>
        </div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className="relative w-full bg-black" style={{ aspectRatio: '16/9' }}>
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-white">
            <i className="fa-solid fa-triangle-exclamation mb-4 text-4xl text-red-500"></i>
            <p className="text-sm opacity-75">Không thể tải video</p>
            <p className="mt-2 text-xs opacity-50">Vui lòng thử lại sau hoặc liên hệ hỗ trợ</p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
                if (videoRef.current) {
                  videoRef.current.load();
                }
              }}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative w-full bg-black group"
      style={{ aspectRatio: '16/9' }}
      onMouseMove={() => setShowControls(true)}
      onMouseLeave={() => isPlaying && setShowControls(false)}
    >
      <video
        ref={videoRef}
        src={lesson.videoUrl}
        className="h-full w-full"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onCanPlay={handleCanPlay}
        onWaiting={handleWaiting}
        onError={handleError}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onClick={togglePlay}
        crossOrigin="anonymous"
        preload="metadata"
      />

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <i className="fa-solid fa-spinner fa-spin text-4xl text-white"></i>
        </div>
      )}

      {/* Preview Mode Warning */}
      {!enrollmentId && (
        <div className="absolute top-4 left-4 right-4 z-30 flex items-center gap-2 rounded-lg bg-yellow-500 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          <i className="fa-solid fa-info-circle"></i>
          <span>Chế độ xem trước - Tiến độ học không được lưu. Vui lòng ghi danh để lưu tiến độ.</span>
        </div>
      )}

      {/* Completing lesson indicator */}
      {isCompleting && (
        <div className="absolute top-4 right-4 z-30 flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-lg">
          <i className="fa-solid fa-check-circle"></i>
          <span>Đang hoàn thành bài học...</span>
        </div>
      )}

      {/* Play button overlay (when paused) */}
      {!isPlaying && (
        <div 
          className="absolute inset-0 flex items-center justify-center bg-black/20 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-transform hover:scale-110">
            <Play className="ml-1 h-8 w-8" fill="white" />
          </div>
        </div>
      )}

      {/* Controls */}
      <div 
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-opacity ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Progress bar */}
        <div className="mb-3">
          <input
            type="range"
            min="0"
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="w-full cursor-pointer"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(currentTime / duration) * 100}%, #4b5563 ${(currentTime / duration) * 100}%, #4b5563 100%)`,
            }}
          />
        </div>

        <div className="flex items-center justify-between text-white">
          {/* Left controls */}
          <div className="flex items-center gap-3">
            <button onClick={togglePlay} className="hover:text-blue-400 transition-colors">
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </button>

            <button onClick={skipBackward} className="hover:text-blue-400 transition-colors">
              <RotateCcw className="h-4 w-4" />
            </button>

            <button onClick={skipForward} className="hover:text-blue-400 transition-colors">
              <SkipForward className="h-4 w-4" />
            </button>

            <div className="flex items-center gap-2">
              <button onClick={toggleMute} className="hover:text-blue-400 transition-colors">
                {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20 cursor-pointer"
              />
            </div>

            <span className="text-xs font-mono">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={changePlaybackRate}
              className="rounded border border-white/30 px-2 py-1 text-xs font-semibold hover:bg-white/10 transition-colors"
            >
              {playbackRate}x
            </button>

            <button 
              onClick={togglePiP} 
              className="hover:text-blue-400 transition-colors"
              title="Picture-in-Picture"
            >
              <i className="fa-solid fa-up-right-from-square text-sm"></i>
            </button>

            <button onClick={toggleFullscreen} className="hover:text-blue-400 transition-colors">
              <Maximize className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
