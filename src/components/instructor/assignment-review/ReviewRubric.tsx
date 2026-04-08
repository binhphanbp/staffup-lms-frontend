import React from 'react';

interface ReviewRubricProps {
  rubric1: number;
  setRubric1: (val: number) => void;
  rubric2: number;
  setRubric2: (val: number) => void;
  rubric3: number;
  setRubric3: (val: number) => void;
  isSubmitting: boolean;
  onSubmitReview: (action: 'approve' | 'reject') => void;
}

export const ReviewRubric = ({
  rubric1,
  setRubric1,
  rubric2,
  setRubric2,
  rubric3,
  setRubric3,
  isSubmitting,
  onSubmitReview,
}: ReviewRubricProps) => {
  // Tính tổng điểm
  const totalScore = Math.round(((rubric1 + rubric2 + rubric3) / 15) * 100);

  return (
    <div className="z-10 flex h-full w-80 flex-shrink-0 flex-col border-l border-slate-200 bg-white shadow-[-4px_0_15px_rgba(0,0,0,0.02)] lg:w-96 xl:w-[400px]">
      <div className="flex-shrink-0 border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="flex items-center gap-2 text-[14px] font-bold text-slate-800">
          <i className="fa-solid fa-clipboard-check text-primary"></i> Đánh giá & Chấm điểm
        </h2>
      </div>

      <div className="custom-scrollbar flex-1 space-y-6 overflow-y-auto p-5">
        {/* AI Analysis */}
        <div className="rounded-lg border border-purple-100 bg-purple-50 p-4">
          <div className="mb-2 flex items-center gap-2">
            <i className="fa-solid fa-wand-magic-sparkles text-purple-500"></i>
            <h4 className="text-[12px] font-bold text-purple-800">AI Code Analysis</h4>
            <span className="ml-auto rounded-full bg-purple-200 px-2 py-0.5 text-[10px] font-bold text-purple-700">
              Auto-run
            </span>
          </div>
          <div className="space-y-2 text-[12px] leading-relaxed text-purple-900">
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-check text-success mt-0.5"></i>
              <span>Logic Mutex Lock/Unlock chính xác, không có Race Condition.</span>
            </div>
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-check text-success mt-0.5"></i>
              <span>Vượt qua 5/5 Edge Cases (Bao gồm test Multi-goroutines).</span>
            </div>
            <div className="flex items-start gap-2">
              <i className="fa-solid fa-triangle-exclamation text-warning mt-0.5"></i>
              <span>
                <strong>Đề xuất:</strong> Thuật toán cập nhật `lastRefill` chạy đúng nhưng hơi khó
                bảo trì.
              </span>
            </div>
          </div>
        </div>

        {/* Rubrics */}
        <div>
          <h3 className="mb-3 text-[12px] font-bold tracking-wider text-slate-800 uppercase">
            Tiêu chí đánh giá (Rubric)
          </h3>
          <div className="space-y-4">
            {/* Tiêu chí 1 */}
            <div>
              <div className="mb-2 flex justify-between text-[12px] font-medium text-slate-700">
                <span>Tính chính xác (Logic)</span>
                <span className="text-primary font-bold">{rubric1}/5</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <div key={`r1-${score}`} className="relative flex-1">
                    <input
                      type="radio"
                      name="r1"
                      id={`r1-${score}`}
                      className="peer absolute h-full w-full cursor-pointer opacity-0"
                      checked={rubric1 === score}
                      onChange={() => setRubric1(score)}
                    />
                    <label
                      htmlFor={`r1-${score}`}
                      className="peer-checked:border-primary peer-checked:text-primary block w-full rounded border border-slate-200 bg-slate-50 py-1 text-center text-[11px] text-slate-500 transition-colors peer-checked:bg-[#e6f7ff] peer-checked:font-bold peer-hover:bg-slate-100"
                    >
                      {score}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tiêu chí 2 */}
            <div>
              <div className="mb-2 flex justify-between text-[12px] font-medium text-slate-700">
                <span>Hiệu năng (Performance)</span>
                <span className="text-primary font-bold">{rubric2}/5</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <div key={`r2-${score}`} className="relative flex-1">
                    <input
                      type="radio"
                      name="r2"
                      id={`r2-${score}`}
                      className="peer absolute h-full w-full cursor-pointer opacity-0"
                      checked={rubric2 === score}
                      onChange={() => setRubric2(score)}
                    />
                    <label
                      htmlFor={`r2-${score}`}
                      className="peer-checked:border-primary peer-checked:text-primary block w-full rounded border border-slate-200 bg-slate-50 py-1 text-center text-[11px] text-slate-500 transition-colors peer-checked:bg-[#e6f7ff] peer-checked:font-bold peer-hover:bg-slate-100"
                    >
                      {score}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Tiêu chí 3 */}
            <div>
              <div className="mb-2 flex justify-between text-[12px] font-medium text-slate-700">
                <span>Clean Code / Naming</span>
                <span className="text-primary font-bold">{rubric3}/5</span>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((score) => (
                  <div key={`r3-${score}`} className="relative flex-1">
                    <input
                      type="radio"
                      name="r3"
                      id={`r3-${score}`}
                      className="peer absolute h-full w-full cursor-pointer opacity-0"
                      checked={rubric3 === score}
                      onChange={() => setRubric3(score)}
                    />
                    <label
                      htmlFor={`r3-${score}`}
                      className="peer-checked:border-primary peer-checked:text-primary block w-full rounded border border-slate-200 bg-slate-50 py-1 text-center text-[11px] text-slate-500 transition-colors peer-checked:bg-[#e6f7ff] peer-checked:font-bold peer-hover:bg-slate-100"
                    >
                      {score}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <hr className="border-slate-100" />

        {/* Comment Box */}
        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="text-[12px] font-bold tracking-wider text-slate-800 uppercase">
              Nhận xét tổng quan
            </label>
            <button className="rounded bg-purple-50 px-2 py-0.5 text-[10px] font-medium text-purple-600 transition-colors hover:bg-purple-100">
              <i className="fa-solid fa-wand-magic-sparkles"></i> Dùng AI viết nháp
            </button>
          </div>
          <div className="focus-within:border-primary focus-within:ring-primary overflow-hidden rounded-md border border-slate-200 bg-white transition-all focus-within:ring-1">
            <div className="flex gap-3 border-b border-slate-200 bg-slate-50 px-3 py-1.5 text-[11px] text-slate-500">
              <button className="hover:text-slate-800">
                <i className="fa-solid fa-bold"></i>
              </button>
              <button className="hover:text-slate-800">
                <i className="fa-solid fa-italic"></i>
              </button>
              <button className="hover:text-slate-800">
                <i className="fa-solid fa-list-ul"></i>
              </button>
            </div>
            <textarea
              className="h-32 w-full resize-none p-3 text-[13px] text-slate-700 outline-none"
              placeholder="Viết nhận xét của bạn..."
            ></textarea>
          </div>
        </div>
      </div>

      <div className="flex flex-shrink-0 flex-col gap-3 border-t border-slate-200 bg-white p-5">
        <div className="mb-2 flex items-center justify-between text-[13px]">
          <span className="font-bold text-slate-700">Điểm tổng kết:</span>
          <span className="text-success text-lg font-bold">
            {totalScore}
            <span className="text-xs text-slate-400">/100</span>
          </span>
        </div>

        <div className="flex gap-3">
          <button className="border-danger text-danger flex-1 rounded-md border bg-white py-2.5 text-[13px] font-bold transition-colors hover:bg-red-50">
            Yêu cầu sửa
          </button>
          <button
            onClick={() => onSubmitReview('approve')}
            disabled={isSubmitting}
            className={`flex flex-1 items-center justify-center gap-2 rounded-md py-2.5 text-[13px] font-bold text-white transition-all ${isSubmitting ? 'bg-green-700 opacity-70' : 'bg-success shadow-md shadow-green-500/20 hover:bg-green-700'}`}
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Đang lưu...
              </>
            ) : (
              <>
                <i className="fa-solid fa-check"></i> Chấp nhận (Pass)
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
