import { useQuery } from '@tanstack/react-query';
import { courseService } from '@/services/course.service';
import { categoryService } from '@/services/category.service';
import { tagService } from '@/services/tag.service';
import type { CourseListParams } from '@/types';

// ============================================================
// React Query Hooks — Courses, Categories, Tags
// ============================================================

export function useCourses(params?: CourseListParams) {
  return useQuery({
    queryKey: ['courses', params],
    queryFn: () => courseService.list(params),
  });
}

export function useCourseDetail(id: string | null) {
  return useQuery({
    queryKey: ['course-detail', id],
    queryFn: () => courseService.getDetail(id!, 'all'),
    enabled: !!id,
  });
}

export function useCourseModules(courseId: string | null) {
  return useQuery({
    queryKey: ['course-modules', courseId],
    queryFn: () => courseService.listModules(courseId!),
    enabled: !!courseId,
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => categoryService.list(),
    staleTime: 5 * 60 * 1000, // categories rarely change
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.list(),
    staleTime: 5 * 60 * 1000,
  });
}
