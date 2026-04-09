import React from 'react';

export const StepCurriculum = ({ isActive }: { isActive: boolean }) => {
  const inputClass =
    'w-full px-3 py-2 text-[13px] bg-white border border-slate-200 rounded-md outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20';

  return (
    <div
      className={`h-full overflow-hidden ${isActive ? 'flex animate-[fadeIn_0.3s_ease-out]' : 'hidden'}`}
    >
      <div className="flex h-full w-full">
        {/* Cột trái (Structure) */}
        <div className="z-10 flex h-full w-[40%] flex-col border-r border-slate-200 bg-white shadow-[2px_0_10px_rgba(0,0,0,0.02)]">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-100 bg-slate-50 p-4">
            <h3 className="text-[14px] font-bold text-slate-800">Cấu trúc bài học</h3>
            <button className="text-primary text-[12px] font-bold hover:underline">
              <i className="fa-solid fa-plus"></i> Thêm Phần mới
            </button>
          </div>
          <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto p-4">
            <div>
              <div className="group flex items-center justify-between rounded-t-md border border-slate-800 bg-slate-800 p-2 text-white">
                <div className="flex items-center gap-2">
                  <i className="fa-solid fa-grip-vertical cursor-grab text-[10px] text-slate-500 hover:text-slate-300"></i>
                  <span className="text-[12px] font-bold">Phần 1: GoLang Basics</span>
                </div>
                <div className="flex gap-2 text-[10px] opacity-0 transition-opacity group-hover:opacity-100">
                  <button className="hover:text-primary">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="hover:text-danger">
                    <i className="fa-solid fa-trash"></i>
                  </button>
                </div>
              </div>
              <div className="rounded-b-md border border-t-0 border-slate-200 bg-white">
                <div className="border-l-primary flex cursor-pointer items-center justify-between border-b border-l-[3px] border-slate-100 bg-slate-50 p-3 transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-grip-vertical cursor-grab text-[10px] text-slate-300 hover:text-slate-500"></i>
                    <div className="text-primary flex h-6 w-6 items-center justify-center rounded bg-blue-50 text-[10px]">
                      <i className="fa-solid fa-video"></i>
                    </div>
                    <div className="text-[12px] font-semibold text-slate-800">
                      1. Cài đặt môi trường
                    </div>
                  </div>
                  <span className="rounded bg-slate-100 px-1.5 font-mono text-[10px] text-slate-400">
                    12:00
                  </span>
                </div>
                <div className="flex cursor-pointer items-center justify-between border-b border-l-[3px] border-slate-100 border-l-transparent p-3 transition-shadow hover:bg-slate-50 hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <i className="fa-solid fa-grip-vertical cursor-grab text-[10px] text-slate-300 hover:text-slate-500"></i>
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-purple-50 text-[10px] text-purple-500">
                      <i className="fa-solid fa-code"></i>
                    </div>
                    <div className="text-[12px] font-medium text-slate-600">
                      2. Lab: Hello World &amp; Variables
                    </div>
                  </div>
                  <span className="rounded bg-purple-100 px-1.5 text-[10px] font-bold text-purple-500">
                    Code
                  </span>
                </div>
                <div className="rounded-b-md bg-slate-50 p-2 text-center">
                  <button className="hover:text-primary hover:border-primary w-full rounded border border-dashed border-slate-300 bg-white py-1.5 text-[11px] font-semibold text-slate-500 transition-colors">
                    <i className="fa-solid fa-plus text-[10px]"></i> Thêm bài học mới
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải (Edit Lesson) */}
        <div className="relative flex h-full flex-1 flex-col bg-[#f8fafc]">
          <div className="flex flex-shrink-0 items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
            <div>
              <div className="text-primary mb-1 text-[10px] font-bold tracking-widest uppercase">
                Đang chỉnh sửa bài học
              </div>
              <input
                type="text"
                className="w-full border-none bg-transparent text-lg font-bold text-slate-800 placeholder-slate-300 outline-none"
                defaultValue="1. Cài đặt môi trường"
              />
            </div>
            <button className="hover:text-danger text-slate-400" title="Xóa bài học">
              <i className="fa-regular fa-trash-can"></i>
            </button>
          </div>
          <div className="custom-scrollbar flex-1 overflow-y-auto p-8">
            <div className="max-w-2xl">
              <div className="mb-6 flex gap-2">
                <button className="text-primary border-primary flex items-center gap-2 rounded-md border bg-blue-50 px-4 py-2 text-[12px] font-bold">
                  <i className="fa-solid fa-video"></i> Video Lecture
                </button>
                <button className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-4 py-2 text-[12px] font-semibold text-slate-500 transition-colors hover:bg-slate-50">
                  <i className="fa-solid fa-code"></i> Code Lab
                </button>
              </div>
              <div className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                  <label className="mb-1.5 block flex justify-between text-[12px] font-bold text-slate-700">
                    <span>Nguồn Video</span>
                    <span className="font-normal text-slate-400">Thời lượng: Tự động</span>
                  </label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <i className="fa-brands fa-youtube absolute top-1/2 left-3 -translate-y-1/2 text-sm text-red-500"></i>
                      <input
                        type="text"
                        className={`${inputClass} pl-9`}
                        placeholder="Dán link YouTube..."
                        defaultValue="https://youtube.com/watch?v=dQw4w9WgXcQ"
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-1.5 block text-[12px] font-bold text-slate-700">
                    Tài liệu đính kèm
                  </label>
                  <div className="hover:border-primary cursor-pointer rounded border border-dashed border-slate-300 bg-slate-50 p-4 text-center transition-colors hover:bg-blue-50/50">
                    <div className="text-[11px] text-slate-500">
                      <i className="fa-solid fa-paperclip mr-1"></i> Click để thêm Slide PDF, Source
                      Code
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
