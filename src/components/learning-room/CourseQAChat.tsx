'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { chatApi, type LessonSource } from '@/services/chat.service';

interface CourseQAChatProps {
  courseId: string;
  courseTitle?: string;
  currentLessonTitle?: string;
}

interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: LessonSource[];
}

const buildSuggestions = (lessonTitle?: string): string[] => {
  const base = [
    'Tóm tắt khóa học này giúp tôi',
    'Liệt kê các điểm quan trọng cần nhớ',
    'Đưa ra ví dụ thực tế minh họa',
  ];
  if (lessonTitle) {
    return [`Tóm tắt bài "${lessonTitle}"`, ...base];
  }
  return base;
};

const genId = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `m_${Date.now()}_${Math.random().toString(36).slice(2)}`;

// ============================================================
// Course Q&A Chat — RAG scoped to a single course's lessons
// ============================================================
export const CourseQAChat = ({ courseId, courseTitle, currentLessonTitle }: CourseQAChatProps) => {
  const [messages, setMessages] = useState<UIMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [streamingSources, setStreamingSources] = useState<LessonSource[]>([]);
  const [error, setError] = useState<string | null>(null);

  const abortRef = useRef<(() => void) | null>(null);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const suggestions = useMemo(() => buildSuggestions(currentLessonTitle), [currentLessonTitle]);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, isStreaming]);

  // Abort any in-flight stream when component unmounts (or courseId changes via key prop in parent).
  useEffect(() => {
    return () => {
      abortRef.current?.();
      abortRef.current = null;
    };
  }, []);

  const send = useCallback(
    (rawQuestion: string) => {
      const question = rawQuestion.trim();
      if (!question || isStreaming) return;

      setError(null);
      const userMsg: UIMessage = { id: genId(), role: 'user', content: question };
      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsStreaming(true);
      setStreamingContent('');
      setStreamingSources([]);

      let accumulated = '';
      let collectedSources: LessonSource[] = [];

      const stop = chatApi.askCourseStream(
        courseId,
        question,
        (event) => {
          if (event.type === 'text') {
            accumulated += event.data;
            setStreamingContent(accumulated);
          } else if (event.type === 'sources') {
            try {
              const parsed = JSON.parse(event.data) as LessonSource[];
              collectedSources = parsed;
              setStreamingSources(parsed);
            } catch {
              // ignore malformed sources
            }
          }
        },
        () => {
          setMessages((prev) => [
            ...prev,
            {
              id: genId(),
              role: 'assistant',
              content: accumulated || 'Xin lỗi, tôi không thể trả lời lúc này.',
              sources: collectedSources.length > 0 ? collectedSources : undefined,
            },
          ]);
          setStreamingContent('');
          setStreamingSources([]);
          setIsStreaming(false);
          abortRef.current = null;
        },
        (err) => {
          setError(err);
          setStreamingContent('');
          setStreamingSources([]);
          setIsStreaming(false);
          abortRef.current = null;
        },
      );
      abortRef.current = stop;
    },
    [courseId, isStreaming],
  );

  const handleStop = useCallback(() => {
    abortRef.current?.();
    abortRef.current = null;
    if (streamingContent) {
      setMessages((prev) => [
        ...prev,
        {
          id: genId(),
          role: 'assistant',
          content: streamingContent,
          sources: streamingSources.length > 0 ? streamingSources : undefined,
        },
      ]);
    }
    setStreamingContent('');
    setStreamingSources([]);
    setIsStreaming(false);
  }, [streamingContent, streamingSources]);

  const handleClear = useCallback(() => {
    abortRef.current?.();
    abortRef.current = null;
    setMessages([]);
    setStreamingContent('');
    setStreamingSources([]);
    setIsStreaming(false);
    setError(null);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input);
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const isEmpty = messages.length === 0 && !isStreaming;

  return (
    <div className="flex h-[600px] max-h-[70vh] w-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-violet-50 px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm text-white shadow-sm">
            <i className="fa-solid fa-wand-magic-sparkles"></i>
          </div>
          <div>
            <div className="text-sm font-bold text-slate-800">Trợ lý AI khóa học</div>
            <div className="text-[11px] text-slate-500">
              Hỏi đáp dựa trên nội dung{courseTitle ? ` "${courseTitle}"` : ' khóa học'} • RAG
            </div>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-600 hover:border-slate-300 hover:text-slate-900"
            title="Xóa cuộc trò chuyện"
          >
            <i className="fa-regular fa-trash-can mr-1"></i>
            Xóa
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="custom-scrollbar flex-1 space-y-4 overflow-y-auto bg-slate-50 px-4 py-4">
        {isEmpty ? (
          <WelcomeScreen
            courseTitle={courseTitle}
            suggestions={suggestions}
            onSuggestionClick={send}
          />
        ) : (
          <>
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isStreaming && (
              <ChatBubble
                message={{
                  id: 'streaming',
                  role: 'assistant',
                  content: streamingContent,
                  sources: streamingSources.length > 0 ? streamingSources : undefined,
                }}
                isStreaming
              />
            )}
          </>
        )}
        <div ref={scrollEndRef} />
      </div>

      {error && (
        <div
          role="alert"
          className="border-t border-red-200 bg-red-50 px-4 py-2 text-[12px] text-red-700"
        >
          <i className="fa-solid fa-circle-exclamation mr-1"></i>
          {error}
        </div>
      )}

      {/* Input */}
      <div className="border-t border-slate-200 bg-white p-3">
        <div className="flex items-end gap-2">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              isStreaming
                ? 'Đang trả lời...'
                : 'Hỏi trợ lý AI về nội dung khóa học (Enter để gửi, Shift+Enter để xuống dòng)'
            }
            rows={1}
            disabled={isStreaming}
            className="focus:border-primary focus:ring-primary max-h-40 min-h-[40px] flex-1 resize-none rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] outline-none focus:bg-white focus:ring-1 disabled:opacity-60"
          />
          {isStreaming ? (
            <button
              type="button"
              onClick={handleStop}
              className="flex h-10 items-center gap-1 rounded-lg bg-red-500 px-4 text-[13px] font-bold text-white transition-colors hover:bg-red-600"
            >
              <i className="fa-solid fa-stop"></i>
              Dừng
            </button>
          ) : (
            <button
              type="button"
              onClick={() => send(input)}
              disabled={!input.trim()}
              className="bg-primary hover:bg-primary-hover flex h-10 items-center gap-1 rounded-lg px-4 text-[13px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              <i className="fa-solid fa-paper-plane"></i>
              Gửi
            </button>
          )}
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400">
          <span>
            <i className="fa-solid fa-shield-halved mr-1"></i>
            Câu trả lời chỉ dựa trên nội dung của khóa học này.
          </span>
          <span>Powered by Gemini</span>
        </div>
      </div>
    </div>
  );
};

// ----- Sub-components -----

function WelcomeScreen({
  courseTitle,
  suggestions,
  onSuggestionClick,
}: {
  courseTitle?: string;
  suggestions: string[];
  onSuggestionClick: (msg: string) => void;
}) {
  return (
    <div className="flex h-full flex-col items-center justify-center px-4 py-8 text-center">
      <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-2xl text-white shadow-lg">
        <i className="fa-solid fa-wand-magic-sparkles"></i>
      </div>
      <h4 className="mb-1 text-base font-bold text-slate-800">Trợ lý AI khóa học</h4>
      <p className="mb-5 max-w-sm text-[13px] text-slate-500">
        Hỏi bất cứ điều gì về{' '}
        {courseTitle ? <strong className="text-slate-700">{courseTitle}</strong> : 'khóa học này'}.
        Câu trả lời chỉ dựa trên nội dung bài học (không lan man ra ngoài).
      </p>
      <div className="grid w-full max-w-md gap-2 sm:grid-cols-2">
        {suggestions.map((s, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSuggestionClick(s)}
            className="hover:border-primary hover:text-primary rounded-lg border border-slate-200 bg-white px-3 py-2 text-left text-[12px] text-slate-700 transition-colors"
          >
            <i className="fa-solid fa-arrow-right text-primary mr-1.5 text-[10px]"></i>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatBubble({ message, isStreaming }: { message: UIMessage; isStreaming?: boolean }) {
  const isUser = message.role === 'user';
  return (
    <div className={`flex gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-sm ${
          isUser
            ? 'bg-slate-700 text-white'
            : 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white'
        }`}
      >
        {isUser ? (
          <i className="fa-solid fa-user"></i>
        ) : (
          <i className="fa-solid fa-wand-magic-sparkles"></i>
        )}
      </div>
      <div className={`flex max-w-[85%] flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`prose prose-sm max-w-none rounded-2xl px-4 py-2 text-[13px] leading-relaxed ${
            isUser
              ? 'rounded-tr-sm bg-slate-700 text-white'
              : 'rounded-tl-sm border border-slate-200 bg-white text-slate-800 shadow-sm'
          }`}
        >
          {isUser ? (
            <div className="whitespace-pre-wrap">{message.content}</div>
          ) : message.content ? (
            <div className="markdown-content">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{message.content}</ReactMarkdown>
            </div>
          ) : (
            <StreamingDots />
          )}
        </div>
        {message.sources && message.sources.length > 0 && (
          <SourcesPanel sources={message.sources} />
        )}
        {isStreaming && message.content && (
          <div className="mt-1 text-[10px] text-slate-400">
            <i className="fa-solid fa-circle-notch fa-spin mr-1"></i>
            Đang trả lời...
          </div>
        )}
      </div>
    </div>
  );
}

function SourcesPanel({ sources }: { sources: LessonSource[] }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="mt-2 max-w-full">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="text-primary hover:text-primary-hover flex items-center gap-1 text-[11px] font-semibold"
      >
        <i className="fa-solid fa-link text-[9px]"></i>
        {sources.length} bài học tham khảo
        <i className={`fa-solid text-[9px] ${expanded ? 'fa-chevron-up' : 'fa-chevron-down'}`}></i>
      </button>
      {expanded && (
        <div className="mt-1.5 space-y-1.5">
          {sources.map((src, i) => (
            <div
              key={i}
              className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-[11px]"
            >
              <div className="font-semibold text-slate-700">{src.lessonTitle}</div>
              <div className="text-[10px] text-slate-500">{src.moduleTitle}</div>
              <div className="mt-1 line-clamp-2 text-slate-600 italic">
                &ldquo;{src.snippet}&rdquo;
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StreamingDots() {
  return (
    <div className="flex gap-1 py-1">
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]"></span>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]"></span>
      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400"></span>
    </div>
  );
}
