'use client';

import React from 'react';

interface EditorPanelProps {
  isRunning: boolean;
  runResult: 'idle' | 'success' | 'fail';
  consoleTab: 'tests' | 'result';
  setConsoleTab: (tab: 'tests' | 'result') => void;
  onRunCode: () => void;
}

export const EditorPanel = ({
  isRunning,
  runResult,
  consoleTab,
  setConsoleTab,
  onRunCode,
}: EditorPanelProps) => {
  return (
    <div className="flex h-full min-w-[300px] flex-1 flex-col bg-[var(--color-code-bg)]">
      {/* Editor Toolbar */}
      <div className="z-10 flex h-10 flex-shrink-0 items-center justify-between border-b border-black/40 bg-[#21252b] px-3 text-slate-300 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 transition-colors hover:bg-white/5">
            <i className="fa-brands fa-python text-sm text-blue-400"></i>
            <span className="text-[12px] font-medium">Python 3.10</span>
          </div>
        </div>
        <button
          onClick={onRunCode}
          disabled={isRunning}
          className={`flex items-center gap-1.5 rounded border border-white/20 bg-white/10 px-3 py-1 text-[12px] font-bold text-white transition-all hover:bg-white/20 ${isRunning ? 'cursor-not-allowed opacity-50' : ''}`}
        >
          {isRunning ? (
            <i className="fa-solid fa-spinner fa-spin text-[10px]"></i>
          ) : (
            <i className="fa-solid fa-play text-success text-[10px]"></i>
          )}
          <span>{isRunning ? 'Running...' : 'Run Code'}</span>
        </button>
      </div>

      {/* Editor Area */}
      <div className="relative flex flex-1 overflow-hidden bg-[var(--color-code-bg)] font-mono text-[13px] leading-relaxed text-[var(--color-code-text)]">
        <div className="line-numbers dark-scrollbar w-12 flex-shrink-0 overflow-hidden border-r border-white/5 bg-[#282c34] pt-4 pr-3 text-right font-mono text-[12px] text-[#4b5263] select-none">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>

        <div
          className="dark-scrollbar flex-1 overflow-auto pt-4 pb-10 pl-4 font-mono text-[13px] whitespace-pre outline-none"
          contentEditable
          spellCheck={false}
        >
          <span className="text-[var(--color-code-keyword)]">import</span> hashlib
          <span className="text-[var(--color-code-keyword)]">import</span> bisect
          <span className="text-[var(--color-code-keyword)]">class</span>{' '}
          <span className="text-[var(--color-code-function)]">ConsistentHash</span>:
          <span className="text-[var(--color-code-keyword)]">def</span>{' '}
          <span className="text-[var(--color-code-function)]">__init__</span>(
          <span className="text-[var(--color-code-property)]">self</span>, replicas=
          <span className="text-[var(--color-code-number)]">100</span>):
          <span className="text-[var(--color-code-comment)]"># Số lượng virtual nodes</span>
          self.replicas = replicas self.hash_ring = {`{}`}
          self.sorted_keys = []
          <span className="text-[var(--color-code-keyword)]">def</span>{' '}
          <span className="text-[var(--color-code-function)]">get_node</span>(
          <span className="text-[var(--color-code-property)]">self</span>, key):
          <span className="text-[var(--color-code-comment)]">
            {'"""Tìm server chứa key. BẠN HÃY VIẾT CODE Ở ĐÂY"""'}
          </span>
          <span className="text-[var(--color-code-keyword)]">pass</span>
        </div>
      </div>

      {/* Terminal */}
      <div className="z-20 flex h-[35%] flex-shrink-0 flex-col border-t border-black/50 bg-[#1e2227] shadow-[0_-5px_15px_rgba(0,0,0,0.2)]">
        <div className="flex border-b border-white/5 bg-[#21252b]">
          <button
            onClick={() => setConsoleTab('tests')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2 text-[12px] transition-colors ${consoleTab === 'tests' ? 'border-primary bg-[#282c34] font-bold text-slate-200' : 'border-transparent font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-vial text-slate-400"></i> Test Cases
          </button>
          <button
            onClick={() => setConsoleTab('result')}
            className={`flex items-center gap-1.5 border-b-2 px-4 py-2 text-[12px] transition-colors ${consoleTab === 'result' ? 'border-primary bg-[#282c34] font-bold text-slate-200' : 'border-transparent font-medium text-slate-400 hover:bg-white/5 hover:text-slate-200'}`}
          >
            <i className="fa-solid fa-terminal text-slate-400"></i> Terminal Output
          </button>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {consoleTab === 'tests' && (
            <div className="dark-scrollbar h-full overflow-y-auto p-3">
              <div className="space-y-3">
                <div>
                  <div className="mb-1 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                    Input:
                  </div>
                  <div className="rounded border border-white/5 bg-[#282c34] p-2 font-mono text-[12px] text-[#98c379]">
                    add_node(&quot;DB_Master_1&quot;)
                    <br />
                    get_node(&quot;user_id_456&quot;)
                  </div>
                </div>
              </div>
            </div>
          )}

          {consoleTab === 'result' && (
            <div className="dark-scrollbar h-full overflow-y-auto p-3 font-mono text-[12px] text-slate-300">
              {isRunning ? (
                <div className="text-primary mt-2 flex items-center gap-2">
                  <span className="loader"></span> Đang biên dịch trên Cloud Container...
                </div>
              ) : runResult === 'fail' ? (
                <div>
                  <div className="mb-2 text-white">{`> Running test cases...`}</div>
                  <div className="text-success mb-1 flex items-center gap-2">
                    <i className="fa-solid fa-check"></i> Test Case 1: Passed (0.012s)
                  </div>
                  <div className="text-danger mb-2 flex items-start gap-2">
                    <i className="fa-solid fa-xmark mt-0.5"></i>
                    <div>
                      Test Case 2: Failed
                      <br />
                      <span className="text-[11px] text-slate-400">
                        Expected &quot;Server_B&quot; but got &quot;None&quot;
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-2 flex items-center gap-2 text-slate-500">
                  <i className="fa-solid fa-circle-info"></i> Click nút &quot;Run Code&quot; hoặc
                  &quot;Submit&quot; để xem kết quả biên dịch.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
