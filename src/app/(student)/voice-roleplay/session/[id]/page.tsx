'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  AlertTriangle,
  ArrowLeft,
  CircleStop,
  Mic,
  MicOff,
  Send,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/lib/toast';
import {
  useAbandonRoleplaySession,
  useEndRoleplaySession,
  useRoleplaySession,
  useSendRoleplayTurn,
} from '@/hooks/useRoleplay';
import type { RoleplayTurn } from '@/types/roleplay';

interface SpeechRecognitionLike {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: { error?: string; message?: string }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

interface SpeechRecognitionAlternative {
  transcript: string;
}

interface SpeechRecognitionResult {
  0: SpeechRecognitionAlternative;
  isFinal: boolean;
  length: number;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: ArrayLike<SpeechRecognitionResult>;
}

interface SpeechRecognitionConstructor {
  new (): SpeechRecognitionLike;
}

function getSpeechRecognition(): SpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  const win = window as unknown as {
    SpeechRecognition?: SpeechRecognitionConstructor;
    webkitSpeechRecognition?: SpeechRecognitionConstructor;
  };
  return win.SpeechRecognition ?? win.webkitSpeechRecognition ?? null;
}

function speak(text: string, lang = 'vi-VN'): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 1;
    utter.pitch = 1;
    window.speechSynthesis.speak(utter);
  } catch {
    // Best-effort
  }
}

function stopSpeaking(): void {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
  } catch {
    // ignore
  }
}

interface TranscriptBubbleProps {
  turn: RoleplayTurn;
  personaName: string;
  fullName: string;
}

function TranscriptBubble({ turn, personaName, fullName }: TranscriptBubbleProps) {
  const isUser = turn.role === 'user';
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
        <div
          className={`flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
            isUser
              ? 'bg-primary/15 text-primary'
              : 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300'
          }`}
          aria-hidden
        >
          {isUser ? fullName.slice(0, 1).toUpperCase() : personaName.slice(0, 1).toUpperCase()}
        </div>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm shadow-sm ${
            isUser
              ? 'bg-primary rounded-tr-sm text-white'
              : 'rounded-tl-sm bg-white text-slate-800 dark:bg-slate-800 dark:text-slate-100'
          }`}
        >
          <p className="mb-0.5 text-[10px] font-medium tracking-wider uppercase opacity-70">
            {isUser ? 'Bạn' : personaName}
          </p>
          <p className="leading-relaxed whitespace-pre-wrap">{turn.content}</p>
        </div>
      </div>
    </div>
  );
}

export default function VoiceRoleplaySessionPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const sessionId = params?.id ?? '';

  const sessionQuery = useRoleplaySession(sessionId);
  const sendTurn = useSendRoleplayTurn(sessionId);
  const endSession = useEndRoleplaySession(sessionId);
  const abandonSession = useAbandonRoleplaySession(sessionId);

  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const speechSupported = hydrated && getSpeechRecognition() !== null;

  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement | null>(null);
  const lastSpokenIdRef = useRef<string | null>(null);

  const session = sessionQuery.data;
  const turns = useMemo(() => session?.turns ?? [], [session?.turns]);
  const userTurnsCount = useMemo(() => turns.filter((t) => t.role === 'user').length, [turns]);
  const remainingTurns = session ? Math.max(0, session.scenario.maxTurns - userTurnsCount) : null;
  const turnLimitReached = remainingTurns === 0;

  // Mark hydrated so we can read browser-only Web Speech APIs without SSR mismatch
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [turns.length, interim]);

  // Auto-speak last AI turn (only once per turn id)
  useEffect(() => {
    if (!autoSpeak || turns.length === 0) return;
    const last = turns[turns.length - 1];
    if (last.role !== 'assistant') return;
    if (lastSpokenIdRef.current === last.id) return;
    lastSpokenIdRef.current = last.id;
    speak(last.content);
  }, [turns, autoSpeak]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
      try {
        recognitionRef.current?.abort();
      } catch {
        // ignore
      }
    };
  }, []);

  // Redirect if session already completed
  useEffect(() => {
    if (session && session.status === 'completed') {
      router.replace(`/voice-roleplay/session/${sessionId}/result`);
    }
  }, [session, router, sessionId]);

  const sendMessage = useCallback(
    (raw: string) => {
      const message = raw.trim();
      if (!message) return;
      stopSpeaking();
      sendTurn.mutate(message, {
        onSuccess: (resp) => {
          setTextInput('');
          setInterim('');
          if (resp.shouldEnd) {
            toast.info(
              `Đã đạt giới hạn ${session?.scenario.maxTurns ?? ''} lượt — hãy kết thúc để xem kết quả.`,
            );
          }
        },
        onError: (err: unknown) => {
          const message =
            err && typeof err === 'object' && 'response' in err
              ? ((err as { response?: { data?: { message?: string } } }).response?.data?.message ??
                null)
              : null;
          toast.error(message ?? 'Không gửi được lượt thoại. Vui lòng thử lại.');
        },
      });
    },
    [sendTurn, session?.scenario.maxTurns],
  );

  const startListening = useCallback(() => {
    const Recog = getSpeechRecognition();
    if (!Recog) {
      toast.warning(
        'Trình duyệt của bạn không hỗ trợ giọng nói. Vui lòng dùng Chrome hoặc gõ tin nhắn.',
      );
      return;
    }
    stopSpeaking();
    try {
      const recog = new Recog();
      recog.lang = 'vi-VN';
      recog.interimResults = true;
      recog.continuous = false;

      let finalText = '';

      recog.onresult = (event) => {
        let interimText = '';
        for (let i = event.resultIndex; i < event.results.length; i += 1) {
          const result = event.results[i];
          const transcript = result[0]?.transcript ?? '';
          if (result.isFinal) {
            finalText += transcript;
          } else {
            interimText += transcript;
          }
        }
        if (interimText) setInterim(interimText);
      };
      recog.onerror = (event) => {
        const code = event?.error;
        if (code === 'not-allowed' || code === 'service-not-allowed') {
          toast.error('Trình duyệt từ chối quyền micro. Vui lòng cấp quyền và thử lại.');
        } else if (code === 'no-speech') {
          toast.info('Không nghe được giọng nói. Bạn thử lại nhé.');
        } else if (code) {
          toast.error(`Lỗi nhận diện giọng nói: ${code}`);
        }
        setIsListening(false);
        setInterim('');
      };
      recog.onend = () => {
        setIsListening(false);
        setInterim('');
        const trimmed = finalText.trim();
        if (trimmed) {
          sendMessage(trimmed);
        }
      };
      recognitionRef.current = recog;
      recog.start();
      setIsListening(true);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Lỗi không xác định';
      toast.error(`Không khởi động được mic: ${message}`);
      setIsListening(false);
    }
  }, [sendMessage]);

  const stopListening = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
  }, []);

  const handleEnd = useCallback(() => {
    stopSpeaking();
    endSession.mutate(undefined, {
      onSuccess: () => {
        router.replace(`/voice-roleplay/session/${sessionId}/result`);
      },
      onError: () => {
        toast.error('Không thể tổng kết phiên. Vui lòng thử lại.');
      },
    });
  }, [endSession, router, sessionId]);

  const handleAbandon = useCallback(() => {
    stopSpeaking();
    abandonSession.mutate(undefined, {
      onSuccess: () => {
        router.replace('/voice-roleplay');
      },
      onError: () => {
        toast.error('Không thể hủy phiên. Vui lòng thử lại.');
      },
    });
  }, [abandonSession, router]);

  if (sessionQuery.isLoading) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Voice Roleplay', href: '/voice-roleplay' },
            { label: 'Đang tải…' },
          ]}
        />
        <div className="flex-1 px-4 py-6 md:px-8">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <div className="mt-4 space-y-3">
            <Skeleton className="h-16 w-2/3 rounded-xl" />
            <Skeleton className="ml-auto h-16 w-1/2 rounded-xl" />
          </div>
        </div>
      </>
    );
  }

  if (sessionQuery.isError || !session) {
    return (
      <>
        <StudentHeader
          breadcrumbs={[
            { label: 'Trang chủ', href: '/' },
            { label: 'Voice Roleplay', href: '/voice-roleplay' },
            { label: 'Lỗi' },
          ]}
        />
        <div className="flex-1 px-4 py-6 md:px-8">
          <div className="mx-auto flex max-w-2xl flex-col items-center gap-3 rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center dark:border-rose-900/40 dark:bg-rose-950/30">
            <AlertTriangle className="size-10 text-rose-500" />
            <h2 className="text-lg font-semibold text-rose-700 dark:text-rose-300">
              Không tải được phiên này
            </h2>
            <p className="text-sm text-rose-600 dark:text-rose-400">
              Phiên có thể đã bị hủy hoặc bạn không có quyền truy cập.
            </p>
            <button
              type="button"
              onClick={() => router.replace('/voice-roleplay')}
              className="bg-primary mt-2 rounded-lg px-4 py-2 text-sm font-medium text-white"
            >
              Quay lại danh sách
            </button>
          </div>
        </div>
      </>
    );
  }

  const breadcrumbs = [
    { label: 'Trang chủ', href: '/' },
    { label: 'Voice Roleplay', href: '/voice-roleplay' },
    { label: session.scenario.title },
  ];

  return (
    <>
      <StudentHeader breadcrumbs={breadcrumbs} />
      <div className="flex flex-1 flex-col overflow-hidden bg-[#f0f2f5] dark:bg-slate-950">
        <div className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 overflow-hidden px-4 py-4 md:px-8 md:py-6">
          {/* Persona panel */}
          <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:p-5 dark:border-slate-800 dark:bg-slate-900">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-500 text-xl font-semibold text-white shadow-md">
                  {session.scenario.personaName.slice(0, 1).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <h1 className="truncate text-base font-semibold text-slate-800 md:text-lg dark:text-slate-100">
                    {session.scenario.title}
                  </h1>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Đang đóng vai: <strong>{session.scenario.personaName}</strong> —{' '}
                    {session.scenario.personaRole}
                  </p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>~{session.scenario.estimatedMinutes} phút</span>
                    <span>•</span>
                    <span>
                      Lượt {userTurnsCount}/{session.scenario.maxTurns}
                    </span>
                    {session.scenario.objectives.length > 0 && (
                      <>
                        <span>•</span>
                        <span>{session.scenario.objectives.length} mục tiêu</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setAutoSpeak((v) => {
                      const next = !v;
                      // Immediately silence any in‑flight utterance when
                      // toggling OFF — otherwise AI keeps talking until
                      // the current sentence finishes.
                      if (!next) stopSpeaking();
                      return next;
                    });
                  }}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                  aria-pressed={autoSpeak}
                  title="Bật/tắt giọng đọc của AI"
                >
                  {autoSpeak ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
                  {autoSpeak ? 'AI nói' : 'AI im'}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmEnd(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-emerald-700"
                >
                  <CircleStop className="size-4" />
                  Kết thúc & chấm điểm
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/voice-roleplay')}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  <ArrowLeft className="size-4" />
                  Thoát
                </button>
              </div>
            </div>
            {session.scenario.objectives.length > 0 && (
              <details className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:bg-slate-800/60 dark:text-slate-300">
                <summary className="cursor-pointer font-medium">Mục tiêu cần đạt</summary>
                <ul className="mt-2 list-decimal space-y-0.5 pl-5">
                  {session.scenario.objectives.map((obj, idx) => (
                    <li key={idx}>{obj}</li>
                  ))}
                </ul>
              </details>
            )}
          </header>

          {/* Transcript */}
          <div className="custom-scrollbar flex-1 space-y-3 overflow-y-auto rounded-2xl border border-slate-200 bg-white/70 p-4 dark:border-slate-800 dark:bg-slate-900/40">
            {turns.length === 0 ? (
              <div className="flex h-full items-center justify-center text-sm text-slate-500">
                Đang khởi tạo cuộc hội thoại…
              </div>
            ) : (
              turns
                .filter((t) => t.role !== 'system')
                .map((turn) => (
                  <TranscriptBubble
                    key={turn.id}
                    turn={turn}
                    personaName={session.scenario.personaName}
                    fullName="Bạn"
                  />
                ))
            )}
            {sendTurn.isPending && (
              <div className="flex w-full justify-start">
                <div className="rounded-2xl rounded-tl-sm bg-white px-4 py-2.5 text-sm shadow-sm dark:bg-slate-800">
                  <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
                    <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
                    <span className="size-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
                    <span className="size-2 animate-bounce rounded-full bg-slate-400" />
                    <span className="ml-1 text-xs">{session.scenario.personaName} đang nghĩ…</span>
                  </div>
                </div>
              </div>
            )}
            {interim && (
              <div className="flex w-full justify-end">
                <div className="bg-primary/20 dark:bg-primary/10 rounded-2xl rounded-tr-sm px-4 py-2.5 text-sm text-slate-700 italic dark:text-slate-300">
                  {interim}…
                </div>
              </div>
            )}
            <div ref={transcriptEndRef} />
          </div>

          {/* Input area */}
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm md:p-4 dark:border-slate-800 dark:bg-slate-900">
            {!speechSupported && (
              <p className="mb-2 flex items-center gap-1.5 text-xs text-amber-700 dark:text-amber-300">
                <AlertTriangle className="size-3.5" />
                Trình duyệt không hỗ trợ giọng nói. Bạn có thể gõ tin nhắn bên dưới.
              </p>
            )}
            {turnLimitReached && (
              <div className="mb-2 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-900/40 dark:bg-amber-950/30 dark:text-amber-200">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
                <span>
                  Bạn đã đạt giới hạn {session.scenario.maxTurns} lượt cho tình huống này. Hãy bấm{' '}
                  <strong>Kết thúc &amp; chấm điểm</strong> để xem kết quả.
                </span>
              </div>
            )}
            <div className="flex items-end gap-2">
              <button
                type="button"
                disabled={!speechSupported || sendTurn.isPending || turnLimitReached}
                onClick={isListening ? stopListening : startListening}
                aria-pressed={isListening}
                aria-label={isListening ? 'Dừng nghe' : 'Bắt đầu nghe'}
                className={`flex size-12 shrink-0 items-center justify-center rounded-full text-white shadow-md transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  isListening
                    ? 'bg-rose-500 hover:bg-rose-600 motion-safe:animate-pulse'
                    : 'bg-primary hover:bg-primary/90'
                }`}
              >
                {isListening ? <MicOff className="size-5" /> : <Mic className="size-5" />}
              </button>

              <form
                className="flex flex-1 items-end gap-2"
                onSubmit={(event) => {
                  event.preventDefault();
                  if (!textInput.trim() || sendTurn.isPending || turnLimitReached) return;
                  sendMessage(textInput);
                }}
              >
                <textarea
                  rows={1}
                  value={textInput}
                  onChange={(event) => setTextInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' && !event.shiftKey) {
                      event.preventDefault();
                      if (!textInput.trim() || sendTurn.isPending || turnLimitReached) return;
                      sendMessage(textInput);
                    }
                  }}
                  placeholder={
                    turnLimitReached
                      ? 'Đã đạt giới hạn lượt — hãy kết thúc để nhận đánh giá.'
                      : isListening
                        ? 'Đang nghe… bạn nói tự nhiên nhé.'
                        : 'Hoặc gõ phản hồi tại đây… (Enter để gửi)'
                  }
                  disabled={isListening || sendTurn.isPending || turnLimitReached}
                  className="focus:border-primary max-h-32 flex-1 resize-y rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 placeholder:text-slate-400 focus:bg-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:bg-slate-900"
                />
                <button
                  type="submit"
                  disabled={
                    !textInput.trim() || sendTurn.isPending || isListening || turnLimitReached
                  }
                  className="bg-primary hover:bg-primary/90 inline-flex h-12 items-center gap-1.5 rounded-lg px-4 text-sm font-medium text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Send className="size-4" />
                  Gửi
                </button>
              </form>
            </div>
            {remainingTurns !== null && !turnLimitReached && (
              <p className="mt-2 text-right text-[11px] text-slate-500 dark:text-slate-400">
                Còn {remainingTurns} lượt — hãy kết thúc khi đã đạt mục tiêu để nhận đánh giá.
              </p>
            )}
          </div>
        </div>
      </div>

      {confirmEnd && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setConfirmEnd(false)}
        >
          <div
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-slate-900"
            onClick={(event) => event.stopPropagation()}
          >
            <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Kết thúc phiên & chấm điểm?
            </h3>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
              AI sẽ đánh giá toàn bộ cuộc hội thoại theo rubric. Bạn không thể tiếp tục phiên này
              sau khi đã chấm điểm.
            </p>
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:justify-between">
              <button
                type="button"
                onClick={handleAbandon}
                disabled={abandonSession.isPending}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Hủy phiên (không chấm)
              </button>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setConfirmEnd(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                >
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={handleEnd}
                  disabled={endSession.isPending}
                  className="bg-primary hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {endSession.isPending ? 'Đang chấm điểm…' : 'Chấm điểm ngay'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
