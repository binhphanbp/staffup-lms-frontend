'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useCertificateByEnrollment, useIssueCertificate } from '@/hooks/useCertificates';

interface CourseCertificatePanelProps {
  enrollmentId: string;
  completedLessons: number;
  totalLessons: number;
}

export const CourseCertificatePanel = ({
  enrollmentId,
  completedLessons,
  totalLessons,
}: CourseCertificatePanelProps) => {
  const [issueError, setIssueError] = useState<string | null>(null);
  const isFullyComplete = totalLessons > 0 && completedLessons >= totalLessons;

  const {
    data: certificate,
    isLoading: certLoading,
    isError: certNotFound,
    refetch,
  } = useCertificateByEnrollment(isFullyComplete ? enrollmentId : null);

  const issueMutation = useIssueCertificate();

  const handleIssueCertificate = async () => {
    setIssueError(null);
    try {
      await issueMutation.mutateAsync(enrollmentId);
      refetch();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        (err as Error)?.message ??
        'Không thể cấp chứng chỉ. Vui lòng thử lại.';
      setIssueError(msg);
    }
  };

  const progressPercent =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  // ── Not completed yet ────────────────────────────────────────
  if (!isFullyComplete) {
    return (
      <div className="border-t border-slate-200 bg-slate-100 px-4 py-4">
        <div className="mb-2 flex items-center gap-2 text-[11px] font-bold tracking-wider text-slate-500 uppercase">
          <i className="fa-solid fa-award text-slate-400" />
          Chứng chỉ khóa học
        </div>
        <div className="mb-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
          <div
            className="bg-primary h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-slate-400">
          Hoàn thành{' '}
          <span className="font-bold text-slate-600">
            {completedLessons}/{totalLessons}
          </span>{' '}
          bài học để nhận chứng chỉ.
        </p>
      </div>
    );
  }

  // ── Completed, checking certificate ──────────────────────────
  if (certLoading) {
    return (
      <div className="border-t border-amber-200 bg-amber-50 px-4 py-4">
        <div className="flex items-center gap-2 text-[12px] text-amber-700">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-amber-400 border-t-transparent" />
          Đang kiểm tra chứng chỉ...
        </div>
      </div>
    );
  }

  // ── Certificate already issued ────────────────────────────────
  if (certificate && !certNotFound) {
    return (
      <div className="border-t border-emerald-200 bg-gradient-to-br from-emerald-50 to-green-50 px-4 py-4">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100">
            <i className="fa-solid fa-certificate text-sm text-emerald-600" />
          </div>
          <div>
            <div className="text-[12px] font-bold text-emerald-800">Chứng chỉ đã được cấp!</div>
            <div className="font-mono text-[10px] text-emerald-600">
              {certificate.certificateCode}
            </div>
          </div>
        </div>
        <Link
          href={`/certificates/${certificate.id}`}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-emerald-600 py-2 text-[12px] font-bold text-white transition-colors hover:bg-emerald-700"
        >
          <i className="fa-solid fa-eye" />
          Xem chứng chỉ
        </Link>
      </div>
    );
  }

  // ── Completed, certificate not yet issued ─────────────────────
  return (
    <div className="border-t border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 px-4 py-4">
      <div className="mb-3 flex items-center gap-2">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <i className="fa-solid fa-trophy text-sm text-amber-600" />
        </div>
        <div>
          <div className="text-[12px] font-bold text-amber-900">Bạn đã hoàn thành khóa học!</div>
          <div className="text-[10px] text-amber-700">Sẵn sàng nhận chứng chỉ của bạn.</div>
        </div>
      </div>

      {issueError && (
        <div className="mb-2 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-600">
          {issueError}
        </div>
      )}

      <button
        onClick={handleIssueCertificate}
        disabled={issueMutation.isPending}
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-amber-500 py-2 text-[12px] font-bold text-white transition-colors hover:bg-amber-600 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {issueMutation.isPending ? (
          <>
            <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            Đang cấp...
          </>
        ) : (
          <>
            <i className="fa-solid fa-award" />
            Nhận chứng chỉ ngay
          </>
        )}
      </button>
    </div>
  );
};
