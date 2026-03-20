import { create } from 'zustand';
import type { Course } from '@/types';

// ============================================================
// Course Store — Zustand
// Global state for course browsing, filters, and selections
// ============================================================

interface CourseFilters {
  search: string;
  category: string;
  level: string;
  sortBy: 'newest' | 'popular' | 'price-asc' | 'price-desc';
}

interface CourseStore {
  // ----- State -----
  selectedCourse: Course | null;
  filters: CourseFilters;

  // ----- Actions -----
  setSelectedCourse: (course: Course | null) => void;
  setFilters: (filters: Partial<CourseFilters>) => void;
  resetFilters: () => void;
}

const defaultFilters: CourseFilters = {
  search: '',
  category: '',
  level: '',
  sortBy: 'newest',
};

export const useCourseStore = create<CourseStore>()((set) => ({
  // ----- Initial State -----
  selectedCourse: null,
  filters: defaultFilters,

  // ----- Actions -----
  setSelectedCourse: (course) => set({ selectedCourse: course }),

  setFilters: (newFilters) =>
    set((state) => ({
      filters: { ...state.filters, ...newFilters },
    })),

  resetFilters: () => set({ filters: defaultFilters }),
}));
