import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  roadmapService,
  type RoadmapListParams,
  type RoadmapAssignmentParams,
} from '@/services/roadmap.service';

// Temporary mock data until backend API is ready
const MOCK_ENABLED = true;

const mockRoadmaps = [
  {
    id: '1',
    title: 'Lộ Trình Frontend Developer',
    description: 'Lộ trình học tập toàn diện để trở thành Frontend Developer chuyên nghiệp. Từ HTML/CSS cơ bản đến các framework hiện đại như React, Vue.js, Angular.',
    targetPosition: 'Frontend Developer',
    isActive: true,
    createdAt: '2026-04-10T00:00:00.000Z',
    department: { id: '1', name: 'IT Department' },
    category: { id: '1', name: 'Programming', slug: 'programming' },
    stats: {
      totalCourses: 4,
      requiredCourses: 2,
      optionalCourses: 2,
      totalEstimatedMinutes: 2400,
      totalAssignments: 15,
    },
  },
  {
    id: '2',
    title: 'Lộ Trình Backend Developer',
    description: 'Lộ trình phát triển kỹ năng Backend Developer với PHP, Python, và các công nghệ server-side. Học cách xây dựng API, quản lý database và deploy ứng dụng.',
    targetPosition: 'Backend Developer',
    isActive: true,
    createdAt: '2026-04-10T00:00:00.000Z',
    department: { id: '1', name: 'IT Department' },
    category: { id: '1', name: 'Programming', slug: 'programming' },
    stats: {
      totalCourses: 4,
      requiredCourses: 3,
      optionalCourses: 1,
      totalEstimatedMinutes: 3000,
      totalAssignments: 20,
    },
  },
  {
    id: '3',
    title: 'Lộ Trình Full Stack Developer',
    description: 'Lộ trình toàn diện để trở thành Full Stack Developer. Kết hợp kiến thức Frontend và Backend, từ UI/UX đến database và cloud deployment.',
    targetPosition: 'Full Stack Developer',
    isActive: true,
    createdAt: '2026-04-10T00:00:00.000Z',
    department: { id: '1', name: 'IT Department' },
    category: { id: '1', name: 'Programming', slug: 'programming' },
    stats: {
      totalCourses: 5,
      requiredCourses: 4,
      optionalCourses: 1,
      totalEstimatedMinutes: 4200,
      totalAssignments: 25,
    },
  },
  {
    id: '4',
    title: 'Lộ Trình Cloud Engineer (AWS)',
    description: 'Lộ trình chuyên sâu về AWS Cloud Services. Chuẩn bị cho chứng chỉ AWS Solutions Architect và các vai trò Cloud Engineer, DevOps Engineer.',
    targetPosition: 'Cloud Engineer / DevOps Engineer',
    isActive: true,
    createdAt: '2026-04-10T00:00:00.000Z',
    department: { id: '1', name: 'IT Department' },
    category: { id: '2', name: 'Cloud/DevOps', slug: 'cloud-devops' },
    stats: {
      totalCourses: 3,
      requiredCourses: 2,
      optionalCourses: 1,
      totalEstimatedMinutes: 2800,
      totalAssignments: 12,
    },
  },
  {
    id: '5',
    title: 'Lộ Trình Python Developer',
    description: 'Lộ trình chuyên sâu về Python Programming. Từ cơ bản đến nâng cao, bao gồm web development, data analysis, và machine learning.',
    targetPosition: 'Python Developer',
    isActive: true,
    createdAt: '2026-04-10T00:00:00.000Z',
    department: { id: '1', name: 'IT Department' },
    category: { id: '1', name: 'Programming', slug: 'programming' },
    stats: {
      totalCourses: 2,
      requiredCourses: 2,
      optionalCourses: 0,
      totalEstimatedMinutes: 1800,
      totalAssignments: 18,
    },
  },
  {
    id: '6',
    title: 'Lộ Trình Web Developer (PHP)',
    description: 'Lộ trình phát triển web với PHP và MySQL. Học cách xây dựng website động, quản lý database và bảo mật ứng dụng web.',
    targetPosition: 'Web Developer',
    isActive: true,
    createdAt: '2026-04-10T00:00:00.000Z',
    department: { id: '1', name: 'IT Department' },
    category: { id: '1', name: 'Programming', slug: 'programming' },
    stats: {
      totalCourses: 2,
      requiredCourses: 2,
      optionalCourses: 0,
      totalEstimatedMinutes: 1600,
      totalAssignments: 14,
    },
  },
  {
    id: '7',
    title: 'Lộ Trình Modern Frontend (Next.js)',
    description: 'Lộ trình học Next.js và TypeScript để xây dựng ứng dụng web hiện đại. Tối ưu SEO, performance và deploy production.',
    targetPosition: 'Next.js Developer',
    isActive: true,
    createdAt: '2026-04-10T00:00:00.000Z',
    department: { id: '1', name: 'IT Department' },
    category: { id: '1', name: 'Programming', slug: 'programming' },
    stats: {
      totalCourses: 2,
      requiredCourses: 2,
      optionalCourses: 0,
      totalEstimatedMinutes: 1400,
      totalAssignments: 10,
    },
  },
  {
    id: '8',
    title: 'Lộ Trình Software Engineer (C++)',
    description: 'Lộ trình học lập trình hệ thống và phần mềm hiệu suất cao với C++. Phù hợp cho các vị trí Software Engineer, Game Developer, Embedded Systems.',
    targetPosition: 'Software Engineer',
    isActive: true,
    createdAt: '2026-04-10T00:00:00.000Z',
    department: { id: '1', name: 'IT Department' },
    category: { id: '1', name: 'Programming', slug: 'programming' },
    stats: {
      totalCourses: 1,
      requiredCourses: 1,
      optionalCourses: 0,
      totalEstimatedMinutes: 1200,
      totalAssignments: 8,
    },
  },
];

export function useRoadmaps(params?: RoadmapListParams) {
  return useQuery({
    queryKey: ['roadmaps', params],
    queryFn: async () => {
      if (MOCK_ENABLED) {
        // Mock response
        await new Promise(resolve => setTimeout(resolve, 500));
        let filtered = [...mockRoadmaps];
        
        if (params?.categoryId) {
          filtered = filtered.filter(r => r.category.id === params.categoryId);
        }
        
        return {
          data: filtered,
          meta: {
            total: filtered.length,
            page: params?.page || 1,
            limit: params?.limit || 20,
            totalPages: 1,
          },
        };
      }
      return roadmapService.list(params);
    },
  });
}

export function useRoadmapDetail(id: string | null) {
  return useQuery({
    queryKey: ['roadmap-detail', id],
    queryFn: async () => {
      if (MOCK_ENABLED && id) {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Find the roadmap from mock data
        const roadmap = mockRoadmaps.find(r => r.id === id);
        if (!roadmap) {
          throw new Error('Roadmap not found');
        }
        
        // Mock detailed roadmap with courses
        const mockCourses = [
          {
            id: '1',
            title: 'Git & GitHub - Version Control Mastery',
            slug: 'git-github',
            description: 'Làm chủ Git và GitHub từ cơ bản đến nâng cao. Học branching strategies, merge conflicts, pull requests.',
            thumbnailUrl: 'https://ui-avatars.com/api/?name=Git+GitHub&background=0f172a&color=fff&size=400',
            status: 'published',
            estimatedDurationMinutes: 300,
            orderIndex: 1,
            isRequired: true,
            trainer: {
              id: '2',
              fullName: 'Trainer 1',
              avatarUrl: null,
            },
            stats: {
              totalModules: 5,
              totalLessons: 25,
              totalEnrollments: 150,
            },
            userEnrollment: {
              enrollmentId: '1',
              status: 'in_progress',
              progressPercent: 45,
              completedLessonsCount: 11,
              enrolledAt: '2026-04-01T00:00:00.000Z',
              startedAt: '2026-04-02T00:00:00.000Z',
              completedAt: null,
            },
          },
          {
            id: '2',
            title: 'Next.js 14 với TypeScript',
            slug: 'nextjs-typescript',
            description: 'Xây dựng ứng dụng web hiện đại với Next.js 14, App Router, Server Components, TypeScript.',
            thumbnailUrl: 'https://ui-avatars.com/api/?name=Next.js&background=0f172a&color=fff&size=400',
            status: 'published',
            estimatedDurationMinutes: 600,
            orderIndex: 2,
            isRequired: true,
            trainer: {
              id: '2',
              fullName: 'Trainer 1',
              avatarUrl: null,
            },
            stats: {
              totalModules: 6,
              totalLessons: 36,
              totalEnrollments: 120,
            },
            userEnrollment: undefined,
          },
          {
            id: '3',
            title: 'Vue.js 3 - Progressive JavaScript Framework',
            slug: 'vuejs-framework',
            description: 'Học Vue.js 3 với Composition API, Pinia state management, Vue Router.',
            thumbnailUrl: 'https://ui-avatars.com/api/?name=Vue.js&background=0f172a&color=fff&size=400',
            status: 'published',
            estimatedDurationMinutes: 480,
            orderIndex: 3,
            isRequired: false,
            trainer: {
              id: '2',
              fullName: 'Trainer 1',
              avatarUrl: null,
            },
            stats: {
              totalModules: 6,
              totalLessons: 30,
              totalEnrollments: 100,
            },
            userEnrollment: undefined,
          },
          {
            id: '4',
            title: 'Angular Framework - Từ Cơ Bản Đến Nâng Cao',
            slug: 'angular-framework',
            description: 'Khóa học Angular toàn diện, từ component, routing, services đến state management.',
            thumbnailUrl: 'https://ui-avatars.com/api/?name=Angular&background=0f172a&color=fff&size=400',
            status: 'published',
            estimatedDurationMinutes: 720,
            orderIndex: 4,
            isRequired: false,
            trainer: {
              id: '2',
              fullName: 'Trainer 1',
              avatarUrl: null,
            },
            stats: {
              totalModules: 8,
              totalLessons: 40,
              totalEnrollments: 90,
            },
            userEnrollment: {
              enrollmentId: '2',
              status: 'completed',
              progressPercent: 100,
              completedLessonsCount: 40,
              enrolledAt: '2026-03-01T00:00:00.000Z',
              startedAt: '2026-03-02T00:00:00.000Z',
              completedAt: '2026-04-01T00:00:00.000Z',
            },
          },
        ];
        
        return {
          ...roadmap,
          createdBy: {
            id: '1',
            fullName: 'Admin User',
            email: 'admin@staffup.local',
          },
          courses: mockCourses,
          userAssignment: id === '1' ? {
            assignmentId: '1',
            status: 'in_progress' as const,
            assignedAt: '2026-04-01T00:00:00.000Z',
            startedAt: '2026-04-02T00:00:00.000Z',
            completedAt: null,
            droppedAt: null,
            assignedBy: {
              id: '1',
              fullName: 'Admin User',
            },
          } : undefined,
        };
      }
      return roadmapService.getDetail(id!);
    },
    enabled: !!id,
  });
}

export function useRoadmapAssignments(params?: RoadmapAssignmentParams) {
  return useQuery({
    queryKey: ['roadmap-assignments', params],
    queryFn: async () => {
      if (MOCK_ENABLED) {
        // Mock some assignments
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockAssignments = [
          {
            id: '1',
            userId: '3',
            roadmapId: '1',
            status: 'in_progress' as const,
            assignedAt: '2026-04-01T00:00:00.000Z',
            startedAt: '2026-04-02T00:00:00.000Z',
            completedAt: null,
            droppedAt: null,
            user: {
              id: '3',
              fullName: 'Nguyễn Văn A',
              email: 'employee1@staffup.local',
              avatarUrl: null,
              department: { id: '1', name: 'IT Department' },
            },
            roadmap: mockRoadmaps[0],
            assignedBy: {
              id: '1',
              fullName: 'Admin User',
              email: 'admin@staffup.local',
            },
          },
          {
            id: '2',
            userId: '3',
            roadmapId: '5',
            status: 'assigned' as const,
            assignedAt: '2026-04-05T00:00:00.000Z',
            startedAt: null,
            completedAt: null,
            droppedAt: null,
            user: {
              id: '3',
              fullName: 'Nguyễn Văn A',
              email: 'employee1@staffup.local',
              avatarUrl: null,
              department: { id: '1', name: 'IT Department' },
            },
            roadmap: mockRoadmaps[4],
            assignedBy: {
              id: '1',
              fullName: 'Admin User',
              email: 'admin@staffup.local',
            },
          },
          {
            id: '3',
            userId: '3',
            roadmapId: '3',
            status: 'completed' as const,
            assignedAt: '2026-03-01T00:00:00.000Z',
            startedAt: '2026-03-02T00:00:00.000Z',
            completedAt: '2026-04-01T00:00:00.000Z',
            droppedAt: null,
            user: {
              id: '3',
              fullName: 'Nguyễn Văn A',
              email: 'employee1@staffup.local',
              avatarUrl: null,
              department: { id: '1', name: 'IT Department' },
            },
            roadmap: mockRoadmaps[2],
            assignedBy: {
              id: '1',
              fullName: 'Admin User',
              email: 'admin@staffup.local',
            },
          },
        ];
        
        return {
          data: mockAssignments,
          meta: {
            total: mockAssignments.length,
            page: 1,
            limit: 20,
            totalPages: 1,
          },
        };
      }
      return roadmapService.listAssignments(params);
    },
  });
}

export function useUpdateAssignmentStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      assignmentId,
      status,
    }: {
      assignmentId: string;
      status: 'assigned' | 'in_progress' | 'completed' | 'dropped';
    }) => roadmapService.updateAssignmentStatus(assignmentId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap-assignments'] });
      queryClient.invalidateQueries({ queryKey: ['roadmap-detail'] });
    },
  });
}
