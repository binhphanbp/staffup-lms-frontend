/* eslint-disable @next/next/no-img-element */
'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useMobileNav } from '@/context/MobileNavContext';
import { useAuthStore } from '@/store/useAuthStore';

export const StudentSidebar = () => {
  const pathname = usePathname();
  const { closeMobileNav } = useMobileNav();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const displayName = user?.fullName ?? 'Người dùng';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1677ff&color=fff&bold=true`;

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const learningMenus = [
    { name: 'Bảng điều khiển', href: '/', icon: 'fa-house' },
    { name: 'Khóa học của tôi', href: '/my-courses', icon: 'fa-graduation-cap' },
    { name: 'Thư viện Khóa học', href: '/courses', icon: 'fa-book-open' },
    { name: 'Lộ trình phát triển', href: '/roadmaps', icon: 'fa-route' },
  ];

  const achievementMenus = [
    { name: 'Chứng chỉ Nội bộ', href: '/certificates', icon: 'fa-award' },
  ];

  return (
    <aside className="z-20 flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white text-sm text-slate-700">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-slate-800">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded text-white shadow-sm">
            <i className="fa-solid fa-laptop-code text-xs"></i>
          </div>
          <span>
            Tech<span className="font-light text-slate-500">Learn</span>
          </span>
        </Link>
        {/* Mobile close button */}
        <button
          className="text-slate-500 hover:text-slate-800 lg:hidden"
          onClick={closeMobileNav}
          aria-label="Đóng menu"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      {/* Danh sách Menu */}
      <div className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
        {/* Nhóm: Học tập */}
        <div className="mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Học tập
        </div>
        {learningMenus.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isActive
                  ? 'bg-primary-bg text-primary font-bold'
                  : 'hover:text-primary font-medium text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`}></i> {item.name}
            </Link>
          );
        })}

        {/* Nhóm: Đánh giá & Thành tích */}
        <div className="mt-6 mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Đánh giá & Thành tích
        </div>
        {achievementMenus.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                isActive
                  ? 'bg-primary-bg text-primary font-bold'
                  : 'hover:text-primary font-medium text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fa-solid ${item.icon} w-5 text-center`}></i> {item.name}
            </Link>
          );
        })}
      </div>

      {/* User Profile */}
      <div className="border-t border-gray-100 bg-slate-50 p-4">
        <div className="flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-2 transition-colors hover:border-gray-200 hover:bg-white">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="h-9 w-9 rounded-md border border-gray-200 shadow-sm"
          />
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-bold text-slate-700">{displayName}</div>
            <div className="truncate font-mono text-[11px] tracking-tight text-slate-500">
              {user?.email ?? ''}
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-slate-400 hover:text-red-600 transition-colors"
            title="Đăng xuất"
          >
            <i className="fa-solid fa-right-from-bracket text-sm"></i>
          </button>
        </div>
      </div>
    </aside>
  );
};
