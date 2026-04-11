'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '@/services/dashboard.service';
import { useAiInsights } from '@/hooks/useDashboard';
import type { AIInsight, InsightType } from '@/types';

// ============================================================
// Insight type → visual config mapping
// ============================================================

const INSIGHT_CONFIG: Record<
  InsightType,
  {
    icon: string;
    iconColor: string;
    bgColor: string;
    borderColor: string;
    badgeColor: string;
    badgeText: string;
  }
> = {
  warning: {
    icon: 'warning',
    iconColor: 'text-[#E37400]',
    bgColor: 'bg-[#FEF7E0]',
    borderColor: 'border-[#FDD663]',
    badgeColor: 'bg-[#E37400]',
    badgeText: 'Cảnh báo',
  },
  success: {
    icon: 'check_circle',
    iconColor: 'text-[#1E8E3E]',
    bgColor: 'bg-[#E6F4EA]',
    borderColor: 'border-[#A8DAB5]',
    badgeColor: 'bg-[#1E8E3E]',
    badgeText: 'Tích cực',
  },
  info: {
    icon: 'info',
    iconColor: 'text-[#1A73E8]',
    bgColor: 'bg-[#E8F0FE]',
    borderColor: 'border-[#AECBFA]',
    badgeColor: 'bg-[#1A73E8]',
    badgeText: 'Thông tin',
  },
  action: {
    icon: 'bolt',
    iconColor: 'text-[#A142F4]',
    bgColor: 'bg-[#F3E8FD]',
    borderColor: 'border-[#D7AEFB]',
    badgeColor: 'bg-[#A142F4]',
    badgeText: 'Hành động',
  },
};

// ============================================================
// Single Insight Item
// ============================================================

function InsightItem({ insight, index }: { insight: AIInsight; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const config = INSIGHT_CONFIG[insight.type] || INSIGHT_CONFIG.info;

  return (
    <div
      className={`group rounded-lg border p-4 transition-all duration-200 hover:shadow-sm ${config.borderColor} ${config.bgColor}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <div
          className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-white/80 shadow-sm`}
        >
          <span className={`material-symbols-outlined text-[20px] ${config.iconColor}`}>
            {config.icon}
          </span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex items-center gap-2">
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide text-white ${config.badgeColor}`}
            >
              {config.badgeText}
            </span>
          </div>

          <h4 className="mb-1 text-[13px] leading-snug font-semibold text-[#202124]">
            {insight.title}
          </h4>

          <p className="mb-0 text-[12px] leading-relaxed text-[#5F6368]">{insight.description}</p>

          {/* Expandable suggestion */}
          {insight.suggestion && (
            <div className="mt-2">
              <button
                onClick={() => setExpanded(!expanded)}
                className="flex items-center gap-1 text-[12px] font-medium text-[#1A73E8] transition-colors hover:text-[#174EA6]"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {expanded ? 'expand_less' : 'lightbulb'}
                </span>
                {expanded ? 'Ẩn đề xuất' : 'Xem đề xuất'}
              </button>

              {expanded && (
                <div className="mt-2 rounded-md border border-[#DADCE0] bg-white/90 p-3 text-[12px] leading-relaxed text-[#3C4043]">
                  <span className="material-symbols-outlined mr-1 inline-block align-text-bottom text-[14px] text-[#F9AB00]">
                    tips_and_updates
                  </span>
                  {insight.suggestion}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// Skeleton Loader
// ============================================================

function InsightSkeleton() {
  return (
    <div className="flex animate-pulse items-start gap-3 rounded-lg border border-[#E8EAED] bg-[#F8F9FA] p-4">
      <div className="h-9 w-9 flex-shrink-0 rounded-full bg-[#E8EAED]" />
      <div className="flex-1 space-y-2">
        <div className="h-3 w-16 rounded bg-[#E8EAED]" />
        <div className="h-4 w-3/4 rounded bg-[#E8EAED]" />
        <div className="h-3 w-full rounded bg-[#E8EAED]" />
        <div className="h-3 w-5/6 rounded bg-[#E8EAED]" />
      </div>
    </div>
  );
}

// ============================================================
// Main AIInsightCard Component
// ============================================================

export const AIInsightCard = () => {
  const { data, isLoading, isError, error } = useAiInsights();
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const freshData = await dashboardService.getAiInsights(true);
      queryClient.setQueryData(['dashboard-ai-insights'], freshData);
    } catch {
      // silently fail — user sees stale data
    } finally {
      setIsRefreshing(false);
    }
  };

  // ─── Loading State ──────────────────────────────────────
  if (isLoading) {
    return (
      <div className="mb-6 rounded-xl border border-[#E8EAED] bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-5 w-5 animate-pulse rounded bg-[#E8EAED]" />
          <div className="h-4 w-48 animate-pulse rounded bg-[#E8EAED]" />
        </div>
        <div className="grid gap-3 md:grid-cols-2">
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
          <InsightSkeleton />
        </div>
      </div>
    );
  }

  // ─── Error State ────────────────────────────────────────
  if (isError) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#FCE8E6] bg-[#FDF0EF] p-4">
        <span className="material-symbols-outlined text-[20px] text-[#D93025]">error</span>
        <div className="flex-1">
          <p className="text-[13px] font-medium text-[#D93025]">Không thể tải AI Insights</p>
          <p className="text-[12px] text-[#5F6368]">
            {(error as Error)?.message || 'Vui lòng thử lại sau.'}
          </p>
        </div>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['dashboard-ai-insights'] })}
          className="rounded-md border border-[#DADCE0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#D93025] transition-colors hover:bg-[#FDF0EF]"
        >
          Thử lại
        </button>
      </div>
    );
  }

  // ─── Empty State ────────────────────────────────────────
  if (!data || data.insights.length === 0) {
    return (
      <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#E8EAED] bg-[#F8F9FA] p-4">
        <span className="material-symbols-outlined text-[20px] text-[#5F6368]">
          sentiment_satisfied
        </span>
        <p className="text-[13px] text-[#5F6368]">
          Mọi thứ đều ổn! Hiện không có insight đặc biệt nào.
        </p>
      </div>
    );
  }

  // ─── Insights Data ─────────────────────────────────────
  const insights = data.insights;
  const generatedAt = new Date(data.generatedAt);
  const timeAgo = getTimeAgo(generatedAt);
  const warningCount = insights.filter((i) => i.type === 'warning').length;
  const actionCount = insights.filter((i) => i.type === 'action').length;

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-[#E8EAED] bg-white shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#F1F3F4] px-5 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#4285F4] to-[#A142F4]">
            <span className="material-symbols-outlined text-[18px] text-white">auto_awesome</span>
          </div>

          <div>
            <h3 className="text-[14px] font-semibold text-[#202124]">AI Insights</h3>
            <p className="text-[11px] text-[#80868B]">
              Cập nhật {timeAgo}
              {data.cached && ' · từ bộ nhớ đệm'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Summary badges */}
          {warningCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#FEF7E0] px-2.5 py-1 text-[11px] font-medium text-[#E37400]">
              <span className="material-symbols-outlined text-[13px]">warning</span>
              {warningCount}
            </span>
          )}
          {actionCount > 0 && (
            <span className="inline-flex items-center gap-1 rounded-full bg-[#F3E8FD] px-2.5 py-1 text-[11px] font-medium text-[#A142F4]">
              <span className="material-symbols-outlined text-[13px]">bolt</span>
              {actionCount}
            </span>
          )}

          {/* Refresh button */}
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            title="Phân tích lại với dữ liệu mới nhất"
            className="flex items-center gap-1.5 rounded-md border border-[#DADCE0] bg-white px-3 py-1.5 text-[12px] font-medium text-[#1A73E8] transition-all hover:bg-[#F0F6FF] disabled:pointer-events-none disabled:opacity-50"
          >
            <span
              className={`material-symbols-outlined text-[16px] ${isRefreshing ? 'animate-spin' : ''}`}
            >
              refresh
            </span>
            {isRefreshing ? 'Đang phân tích...' : 'Làm mới'}
          </button>
        </div>
      </div>

      {/* Insight Grid */}
      <div className="grid gap-3 p-5 md:grid-cols-2">
        {insights.map((insight, index) => (
          <InsightItem key={`${insight.type}-${index}`} insight={insight} index={index} />
        ))}
      </div>
    </div>
  );
};

// ============================================================
// Utility: Relative Time
// ============================================================

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.floor(diffMs / 60_000);

  if (diffMin < 1) return 'vừa xong';
  if (diffMin < 60) return `${diffMin} phút trước`;

  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;

  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} ngày trước`;
}
