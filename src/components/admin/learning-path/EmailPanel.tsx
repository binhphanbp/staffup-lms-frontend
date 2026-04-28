'use client';

import { toast } from '@/lib/toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { GeneratedEmail } from '@/services/learning-path.service';

interface Props {
  email: GeneratedEmail | null;
  loading: boolean;
  onGenerate: () => void;
  disabled?: boolean;
}

function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function EmailPanel({ email, loading, onGenerate, disabled }: Props) {
  return (
    <div className="space-y-3">
      <button
        onClick={onGenerate}
        disabled={loading || disabled}
        className="w-full rounded-lg bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:from-violet-700 hover:to-indigo-700 disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined animate-spin text-[18px]">
              progress_activity
            </span>
            Đang soạn email…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Cấp phát Lộ trình & Soạn AI
          </span>
        )}
      </button>

      {email ? (
        <div className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-800">
          <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2 dark:border-slate-700">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Subject</div>
              <div className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                {email.subject}
              </div>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(email.body);
                  toast.success('Đã copy nội dung email.');
                }}
                title="Copy"
                className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-[16px]">content_copy</span>
              </button>
              <button
                onClick={() =>
                  downloadText(
                    `email-${email.metadata.employeeName.replace(/\s+/g, '-')}.md`,
                    `# ${email.subject}\n\n${email.body}`,
                  )
                }
                title="Tải xuống .md"
                className="rounded p-1.5 hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-[16px]">download</span>
              </button>
              <button
                onClick={onGenerate}
                disabled={loading}
                title="Tạo lại"
                className="rounded p-1.5 hover:bg-slate-100 disabled:opacity-50 dark:hover:bg-slate-700"
              >
                <span className="material-symbols-outlined text-[16px]">refresh</span>
              </button>
            </div>
          </div>
          <article className="prose prose-sm dark:prose-invert max-h-[460px] max-w-none overflow-y-auto">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{email.body}</ReactMarkdown>
          </article>
          <div className="border-t border-slate-200 pt-2 text-[11px] text-slate-500 dark:border-slate-700 dark:text-slate-400">
            Rút ngắn: <strong>{email.metadata.prunedPercent}%</strong> · Miễn{' '}
            <strong>{email.metadata.exemptedCount}</strong> bài · Học{' '}
            <strong>{email.metadata.toLearnCount}</strong> bài
          </div>
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800/50 dark:text-slate-400">
          Email AI sẽ hiện ở đây sau khi nhấn &quot;Cấp phát Lộ trình&quot;.
        </div>
      )}
    </div>
  );
}
