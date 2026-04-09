/* eslint-disable @next/next/no-img-element */
import React from 'react';

interface CertificateTabProps {
  onCopy: (text: string) => void;
}

export const CertificateTab = ({ onCopy }: CertificateTabProps) => {
  return (
    <div className="animate-[fadeIn_0.3s_ease-in-out] space-y-6 pb-12">
      {/* Thanh công cụ lọc */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-bold text-slate-800">Chứng chỉ đã đạt được (4)</div>
        <select className="focus:border-primary rounded border border-gray-200 bg-white p-1.5 text-xs text-slate-600 outline-none">
          <option>Mới nhất</option>
          <option>Cấp bởi TechCorp</option>
          <option>Cấp bởi Đối tác (AWS, Google)</option>
        </select>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {/* ==================================
            CHỨNG CHỈ 1: TECHLEARN INTERNAL 
        ================================== */}
        <div className="card cert-card border-t-primary flex h-full flex-col border-t-4 bg-white p-5">
          <div className="group relative mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-slate-50">
            <div className="font-bold text-slate-300">TechLearn Architecture</div>
            <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
              <button className="text-primary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:text-white">
                <i className="fa-solid fa-eye"></i>
              </button>
              <button className="text-primary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:text-white">
                <i className="fa-solid fa-download"></i>
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex items-center gap-2">
              <img
                src="https://ui-avatars.com/api/?name=TC&background=1677ff&color=fff"
                className="h-4 w-4 rounded-full"
                alt="Icon"
              />
              <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                TechCorp Internal
              </span>
            </div>
            <h3 className="mb-1 text-base leading-tight font-bold text-slate-800">
              Advanced System Architecture
            </h3>
            <p className="mb-4 text-xs text-slate-500">
              Cấp cho việc hoàn thành xuất sắc lộ trình Thiết kế hệ thống phân tán cấp độ Senior.
            </p>

            <div className="mt-auto rounded-md border border-gray-100 bg-slate-50 p-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-500">Ngày cấp:</span>
                <span className="font-semibold text-slate-700">15/02/2026</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hết hạn:</span>
                <span className="font-semibold text-slate-700">Không thời hạn</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
                <div className="flex flex-col font-mono text-[10px] text-slate-400">
                  <span>Credential ID</span>
                  <span className="font-bold text-slate-600">TC-ARCH-8829-1A</span>
                </div>
                <button
                  onClick={() => onCopy('TC-ARCH-8829-1A')}
                  className="text-primary hover:bg-primary-bg rounded p-1.5 text-xs transition-colors"
                  title="Copy ID"
                >
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================
            CHỨNG CHỈ 2: AWS CERTIFIED 
        ================================== */}
        <div className="card cert-card flex h-full flex-col border-t-4 border-t-[#ff9900] bg-white p-5">
          <div className="group relative mb-4 flex h-40 w-full items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-slate-900 p-4">
            <div className="text-center">
              <i className="fa-brands fa-aws mb-2 text-4xl text-white"></i>
              <div className="mb-1 text-[10px] tracking-widest text-white uppercase opacity-80">
                AWS Certified
              </div>
              <div className="font-cert text-sm font-bold text-white text-yellow-400">
                Solutions Architect – Associate
              </div>
            </div>
            <div className="absolute -right-4 -bottom-4 h-12 w-12 rotate-45 transform bg-[#ff9900]"></div>
            <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-slate-900/60 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
              <button className="text-primary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:text-white">
                <i className="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex items-center gap-2">
              <i className="fa-brands fa-aws text-lg text-[#ff9900]"></i>
              <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                Amazon Web Services
              </span>
            </div>
            <h3 className="mb-1 text-base leading-tight font-bold text-slate-800">
              AWS Certified Solutions Architect
            </h3>
            <p className="mb-4 text-xs text-slate-500">
              Chứng nhận khả năng thiết kế hệ thống phân tán an toàn trên AWS.
            </p>

            <div className="mt-auto rounded-md border border-gray-100 bg-slate-50 p-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-500">Ngày cấp:</span>
                <span className="font-semibold text-slate-700">10/11/2025</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hết hạn:</span>
                <span className="font-semibold text-red-500">10/11/2028</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
                <div className="flex flex-col font-mono text-[10px] text-slate-400">
                  <span>Credential ID</span>
                  <span className="font-bold text-slate-600">AWS-SAA-9921XYZ</span>
                </div>
                <button
                  onClick={() => onCopy('AWS-SAA-9921XYZ')}
                  className="text-primary hover:bg-primary-bg rounded p-1.5 text-xs transition-colors"
                >
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ==================================
            CHỨNG CHỈ 3: OWASP SECURITY 
        ================================== */}
        <div className="card cert-card border-t-success flex h-full flex-col border-t-4 bg-white p-5">
          <div className="group relative mb-4 flex h-40 w-full flex-col items-center justify-center overflow-hidden rounded-lg border border-green-200 bg-[#f0fdf4] p-4 text-center">
            <i className="fa-solid fa-shield-halved text-success mb-2 text-4xl"></i>
            <div className="text-success font-cert text-lg font-bold">OWASP Top 10 Security</div>
            <div className="mt-1 text-[10px] font-bold text-green-700">TechCorp InfoSec Dept</div>
            <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-slate-900/40 opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
              <button className="text-primary hover:bg-primary flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg transition-colors hover:text-white">
                <i className="fa-solid fa-eye"></i>
              </button>
            </div>
          </div>

          <div className="flex flex-1 flex-col">
            <div className="mb-2 flex items-center gap-2">
              <i className="fa-solid fa-shield text-success"></i>
              <span className="text-[11px] font-bold tracking-wide text-slate-500 uppercase">
                TechCorp Compliance
              </span>
            </div>
            <h3 className="mb-1 text-base leading-tight font-bold text-slate-800">
              OWASP Top 10 Security Awareness
            </h3>
            <p className="mb-4 text-xs text-slate-500">
              Chứng chỉ bắt buộc hàng năm dành cho Software Engineer.
            </p>

            <div className="mt-auto rounded-md border border-gray-100 bg-slate-50 p-3">
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-slate-500">Ngày cấp:</span>
                <span className="font-semibold text-slate-700">01/01/2026</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Hết hạn:</span>
                <span className="font-semibold text-red-500">01/01/2027</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-gray-200 pt-2">
                <div className="flex flex-col font-mono text-[10px] text-slate-400">
                  <span>Credential ID</span>
                  <span className="font-bold text-slate-600">TC-SEC-2026-Q1</span>
                </div>
                <button
                  onClick={() => onCopy('TC-SEC-2026-Q1')}
                  className="text-primary hover:bg-primary-bg rounded p-1.5 text-xs transition-colors"
                >
                  <i className="fa-regular fa-copy"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
