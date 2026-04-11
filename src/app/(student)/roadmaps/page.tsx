'use client';

import React, { useState } from 'react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { mockRoadmaps } from '@/data/mockRoadmaps';
import Link from 'next/link';
import { Clock, Target, BookOpen, TrendingUp } from 'lucide-react';

export default function RoadmapsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  // Filter roadmaps
  const filteredRoadmaps = mockRoadmaps.filter((roadmap) => {
    const categoryMatch = selectedCategory === 'all' || roadmap.categoryId === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || roadmap.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch && roadmap.isActive;
  });

  // Get unique categories
  const categories = Array.from(new Set(mockRoadmaps.map(r => ({ id: r.categoryId, name: r.categoryName }))));

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-700';
      case 'intermediate':
        return 'bg-blue-100 text-blue-700';
      case 'advanced':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'Cơ bản';
      case 'intermediate':
        return 'Trung cấp';
      case 'advanced':
        return 'Nâng cao';
      default:
        return difficulty;
    }
  };

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lộ trình phát triển' },
        ]}
      />

      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4 py-8 md:px-8">
        <div className="mx-auto max-w-7xl pb-20">
          {/* Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-slate-800">
              Lộ trình phát triển nghề nghiệp
            </h1>
            <p className="text-sm text-slate-600">
              Khám phá các lộ trình học tập được thiết kế chuyên nghiệp để phát triển sự nghiệp của bạn
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 flex flex-wrap gap-4">
            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Danh mục:</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-2">
              <label className="text-xs font-semibold text-slate-600">Độ khó:</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                <option value="all">Tất cả</option>
                <option value="beginner">Cơ bản</option>
                <option value="intermediate">Trung cấp</option>
                <option value="advanced">Nâng cao</option>
              </select>
            </div>

            {/* Results count */}
            <div className="ml-auto flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold">{filteredRoadmaps.length}</span> lộ trình
            </div>
          </div>

          {/* Roadmaps Grid */}
          {filteredRoadmaps.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
                <i className="fa-solid fa-route text-3xl text-slate-400"></i>
              </div>
              <h3 className="mb-2 text-base font-semibold text-slate-800">
                Không tìm thấy lộ trình
              </h3>
              <p className="text-sm text-slate-500">
                Thử thay đổi bộ lọc để xem thêm lộ trình khác
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredRoadmaps.map((roadmap) => (
                <Link
                  key={roadmap.id}
                  href={`/roadmaps/${roadmap.slug}`}
                  className="group card overflow-hidden transition-all hover:shadow-lg"
                >
                  {/* Header */}
                  <div className="border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50 p-4">
                    <div className="mb-2 flex items-start justify-between">
                      <span className="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-700 shadow-sm">
                        {roadmap.categoryName}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-[10px] font-bold ${getDifficultyColor(roadmap.difficulty)}`}
                      >
                        {getDifficultyLabel(roadmap.difficulty)}
                      </span>
                    </div>
                    <h3 className="text-base font-bold text-slate-800 group-hover:text-blue-600">
                      {roadmap.title}
                    </h3>
                  </div>

                  {/* Body */}
                  <div className="p-4">
                    <p className="mb-4 line-clamp-2 text-xs text-slate-600">
                      {roadmap.description}
                    </p>

                    {/* Stats */}
                    <div className="mb-4 grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock className="h-4 w-4 text-blue-500" />
                        <span className="font-semibold">{roadmap.estimatedMonths} tháng</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <BookOpen className="h-4 w-4 text-purple-500" />
                        <span className="font-semibold">{roadmap.courses.length} khóa học</span>
                      </div>
                    </div>

                    {/* Target Position */}
                    <div className="mb-4 flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 p-3">
                      <Target className="h-4 w-4 text-blue-600" />
                      <span className="text-xs font-bold text-slate-700">
                        {roadmap.targetPosition}
                      </span>
                    </div>

                    {/* Skills Preview */}
                    <div className="mb-4">
                      <p className="mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                        Kỹ năng đạt được:
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {roadmap.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600"
                          >
                            {skill}
                          </span>
                        ))}
                        {roadmap.skills.length > 4 && (
                          <span className="rounded bg-slate-100 px-2 py-1 text-[10px] font-medium text-slate-600">
                            +{roadmap.skills.length - 4}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* CTA */}
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2.5 text-xs font-semibold text-white transition-all hover:from-blue-700 hover:to-purple-700">
                      <TrendingUp className="h-4 w-4" />
                      Xem chi tiết lộ trình
                    </button>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
