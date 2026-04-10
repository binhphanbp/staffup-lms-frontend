import React from 'react';

interface QuestionPaletteProps {
  timeLeft: number;
  activeQuestion: number;
  setActiveQuestion: (q: number) => void;
  answeredQs: number[];
  reviewQs: number[];
  onShowSubmit: () => void;
  totalQuestions: number;
  totalSeconds: number;
}

export const QuestionPalette = ({
  timeLeft,
  activeQuestion,
  setActiveQuestion,
  answeredQs,
  reviewQs,
  onShowSubmit,
  totalQuestions,
  totalSeconds,
}: QuestionPaletteProps) => {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progressPercentage = (timeLeft / totalSeconds) * 100;
  const isWarningTime = timeLeft <= 300;

  // Hàm render grid câu hỏi dùng 100% Tailwind
  const renderQuestionGrid = () => {
    const buttons = [];
    for (let i = 1; i <= totalQuestions; i++) {
      const isActive = activeQuestion === i;
      const isAnswered = answeredQs.includes(i);
      const isReview = reviewQs.includes(i);

      // Màu sắc trạng thái mặc định (Chưa trả lời)
      let baseStyle =
        'bg-white text-slate-500 border-slate-200 hover:border-primary hover:text-primary';

      if (isAnswered && isReview) {
        // Vừa trả lời + Vừa đánh dấu xem lại (Gradient chéo)
        baseStyle =
          'bg-[linear-gradient(135deg,#1677ff_50%,#faad14_50%)] text-white border-transparent';
      } else if (isAnswered) {
        // Đã trả lời (Màu xanh dương)
        baseStyle = 'bg-primary text-white border-primary';
      } else if (isReview) {
        // Xem lại (Màu vàng)
        baseStyle = 'bg-warning text-white border-warning';
      }

      // Trạng thái Active (Đang chọn) sẽ có viền glow xanh
      const activeStyle = isActive
        ? 'ring-2 ring-primary ring-offset-2 border-transparent'
        : 'border';

      buttons.push(
        <button
          key={i}
          onClick={() => setActiveQuestion(i)}
          className={`flex aspect-square cursor-pointer items-center justify-center rounded-md text-[13px] font-semibold transition-all outline-none ${baseStyle} ${activeStyle}`}
        >
          {i}
        </button>,
      );
    }
    return buttons;
  };

  return (
    <div className="z-10 flex hidden h-full w-80 flex-shrink-0 flex-col border-l border-gray-200 bg-[#f8fafc] shadow-[-4px_0_15px_rgba(0,0,0,0.02)] md:flex">
      {/* Đồng hồ */}
      <div className="flex flex-shrink-0 flex-col items-center justify-center border-b border-gray-200 bg-white p-6">
        <div className="mb-1 flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          <i className="fa-regular fa-clock"></i> Thời gian còn lại
        </div>
        <div
          className={`flex items-center gap-1 font-mono text-4xl font-bold tracking-tight ${isWarningTime ? 'text-danger animate-pulse-fast' : 'text-slate-800'}`}
        >
          <span>{minutes < 10 ? '0' + minutes : minutes}</span>
          <span className="pb-1 text-slate-400">:</span>
          <span>{seconds < 10 ? '0' + seconds : seconds}</span>
        </div>
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <div
            className={`h-full transition-all duration-1000 ${isWarningTime ? 'bg-danger' : 'bg-success'}`}
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>

      {/* Grid Câu hỏi (Đã sửa lại class grid) */}
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto p-6">
        <h3 className="mb-4 text-[13px] font-bold text-slate-800">
          Danh sách câu hỏi ({totalQuestions})
        </h3>

        {/* Dùng grid của Tailwind để chia 5 cột */}
        <div className="mb-8 grid grid-cols-5 gap-2">{renderQuestionGrid()}</div>

        {/* Chú giải trạng thái */}
        <div className="mt-auto rounded-lg border border-gray-200 bg-white p-4">
          <div className="mb-3 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
            Chú giải trạng thái
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-3 text-[12px] font-medium text-slate-600">
            <div className="flex items-center gap-2">
              <div className="bg-primary border-primary h-4 w-4 rounded border"></div> Đã trả lời
            </div>
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 rounded border border-gray-300 bg-white"></div> Chưa trả lời
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-warning border-warning h-4 w-4 rounded border"></div> Xem lại
              (trống)
            </div>
            <div className="flex items-center gap-2">
              <div
                className="h-4 w-4 rounded border-none"
                style={{ background: 'linear-gradient(135deg, #1677ff 50%, #faad14 50%)' }}
              ></div>{' '}
              Đã làm & Xem
            </div>
          </div>
        </div>
      </div>

      {/* Nút Nộp bài */}
      <div className="flex-shrink-0 border-t border-gray-200 bg-white p-4">
        <button
          onClick={onShowSubmit}
          className="flex w-full transform items-center justify-center gap-2 rounded-lg bg-slate-800 py-3.5 font-bold text-white shadow-lg shadow-slate-900/20 transition-all hover:bg-black active:scale-[0.98]"
        >
          <i className="fa-solid fa-paper-plane text-xs"></i> Nộp bài & Kết thúc
        </button>
      </div>
    </div>
  );
};
