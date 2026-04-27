'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { OnboardingBuilder } from '@/components/onboarding/OnboardingBuilder';
import { useOnboardingTemplate, useUpdateOnboardingTemplate } from '@/hooks/useOnboarding';
import { toast } from '@/lib/toast';
import type { UpsertTemplateInput } from '@/types/onboarding';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function OnboardingTemplateBuilderPage({ params }: PageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { data, isLoading, error } = useOnboardingTemplate(id);
  const updateMutation = useUpdateOnboardingTemplate();

  const handleSave = async (input: UpsertTemplateInput) => {
    try {
      await updateMutation.mutateAsync({ id, input });
      toast.success('Đã lưu thay đổi');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không lưu được';
      toast.error('Lỗi lưu', { description: msg });
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-[#1A73E8]" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-12 text-center">
        <h2 className="text-lg font-semibold text-[#202124] dark:text-slate-100">
          Không tải được mẫu này
        </h2>
        <p className="mt-1 text-sm text-[#5F6368] dark:text-slate-400">
          Mẫu có thể đã bị xóa hoặc bạn không có quyền truy cập.
        </p>
        <button
          onClick={() => router.push('/manager/onboarding/templates')}
          className="mt-4 rounded-lg bg-[#1A73E8] px-4 py-2 text-sm font-medium text-white"
        >
          Về danh sách
        </button>
      </div>
    );
  }

  return (
    <OnboardingBuilder
      key={`${data.id}-${data.updatedAt}`}
      initial={data}
      onCancel={() => router.push('/manager/onboarding/templates')}
      onSave={handleSave}
      isSaving={updateMutation.isPending}
      saveLabel="Lưu thay đổi"
      title={data.isSystem ? 'Mẫu hệ thống — sẽ lưu thành bản chỉnh sửa' : 'Chỉnh sửa mẫu'}
    />
  );
}
