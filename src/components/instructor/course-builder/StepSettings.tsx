import React from 'react';

export const StepSettings = ({ isActive }: { isActive: boolean }) => {
  return (
    <div
      className={`custom-scrollbar h-full overflow-y-auto p-6 ${isActive ? 'block animate-[fadeIn_0.3s_ease-out]' : 'hidden'}`}
    >
      <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-800 bg-slate-900 px-6 py-4">
          <h2 className="flex items-center gap-2 text-base font-bold text-white">
            <i className="fa-solid fa-sliders"></i> Cài đặt quy chế khóa học
          </h2>
        </div>
        <div className="space-y-6 divide-y divide-slate-100 p-6">
          <div className="flex items-start justify-between pb-6">
            <div className="pr-4">
              <h4 className="mb-1 text-[13px] font-bold text-slate-800">
                Khóa học Bắt buộc (Mandatory)
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Nếu bật, khóa học này sẽ tự động gán vào lộ trình học tập của toàn bộ nhân viên.
              </p>
            </div>
            {/* Custom Tailwind Toggle */}
            <div className="relative mt-1 mr-2 inline-block w-10 flex-shrink-0 align-middle transition duration-200 ease-in select-none">
              <input
                type="checkbox"
                name="toggle1"
                id="toggle1"
                className="peer checked:border-success absolute z-10 block h-5 w-5 cursor-pointer appearance-none rounded-full border-4 border-slate-300 bg-white transition-all duration-300 checked:right-0"
              />
              <label
                htmlFor="toggle1"
                className="peer-checked:bg-success block h-5 cursor-pointer overflow-hidden rounded-full bg-slate-300 transition-colors duration-300"
              ></label>
            </div>
          </div>

          <div className="flex items-start justify-between py-6">
            <div className="pr-4">
              <h4 className="mb-1 text-[13px] font-bold text-slate-800">
                Cấp Chứng chỉ hoàn thành
              </h4>
              <p className="text-[11px] leading-relaxed text-slate-500">
                Học viên sẽ nhận được Certificate ID sau khi đạt 100% tiến độ.
              </p>
            </div>
            {/* Custom Tailwind Toggle */}
            <div className="relative mt-1 mr-2 inline-block w-10 flex-shrink-0 align-middle transition duration-200 ease-in select-none">
              <input
                type="checkbox"
                name="toggle2"
                id="toggle2"
                defaultChecked
                className="peer checked:border-success absolute z-10 block h-5 w-5 cursor-pointer appearance-none rounded-full border-4 border-slate-300 bg-white transition-all duration-300 checked:right-0"
              />
              <label
                htmlFor="toggle2"
                className="peer-checked:bg-success block h-5 cursor-pointer overflow-hidden rounded-full bg-slate-300 transition-colors duration-300"
              ></label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
