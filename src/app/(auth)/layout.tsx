// ============================================================
// Auth Route Group Layout
// Split-screen layout: Branding panel (left) + Form area (right)
// Responsive: Branding panel hides on mobile
// ============================================================

import { GraduationCap } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'Staffup LMS',
    template: '%s | Staffup LMS',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left: Branding Panel ── */}
      <div className="auth-branding-panel hidden w-[480px] shrink-0 lg:flex">
        <div className="relative flex h-full w-full flex-col justify-between p-10">
          {/* Background decorative elements */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -top-20 -right-20 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/3 blur-2xl" />
          </div>

          {/* Logo */}
          <div className="relative z-10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Staffup LMS</span>
            </div>
          </div>

          {/* Center Content */}
          <div className="relative z-10 space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl leading-tight font-bold text-white">
                Nâng tầm năng lực,
                <br />
                <span className="text-blue-200">kiến tạo tương lai.</span>
              </h2>
              <p className="max-w-sm text-base leading-relaxed text-blue-100/80">
                Nền tảng học tập trực tuyến thông minh dành cho doanh nghiệp và tổ chức hiện đại.
              </p>
            </div>

            {/* Feature highlights */}
            <div className="space-y-4">
              {[
                {
                  icon: '📚',
                  title: 'Khoá học chuyên sâu',
                  desc: 'Nội dung được xây dựng bởi chuyên gia hàng đầu',
                },
                {
                  icon: '🎯',
                  title: 'Lộ trình cá nhân hoá',
                  desc: 'AI phân tích và đề xuất lộ trình phù hợp',
                },
                {
                  icon: '📊',
                  title: 'Theo dõi tiến độ',
                  desc: 'Dashboard trực quan với báo cáo chi tiết',
                },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white/10 text-lg backdrop-blur-sm">
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-xs text-blue-200/70">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="relative z-10">
            <p className="text-xs text-blue-200/50">© 2026 Staffup LMS. All rights reserved.</p>
          </div>
        </div>
      </div>

      {/* ── Right: Form Area ── */}
      <div className="flex flex-1 items-center justify-center bg-gray-50/50 p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-[440px]">{children}</div>
      </div>
    </div>
  );
}
