import React from 'react';
import Link from 'next/link';

export const ActivityWidgets = () => {
  return (
    <div className="flex min-w-0 flex-1 flex-col gap-6">
      {/* Khóa học phụ trách */}
      <div className="clean-card flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
          <h2 className="text-[14px] font-bold text-slate-800">Khóa học phụ trách (3)</h2>
          <Link
            href="#"
            className="hover:border-primary hover:text-primary flex items-center gap-1.5 rounded border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition-colors"
          >
            <i className="fa-solid fa-plus"></i> Soạn giáo trình
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th scope="col" className="w-1/2">
                  Tên khóa học
                </th>
                <th scope="col">Trạng thái</th>
                <th scope="col">Học viên</th>
                <th scope="col">Tiến độ</th>
                <th scope="col" className="text-right">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-10 flex-shrink-0 items-center justify-center rounded border border-slate-200 bg-slate-100">
                      <i className="fa-solid fa-sitemap text-slate-400"></i>
                    </div>
                    <div className="min-w-0">
                      <div className="hover:text-primary cursor-pointer truncate text-[13px] font-semibold text-slate-800 transition-colors">
                        System Design: Phân tích hệ thống lớn
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-slate-500">DEV-SYS-01</div>
                    </div>
                  </div>
                </td>
                <td className="no-wrap">
                  <span className="text-success inline-flex items-center gap-1 rounded border border-green-100 bg-green-50 px-2 py-0.5 text-[11px] font-medium">
                    <span className="bg-success h-1.5 w-1.5 rounded-full"></span> Đang chạy
                  </span>
                </td>
                <td className="no-wrap">
                  <div className="flex items-center -space-x-1.5">
                    <div className="z-20 h-6 w-6 rounded-full border-2 border-white bg-slate-200"></div>
                    <div className="z-10 h-6 w-6 rounded-full border-2 border-white bg-slate-300"></div>
                    <span className="ml-2 text-[11px] font-semibold text-slate-500">+154</span>
                  </div>
                </td>
                <td className="no-wrap">
                  <div className="flex w-24 items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                      <div className="bg-primary h-full" style={{ width: '65%' }}></div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-600">65%</span>
                  </div>
                </td>
                <td className="no-wrap text-right">
                  <button className="hover:text-primary px-1.5 text-slate-400 transition-colors">
                    <i className="fa-solid fa-pen"></i>
                  </button>
                  <button className="hover:text-primary px-1.5 text-slate-400 transition-colors">
                    <i className="fa-solid fa-chart-line"></i>
                  </button>
                </td>
              </tr>
              {/* Thêm các row khác ở đây nếu cần */}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cần hỗ trợ học viên */}
      <div className="clean-card flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-[14px] font-bold text-slate-800">Cần hỗ trợ học viên (5)</h2>
          <Link href="#" className="text-primary text-xs font-medium hover:underline">
            Xem tất cả
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          <div className="flex gap-4 p-5 transition-colors hover:bg-slate-50">
            <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-slate-200 text-xs font-bold text-slate-500">
              VA
            </div>
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-[13px] font-semibold text-slate-800">Nguyễn Văn A</span>
                <span className="text-[10px] text-slate-400">• 2 giờ trước</span>
              </div>
              <div className="mb-2 truncate font-mono text-[11px] text-slate-500">
                Khoá: System Design / Bài 4
              </div>
              <h4 className="hover:text-primary mb-1 cursor-pointer text-[13px] font-semibold text-slate-800 transition-colors">
                Xử lý Split-Brain trong Active-Active DB?
              </h4>
              <p className="text-truncate-2 mb-3 text-[12px] text-slate-600">
                Nếu đứt mạng giữa 2 node Master thì khi kết nối lại giải quyết conflict như thế nào
                ạ? Mong anh giải đáp.
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Trả lời nhanh..."
                  className="focus:border-primary focus:ring-primary flex-1 rounded border border-slate-200 bg-white px-3 py-1.5 text-[12px] outline-none focus:ring-1"
                />
                <button className="rounded border border-slate-300 bg-white px-3 py-1.5 text-[12px] font-medium text-slate-700 transition-colors hover:bg-slate-50">
                  Gửi
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
