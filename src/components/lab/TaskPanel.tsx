'use client';

import React, { useState } from 'react';
import {
  type LabProblem,
  difficultyLabel,
  difficultyBadgeClass,
} from '@/components/lab/labProblems';

interface TaskPanelProps {
  problem: LabProblem;
}

export const TaskPanel = ({ problem }: TaskPanelProps) => {
  const [leftTab, setLeftTab] = useState<'task' | 'ai'>('task');

  return (
    <div className="z-10 flex h-full w-full shrink-0 flex-col bg-white shadow-xl lg:w-[40%] xl:w-[35%]">
      <div className="flex border-b border-gray-200 bg-slate-50 px-2 pt-2">
        <button
          onClick={() => setLeftTab('task')}
          className={`flex items-center gap-2 rounded-t-md border-b-2 px-4 py-2 text-[13px] transition-colors ${leftTab === 'task' ? 'text-primary border-primary bg-white font-bold' : 'border-transparent font-semibold text-slate-500 hover:text-slate-800'}`}
        >
          <i className="fa-solid fa-file-code"></i> Yêu cầu đề bài
        </button>
        <button
          onClick={() => setLeftTab('ai')}
          className={`flex items-center gap-2 border-b-2 px-4 py-2 text-[13px] transition-colors ${leftTab === 'ai' ? 'text-primary border-primary bg-white font-bold' : 'border-transparent font-semibold text-slate-500 hover:text-slate-800'}`}
        >
          <i className="fa-solid fa-wand-magic-sparkles text-purple-500"></i> AI Copilot
        </button>
      </div>

      <div className="relative flex-1 overflow-hidden">
        {/* Tab: Task */}
        {leftTab === 'task' && (
          <div className="custom-scrollbar prose prose-slate h-full overflow-y-auto p-5 pb-20">
            <h2 className="mb-3 text-xl font-bold text-slate-900">{problem.title}</h2>

            <div className="mb-6 flex gap-2">
              <span
                className={`rounded px-2 py-1 text-[11px] font-bold ${difficultyBadgeClass(problem.difficulty)}`}
              >
                {difficultyLabel(problem.difficulty)}
              </span>
              <span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                {problem.category}
              </span>
              <span className="text-primary rounded bg-blue-50 px-2 py-1 text-[11px] font-medium">
                {problem.language}
              </span>
            </div>

            <div className="space-y-3 text-[13px] leading-relaxed whitespace-pre-line text-slate-700">
              {problem.problemStatement}
            </div>

            <h4 className="mt-6 mb-2 font-bold text-slate-800">Test cases mẫu:</h4>
            <div className="space-y-2">
              {problem.testCases.map((tc, i) => (
                <div
                  key={i}
                  className="overflow-hidden rounded-md border border-slate-200 bg-slate-50"
                >
                  <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-1.5 text-[11px] font-semibold text-slate-600">
                    <span>Case #{i + 1}</span>
                    {tc.description && (
                      <span className="font-normal text-slate-500">{tc.description}</span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-3 p-3 sm:grid-cols-2">
                    <div>
                      <div className="mb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                        Input
                      </div>
                      <pre className="overflow-x-auto rounded bg-slate-900 p-2 font-mono text-[11px] text-green-300">
                        {tc.input}
                      </pre>
                    </div>
                    <div>
                      <div className="mb-1 text-[10px] font-bold tracking-wider text-slate-500 uppercase">
                        Expected
                      </div>
                      <pre className="overflow-x-auto rounded bg-slate-900 p-2 font-mono text-[11px] text-amber-200">
                        {tc.expectedOutput}
                      </pre>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded border border-blue-100 bg-blue-50 p-3 text-xs text-blue-800">
              <i className="fa-solid fa-circle-info text-primary mr-1"></i> <strong>Lưu ý:</strong>{' '}
              Khi bấm <strong>Run AI Review</strong>, AI sẽ phân tích code + mô phỏng chạy với từng
              test case (không thực thi thật) và đưa ra nhận xét chi tiết tiếng Việt.
            </div>
          </div>
        )}

        {/* Tab: AI */}
        {leftTab === 'ai' && (
          <div className="flex h-full flex-col bg-[#f8fafc]">
            <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
              <div className="flex gap-3">
                <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded bg-purple-100 text-purple-600">
                  <i className="fa-solid fa-robot text-xs"></i>
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-[11px] font-bold text-slate-500">Staffup AI</div>
                  <div className="rounded-lg rounded-tl-none border border-gray-200 bg-white p-3 text-[13px] leading-relaxed text-slate-700 shadow-sm">
                    Bấm <strong>Run AI Review</strong> ở panel bên phải để mình chấm bài. Bạn cũng
                    có thể hỏi mình bất kỳ gợi ý nào về thuật toán này.
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 bg-white p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hỏi AI Copilot... (sắp ra mắt)"
                  disabled
                  className="w-full rounded-lg border border-gray-200 bg-slate-50 py-2.5 pr-10 pl-4 font-sans text-[13px] transition-all outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 disabled:cursor-not-allowed disabled:opacity-60"
                />
                <button
                  disabled
                  className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-slate-400 transition-colors hover:text-purple-600 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <i className="fa-solid fa-paper-plane text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
