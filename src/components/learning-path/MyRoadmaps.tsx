'use client';

import React from 'react';
import Link from 'next/link';
import { useRoadmapAssignments } from '@/hooks/useRoadmaps';
import { Clock, BookOpen, Target, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import type { RoadmapAssignment } from '@/services/roadmap.service';

const statusConfig = {
  assigned: { 
    label: 'Chưa bắt đầu', 
    color: 'bg-slate-100 text-slate-700',
    icon: 'fa-circle'
  },
  in_progress: { 
    label: 'Đang học', 
    color: 'bg-blue-100 text-blue-700',
    icon: 'fa-circle-play'
  },
  completed: { 
    label: 'Hoàn thành', 
    color: 'bg-green-100 text-green-700',
    icon: 'fa-circle-check'
  },
  dropped: { 
    label: 'Đã hủy', 
    color: 'bg-red-100 text-red-700',
    icon: 'fa-circle-xmark'
  },
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

interface RoadmapAssignmentCardProps {
  assignment: RoadmapAssignment;
}

const RoadmapAssignmentCard = ({ assignment }: RoadmapAssignmentCardProps) => {
  const statusInfo = statusConfig[assignment.status];

  return (
    <Link
      href={`/learning-path/${assignment.roadmapId}`}
      className="card group flex h-full flex-col"
    >
      {/* Header Section */}
      <div className="relative h-32 shrink-0 overflow-hidden rounded-t-xl bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Icon */}
        <div className="absolute top-4 left-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
            <i className="fa-solid fa-route text-primary text-xl"></i>
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ${statusInfo.color}`}>
            <i className={`fa-solid ${statusInfo.icon}`}></i>
            {statusInfo.label}
          </span>
        </div>

        {/* Stats at bottom */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center gap-3 text-slate-600">
          <div className="flex items-center gap-1">
            <BookOpen className="h-3.5 w-3.5" />
            <span className="text-[11px] font-semibold">{assignment.roadmap.coursesCount} khóa</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span className="text-[11px] font-semibold">{formatDate(assignment.assignedAt)}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Department & Category */}
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>{assignment.roadmap.department.name}</span>
          <span className="rounded bg-slate-100 px-2 py-0.5 font-sans font-semibold text-slate-600">
            {assignment.roadmap.category.name}
          </span>
        </div>

        {/* Title */}
        <h3 className="group-hover:text-primary mb-2 text-[14px] leading-snug font-bold text-slate-800 transition-colors line-clamp-2">
          {assignment.roadmap.title}
        </h3>

        {/* Description */}
        <p className="mb-4 line-clamp-2 text-[12px] text-slate-500">{assignment.roadmap.description}</p>

        <div className="mt-auto"></div>

        {/* Target Position */}
        {assignment.roadmap.targetPosition && (
          <div className="mb-3 flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 border border-blue-100">
            <Target className="h-3.5 w-3.5 text-blue-600" />
            <span className="text-[11px] font-semibold text-blue-700">
              {assignment.roadmap.targetPosition}
            </span>
          </div>
        )}

        {/* Footer */}
        <div className="my-3 h-px w-full bg-gray-100"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(assignment.assignedBy.fullName)}&background=f1f5f9&color=475569`}
              className="h-6 w-6 rounded-full border border-gray-200"
              alt="Assigned by"
            />
            <div className="max-w-25 truncate text-[11px] font-medium text-slate-600">
              {assignment.assignedBy.fullName}
            </div>
          </div>
          <div className="text-primary text-[11px] font-bold">
            {assignment.status === 'assigned' ? 'Bắt đầu học' : 'Tiếp tục học'}
          </div>
        </div>
      </div>
    </Link>
  );
};

export const MyRoadmaps = () => {
  const { data, isLoading, error } = useRoadmapAssignments();

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex items-center gap-3 text-slate-400">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm font-medium">Đang tải lộ trình...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex flex-col items-center gap-4">
          <AlertCircle className="h-12 w-12 text-red-500" />
          <div>
            <p className="text-lg font-bold text-slate-800 mb-1">Không thể tải dữ liệu</p>
            <p className="text-sm text-slate-500">Vui lòng thử lại sau</p>
          </div>
        </div>
      </div>
    );
  }

  if (!data?.data || data.data.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <Target className="h-10 w-10 text-slate-400" />
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 mb-1">Chưa có lộ trình nào</p>
            <p className="text-sm text-slate-500 max-w-md">
              Bạn chưa được giao lộ trình học tập nào. Hãy khám phá các lộ trình có sẵn hoặc liên hệ với quản lý của bạn.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats bar */}
      <div className="sticky top-0 z-20 flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-medium text-slate-600">
            Tổng cộng <span className="font-bold text-slate-900">{data.meta.total}</span> lộ trình
          </h2>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-blue-500"></div>
            <span className="text-slate-600">
              <span className="font-bold text-slate-800">{data.data.filter(a => a.status === 'in_progress').length}</span> Đang học
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-slate-600">
              <span className="font-bold text-slate-800">{data.data.filter(a => a.status === 'completed').length}</span> Hoàn thành
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2 w-2 rounded-full bg-slate-400"></div>
            <span className="text-slate-600">
              <span className="font-bold text-slate-800">{data.data.filter(a => a.status === 'assigned').length}</span> Chưa bắt đầu
            </span>
          </div>
        </div>
      </div>

      {/* Roadmap Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {data.data.map((assignment) => (
          <RoadmapAssignmentCard key={assignment.id} assignment={assignment} />
        ))}
      </div>
    </div>
  );
};
