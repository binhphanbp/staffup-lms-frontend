import React from 'react';

interface QuestionContentProps {
  activeQuestion: number;
  setActiveQuestion: React.Dispatch<React.SetStateAction<number>>;
  answeredQs: number[];
  onSelectOption: () => void;
  reviewQs: number[];
  onToggleReview: () => void;
}

export const QuestionContent = ({
  activeQuestion,
  setActiveQuestion,
  answeredQs,
  onSelectOption,
  reviewQs,
  onToggleReview,
}: QuestionContentProps) => {
  return (
    <div className="relative flex h-full flex-1 flex-col bg-white">
      {/* Thanh công cụ nhỏ trên câu hỏi */}
      <div className="flex shrink-0 flex-wrap items-center justify-between gap-3 border-b border-gray-100 bg-slate-50 px-4 py-3 md:px-8 md:py-4">
        <div className="flex items-center gap-3">
          <span className="bg-primary rounded px-3 py-1 text-[13px] font-bold text-white shadow-sm">
            Câu hỏi {activeQuestion}
          </span>
          <span className="rounded border border-red-200 bg-red-100 px-2 py-0.5 text-[10px] font-bold tracking-widest text-red-600 uppercase">
            Hard
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[12px] font-bold text-slate-500">
            <i className="fa-solid fa-star text-yellow-400"></i> Điểm: 5.0
          </span>
          <div className="h-4 w-px bg-gray-300"></div>
          <label className="group flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={reviewQs.includes(activeQuestion)}
              onChange={onToggleReview}
              className="cbx"
            />
            <span className="group-hover:text-warning text-[12px] font-semibold text-slate-600 transition-colors select-none">
              Đánh dấu xem lại
            </span>
          </label>
        </div>
      </div>

      {/* Nội dung câu hỏi */}
      <div className="custom-scrollbar flex-1 overflow-y-auto p-4 md:p-8">
        <div className="mx-auto w-full max-w-3xl pb-10">
          <div className="mb-6 text-[15px] leading-relaxed font-medium text-slate-800">
            Công ty TechCorp đang thiết kế một ứng dụng Web có lượng truy cập đột biến (spiky
            traffic). Bạn quyết định sử dụng kiến trúc Serverless trên AWS. Hãy phân tích đoạn code
            Lambda dưới đây và cho biết thành phần nào sẽ trở thành{' '}
            <strong>nút thắt cổ chai (bottleneck)</strong> lớn nhất khi lượng Request tăng gấp 100
            lần trong vài giây?
          </div>

          <div className="bg-code-bg mb-6 overflow-hidden rounded-lg border border-slate-700 shadow-md">
            <div className="flex items-center gap-2 border-b border-black/40 bg-[#21252b] px-4 py-1.5 font-mono text-[10px] text-slate-400">
              <i className="fa-brands fa-node-js text-green-500"></i> lambda_function.js
            </div>
            <div className="text-code-text overflow-x-auto p-4 font-mono text-[13px] leading-relaxed">
              <span className="text-code-keyword">const</span> {`{`} Client {`}`} ={' '}
              <span className="text-code-function">require</span>(
              <span className="text-code-string">&apos;pg&apos;</span>);
              <span className="text-code-keyword">exports</span>.
              <span className="text-code-function">handler</span> ={' '}
              <span className="text-code-keyword">async</span> (event) ={`>`} {`{`}
              {/* Khởi tạo connection mới mỗi khi Lambda được invoke */}
              <span className="text-code-keyword">const</span> client ={' '}
              <span className="text-code-keyword">new</span>{' '}
              <span className="text-code-function">Client</span>({`{`}
              host: process.env.RDS_HOST, database:{' '}
              <span className="text-code-string">&apos;techcorp_db&apos;</span>
              {`}`});
              <span className="text-code-keyword">await</span> client.
              <span className="text-code-function">connect</span>();
              <span className="text-code-keyword">return</span>{' '}
              <span className="text-code-string">&apos;Success&apos;</span>;{`}`};
            </div>
          </div>

          <div className="mb-4 text-[13px] font-bold text-slate-700">Chọn 1 đáp án đúng nhất:</div>
          <form className="space-y-3">
            <div className="relative">
              <input
                type="radio"
                name="answer"
                id="optC"
                className="option-input absolute h-0 w-0 opacity-0"
                onChange={onSelectOption}
                checked={answeredQs.includes(activeQuestion)}
              />
              <label htmlFor="optC" className="option-label">
                <div className="radio-circle"></div>
                <div className="flex-1">
                  <div className="mb-1 text-[14px] font-bold text-slate-800">
                    C. Amazon RDS (Database Connections)
                  </div>
                  <div className="text-[12px] leading-relaxed text-slate-500">
                    Vì Lambda scale out tạo ra hàng ngàn container, mỗi container mở 1 kết nối DB
                    mới, làm cạn kiệt connection pool của RDS.
                  </div>
                </div>
              </label>
            </div>
          </form>
        </div>
      </div>

      {/* Điều hướng Trái / Phải */}
      <div className="flex shrink-0 items-center justify-between border-t border-gray-200 bg-white px-8 py-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        <button
          onClick={() => setActiveQuestion((prev) => Math.max(1, prev - 1))}
          className="hover:text-primary hover:border-primary flex items-center gap-2 rounded-lg border border-gray-300 px-5 py-2.5 text-[13px] font-bold text-slate-600 transition-all hover:bg-slate-50"
        >
          <i className="fa-solid fa-arrow-left"></i> Câu trước
        </button>
        <button
          onClick={() => setActiveQuestion((prev) => Math.min(20, prev + 1))}
          className="bg-primary hover:bg-primary-hover flex transform items-center gap-2 rounded-lg px-5 py-2.5 text-[13px] font-bold text-white shadow-md shadow-blue-500/20 transition-all active:scale-95"
        >
          Câu tiếp theo <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>
    </div>
  );
};
