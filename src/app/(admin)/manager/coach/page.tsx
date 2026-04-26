'use client';

import { type FormEvent, useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Bot, CalendarClock, RefreshCw, Send, Sparkles, Target, Users } from 'lucide-react';
import {
  useGenerateWeeklyBriefing,
  useManagerCoachChat,
  useManagerCoachOverview,
} from '@/hooks/useManagerCoach';
import type {
  ActionPriority,
  EnrollmentSummary,
  ManagerCoachAction,
  ManagerCoachHistoryMessage,
  RiskLearnerSummary,
} from '@/services/manager-coach.service';

const priorityConfig: Record<ActionPriority, string> = {
  urgent: 'border-red-200 bg-red-50 text-red-700',
  high: 'border-orange-200 bg-orange-50 text-orange-700',
  medium: 'border-blue-200 bg-blue-50 text-blue-700',
  low: 'border-emerald-200 bg-emerald-50 text-emerald-700',
};

const riskConfig = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-orange-100 text-orange-700',
  low: 'bg-emerald-100 text-emerald-700',
};

function StatCard({
  label,
  value,
  helper,
  icon: Icon,
}: {
  label: string;
  value: string | number;
  helper: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-[#E8EAED] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-[#5F6368]">{label}</span>
        <div className="rounded-xl bg-[#E8F0FE] p-2 text-[#1A73E8]">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-3xl font-semibold text-[#202124]">{value}</div>
      <p className="mt-1 text-xs text-[#5F6368]">{helper}</p>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-[#E8EAED] bg-white p-4">
      <div className="mb-4 h-4 w-24 rounded bg-[#E8EAED]" />
      <div className="h-8 w-16 rounded bg-[#E8EAED]" />
      <div className="mt-3 h-3 w-32 rounded bg-[#E8EAED]" />
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-xl border border-dashed border-[#DADCE0] bg-[#F8F9FA] p-5 text-center text-sm text-[#5F6368]">
      {text}
    </div>
  );
}

function RiskLearnerCard({ learner }: { learner: RiskLearnerSummary }) {
  return (
    <div className="rounded-xl border border-[#E8EAED] bg-white p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-[#202124]">{learner.userName}</h3>
          <p className="text-xs text-[#5F6368]">{learner.positionTitle || 'Chưa có vị trí'}</p>
        </div>
        <span
          className={`rounded-full px-2 py-1 text-xs font-semibold ${riskConfig[learner.riskLevel]}`}
        >
          {learner.riskLevel.toUpperCase()} · {learner.riskScore}
        </span>
      </div>
      <div className="mt-3 text-sm text-[#3C4043]">{learner.courseTitle}</div>
      <div className="mt-3 h-2 rounded-full bg-[#E8EAED]">
        <div
          className="h-2 rounded-full bg-[#1A73E8]"
          style={{ width: `${Math.min(100, Math.max(0, learner.progressPercent))}%` }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs text-[#5F6368]">
        <span>{learner.progressPercent}% hoàn thành</span>
        <span>
          {learner.dueAt
            ? `Hạn: ${new Date(learner.dueAt).toLocaleDateString('vi-VN')}`
            : 'Không hạn'}
        </span>
      </div>
      {learner.interventions && (
        <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-[#5F6368]">
          {learner.interventions}
        </p>
      )}
    </div>
  );
}

function DeadlineItem({ item }: { item: EnrollmentSummary }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E8EAED] bg-white p-3">
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold text-[#202124]">{item.userName}</div>
        <div className="truncate text-xs text-[#5F6368]">{item.courseTitle}</div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold text-[#E37400]">{item.daysUntilDue} ngày</div>
        <div className="text-xs text-[#5F6368]">{item.progressPercent}%</div>
      </div>
    </div>
  );
}

function ActionList({ actions }: { actions: ManagerCoachAction[] }) {
  if (actions.length === 0) {
    return <EmptyState text="AI chưa đề xuất hành động cụ thể." />;
  }

  return (
    <div className="space-y-3">
      {actions.map((action, index) => (
        <div
          key={`${action.label}-${index}`}
          className="rounded-xl border border-[#E8EAED] bg-white p-3"
        >
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-[#202124]">{action.label}</span>
            <span
              className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold ${priorityConfig[action.priority]}`}
            >
              {action.priority}
            </span>
          </div>
          <p className="text-xs leading-relaxed text-[#5F6368]">{action.reason}</p>
        </div>
      ))}
    </div>
  );
}

export default function ManagerCoachPage() {
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<ManagerCoachHistoryMessage[]>([]);
  const { data: overview, isLoading, isError, refetch, isFetching } = useManagerCoachOverview();
  const chatMutation = useManagerCoachChat();
  const briefingMutation = useGenerateWeeklyBriefing();

  const latestActions = useMemo(() => {
    if (chatMutation.data?.suggestedActions?.length) return chatMutation.data.suggestedActions;
    if (briefingMutation.data?.actions?.length) return briefingMutation.data.actions;
    return [];
  }, [briefingMutation.data?.actions, chatMutation.data?.suggestedActions]);

  const handleChatSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = message.trim();
    if (!trimmed) return;

    const history = chatHistory.slice(-8);
    setChatHistory((current) => [...current, { role: 'user', content: trimmed }]);
    setMessage('');

    chatMutation.mutate(
      { message: trimmed, history },
      {
        onSuccess: (response) => {
          setChatHistory((current) => [
            ...current,
            { role: 'assistant', content: response.answer },
          ]);
        },
      },
    );
  };

  return (
    <div className="custom-scrollbar min-h-full bg-[#F8F9FA] px-4 py-4 md:px-8 md:py-6">
      <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[#DADCE0] bg-white px-3 py-1 text-xs font-semibold text-[#1A73E8]">
            <Sparkles className="h-3.5 w-3.5" />
            AI Manager Coach 360°
          </div>
          <h1 className="text-2xl font-semibold text-[#202124]">
            Huấn luyện quản lý theo dữ liệu team
          </h1>
          <p className="mt-1 text-sm text-[#5F6368]">
            Scope theo phòng ban hiện tại: {overview?.department.name ?? 'đang tải...'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-2 rounded-lg border border-[#DADCE0] bg-white px-4 py-2 text-sm font-medium text-[#1A73E8] hover:bg-[#F1F3F4] disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          <button
            onClick={() => briefingMutation.mutate('this_week')}
            disabled={briefingMutation.isPending}
            className="inline-flex items-center gap-2 rounded-lg bg-[#1A73E8] px-4 py-2 text-sm font-medium text-white hover:bg-[#174EA6] disabled:opacity-60"
          >
            <CalendarClock className="h-4 w-4" />
            Tạo weekly briefing
          </button>
        </div>
      </div>

      {isError && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          Không tải được dữ liệu Manager Coach. Vui lòng thử lại.
        </div>
      )}

      {isLoading ? (
        <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        overview && (
          <div className="mb-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <StatCard
              label="Học viên active"
              value={overview.metrics.activeLearners}
              helper={`${overview.metrics.totalLearners} nhân viên trong team`}
              icon={Users}
            />
            <StatCard
              label="Tiến độ trung bình"
              value={`${overview.metrics.averageProgressPercent}%`}
              helper={`${overview.metrics.completionRate}% đã hoàn thành`}
              icon={Target}
            />
            <StatCard
              label="Cần can thiệp"
              value={overview.metrics.risk.high + overview.metrics.risk.medium}
              helper={`${overview.metrics.risk.high} high risk, ${overview.metrics.risk.medium} medium`}
              icon={Sparkles}
            />
            <StatCard
              label="Deadline nóng"
              value={overview.metrics.overdueCount + overview.metrics.upcomingDeadlineCount}
              helper={`${overview.metrics.overdueCount} quá hạn, ${overview.metrics.upcomingDeadlineCount} sắp hết hạn`}
              icon={CalendarClock}
            />
          </div>
        )
      )}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(380px,0.75fr)]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-[#E8EAED] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-[#202124]">Học viên cần can thiệp</h2>
                <p className="text-sm text-[#5F6368]">Ưu tiên theo risk score mới nhất.</p>
              </div>
              <span className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
                {overview?.atRiskLearners.length ?? 0} người
              </span>
            </div>
            <div className="grid gap-3 lg:grid-cols-2">
              {overview?.atRiskLearners.length ? (
                overview.atRiskLearners.map((learner) => (
                  <RiskLearnerCard
                    key={`${learner.id}-${learner.calculatedAt}`}
                    learner={learner}
                  />
                ))
              ) : (
                <EmptyState text="Chưa có học viên high/medium risk trong team." />
              )}
            </div>
          </section>

          <section className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-[#E8EAED] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#202124]">Deadline 7 ngày tới</h2>
              <div className="mt-4 space-y-3">
                {overview?.upcomingDeadlines.length ? (
                  overview.upcomingDeadlines.map((item) => (
                    <DeadlineItem key={item.id} item={item} />
                  ))
                ) : (
                  <EmptyState text="Không có deadline sắp tới." />
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-[#E8EAED] bg-white p-5 shadow-sm">
              <h2 className="text-lg font-semibold text-[#202124]">Học viên chững lại</h2>
              <div className="mt-4 space-y-3">
                {overview?.stalledLearners.length ? (
                  overview.stalledLearners.map((item) => <DeadlineItem key={item.id} item={item} />)
                ) : (
                  <EmptyState text="Không có học viên chững lại theo ngưỡng 14 ngày." />
                )}
              </div>
            </div>
          </section>

          {briefingMutation.data && (
            <section className="rounded-2xl border border-[#E8EAED] bg-white p-5 shadow-sm">
              <div className="mb-4 flex items-center gap-2">
                <CalendarClock className="h-5 w-5 text-[#1A73E8]" />
                <h2 className="text-lg font-semibold text-[#202124]">
                  {briefingMutation.data.title}
                </h2>
              </div>
              <div className="prose prose-sm max-w-none text-[#3C4043]">
                <ReactMarkdown>{briefingMutation.data.markdown}</ReactMarkdown>
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-[#E8EAED] bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Bot className="h-5 w-5 text-[#1A73E8]" />
              <div>
                <h2 className="text-lg font-semibold text-[#202124]">Chat với AI Coach</h2>
                <p className="text-xs text-[#5F6368]">Dữ liệu chỉ trong phòng ban của manager.</p>
              </div>
            </div>

            <div className="mb-4 max-h-[420px] space-y-3 overflow-y-auto rounded-xl bg-[#F8F9FA] p-3">
              {chatHistory.length === 0 ? (
                <div className="text-sm text-[#5F6368]">
                  Gợi ý: “Tuần này team tôi nên tập trung can thiệp ai trước?”
                </div>
              ) : (
                chatHistory.map((item, index) => (
                  <div
                    key={`${item.role}-${index}`}
                    className={`rounded-xl p-3 text-sm leading-relaxed ${
                      item.role === 'user'
                        ? 'ml-8 bg-[#1A73E8] text-white'
                        : 'mr-8 border border-[#E8EAED] bg-white text-[#3C4043]'
                    }`}
                  >
                    {item.role === 'assistant' ? (
                      <ReactMarkdown>{item.content}</ReactMarkdown>
                    ) : (
                      item.content
                    )}
                  </div>
                ))
              )}
              {chatMutation.isPending && (
                <div className="mr-8 animate-pulse rounded-xl border border-[#E8EAED] bg-white p-3 text-sm text-[#5F6368]">
                  AI Coach đang phân tích dữ liệu team...
                </div>
              )}
            </div>

            <form onSubmit={handleChatSubmit} className="flex gap-2">
              <input
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Hỏi về risk, deadline, tiến độ team..."
                className="min-w-0 flex-1 rounded-lg border border-[#DADCE0] bg-white px-3 py-2 text-sm outline-none focus:border-[#1A73E8] focus:ring-2 focus:ring-[#1A73E8]/15"
              />
              <button
                type="submit"
                disabled={chatMutation.isPending || !message.trim()}
                className="inline-flex items-center justify-center rounded-lg bg-[#1A73E8] px-3 text-white hover:bg-[#174EA6] disabled:opacity-60"
                aria-label="Gửi câu hỏi"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </section>

          <section className="rounded-2xl border border-[#E8EAED] bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold text-[#202124]">Action plan AI đề xuất</h2>
            <ActionList actions={latestActions} />
          </section>
        </aside>
      </div>
    </div>
  );
}
