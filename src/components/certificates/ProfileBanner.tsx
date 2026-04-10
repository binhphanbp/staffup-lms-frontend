/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useEmployeeDashboard } from '@/hooks/useDashboard';

export const ProfileBanner = () => {
  const user = useAuthStore((s) => s.user);
  const { data: stats } = useEmployeeDashboard();

  const displayName = user?.fullName ?? 'Người dùng';
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=1677ff&color=fff&size=200`;
  const certCount = stats?.certificates?.total ?? 0;

  return (
    <div className="relative mb-8 overflow-hidden rounded-xl border border-slate-800 bg-slate-900 p-4 text-white shadow-lg md:p-8">
      <i className="fa-solid fa-award absolute -top-10 -right-10 rotate-12 transform text-[200px] text-white/5"></i>

      <div className="relative z-10 flex flex-col items-center gap-4 md:flex-row md:gap-8">
        <div className="relative h-24 w-24 shrink-0 rounded-full border-4 border-slate-700 shadow-xl">
          <img src={avatarUrl} alt="Avatar" className="h-full w-full rounded-full object-cover" />
        </div>

        <div className="flex-1 text-center md:text-left">
          <h1 className="mb-1 text-2xl font-bold">{displayName}</h1>
          <div className="mb-4 font-mono text-xs text-slate-400">{user?.email ?? ''}</div>

          <div className="flex flex-wrap justify-center gap-6 md:justify-start">
            <div>
              <div className="mb-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                Tổng chứng chỉ
              </div>
              <div className="flex items-center gap-2 text-2xl font-bold text-white">
                {certCount} <i className="fa-solid fa-certificate text-lg text-yellow-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
