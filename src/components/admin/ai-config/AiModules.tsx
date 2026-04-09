import React from 'react';

export const AiModules = () => {
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
        </p>

        <div className="mb-3 flex items-center justify-between rounded-lg border border-[#DADCE0] bg-white p-4 transition-colors hover:border-[#9AA0A6]">
          <div>
            <h4 className="m-0 mb-1 text-[14px] font-medium text-[#202124]">
              Chatbot Trợ lý Học tập (Learner Chatbot)
            </h4>
            <p className="m-0 text-[12px] text-[#5F6368]">
              Hiển thị widget chatbot góc phải màn hình để giải đáp thắc mắc bài học.
            </p>
          </div>
          <label className="relative inline-flex flex-shrink-0 cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" defaultChecked />
            <div className="peer h-6 w-11 rounded-full bg-[#BDBDBD] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] peer-checked:bg-[#9334E6] after:absolute after:top-[3px] after:left-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgba(0,0,0,0.3)] after:transition-all after:content-[''] peer-checked:after:translate-x-[20px]"></div>
          </label>
        </div>

        <div className="mb-3 flex items-center justify-between rounded-lg border border-[#DADCE0] bg-white p-4 transition-colors hover:border-[#9AA0A6]">
          <div>
            <h4 className="m-0 mb-1 text-[14px] font-medium text-[#202124]">
              Dự báo Rủi ro Bỏ học (Dropout Prediction)
            </h4>
            <p className="m-0 text-[12px] text-[#5F6368]">
              Sử dụng Machine Learning để phân tích hành vi và cảnh báo Admin.
            </p>
          </div>
          <label className="relative inline-flex flex-shrink-0 cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" defaultChecked />
            <div className="peer h-6 w-11 rounded-full bg-[#BDBDBD] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] peer-checked:bg-[#9334E6] after:absolute after:top-[3px] after:left-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgba(0,0,0,0.3)] after:transition-all after:content-[''] peer-checked:after:translate-x-[20px]"></div>
          </label>
        </div>

        <div className="mb-3 flex items-center justify-between rounded-lg border border-[#DADCE0] bg-white p-4 transition-colors hover:border-[#9AA0A6]">
          <div>
            <h4 className="m-0 mb-1 text-[14px] font-medium text-[#202124]">
              Chấm điểm Tự luận Tự động (Auto-Grader)
            </h4>
            <p className="m-0 text-[12px] text-[#5F6368]">
              Đọc bài luận, chấm điểm nháp và gợi ý nhận xét cho Giảng viên.
            </p>
          </div>
          <label className="relative inline-flex flex-shrink-0 cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" defaultChecked />
            <div className="peer h-6 w-11 rounded-full bg-[#BDBDBD] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] peer-checked:bg-[#9334E6] after:absolute after:top-[3px] after:left-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgba(0,0,0,0.3)] after:transition-all after:content-[''] peer-checked:after:translate-x-[20px]"></div>
          </label>
        </div>

        <div className="flex items-center justify-between rounded-lg border border-[#DADCE0] bg-white p-4 transition-colors hover:border-[#9AA0A6]">
          <div>
            <h4 className="m-0 mb-1 text-[14px] font-medium text-[#202124]">
              Trợ lý Tạo Câu hỏi (Question Generator)
            </h4>
            <p className="m-0 text-[12px] text-[#5F6368]">
              Tự động sinh câu hỏi trắc nghiệm từ tài liệu bài giảng.
            </p>
          </div>
          <label className="relative inline-flex flex-shrink-0 cursor-pointer items-center">
            <input type="checkbox" className="peer sr-only" defaultChecked />
            <div className="peer h-6 w-11 rounded-full bg-[#BDBDBD] shadow-[inset_0_0_2px_rgba(0,0,0,0.1)] peer-checked:bg-[#9334E6] after:absolute after:top-[3px] after:left-[3px] after:h-[18px] after:w-[18px] after:rounded-full after:bg-white after:shadow-[0_1px_2px_rgba(0,0,0,0.3)] after:transition-all after:content-[''] peer-checked:after:translate-x-[20px]"></div>
          </label>
        </div>
      </div>
    </div>
  );
};
