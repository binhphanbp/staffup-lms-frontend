'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export const NotFoundMessage = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(15);

  useEffect(() => {
    if (timeLeft <= 0) {
      router.push('/');
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, router]);

  return (
    <div className="order-2 flex w-full flex-col items-center text-center lg:order-1 lg:w-1/2 lg:items-start lg:text-left">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600">
        <i className="fa-solid fa-link-slash"></i>
        Broken Link / Route Not Found
      </div>

      <h1 className="text-404 mb-2 font-sans">404</h1>

      <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        Oops! Lạc vào vùng không gian mạng.
      </h2>

      <p className="mb-8 max-w-md text-base leading-relaxed text-slate-500">
        Có vẻ như khóa học bạn đang tìm kiếm đã bị di chuyển, đổi tên, hoặc có thể route này chưa
        được deploy lên môi trường Production.
      </p>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <Link
          href="/"
          className={`flex transform items-center justify-center gap-2 rounded-lg bg-[#1677ff] px-6 py-3 text-sm font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#4096ff] active:scale-95 ${timeLeft <= 2 ? 'scale-105 ring-4 ring-blue-500/50' : 'shadow-lg shadow-blue-500/30'}`}
        >
          <i className="fa-solid fa-house"></i> Quay về Dashboard
        </Link>
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50 active:scale-95"
        >
          <i className="fa-solid fa-arrow-left-long"></i> Trở lại trang trước
        </button>
      </div>

      <div className="mt-8 flex items-center gap-2 text-xs font-medium text-slate-400">
        <i className="fa-solid fa-rotate animate-[spin_3s_linear_infinite]"></i>
        Tự động quay về trang chủ sau{' '}
        <span className="mx-1 text-sm font-bold text-[#1677ff]">{timeLeft}</span> giây...
      </div>
    </div>
  );
};
