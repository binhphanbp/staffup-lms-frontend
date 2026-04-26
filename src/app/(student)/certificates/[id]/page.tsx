'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { useCertificateDetail } from '@/hooks/useCertificates';
import { resolveMediaUrl } from '@/lib/media';

export default function CertificateDetailPage() {
  const params = useParams<{ id: string }>();
  const certificateId = params?.id ?? null;
  const { data: certificate, isLoading, isError } = useCertificateDetail(certificateId);

  if (isLoading) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Chứng chỉ', href: '/certificates' },
            { label: 'Đang tải...' },
          ]}
        />
        <div className="flex flex-1 items-center justify-center bg-slate-100">
          <div className="text-sm text-slate-500">
            <i className="fa-solid fa-spinner fa-spin mr-2"></i> Đang tải chứng chỉ...
          </div>
        </div>
      </>
    );
  }

  if (isError || !certificate) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Chứng chỉ', href: '/certificates' },
            { label: 'Lỗi' },
          ]}
        />
        <div className="flex flex-1 items-center justify-center bg-slate-100 p-6">
          <div className="text-center">
            <p className="mb-4 text-sm text-red-500">Không thể tải chứng chỉ.</p>
            <Link href="/certificates" className="text-primary text-sm font-medium hover:underline">
              → Quay lại danh sách chứng chỉ
            </Link>
          </div>
        </div>
      </>
    );
  }

  const pdfUrl = resolveMediaUrl(certificate.pdfUrl);
  const course = certificate.enrollment.course;
  const learner = certificate.enrollment.user;
  const trainer = course.trainer?.fullName ?? 'Staffup LMS';

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Chứng chỉ', href: '/certificates' },
          { label: course.title },
        ]}
      />

      <div className="custom-scrollbar flex-1 overflow-y-auto bg-slate-100 p-6 lg:p-10">
        <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between gap-3">
          <Link href="/certificates" className="text-primary text-sm font-medium hover:underline">
            ← Quay lại
          </Link>
          <div className="flex items-center gap-3">
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400"
              >
                Tải PDF
              </a>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-primary hover:bg-primary-hover rounded-md px-4 py-2 text-sm font-semibold text-white"
            >
              In / Tải bản in
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-5xl rounded-3xl border border-amber-200 bg-white p-8 shadow-lg lg:p-14">
          <div className="mb-10 text-center">
            <div className="mb-3 text-xs font-bold tracking-[0.35em] text-amber-600 uppercase">
              Staffup LMS
            </div>
            <h1 className="mb-2 text-4xl font-black text-slate-900 lg:text-5xl">Chứng nhận</h1>
            <p className="text-sm text-slate-500">Chứng nhận hoàn thành khóa học nội bộ</p>
          </div>

          <div className="mb-10 text-center">
            <div className="mb-2 text-sm tracking-[0.25em] text-slate-400 uppercase">Trao cho</div>
            <div className="mb-3 text-3xl font-bold text-slate-900 lg:text-4xl">
              {learner.fullName}
            </div>
            <p className="mx-auto max-w-3xl text-base leading-8 text-slate-600">
              Đã hoàn thành khóa học{' '}
              <span className="font-semibold text-slate-900">{course.title}</span>
              {course.description ? ` - ${course.description}` : ''}.
            </p>
          </div>

          <div className="grid gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-6 md:grid-cols-3">
            <div>
              <div className="mb-1 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                Mã chứng nhận
              </div>
              <div className="font-mono text-sm font-bold text-slate-800">
                {certificate.certificateCode}
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                Ngày cấp
              </div>
              <div className="text-sm font-bold text-slate-800">
                {new Date(certificate.issuedAt).toLocaleDateString('vi-VN')}
              </div>
            </div>
            <div>
              <div className="mb-1 text-xs font-semibold tracking-[0.2em] text-slate-400 uppercase">
                Xác nhận bởi
              </div>
              <div className="text-sm font-bold text-slate-800">{trainer}</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
