'use client';

import React from 'react';
import { Download, Award, Calendar, CheckCircle } from 'lucide-react';

interface CertificateCardProps {
  certificateId: string;
  courseTitle: string;
  completedAt: string;
  issueDate: string;
  studentName: string;
  instructorName: string;
  onDownload: () => void;
}

export function CertificateCard({
  certificateId,
  courseTitle,
  completedAt,
  issueDate,
  studentName,
  instructorName,
  onDownload,
}: CertificateCardProps) {
  const formattedDate = new Date(issueDate).toLocaleDateString('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-all hover:shadow-md">
      {/* Certificate Icon */}
      <div className="mb-4 flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md">
          <Award className="h-6 w-6" />
        </div>
        <div className="flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
          <CheckCircle className="h-3 w-3" />
          Đã hoàn thành
        </div>
      </div>

      {/* Course Title */}
      <h3 className="mb-2 text-lg font-bold text-slate-800 line-clamp-2">
        {courseTitle}
      </h3>

      {/* Certificate Info */}
      <div className="mb-4 space-y-2 text-sm text-slate-600">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-slate-400" />
          <span>Hoàn thành: {formattedDate}</span>
        </div>
        <div className="flex items-center gap-2">
          <i className="fa-solid fa-id-card w-4 text-center text-slate-400"></i>
          <span className="font-mono text-xs">ID: {certificateId}</span>
        </div>
      </div>

      {/* Instructor */}
      <div className="mb-4 border-t border-gray-100 pt-3 text-xs text-slate-500">
        <span>Giảng viên: </span>
        <span className="font-semibold text-slate-700">{instructorName}</span>
      </div>

      {/* Download Button */}
      <button
        onClick={onDownload}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
      >
        <Download className="h-4 w-4" />
        Tải xuống chứng chỉ
      </button>

      {/* Decorative gradient */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br from-blue-100 to-blue-50 opacity-50 blur-2xl"></div>
    </div>
  );
}
