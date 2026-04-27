'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Code2, FileCode2, Search, Sparkles } from 'lucide-react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/ui/empty-state';
import { useCodeLabProblems, useMyCodeSubmissions } from '@/hooks/useCodeLab';
import type {
  CodeLabDifficulty,
  CodeLabLanguage,
  CodeLabProblemSummary,
  CodeSubmissionSummary,
} from '@/services/code-lab.service';

const breadcrumbs = [{ label: 'Trang chủ', href: '/' }, { label: 'AI Code Lab' }];

const DIFFICULTY_LABELS: Record<CodeLabDifficulty, string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

const DIFFICULTY_STYLES: Record<CodeLabDifficulty, string> = {
  easy: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300',
  medium: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  hard: 'bg-rose-100 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300',
};

const LANGUAGE_LABELS: Partial<Record<CodeLabLanguage, string>> = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  go: 'Go',
  csharp: 'C#',
  ruby: 'Ruby',
  sql: 'SQL',
};

const DIFFICULTY_FILTERS: Array<{ value: 'all' | CodeLabDifficulty; label: string }> = [
  { value: 'all', label: 'Tất cả' },
  { value: 'easy', label: 'Dễ' },
  { value: 'medium', label: 'Trung bình' },
  { value: 'hard', label: 'Khó' },
];

function ProblemCard({
  problem,
  bestSubmission,
}: {
  problem: CodeLabProblemSummary;
  bestSubmission?: CodeSubmissionSummary;
}) {
  return (
    <Link
      href={`/lab/${problem.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="flex items-start justify-between gap-3 border-b border-slate-100 px-5 py-4 dark:border-slate-800">
        <div className="flex min-w-0 items-center gap-3">
          <div className="bg-primary/10 text-primary dark:bg-primary/20 flex size-11 shrink-0 items-center justify-center rounded-full">
            <FileCode2 className="size-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800 dark:text-slate-100">
              {problem.title}
            </p>
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">
              {problem.category}
            </p>
          </div>
        </div>
        <span
          className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${DIFFICULTY_STYLES[problem.difficulty]}`}
        >
          {DIFFICULTY_LABELS[problem.difficulty]}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 px-5 pt-4 pb-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Code2 className="size-3.5" />
            {LANGUAGE_LABELS[problem.language] ?? problem.language}
          </span>
          {problem.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-md bg-slate-50 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>

        {bestSubmission ? (
          <div className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 dark:border-slate-700 dark:bg-slate-800/40">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500 dark:text-slate-400">Lần làm tốt nhất của bạn</span>
              <span
                className={`font-semibold ${
                  bestSubmission.score >= 85
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : bestSubmission.score >= 50
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {bestSubmission.score}/100
              </span>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-200 px-3 py-2 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Chưa có lượt nộp — hãy thử ngay!
          </div>
        )}

        <div className="text-primary mt-auto flex items-center gap-1.5 pt-2 text-sm font-semibold">
          Bắt đầu làm
          <ArrowRight className="size-4 transition group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}

export default function LabIndexPage() {
  const [search, setSearch] = useState('');
  const [difficulty, setDifficulty] = useState<'all' | CodeLabDifficulty>('all');
  const [language, setLanguage] = useState<'all' | CodeLabLanguage>('all');

  const { data: problems, isLoading, isError } = useCodeLabProblems();
  const { data: submissions } = useMyCodeSubmissions({ limit: 50 });

  const bestByProblem = useMemo(() => {
    const map = new Map<string, CodeSubmissionSummary>();
    for (const s of submissions ?? []) {
      const prev = map.get(s.problemSlug);
      if (!prev || s.score > prev.score) map.set(s.problemSlug, s);
    }
    return map;
  }, [submissions]);

  const filtered = useMemo(() => {
    let rows = problems ?? [];
    if (difficulty !== 'all') rows = rows.filter((p) => p.difficulty === difficulty);
    if (language !== 'all') rows = rows.filter((p) => p.language === language);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q)),
      );
    }
    return rows;
  }, [problems, difficulty, language, search]);

  const availableLanguages = useMemo(() => {
    const set = new Set<CodeLabLanguage>();
    for (const p of problems ?? []) set.add(p.language);
    return Array.from(set);
  }, [problems]);

  return (
    <>
      <StudentHeader breadcrumbs={breadcrumbs} />
      <main className="px-4 py-6 sm:px-6 lg:px-8">
        <section className="from-primary/10 via-primary/5 mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br to-white p-6 sm:p-8 dark:border-slate-800 dark:from-slate-800/60 dark:via-slate-900 dark:to-slate-950">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="bg-primary/15 text-primary flex size-12 shrink-0 items-center justify-center rounded-xl">
                <Sparkles className="size-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 sm:text-2xl dark:text-slate-100">
                  Luyện code với AI Reviewer
                </h1>
                <p className="mt-1 max-w-2xl text-sm text-slate-600 dark:text-slate-400">
                  Chọn một bài lab phía dưới, viết code trong trình soạn thảo, AI sẽ chấm điểm +
                  giải thích kết quả từng test case. Mọi bài làm đều được lưu lại trong lịch sử của
                  bạn.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Filters */}
        <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {DIFFICULTY_FILTERS.map((f) => (
              <button
                key={f.value}
                onClick={() => setDifficulty(f.value)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  difficulty === f.value
                    ? 'bg-primary text-white shadow'
                    : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700'
                }`}
              >
                {f.label}
              </button>
            ))}
            {availableLanguages.length > 1 && (
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as 'all' | CodeLabLanguage)}
                className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
              >
                <option value="all">Mọi ngôn ngữ</option>
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>
                    {LANGUAGE_LABELS[lang] ?? lang}
                  </option>
                ))}
              </select>
            )}
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm theo tên, category, tag…"
              className="focus:border-primary focus:ring-primary/30 w-full rounded-full border border-slate-200 bg-white py-2 pr-3 pl-9 text-sm text-slate-700 transition focus:ring-2 focus:outline-none dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            />
          </div>
        </section>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-56 w-full rounded-2xl" />
            ))}
          </div>
        ) : isError ? (
          <EmptyState
            icon={<FileCode2 className="size-10" />}
            title="Không tải được danh sách bài lab"
            description="Vui lòng thử lại hoặc kiểm tra kết nối."
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={<FileCode2 className="size-10" />}
            title="Không có bài lab phù hợp"
            description="Thử bộ lọc khác hoặc tìm kiếm với từ khoá khác."
          />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((p) => (
              <ProblemCard key={p.slug} problem={p} bestSubmission={bestByProblem.get(p.slug)} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
