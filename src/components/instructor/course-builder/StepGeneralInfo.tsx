import React from 'react';

export const StepGeneralInfo = ({ isActive }: { isActive: boolean }) => {
  const inputClass =
    'w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-md outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <div
      className={`custom-scrollbar h-full overflow-y-auto p-6 ${isActive ? 'block animate-[fadeIn_0.3s_ease-out]' : 'hidden'}`}
    >
      <div className="mx-auto max-w-3xl rounded-lg border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-6 border-b border-slate-100 pb-3 text-lg font-bold text-slate-800">
          Thông tin cơ bản của khóa học
        </h2>
        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-slate-700">
              Tên khóa học <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              defaultValue="GoLang Concurrency & Microservices"
              placeholder="Vd: System Design căn bản"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1.5 block text-[12px] font-bold text-slate-700">
                Lĩnh vực (Phòng ban) <span className="text-danger">*</span>
              </label>
              <select className={inputClass}>
                <option>Engineering (Backend)</option>
                <option>Data Science</option>
                <option>Infrastructure / DevOps</option>
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-[12px] font-bold text-slate-700">
                Mức độ <span className="text-danger">*</span>
              </label>
              <select className={inputClass} defaultValue="Junior">
                <option value="Fresher">Fresher / Intern</option>
                <option value="Junior">Junior</option>
                <option value="Middle">Middle</option>
                <option value="Senior">Senior / Tech Lead</option>
              </select>
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-slate-700">
              Từ khóa công nghệ (Tech Stack)
            </label>
            <div className="focus-within:border-primary focus-within:ring-primary/20 flex min-h-[42px] flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white p-2 transition-all focus-within:ring-2">
              <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">
                golang <i className="fa-solid fa-xmark hover:text-danger cursor-pointer"></i>
              </span>
              <span className="flex items-center gap-1 rounded bg-slate-100 px-2 py-1 font-mono text-[11px] text-slate-600">
                microservices <i className="fa-solid fa-xmark hover:text-danger cursor-pointer"></i>
              </span>
              <input
                type="text"
                className="w-24 border-none bg-transparent font-mono text-[12px] outline-none"
                placeholder="Gõ để thêm..."
              />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] font-bold text-slate-700">
              Ảnh bìa khóa học (Thumbnail)
            </label>
            <div className="hover:border-primary flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-slate-300 bg-slate-50 p-8 text-center transition-all hover:bg-blue-50/50">
              <div className="text-primary mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-50">
                <i className="fa-solid fa-cloud-arrow-up text-xl"></i>
              </div>
              <p className="mb-1 text-[13px] font-semibold text-slate-700">
                Kéo thả ảnh vào đây hoặc{' '}
                <span className="text-primary hover:underline">Tải lên từ máy</span>
              </p>
              <p className="text-[11px] text-slate-400">Định dạng hỗ trợ: JPG, PNG. Tỉ lệ 16:9.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
