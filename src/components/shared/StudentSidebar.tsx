/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useMobileNav } from '@/context/MobileNavContext';
import { useAuthStore } from '@/store/useAuthStore';
import { authService } from '@/services/auth.service';

export const StudentSidebar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { closeMobileNav } = useMobileNav();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const displayName = user?.fullName ?? 'Nguoi dung';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1677ff&color=fff&bold=true`;

  const learningMenus = [
    { name: 'Bảng điều khiển', href: '/', icon: 'fa-house' },
    { name: 'Thư viện Khoa học', href: '/courses', icon: 'fa-book-open' },
    { name: 'Lộ trình phát triển', href: '/path', icon: 'fa-route' },
    { name: 'Môi trường Thực hành', href: '/courses/detail/learning-room', icon: 'fa-code' },
  ];

  const achievementMenus = [
    { name: 'Bài Test năng lực', href: '/quiz-assessment', icon: 'fa-clipboard-check' },
    { name: 'Chứng chỉ Nội bộ', href: '/certificates', icon: 'fa-award' },
  ];

  const handleLogout = async () => {
    if (isLoggingOut) return;

    setIsLoggingOut(true);

    try {
      await authService.logout();
    } catch {
      // Still clear local auth state so the session is effectively closed on the client.
    } finally {
      logout();
      router.replace('/login');
      router.refresh();
      setIsLoggingOut(false);
    }
  };

  return (
    <aside className="z-20 flex h-screen w-64 shrink-0 flex-col border-r border-gray-200 bg-white text-sm text-slate-700">
      <div className="flex h-16 items-center justify-between border-b border-gray-100 px-6">
        <Link href="/" className="flex items-center gap-2.5 text-lg font-bold text-slate-800">
          <div className="bg-primary flex h-8 w-8 items-center justify-center rounded text-white shadow-sm">
            <i className="fa-solid fa-laptop-code text-xs"></i>
          </div>
          <span>
            Staff<span className="font-light text-slate-500">up</span>
          </span>
        </Link>

        <button
          className="text-slate-500 hover:text-slate-800 lg:hidden"
          onClick={closeMobileNav}
          aria-label="Dong menu"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <div className="custom-scrollbar flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
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

        <div className="mt-6 mb-2 px-3 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
          Đánh giá và thành tích
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

      <div className="border-t border-gray-100 bg-slate-50 p-4">
        <div className="rounded-lg border border-transparent p-2">
          <div className="mb-3 flex items-center gap-3">
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
          </div>

          <button
            type="button"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i className="fa-solid fa-right-from-bracket"></i>
            {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
          </button>
        </div>
      </div>
    </aside>
  );
};
