import React from 'react';

export const SystemPrompt = () => {
  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
      <div className="border-b border-[#DADCE0] bg-[#FAFAFA] px-6 py-4">
        <h3 className="m-0 flex items-center gap-2 text-[15px] font-medium text-[#202124]">
          <span className="material-symbols-outlined text-[#5F6368]">psychology</span> Hành vi AI
          (System Prompt)
        </h3>
      </div>
      <div className="p-4">
        <p className="mt-0 mb-3 text-[12px] text-[#5F6368]">
          Định hình phong cách trả lời mặc định cho Chatbot học tập.
        </p>
        <textarea
          className="h-[200px] w-full resize-y rounded-[4px] border border-[#DADCE0] px-3 py-2 font-mono text-[13px] leading-[1.5] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
          defaultValue={`Bạn là một trợ lý giảng dạy AI xuất sắc trong hệ thống LMS nội bộ của doanh nghiệp. 
Nhiệm vụ của bạn là:
1. Giải đáp các thắc mắc về khóa học một cách ngắn gọn, súc tích.
2. Khuyến khích học viên tự suy nghĩ, không đưa ra câu trả lời trực tiếp cho bài tập.
3. Luôn giữ thái độ lịch sự, chuyên nghiệp.
4. Trả lời bằng tiếng Việt chuẩn mực.`}
        ></textarea>
        <button className="mt-3 flex h-9 w-full items-center justify-center rounded-[4px] border border-[#DADCE0] bg-transparent text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4] hover:text-[#202124]">
          Khôi phục Prompt mặc định
        </button>
      </div>
    </div>
  );
};
