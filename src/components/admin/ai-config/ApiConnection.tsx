'use client';

import React, { useState } from 'react';
import type { AiProvider } from '@/services/ai-config.service';

interface ApiConnectionProps {
  provider: AiProvider;
  chatModel: string;
  onChangeProvider: (value: AiProvider) => void;
  onChangeChatModel: (value: string) => void;
  onTestConnection: () => Promise<void> | void;
}

const MODEL_OPTIONS: Record<AiProvider, string[]> = {
  gemini: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-1.5-flash', 'gemini-1.5-pro-latest'],
  openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo'],
  claude: ['claude-3-5-sonnet-latest', 'claude-3-5-haiku-latest', 'claude-3-opus-latest'],
};

export const ApiConnection = ({
  provider,
  chatModel,
  onChangeProvider,
  onChangeChatModel,
  onTestConnection,
}: ApiConnectionProps) => {
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const handleTestConnection = async () => {
    setIsTesting(true);
    setIsConnected(false);
    try {
      await onTestConnection();
      setIsConnected(true);
    } finally {
      setIsTesting(false);
    }
  };

  const modelChoices = MODEL_OPTIONS[provider] ?? [];

  return (
    <div className="mb-6 flex flex-col overflow-hidden rounded-lg border border-[#DADCE0] bg-white">
      <div className="flex items-center justify-between border-b border-[#DADCE0] bg-[#FAFAFA] px-6 py-4">
        <h3 className="m-0 flex items-center gap-2 text-[15px] font-medium text-[#202124]">
          <span className="material-symbols-outlined text-[#5F6368]">api</span> Kết nối API Server
        </h3>
        <div
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium ${isConnected ? 'bg-[#E6F4EA] text-[#137333]' : 'bg-[#F1F3F4] text-[#5F6368]'}`}
        >
          <div className="h-2 w-2 rounded-full bg-current"></div>{' '}
          {isTesting ? 'Đang kiểm tra...' : isConnected ? 'Đã kết nối' : 'Chưa kết nối'}
        </div>
      </div>
      <div className="p-6">
        <div className="mb-0 grid grid-cols-2 gap-6">
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-medium text-[#202124]">
              Nhà cung cấp (Provider)
            </label>
            <select
              value={provider}
              onChange={(e) => onChangeProvider(e.target.value as AiProvider)}
              className="w-full cursor-pointer appearance-none rounded border border-[#DADCE0] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#1A73E8]"
            >
              <option value="gemini">Google Gemini API</option>
              <option value="openai">OpenAI (ChatGPT)</option>
              <option value="claude">Anthropic Claude</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-medium text-[#202124]">
              Mô hình sử dụng (Model)
            </label>
            <select
              value={chatModel}
              onChange={(e) => onChangeChatModel(e.target.value)}
              className="w-full cursor-pointer appearance-none rounded border border-[#DADCE0] bg-white px-3 py-2.5 text-[14px] outline-none focus:border-[#1A73E8]"
            >
              {!modelChoices.includes(chatModel) && <option value={chatModel}>{chatModel}</option>}
              {modelChoices.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative mb-6">
          <label className="mb-2 block text-[13px] font-medium text-[#202124]">
            Secret API Key (đã lưu trên server)
          </label>
          <div className="relative flex items-center">
            <input
              type="password"
              readOnly
              className="w-full cursor-not-allowed rounded-[4px] border border-[#DADCE0] bg-[#F8F9FA] px-3 py-2.5 font-mono text-[14px] text-[#5F6368] outline-none"
              value="********************************"
            />
          </div>
          <span className="mt-1 block text-[11px] text-[#5F6368]">
            API Key được nạp từ biến môi trường <code>GEMINI_API_KEY</code> trên server, không thay
            đổi từ giao diện này được. Liên hệ DevOps để xoay key.
          </span>
        </div>

        <button
          type="button"
          onClick={handleTestConnection}
          disabled={isTesting}
          className="flex h-9 items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-white px-4 text-[13px] font-medium text-[#1A73E8] hover:bg-[#F1F3F4] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <span className="material-symbols-outlined text-[18px]">network_check</span>{' '}
          {isTesting ? 'Đang kiểm tra...' : 'Kiểm tra kết nối'}
        </button>
      </div>
    </div>
  );
};
