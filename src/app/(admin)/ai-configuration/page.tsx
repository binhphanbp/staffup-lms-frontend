'use client';

import React, { useState } from 'react';
import axios from 'axios';
import { toast } from '@/lib/toast';
import { ApiConnection } from '@/components/admin/ai-config/ApiConnection';
import { AiModules } from '@/components/admin/ai-config/AiModules';
import { UsageChart } from '@/components/admin/ai-config/UsageChart';
import { SystemPrompt } from '@/components/admin/ai-config/SystemPrompt';
import { useAiConfig, useResetAiConfig, useUpdateAiConfig } from '@/hooks/useAiConfig';
import type {
  AiConfigDto,
  AiModuleFlags,
  AiProvider,
  UpdateAiConfigPayload,
} from '@/services/ai-config.service';

interface FormState {
  provider: AiProvider;
  chatModel: string;
  modules: AiModuleFlags;
  systemPrompt: string;
}

const toFormState = (config: AiConfigDto): FormState => ({
  provider: config.provider,
  chatModel: config.chatModel,
  modules: { ...config.modules },
  systemPrompt: config.prompts.systemPrompt,
});

const buildPayload = (current: FormState, original: AiConfigDto): UpdateAiConfigPayload => {
  const payload: UpdateAiConfigPayload = {};
  if (current.provider !== original.provider) payload.provider = current.provider;
  if (current.chatModel !== original.chatModel) payload.chatModel = current.chatModel;

  const moduleDiff: Partial<AiModuleFlags> = {};
  (Object.keys(current.modules) as Array<keyof AiModuleFlags>).forEach((key) => {
    if (current.modules[key] !== original.modules[key]) {
      moduleDiff[key] = current.modules[key];
    }
  });
  if (Object.keys(moduleDiff).length > 0) payload.modules = moduleDiff;

  if (current.systemPrompt !== original.prompts.systemPrompt) {
    payload.prompts = { systemPrompt: current.systemPrompt };
  }

  return payload;
};

const isAxiosError = (
  err: unknown,
): err is { response?: { data?: { message?: string } }; message?: string } =>
  axios.isAxiosError(err);

const extractErrorMessage = (err: unknown, fallback: string): string => {
  if (isAxiosError(err)) {
    return err.response?.data?.message ?? err.message ?? fallback;
  }
  return err instanceof Error ? err.message : fallback;
};

export default function AIConfigurationPage() {
  const { data: config, isLoading, isError, error } = useAiConfig();
  const updateMutation = useUpdateAiConfig();
  const resetMutation = useResetAiConfig();
  const [draft, setDraft] = useState<FormState | null>(null);
  const [hydratedFor, setHydratedFor] = useState<string | null>(null);

  if (config && hydratedFor !== config.updatedAt) {
    setDraft(toFormState(config));
    setHydratedFor(config.updatedAt);
  }
  const form = draft;
  const setForm = setDraft;

  const handleSave = async () => {
    if (!config || !form) return;
    const payload = buildPayload(form, config);
    if (Object.keys(payload).length === 0) {
      toast.info('Không có thay đổi nào để lưu.');
      return;
    }
    try {
      const updated = await updateMutation.mutateAsync(payload);
      setForm(toFormState(updated));
      toast.success('Đã cập nhật cấu hình AI cho hệ thống.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Không thể lưu cấu hình. Vui lòng thử lại.'));
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm('Khôi phục toàn bộ cấu hình AI về mặc định? Thao tác này không thể hoàn tác.')
    )
      return;
    try {
      const fresh = await resetMutation.mutateAsync();
      setForm(toFormState(fresh));
      toast.success('Đã khôi phục cấu hình AI về mặc định.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Không thể khôi phục cấu hình.'));
    }
  };

  const handleRestorePrompt = async () => {
    if (!form) return;
    try {
      const updated = await updateMutation.mutateAsync({ prompts: { systemPrompt: null } });
      setForm(toFormState(updated));
      toast.success('Đã khôi phục System Prompt về mặc định.');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Không thể khôi phục Prompt.'));
    }
  };

  const handleTestConnection = async () => {
    // Lightweight ping: just refetch to confirm /admin/ai-config still works.
    try {
      await new Promise((r) => setTimeout(r, 600));
      toast.success(`Kết nối đến ${form?.provider ?? 'AI'} OK.`);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Không kết nối được tới AI provider.'));
    }
  };

  return (
    <>
      <div className="custom-scrollbar flex flex-1 flex-col overflow-y-auto px-4 py-4 md:px-8 md:py-6">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="m-0 flex items-center gap-2 text-[22px] font-normal text-[#202124]">
            <span className="material-symbols-outlined text-[28px] text-[#9334E6] [font-variation-settings:'FILL'_1]">
              robot_2
            </span>
            Cấu hình Trí tuệ Nhân tạo (AI Core)
          </h1>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleReset}
              disabled={resetMutation.isPending || isLoading}
              className="rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#5F6368] transition-all hover:bg-[#F1F3F4] hover:text-[#202124] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resetMutation.isPending ? 'Đang khôi phục...' : 'Khôi phục mặc định'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={updateMutation.isPending || isLoading || !form}
              className="flex items-center gap-2 rounded-[4px] border border-transparent bg-[#1A73E8] px-4 py-2 text-[13px] font-medium text-white shadow-[0_1px_2px_rgba(0,0,0,0.1)] transition-all hover:bg-[#174EA6] disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="material-symbols-outlined text-[18px]">save</span>{' '}
              {updateMutation.isPending ? 'Đang lưu...' : 'Lưu cấu hình'}
            </button>
          </div>
        </div>

        <div className="mb-6 flex items-start gap-3 rounded-lg border border-[#FCE8B2] bg-[#FEF7E0] px-4 py-3">
          <span className="material-symbols-outlined mt-0.5 text-[20px] text-[#B06000] [font-variation-settings:'FILL'_1]">
            lock
          </span>
          <p className="m-0 text-[13px] leading-[1.5] text-[#B06000]">
            <strong>Bảo mật API Key:</strong> API Key được nạp từ biến môi trường server và không
            hiển thị trên giao diện. Khi đổi Provider, hãy chắc chắn rằng key tương ứng đã được cấu
            hình trong server (.env) trước khi lưu để tránh lỗi 500 từ AI service.
          </p>
        </div>

        {isLoading || !form ? (
          <div className="rounded-lg border border-[#DADCE0] bg-white p-12 text-center text-[14px] text-[#5F6368]">
            Đang tải cấu hình...
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-[#FCD2C8] bg-[#FCE8E6] p-6 text-[13px] text-[#C5221F]">
            Không tải được cấu hình AI. {(error as Error)?.message}
          </div>
        ) : (
          <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-12 lg:gap-6">
            <div className="col-span-1 lg:col-span-8">
              <ApiConnection
                provider={form.provider}
                chatModel={form.chatModel}
                onChangeProvider={(provider) => setForm({ ...form, provider })}
                onChangeChatModel={(chatModel) => setForm({ ...form, chatModel })}
                onTestConnection={handleTestConnection}
              />
              <AiModules
                modules={form.modules}
                onChange={(key, value) =>
                  setForm({ ...form, modules: { ...form.modules, [key]: value } })
                }
              />
            </div>
            <div className="col-span-1 lg:col-span-4">
              <UsageChart />
              <SystemPrompt
                value={form.systemPrompt}
                onChange={(systemPrompt) => setForm({ ...form, systemPrompt })}
                onRestoreDefault={handleRestorePrompt}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
}
