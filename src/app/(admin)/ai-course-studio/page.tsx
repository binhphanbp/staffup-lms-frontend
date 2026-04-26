'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Toast } from '@/components/shared/Toast';
import {
  useCategories,
  useGenerateCourseOutline,
  useGenerateLessonContent,
  useSaveCourseFromOutline,
} from '@/hooks/useCourses';
import type {
  AiCourseLessonType,
  AiCourseLevel,
  AiDraftCourseMeta,
  AiDraftLesson,
  AiDraftModule,
  AiLanguage,
  AiLengthHint,
} from '@/services/course.service';

// ============================================================
// Constants
// ============================================================

const LEVEL_OPTIONS: { value: AiCourseLevel; label: string; hint: string }[] = [
  { value: 'beginner', label: 'Sơ cấp', hint: 'Học viên chưa biết hoặc rất ít kiến thức.' },
  { value: 'intermediate', label: 'Trung cấp', hint: 'Đã biết cơ bản, cần đào sâu áp dụng.' },
  { value: 'advanced', label: 'Nâng cao', hint: 'Có kinh nghiệm, xử lý tình huống phức tạp.' },
  { value: 'mixed', label: 'Hỗn hợp', hint: 'Bắt đầu cơ bản, tiến dần lên nâng cao.' },
];

const LANGUAGE_OPTIONS: { value: AiLanguage; label: string }[] = [
  { value: 'vi', label: 'Tiếng Việt' },
  { value: 'en', label: 'English' },
];

const LESSON_TYPE_OPTIONS: { value: AiCourseLessonType; label: string; icon: string }[] = [
  { value: 'article', label: 'Bài viết', icon: 'article' },
  { value: 'video', label: 'Video', icon: 'play_circle' },
  { value: 'quiz', label: 'Quiz', icon: 'quiz' },
];

const LENGTH_OPTIONS: { value: AiLengthHint; label: string; hint: string }[] = [
  { value: 'short', label: 'Ngắn', hint: '~300-500 từ' },
  { value: 'medium', label: 'Vừa', hint: '~600-1000 từ' },
  { value: 'long', label: 'Dài', hint: '~1200-2000 từ' },
];

const STEPS = [
  { id: 1, title: 'Mô tả khoá học', desc: 'Cung cấp chủ đề và yêu cầu' },
  { id: 2, title: 'Duyệt khung', desc: 'Chỉnh sửa modules và lessons' },
  { id: 3, title: 'Hoàn tất', desc: 'Xác nhận và tạo khoá học' },
];

// ============================================================
// Types
// ============================================================

interface OutlineState {
  course: AiDraftCourseMeta;
  modules: AiDraftModule[];
}

interface LessonContentState {
  loading: boolean;
  expanded: boolean;
  content: string | null;
  error: string | null;
  lengthHint: AiLengthHint;
}

// ============================================================
// Helpers
// ============================================================

const newTempId = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const extractApiError = (err: unknown): string => {
  if (typeof err === 'object' && err && 'response' in err) {
    const resp = (err as { response?: { data?: { message?: string } } }).response;
    if (resp?.data?.message) return resp.data.message;
  }
  if (err instanceof Error) return err.message;
  return 'Có lỗi xảy ra. Vui lòng thử lại.';
};

const formatDuration = (m: number) => {
  if (!m) return '—';
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h ? `${h} giờ${r ? ` ${r} phút` : ''}` : `${r} phút`;
};

const totalLessonCount = (modules: AiDraftModule[]) =>
  modules.reduce((s, m) => s + m.lessons.length, 0);

const totalDurationMinutes = (modules: AiDraftModule[]) =>
  modules.reduce(
    (s, m) => s + m.lessons.reduce((ls, l) => ls + (l.estimatedDurationMinutes || 0), 0),
    0,
  );

// ============================================================
// Page
// ============================================================

export default function AiCourseStudioPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    window.setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  // ─── Step 1 — form state ────────────────────────────────────────────────
  const [topic, setTopic] = useState('');
  const [audience, setAudience] = useState('');
  const [level, setLevel] = useState<AiCourseLevel>('mixed');
  const [moduleCount, setModuleCount] = useState(4);
  const [lessonsPerModule, setLessonsPerModule] = useState(4);
  const [sourceContent, setSourceContent] = useState('');
  const [language, setLanguage] = useState<AiLanguage>('vi');
  const [generateError, setGenerateError] = useState<string | null>(null);

  // ─── Step 2 — outline state ─────────────────────────────────────────────
  const [outline, setOutline] = useState<OutlineState | null>(null);
  // Map of lesson tempId -> per-lesson content generation state
  const [lessonContents, setLessonContents] = useState<Record<string, LessonContentState>>({});
  // Map of category for Step 3
  const [categoryId, setCategoryId] = useState<string>('');

  const { data: categories } = useCategories();
  const generateOutline = useGenerateCourseOutline();
  const generateLessonContent = useGenerateLessonContent();
  const saveCourse = useSaveCourseFromOutline();

  // ─── Step 1 → 2: generate outline ───────────────────────────────────────
  const handleGenerate = async () => {
    setGenerateError(null);
    if (topic.trim().length < 3) {
      setGenerateError('Vui lòng mô tả chủ đề khoá học (tối thiểu 3 ký tự).');
      return;
    }
    try {
      const result = await generateOutline.mutateAsync({
        topic: topic.trim(),
        audience: audience.trim() || undefined,
        level,
        moduleCount,
        lessonsPerModule,
        sourceContent: sourceContent.trim() || undefined,
        language,
      });
      setOutline({ course: result.course, modules: result.modules });
      setLessonContents({});
      setStep(2);
    } catch (err) {
      setGenerateError(extractApiError(err));
    }
  };

  // ─── Outline mutations (Step 2) ─────────────────────────────────────────
  const updateCourseMeta = (patch: Partial<AiDraftCourseMeta>) => {
    setOutline((prev) => (prev ? { ...prev, course: { ...prev.course, ...patch } } : prev));
  };
  const updateModule = (mTempId: string, patch: Partial<AiDraftModule>) => {
    setOutline((prev) =>
      prev
        ? {
            ...prev,
            modules: prev.modules.map((m) => (m.tempId === mTempId ? { ...m, ...patch } : m)),
          }
        : prev,
    );
  };
  const updateLesson = (mTempId: string, lTempId: string, patch: Partial<AiDraftLesson>) => {
    setOutline((prev) =>
      prev
        ? {
            ...prev,
            modules: prev.modules.map((m) =>
              m.tempId === mTempId
                ? {
                    ...m,
                    lessons: m.lessons.map((l) => (l.tempId === lTempId ? { ...l, ...patch } : l)),
                  }
                : m,
            ),
          }
        : prev,
    );
  };
  const addLesson = (mTempId: string) => {
    setOutline((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        modules: prev.modules.map((m) =>
          m.tempId === mTempId
            ? {
                ...m,
                lessons: [
                  ...m.lessons,
                  {
                    tempId: newTempId('lesson'),
                    title: 'Bài học mới',
                    description: '',
                    lessonType: 'article',
                    estimatedDurationMinutes: 10,
                  },
                ],
              }
            : m,
        ),
      };
    });
  };
  const removeLesson = (mTempId: string, lTempId: string) => {
    setOutline((prev) =>
      prev
        ? {
            ...prev,
            modules: prev.modules.map((m) =>
              m.tempId === mTempId
                ? { ...m, lessons: m.lessons.filter((l) => l.tempId !== lTempId) }
                : m,
            ),
          }
        : prev,
    );
    setLessonContents((prev) => {
      const next = { ...prev };
      delete next[lTempId];
      return next;
    });
  };
  const addModule = () => {
    setOutline((prev) =>
      prev
        ? {
            ...prev,
            modules: [
              ...prev.modules,
              {
                tempId: newTempId('module'),
                title: 'Module mới',
                description: '',
                lessons: [
                  {
                    tempId: newTempId('lesson'),
                    title: 'Bài học 1',
                    description: '',
                    lessonType: 'article',
                    estimatedDurationMinutes: 10,
                  },
                ],
              },
            ],
          }
        : prev,
    );
  };
  const removeModule = (mTempId: string) => {
    setOutline((prev) =>
      prev ? { ...prev, modules: prev.modules.filter((m) => m.tempId !== mTempId) } : prev,
    );
  };
  const moveModule = (mTempId: string, dir: -1 | 1) => {
    setOutline((prev) => {
      if (!prev) return prev;
      const idx = prev.modules.findIndex((m) => m.tempId === mTempId);
      const target = idx + dir;
      if (idx < 0 || target < 0 || target >= prev.modules.length) return prev;
      const next = [...prev.modules];
      [next[idx], next[target]] = [next[target], next[idx]];
      return { ...prev, modules: next };
    });
  };
  const moveLesson = (mTempId: string, lTempId: string, dir: -1 | 1) => {
    setOutline((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        modules: prev.modules.map((m) => {
          if (m.tempId !== mTempId) return m;
          const idx = m.lessons.findIndex((l) => l.tempId === lTempId);
          const target = idx + dir;
          if (idx < 0 || target < 0 || target >= m.lessons.length) return m;
          const next = [...m.lessons];
          [next[idx], next[target]] = [next[target], next[idx]];
          return { ...m, lessons: next };
        }),
      };
    });
  };

  // ─── Per-lesson content generation ──────────────────────────────────────
  const setLessonContentState = (lTempId: string, patch: Partial<LessonContentState>) => {
    setLessonContents((prev) => {
      const existing: LessonContentState = prev[lTempId] ?? {
        loading: false,
        expanded: false,
        content: null,
        error: null,
        lengthHint: 'medium',
      };
      return { ...prev, [lTempId]: { ...existing, ...patch } };
    });
  };
  const handleGenerateLessonContent = async (mod: AiDraftModule, lesson: AiDraftLesson) => {
    if (!outline) return;
    setLessonContentState(lesson.tempId, { loading: true, expanded: true, error: null });
    try {
      const result = await generateLessonContent.mutateAsync({
        courseTitle: outline.course.title,
        courseDescription: outline.course.description || undefined,
        moduleTitle: mod.title,
        lessonTitle: lesson.title,
        lessonDescription: lesson.description || undefined,
        sourceContent: sourceContent.trim() || undefined,
        language,
        lengthHint: lessonContents[lesson.tempId]?.lengthHint ?? 'medium',
      });
      setLessonContentState(lesson.tempId, { loading: false, content: result.content });
    } catch (err) {
      setLessonContentState(lesson.tempId, {
        loading: false,
        error: extractApiError(err),
      });
    }
  };

  // ─── Save (Step 3) ──────────────────────────────────────────────────────
  const canSave = useMemo(() => {
    if (!outline) return false;
    if (!outline.course.title.trim()) return false;
    if (outline.modules.length === 0) return false;
    return outline.modules.every(
      (m) =>
        m.title.trim().length > 0 && m.lessons.length > 0 && m.lessons.every((l) => l.title.trim()),
    );
  }, [outline]);

  const handleSave = async () => {
    if (!outline || !canSave) return;
    try {
      const result = await saveCourse.mutateAsync({
        course: {
          title: outline.course.title.trim(),
          description: outline.course.description.trim() || undefined,
          estimatedDurationMinutes:
            outline.course.estimatedDurationMinutes || totalDurationMinutes(outline.modules),
          categoryId: categoryId || undefined,
        },
        modules: outline.modules.map((m) => ({
          title: m.title.trim(),
          description: m.description.trim() || undefined,
          lessons: m.lessons.map((l) => ({
            title: l.title.trim(),
            description: l.description.trim() || undefined,
            lessonType: l.lessonType,
            contentText: lessonContents[l.tempId]?.content ?? undefined,
            estimatedDurationMinutes: l.estimatedDurationMinutes,
          })),
        })),
      });
      showToast(
        `Đã tạo khoá học "${result.course.title}" — ${result.moduleCount} module, ${result.lessonCount} bài học.`,
      );
      window.setTimeout(() => router.push('/courses-management'), 800);
    } catch (err) {
      showToast(extractApiError(err));
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────
  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto bg-[#f0f2f5]">
        {/* Header */}
        <div className="border-b border-[#DADCE0] bg-white px-4 py-4 md:px-8">
          <div className="mb-4 flex items-center justify-between gap-4">
            <div>
              <div className="mb-1 flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-[#1A73E8]">
                  auto_awesome
                </span>
                <span className="text-[12px] font-medium tracking-wider text-[#1A73E8]">
                  AI COURSE STUDIO
                </span>
              </div>
              <h1 className="m-0 text-[22px] font-normal text-[#202124]">Tạo khoá học bằng AI</h1>
              <p className="mt-1 text-[13px] text-[#5F6368]">
                Mô tả chủ đề + tài liệu nguồn → AI sinh khung khoá học → bạn duyệt và xuất bản.
              </p>
            </div>
            <button
              onClick={() => router.push('/courses-management')}
              className="flex items-center gap-1.5 rounded border border-[#DADCE0] bg-white px-3 py-1.5 text-[13px] text-[#5F6368] hover:bg-[#F1F3F4]"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
              Đóng
            </button>
          </div>

          {/* Stepper */}
          <div className="flex items-center gap-2">
            {STEPS.map((s, idx) => {
              const isActive = s.id === step;
              const isDone = s.id < step;
              return (
                <React.Fragment key={s.id}>
                  <div
                    className={`flex flex-1 items-center gap-3 rounded-lg border px-3 py-2 ${
                      isActive
                        ? 'border-[#1A73E8] bg-[#E8F0FE]'
                        : isDone
                          ? 'border-[#34A853] bg-[#E6F4EA]'
                          : 'border-[#DADCE0] bg-white'
                    }`}
                  >
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-medium ${
                        isActive
                          ? 'bg-[#1A73E8] text-white'
                          : isDone
                            ? 'bg-[#34A853] text-white'
                            : 'bg-[#F1F3F4] text-[#5F6368]'
                      }`}
                    >
                      {isDone ? (
                        <span className="material-symbols-outlined text-[16px]">check</span>
                      ) : (
                        s.id
                      )}
                    </div>
                    <div className="min-w-0">
                      <div
                        className={`truncate text-[13px] font-medium ${
                          isActive ? 'text-[#1A73E8]' : isDone ? 'text-[#34A853]' : 'text-[#202124]'
                        }`}
                      >
                        {s.title}
                      </div>
                      <div className="truncate text-[11px] text-[#5F6368]">{s.desc}</div>
                    </div>
                  </div>
                  {idx < STEPS.length - 1 && (
                    <span className="material-symbols-outlined text-[20px] text-[#DADCE0]">
                      chevron_right
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 px-4 py-6 md:px-8">
          {step === 1 && (
            <Step1Form
              topic={topic}
              setTopic={setTopic}
              audience={audience}
              setAudience={setAudience}
              level={level}
              setLevel={setLevel}
              moduleCount={moduleCount}
              setModuleCount={setModuleCount}
              lessonsPerModule={lessonsPerModule}
              setLessonsPerModule={setLessonsPerModule}
              sourceContent={sourceContent}
              setSourceContent={setSourceContent}
              language={language}
              setLanguage={setLanguage}
              loading={generateOutline.isPending}
              error={generateError}
            />
          )}

          {step === 2 && outline && (
            <Step2Outline
              outline={outline}
              lessonContents={lessonContents}
              onUpdateCourseMeta={updateCourseMeta}
              onUpdateModule={updateModule}
              onUpdateLesson={updateLesson}
              onAddLesson={addLesson}
              onRemoveLesson={removeLesson}
              onAddModule={addModule}
              onRemoveModule={removeModule}
              onMoveModule={moveModule}
              onMoveLesson={moveLesson}
              onSetLessonContentState={setLessonContentState}
              onGenerateLessonContent={handleGenerateLessonContent}
              onRegenerateOutline={() => setStep(1)}
            />
          )}

          {step === 3 && outline && (
            <Step3Confirm
              outline={outline}
              lessonContents={lessonContents}
              categories={categories ?? []}
              categoryId={categoryId}
              setCategoryId={setCategoryId}
              saving={saveCourse.isPending}
              onSave={handleSave}
            />
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 border-t border-[#DADCE0] bg-white px-4 py-3 md:px-8">
          <div className="flex items-center justify-between gap-3">
            <button
              onClick={() => {
                if (step === 1) router.push('/courses-management');
                else setStep((s) => (s === 3 ? 2 : 1) as 1 | 2 | 3);
              }}
              className="flex items-center gap-1.5 rounded border border-[#DADCE0] bg-white px-4 py-2 text-[13px] text-[#5F6368] hover:bg-[#F1F3F4]"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              {step === 1 ? 'Huỷ' : 'Quay lại'}
            </button>
            <div className="text-[12px] text-[#5F6368]">
              {step === 2 && outline && (
                <>
                  {outline.modules.length} module · {totalLessonCount(outline.modules)} bài học ·{' '}
                  {formatDuration(totalDurationMinutes(outline.modules))}
                </>
              )}
            </div>
            <div className="flex items-center gap-2">
              {step === 1 && (
                <button
                  onClick={handleGenerate}
                  disabled={generateOutline.isPending || topic.trim().length < 3}
                  className="flex items-center gap-1.5 rounded bg-[#1A73E8] px-5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-[#174EA6] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                  {generateOutline.isPending ? 'Đang sinh...' : 'Sinh khung khoá học'}
                </button>
              )}
              {step === 2 && (
                <button
                  onClick={() => setStep(3)}
                  disabled={!canSave}
                  className="flex items-center gap-1.5 rounded bg-[#1A73E8] px-5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-[#174EA6] disabled:opacity-50"
                >
                  Tiếp tục
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              )}
              {step === 3 && (
                <button
                  onClick={handleSave}
                  disabled={saveCourse.isPending || !canSave}
                  className="flex items-center gap-1.5 rounded bg-[#34A853] px-5 py-2 text-[13px] font-medium text-white shadow-sm hover:bg-[#1E8E3E] disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[18px]">check</span>
                  {saveCourse.isPending ? 'Đang lưu...' : 'Tạo khoá học'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <Toast visible={toast.visible} message={toast.message} />
    </>
  );
}

// ============================================================
// Step 1 — Form
// ============================================================

interface Step1Props {
  topic: string;
  setTopic: (s: string) => void;
  audience: string;
  setAudience: (s: string) => void;
  level: AiCourseLevel;
  setLevel: (l: AiCourseLevel) => void;
  moduleCount: number;
  setModuleCount: (n: number) => void;
  lessonsPerModule: number;
  setLessonsPerModule: (n: number) => void;
  sourceContent: string;
  setSourceContent: (s: string) => void;
  language: AiLanguage;
  setLanguage: (l: AiLanguage) => void;
  loading: boolean;
  error: string | null;
}

function Step1Form(props: Step1Props) {
  const {
    topic,
    setTopic,
    audience,
    setAudience,
    level,
    setLevel,
    moduleCount,
    setModuleCount,
    lessonsPerModule,
    setLessonsPerModule,
    sourceContent,
    setSourceContent,
    language,
    setLanguage,
    loading,
    error,
  } = props;

  return (
    <div className="mx-auto max-w-[960px]">
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Left column — main form */}
        <div className="space-y-5 lg:col-span-2">
          <Section title="Chủ đề khoá học" required>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="VD: Onboarding nhân viên kế toán mới — quy trình 30 ngày"
              className="w-full rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none focus:border-[#1A73E8]"
            />
            <p className="mt-1 text-[11px] text-[#5F6368]">
              Mô tả ngắn về nội dung chính. AI dùng đây làm prompt chính để dựng khung.
            </p>
          </Section>

          <Section title="Đối tượng học viên">
            <textarea
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              placeholder="VD: Nhân viên kế toán mới gia nhập (0-3 tháng), chưa quen hệ thống nội bộ."
              rows={2}
              className="w-full resize-none rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none focus:border-[#1A73E8]"
            />
          </Section>

          <Section title="Tài liệu nguồn (tuỳ chọn)">
            <textarea
              value={sourceContent}
              onChange={(e) => setSourceContent(e.target.value)}
              placeholder="Dán SOP, handbook, slide training hiện có ở đây — AI sẽ bám sát nội dung này khi sinh khung và nội dung bài học."
              rows={8}
              className="w-full resize-none rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none focus:border-[#1A73E8]"
            />
            <div className="mt-1 flex items-center justify-between text-[11px] text-[#5F6368]">
              <span>Tối đa 30,000 ký tự</span>
              <span>{sourceContent.length.toLocaleString('vi-VN')} ký tự</span>
            </div>
          </Section>
        </div>

        {/* Right column — settings */}
        <div className="space-y-5 lg:col-span-1">
          <Section title="Trình độ">
            <div className="grid grid-cols-1 gap-1.5">
              {LEVEL_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLevel(opt.value)}
                  className={`flex items-start gap-2 rounded border px-3 py-2 text-left transition ${
                    level === opt.value
                      ? 'border-[#1A73E8] bg-[#E8F0FE]'
                      : 'border-[#DADCE0] bg-white hover:bg-[#F1F3F4]'
                  }`}
                >
                  <div
                    className={`mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                      level === opt.value ? 'border-[#1A73E8] bg-[#1A73E8]' : 'border-[#DADCE0]'
                    }`}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-[13px] font-medium text-[#202124]">{opt.label}</div>
                    <div className="text-[11px] text-[#5F6368]">{opt.hint}</div>
                  </div>
                </button>
              ))}
            </div>
          </Section>

          <Section title="Quy mô khoá học">
            <div className="grid grid-cols-2 gap-3">
              <NumberField
                label="Số module"
                value={moduleCount}
                onChange={setModuleCount}
                min={1}
                max={10}
              />
              <NumberField
                label="Bài / module"
                value={lessonsPerModule}
                onChange={setLessonsPerModule}
                min={1}
                max={8}
              />
            </div>
          </Section>

          <Section title="Ngôn ngữ">
            <div className="flex gap-2">
              {LANGUAGE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setLanguage(opt.value)}
                  className={`flex-1 rounded border px-3 py-2 text-[13px] font-medium ${
                    language === opt.value
                      ? 'border-[#1A73E8] bg-[#E8F0FE] text-[#1A73E8]'
                      : 'border-[#DADCE0] bg-white text-[#5F6368] hover:bg-[#F1F3F4]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </Section>
        </div>
      </div>

      {error && (
        <div className="mt-5 flex items-start gap-2 rounded border border-[#FAD2CF] bg-[#FCE8E6] px-3 py-2 text-[13px] text-[#C5221F]">
          <span className="material-symbols-outlined mt-0.5 text-[18px]">error</span>
          <span>{error}</span>
        </div>
      )}

      {loading && (
        <div className="mt-6 flex items-center justify-center gap-3 rounded-lg border border-[#DADCE0] bg-white px-4 py-8">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#DADCE0] border-t-[#1A73E8]" />
          <div>
            <div className="text-[13px] font-medium text-[#202124]">
              AI đang dựng khung khoá học...
            </div>
            <div className="text-[11px] text-[#5F6368]">Thường mất 10-30 giây tuỳ độ phức tạp.</div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// Step 2 — Outline review
// ============================================================

interface Step2Props {
  outline: OutlineState;
  lessonContents: Record<string, LessonContentState>;
  onUpdateCourseMeta: (patch: Partial<AiDraftCourseMeta>) => void;
  onUpdateModule: (mTempId: string, patch: Partial<AiDraftModule>) => void;
  onUpdateLesson: (mTempId: string, lTempId: string, patch: Partial<AiDraftLesson>) => void;
  onAddLesson: (mTempId: string) => void;
  onRemoveLesson: (mTempId: string, lTempId: string) => void;
  onAddModule: () => void;
  onRemoveModule: (mTempId: string) => void;
  onMoveModule: (mTempId: string, dir: -1 | 1) => void;
  onMoveLesson: (mTempId: string, lTempId: string, dir: -1 | 1) => void;
  onSetLessonContentState: (lTempId: string, patch: Partial<LessonContentState>) => void;
  onGenerateLessonContent: (mod: AiDraftModule, lesson: AiDraftLesson) => void;
  onRegenerateOutline: () => void;
}

function Step2Outline(props: Step2Props) {
  const { outline, onUpdateCourseMeta, onAddModule, onRegenerateOutline } = props;

  return (
    <div className="mx-auto max-w-[1100px]">
      {/* Course meta card */}
      <div className="mb-4 rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px] text-[#1A73E8]">school</span>
            <span className="text-[13px] font-medium text-[#202124]">Thông tin khoá học</span>
          </div>
          <button
            onClick={onRegenerateOutline}
            className="flex items-center gap-1 rounded border border-[#DADCE0] px-2 py-1 text-[12px] text-[#5F6368] hover:bg-[#F1F3F4]"
            title="Quay lại bước 1 để chỉnh prompt và sinh lại"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Sinh lại
          </button>
        </div>
        <input
          value={outline.course.title}
          onChange={(e) => onUpdateCourseMeta({ title: e.target.value })}
          className="mb-2 w-full rounded border border-[#DADCE0] bg-white px-3 py-2 text-[15px] font-medium text-[#202124] outline-none focus:border-[#1A73E8]"
          placeholder="Tên khoá học"
        />
        <textarea
          value={outline.course.description}
          onChange={(e) => onUpdateCourseMeta({ description: e.target.value })}
          rows={2}
          className="w-full resize-none rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#5F6368] outline-none focus:border-[#1A73E8]"
          placeholder="Mô tả khoá học"
        />
        {outline.course.learningObjectives.length > 0 && (
          <div className="mt-3 rounded border border-[#E8F0FE] bg-[#F8FBFF] p-3">
            <div className="mb-1 flex items-center gap-1.5 text-[12px] font-medium text-[#1A73E8]">
              <span className="material-symbols-outlined text-[16px]">target</span>
              Mục tiêu học tập do AI đề xuất
            </div>
            <ul className="ml-4 list-disc space-y-0.5 text-[12px] text-[#5F6368]">
              {outline.course.learningObjectives.map((obj, idx) => (
                <li key={idx}>{obj}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Module list */}
      <div className="space-y-3">
        {outline.modules.map((mod, idx) => (
          <ModuleCard
            key={mod.tempId}
            mod={mod}
            index={idx}
            totalModules={outline.modules.length}
            {...props}
          />
        ))}
      </div>

      <button
        onClick={onAddModule}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border-2 border-dashed border-[#DADCE0] bg-white px-4 py-3 text-[13px] text-[#5F6368] hover:border-[#1A73E8] hover:text-[#1A73E8]"
      >
        <span className="material-symbols-outlined text-[18px]">add</span>
        Thêm module
      </button>
    </div>
  );
}

interface ModuleCardProps extends Step2Props {
  mod: AiDraftModule;
  index: number;
  totalModules: number;
}

function ModuleCard(props: ModuleCardProps) {
  const {
    mod,
    index,
    totalModules,
    lessonContents,
    onUpdateModule,
    onUpdateLesson,
    onAddLesson,
    onRemoveLesson,
    onRemoveModule,
    onMoveModule,
    onMoveLesson,
    onSetLessonContentState,
    onGenerateLessonContent,
  } = props;

  return (
    <div className="rounded-lg border border-[#DADCE0] bg-white">
      <div className="flex items-start gap-3 border-b border-[#F1F3F4] p-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F0FE] text-[13px] font-medium text-[#1A73E8]">
          {index + 1}
        </div>
        <div className="flex-1">
          <input
            value={mod.title}
            onChange={(e) => onUpdateModule(mod.tempId, { title: e.target.value })}
            className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-[14px] font-medium text-[#202124] outline-none hover:border-[#DADCE0] focus:border-[#1A73E8] focus:bg-white"
            placeholder="Tên module"
          />
          <input
            value={mod.description}
            onChange={(e) => onUpdateModule(mod.tempId, { description: e.target.value })}
            className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-[12px] text-[#5F6368] outline-none hover:border-[#DADCE0] focus:border-[#1A73E8] focus:bg-white"
            placeholder="Mô tả module"
          />
        </div>
        <div className="flex shrink-0 items-center gap-1">
          <IconBtn
            icon="arrow_upward"
            onClick={() => onMoveModule(mod.tempId, -1)}
            disabled={index === 0}
            title="Di chuyển lên"
          />
          <IconBtn
            icon="arrow_downward"
            onClick={() => onMoveModule(mod.tempId, 1)}
            disabled={index === totalModules - 1}
            title="Di chuyển xuống"
          />
          <IconBtn
            icon="delete"
            onClick={() => onRemoveModule(mod.tempId)}
            title="Xoá module"
            danger
          />
        </div>
      </div>

      <div className="space-y-1.5 p-3">
        {mod.lessons.map((lesson, lIdx) => (
          <LessonRow
            key={lesson.tempId}
            mod={mod}
            lesson={lesson}
            index={lIdx}
            totalLessons={mod.lessons.length}
            contentState={lessonContents[lesson.tempId]}
            onUpdate={(patch) => onUpdateLesson(mod.tempId, lesson.tempId, patch)}
            onRemove={() => onRemoveLesson(mod.tempId, lesson.tempId)}
            onMove={(dir) => onMoveLesson(mod.tempId, lesson.tempId, dir)}
            onSetContentState={(patch) => onSetLessonContentState(lesson.tempId, patch)}
            onGenerateContent={() => onGenerateLessonContent(mod, lesson)}
          />
        ))}
        <button
          onClick={() => onAddLesson(mod.tempId)}
          className="flex w-full items-center justify-center gap-1.5 rounded border border-dashed border-[#DADCE0] py-1.5 text-[12px] text-[#5F6368] hover:border-[#1A73E8] hover:text-[#1A73E8]"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
          Thêm bài học
        </button>
      </div>
    </div>
  );
}

interface LessonRowProps {
  mod: AiDraftModule;
  lesson: AiDraftLesson;
  index: number;
  totalLessons: number;
  contentState: LessonContentState | undefined;
  onUpdate: (patch: Partial<AiDraftLesson>) => void;
  onRemove: () => void;
  onMove: (dir: -1 | 1) => void;
  onSetContentState: (patch: Partial<LessonContentState>) => void;
  onGenerateContent: () => void;
}

function LessonRow(props: LessonRowProps) {
  const {
    lesson,
    index,
    totalLessons,
    contentState,
    onUpdate,
    onRemove,
    onMove,
    onSetContentState,
    onGenerateContent,
  } = props;

  const expanded = contentState?.expanded ?? false;
  const hasContent = Boolean(contentState?.content);
  const isArticle = lesson.lessonType === 'article';

  return (
    <div className="rounded border border-[#F1F3F4] bg-[#FAFBFC]">
      <div className="flex items-center gap-2 px-3 py-1.5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-[11px] font-medium text-[#5F6368]">
          {index + 1}
        </div>
        <select
          value={lesson.lessonType}
          onChange={(e) => onUpdate({ lessonType: e.target.value as AiCourseLessonType })}
          className="rounded border border-[#DADCE0] bg-white px-1.5 py-0.5 text-[11px] text-[#5F6368] outline-none focus:border-[#1A73E8]"
        >
          {LESSON_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <input
          value={lesson.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="flex-1 rounded border border-transparent bg-transparent px-1 py-0.5 text-[13px] text-[#202124] outline-none hover:border-[#DADCE0] focus:border-[#1A73E8] focus:bg-white"
          placeholder="Tên bài học"
        />
        <input
          type="number"
          min={0}
          max={600}
          value={lesson.estimatedDurationMinutes}
          onChange={(e) =>
            onUpdate({ estimatedDurationMinutes: Math.max(0, Number(e.target.value) || 0) })
          }
          className="w-14 rounded border border-[#DADCE0] bg-white px-1.5 py-0.5 text-right text-[11px] text-[#5F6368] outline-none focus:border-[#1A73E8]"
          title="Thời lượng (phút)"
        />
        <span className="text-[11px] text-[#5F6368]">phút</span>

        {isArticle && (
          <button
            onClick={() => {
              if (hasContent) {
                onSetContentState({ expanded: !expanded });
              } else {
                onGenerateContent();
              }
            }}
            disabled={contentState?.loading}
            className={`flex shrink-0 items-center gap-1 rounded px-2 py-1 text-[11px] font-medium ${
              hasContent
                ? 'border border-[#34A853] bg-[#E6F4EA] text-[#1E8E3E] hover:bg-[#CEEAD6]'
                : 'border border-[#1A73E8] bg-white text-[#1A73E8] hover:bg-[#E8F0FE]'
            } disabled:opacity-50`}
            title={hasContent ? 'Xem / ẩn nội dung đã sinh' : 'Sinh nội dung bài học bằng AI'}
          >
            <span className="material-symbols-outlined text-[14px]">
              {contentState?.loading ? 'progress_activity' : hasContent ? 'check' : 'auto_awesome'}
            </span>
            {contentState?.loading
              ? 'Đang sinh...'
              : hasContent
                ? 'Đã có nội dung'
                : 'Sinh nội dung'}
          </button>
        )}

        <IconBtn
          icon="arrow_upward"
          onClick={() => onMove(-1)}
          disabled={index === 0}
          small
          title="Di chuyển lên"
        />
        <IconBtn
          icon="arrow_downward"
          onClick={() => onMove(1)}
          disabled={index === totalLessons - 1}
          small
          title="Di chuyển xuống"
        />
        <IconBtn icon="close" onClick={onRemove} small title="Xoá bài học" danger />
      </div>

      {lesson.description && !expanded && (
        <div className="border-t border-[#F1F3F4] bg-white px-3 py-1.5">
          <input
            value={lesson.description}
            onChange={(e) => onUpdate({ description: e.target.value })}
            className="w-full rounded border border-transparent bg-transparent px-1 py-0.5 text-[11px] text-[#5F6368] outline-none hover:border-[#DADCE0] focus:border-[#1A73E8] focus:bg-white"
            placeholder="Mô tả bài học"
          />
        </div>
      )}

      {isArticle && expanded && (
        <div className="border-t border-[#F1F3F4] bg-white p-3">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-medium text-[#5F6368]">Độ dài:</span>
              <select
                value={contentState?.lengthHint ?? 'medium'}
                onChange={(e) => onSetContentState({ lengthHint: e.target.value as AiLengthHint })}
                className="rounded border border-[#DADCE0] bg-white px-2 py-0.5 text-[11px] text-[#5F6368] outline-none focus:border-[#1A73E8]"
              >
                {LENGTH_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label} ({opt.hint})
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={onGenerateContent}
                disabled={contentState?.loading}
                className="flex items-center gap-1 rounded border border-[#1A73E8] bg-white px-2 py-0.5 text-[11px] font-medium text-[#1A73E8] hover:bg-[#E8F0FE] disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[14px]">refresh</span>
                Sinh lại
              </button>
              <button
                onClick={() => onSetContentState({ expanded: false })}
                className="rounded border border-[#DADCE0] bg-white px-2 py-0.5 text-[11px] text-[#5F6368] hover:bg-[#F1F3F4]"
              >
                Thu gọn
              </button>
            </div>
          </div>
          {contentState?.error && (
            <div className="mb-2 rounded border border-[#FAD2CF] bg-[#FCE8E6] px-2 py-1 text-[11px] text-[#C5221F]">
              {contentState.error}
            </div>
          )}
          <textarea
            value={contentState?.content ?? ''}
            onChange={(e) => onSetContentState({ content: e.target.value })}
            rows={Math.max(8, Math.min(20, (contentState?.content ?? '').split('\n').length))}
            className="w-full resize-y rounded border border-[#DADCE0] bg-white px-2 py-1.5 font-mono text-[12px] text-[#202124] outline-none focus:border-[#1A73E8]"
            placeholder={
              contentState?.loading
                ? 'AI đang soạn nội dung...'
                : 'Nội dung Markdown của bài học sẽ xuất hiện ở đây.'
            }
          />
        </div>
      )}
    </div>
  );
}

// ============================================================
// Step 3 — Confirm + save
// ============================================================

interface Step3Props {
  outline: OutlineState;
  lessonContents: Record<string, LessonContentState>;
  categories: { id: string; name: string }[];
  categoryId: string;
  setCategoryId: (s: string) => void;
  saving: boolean;
  onSave: () => void;
}

function Step3Confirm(props: Step3Props) {
  const { outline, lessonContents, categories, categoryId, setCategoryId } = props;

  const generatedLessonsCount = Object.values(lessonContents).filter(
    (c) => c.content && c.content.length > 0,
  ).length;
  const totalLessons = totalLessonCount(outline.modules);

  return (
    <div className="mx-auto max-w-[760px]">
      <div className="rounded-lg border border-[#DADCE0] bg-white p-5">
        <div className="mb-4 flex items-start gap-3 rounded border border-[#FFEEBC] bg-[#FFF8E1] p-3">
          <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#F9AB00]">info</span>
          <div className="text-[12px] text-[#5F6368]">
            Khoá học sẽ được tạo ở trạng thái <strong>Bản nháp</strong>. Bạn có thể tiếp tục chỉnh
            sửa, gắn ảnh bìa, đặt thumbnail, gắn nhãn — sau đó xuất bản qua trang Quản lý Khoá học.
          </div>
        </div>

        <h2 className="m-0 mb-1 text-[18px] font-medium text-[#202124]">
          {outline.course.title || 'Khoá học chưa có tên'}
        </h2>
        <p className="mb-4 text-[13px] text-[#5F6368]">
          {outline.course.description || 'Chưa có mô tả.'}
        </p>

        <div className="mb-4 grid grid-cols-3 gap-3">
          <Stat icon="view_module" label="Module" value={outline.modules.length.toString()} />
          <Stat icon="menu_book" label="Bài học" value={totalLessons.toString()} />
          <Stat
            icon="schedule"
            label="Thời lượng"
            value={formatDuration(totalDurationMinutes(outline.modules))}
          />
        </div>

        <div className="mb-4 rounded border border-[#E8F0FE] bg-[#F8FBFF] p-3 text-[12px] text-[#5F6368]">
          <span className="material-symbols-outlined mr-1 align-text-bottom text-[14px] text-[#1A73E8]">
            auto_awesome
          </span>
          {generatedLessonsCount > 0
            ? `${generatedLessonsCount}/${totalLessons} bài học đã có nội dung do AI sinh sẵn — sẽ được lưu cùng khoá học.`
            : 'Chưa có bài học nào được sinh nội dung. Bạn có thể quay lại Bước 2 để sinh thêm, hoặc soạn nội dung sau khi tạo khoá.'}
        </div>

        {/* Category */}
        <div>
          <label className="mb-1 block text-[12px] font-medium text-[#5F6368]">
            Danh mục (tuỳ chọn)
          </label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] text-[#202124] outline-none focus:border-[#1A73E8]"
          >
            <option value="">— Chưa chọn —</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-[11px] text-[#5F6368]">
            Chọn danh mục giúp khoá học dễ tìm. Có thể đổi sau.
          </p>
        </div>
      </div>

      {/* Module preview */}
      <div className="mt-4 rounded-lg border border-[#DADCE0] bg-white p-4">
        <div className="mb-2 text-[12px] font-medium text-[#5F6368]">Khung khoá học</div>
        <ol className="space-y-2">
          {outline.modules.map((m, idx) => (
            <li key={m.tempId} className="border-l-2 border-[#1A73E8] pl-3">
              <div className="text-[13px] font-medium text-[#202124]">
                Module {idx + 1}: {m.title}
              </div>
              <ul className="mt-0.5 ml-3 list-disc space-y-0.5 text-[12px] text-[#5F6368]">
                {m.lessons.map((l) => (
                  <li key={l.tempId}>
                    {l.title}
                    <span className="ml-1 text-[10px] tracking-wider text-[#9AA0A6] uppercase">
                      {l.lessonType}
                    </span>
                    {lessonContents[l.tempId]?.content && (
                      <span
                        className="ml-1 inline-flex items-center text-[#34A853]"
                        title="Đã có nội dung AI"
                      >
                        <span className="material-symbols-outlined align-text-bottom text-[12px]">
                          auto_awesome
                        </span>
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

// ============================================================
// Small UI helpers
// ============================================================

function Section(props: { title: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-[12px] font-medium text-[#5F6368]">
        {props.title}
        {props.required && <span className="ml-0.5 text-[#EA4335]">*</span>}
      </label>
      {props.children}
    </div>
  );
}

function NumberField(props: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  min: number;
  max: number;
}) {
  return (
    <div>
      <div className="mb-1 text-[11px] text-[#5F6368]">{props.label}</div>
      <div className="flex items-center rounded border border-[#DADCE0] bg-white">
        <button
          type="button"
          onClick={() => props.onChange(Math.max(props.min, props.value - 1))}
          disabled={props.value <= props.min}
          className="px-2 py-1 text-[#5F6368] hover:bg-[#F1F3F4] disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-[16px]">remove</span>
        </button>
        <input
          type="number"
          value={props.value}
          min={props.min}
          max={props.max}
          onChange={(e) => {
            const n = Number(e.target.value) || props.min;
            props.onChange(Math.max(props.min, Math.min(props.max, n)));
          }}
          className="w-full bg-transparent px-1 py-1 text-center text-[13px] text-[#202124] outline-none"
        />
        <button
          type="button"
          onClick={() => props.onChange(Math.min(props.max, props.value + 1))}
          disabled={props.value >= props.max}
          className="px-2 py-1 text-[#5F6368] hover:bg-[#F1F3F4] disabled:opacity-30"
        >
          <span className="material-symbols-outlined text-[16px]">add</span>
        </button>
      </div>
    </div>
  );
}

function IconBtn(props: {
  icon: string;
  onClick: () => void;
  disabled?: boolean;
  title?: string;
  danger?: boolean;
  small?: boolean;
}) {
  return (
    <button
      onClick={props.onClick}
      disabled={props.disabled}
      title={props.title}
      className={`flex items-center justify-center rounded ${props.small ? 'h-6 w-6' : 'h-7 w-7'} ${
        props.danger ? 'text-[#EA4335] hover:bg-[#FCE8E6]' : 'text-[#5F6368] hover:bg-[#F1F3F4]'
      } disabled:opacity-30`}
    >
      <span className={`material-symbols-outlined ${props.small ? 'text-[14px]' : 'text-[16px]'}`}>
        {props.icon}
      </span>
    </button>
  );
}

function Stat(props: { icon: string; label: string; value: string }) {
  return (
    <div className="rounded border border-[#DADCE0] bg-[#FAFBFC] p-3 text-center">
      <span className="material-symbols-outlined text-[20px] text-[#1A73E8]">{props.icon}</span>
      <div className="text-[18px] font-medium text-[#202124]">{props.value}</div>
      <div className="text-[11px] text-[#5F6368]">{props.label}</div>
    </div>
  );
}
