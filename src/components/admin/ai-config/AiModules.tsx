'use client';

import React from 'react';
import type { AiModuleFlags } from '@/services/ai-config.service';

interface AiModulesProps {
  modules: AiModuleFlags;
  onChange: (key: keyof AiModuleFlags, value: boolean) => void;
}

const ITEMS: Array<{
  key: keyof AiModuleFlags;
  title: string;
  description: string;
}> = [
  {
    key: 'chatbot',
    title: 'Chatbot Trợ lý Học tập (Learner Chatbot)',
    description: 'Hiển thị widget chatbot góc phải màn hình để giải đáp thắc mắc bài học.',
  },
  {
    key: 'dropoutPrediction',
    title: 'Dự báo Rủi ro Bỏ học (Dropout Prediction)',
    description: 'Sử dụng AI phân tích hành vi và cảnh báo Admin về học viên có nguy cơ.',
  },
  {
    key: 'autoGrader',
    title: 'Chấm điểm Tự luận Tự động (Auto-Grader)',
    description: 'Đọc bài luận, chấm điểm nháp và gợi ý nhận xét cho Giảng viên.',
  },
  {
    key: 'questionGenerator',
    title: 'Trợ lý Tạo Câu hỏi (Question Generator)',
    description: 'Tự động sinh câu hỏi trắc nghiệm từ tài liệu bài giảng.',
  },
];

export const AiModules = ({ modules, onChange }: AiModulesProps) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
      <div className="border-b border-[#DADCE0] bg-[#FAFAFA] px-6 py-4">
        <h3 className="m-0 flex items-center gap-2 text-[15px] font-medium text-[#202124]">
          <span className="material-symbols-outlined text-[#5F6368]">toggle_on</span> Quản lý Module
          AI
        </h3>
      </div>
      <div className="p-6">
        <p className="mt-0 mb-5 text-[13px] text-[#5F6368]">
          Bật/tắt các tính năng AI sẽ được áp dụng trên toàn bộ hệ thống cho Giảng viên và Học viên.
          Khi tắt, hệ thống sẽ trả về lỗi 503 cho các API liên quan.
        </p>

        {ITEMS.map((item, idx) => (
          <div
            key={item.key}
            className={`flex items-center justify-between rounded-lg border border-[#DADCE0] bg-white p-4 transition-colors hover:border-[#9AA0A6] ${idx < ITEMS.length - 1 ? 'mb-3' : ''}`}
          >
            <div>
              <h4 className="m-0 mb-1 text-[14px] font-medium text-[#202124]">{item.title}</h4>
              <p className="m-0 text-[12px] text-[#5F6368]">{item.description}</p>
            </div>
            <label className="relative inline-flex flex-shrink-0 cursor-pointer items-center">
              <input
                type="checkbox"
                className="peer sr-only"
                checked={modules[item.key]}
                onChange={(e) => onChange(item.key, e.target.checked)}
              />
              <div className="peer h-6 w-11 rounded-full bg-[#BDBDBD] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] peer-checked:bg-[#9334E6] after:absolute after:top-[3px] after:left-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgba(0,0,0,0.3)] after:transition-all after:content-[''] peer-checked:after:translate-x-[20px]"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
