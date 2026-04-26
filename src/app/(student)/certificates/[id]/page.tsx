'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { useCertificateDetail } from '@/hooks/useCertificates';
import { resolveMediaUrl } from '@/lib/media';

// ── Helpers ──────────────────────────────────────────────────

function formatDateLong(iso: string) {
  return new Date(iso).toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

// ── SVG Decorative Elements ───────────────────────────────────

function CornerTL() {
  return (
    <svg
      width="76"
      height="76"
      viewBox="0 0 76 76"
      fill="none"
      className="pointer-events-none absolute top-5 left-5"
    >
      <path d="M2 2 L74 2" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 2 L2 74" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 2 L32 2 L32 7 L7 7 L7 32 L2 32 Z" fill="#d4af37" opacity="0.55" />
      <circle cx="2" cy="2" r="4" fill="#d4af37" />
      <path
        d="M18 18 L30 18 M18 18 L18 30"
        stroke="#d4af37"
        strokeWidth="1.5"
        opacity="0.75"
        strokeLinecap="round"
      />
      <circle cx="30" cy="18" r="2.5" fill="#d4af37" opacity="0.5" />
      <circle cx="18" cy="30" r="2.5" fill="#d4af37" opacity="0.5" />
    </svg>
  );
}

function CornerTR() {
  return (
    <svg
      width="76"
      height="76"
      viewBox="0 0 76 76"
      fill="none"
      className="pointer-events-none absolute top-5 right-5"
    >
      <path d="M74 2 L2 2" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 2 L74 74" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 2 L44 2 L44 7 L69 7 L69 32 L74 32 Z" fill="#d4af37" opacity="0.55" />
      <circle cx="74" cy="2" r="4" fill="#d4af37" />
      <path
        d="M58 18 L46 18 M58 18 L58 30"
        stroke="#d4af37"
        strokeWidth="1.5"
        opacity="0.75"
        strokeLinecap="round"
      />
      <circle cx="46" cy="18" r="2.5" fill="#d4af37" opacity="0.5" />
      <circle cx="58" cy="30" r="2.5" fill="#d4af37" opacity="0.5" />
    </svg>
  );
}

function CornerBL() {
  return (
    <svg
      width="76"
      height="76"
      viewBox="0 0 76 76"
      fill="none"
      className="pointer-events-none absolute bottom-5 left-5"
    >
      <path d="M2 74 L74 74" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 74 L2 2" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
      <path d="M2 74 L32 74 L32 69 L7 69 L7 44 L2 44 Z" fill="#d4af37" opacity="0.55" />
      <circle cx="2" cy="74" r="4" fill="#d4af37" />
      <path
        d="M18 58 L30 58 M18 58 L18 46"
        stroke="#d4af37"
        strokeWidth="1.5"
        opacity="0.75"
        strokeLinecap="round"
      />
      <circle cx="30" cy="58" r="2.5" fill="#d4af37" opacity="0.5" />
      <circle cx="18" cy="46" r="2.5" fill="#d4af37" opacity="0.5" />
    </svg>
  );
}

function CornerBR() {
  return (
    <svg
      width="76"
      height="76"
      viewBox="0 0 76 76"
      fill="none"
      className="pointer-events-none absolute right-5 bottom-5"
    >
      <path d="M74 74 L2 74" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 74 L74 2" stroke="#b8860b" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 74 L44 74 L44 69 L69 69 L69 44 L74 44 Z" fill="#d4af37" opacity="0.55" />
      <circle cx="74" cy="74" r="4" fill="#d4af37" />
      <path
        d="M58 58 L46 58 M58 58 L58 46"
        stroke="#d4af37"
        strokeWidth="1.5"
        opacity="0.75"
        strokeLinecap="round"
      />
      <circle cx="46" cy="58" r="2.5" fill="#d4af37" opacity="0.5" />
      <circle cx="58" cy="46" r="2.5" fill="#d4af37" opacity="0.5" />
    </svg>
  );
}

function AwardMedal() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110">
      <defs>
        <radialGradient id="medalBg" cx="38%" cy="32%" r="65%">
          <stop offset="0%" stopColor="#1e3a6e" />
          <stop offset="100%" stopColor="#0c1c3e" />
        </radialGradient>
        <radialGradient id="goldRing" cx="35%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#f5d060" />
          <stop offset="40%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#8b6914" />
        </radialGradient>
        <filter id="medalShadow">
          <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#00000033" />
        </filter>
      </defs>
      <g filter="url(#medalShadow)">
        <circle cx="55" cy="52" r="50" fill="url(#goldRing)" />
        <circle cx="55" cy="52" r="43" fill="url(#medalBg)" />
        <circle
          cx="55"
          cy="52"
          r="40"
          stroke="#d4af37"
          strokeWidth="0.8"
          fill="none"
          strokeDasharray="3.5 2.5"
        />
        <path
          d="M55 20 L59.5 35.5 L76 35.5 L63 45.5 L67.5 61 L55 51 L42.5 61 L47 45.5 L34 35.5 L50.5 35.5 Z"
          fill="#d4af37"
        />
        <rect x="47" y="76" width="16" height="18" rx="2" fill="#d4af37" opacity="0.85" />
        <path d="M47 76 L55 82 L63 76" fill="#b8860b" opacity="0.7" />
      </g>
    </svg>
  );
}

function DividerOrnament() {
  return (
    <div className="flex items-center justify-center gap-3">
      <div className="h-px w-20 bg-gradient-to-r from-transparent to-amber-400" />
      <svg width="28" height="14" viewBox="0 0 28 14">
        <path
          d="M14 1 L16.5 5.5 L28 5.5 L19 9 L22 13 L14 9.5 L6 13 L9 9 L0 5.5 L11.5 5.5 Z"
          fill="#d4af37"
          opacity="0.85"
        />
      </svg>
      <div className="h-px w-20 bg-gradient-to-l from-transparent to-amber-400" />
    </div>
  );
}

function StampSeal() {
  return (
    <svg width="86" height="86" viewBox="0 0 86 86">
      <defs>
        <radialGradient id="sealInner" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1e3a6e" />
          <stop offset="100%" stopColor="#0c1c3e" />
        </radialGradient>
      </defs>
      <circle cx="43" cy="43" r="41" fill="none" stroke="#1e3a6e" strokeWidth="3" />
      <circle cx="43" cy="43" r="36" fill="none" stroke="#1e3a6e" strokeWidth="1" />
      <circle cx="43" cy="43" r="33" fill="url(#sealInner)" />
      <path id="sealTopArc" d="M 15 43 A 28 28 0 0 1 71 43" fill="none" />
      <text
        fontSize="6.5"
        fill="#d4af37"
        fontWeight="bold"
        letterSpacing="2.2"
        fontFamily="sans-serif"
      >
        <textPath href="#sealTopArc" startOffset="8%">
          STAFFUP LMS • VERIFIED
        </textPath>
      </text>
      <path id="sealBotArc" d="M 71 43 A 28 28 0 0 1 15 43" fill="none" />
      <text fontSize="5.5" fill="#d4af37" letterSpacing="1.5" fontFamily="sans-serif">
        <textPath href="#sealBotArc" startOffset="10%">
          CERTIFICATE OF COMPLETION
        </textPath>
      </text>
      <path
        d="M43 25 L45.8 33.5 L55 33.5 L47.6 38.7 L50.4 47.2 L43 42 L35.6 47.2 L38.4 38.7 L31 33.5 L40.2 33.5 Z"
        fill="#d4af37"
      />
    </svg>
  );
}

// ── Page Component ────────────────────────────────────────────

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
        <div className="flex flex-1 items-center justify-center bg-slate-200">
          <div className="flex items-center gap-3 text-slate-500">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-amber-500 border-t-transparent" />
            <span className="text-sm">Đang tải chứng chỉ...</span>
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
        <div className="flex flex-1 items-center justify-center bg-slate-200 p-6">
          <div className="text-center">
            <p className="mb-4 text-sm text-red-500">Không thể tải chứng chỉ này.</p>
            <Link href="/certificates" className="text-primary text-sm font-medium hover:underline">
              ← Quay lại danh sách chứng chỉ
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
  const issuedDate = formatDateLong(certificate.issuedAt);
  const completedDate = certificate.enrollment.completedAt
    ? formatDateLong(certificate.enrollment.completedAt)
    : issuedDate;
  const shortDesc = course.description
    ? course.description.length > 130
      ? course.description.slice(0, 130) + '…'
      : course.description
    : null;

  return (
    <>
      <StudentHeader
        breadcrumbs={[
          { label: 'Trang chủ', href: '/' },
          { label: 'Chứng chỉ', href: '/certificates' },
          { label: course.title },
        ]}
      />

      <div className="certificate-scroll-area custom-scrollbar flex-1 overflow-y-auto bg-slate-300 p-6 lg:p-10 print:overflow-visible print:bg-white print:p-0">
        {/* ── Action Bar ── */}
        <div className="mx-auto mb-6 flex max-w-5xl items-center justify-between gap-3 print:hidden">
          <Link
            href="/certificates"
            className="text-primary flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            ← Quay lại danh sách
          </Link>
          <div className="flex items-center gap-3">
            {pdfUrl && (
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:shadow"
              >
                <i className="fa-solid fa-download mr-1.5" />
                Tải PDF
              </a>
            )}
            <button
              type="button"
              onClick={() => window.print()}
              className="bg-primary hover:bg-primary-hover flex items-center gap-2 rounded-lg px-5 py-2 text-sm font-semibold text-white shadow-sm transition"
            >
              <i className="fa-solid fa-print" />
              In chứng chỉ
            </button>
          </div>
        </div>

        {/* ── Certificate Card ── */}
        <div className="certificate-scale-wrapper mx-auto max-w-5xl print:max-w-full">
          {/* Gold outer frame */}
          <div
            className="certificate-outer rounded-sm p-[10px] shadow-2xl"
            style={{
              background:
                'linear-gradient(135deg, #f5d060 0%, #d4af37 20%, #b8860b 50%, #d4af37 80%, #f5d060 100%)',
            }}
          >
            {/* Cream inner sheet */}
            <div
              className="relative overflow-hidden px-10 py-14 lg:px-16 lg:py-16"
              style={{
                background:
                  'radial-gradient(ellipse at 18% 18%, rgba(212,175,55,0.07) 0%, transparent 55%), radial-gradient(ellipse at 82% 82%, rgba(212,175,55,0.07) 0%, transparent 55%), #fefdf6',
              }}
            >
              {/* Diagonal watermark weave */}
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.022] select-none"
                style={{
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #b8860b 0, #b8860b 1px, transparent 0, transparent 50%)',
                  backgroundSize: '18px 18px',
                }}
              />

              {/* Inner decorative borders */}
              <div className="pointer-events-none absolute inset-4 border border-amber-300 opacity-50" />
              <div className="pointer-events-none absolute inset-[22px] border border-amber-200 opacity-35" />

              {/* Corner ornaments */}
              <CornerTL />
              <CornerTR />
              <CornerBL />
              <CornerBR />

              {/* ── Content ── */}
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Brand strip */}
                <div className="mb-8 flex w-full items-center gap-4">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-400 to-amber-500" />
                  <span className="text-[11px] font-bold tracking-[0.42em] text-amber-700 uppercase">
                    Staffup LMS &bull; Hệ thống Đào tạo Nội bộ
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-400 to-amber-500" />
                </div>

                {/* Medal */}
                <div className="mb-5">
                  <AwardMedal />
                </div>

                {/* Title */}
                <h1
                  className="mb-1 text-[50px] leading-none text-slate-900"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
                >
                  Chứng Nhận
                </h1>
                <div className="mb-8 text-[12px] font-bold tracking-[0.48em] text-amber-700 uppercase">
                  Certificate of Completion
                </div>

                <DividerOrnament />

                {/* Recipient */}
                <p className="mt-8 mb-2 text-[10.5px] font-semibold tracking-[0.38em] text-slate-400 uppercase">
                  Trân trọng trao tặng &bull; Proudly Presented to
                </p>
                <div
                  className="mb-5 text-[40px] leading-tight text-slate-900"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif", fontWeight: 700 }}
                >
                  {learner.fullName}
                </div>

                {/* Achievement text */}
                <p className="mb-2 max-w-2xl text-[15px] leading-relaxed text-slate-600">
                  Đã xuất sắc hoàn thành toàn bộ chương trình khóa học nội bộ:
                </p>
                <div
                  className="mb-2 max-w-3xl text-[22px] font-bold text-slate-800"
                  style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
                >
                  &ldquo;{course.title}&rdquo;
                </div>
                {shortDesc && (
                  <p className="mb-8 max-w-xl text-[13px] leading-relaxed text-slate-500">
                    {shortDesc}
                  </p>
                )}

                <DividerOrnament />

                {/* Info grid */}
                <div className="mt-8 grid w-full max-w-3xl grid-cols-3 overflow-hidden rounded-xl border border-amber-200 bg-amber-50/60">
                  <div className="px-6 py-5 text-center">
                    <div className="mb-1.5 text-[9.5px] font-bold tracking-[0.32em] text-amber-700 uppercase">
                      Ngày hoàn thành
                    </div>
                    <div className="text-[13px] font-bold text-slate-800">{completedDate}</div>
                  </div>
                  <div className="border-x border-amber-200 px-6 py-5 text-center">
                    <div className="mb-1.5 text-[9.5px] font-bold tracking-[0.32em] text-amber-700 uppercase">
                      Mã chứng chỉ
                    </div>
                    <div className="font-mono text-[13px] font-bold text-slate-800">
                      {certificate.certificateCode}
                    </div>
                  </div>
                  <div className="px-6 py-5 text-center">
                    <div className="mb-1.5 text-[9.5px] font-bold tracking-[0.32em] text-amber-700 uppercase">
                      Ngày cấp chứng chỉ
                    </div>
                    <div className="text-[13px] font-bold text-slate-800">{issuedDate}</div>
                  </div>
                </div>

                {/* Signature row */}
                <div className="mt-10 grid w-full max-w-2xl grid-cols-2 gap-10">
                  {/* Trainer */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-2 flex h-14 items-end justify-center">
                      <span
                        className="text-[32px] leading-none text-slate-400"
                        style={{
                          fontFamily: "'Playfair Display', Georgia, serif",
                          fontStyle: 'italic',
                        }}
                      >
                        {trainer.split(' ').slice(-2).join(' ')}
                      </span>
                    </div>
                    <div className="w-full border-t-2 border-slate-300 pt-3">
                      <div className="text-[13px] font-bold text-slate-800">{trainer}</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">Giảng viên phụ trách</div>
                    </div>
                  </div>

                  {/* Platform seal */}
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-1">
                      <StampSeal />
                    </div>
                    <div className="w-full border-t-2 border-slate-300 pt-3">
                      <div className="text-[13px] font-bold text-slate-800">Staffup LMS</div>
                      <div className="mt-0.5 text-[11px] text-slate-500">Đại diện Nền tảng</div>
                    </div>
                  </div>
                </div>

                {/* Revoked warning */}
                {certificate.revokedAt && (
                  <div className="mt-6 w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3">
                    <p className="text-sm font-semibold text-red-600">
                      ⚠ Chứng chỉ này đã bị thu hồi vào ngày {formatDateLong(certificate.revokedAt)}
                    </p>
                  </div>
                )}

                {/* Verification footer */}
                <div className="mt-8 w-full border-t border-amber-200 pt-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                    <div>
                      <i className="fa-solid fa-shield-check mr-1 text-amber-500" />
                      Chứng chỉ được xác thực bởi hệ thống Staffup LMS
                    </div>
                    <div className="font-mono text-amber-700">{certificate.certificateCode}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Below-card note */}
        <p className="mt-4 text-center text-[11px] text-slate-500 print:hidden">
          Chứng chỉ số &bull; {certificate.certificateCode} &bull; Phát hành bởi Staffup LMS
        </p>
      </div>
    </>
  );
}
