'use client';
import React, { useState } from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { Header } from '@/components/shared/Header';
import { FilterSidebar } from '@/components/course/FilterSidebar';
import { CourseSkeleton } from '@/components/course/CourseSkeleton';
import { CourseCard, type CourseType } from '@/components/course/CourseCard';
import { Pagination } from '@/components/shared/Pagination';

// DỮ LIỆU MÔ PHỎNG (Sau này sẽ gọi từ API)
const MOCK_COURSES: CourseType[] = [
  {
    id: 1,
    title: 'React 18 Performance Tuning & Best Practices',
    description:
      'Tối ưu hóa render, quản lý state diện rộng với Redux Toolkit, và các kỹ thuật lazy loading cho ứng dụng Enterprise.',
    imageUrl:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Middle',
    rating: 4.8,
    isMandatory: true,
    tags: [{ label: 'Frontend', colorClass: 'bg-blue-500' }],
    author: {
      name: 'Quang Huy',
      avatar: 'https://ui-avatars.com/api/?name=Quang+Huy&background=f1f5f9&color=475569',
    },
    duration: '12h 30m',
  },
  {
    id: 2,
    title: 'Docker & Kubernetes cho Backend Developer',
    description:
      'Cách đóng gói ứng dụng, viết Dockerfile tối ưu và triển khai lên cụm K8s nội bộ của công ty.',
    imageUrl:
      'https://images.unsplash.com/photo-1605745341112-85968b19335b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Junior',
    rating: 4.9,
    tags: [{ label: 'DevOps', colorClass: 'bg-orange-500' }],
    author: {
      name: 'Tuấn Anh',
      avatar: 'https://ui-avatars.com/api/?name=Tuan+Anh&background=f1f5f9&color=475569',
    },
    duration: '8h 15m',
  },
  {
    id: 3,
    title: 'Thực hành Python Data Processing (Pandas/Numpy)',
    description:
      'Khóa học 100% thực hành viết code trên trình duyệt. Có hệ thống AI chấm điểm tự động ngay lập tức.',
    level: 'Fresher',
    isNew: true,
    isCodeLab: true,
    tags: [{ label: 'Code Lab', colorClass: 'bg-purple-600' }],
  },
  {
    id: 4,
    title: 'Microservices Architecture với Node.js & RabbitMQ',
    description:
      'Chia tách hệ thống Monolithic thành Microservices. Xử lý message queue và Event-driven architecture.',
    imageUrl:
      'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'Senior',
    rating: 4.7,
    progress: 45,
    timeRemaining: '4h 10m',
    tags: [{ label: 'Backend', colorClass: 'bg-green-600' }],
  },
  {
    id: 5,
    title: 'Bảo mật thông tin & Quy tắc OWASP Top 10',
    description:
      'Khóa học bắt buộc hàng năm cho toàn bộ Developer để chống lại các lỗ hổng Injection, XSS...',
    imageUrl:
      'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    level: 'All Levels',
    rating: 5.0,
    isCompleted: true,
    tags: [{ label: 'Security', colorClass: 'bg-red-500' }],
  },
];

export default function CourseCatalog() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const toggleFilter = () => setIsFilterOpen(!isFilterOpen);

  const triggerFilterLoading = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 800);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar />

      <main className="relative flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-[#f0f2f5]">
        {/* Truyền mảng đường dẫn vào Header */}
        <Header breadcrumbs={[{ label: 'Trang chủ', href: '/' }, { label: 'Thư viện Khóa học' }]} />

        <div className="relative flex flex-1 overflow-hidden">
          <FilterSidebar
            isOpen={isFilterOpen}
            onReset={triggerFilterLoading}
            onFilterChange={triggerFilterLoading}
          />

          <div className="custom-scrollbar relative flex h-full flex-1 flex-col overflow-y-auto scroll-smooth p-6 lg:p-8">
            {/* Thanh công cụ Bộ lọc (Rút gọn để dễ nhìn) */}
            <div className="sticky top-0 z-20 mb-6 flex flex-col items-center justify-between gap-4 rounded-lg border border-gray-200 bg-white p-3 shadow-sm sm:flex-row">
              <div className="flex items-center gap-4">
                <button
                  onClick={toggleFilter}
                  className={`flex items-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-all ${isFilterOpen ? 'bg-primary-bg text-primary border-primary' : 'border-gray-300 bg-white text-slate-700'}`}
                >
                  <i className="fa-solid fa-sliders"></i>{' '}
                  <span>{isFilterOpen ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}</span>
                </button>
                <h1 className="text-sm font-medium text-slate-600">
                  Tìm thấy <span className="font-bold text-slate-900">{MOCK_COURSES.length}</span>{' '}
                  khóa học
                </h1>
              </div>
            </div>

            {/* GRID HIỂN THỊ KHÓA HỌC: Chỉ với 1 hàm map thay vì hàng trăm dòng HTML */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {isLoading
                ? Array.from({ length: 5 }).map((_, idx) => <CourseSkeleton key={idx} />)
                : MOCK_COURSES.map((course) => <CourseCard key={course.id} course={course} />)}
            </div>
            {/* Gọi Component Phân trang */}
            <Pagination currentPage={1} totalPages={12} totalItems={124} itemsPerPage={5} />
          </div>
        </div>
      </main>
    </div>
  );
}
