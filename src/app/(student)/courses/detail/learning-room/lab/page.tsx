'use client';

import React, { useState } from 'react';
import { LabHeader } from '@/components/lab/LabHeader';
import { TaskPanel } from '@/components/lab/TaskPanel';
import { EditorPanel } from '@/components/lab/EditorPanel';

export default function CodeLabPage() {
  // State quản lý việc chạy code (chia sẻ giữa Header và Editor)
  const [consoleTab, setConsoleTab] = useState<'tests' | 'result'>('tests');
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<'idle' | 'success' | 'fail'>('idle');

  // Hàm xử lý chung khi bấm "Run Code" hoặc "Submit"
  const handleRunCode = () => {
    setConsoleTab('result');
    setIsRunning(true);
    setRunResult('idle');

    // Giả lập API xử lý mất 1.5s
    setTimeout(() => {
      setIsRunning(false);
      setRunResult('fail');
    }, 1500);
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-slate-900 font-sans text-slate-800">
      {/* HEADER */}
      <LabHeader onRunCode={handleRunCode} />

      {/* MAIN SPLIT LAYOUT */}
      <div className="flex w-full flex-1 overflow-hidden">
        {/* CỘT TRÁI: ĐỀ BÀI */}
        <TaskPanel />

        {/* CỘT GIỮA: THANH KÉO (RESIZER) */}
        <div className="resizer"></div>

        {/* CỘT PHẢI: EDITOR */}
        <EditorPanel
          isRunning={isRunning}
          runResult={runResult}
          consoleTab={consoleTab}
          setConsoleTab={setConsoleTab}
          onRunCode={handleRunCode}
        />
      </div>
    </div>
  );
}
