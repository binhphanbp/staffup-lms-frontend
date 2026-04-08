import React from 'react';

interface CourseBuilderStepperProps {
  currentStep: number;
}

export const CourseBuilderStepper = ({ currentStep }: CourseBuilderStepperProps) => {
  return (
    <div className="z-10 flex flex-shrink-0 justify-center border-b border-slate-200 bg-white px-6 py-4 shadow-sm">
      <div className="flex w-full max-w-3xl items-center justify-between">
        {/* Step 1 */}
        <div
          className={`flex flex-col items-center ${currentStep >= 1 ? 'opacity-100' : 'opacity-50'}`}
        >
          <div
            className={`relative z-10 mb-1 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${currentStep === 1 ? 'border-primary bg-primary text-white' : currentStep > 1 ? 'border-primary text-primary bg-white' : 'border-slate-300 bg-white text-slate-400'}`}
          >
            {currentStep > 1 ? <i className="fa-solid fa-check"></i> : '1'}
          </div>
          <span
            className={`text-[11px] ${currentStep >= 1 ? 'font-bold text-slate-800' : 'font-semibold text-slate-500'}`}
          >
            Thông tin chung
          </span>
        </div>

        <div
          className={`mx-3 h-[2px] flex-1 transition-colors duration-300 ${currentStep > 1 ? 'bg-primary' : 'bg-slate-200'}`}
        ></div>

        {/* Step 2 */}
        <div
          className={`flex flex-col items-center ${currentStep >= 2 ? 'opacity-100' : 'opacity-50'}`}
        >
          <div
            className={`relative z-10 mb-1 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${currentStep === 2 ? 'border-primary bg-primary text-white' : currentStep > 2 ? 'border-primary text-primary bg-white' : 'border-slate-300 bg-white text-slate-400'}`}
          >
            {currentStep > 2 ? <i className="fa-solid fa-check"></i> : '2'}
          </div>
          <span
            className={`text-[11px] ${currentStep >= 2 ? 'font-bold text-slate-800' : 'font-semibold text-slate-500'}`}
          >
            Giáo trình
          </span>
        </div>

        <div
          className={`mx-3 h-[2px] flex-1 transition-colors duration-300 ${currentStep > 2 ? 'bg-primary' : 'bg-slate-200'}`}
        ></div>

        {/* Step 3 */}
        <div
          className={`flex flex-col items-center ${currentStep >= 3 ? 'opacity-100' : 'opacity-50'}`}
        >
          <div
            className={`relative z-10 mb-1 flex h-7 w-7 items-center justify-center rounded-full border-2 text-xs font-bold transition-all duration-300 ${currentStep === 3 ? 'border-primary bg-primary text-white' : 'border-slate-300 bg-white text-slate-400'}`}
          >
            3
          </div>
          <span
            className={`text-[11px] ${currentStep >= 3 ? 'font-bold text-slate-800' : 'font-semibold text-slate-500'}`}
          >
            Cài đặt & Xuất bản
          </span>
        </div>
      </div>
    </div>
  );
};
