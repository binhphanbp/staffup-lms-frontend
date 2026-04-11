'use client';

import React from 'react';
import { Filter } from 'lucide-react';

interface LearningPathFiltersProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const categories = [
  { id: '', label: 'Tất cả', icon: 'fa-th-large' },
  { id: 'frontend', label: 'Frontend', icon: 'fa-desktop' },
  { id: 'backend', label: 'Backend', icon: 'fa-server' },
  { id: 'fullstack', label: 'Full Stack', icon: 'fa-layer-group' },
  { id: 'devops', label: 'DevOps', icon: 'fa-cogs' },
  { id: 'mobile', label: 'Mobile', icon: 'fa-mobile-alt' },
  { id: 'data', label: 'Data Science', icon: 'fa-chart-line' },
];

export const LearningPathFilters = ({
  selectedCategory,
  onCategoryChange,
}: LearningPathFiltersProps) => {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-2 text-sm font-bold text-slate-700">
        <Filter className="h-4 w-4" />
        Lọc theo chuyên ngành
      </div>
      <div className="flex flex-wrap gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onCategoryChange(cat.id)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${
              selectedCategory === cat.id
                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/30'
                : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <i className={`fa-solid ${cat.icon}`}></i>
            {cat.label}
          </button>
        ))}
      </div>
    </div>
  );
};
