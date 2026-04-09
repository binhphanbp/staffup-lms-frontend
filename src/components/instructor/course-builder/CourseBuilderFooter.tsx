import React from 'react';

interface CourseBuilderFooterProps {
  currentStep: number;
  totalSteps: number;
  isSubmitting: boolean;
  onPrevStep: () => void;
  onNextStep: () => void;
}

export const CourseBuilderFooter = ({
  currentStep,
  totalSteps,
  isSubmitting,
  onPrevStep,
  onNextStep,
}: CourseBuilderFooterProps) => {
  return (
    <div className="z-20 flex flex-shrink-0 items-center justify-between border-t border-slate-200 bg-white p-4 shadow-[0_-4px_10px_rgba(0,0,0,0.02)]">
      <button
        onClick={onPrevStep}
        className={`rounded-md border border-slate-300 px-5 py-2 text-[13px] font-bold text-slate-600 transition-colors hover:bg-slate-50 ${currentStep === 1 ? 'invisible' : ''}`}
      >
        Quay lại
      </button>
      <div className="flex gap-3">
        <button className="rounded-md border border-transparent px-5 py-2 text-[13px] font-bold text-slate-500 transition-colors hover:text-slate-800">
          Lưu nháp
        </button>
        <button
          onClick={onNextStep}
          disabled={isSubmitting}
          className={`flex items-center gap-2 rounded-md px-6 py-2 text-[13px] font-bold transition-colors ${currentStep === totalSteps ? 'bg-success text-white shadow-md shadow-green-500/20 hover:bg-green-600' : 'bg-primary hover:bg-primary-hover text-white shadow-md shadow-blue-500/20'}`}
        >
          {isSubmitting ? (
            <>
              <i className="fa-solid fa-spinner fa-spin"></i> Đang xử lý...
            </>
          ) : currentStep === totalSteps ? (
            <>
              <i className="fa-solid fa-rocket"></i> Xuất bản khóa học
            </>
          ) : (
            <>
              Tiếp tục <i className="fa-solid fa-arrow-right"></i>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
