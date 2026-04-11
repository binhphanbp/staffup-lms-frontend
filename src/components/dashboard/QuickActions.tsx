import React from 'react';
import Link from 'next/link';

export const QuickActions = () => {
  const actions = [
    {
      icon: 'fa-book-open',
      label: 'Khám phá khóa học',
      href: '/courses',
      color: 'blue',
      description: 'Tìm khóa học mới',
    },
    {
      icon: 'fa-graduation-cap',
      label: 'Khóa của tôi',
      href: '/my-courses',
      color: 'purple',
      description: 'Xem tiến độ học tập',
    },
    {
      icon: 'fa-certificate',
      label: 'Chứng chỉ',
      href: '/certificates',
      color: 'green',
      description: 'Xem thành tích',
    },
    {
      icon: 'fa-flask-vial',
      label: 'Bài kiểm tra',
      href: '/quiz-assessment',
      color: 'orange',
      description: 'Làm bài test',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; text: string; hover: string }> = {
      blue: {
        bg: 'bg-blue-50',
        text: 'text-blue-600',
        hover: 'hover:bg-blue-100',
      },
      purple: {
        bg: 'bg-purple-50',
        text: 'text-purple-600',
        hover: 'hover:bg-purple-100',
      },
      green: {
        bg: 'bg-green-50',
        text: 'text-green-600',
        hover: 'hover:bg-green-100',
      },
      orange: {
        bg: 'bg-orange-50',
        text: 'text-orange-600',
        hover: 'hover:bg-orange-100',
      },
    };
    return colors[color] || colors.blue;
  };

  return (
    <div className="mb-8 grid grid-cols-2 gap-4 md:grid-cols-4">
      {actions.map((action) => {
        const colors = getColorClasses(action.color);
        return (
          <Link
            key={action.href}
            href={action.href}
            className={`card group flex flex-col items-center justify-center p-5 text-center transition-all ${colors.hover} hover:shadow-md`}
          >
            <div
              className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full ${colors.bg} transition-transform group-hover:scale-110`}
            >
              <i className={`fa-solid ${action.icon} text-2xl ${colors.text}`}></i>
            </div>
            <div className="mb-1 text-sm font-bold text-slate-800">{action.label}</div>
            <div className="text-[11px] text-slate-500">{action.description}</div>
          </Link>
        );
      })}
    </div>
  );
};
