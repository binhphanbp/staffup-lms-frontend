'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, BookOpen, Users, Target } from 'lucide-react';
import type { RoadmapListItem } from '@/services/roadmap.service';

interface LearningPathCardProps {
  roadmap: RoadmapListItem;
}

function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days} ngày`;
  const months = Math.floor(days / 30);
  return `${months} tháng`;
}

export const LearningPathCard = ({ roadmap }: LearningPathCardProps) => {
  return (
    <Link
      href={`/learning-path/${roadmap.id}`}
      className="group flex h-full flex-col bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      {/* Header Section */}
      <div className="relative h-32 shrink-0 overflow-hidden rounded-t-xl bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Icon */}
        <div className="absolute top-4 left-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
            <i className="fa-solid fa-route text-primary text-xl"></i>
          </div>
        </div>

        {/* Category badge */}
        <div className="absolute top-4 right-4">
          <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-700 shadow-sm">
            {roadmap.category?.name || 'N/A'}
          </span>
        </div>

        {/* Stats at bottom */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3 text-slate-600">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span className="text-[11px] font-semibold">{roadmap.stats?.totalCourses || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3.5 w-3.5" />
            <span className="text-[11px] font-semibold">{roadmap.stats?.totalAssignments || 0}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[11px] font-semibold">{formatDuration(roadmap.stats?.totalEstimatedMinutes || 0)}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Department */}
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>Phòng ban: {roadmap.department?.name || 'N/A'}</span>
        </div>

        {/* Title */}
        <h3 className="group-hover:text-primary mb-2 text-[14px] leading-snug font-bold text-slate-800 transition-colors line-clamp-2">
          {roadmap.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-[12px] text-slate-500">{roadmap.description}</p>

        <div className="mt-auto"></div>

        {/* Target Position */}
        {roadmap.targetPosition && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 border border-blue-100">
            <Target className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[11px] font-semibold text-blue-700">
              Mục tiêu: {roadmap.targetPosition}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="my-3 h-px w-full bg-gray-100"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100">
              <span className="text-[10px] font-bold text-blue-600">{roadmap.stats?.requiredCourses || 0}</span>
            </div>
            <span className="text-[11px] font-medium text-slate-600">Bắt buộc</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100">
              <span className="text-[10px] font-bold text-green-600">{roadmap.stats?.optionalCourses || 0}</span>
            </div>
            <span className="text-[11px] font-medium text-slate-600">Tùy chọn</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
