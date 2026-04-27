/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';
import { resolveMediaUrl } from '@/lib/media';

// Định nghĩa khung dữ liệu chuẩn cho 1 khóa học
export interface CourseType {
  id: string | number;
  title: string;
  description: string;
  imageUrl?: string;
  level: string;
  rating?: number;
  isNew?: boolean;
  tags: { label: string; colorClass: string }[];
  isMandatory?: boolean;
  author?: { name: string; avatar: string };
  duration?: string;
  // Các trạng thái đặc biệt
  isCodeLab?: boolean;
  progress?: number;
  timeRemaining?: string;
  isCompleted?: boolean;
}

export const CourseCard = ({ course }: { course: CourseType }) => {
  const imageUrl =
    resolveMediaUrl(course.imageUrl) ??
    'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80';

  return (
    <Link
      href={`/courses/detail?id=${course.id}`}
      className={`card course-card group flex h-full flex-col transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg motion-reduce:hover:translate-y-0 motion-reduce:hover:shadow-none ${course.isCodeLab ? 'border-2 border-purple-100' : ''} ${course.isCompleted ? 'opacity-80 hover:opacity-100' : ''}`}
    >
      {/* PHẦN 1: HÌNH ẢNH BANNER */}
      <div
        className={`relative h-40 shrink-0 overflow-hidden rounded-t-xl ${course.isCodeLab ? 'flex items-center justify-center border-b border-slate-700 bg-slate-900 p-6 text-center font-mono text-[10px] text-white' : 'bg-slate-100'}`}
      >
        {/* Nếu là Code Lab thì hiện Terminal, ngược lại hiện Ảnh */}
        {course.isCodeLab ? (
          <div>
            <i className="fa-brands fa-python mb-2 text-3xl text-blue-400"></i>
            <br />
            <span className="text-purple-400">def</span>{' '}
            <span className="text-blue-300">optimize_data</span>(df):
            <br />
            &nbsp;&nbsp;<span className="text-slate-400"># Start lab...</span>
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={course.title}
            className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-105 ${course.isCompleted ? 'grayscale-30 filter' : ''}`}
          />
        )}

        {/* Các nhãn (Tags) */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {course.tags.map((tag, idx) => (
            <span
              key={idx}
              className={`${tag.colorClass} rounded px-2 py-0.5 text-[10px] font-bold text-white shadow-sm ${course.isCodeLab ? 'flex items-center gap-1' : ''}`}
            >
              {course.isCodeLab && <i className="fa-solid fa-terminal"></i>} {tag.label}
            </span>
          ))}
          {course.isMandatory && (
            <span className="w-fit rounded bg-black/60 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
              Bắt buộc
            </span>
          )}
        </div>

        {/* Icon Tạm dừng (Đang học) */}
        {course.progress !== undefined && !course.isCompleted && (
          <div className="absolute top-3 right-3">
            <div
              className="text-primary flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-lg"
              title="Đang học"
            >
              <i className="fa-solid fa-pause text-[10px]"></i>
            </div>
          </div>
        )}

        {/* Overlay Đã hoàn thành */}
        {course.isCompleted && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-[2px]">
            <div className="bg-success flex -rotate-12 transform items-center gap-1.5 rounded border border-white px-3 py-1.5 text-[11px] font-bold text-white shadow-lg">
              <i className="fa-solid fa-circle-check"></i> Đã hoàn thành
            </div>
          </div>
        )}
      </div>

      {/* PHẦN 2: THÔNG TIN KHÓA HỌC */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>Level: {course.level}</span>
          {course.rating ? (
            <span className="flex items-center gap-1 font-sans font-bold text-yellow-500">
              <i className="fa-solid fa-star"></i> {course.rating}
            </span>
          ) : course.isNew ? (
            <span className="flex items-center gap-1 font-sans font-medium text-slate-400">
              Mới
            </span>
          ) : null}
        </div>

        <h3 className="group-hover:text-primary mb-2 text-[14px] leading-snug font-bold text-slate-800 transition-colors">
          {course.title}
        </h3>
        <p className="mb-4 line-clamp-2 text-[12px] text-slate-500">{course.description}</p>

        <div className="mt-auto"></div>

        {/* PHẦN 3: FOOTER DỰA THEO TRẠNG THÁI */}
        {course.isCodeLab ? (
          <button className="mt-2 flex w-full items-center justify-center gap-2 rounded border border-purple-200 bg-purple-50 py-2 text-[11px] font-bold text-purple-700 transition-colors hover:bg-purple-100">
            <i className="fa-solid fa-code"></i> Vào môi trường Code
          </button>
        ) : course.isCompleted ? (
          <>
            <div className="my-3 h-px w-full bg-gray-100"></div>
            <button className="hover:text-primary w-full text-center text-[11px] font-semibold text-slate-500 transition-colors">
              <i className="fa-solid fa-rotate-right mr-1"></i> Học lại khóa này
            </button>
          </>
        ) : course.progress !== undefined ? (
          <>
            <div className="mt-2 mb-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="bg-primary h-full rounded-full"
                style={{ width: `${course.progress}%` }}
              ></div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-primary text-[11px] font-bold">Tiếp tục Bài học</div>
              <div className="text-[11px] text-slate-400">Còn {course.timeRemaining}</div>
            </div>
          </>
        ) : (
          <>
            <div className="my-3 h-px w-full bg-gray-100"></div>
            <div className="flex items-center justify-between">
              {course.author && (
                <div className="flex items-center gap-2">
                  <img
                    src={course.author.avatar}
                    className="h-6 w-6 rounded-full border border-gray-200"
                    alt="Author"
                  />
                  <div className="max-w-25 truncate text-[11px] font-medium text-slate-600">
                    {course.author.name}
                  </div>
                </div>
              )}
              {course.duration && (
                <div className="flex items-center gap-1 text-[11px] text-slate-400">
                  <i className="fa-regular fa-clock"></i> {course.duration}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Link>
  );
};
