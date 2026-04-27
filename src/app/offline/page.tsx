import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Mất kết nối',
};

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6 py-12 text-center dark:bg-slate-950">
      <div className="mx-auto flex max-w-md flex-col items-center gap-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-300">
          <i className="fa-solid fa-wifi-slash text-2xl"></i>
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-slate-50">
            Hiện chưa có kết nối mạng
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Bạn vẫn có thể xem lại các bài học đã lưu offline. Khi có mạng trở lại, mọi thay đổi sẽ
            được đồng bộ.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/saved-lessons"
            className="bg-primary hover:bg-primary/90 inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white shadow-sm transition"
          >
            <i className="fa-solid fa-bookmark text-xs"></i>
            Bài học đã lưu
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <i className="fa-solid fa-rotate-right text-xs"></i>
            Thử lại
          </Link>
        </div>
        <p className="mt-2 text-[11px] text-slate-400 dark:text-slate-500">
          Mẹo: Mở khóa học khi đang online và bấm{' '}
          <span className="font-medium">&ldquo;Lưu offline&rdquo;</span> ở thanh học để có thể xem
          lại sau.
        </p>
      </div>
    </div>
  );
}
