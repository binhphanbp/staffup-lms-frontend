'use client';

import React, { useState } from 'react';
import Link from 'next/link';

export const ForbiddenMessage = () => {
  const [isRequesting, setIsRequesting] = useState(false);
  const [isRequested, setIsRequested] = useState(false);

  const handleRequestAccess = () => {
    setIsRequesting(true);
    setTimeout(() => {
      setIsRequesting(false);
      setIsRequested(true);
    }, 1200);
  };

  return (
    <div className="order-2 flex w-full flex-col items-center text-center lg:order-1 lg:w-1/2 lg:items-start lg:text-left">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-bold tracking-widest text-red-600 uppercase shadow-sm">
        <i className="fa-solid fa-ban"></i>
        Khu vực hạn chế
      </div>

      <h1 className="text-403 mb-2 font-sans">403</h1>

      <h2 className="mb-4 text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
        Quyền truy cập bị từ chối.
      </h2>

      <div className="mb-8 w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 text-left text-sm leading-relaxed text-slate-600 shadow-sm">
        Hệ thống xác nhận tài khoản của bạn đang có quyền{' '}
        <strong className="text-slate-800">Học viên (Learner)</strong>. <br />
        Trang này yêu cầu phân quyền{' '}
        <strong className="text-[#1677ff]">Giảng viên (Instructor)</strong> hoặc{' '}
        <strong className="text-[#1677ff]">Admin</strong> để tiếp tục.
      </div>

      <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
        <button
          onClick={handleRequestAccess}
          disabled={isRequesting || isRequested}
          className={`flex transform items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-all active:scale-95 ${
            isRequested
              ? 'cursor-not-allowed border border-slate-300 bg-slate-200 text-slate-500'
              : 'bg-[#ff4d4f] text-white shadow-lg shadow-red-500/30 hover:-translate-y-0.5 hover:bg-[#ff7875]'
          }`}
        >
          {isRequesting ? (
            <>
              <i className="fa-solid fa-spinner animate-spin"></i> Đang gửi yêu cầu...
            </>
          ) : isRequested ? (
            <>
              <i className="fa-solid fa-envelope-circle-check"></i> Đã gửi yêu cầu
            </>
          ) : (
            <>
              <i className="fa-solid fa-key"></i> Yêu cầu cấp quyền
            </>
          )}
        </button>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-bold text-slate-600 transition-all hover:border-slate-400 hover:bg-slate-50 active:scale-95"
        >
          <i className="fa-solid fa-arrow-left"></i> Về trang chủ
        </Link>
      </div>

      {isRequested && (
        <div className="mt-4 flex animate-[pulse_2s_ease-in-out_infinite] items-center gap-2 text-sm font-medium text-green-600">
          <i className="fa-solid fa-circle-check"></i> Đã gửi yêu cầu cấp quyền tới Admin hệ thống.
        </div>
      )}
    </div>
  );
};
