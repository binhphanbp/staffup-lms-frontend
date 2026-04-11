/* eslint-disable @next/next/no-img-element */
import React from 'react';
import Link from 'next/link';

// NOTE: This component uses mock data as the backend doesn't provide
// AI-based course recommendations yet. When the API endpoint is available,
// update this component to fetch from the API.

interface Course {
  id: string;
  title: string;
  thumbnail?: string;
  instructor?: string;
  duration?: string;
  level?: string;
  reason?: string;
}

interface RecommendedCoursesProps {
  courses?: Course[];
}

export const RecommendedCourses = ({ courses }: RecommendedCoursesProps) => {
  // Using mock data until backend provides recommendation API
  const mockCourses: Course[] = [
    {
      id: '1',
      title: 'Bảo mật Web & Phòng chống tấn công',
      thumbnail: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
      instructor: 'Nguyễn Văn A',
      duration: '8h 30m',
      level: 'Intermediate',
      reason: 'Lấp đầy khoảng trống kỹ năng Security',
    },
    {
      id: '2',
      title: 'Advanced React Patterns',
      thumbnail: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
      instructor: 'Trần Thị B',
      duration: '12h',
      level: 'Advanced',
      reason: 'Phù hợp với lộ trình Frontend Developer',
    },
  ];

  const displayCourses = courses || mockCourses;

  return (
    <div className="card overflow-hidden border-purple-200">
      <div className="flex items-center justify-between border-b border-purple-100 bg-linear-to-r from-purple-50 to-white px-5 py-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-purple-800">
          <i className="fa-solid fa-wand-magic-sparkles"></i> AI Đề xuất khóa học
        </h3>
        <Link href="/courses" className="text-xs font-semibold text-purple-600 hover:underline">
          Xem thêm
        </Link>
      </div>

      <div className="divide-y divide-gray-100">
        {displayCourses.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-400">
            Chưa có đề xuất nào cho bạn
          </div>
        ) : (
          displayCourses.map((course) => (
            <Link
              key={course.id}
              href={`/courses/detail?id=${course.id}`}
              className="group block p-4 transition-colors hover:bg-slate-50"
            >
              <div className="mb-2 flex gap-3">
                {course.thumbnail && (
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-md bg-slate-100">
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="group-hover:text-primary mb-1 text-[13px] font-bold leading-tight text-slate-800 transition-colors">
                    {course.title}
                  </div>
                  {course.instructor && (
                    <div className="text-[11px] text-slate-500">{course.instructor}</div>
                  )}
                </div>
              </div>

              {course.reason && (
                <div className="mb-2 text-[11px] italic text-slate-500">
                  <i className="fa-solid fa-lightbulb mr-1 text-yellow-500"></i>
                  {course.reason}
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] text-slate-400">
                  {course.duration && (
                    <span className="flex items-center gap-1">
                      <i className="fa-regular fa-clock"></i>
                      {course.duration}
                    </span>
                  )}
                  {course.level && (
                    <span className="rounded bg-slate-100 px-1.5 py-0.5 font-semibold">
                      {course.level}
                    </span>
                  )}
                </div>
                <button className="text-primary border-primary hover:bg-primary rounded border px-2 py-1 text-[10px] font-bold transition-colors hover:text-white">
                  Đăng ký
                </button>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
