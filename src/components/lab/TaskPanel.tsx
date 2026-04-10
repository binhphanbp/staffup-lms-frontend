'use client';

import React, { useState } from 'react';

export const TaskPanel = () => {
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
            <h2 className="mb-3 text-xl font-bold text-slate-900">Triển khai Consistent Hashing</h2>

            <div className="mb-6 flex gap-2">
              <span className="rounded border border-red-100 bg-red-50 px-2 py-1 text-[11px] font-bold text-red-600">
                Hard
              </span>
              <span className="rounded bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                System Design
              </span>
            </div>

            <div className="space-y-4 text-[13px] leading-relaxed text-slate-700">
              <p>
                Trong các hệ thống phân tán, việc phân bổ dữ liệu đều lên các server (nodes) là rất
                quan trọng. Thuật toán modulo thông thường (<code>hash(key) % N</code>) sẽ gặp vấn
                đề lớn (re-hashing) khi thêm hoặc bớt server.
              </p>
              <p>
                <strong>Nhiệm vụ của bạn:</strong> Cài đặt class <code>ConsistentHash</code> hỗ trợ
                các thao tác:
              </p>
              <ul className="marker:text-primary list-disc space-y-1 pl-5">
                <li>
                  <code>add_node(node_name)</code>: Thêm server mới vào vòng (Ring).
                </li>
                <li>
                  <code>remove_node(node_name)</code>: Xóa server khỏi vòng.
                </li>
                <li>
                  <code>get_node(key)</code>: Trả về tên server lưu trữ key.
                </li>
              </ul>

              <h4 className="mt-6 mb-2 font-bold text-slate-800">
                Điều kiện ràng buộc (Constraints):
              </h4>
              <ul className="list-disc space-y-1 pl-5 text-slate-600">
                <li>
                  Số lượng virtual nodes mặc định là <strong>100</strong>.
                </li>
                <li>
                  Độ phức tạp của <code>get_node</code> không được vượt quá{' '}
                  <strong>O(log N)</strong>. Dùng <code>bisect</code> trong Python.
                </li>
              </ul>

              <div className="mt-6 rounded border border-yellow-200 bg-yellow-50 p-3 text-xs text-yellow-800">
                <i className="fa-solid fa-lightbulb text-warning mr-1"></i> <strong>Gợi ý:</strong>{' '}
                Bạn cần duy trì một mảng chứa các giá trị hash đã được sắp xếp (sorted keys) để dùng
                Binary Search.
              </div>
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
                  <div className="mb-1 text-[11px] font-bold text-slate-500">TechLearn AI</div>
                  <div className="rounded-lg rounded-tl-none border border-gray-200 bg-white p-3 text-[13px] leading-relaxed text-slate-700 shadow-sm">
                    Chào Bảo! Đây là bài Lab khá khó. Nếu bạn cần gợi ý về cách thiết lập mảng{' '}
                    <code>sorted_keys</code>, hãy hỏi tôi nhé!
                  </div>
                </div>
              </div>
            </div>
            <div className="border-t border-gray-200 bg-white p-3">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hỏi AI Copilot..."
                  className="w-full rounded-lg border border-gray-200 bg-slate-50 py-2.5 pr-10 pl-4 font-sans text-[13px] transition-all outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400"
                />
                <button className="absolute top-1/2 right-2 flex h-7 w-7 -translate-y-1/2 items-center justify-center text-slate-400 transition-colors hover:text-purple-600">
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
