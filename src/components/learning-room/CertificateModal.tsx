/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';
import Link from 'next/link';
import { X, Award, Download, ExternalLink, Sparkles, Trophy } from 'lucide-react';
import type { Certificate } from '@/services/certificate.service';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  certificate: Certificate | null;
  courseTitle: string;
  onDownload?: () => void;
}

export const CertificateModal = ({
  isOpen,
  onClose,
  certificate,
  courseTitle,
  onDownload,
}: CertificateModalProps) => {
  if (!isOpen || !certificate) return null;

  const isPending = certificate.certificateNumber === 'Đang xử lý...';

  return (
    <>
      {/* Backdrop with blur */}
      <div 
        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
        <div 
          className="relative w-full max-w-3xl pointer-events-auto animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Decorative elements */}
          <div className="absolute -top-20 -left-20 w-40 h-40 bg-yellow-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          {/* Main card */}
          <div className="relative bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 rounded-3xl shadow-2xl overflow-hidden border border-white/50">
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-600 shadow-lg transition-all hover:bg-white hover:scale-110 hover:text-slate-900"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Animated background pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
                backgroundSize: '32px 32px',
              }} />
            </div>

            {/* Content */}
            <div className="relative px-8 py-12 md:px-12">
              {/* Trophy icon with glow */}
              <div className="mb-8 flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-2xl opacity-50 animate-pulse" />
                  <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500 shadow-2xl">
                    <Trophy className="h-14 w-14 text-white drop-shadow-lg" />
                    <Sparkles className="absolute -top-2 -right-2 h-8 w-8 text-yellow-300 animate-spin-slow" />
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="mb-8 text-center">
                <h2 className="mb-3 text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                  Chúc Mừng! 🎉
                </h2>
                <p className="text-lg text-slate-600 font-medium">
                  Bạn đã hoàn thành xuất sắc khóa học
                </p>
              </div>

              {/* Course title card */}
              <div className="mb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur-xl opacity-20" />
                <div className="relative rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 p-6 shadow-xl">
                  <div className="flex items-start gap-3">
                    <Award className="h-6 w-6 text-yellow-300 flex-shrink-0 mt-1" />
                    <p className="text-xl font-bold text-white leading-tight">{courseTitle}</p>
                  </div>
                </div>
              </div>

              {/* Certificate info */}
              {!isPending ? (
                <div className="mb-8 space-y-4">
                  <div className="rounded-xl bg-white/80 backdrop-blur-sm p-6 shadow-lg border border-slate-200/50">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Mã Chứng Chỉ
                        </p>
                        <code className="block rounded-lg bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 font-mono text-sm font-bold text-blue-600 border border-slate-200">
                          {certificate.certificateNumber}
                        </code>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                          Ngày Cấp
                        </p>
                        <div className="rounded-lg bg-gradient-to-r from-slate-100 to-slate-50 px-4 py-3 font-semibold text-slate-700 border border-slate-200">
                          {new Date(certificate.issueDate).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric'
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Achievement stats */}
                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-xl bg-green-50 p-4 text-center border border-green-200">
                      <div className="text-2xl font-black text-green-600">100%</div>
                      <div className="text-xs font-semibold text-green-700">Hoàn Thành</div>
                    </div>
                    <div className="rounded-xl bg-blue-50 p-4 text-center border border-blue-200">
                      <div className="text-2xl font-black text-blue-600">
                        <i className="fa-solid fa-certificate"></i>
                      </div>
                      <div className="text-xs font-semibold text-blue-700">Chứng Nhận</div>
                    </div>
                    <div className="rounded-xl bg-purple-50 p-4 text-center border border-purple-200">
                      <div className="text-2xl font-black text-purple-600">
                        <i className="fa-solid fa-star"></i>
                      </div>
                      <div className="text-xs font-semibold text-purple-700">Xuất Sắc</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="mb-8 rounded-xl bg-blue-50 border border-blue-200 p-6">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <i className="fa-solid fa-clock text-blue-600"></i>
                      </div>
                    </div>
                    <div>
                      <p className="font-semibold text-blue-900 mb-1">Đang xử lý chứng chỉ</p>
                      <p className="text-sm text-blue-700">
                        Chứng chỉ của bạn đang được hệ thống tạo. Vui lòng kiểm tra lại trong trang Chứng chỉ sau ít phút.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                {!isPending && onDownload && (
                  <button
                    onClick={onDownload}
                    className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4 font-bold text-white shadow-lg shadow-blue-500/30 transition-all hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
                  >
                    <Download className="h-5 w-5" />
                    Tải Xuống PDF
                  </button>
                )}
                <Link
                  href="/certificates"
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border-2 border-slate-300 bg-white px-6 py-4 font-bold text-slate-700 transition-all hover:border-slate-400 hover:bg-slate-50 hover:-translate-y-0.5"
                >
                  <ExternalLink className="h-5 w-5" />
                  Xem Tất Cả Chứng Chỉ
                </Link>
              </div>

              {/* Footer message */}
              <p className="mt-6 text-center text-xs text-slate-500">
                Chứng chỉ này đã được lưu vào hồ sơ của bạn và có thể chia sẻ với người khác
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-scale-in {
          animation: scale-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </>
  );
};
