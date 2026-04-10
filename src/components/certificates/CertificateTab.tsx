/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { useCertificates } from '@/hooks/useCertificates';
import type { CertificateResponse } from '@/types';

interface CertificateTabProps {
  onCopy: (text: string) => void;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN');
}

function CertificateCard({
  cert,
  onCopy,
}: {
  cert: CertificateResponse;
  onCopy: (text: string) => void;
}) {
  const courseTitle = cert.enrollment?.course?.title ?? 'Khóa học';
  const thumbnailUrl = cert.enrollment?.course?.thumbnailUrl;

  return (
    <div className="card cert-card border-t-primary flex h-full flex-col border-t-4 bg-white p-5">
      <div className="group relative mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-slate-50">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={courseTitle} className="h-full w-full object-cover" />
        ) : (
          <div className="font-bold text-slate-300">{courseTitle}</div>
        )}
        <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
          {cert.pdfUrl && (
            <a
              href={cert.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:text-white"
            >
              <i className="fa-solid fa-download"></i>
            </a>
          )}
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <h3 className="mb-1 text-base leading-tight font-bold text-slate-800">{courseTitle}</h3>
        <p className="mb-4 text-xs text-slate-500">
          Cấp cho: {cert.enrollment?.user?.fullName ?? 'N/A'}
        </p>

        <div className="mt-auto rounded-md border border-gray-100 bg-slate-50 p-3">
          <div className="mb-1.5 flex items-center justify-between text-xs">
            <span className="text-slate-500">Ngày cấp:</span>
            <span className="font-semibold text-slate-700">{formatDate(cert.issuedAt)}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500">Trạng thái:</span>
            <span
              className={`font-semibold ${cert.revokedAt ? 'text-red-500' : 'text-green-600'}`}
            >
              {cert.revokedAt ? 'Đã thu hồi' : 'Còn hiệu lực'}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
            <div className="flex flex-col font-mono text-[10px] text-slate-400">
              <span>Credential ID</span>
              <span className="font-bold text-slate-600">{cert.certificateCode}</span>
            </div>
            <button
              onClick={() => onCopy(cert.certificateCode)}
              className="text-primary hover:bg-primary-bg rounded p-1.5 text-xs transition-colors"
              title="Copy ID"
            >
              <i className="fa-regular fa-copy"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export const CertificateTab = ({ onCopy }: CertificateTabProps) => {
  const { data, isLoading } = useCertificates();
  const certificates = data?.data ?? [];

  return (
    <div className="animate-[fadeIn_0.3s_ease-in-out] space-y-6 pb-12">
      {/* Thanh công cụ lọc */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-bold text-slate-800">
          Chứng chỉ đã đạt được ({data?.meta?.total ?? 0})
        </div>
      </div>

      {isLoading && (
        <div className="py-12 text-center text-sm text-slate-400">Đang tải chứng chỉ...</div>
      )}

      {!isLoading && certificates.length === 0 && (
        <div className="py-12 text-center text-sm text-slate-400">
          Bạn chưa có chứng chỉ nào.
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
