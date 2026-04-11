/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useCertificates } from '@/hooks/useCertificates';
import type { Certificate } from '@/services/certificate.service';
import { Award, Download, Copy, CheckCircle, XCircle, Calendar, User, Building2, FileText, Shield, Clock } from 'lucide-react';

interface CertificateTabProps {
  onCopy: (text: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

function formatDateFull(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

function CertificateCard({
  cert,
  onCopy,
}: {
  cert: Certificate;
  onCopy: (text: string) => void;
}) {
  const courseTitle = cert.course?.title ?? 'Khóa học';
  const userName = cert.user?.fullName ?? 'N/A';
  const userEmail = cert.user?.email ?? '';
  const trainerName = cert.trainer?.fullName ?? 'Giảng viên';
  const completedDate = cert.issueDate;
  const isRevoked = false; // Certificate from service doesn't have revokedAt

  return (
    <div className="group relative h-full bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Header Section - Clean Style */}
      <div className="relative h-32 shrink-0 overflow-hidden rounded-t-xl bg-gradient-to-br from-blue-50 to-purple-50">
        {/* Organization Logo */}
        <div className="absolute top-4 left-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm">
            <Award className="h-6 w-6 text-primary" />
          </div>
        </div>

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          {isRevoked ? (
            <span className="flex items-center gap-1 rounded-full bg-red-100 px-3 py-1 text-[10px] font-bold text-red-700">
              <XCircle className="h-3 w-3" />
              Đã thu hồi
            </span>
          ) : (
            <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-[10px] font-bold text-green-700">
              <CheckCircle className="h-3 w-3" />
              Còn hiệu lực
            </span>
          )}
        </div>

        {/* Certificate Type */}
        <div className="absolute bottom-3 left-4 right-4">
          <p className="text-[10px] font-bold text-slate-600 mb-1 uppercase tracking-wider">Chứng chỉ hoàn thành</p>
          <h3 className="text-sm font-bold text-slate-800 leading-tight line-clamp-2">{courseTitle}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Recipient */}
        <div className="mb-2 flex items-center justify-between font-mono text-[10px] text-slate-400">
          <span>Cấp cho</span>
        </div>

        {/* User Name */}
        <h3 className="group-hover:text-primary mb-2 text-[14px] leading-snug font-bold text-slate-800 transition-colors">
          {userName}
        </h3>

        {/* Email */}
        <p className="mb-4 text-[12px] text-slate-500">{userEmail}</p>

        <div className="mt-auto"></div>

        {/* Certificate Code */}
        <div className="mb-3 rounded-lg bg-blue-50 px-3 py-2 border border-blue-100">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5">
              <Shield className="h-3.5 w-3.5 text-blue-600" />
              <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Mã chứng chỉ</span>
            </div>
            <button
              onClick={() => onCopy(cert.certificateNumber)}
              className="flex h-5 w-5 items-center justify-center rounded bg-white text-blue-600 transition-all hover:bg-blue-100"
              title="Sao chép"
            >
              <Copy className="h-3 w-3" />
            </button>
          </div>
          <code className="block font-mono text-[11px] font-bold text-blue-700 break-all">
            {cert.certificateNumber}
          </code>
        </div>

        {/* Details */}
        <div className="space-y-2 mb-3">
          {/* Issue Date */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Calendar className="h-3.5 w-3.5" />
              <span>Ngày cấp</span>
            </div>
            <span className="font-semibold text-slate-800">{formatDate(cert.issueDate)}</span>
          </div>

          {/* Completion Date */}
          {completedDate && (
            <div className="flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-1.5 text-slate-600">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Hoàn thành</span>
              </div>
              <span className="font-semibold text-slate-800">{formatDate(completedDate)}</span>
            </div>
          )}

          {/* Validity */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Clock className="h-3.5 w-3.5" />
              <span>Thời hạn</span>
            </div>
            <span className="font-semibold text-green-600">Vô thời hạn</span>
          </div>

          {/* Trainer */}
          <div className="flex items-center justify-between text-[11px]">
            <div className="flex items-center gap-1.5 text-slate-600">
              <Building2 className="h-3.5 w-3.5" />
              <span>Giảng viên</span>
            </div>
            <span className="font-semibold text-slate-800">{trainerName}</span>
          </div>
        </div>

        {/* Footer */}
        <div className="my-3 h-px w-full bg-gray-100"></div>
        
        {/* Download Button */}
        <button
          className="flex items-center justify-center gap-2 w-full rounded-lg bg-primary text-white px-4 py-2 text-[11px] font-bold transition-colors hover:bg-primary/90"
          onClick={() => alert('Tính năng tải xuống đang được phát triển')}
        >
          <Download className="h-3.5 w-3.5" />
          Tải xuống PDF
        </button>
      </div>
    </div>
  );
}

export const CertificateTab = ({ onCopy }: CertificateTabProps) => {
  const { data, isLoading } = useCertificates();
  const certificates = data?.data ?? [];

  return (
    <div className="animate-[fadeIn_0.3s_ease-in-out] space-y-6 pb-12">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Chứng chỉ của bạn</h2>
          <p className="text-sm text-slate-600 mt-1">
            Tổng cộng <span className="font-bold text-blue-600">{data?.meta?.total ?? 0}</span> chứng chỉ hợp pháp
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="py-20 text-center">
          <div className="inline-flex items-center gap-3 text-slate-400">
            <i className="fa-solid fa-spinner fa-spin text-2xl"></i>
            <span className="text-sm font-medium">Đang tải chứng chỉ...</span>
          </div>
        </div>
      )}

      {!isLoading && certificates.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-flex flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-slate-100">
              <Award className="h-10 w-10 text-slate-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-slate-800 mb-1">Chưa có chứng chỉ</p>
              <p className="text-sm text-slate-500">Hoàn thành khóa học để nhận chứng chỉ hợp pháp</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {certificates.map((cert) => (
          <CertificateCard key={cert.id} cert={cert} onCopy={onCopy} />
        ))}
      </div>
    </div>
  );
};
