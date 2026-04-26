'use client';

import React, { useState } from 'react';
import { LabHeader } from '@/components/lab/LabHeader';
import { TaskPanel } from '@/components/lab/TaskPanel';
import { EditorPanel } from '@/components/lab/EditorPanel';
import { consistentHashingProblem } from '@/components/lab/labProblems';
import { useEvaluateCode } from '@/hooks/useCodeLab';
import type { CodeLabEvaluationResult, CodeLabLanguage } from '@/services/code-lab.service';

export default function CodeLabPage() {
  // Lab is single-problem for now; the registry shape lets us drive multi-problem
  // mode from the URL or from a BE lesson lookup later.
  const problem = consistentHashingProblem;

  const [code, setCode] = useState<string>(problem.starterCode);
  const [language, setLanguage] = useState<CodeLabLanguage>(problem.language);
  const [consoleTab, setConsoleTab] = useState<'tests' | 'result'>('tests');
  const [evaluation, setEvaluation] = useState<CodeLabEvaluationResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const evaluateMutation = useEvaluateCode();

  const handleRunCode = () => {
    if (evaluateMutation.isPending) return;
    setConsoleTab('result');
    setErrorMessage(null);
    setEvaluation(null);
    evaluateMutation.mutate(
      {
        language,
        code,
        problemStatement: problem.problemStatement,
        testCases: problem.testCases,
      },
      {
        onSuccess: (result) => setEvaluation(result),
        onError: (err: unknown) => {
          const e = err as { response?: { data?: { message?: string } }; message?: string };
          setErrorMessage(
            e?.response?.data?.message ??
              e?.message ??
              'Đã xảy ra lỗi khi gọi AI. Vui lòng thử lại sau.',
          );
        },
      },
    );
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-900 font-sans text-slate-800">
      <LabHeader onRunCode={handleRunCode} />

      <div className="flex w-full flex-1 overflow-hidden">
        <TaskPanel problem={problem} />

        <div className="resizer"></div>

        <EditorPanel
          code={code}
          onCodeChange={setCode}
          language={language}
          onLanguageChange={setLanguage}
          isRunning={evaluateMutation.isPending}
          evaluation={evaluation}
          errorMessage={errorMessage}
          consoleTab={consoleTab}
          setConsoleTab={setConsoleTab}
          onRunCode={handleRunCode}
        />
      </div>
    </div>
  );
}
