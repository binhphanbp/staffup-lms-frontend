'use client';

import { useRouter } from 'next/navigation';
import { OnboardingBuilder } from '@/components/onboarding/OnboardingBuilder';
import { useCreateOnboardingTemplate } from '@/hooks/useOnboarding';
import { toast } from '@/lib/toast';
import type { UpsertTemplateInput } from '@/types/onboarding';

export default function NewOnboardingTemplatePage() {
  const router = useRouter();
  const createMutation = useCreateOnboardingTemplate();

  const handleSave = async (input: UpsertTemplateInput) => {
    try {
      const created = await createMutation.mutateAsync(input);
      toast.success('Đã tạo mẫu onboarding');
      router.push(`/manager/onboarding/templates/${created.id}/builder`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Không lưu được';
      toast.error('Lỗi lưu mẫu', { description: msg });
    }
  };

  return (
    <OnboardingBuilder
      onCancel={() => router.push('/manager/onboarding/templates')}
      onSave={handleSave}
      isSaving={createMutation.isPending}
      saveLabel="Tạo mẫu"
      title="Tạo mẫu onboarding mới"
    />
  );
}
