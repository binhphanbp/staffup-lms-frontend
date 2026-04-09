'use client';

import React, { useState } from 'react';

interface ApiConnectionProps {
  onShowToast: (msg: string) => void;
}

export const ApiConnection = ({ onShowToast }: ApiConnectionProps) => {
  const [showApiKey, setShowApiKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [isConnected, setIsConnected] = useState(true);

  const handleTestConnection = () => {
    setIsTesting(true);
    setIsConnected(false);
    setTimeout(() => {
      setIsTesting(false);
      setIsConnected(true);
      onShowToast('Kết nối đến Google Gemini API thành công!');
    }, 1500);
  };

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
            <select className="w-full cursor-pointer appearance-none rounded border border-[#DADCE0] bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235F6368%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_auto] bg-[position:right_12px_center] bg-no-repeat px-3 py-2.5 text-[14px] outline-none focus:border-[#1A73E8]">
              <option value="gemini" defaultValue="gemini">
                Google Gemini API
              </option>
              <option value="openai">OpenAI (ChatGPT)</option>
              <option value="claude">Anthropic Claude</option>
            </select>
          </div>
          <div className="mb-5">
            <label className="mb-2 block text-[13px] font-medium text-[#202124]">
              Mô hình sử dụng (Model)
            </label>
            <select className="w-full cursor-pointer appearance-none rounded border border-[#DADCE0] bg-white bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%235F6368%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_auto] bg-[position:right_12px_center] bg-no-repeat px-3 py-2.5 text-[14px] outline-none focus:border-[#1A73E8]">
              <option>gemini-1.5-pro-latest</option>
              <option>gemini-1.5-flash</option>
              <option>gemini-pro</option>
            </select>
          </div>
        </div>

        <div className="relative mb-6">
          <label className="mb-2 block text-[13px] font-medium text-[#202124]">
            Secret API Key (*)
          </label>
          <div className="relative flex items-center">
            <input
              type={showApiKey ? 'text' : 'password'}
              className="w-full rounded-[4px] border border-[#DADCE0] px-3 py-2.5 font-mono text-[14px] transition-all outline-none focus:border-2 focus:border-[#1A73E8]"
              defaultValue="AIzaSyBw-xXxXxXxXxXxXxXxXxXxXxXxXxXxXxX"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-1 flex h-8 w-8 items-center justify-center rounded-full text-[#5F6368] transition-colors hover:bg-[#F1F3F4]"
            >
              <span className="material-symbols-outlined text-[20px]">
                {showApiKey ? 'visibility' : 'visibility_off'}
              </span>
            </button>
          </div>
          <span className="mt-1 block text-[11px] text-[#5F6368]">
            Lấy key tại:{' '}
            <a href="#" className="text-[#1A73E8] hover:underline">
              Google AI Studio
            </a>
          </span>
        </div>

        <button
          onClick={handleTestConnection}
          className="flex items-center gap-2 rounded-[4px] border border-[#DADCE0] bg-transparent px-4 py-2 text-[13px] font-medium text-[#1A73E8] transition-all hover:border-[#E8F0FE] hover:bg-[#E8F0FE]"
        >
          <span
            className={`material-symbols-outlined text-[18px] ${isTesting ? 'animate-[spin_1s_linear_infinite]' : ''}`}
          >
            sync_alt
          </span>{' '}
          Kiểm tra kết nối
        </button>
      </div>
    </div>
  );
};
