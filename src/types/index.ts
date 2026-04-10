// ============================================================
// TypeScript Interfaces & Types — Staffup LMS
// ============================================================

// ----- Auth & User -----
// Backend role codes: 'admin' | 'manager' | 'trainer' | 'employee'
export type RoleCode = 'admin' | 'manager' | 'trainer' | 'employee';

// User shape returned by POST /auth/login, /auth/register, /auth/refresh
export interface User {
  id: string;
  email: string;
  fullName: string;
  roleCodes: RoleCode[];
  createdAt: string;
}

// Extended user profile from GET /auth/me
export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  positionTitle: string | null;
  avatarUrl: string | null;
  department: {
    id: string;
    name: string;
  } | null;
  userRoles: Array<{ code: string; name: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterPayload {
  departmentId: string;
  fullName: string;
  email: string;
  password: string;
  positionTitle?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshTokenExpiresAt: string;
}

// ----- API -----
export interface ApiResponse<T = unknown> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  success: false;
  message: string;
  statusCode: number;
  errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// ----- Course -----
export type CourseStatus = 'draft' | 'published' | 'archived';
export type LessonType = 'video' | 'article' | 'quiz';

export interface CourseListItem {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  status: CourseStatus;
  estimatedDurationMinutes: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  trainer: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl?: string | null;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  } | null;
  ownerDepartment: {
    id: string;
    name: string;
  } | null;
  tags?: Array<{ id: string; name: string; slug: string }>;
  counts?: {
    modules: number;
    enrollments: number;
  };
}

export interface LessonResource {
  id: string;
  fileName: string;
  fileUrl: string;
  resourceType: string | null;
  orderIndex: number;
}

export interface LessonDetail {
  id: string;
  title: string;
  lessonType: LessonType;
  durationSeconds: number;
  orderIndex: number;
  isPreview: boolean;
  videoUrl: string | null;
  contentText: string | null;
  resources: LessonResource[];
  quiz?: {
    id: string;
    title: string;
    description: string | null;
    totalQuestions: number;
    passScorePercent: number;
    timeLimitMinutes: number | null;
    maxAttempts: number | null;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
  };
}

export interface ModuleDetail {
  id: string;
  title: string;
  orderIndex: number;
  lessons: LessonDetail[];
}

export interface CourseModuleItem {
  id: string;
  courseId: string;
  title: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
  lessonsCount: number;
}

export interface CourseDetailResponse {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnailUrl: string | null;
  status: CourseStatus;
  estimatedDurationMinutes: number | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  trainer: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  category: { id: string; name: string; slug: string } | null;
  ownerDepartment: { id: string; name: string } | null;
  tags?: Array<{ id: string; name: string; slug: string }>;
  modules?: ModuleDetail[];
  stats?: {
    totalModules: number;
    totalLessons: number;
    totalDurationMinutes: number;
    totalEnrollments: number;
  };
}

export interface CourseListParams {
  search?: string;
  categoryId?: string;
  status?: CourseStatus;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  expand?: string;
}

// Legacy Course interface (kept for backward compat)
export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  instructorId: string;
  instructor?: User;
  price: number;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  isPublished: boolean;
  enrollmentCount: number;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  content?: string;
  videoUrl?: string;
  duration: number; // in seconds
  order: number;
  isPublished: boolean;
}

// ----- Category & Tag -----
export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
  isActive: boolean;
  children?: Category[];
  createdAt: string;
  updatedAt: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

// ----- Enrollment -----
export type EnrollmentStatus = 'assigned' | 'in_progress' | 'completed' | 'cancelled' | 'expired';
export type LessonProgressStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped';

export interface EnrollmentListItem {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  progressPercent: number;
  enrolledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  dueAt: string | null;
  isOverdue: boolean;
  assignmentNote: string | null;
  user: {
    id: string;
    fullName: string;
    email: string;
    avatarUrl: string | null;
  };
  course: {
    id: string;
    title: string;
    slug: string;
    thumbnailUrl: string | null;
    trainer: {
      id: string;
      fullName: string;
    };
  };
  assignedBy: { id: string; fullName: string } | null;
}

export interface EnrollmentDetailResponse {
  id: string;
  userId: string;
  courseId: string;
  status: EnrollmentStatus;
  enrolledAt: string;
  startedAt: string | null;
  completedAt: string | null;
  lastActivityAt: string | null;
  dueAt: string | null;
  course: {
    id: string;
    title: string;
    slug: string;
    description: string;
    thumbnailUrl: string | null;
    estimatedDurationMinutes: number;
    trainer: {
      id: string;
      fullName: string;
      email: string;
      avatarUrl: string | null;
    };
  };
  progressSummary: {
    progressPercent: number;
    completedLessonsCount: number;
    totalLessonsCount: number;
    timeSpentSeconds: number;
    timeSpentFormatted: string;
    lastAccessedLesson: {
      id: string;
      title: string;
      moduleTitle: string;
      lastAccessedAt: string;
    } | null;
    quizProgress: {
      totalQuizzes: number;
      completedQuizzes: number;
      passedQuizzes: number;
      averageScore: number | null;
    };
  };
  certificate: {
    isEligible: boolean;
    isIssued: boolean;
    certificateId: string | null;
    certificateCode: string | null;
    issuedAt: string | null;
    pdfUrl: string | null;
    isRevoked: boolean;
    revokedAt: string | null;
  };
  assignment: {
    assignedBy: { id: string; fullName: string; email: string } | null;
    assignmentNote: string | null;
    dueAt: string | null;
    isOverdue: boolean;
  };
}

export interface EnrollmentProgressResponse {
  enrollmentId: string;
  courseId: string;
  enrollmentStatus: string;
  summary: {
    progressPercent: number;
    completedLessonsCount: number;
    totalLessonsCount: number;
    timeSpentSeconds: number;
    lastActivityAt: string | null;
  };
  modules: Array<{
    id: string;
    title: string;
    orderIndex: number;
    lessons: Array<{
      id: string;
      title: string;
      lessonType: string;
      durationSeconds: number;
      orderIndex: number;
      isPreview: boolean;
      progress: {
        status: LessonProgressStatus;
        watchTimeSeconds: number;
        lastPositionSeconds: number;
        startedAt: string | null;
        completedAt: string | null;
        lastAccessedAt: string | null;
      };
    }>;
  }>;
}

export interface LessonProgressUpdate {
  watchTimeSeconds?: number;
  lastPositionSeconds?: number;
  status?: LessonProgressStatus;
}

// ----- Quiz -----
export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'true_false'
  | 'short_answer'
  | 'essay';
export type QuizAttemptStatus = 'in_progress' | 'submitted' | 'graded' | 'expired' | 'abandoned';

export interface QuizAttemptDetailResponse {
  id: string;
  enrollmentId: string;
  quizId: string;
  attemptNo: number;
  status: QuizAttemptStatus;
  objectiveScore: number | null;
  manualScore: number | null;
  totalScore: number | null;
  isPassed: boolean | null;
  startedAt: string;
  submittedAt: string | null;
  gradedAt: string | null;
  timeSpentSeconds: number;
  timeLimitSeconds: number | null;
  timeRemainingSeconds: number | null;
  isTimedOut: boolean;
  quiz: {
    id: string;
    title: string;
    description: string | null;
    passScorePercent: number;
    timeLimitMinutes: number | null;
    maxAttempts: number | null;
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
  };
  questions: QuizAttemptQuestionDetail[];
  gradedBy: { id: string; fullName: string; email: string } | null;
}

export interface QuizAttemptQuestionDetail {
  id: string;
  displayOrder: number;
  maxPoints: number;
  questionSnapshot: {
    questionText: string;
    questionType: QuestionType;
    explanation: string | null;
  };
  optionsSnapshot: Array<{
    optionId: string;
    optionText: string;
    orderIndex: number;
  }> | null;
  response: {
    id: string;
    responseText: string | null;
    selectedOptionIds: string[];
    isCorrect: boolean | null;
    awardedPoints: number | null;
    gradedAt: string | null;
  } | null;
}

export interface QuizStartPayload {
  quizId: string;
  enrollmentId: string;
}

export interface QuizResponsePayload {
  attemptQuestionId: string;
  selectedOptionIds?: string[];
  responseText?: string;
}

export interface QuizStartResponse {
  attemptId: string;
  attemptNo: number;
  quizId: string;
  quizTitle: string;
  timeLimitMinutes: number | null;
  totalQuestions: number;
  startedAt: string;
}

export interface QuizAttemptHistoryItem {
  id: string;
  quizId: string;
  attemptNo: number;
  status: QuizAttemptStatus;
  objectiveScore: number | null;
  manualScore: number | null;
  totalScore: number | null;
  isPassed: boolean | null;
  startedAt: string;
  submittedAt: string | null;
  timeSpentSeconds: number;
  quiz: {
    id: string;
    title: string;
    passScorePercent: number;
    timeLimitMinutes: number | null;
    maxAttempts: number | null;
  };
  enrollment: {
    id: string;
    user: {
      id: string;
      fullName: string;
      email: string;
    };
    course: {
      id: string;
      title: string;
    };
  };
}

export interface QuizSubmitResponse {
  attemptId: string;
  status: string;
  submittedAt: string;
  timeSpentSeconds: number;
  autoGraded: boolean;
  requiresManualGrading: boolean;
  result?: {
    objectiveScore: number;
    totalPossibleScore: number;
    scorePercent: number;
    isPassed: boolean;
    passScorePercent: number;
  };
}

// ----- Certificate -----
export interface CertificateResponse {
  id: string;
  certificateCode: string;
  pdfUrl: string | null;
  issuedAt: string;
  revokedAt?: string | null;
  enrollment: {
    id: string;
    completedAt?: string | null;
    course: {
      id: string;
      title: string;
      slug: string;
      description?: string | null;
      thumbnailUrl?: string | null;
      trainer?: {
        id: string;
        fullName: string;
      };
    };
    user: {
      id: string;
      fullName: string;
      email: string;
      avatarUrl?: string | null;
    };
  };
}

export interface CertificateListResponse {
  certificates: CertificateResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// ----- Dashboard -----
export interface EmployeeDashboardStats {
  myCourses: {
    total: number;
    assigned: number;
    inProgress: number;
    completed: number;
    courses: Array<{
      enrollmentId: string;
      courseId: string;
      courseTitle: string;
      courseThumbnail: string | null;
      status: string;
      progress: number;
      dueAt: string | null;
      enrolledAt: string;
      completedAt: string | null;
    }>;
  };
  myRoadmaps: {
    total: number;
    assigned: number;
    inProgress: number;
    completed: number;
    roadmaps: Array<{
      assignmentId: string;
      roadmapId: string;
      roadmapTitle: string;
      targetPosition: string | null;
      status: string;
      totalCourses: number;
      completedCourses: number;
      progressPercent: number;
      assignedAt: string;
      completedAt: string | null;
    }>;
  };
  progressSummary: {
    totalTimeSpentMinutes: number;
    completedLessons: number;
    averageProgress: number;
    recentActivity: string | null;
    upcomingDeadlines: Array<{
      courseId: string;
      courseTitle: string;
      dueAt: string;
      daysRemaining: number;
      currentProgress: number;
    }>;
  };
  certificates: {
    total: number;
    certificates: Array<{
      certificateId: string;
      certificateCode: string;
      courseId: string;
      courseTitle: string;
      issuedAt: string;
      pdfUrl: string | null;
    }>;
  };
}

// ----- AI Insights -----
export type InsightType = 'warning' | 'success' | 'info' | 'action';

export interface AIInsight {
  type: InsightType;
  title: string;
  description: string;
  suggestion: string;
}

export interface AIInsightsResponse {
  insights: AIInsight[];
  generatedAt: string;
  cached: boolean;
  scope: 'admin' | 'manager' | 'trainer';
}

// ----- Navigation -----
export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
  children?: NavItem[];
}
