import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { courseService } from '@/services/course.service';
import { categoryService } from '@/services/category.service';
import { tagService } from '@/services/tag.service';
import type { CourseListParams, ModuleDetail } from '@/types';

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
    queryFn: async () => {
      // 1. Fetch course overview + try expand approach in parallel
      const [detail, withModules] = await Promise.allSettled([
        courseService.getDetail(id!, 'modules'),
        courseService.getById(id!, 'modules'),
      ]);

      const base = detail.status === 'fulfilled' ? detail.value : null;
      const expanded = withModules.status === 'fulfilled' ? withModules.value : null;

      if (!base && !expanded) throw new Error('Course not found');
      const resolved = base ?? expanded!;

      // 2. Pick modules from whichever expand response returned them
      let modules: ModuleDetail[] | undefined =
        (base?.modules?.length ? base.modules : null) ??
        (expanded?.modules?.length ? expanded.modules : null) ??
        undefined;

      // 3. If expand didn't return modules, cascade-fetch /modules + /modules/:id/lessons
      if (!modules) {
        try {
          const moduleItems = await courseService.listModules(id!);
          if (moduleItems.length > 0) {
            modules = await Promise.all(
              moduleItems
                .sort((a, b) => a.orderIndex - b.orderIndex)
                .map(async (mod): Promise<ModuleDetail> => {
                  try {
                    const lessons = await courseService.listLessonsForModule(id!, mod.id);
                    return {
                      id: mod.id,
                      title: mod.title,
                      orderIndex: mod.orderIndex,
                      lessons: lessons.sort((a, b) => a.orderIndex - b.orderIndex),
                    };
                  } catch {
                    return {
                      id: mod.id,
                      title: mod.title,
                      orderIndex: mod.orderIndex,
                      lessons: [],
                    };
                  }
                }),
            );
          }
        } catch {
          /* modules endpoint unavailable — leave undefined */
        }
      }

      const stats = base?.stats ?? expanded?.stats ?? undefined;
      return { ...resolved, modules, stats };
    },
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
    staleTime: 5 * 60 * 1000,
  });
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: () => tagService.list(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useDeleteCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => courseService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourseStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      courseService.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useCreateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: Record<string, unknown>) => courseService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
    },
  });
}

export function useUpdateCourse() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: Record<string, unknown> }) =>
      courseService.update(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['courses'] });
      queryClient.invalidateQueries({ queryKey: ['course-detail', variables.id] });
    },
  });
}
