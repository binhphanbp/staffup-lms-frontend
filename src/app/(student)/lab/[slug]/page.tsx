'use client';

import React, { use, useMemo, useState } from 'react';
import Link from 'next/link';
import { LabHeader } from '@/components/lab/LabHeader';
import { TaskPanel } from '@/components/lab/TaskPanel';
import { EditorPanel } from '@/components/lab/EditorPanel';
import { SubmissionHistoryDrawer } from '@/components/lab/SubmissionHistoryDrawer';
import { fromBackendProblem, difficultyLabel } from '@/components/lab/labProblems';
import { useCodeLabProblem, useSubmitProblem } from '@/hooks/useCodeLab';
import { toast } from '@/lib/toast';
import type { CodeLabEvaluationResult, CodeLabLanguage } from '@/services/code-lab.service';

export default function LabProblemPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: beProblem, isLoading, isError } = useCodeLabProblem(slug);
  const submitMutation = useSubmitProblem(slug);

  const problem = useMemo(() => (beProblem ? fromBackendProblem(beProblem) : null), [beProblem]);

  const [code, setCode] = useState<string>('');
  const [language, setLanguage] = useState<CodeLabLanguage>('python');
  const [consoleTab, setConsoleTab] = useState<'tests' | 'result'>('tests');
  const [evaluation, setEvaluation] = useState<CodeLabEvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);

  // Initialise code/language from the loaded problem (only the first time we
  // see this slug, so user edits are preserved across re-renders). We compute
  // a derived sentinel during render and reset state via setState — this is
  // the React-recommended pattern for syncing local state to a prop change
  // (see https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes).
  const [lastSlug, setLastSlug] = useState<string | null>(null);
  if (problem && lastSlug !== slug) {
    setLastSlug(slug);
    setCode(problem.starterCode);
    setLanguage(problem.language);
    setEvaluation(null);
    setErrorMessage(null);
  }

  const handleSubmit = () => {
    if (!problem || submitMutation.isPending) return;
    setConsoleTab('result');
    setErrorMessage(null);
    setEvaluation(null);
    submitMutation.mutate(
      {
        language,
        code,
      },
      {
        onSuccess: (result) => {
          setEvaluation(result.evaluation);
          toast.success('AI đã chấm bài và lưu vào lịch sử của bạn.');
        },
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { message?: string } }; message?: string };
          const msg =
            e?.response?.data?.message ??
            e?.message ??
            'Đã xảy ra lỗi khi gọi AI. Vui lòng thử lại sau.';
          setErrorMessage(msg);
          toast.error(msg);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-slate-900 text-slate-200">
        <div className="flex items-center gap-3 text-sm">
          <i className="fa-solid fa-circle-notch fa-spin text-purple-400" />
          Đang tải bài lab…
        </div>
      </div>
    );
  }

  if (isError || !problem) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center gap-3 bg-slate-900 text-slate-200">
        <i className="fa-solid fa-triangle-exclamation text-3xl text-rose-400" />
        <p className="text-sm">Không tải được bài lab này. Có thể đã bị ẩn hoặc xoá.</p>
        <Link
          href="/lab"
          className="rounded-md bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-500"
        >
          Quay lại danh sách
        </Link>
      </div>
    );
  }

  const subtitle = `${problem.category} · ${problem.language} · Mức độ: ${difficultyLabel(problem.difficulty)}`;

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-900 font-sans text-slate-800">
      <LabHeader
        onRunCode={handleSubmit}
        title={problem.title}
        subtitle={subtitle}
        backHref="/lab"
        backTitle="Quay lại danh sách bài lab"
        rightSlot={
          <button
            onClick={() => setHistoryOpen(true)}
            className="flex items-center gap-1.5 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-semibold text-slate-200 transition hover:bg-white/10"
            title="Lịch sử nộp bài"
          >
            <i className="fa-solid fa-clock-rotate-left" />
            Lịch sử
          </button>
        }
      />

      <div className="flex w-full flex-1 flex-col overflow-hidden md:flex-row">
        <TaskPanel problem={problem} />

        <div className="resizer hidden md:block"></div>

        <EditorPanel
          code={code}
          onCodeChange={setCode}
          language={language}
          onLanguageChange={setLanguage}
          isRunning={submitMutation.isPending}
          evaluation={evaluation}
          errorMessage={errorMessage}
          consoleTab={consoleTab}
          setConsoleTab={setConsoleTab}
          onRunCode={handleSubmit}
          testCaseCount={problem.testCases.length}
        />
      </div>

      <SubmissionHistoryDrawer
        slug={slug}
        open={historyOpen}
        onClose={() => setHistoryOpen(false)}
        onPick={(s) => {
          setCode(s.code);
          setLanguage(s.language);
          if (s.evaluation) {
            setEvaluation(s.evaluation);
            setConsoleTab('result');
          }
          setHistoryOpen(false);
          toast.info(
            `Đã tải lại code từ lượt nộp lúc ${new Date(s.createdAt).toLocaleString('vi-VN')}`,
          );
        }}
      />
    </div>
  );
}
