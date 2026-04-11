'use client';

import React from 'react';
import { LearningPathCard } from './LearningPathCard';
import { useRoadmaps } from '@/hooks/useRoadmaps';
import { AlertCircle } from 'lucide-react';

interface LearningPathListProps {
  selectedCategory: string;
}

export const LearningPathList = ({ selectedCategory }: LearningPathListProps) => {
  const { data, isLoading, error } = useRoadmaps({
    categoryId: selectedCategory || undefined,
    isActive: true,
  });

  const roadmaps = data?.data ?? [];

  if (isLoading) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex items-center gap-3 text-slate-400">
          <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
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

  if (!roadmaps || roadmaps.length === 0) {
    return (
      <div className="py-20 text-center">
        <div className="inline-flex flex-col items-center gap-4">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
            <i className="fa-solid fa-route text-3xl text-slate-400"></i>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 mb-1">Không tìm thấy lộ trình</p>
            <p className="text-sm text-slate-500">
              {selectedCategory 
                ? 'Thử thay đổi bộ lọc để xem thêm lộ trình khác' 
                : 'Chưa có lộ trình nào được tạo'}
            </p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
      {roadmaps.map((roadmap) => (
        <LearningPathCard key={roadmap.id} roadmap={roadmap} />
      ))}
    </div>
  );
};
