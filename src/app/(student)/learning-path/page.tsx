'use client';

import React, { useState } from 'react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { LearningPathList } from '@/components/learning-path/LearningPathList';
import { LearningPathFilters } from '@/components/learning-path/LearningPathFilters';
import { MyRoadmaps } from '@/components/learning-path/MyRoadmaps';

export default function LearningPathPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'my'>('all');

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Lộ trình phát triển' },
        ]}
      />

      <div className="custom-scrollbar relative flex-1 overflow-y-auto bg-white p-4 lg:p-8">
        {/* Header Section */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Lộ Trình Phát Triển Sự Nghiệp</h1>
          <p className="text-sm text-slate-600">
            Khám phá các lộ trình học tập được thiết kế chuyên nghiệp, giúp bạn phát triển kỹ năng từ cơ bản đến nâng cao
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6 border-b border-gray-200">
          <nav className="flex gap-8 text-[14px] font-semibold">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex items-center gap-2 border-b-2 py-3 transition-colors ${
                activeTab === 'all'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className="fa-solid fa-map"></i> Tất cả lộ trình
            </button>
            <button
              onClick={() => setActiveTab('my')}
              className={`flex items-center gap-2 border-b-2 py-3 transition-colors ${
                activeTab === 'my'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              <i className="fa-solid fa-user-graduate"></i> Lộ trình của tôi
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'all' ? (
          <>
            {/* Filters */}
            <LearningPathFilters
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />

            {/* Learning Paths */}
            <LearningPathList selectedCategory={selectedCategory} />
          </>
        ) : (
          <MyRoadmaps />
        )}
      </div>
    </>
  );
}
