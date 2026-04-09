import React from 'react';
import type { Submission } from './types';

interface GradingWorkspaceProps {
  activeSub: Submission | undefined;
  onClose: () => void;
  draftScore: string;
  setDraftScore: (val: string) => void;
  draftFeedback: string;
  setDraftFeedback: (val: string) => void;
  onApplyAI: () => void;
  onSubmitGrade: () => void;
}

export const GradingWorkspace = ({
  activeSub,
  onClose,
  draftScore,
  setDraftScore,
  draftFeedback,
  setDraftFeedback,
  onApplyAI,
  onSubmitGrade,
}: GradingWorkspaceProps) => {
  return (
    <div
      className={`fixed inset-0 z-[2000] flex flex-col bg-[#F8F9FA] transition-opacity duration-200 ${activeSub ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div className="z-10 flex h-[64px] flex-shrink-0 items-center justify-between border-b border-[#DADCE0] bg-white px-6 shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)]">
        <div className="flex items-center gap-4">
          <button
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#F1F3F4]"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <div>
            <h2 className="m-0 text-[18px] leading-tight font-medium text-[#202124]">
              {activeSub?.name}
            </h2>
            <span className="text-[13px] text-[#5F6368]">{activeSub?.assignment}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 rounded border-none bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] hover:bg-[#F1F3F4]">
            <span className="material-symbols-outlined text-[20px]">chevron_left</span> Trước
          </button>
          <button className="flex items-center gap-2 rounded border-none bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] hover:bg-[#F1F3F4]">
            Sau <span className="material-symbols-outlined text-[20px]">chevron_right</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Document Viewer */}
        <div className="custom-scrollbar flex flex-[2] justify-center overflow-y-auto bg-[#E8EAED] p-6">
          <div className="min-h-full w-full max-w-[800px] rounded-[4px] bg-white px-[40px] py-[40px] leading-[1.6] text-[#202124] shadow-[0_1px_2px_0_rgba(60,64,67,0.3),0_1px_3px_1px_rgba(60,64,67,0.15)] sm:px-[60px]">
            <div className="mb-6 text-center text-[20px] font-medium">
              Phân tích Kịch bản chốt Sale B2B - Công ty XYZ
            </div>
            <div className="space-y-4 text-justify text-[14px]">
              <p>
                <strong>1. Giới thiệu vấn đề:</strong> Khách hàng là một doanh nghiệp sản xuất đang
                gặp khó khăn trong việc quản lý chuỗi cung ứng. Ngân sách dự kiến là 500 triệu VNĐ.
              </p>
              <p>
                <strong>2. Tiếp cận (Approach):</strong> Thay vì bán thẳng sản phẩm phần mềm ERP,
                tôi chọn cách tiếp cận theo hướng &quot;Consultative Selling&quot;. Bắt đầu bằng
                việc đặt câu hỏi về tỷ lệ hao hụt nguyên vật liệu trong quý vừa qua.
              </p>
              <p>
                <strong>3. Xử lý từ chối:</strong> Khi khách hàng chê giá đắt, tôi áp dụng kỹ thuật
                ROI. Tôi chứng minh rằng phần mềm sẽ giảm 5% hao hụt, tương đương tiết kiệm 200
                triệu mỗi năm. Khoản đầu tư 500 triệu sẽ hoàn vốn trong 2.5 năm.
              </p>
              <p>
                <strong>4. Chốt Sales (Closing):</strong> Sử dụng kỹ thuật Assumptive Close:
                &quot;Vậy tuần sau thứ 3 hay thứ 5, team kỹ thuật bên em sang cài đặt demo cho anh
                chị được ạ?&quot;.
              </p>
              <p>
                <em className="text-[#5F6368]">Kết luận:</em> Kịch bản này tập trung vào giá trị
                mang lại thay vì tính năng sản phẩm.
              </p>
            </div>
          </div>
        </div>

        {/* Right: Grading Panel */}
        <div className="custom-scrollbar flex max-w-[500px] min-w-[400px] flex-1 flex-col overflow-y-auto border-l border-[#DADCE0] bg-white">
          <div className="border-b border-[#DADCE0] bg-[#FAFAFA] p-6">
            <div className="mb-4 flex items-center gap-2 text-[13px] font-medium tracking-[0.5px] text-[#5F6368] uppercase">
              <span className="material-symbols-outlined text-[20px] text-[#9334E6]">
                auto_awesome
              </span>{' '}
              Đánh giá từ Trợ lý AI
            </div>

            <div className="mb-4 rounded-lg border border-[#E8D3FD] bg-gradient-to-br from-[#F3E8FD] to-white p-4">
              <div className="text-[12px] text-[#5F6368] uppercase">Điểm đề xuất</div>
              <div className="my-2 text-[32px] font-normal text-[#9334E6]">
                {activeSub?.status === 'AIGraded'
                  ? `${activeSub.aiScore} / 100`
                  : activeSub?.status === 'Graded'
                    ? `${activeSub.aiScore || '-'} / 100`
                    : 'Đang phân tích...'}
              </div>
              <div className="mb-3 rounded bg-white/70 p-3 text-[13px] leading-relaxed text-[#202124]">
                <strong>Tóm tắt nhận xét:</strong> Học viên nắm vững lý thuyết Consultative Selling.
                <ul className="mt-2 list-disc space-y-1 pl-5">
                  <li className="text-[#34A853]">Điểm mạnh: Xử lý từ chối rất logic.</li>
                  <li className="text-[#EA4335]">Điểm yếu: Phần giới thiệu còn hơi sơ sài.</li>
                </ul>
              </div>
              <button
                onClick={onApplyAI}
                className="flex w-full items-center justify-center gap-2 rounded-[4px] border border-[#E8D3FD] bg-transparent py-2 font-medium text-[#9334E6] transition-all hover:bg-[#E8D3FD] hover:shadow-[0_1px_2px_rgba(0,0,0,0.1)]"
              >
                Áp dụng Điểm & Nhận xét của AI
              </button>
            </div>
          </div>

          <div className="flex-1 p-6">
            <div className="mb-4 flex items-center gap-2 text-[13px] font-medium tracking-[0.5px] text-[#5F6368] uppercase">
              <span className="material-symbols-outlined text-[20px]">edit</span> Điểm số & Nhận xét
              chính thức
            </div>
            <div className="mb-6 flex items-center gap-4">
              <input
                type="number"
                className="w-[100px] rounded-lg border-2 border-[#DADCE0] p-3 text-center text-[20px] font-medium transition-colors outline-none focus:border-[#1A73E8]"
                placeholder="--"
                value={draftScore}
                onChange={(e) => setDraftScore(e.target.value)}
              />
              <span className="text-[20px] text-[#5F6368]">/ 100</span>
            </div>
            <div className="mb-2 text-[13px] font-medium text-[#202124]">
              Nhận xét cho học viên (Phản hồi)
            </div>
            <textarea
              className="h-[150px] w-full resize-y rounded-lg border border-[#DADCE0] p-3 text-[13px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
              placeholder="Nhập nhận xét của bạn vào đây..."
              value={draftFeedback}
              onChange={(e) => setDraftFeedback(e.target.value)}
            ></textarea>
          </div>

          <div className="mt-auto flex flex-col gap-3 border-t border-[#DADCE0] bg-[#FAFAFA] p-6">
            <button
              onClick={onSubmitGrade}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[4px] bg-[#1A73E8] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-colors hover:bg-[#174EA6]"
            >
              Lưu kết quả & Gửi phản hồi
            </button>
            <button
              onClick={() => alert('Đã yêu cầu học viên làm lại bài.')}
              className="flex h-11 w-full items-center justify-center gap-2 rounded-[4px] border border-[#DADCE0] bg-transparent font-medium text-[#EA4335] transition-colors hover:bg-[#F1F3F4] hover:text-[#202124]"
            >
              Yêu cầu nộp lại
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
