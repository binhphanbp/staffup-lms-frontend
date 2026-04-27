'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { toast } from '@/lib/toast';
import {
  companyDocumentApi,
  type CompanyDocument,
  type CompanyDocumentListParams,
} from '@/services/company-document.service';

// ============================================================
// Company Document Management — Admin Page
// ============================================================

interface DocumentFormData {
  title: string;
  content: string;
  category: string;
  isActive: boolean;
}

const EMPTY_FORM: DocumentFormData = {
  title: '',
  content: '',
  category: '',
  isActive: true,
};

export default function CompanyDocumentsPage() {
  // ----- State -----
  const [documents, setDocuments] = useState<Omit<CompanyDocument, 'content'>[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: 10, totalPages: 0 });
  const [categories, setCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  // Filters
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterActive, setFilterActive] = useState('');
  const [page, setPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<CompanyDocument | null>(null);
  const [form, setForm] = useState<DocumentFormData>(EMPTY_FORM);
  const [isSaving, setIsSaving] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);

  // Delete dialog
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Indexing
  const [indexingId, setIndexingId] = useState<string | null>(null);
  const [indexingAll, setIndexingAll] = useState(false);

  // ----- Toast -----
  const showToast = (message: string, type: 'success' | 'error' = 'success') =>
    toast[type](message);

  // ----- Data fetching -----
  const fetchDocuments = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: CompanyDocumentListParams = { page, limit: 10 };
      if (search) params.search = search;
      if (filterCategory) params.category = filterCategory;
      if (filterActive) params.isActive = filterActive;

      const result = await companyDocumentApi.getDocuments(params);
      setDocuments(result.data);
      setMeta(result.meta);
    } catch {
      showToast('Không thể tải danh sách tài liệu.', 'error');
    } finally {
      setIsLoading(false);
    }
  }, [page, search, filterCategory, filterActive]);

  const fetchCategories = useCallback(async () => {
    try {
      const cats = await companyDocumentApi.getCategories();
      setCategories(cats);
    } catch {
      // silent
    }
  }, []);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // ----- Search with debounce -----
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // ----- CRUD handlers -----
  const handleOpenCreate = () => {
    setEditingDoc(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  };

  const handleOpenEdit = async (id: string) => {
    try {
      const doc = await companyDocumentApi.getDocumentById(id);
      setEditingDoc(doc);
      setForm({
        title: doc.title,
        content: doc.content || '',
        category: doc.category || '',
        isActive: doc.isActive,
      });
      setShowModal(true);
    } catch {
      showToast('Không thể tải tài liệu.', 'error');
    }
  };

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      showToast('Vui lòng nhập tiêu đề và nội dung.', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        title: form.title,
        content: form.content,
        category: form.category || undefined,
        isActive: form.isActive,
      };

      if (editingDoc) {
        await companyDocumentApi.updateDocument(editingDoc.id, payload);
        showToast('Cập nhật tài liệu thành công!');
      } else {
        await companyDocumentApi.createDocument(payload);
        showToast('Tạo tài liệu thành công! Tài liệu đã được đánh chỉ mục tự động.');
      }

      setShowModal(false);
      fetchDocuments();
      fetchCategories();
    } catch {
      showToast('Không thể lưu tài liệu.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    try {
      const text = await companyDocumentApi.extractTextFromFile(file);
      setForm((prev) => ({
        ...prev,
        content: prev.content ? prev.content + '\n' + text : text,
        title: prev.title || file.name.split('.').slice(0, -1).join('.') || file.name,
      }));
      showToast('Đã trích xuất nội dung từ file.');
    } catch {
      showToast('Không thể trích xuất văn bản từ file. Vui lòng thử file khác.', 'error');
    } finally {
      setIsExtracting(false);
      e.target.value = ''; // reset file input
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await companyDocumentApi.deleteDocument(deleteTarget.id);
      showToast(`Đã xoá tài liệu "${deleteTarget.title}".`);
      setDeleteTarget(null);
      fetchDocuments();
    } catch {
      showToast('Không thể xoá tài liệu.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleIndex = async (id: string) => {
    setIndexingId(id);
    try {
      const result = await companyDocumentApi.indexDocument(id);
      showToast(`Đã đánh chỉ mục thành công: ${result.chunks} chunks.`);
      fetchDocuments();
    } catch {
      showToast('Không thể đánh chỉ mục tài liệu.', 'error');
    } finally {
      setIndexingId(null);
    }
  };

  const handleIndexAll = async () => {
    setIndexingAll(true);
    try {
      const result = await companyDocumentApi.indexAllDocuments();
      showToast(`Đã đánh chỉ mục ${result.indexed} tài liệu (${result.totalChunks} chunks).`);
      fetchDocuments();
    } catch {
      showToast('Không thể đánh chỉ mục.', 'error');
    } finally {
      setIndexingAll(false);
    }
  };

  // ----- Render -----
  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <h1 className="m-0 flex items-center gap-2 text-[22px] font-normal text-[#202124]">
            <span className="material-symbols-outlined text-[28px] text-[#9334E6] [font-variation-settings:'FILL'_1]">
              description
            </span>
            Quản lý Tài liệu Công ty
          </h1>
          <div className="flex gap-3">
            <button
              onClick={handleIndexAll}
              disabled={indexingAll}
              className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4] hover:text-[#202124] disabled:opacity-50"
            >
              <span
                className={`material-symbols-outlined text-[18px] ${indexingAll ? 'animate-spin' : ''}`}
              >
                sync
              </span>
              {indexingAll ? 'Đang index...' : 'Index tất cả'}
            </button>
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-2 rounded-[4px] border border-transparent bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#174EA6]"
            >
              <span className="material-symbols-outlined text-[18px]">add</span> Thêm tài liệu
            </button>
          </div>
        </div>

        {/* Info banner */}
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#C8E6C9] bg-[#E8F5E9] px-4 py-3">
          <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#2E7D32] [font-variation-settings:'FILL'_1]">
            info
          </span>
          <p className="m-0 text-[13px] leading-[1.5] text-[#2E7D32]">
            Tài liệu công ty được sử dụng bởi <strong>AI Chatbot (RAG)</strong> để trả lời câu hỏi
            của nhân viên. Khi tạo hoặc cập nhật tài liệu, hệ thống sẽ tự động đánh chỉ mục
            (indexing) để chatbot có thể tìm kiếm nội dung.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative max-w-[360px] min-w-[200px] flex-1">
            <span className="material-symbols-outlined absolute top-1/2 left-3 -translate-y-1/2 text-[20px] text-[#5F6368]">
              search
            </span>
            <input
              type="text"
              placeholder="Tìm kiếm theo tiêu đề..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-[4px] border border-[#DADCE0] bg-white pr-3 pl-10 text-[14px] text-[#202124] transition-colors outline-none focus:border-[#1A73E8]"
            />
          </div>
          <select
            value={filterCategory}
            onChange={(e) => {
              setFilterCategory(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-[4px] border border-[#DADCE0] bg-white px-3 text-[14px] text-[#202124] outline-none focus:border-[#1A73E8]"
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <select
            value={filterActive}
            onChange={(e) => {
              setFilterActive(e.target.value);
              setPage(1);
            }}
            className="h-10 rounded-[4px] border border-[#DADCE0] bg-white px-3 text-[14px] text-[#202124] outline-none focus:border-[#1A73E8]"
          >
            <option value="">Tất cả trạng thái</option>
            <option value="true">Đang hoạt động</option>
            <option value="false">Đã vô hiệu</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
          <table className="w-full border-collapse text-[14px]">
            <thead>
              <tr className="border-b border-[#DADCE0] bg-[#F8F9FA]">
                <th className="px-4 py-3 text-left font-medium text-[#5F6368]">Tiêu đề</th>
                <th className="px-4 py-3 text-left font-medium text-[#5F6368]">Danh mục</th>
                <th className="px-4 py-3 text-center font-medium text-[#5F6368]">Chunks</th>
                <th className="px-4 py-3 text-center font-medium text-[#5F6368]">Trạng thái</th>
                <th className="px-4 py-3 text-left font-medium text-[#5F6368]">Cập nhật</th>
                <th className="px-4 py-3 text-center font-medium text-[#5F6368]">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#5F6368]">
                    <span className="material-symbols-outlined animate-spin text-[24px]">
                      progress_activity
                    </span>
                    <p className="mt-2">Đang tải...</p>
                  </td>
                </tr>
              ) : documents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-[#5F6368]">
                    <span className="material-symbols-outlined text-[48px] text-[#DADCE0]">
                      description
                    </span>
                    <p className="mt-2">Chưa có tài liệu nào.</p>
                  </td>
                </tr>
              ) : (
                documents.map((doc) => (
                  <tr
                    key={doc.id}
                    className="border-b border-[#DADCE0] last:border-b-0 hover:bg-[#F8F9FA]"
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => handleOpenEdit(doc.id)}
                        className="cursor-pointer border-none bg-transparent p-0 text-left font-medium text-[#1A73E8] hover:underline"
                      >
                        {doc.title}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-[#5F6368]">
                      {doc.category ? (
                        <span className="inline-block rounded-full bg-[#E8F0FE] px-2.5 py-0.5 text-[12px] font-medium text-[#1A73E8]">
                          {doc.category}
                        </span>
                      ) : (
                        <span className="text-[#BDC1C6]">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block min-w-[32px] rounded-full px-2 py-0.5 text-[12px] font-medium ${
                          doc.chunkCount > 0
                            ? 'bg-[#E8F5E9] text-[#2E7D32]'
                            : 'bg-[#FFF3E0] text-[#E65100]'
                        }`}
                      >
                        {doc.chunkCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      {doc.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F5E9] px-2.5 py-0.5 text-[12px] font-medium text-[#2E7D32]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#2E7D32]"></span>
                          Hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-[#F3E8FD] px-2.5 py-0.5 text-[12px] font-medium text-[#7B1FA2]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#7B1FA2]"></span>
                          Vô hiệu
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[#5F6368]">
                      {new Date(doc.updatedAt).toLocaleDateString('vi-VN')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          title="Đánh chỉ mục lại"
                          onClick={() => handleIndex(doc.id)}
                          disabled={indexingId === doc.id}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#E8F0FE] hover:text-[#1A73E8] disabled:opacity-50"
                        >
                          <span
                            className={`material-symbols-outlined text-[18px] ${indexingId === doc.id ? 'animate-spin' : ''}`}
                          >
                            sync
                          </span>
                        </button>
                        <button
                          title="Chỉnh sửa"
                          onClick={() => handleOpenEdit(doc.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#E8F0FE] hover:text-[#1A73E8]"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>
                        <button
                          title="Xoá"
                          onClick={() => setDeleteTarget({ id: doc.id, title: doc.title })}
                          className="flex h-8 w-8 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#FCE8E6] hover:text-[#D93025]"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* Pagination */}
          {meta.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-[#DADCE0] px-4 py-3">
              <span className="text-[13px] text-[#5F6368]">
                Trang {meta.page} / {meta.totalPages} ({meta.total} tài liệu)
              </span>
              <div className="flex gap-1">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                </button>
                <button
                  disabled={page >= meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#F1F3F4] disabled:opacity-30"
                >
                  <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===== CREATE/EDIT MODAL ===== */}
      {showModal && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40"
          onClick={() => setShowModal(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-4 flex max-h-[90vh] w-full max-w-[800px] flex-col rounded-xl bg-white shadow-2xl"
          >
            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#DADCE0] px-6 py-4">
              <h2 className="m-0 text-[18px] font-medium text-[#202124]">
                {editingDoc ? 'Chỉnh sửa tài liệu' : 'Thêm tài liệu mới'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="flex h-8 w-8 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#F1F3F4]"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {/* Modal body */}
            <div className="custom-scrollbar flex-1 overflow-y-auto px-6 py-4">
              {/* FILE UPLOAD AREA */}
              <div className="mb-4">
                <label
                  className={`flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed px-4 py-8 transition-colors ${isExtracting ? 'border-[#1A73E8] bg-[#E8F0FE]' : 'border-[#DADCE0] bg-[#F8F9FA] hover:border-[#1A73E8] hover:bg-[#F1F3F4]'}`}
                >
                  <div className="flex flex-col items-center justify-center gap-2">
                    {isExtracting ? (
                      <span className="material-symbols-outlined animate-spin text-[32px] text-[#1A73E8]">
                        progress_activity
                      </span>
                    ) : (
                      <span className="material-symbols-outlined text-[32px] text-[#8AB4F8] [font-variation-settings:'FILL'_1]">
                        upload_file
                      </span>
                    )}
                    <p
                      className={`m-0 text-[14px] font-medium ${isExtracting ? 'text-[#1A73E8]' : 'text-[#202124]'}`}
                    >
                      {isExtracting ? 'Đang đọc nội dung file...' : 'Tải file tài liệu lên'}
                    </p>
                    {!isExtracting && (
                      <p className="m-0 text-center text-[12px] text-[#5F6368]">
                        Chọn hoặc kéo thả file <strong>PDF, DOCX, TXT</strong> vào đây.
                        <br />
                        Hệ thống sẽ tự bóc tách nội dung thô (text) và điền xuống dưới.
                      </p>
                    )}
                  </div>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.txt,.md,.csv"
                    className="hidden"
                    onChange={handleFileChange}
                    disabled={isExtracting}
                  />
                </label>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-[13px] font-medium text-[#5F6368]">
                  Tiêu đề <span className="text-[#D93025]">*</span>
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  placeholder="Nhập tiêu đề tài liệu..."
                  className="h-10 w-full rounded-[4px] border border-[#DADCE0] bg-white px-3 text-[14px] text-[#202124] transition-colors outline-none focus:border-[#1A73E8]"
                />
              </div>

              <div className="mb-4 flex gap-4">
                <div className="flex-1">
                  <label className="mb-1.5 block text-[13px] font-medium text-[#5F6368]">
                    Danh mục
                  </label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="VD: Nội quy, Chính sách, Quy trình..."
                    list="category-suggestions"
                    className="h-10 w-full rounded-[4px] border border-[#DADCE0] bg-white px-3 text-[14px] text-[#202124] transition-colors outline-none focus:border-[#1A73E8]"
                  />
                  <datalist id="category-suggestions">
                    {categories.map((cat) => (
                      <option key={cat} value={cat} />
                    ))}
                  </datalist>
                </div>
                <div className="flex items-end gap-2 pb-0.5">
                  <label className="flex cursor-pointer items-center gap-2 text-[14px] text-[#202124]">
                    <input
                      type="checkbox"
                      checked={form.isActive}
                      onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                      className="h-4 w-4 accent-[#1A73E8]"
                    />
                    Hoạt động
                  </label>
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-[13px] font-medium text-[#5F6368]">
                  Nội dung <span className="text-[#D93025]">*</span>
                </label>
                <textarea
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  placeholder="Nhập nội dung tài liệu..."
                  rows={16}
                  className="w-full resize-y rounded-[4px] border border-[#DADCE0] bg-white px-3 py-2 font-mono text-[13px] leading-[1.6] text-[#202124] transition-colors outline-none focus:border-[#1A73E8]"
                />
                <p className="mt-1 text-[12px] text-[#5F6368]">
                  {form.content.length.toLocaleString()} ký tự
                </p>
              </div>
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 border-t border-[#DADCE0] px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]"
              >
                Huỷ
              </button>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 rounded-[4px] border border-transparent bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#174EA6] disabled:opacity-50"
              >
                <span className="material-symbols-outlined text-[18px]">
                  {isSaving ? 'progress_activity' : 'save'}
                </span>
                {isSaving ? 'Đang lưu...' : editingDoc ? 'Cập nhật' : 'Tạo tài liệu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== DELETE CONFIRMATION ===== */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="mx-4 w-full max-w-[440px] rounded-xl bg-white p-6 shadow-2xl"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="material-symbols-outlined text-[28px] text-[#D93025] [font-variation-settings:'FILL'_1]">
                warning
              </span>
              <h3 className="m-0 text-[18px] font-medium text-[#202124]">Xác nhận xoá</h3>
            </div>
            <p className="mb-6 text-[14px] leading-[1.6] text-[#5F6368]">
              Bạn có chắc muốn xoá tài liệu <strong>&quot;{deleteTarget.title}&quot;</strong>? Tài
              liệu sẽ bị vô hiệu hoá và các chunks đã đánh chỉ mục sẽ bị xoá khỏi hệ thống RAG.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4]"
              >
                Huỷ
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex items-center gap-2 rounded-[4px] bg-[#D93025] px-4 py-2 text-[13px] font-medium text-white transition-all hover:bg-[#B71C1C] disabled:opacity-50"
              >
                {isDeleting ? 'Đang xoá...' : 'Xoá tài liệu'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== TOAST ===== */}
    </>
  );
}
