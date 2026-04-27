'use client';

import { useEffect, useMemo } from 'react';
import {
  extractSignals,
  parseInterventionPlan,
  type InterventionAction,
  type RiskAssessmentHistoryItem,
  type RiskAssessmentDetail,
  type RiskAssessmentListItem,
  type RiskLevel,
} from '@/services/risk.service';
import { useRiskDetail, useRiskHistory } from '@/hooks/useRiskAssessments';
import { RiskScoreGauge } from './RiskScoreGauge';

interface RiskDrillDownModalProps {
  assessment: RiskAssessmentListItem | null;
  open: boolean;
  onClose: () => void;
  onRecalculate: (enrollmentId: string) => void;
  isRecalculating: boolean;
  onRemind: (enrollmentId: string, learnerName: string) => void;
}

const LEVEL_BADGE: Record<RiskLevel, string> = {
  high: 'bg-red-100 text-red-700 border-red-200',
  medium: 'bg-amber-100 text-amber-700 border-amber-200',
  low: 'bg-emerald-100 text-emerald-700 border-emerald-200',
};

const LEVEL_LABEL: Record<RiskLevel, string> = {
  high: 'Cao',
  medium: 'Trung bình',
  low: 'Thấp',
};

const PRIORITY_BADGE: Record<string, string> = {
  urgent: 'bg-red-100 text-red-700',
  high: 'bg-orange-100 text-orange-700',
  medium: 'bg-blue-100 text-blue-700',
};

const ACTION_ICON: Record<string, string> = {
  email: 'mail',
  meeting: 'videocam',
  mentoring: 'support_agent',
  content_adjust: 'tune',
  deadline_extend: 'update',
  reminder: 'notifications_active',
};

function formatDateTime(iso: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatPercent(n: number | undefined) {
  if (n === undefined || n === null || Number.isNaN(n)) return '—';
  return `${Math.round(n * 100)}%`;
}

function fmtNum(n: number | undefined | null, suffix = '') {
  if (n === undefined || n === null || Number.isNaN(n)) return '—';
  return `${Math.round(n * 10) / 10}${suffix}`;
}

function SignalCard({
  title,
  icon,
  lines,
  componentScore,
}: {
  title: string;
  icon: string;
  lines: Array<{ label: string; value: string }>;
  componentScore: number | undefined;
}) {
  return (
    <div className="flex-1 rounded-xl border border-[#E8EAED] bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <span className="material-symbols-outlined text-[18px] text-[#1A73E8]">{icon}</span>
        <h3 className="text-[13px] font-semibold text-[#202124]">{title}</h3>
        {componentScore !== undefined && (
          <span className="ml-auto rounded-full bg-[#F1F3F4] px-2 py-0.5 text-[11px] font-semibold text-[#5F6368]">
            {Math.round(componentScore)}/100
          </span>
        )}
      </div>
      <dl className="space-y-1.5 text-[12px]">
        {lines.map((l) => (
          <div key={l.label} className="flex items-center justify-between gap-2">
            <dt className="text-[#5F6368]">{l.label}</dt>
            <dd className="font-medium text-[#202124]">{l.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function HistoryMiniChart({ history }: { history: RiskAssessmentHistoryItem[] }) {
  const sorted = useMemo(
    () =>
      [...history].sort(
        (a, b) => new Date(a.calculatedAt).getTime() - new Date(b.calculatedAt).getTime(),
      ),
    [history],
  );

  if (sorted.length < 2) {
    return (
      <div className="rounded-lg border border-dashed border-[#DADCE0] bg-[#F8F9FA] p-4 text-center text-[12px] text-[#5F6368]">
        Chưa đủ lịch sử để hiển thị biểu đồ (cần ≥2 assessment).
      </div>
    );
  }

  const width = 360;
  const height = 100;
  const padding = 8;
  const points = sorted.map((item, idx) => {
    const x = padding + (idx / (sorted.length - 1)) * (width - 2 * padding);
    const y = padding + (1 - item.riskScore / 100) * (height - 2 * padding);
    return { x, y, score: item.riskScore, at: item.calculatedAt };
  });
  const d = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');

  return (
    <div className="rounded-lg border border-[#E8EAED] bg-white p-3">
      <svg width="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <line
          x1={padding}
          x2={width - padding}
          y1={height - padding}
          y2={height - padding}
          stroke="#E8EAED"
        />
        <path d={d} fill="none" stroke="#1A73E8" strokeWidth={2} />
        {points.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r={3} fill="#1A73E8">
            <title>
              {new Date(p.at).toLocaleString('vi-VN')} • {p.score}
            </title>
          </circle>
        ))}
      </svg>
      <div className="mt-1 flex justify-between text-[10px] text-[#5F6368]">
        <span>{new Date(sorted[0].calculatedAt).toLocaleDateString('vi-VN')}</span>
        <span>{new Date(sorted[sorted.length - 1].calculatedAt).toLocaleDateString('vi-VN')}</span>
      </div>
    </div>
  );
}

function ActionCard({ action }: { action: InterventionAction }) {
  const priorityClass = PRIORITY_BADGE[action.priority] ?? 'bg-slate-100 text-slate-700';
  const icon = ACTION_ICON[action.type] ?? 'lightbulb';
  return (
    <div className="rounded-lg border border-[#E8EAED] bg-[#F8F9FA] p-3">
      <div className="mb-1.5 flex items-center gap-2">
        <span className="material-symbols-outlined text-[16px] text-[#1A73E8]">{icon}</span>
        <span className="text-[12px] font-semibold text-[#202124]">
          {action.type.replace('_', ' ')}
        </span>
        <span
          className={`ml-auto rounded-full px-2 py-0.5 text-[10px] font-semibold ${priorityClass}`}
        >
          {action.priority}
        </span>
      </div>
      <p className="text-[12px] leading-relaxed text-[#5F6368]">{action.description}</p>
    </div>
  );
}

function DetailBody({ detail }: { detail: RiskAssessmentDetail }) {
  const signals = extractSignals(detail.reasons);
  const plan = parseInterventionPlan(detail.interventions);

  return (
    <div className="space-y-4">
      {/* Signals */}
      <div>
        <h3 className="mb-2 text-[13px] font-semibold text-[#202124]">
          Phân tích tín hiệu (Signals)
        </h3>
        {signals ? (
          <div className="flex flex-col gap-3 md:flex-row">
            <SignalCard
              title="Engagement"
              icon="trending_up"
              componentScore={signals.componentScores?.engagement}
              lines={[
                {
                  label: 'Số ngày không hoạt động',
                  value: fmtNum(signals.engagement?.daysInactive, ' ngày'),
                },
                {
                  label: 'Tỉ lệ hoàn thành lesson',
                  value: formatPercent(signals.engagement?.lessonCompletionRate),
                },
                {
                  label: 'Tỉ lệ xem video',
                  value: formatPercent(signals.engagement?.watchTimeRatio),
                },
              ]}
            />
            <SignalCard
              title="Performance"
              icon="insights"
              componentScore={signals.componentScores?.performance}
              lines={[
                {
                  label: 'Điểm quiz trung bình',
                  value: fmtNum(signals.performance?.averageQuizScore),
                },
                {
                  label: 'Tỉ lệ fail',
                  value: formatPercent(signals.performance?.failRate),
                },
                {
                  label: 'Chênh lệch vs lớp',
                  value: fmtNum(signals.performance?.scoreVsClassAvg),
                },
              ]}
            />
            <SignalCard
              title="Deadline"
              icon="schedule"
              componentScore={signals.componentScores?.deadline}
              lines={[
                {
                  label: 'Thời gian trôi qua',
                  value: formatPercent(signals.deadline?.timeElapsedRatio),
                },
                {
                  label: 'Độ lệch tiến độ',
                  value: formatPercent(signals.deadline?.progressGap),
                },
                {
                  label: 'Còn lại',
                  value:
                    signals.deadline?.daysRemaining === null
                      ? 'Không deadline'
                      : fmtNum(signals.deadline?.daysRemaining, ' ngày'),
                },
              ]}
            />
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#DADCE0] bg-[#F8F9FA] p-4 text-[12px] text-[#5F6368]">
            Không có chi tiết tín hiệu (assessment có thể được ingest từ bên ngoài).
          </div>
        )}
      </div>

      {/* Recommendations */}
      {detail.recommendations && (
        <div>
          <h3 className="mb-2 text-[13px] font-semibold text-[#202124]">Khuyến nghị</h3>
          <div className="rounded-lg border border-[#E8EAED] bg-white p-3 text-[13px] leading-relaxed whitespace-pre-wrap text-[#202124]">
            {detail.recommendations}
          </div>
        </div>
      )}

      {/* Intervention plan */}
      <div>
        <h3 className="mb-2 text-[13px] font-semibold text-[#202124]">
          <span className="inline-flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-violet-600">
              auto_awesome
            </span>
            Kế hoạch can thiệp (AI)
          </span>
        </h3>
        {plan ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-violet-200 bg-violet-50 p-3 text-[13px] leading-relaxed text-violet-900">
              {plan.summary}
            </div>
            <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
              {plan.actions.map((a, i) => (
                <ActionCard key={i} action={a} />
              ))}
            </div>
          </div>
        ) : detail.interventions ? (
          <div className="rounded-lg border border-[#E8EAED] bg-[#F8F9FA] p-3 text-[12px] whitespace-pre-wrap text-[#5F6368]">
            {detail.interventions}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-[#DADCE0] bg-[#F8F9FA] p-4 text-[12px] text-[#5F6368]">
            Chưa có kế hoạch can thiệp. Chỉ các assessment ≥ medium mới được AI tạo plan.
          </div>
        )}
      </div>
    </div>
  );
}

export function RiskDrillDownModal({
  assessment,
  open,
  onClose,
  onRecalculate,
  isRecalculating,
  onRemind,
}: RiskDrillDownModalProps) {
  const enrollmentId = assessment?.enrollment.id ?? null;
  const detailQuery = useRiskDetail(enrollmentId);
  const historyQuery = useRiskHistory(enrollmentId, 1, 10);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open || !assessment) return null;

  const detail = detailQuery.data;
  const history = historyQuery.data?.assessments ?? [];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="max-h-[92vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-[#E8EAED] px-6 py-5">
          <div className="flex min-w-0 items-start gap-4">
            <RiskScoreGauge score={assessment.riskScore} level={assessment.riskLevel} size="lg" />
            <div className="min-w-0">
              <h2 className="truncate text-[18px] font-semibold text-[#202124]">
                {assessment.enrollment.user.fullName}
              </h2>
              <p className="truncate text-[13px] text-[#5F6368]">
                {assessment.enrollment.user.email}
              </p>
              <p className="mt-1 truncate text-[12px] text-[#5F6368]">
                <span className="material-symbols-outlined align-middle text-[14px]">
                  menu_book
                </span>{' '}
                {assessment.enrollment.course.title}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <span
                  className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${LEVEL_BADGE[assessment.riskLevel]}`}
                >
                  Mức {LEVEL_LABEL[assessment.riskLevel]}
                </span>
                <span className="text-[11px] text-[#5F6368]">
                  Cập nhật: {formatDateTime(assessment.calculatedAt)}
                </span>
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-[#5F6368] hover:text-[#202124]"
            aria-label="Đóng"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Body */}
        <div className="custom-scrollbar max-h-[calc(92vh-210px)] overflow-y-auto px-6 py-5">
          {detailQuery.isLoading && (
            <div className="flex items-center gap-2 text-[13px] text-[#5F6368]">
              <span className="material-symbols-outlined animate-spin text-[18px]">
                progress_activity
              </span>
              Đang tải chi tiết...
            </div>
          )}

          {detailQuery.isError && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-[13px] text-red-700">
              Không thể tải chi tiết assessment. Thử tính toán lại hoặc thử lại sau.
            </div>
          )}

          {detail && <DetailBody detail={detail} />}

          {/* History */}
          <div className="mt-5">
            <h3 className="mb-2 text-[13px] font-semibold text-[#202124]">Lịch sử điểm rủi ro</h3>
            {historyQuery.isLoading ? (
              <div className="h-24 animate-pulse rounded-lg bg-[#F1F3F4]" />
            ) : (
              <HistoryMiniChart history={history} />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-wrap items-center justify-end gap-2 border-t border-[#E8EAED] bg-[#F8F9FA] px-6 py-4">
          <button
            type="button"
            onClick={() => onRemind(assessment.enrollment.id, assessment.enrollment.user.fullName)}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#DADCE0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#5F6368] transition-colors hover:bg-[#F1F3F4]"
          >
            <span className="material-symbols-outlined text-[15px]">mail</span>
            Gửi nhắc nhở
          </button>
          <button
            type="button"
            onClick={() => onRecalculate(assessment.enrollment.id)}
            disabled={isRecalculating}
            className="inline-flex items-center gap-1.5 rounded-md border border-[#DADCE0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#1A73E8] transition-colors hover:bg-[#E8F0FE] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-[15px] ${isRecalculating ? 'animate-spin' : ''}`}
            >
              {isRecalculating ? 'progress_activity' : 'refresh'}
            </span>
            Tính lại ngay
          </button>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex items-center rounded-md bg-[#1A73E8] px-4 py-1.5 text-[12px] font-medium text-white transition-colors hover:bg-[#174EA6]"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}
