import React from 'react';

// --- SUBMIT MODAL ---
interface SubmitModalProps {
  show: boolean;
  onHide: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  answeredCount: number;
  reviewCount: number;
  totalQuestions: number;
}

export const SubmitModal = ({
  show,
  onHide,
  onSubmit,
  isSubmitting,
  answeredCount,
  reviewCount,
  totalQuestions,
}: SubmitModalProps) => {
  return (
    <div
      className={`modal-overlay fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${show ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <div
        className={`mx-4 w-full max-w-md transform overflow-hidden rounded-xl bg-white shadow-2xl transition-transform duration-300 ${show ? 'scale-100' : 'scale-95'}`}
      >
        <div className="p-6 pt-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-blue-100 bg-blue-50">
            <i className="fa-regular fa-paper-plane text-primary text-3xl"></i>
          </div>
          <h3 className="mb-2 text-xl font-bold text-slate-800">Xác nhận nộp bài?</h3>
          <p className="mb-6 text-sm text-slate-500">
            Bạn vẫn còn{' '}
            <strong className="text-danger">{totalQuestions - answeredCount} câu hỏi</strong> chưa
            trả lời và <strong className="text-warning">{reviewCount} câu</strong> đang đánh dấu xem
            lại. Sau khi nộp bài sẽ không thể sửa đổi.
          </p>

          <div className="mb-6 flex justify-around rounded-lg border border-gray-100 bg-slate-50 p-4">
            <div className="text-center">
              <div className="text-primary text-lg font-bold">{answeredCount}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Đã làm</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-danger text-lg font-bold">{totalQuestions - answeredCount}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Bỏ trống</div>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="text-center">
              <div className="text-warning text-lg font-bold">{reviewCount}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase">Xem lại</div>
            </div>
          </div>
        </div>
        <div className="flex justify-end gap-3 border-t border-gray-100 bg-gray-50 px-6 py-4">
          <button
            onClick={onHide}
            className="rounded-lg border border-gray-300 bg-white px-5 py-2 text-sm font-bold text-slate-600 transition-colors hover:bg-gray-100"
          >
            Tiếp tục làm bài
          </button>
          <button
            onClick={onSubmit}
            disabled={isSubmitting}
            className="bg-primary hover:bg-primary-hover flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-bold text-white shadow-md transition-colors"
          >
            {isSubmitting ? (
              <>
                <i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...
              </>
            ) : (
              'Nộp bài ngay'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- ANTI CHEAT MODAL ---
interface AntiCheatModalProps {
  show: boolean;
  onAcknowledge: () => void;
  cheatCount: number;
}

export const AntiCheatModal = ({ show, onAcknowledge, cheatCount }: AntiCheatModalProps) => {
  return (
    <div
      className={`modal-overlay fixed inset-0 z-[100] flex items-center justify-center ${show ? '' : 'hidden'}`}
    >
      <div className="border-danger mx-4 w-full max-w-sm animate-[bounce_1s_ease-in-out_2] overflow-hidden rounded-xl border-t-4 bg-white shadow-2xl">
        <div className="p-6 text-center">
          <i className="fa-solid fa-triangle-exclamation text-danger mb-4 text-4xl"></i>
          <h3 className="mb-2 text-lg font-bold text-slate-800">Cảnh báo Vi phạm Nội quy</h3>
          <p className="mb-4 text-[13px] text-slate-600">
            Hệ thống phát hiện bạn vừa rời khỏi cửa sổ làm bài. <br />
            <strong>
              Lần vi phạm: <span>{cheatCount}</span>/3
            </strong>
            .
          </p>
          <div className="text-danger mb-6 rounded bg-red-50 p-2 text-[11px]">
            Nếu vi phạm quá 3 lần, bài thi sẽ tự động bị hủy và đánh điểm 0.
          </div>
          <button
            onClick={onAcknowledge}
            className="w-full rounded-lg bg-slate-800 py-2.5 font-bold text-white transition-colors hover:bg-black"
          >
            Tôi đã hiểu và cam kết tuân thủ
          </button>
        </div>
      </div>
    </div>
  );
};
