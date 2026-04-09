/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

export const CourseSidebar = () => {
  return (
    <div className="relative w-full flex-shrink-0 lg:w-[320px] xl:w-[350px]">
      <div className="sticky top-6 flex flex-col gap-6">
        {/* Course Progress & Actions */}
        <div className="card border-t-primary border-t-4 p-6 shadow-lg shadow-slate-200/50">
          <div className="mb-5">
            <div className="mb-2 flex items-center justify-between text-[12px] font-bold text-slate-700">
              <span>Tiến độ học tập</span>
              <span className="text-primary">12%</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="bg-primary h-full w-[12%] rounded-full"></div>
            </div>
            <p className="mt-2 text-center text-[11px] text-slate-400">
              Hoàn thành bài tiếp theo để đạt mốc 15%
            </p>
          </div>

          <Link
            href="/courses/detail/learning-room"
            className="bg-primary hover:bg-primary-hover mb-4 flex w-full items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-bold text-white shadow-md shadow-blue-500/20 transition-transform active:scale-95"
          >
            <i className="fa-solid fa-play"></i> Tiếp tục học
          </Link>

          <div className="space-y-3.5 text-[13px] text-slate-600">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-regular fa-clock w-4 text-center text-slate-400"></i> Thời lượng
              </div>
              <span className="font-medium text-slate-800">24h 30m</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-layer-group w-4 text-center text-slate-400"></i> Số bài
                học
              </div>
              <span className="font-medium text-slate-800">48 bài</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-code w-4 text-center text-slate-400"></i> Code Lab
              </div>
              <span className="font-medium text-slate-800">12 Lab thực hành</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-award w-4 text-center text-slate-400"></i> Chứng nhận
              </div>
              <span className="font-medium text-slate-800">Cấp nội bộ (Level UP)</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <i className="fa-solid fa-mobile-screen-button w-4 text-center text-slate-400"></i>{' '}
                Truy cập
              </div>
              <span className="font-medium text-slate-800">Mobile & Web</span>
            </div>
          </div>

          <div className="my-5 h-px w-full bg-gray-100"></div>

          <button className="flex w-full items-center justify-center gap-2 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:text-slate-800">
            <i className="fa-solid fa-share-nodes"></i> Chia sẻ khóa học
          </button>
        </div>

        {/* Related Courses */}
        <div className="card border border-gray-200 p-5">
          <h3 className="mb-3 text-[13px] font-bold text-slate-800">Khóa học thường học cùng</h3>
          <Link href="#" className="group flex gap-3">
            <img
              src="https://images.unsplash.com/photo-1605745341112-85968b19335b?auto=format&fit=crop&w=150&q=80"
              className="h-12 w-16 rounded object-cover"
              alt="Related Course"
            />
            <div>
              <div className="group-hover:text-primary mb-1 line-clamp-2 text-[12px] leading-tight font-bold text-slate-700">
                Docker & Kubernetes cho Backend Developer
              </div>
              <div className="text-[10px] text-slate-400">
                <i className="fa-solid fa-star text-yellow-400"></i> 4.9 • Tuấn Anh
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};
