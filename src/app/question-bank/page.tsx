'use client';

import React, { useState, useMemo } from 'react';
import type { Question } from '@/components/instructor/question-bank/types';
import { QuestionBankSidebar } from '@/components/instructor/question-bank/QuestionBankSidebar';
import { QuestionBankHeader } from '@/components/instructor/question-bank/QuestionBankHeader';
import { AddQuestionModal } from '@/components/instructor/question-bank/AddQuestionModal';
import { AIQuestionModal } from '@/components/instructor/question-bank/AIQuestionModal';

const INITIAL_QUESTIONS: Question[] = [
  {
    id: 'Q-1001',
    content: "Kỹ năng 'Lắng nghe chủ động' trong Sales B2B bao gồm những yếu tố nào?",
    type: 'MCQ',
    diff: 'Medium',
    tags: ['Sales', 'Giao tiếp'],
  },
  {
    id: 'Q-1002',
    content:
      'Hãy phân tích và viết kịch bản xử lý từ chối khi khách hàng chê giá sản phẩm quá cao.',
    type: 'Essay',
    diff: 'Hard',
    tags: ['Sales', 'Kịch bản'],
  },
  {
    id: 'Q-1003',
    content:
      'Trong Python, thư viện nào được sử dụng phổ biến nhất để xử lý dữ liệu dạng bảng (Dataframe)?',
    type: 'MCQ',
    diff: 'Easy',
    tags: ['Python', 'Data'],
  },
  {
    id: 'Q-1004',
    content: 'Mật khẩu an toàn theo tiêu chuẩn bảo mật ISO 27001 cần tối thiểu bao nhiêu ký tự?',
    type: 'MCQ',
    diff: 'Easy',
    tags: ['Security'],
  },
  {
    id: 'Q-1005',
    content:
      'Trình bày sự khác biệt giữa phương thức truyền dữ liệu TCP và UDP. Cho ví dụ thực tế.',
    type: 'Essay',
    diff: 'Medium',
    tags: ['IT', 'Network'],
  },
  {
    id: 'Q-1006',
    content:
      'Khách hàng B2B thường ra quyết định mua hàng dựa trên cảm xúc nhiều hơn logic. (Đúng hay Sai?)',
    type: 'TrueFalse',
    diff: 'Easy',
    tags: ['Sales'],
  },
];

export default function QuestionBankPage() {
  const [questions] = useState<Question[]>(INITIAL_QUESTIONS);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [diffFilter, setDiffFilter] = useState('all');
  const [courseFilter, setCourseFilter] = useState('all');

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchSearch =
        q.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.id.toLowerCase().includes(searchQuery.toLowerCase());
      const matchType = typeFilter === 'all' || q.type === typeFilter;
      const matchDiff = diffFilter === 'all' || q.diff === diffFilter;
      const matchCourse = courseFilter === 'all' || q.tags.includes(courseFilter);
      return matchSearch && matchType && matchDiff && matchCourse;
    });
  }, [questions, searchQuery, typeFilter, diffFilter, courseFilter]);

  const mcqCount = questions.filter((q) => q.type === 'MCQ').length;
  const essayCount = questions.filter((q) => q.type === 'Essay').length;

  const showToast = (msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast({ visible: false, message: '' }), 3000);
  };

  const getDiffStyle = (diff: string) => {
    if (diff === 'Easy')
      return { text: 'Dễ', classes: 'text-[#137333] border-[#CEEAD6] bg-[#E6F4EA]' };
    if (diff === 'Medium')
      return { text: 'TB', classes: 'text-[#B06000] border-[#FCE8B2] bg-[#FEF7E0]' };
    if (diff === 'Hard')
      return { text: 'Khó', classes: 'text-[#B31412] border-[#FAD2CF] bg-[#FCE8E6]' };
    return { text: diff, classes: '' };
  };

  const getTypeIcon = (type: string) => {
    if (type === 'MCQ')
      return (
        <>
          <span className="material-symbols-outlined text-[16px] text-[#1A73E8]">
            format_list_bulleted
          </span>{' '}
          Trắc nghiệm
        </>
      );
    if (type === 'Essay')
      return (
        <>
          <span className="material-symbols-outlined text-[16px] text-[#EA4335]">edit_note</span> Tự
          luận
        </>
      );
    if (type === 'TrueFalse')
      return (
        <>
          <span className="material-symbols-outlined text-[16px] text-[#34A853]">rule</span>{' '}
          Đúng/Sai
        </>
      );
  };
  const handleSaveQuestion = () => {
    setIsAddModalOpen(false);
    showToast('Đã lưu câu hỏi thành công!');
  };

  const handleSaveAI = () => {
    setIsAIModalOpen(false);
    showToast('Đã thêm 2 câu hỏi từ AI vào Ngân hàng!');
  };

  return (
    <>
      <div
        style={{ fontFamily: "'Roboto', sans-serif" }}
        className="flex h-screen overflow-hidden bg-[#F8F9FA] text-[#202124] antialiased"
      >
        <QuestionBankSidebar />

        <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
          <QuestionBankHeader />

          <div className="flex flex-1 flex-col overflow-hidden px-8 py-6">
            <div className="mb-5 flex items-center justify-between">
              <h1 className="text-[22px] font-normal text-[#202124]">
                Ngân hàng Câu hỏi (Question Bank)
              </h1>
              <div className="flex gap-3">
                <button
                  onClick={() => showToast('Đang tải file mẫu Import Excel...')}
                  className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]"
                >
                  <span className="material-symbols-outlined text-[18px]">upload_file</span> Nhập
                  Excel
                </button>
                <button
                  onClick={() => setIsAIModalOpen(true)}
                  className="flex items-center gap-2 rounded-[4px] border border-[#E8D3FD] bg-[#F3E8FD] px-4 py-2 text-[13px] font-medium text-[#9334E6] transition-all hover:bg-[#E8D3FD] hover:shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
                >
                  <span className="material-symbols-outlined text-[18px]">auto_awesome</span> Tạo
                  câu hỏi bằng AI
                </button>
                <button
                  onClick={() => setIsAddModalOpen(true)}
                  className="flex items-center gap-2 rounded-[4px] border border-transparent bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#174EA6]"
                >
                  <span className="material-symbols-outlined text-[18px]">add</span> Thêm thủ công
                </button>
              </div>
            </div>

            {/* KPI CARDS */}
            <div className="mb-6 flex gap-6">
              <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4 px-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F0FE] text-[#1A73E8]">
                  <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                    source
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-[24px] leading-none font-normal text-[#202124]">
                    1,245
                  </h4>
                  <p className="m-0 text-[12px] font-medium text-[#5F6368] uppercase">
                    Tổng số câu hỏi
                  </p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4 px-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E6F4EA] text-[#34A853]">
                  <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                    check_box
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-[24px] leading-none font-normal text-[#202124]">
                    {mcqCount + 978}
                  </h4>
                  <p className="m-0 text-[12px] font-medium text-[#5F6368] uppercase">
                    Câu hỏi Trắc nghiệm (MCQ)
                  </p>
                </div>
              </div>
              <div className="flex flex-1 items-center gap-4 rounded-lg border border-[#DADCE0] bg-white p-4 px-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FCE8E6] text-[#EA4335]">
                  <span className="material-symbols-outlined text-[24px] [font-variation-settings:'FILL'_1]">
                    edit_note
                  </span>
                </div>
                <div>
                  <h4 className="mb-1 text-[24px] leading-none font-normal text-[#202124]">
                    {essayCount + 263}
                  </h4>
                  <p className="m-0 text-[12px] font-medium text-[#5F6368] uppercase">
                    Câu hỏi Tự luận (Essay)
                  </p>
                </div>
              </div>
            </div>

            {/* TOOLBAR */}
            <div className="mb-4 flex items-center justify-between rounded-lg border border-[#DADCE0] bg-white p-3 px-4">
              <div className="flex items-center gap-3">
                <div className="relative flex w-[250px] items-center">
                  <span className="material-symbols-outlined absolute left-2.5 text-[20px] text-[#5F6368]">
                    search
                  </span>
                  <input
                    type="text"
                    className="w-full rounded border border-[#DADCE0] py-2 pr-3 pl-[36px] text-[13px] transition-colors outline-none focus:border-[#1A73E8]"
                    placeholder="Tìm ID hoặc nội dung..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <select
                  className="min-w-[180px] rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">Tất cả Loại câu hỏi</option>
                  <option value="MCQ">Trắc nghiệm</option>
                  <option value="Essay">Tự luận</option>
                  <option value="TrueFalse">Đúng / Sai</option>
                </select>
                <select
                  className="min-w-[150px] rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none"
                  value={diffFilter}
                  onChange={(e) => setDiffFilter(e.target.value)}
                >
                  <option value="all">Mọi độ khó</option>
                  <option value="Easy">Dễ</option>
                  <option value="Medium">Trung bình</option>
                  <option value="Hard">Khó</option>
                </select>
                <select
                  className="min-w-[200px] rounded border border-[#DADCE0] bg-white px-3 py-2 text-[13px] outline-none"
                  value={courseFilter}
                  onChange={(e) => setCourseFilter(e.target.value)}
                >
                  <option value="all">Tất cả Khóa học (Tags)</option>
                  <option value="Sales">Sales B2B</option>
                  <option value="Python">Lập trình Python</option>
                  <option value="Security">Bảo mật thông tin</option>
                </select>
              </div>
            </div>

            {/* TABLE CONTAINER */}
            <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
              <div className="custom-scrollbar flex-1 overflow-y-auto">
                <table className="w-full border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-white shadow-[0_1px_0_#DADCE0]">
                    <tr>
                      <th className="w-[48px] border-b border-[#DADCE0] px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 cursor-pointer accent-[#1A73E8]"
                        />
                      </th>
                      <th className="w-[80px] border-b border-[#DADCE0] px-4 py-3 text-[12px] font-medium whitespace-nowrap text-[#5F6368]">
                        Mã ID
                      </th>
                      <th className="border-b border-[#DADCE0] px-4 py-3 text-[12px] font-medium whitespace-nowrap text-[#5F6368]">
                        Nội dung câu hỏi
                      </th>
                      <th className="border-b border-[#DADCE0] px-4 py-3 text-[12px] font-medium whitespace-nowrap text-[#5F6368]">
                        Phân loại & Chủ đề
                      </th>
                      <th className="border-b border-[#DADCE0] px-4 py-3 text-[12px] font-medium whitespace-nowrap text-[#5F6368]">
                        Độ khó
                      </th>
                      <th className="border-b border-[#DADCE0] px-4 py-3 pr-6 text-right text-[12px] font-medium text-[#5F6368]">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredQuestions.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-10 text-center text-[#5F6368]">
                          Không có dữ liệu.
                        </td>
                      </tr>
                    ) : (
                      filteredQuestions.map((q) => {
                        const diffObj = getDiffStyle(q.diff);
                        return (
                          <tr
                            key={q.id}
                            className="group border-b border-[#DADCE0] transition-colors hover:bg-[#F1F3F4]"
                          >
                            <td className="px-4 py-4 text-center align-top">
                              <input
                                type="checkbox"
                                className="h-4 w-4 cursor-pointer accent-[#1A73E8]"
                              />
                            </td>
                            <td className="px-4 py-4 align-top">
                              <span className="font-mono text-[13px] text-[#5F6368]">{q.id}</span>
                            </td>
                            <td className="max-w-[400px] px-4 py-4 align-top">
                              <div
                                className="mb-2 line-clamp-2 text-[14px] leading-[1.5] font-medium text-[#202124]"
                                title={q.content}
                              >
                                {q.content}
                              </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <div className="mb-1.5 flex items-center gap-1 text-[12px]">
                                {getTypeIcon(q.type)}
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                {q.tags.map((t) => (
                                  <span
                                    key={t}
                                    className="inline-flex items-center rounded border border-[#DADCE0] bg-white px-2 py-0.5 text-[11px] font-medium text-[#5F6368]"
                                  >
                                    {t}
                                  </span>
                                ))}
                              </div>
                            </td>
                            <td className="px-4 py-4 align-top">
                              <span
                                className={`inline-flex items-center rounded border px-2 py-0.5 text-[11px] font-medium ${diffObj.classes}`}
                              >
                                {diffObj.text}
                              </span>
                            </td>
                            <td className="px-4 py-4 pr-6 text-right align-top">
                              <div className="flex justify-end gap-1 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                                <button
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-[#5F6368] transition-colors hover:bg-[#5F6368]/10 hover:text-[#202124]"
                                  title="Xem chi tiết & Sửa"
                                  onClick={() => setIsAddModalOpen(true)}
                                >
                                  <span className="material-symbols-outlined text-[20px]">
                                    edit
                                  </span>
                                </button>
                                <button
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-[#5F6368] transition-colors hover:bg-[#5F6368]/10 hover:text-[#202124]"
                                  title="Nhân bản"
                                >
                                  <span className="material-symbols-outlined text-[20px]">
                                    content_copy
                                  </span>
                                </button>
                                <button
                                  className="flex h-8 w-8 items-center justify-center rounded-full bg-transparent text-[#5F6368] transition-colors hover:bg-[#5F6368]/10 hover:text-[#EA4335]"
                                  title="Xóa"
                                >
                                  <span className="material-symbols-outlined text-[20px] text-[#EA4335]">
                                    delete
                                  </span>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex items-center justify-between border-t border-[#DADCE0] bg-white px-6 py-3 text-[12px] text-[#5F6368]">
                <span>
                  Đang hiển thị{' '}
                  <strong className="text-[#202124]">{filteredQuestions.length}</strong> câu hỏi
                </span>
                <div className="flex items-center gap-4">
                  <button className="flex h-6 w-6 items-center justify-center rounded-full text-[#5F6368] disabled:opacity-30">
                    <span className="material-symbols-outlined">chevron_left</span>
                  </button>
                  <button className="flex h-6 w-6 items-center justify-center rounded-full text-[#5F6368] hover:bg-[#F1F3F4] hover:text-[#202124]">
                    <span className="material-symbols-outlined">chevron_right</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* MODALS */}
        <AddQuestionModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveQuestion}
        />

        <AIQuestionModal
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onSave={handleSaveAI}
        />

        {/* TOAST NOTIFICATION */}
        <div
          className={`fixed bottom-6 left-6 z-[3000] flex items-center gap-3 rounded-[4px] bg-[#323232] px-6 py-[14px] text-white shadow-[0_4px_6px_0_rgba(60,64,67,0.15),0_12px_16px_0_rgba(60,64,67,0.15)] transition-transform duration-300 ${toast.visible ? 'translate-y-0' : 'translate-y-[100px]'}`}
        >
          <span className="material-symbols-outlined text-[24px] text-[#81C995]">check_circle</span>
          <span className="text-[14px]">{toast.message}</span>
        </div>
      </div>
    </>
  );
}
