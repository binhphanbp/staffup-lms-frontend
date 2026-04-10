'use client';

import React, { useState, useMemo } from 'react';
import type { Submission } from '@/components/instructor/grading/types';
import { GradingWorkspace } from '@/components/instructor/grading/GradingWorkspace';

const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 101,
    name: 'Trần Thị Bình',
    email: 'tran.binh@company.com',
    course: 'Kỹ năng Bán hàng B2B',
    assignment: 'Phân tích Kịch bản chốt Sale',
    submitDate: '2 giờ trước',
    status: 'AIGraded',
    aiScore: 85,
    manualScore: null,
  },
  {
    id: 102,
    name: 'Lê Minh Cường',
    email: 'le.cuong@company.com',
    course: 'Lập trình Python',
    assignment: 'Viết script crawl dữ liệu',
    submitDate: 'Hôm qua',
    status: 'Pending',
    aiScore: null,
    manualScore: null,
  },
  {
    id: 103,
    name: 'Hoàng Tùng',
    email: 'hoang.tung@company.com',
    course: 'Kỹ năng Giao tiếp',
    assignment: 'Xử lý xung đột nhóm',
    submitDate: 'Hôm qua',
    status: 'AIGraded',
    aiScore: 92,
    manualScore: null,
  },
  {
    id: 104,
    name: 'Phạm Thu Dung',
    email: 'pham.dung@company.com',
    course: 'Kỹ năng Bán hàng B2B',
    assignment: 'Phân tích Kịch bản chốt Sale',
    submitDate: '2 ngày trước',
    status: 'Graded',
    aiScore: 75,
    manualScore: 80,
  },
  {
    id: 105,
    name: 'Nguyễn Văn An',
    email: 'nguyen.an@company.com',
    course: 'Lập trình Python',
    assignment: 'Viết script crawl dữ liệu',
    submitDate: '3 ngày trước',
    status: 'Pending',
    aiScore: null,
    manualScore: null,
  },
];

export default function GradingEvaluationPage() {
  const [submissions, setSubmissions] = useState<Submission[]>(INITIAL_SUBMISSIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [courseFilter, setCourseFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Workspace State
  const [activeSubId, setActiveSubId] = useState<number | null>(null);
  const [draftScore, setDraftScore] = useState<string>('');
  const [draftFeedback, setDraftFeedback] = useState<string>('');
  const [toast, setToast] = useState({ visible: false, message: '' });

  const activeSub = submissions.find((s) => s.id === activeSubId);
  const pendingCount = submissions.filter((s) => s.status !== 'Graded').length;

  const filteredSubmissions = useMemo(() => {
    return submissions.filter((sub) => {
      const matchSearch = sub.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchCourse = courseFilter === 'all' || sub.course.includes(courseFilter);
      const matchStatus = statusFilter === 'all' || sub.status === statusFilter;
      return matchSearch && matchCourse && matchStatus;
    });
  }, [submissions, searchQuery, courseFilter, statusFilter]);

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const openWorkspace = (id: number) => {
    const sub = submissions.find((s) => s.id === id);
    if (!sub) return;
    setActiveSubId(id);
    if (sub.status === 'Graded') {
      setDraftScore(sub.manualScore?.toString() || '');
      setDraftFeedback('Bài làm đạt yêu cầu. Lập luận tốt.');
    } else {
      setDraftScore('');
      setDraftFeedback('');
    }
  };

  const handleApplyAI = () => {
    if (activeSub && activeSub.aiScore) {
      setDraftScore(activeSub.aiScore.toString());
      setDraftFeedback(
        'Học viên nắm vững lý thuyết Consultative Selling và có ví dụ tính toán ROI rõ ràng.\n- Điểm mạnh: Xử lý từ chối logic.\n- Cần cải thiện: Phần giới thiệu thêm thông tin đối thủ.',
      );
    } else {
      alert('Bài này chưa có dữ liệu AI chấm.');
    }
  };

  const handleSubmitGrade = () => {
    if (!draftScore) {
      alert('Vui lòng nhập điểm số chính thức.');
      return;
    }
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === activeSubId ? { ...s, status: 'Graded', manualScore: parseInt(draftScore) } : s,
      ),
    );
    setActiveSubId(null);
    showToast('Đã lưu điểm và gửi nhận xét đến học viên thành công!');
  };

  return (
    <>
      <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        <div className="mb-5 flex items-center justify-between">
          <h1 className="m-0 text-[22px] font-normal text-[#202124]">
            Chấm bài tự luận & Đánh giá
          </h1>
          <button
            onClick={() => showToast('AI đang quét và chấm điểm 12 bài viết. Vui lòng đợi...')}
            className="flex items-center gap-2 rounded border border-[#E8D3FD] bg-[#F3E8FD] px-4 py-2 text-[13px] font-medium text-[#9334E6] transition-all hover:shadow-[0_1px_2px_0_rgba(60,64,67,0.3)]"
          >
            <span className="material-symbols-outlined text-[20px]">auto_awesome</span> Chấm tự động
            tất cả bằng AI
          </button>
        </div>

        {/* KPI CARDS */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4 px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF7E0] text-[#B06000]">
              <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                pending_actions
              </span>
            </div>
            <div>
              <h4 className="mb-1 text-[24px] leading-none font-normal text-[#202124]">
                {pendingCount}
              </h4>
              <p className="m-0 text-[12px] font-medium text-[#5F6368] uppercase">
                Bài nộp chờ chấm
              </p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4 px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FE] text-[#1A73E8]">
              <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                rule
              </span>
            </div>
            <div>
              <h4 className="mb-1 text-[24px] leading-none font-normal text-[#202124]">45</h4>
              <p className="m-0 text-[12px] font-medium text-[#5F6368] uppercase">
                Đã chấm (Tuần này)
              </p>
            </div>
          </div>
          <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#E8D3FD] bg-gradient-to-r from-white to-[#F3E8FD] p-4 px-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#F3E8FD] text-[#9334E6]">
              <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                robot_2
              </span>
            </div>
            <div>
              <h4 className="mb-1 text-[24px] leading-none font-normal text-[#9334E6]">95%</h4>
              <p className="m-0 text-[12px] font-medium text-[#9334E6] uppercase">
                Độ chính xác của AI
              </p>
            </div>
          </div>
        </div>

        {/* TOOLBAR */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2">
            <span className="material-symbols-outlined text-[20px] text-[#5F6368]">search</span>
            <input
              type="text"
              className="flex-1 border-none bg-transparent text-[13px] outline-none placeholder:text-[#5F6368]"
              placeholder="Tìm tên học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <select
            className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none"
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
          >
            <option value="all">Tất cả Khóa học</option>
            <option value="Bán hàng">Kỹ năng Bán hàng B2B</option>
            <option value="Python">Lập trình Python</option>
            <option value="Giao tiếp">Kỹ năng Giao tiếp</option>
          </select>
          <select
            className="rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tất cả Trạng thái</option>
            <option value="Pending">Chờ chấm</option>
            <option value="AIGraded">AI đã chấm</option>
            <option value="Graded">Đã hoàn tất</option>
          </select>
        </div>

        {/* TABLE */}
        <div className="flex-1 overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
          <table className="w-full border-collapse">
            <thead className="bg-[#F8F9FA]">
              <tr>
                <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                  Học viên
                </th>
                <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                  Bài tập / Khóa học
                </th>
                <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                  Ngày nộp
                </th>
                <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                  Trạng thái
                </th>
                <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                  Điểm AI dự kiến
                </th>
                <th className="border-b border-[#DADCE0] px-4 py-3 text-left text-[13px] font-medium text-[#5F6368]">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.map((sub) => (
                <tr key={sub.id} className="border-b border-[#F1F3F4] hover:bg-[#F8F9FA]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#E8F0FE] text-[13px] font-medium text-[#1A73E8] uppercase">
                        {sub.name
                          .split(' ')
                          .slice(-2)
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div>
                        <p className="m-0 text-[13px] font-medium text-[#202124]">{sub.name}</p>
                        <span className="text-[11px] text-[#5F6368]">{sub.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="cursor-pointer text-[13px] font-medium text-[#1A73E8] hover:underline"
                      onClick={() => openWorkspace(sub.id)}
                    >
                      {sub.assignment}
                    </span>
                    <div className="mt-0.5 text-[11px] text-[#5F6368]">Khóa: {sub.course}</div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#202124]">{sub.submitDate}</td>
                  <td className="px-4 py-3">
                    {sub.status === 'Pending' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#FFF3E0] px-2 py-1 text-[11px] font-medium text-[#E65100]">
                        <span className="material-symbols-outlined text-[12px]">schedule</span> Chờ
                        chấm
                      </span>
                    )}
                    {sub.status === 'AIGraded' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#F3E8FD] px-2 py-1 text-[11px] font-medium text-[#9334E6]">
                        <span className="material-symbols-outlined text-[12px]">auto_awesome</span>{' '}
                        AI đã chấm
                      </span>
                    )}
                    {sub.status === 'Graded' && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#E6F4EA] px-2 py-1 text-[11px] font-medium text-[#137333]">
                        <span className="material-symbols-outlined text-[12px]">done_all</span> Đã
                        hoàn tất
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {sub.aiScore ? (
                      <span className="flex items-center gap-1 font-medium text-[#9334E6]">
                        <span className="material-symbols-outlined text-[16px]">auto_awesome</span>{' '}
                        {sub.aiScore}/100
                      </span>
                    ) : sub.status === 'Graded' ? (
                      <span className="font-medium text-[#34A853]">{sub.manualScore}/100</span>
                    ) : (
                      <span className="text-[#5F6368]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => openWorkspace(sub.id)}
                      className={`flex items-center justify-center gap-2 rounded-[4px] px-4 py-2 text-[13px] font-medium transition-colors ${sub.status === 'Graded' ? 'border border-[#DADCE0] bg-transparent text-[#5F6368] hover:bg-[#F1F3F4]' : 'bg-[#1A73E8] text-white hover:bg-[#174EA6]'}`}
                    >
                      {sub.status === 'Graded' ? 'Xem lại' : 'Chấm bài'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <GradingWorkspace
        activeSub={activeSub}
        onClose={() => setActiveSubId(null)}
        draftScore={draftScore}
        setDraftScore={setDraftScore}
        draftFeedback={draftFeedback}
        setDraftFeedback={setDraftFeedback}
        onApplyAI={handleApplyAI}
        onSubmitGrade={handleSubmitGrade}
      />

      {/* TOAST */}
      <div
        className={`fixed bottom-6 left-6 z-[3000] flex items-center gap-3 rounded-[4px] bg-[#323232] px-6 py-[14px] text-white shadow-lg transition-transform duration-300 ${toast.visible ? 'translate-y-0' : 'translate-y-[100px]'}`}
      >
        <span className="material-symbols-outlined text-[24px] text-[#81C995]">check_circle</span>
        <span className="text-[14px]">{toast.message}</span>
      </div>
    </>
  );
}
