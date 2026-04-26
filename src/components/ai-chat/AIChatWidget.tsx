'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import type { ChatSource } from '@/services/chat.service';
import './AIChatWidget.css';

// ============================================================
// AI Chat Widget — Floating Chat Component
// Premium glassmorphism design with SSE streaming
// ============================================================

const SUGGESTIONS = [
  '📋 Nội quy công ty có những gì?',
  '🕐 Quy định về giờ làm việc?',
  '🏖️ Chính sách nghỉ phép như thế nào?',
  '💼 Quy trình xin nghỉ việc?',
];

// ----- Sub-components -----

function MessageSources({ sources }: { sources: ChatSource[] }) {
  if (!sources || sources.length === 0) return null;

  return (
    <div className="chat-msg-sources">
      <div className="chat-msg-sources-label">📎 Nguồn tham khảo</div>
      {sources.map((source, i) => (
        <span key={i} className="chat-source-tag">
          {source.title}
        </span>
      ))}
    </div>
  );
}

function StreamingDots() {
  return (
    <div className="chat-streaming-indicator">
      <div className="dot" />
      <div className="dot" />
      <div className="dot" />
    </div>
  );
}

function WelcomeScreen({ onSuggestionClick }: { onSuggestionClick: (msg: string) => void }) {
  return (
    <div className="chat-welcome">
      <div className="chat-welcome-icon">🤖</div>
      <h4>Trợ lý AI StaffUp</h4>
      <p>Xin chào! Tôi có thể giúp bạn tra cứu nội quy, chính sách và thông tin nội bộ công ty.</p>
      <div className="chat-suggestions">
        {SUGGESTIONS.map((s, i) => (
          <button key={i} className="chat-suggestion-btn" onClick={() => onSuggestionClick(s)}>
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}

function SessionSidebar({ onClose }: { onClose: () => void }) {
  const { sessions, selectSession, deleteSession, createNewSession } = useChatStore();

  return (
    <div className="chat-sidebar">
      <div className="chat-sidebar-header">
        <h4>💬 Lịch sử trò chuyện</h4>
        <button className="chat-header-btn" onClick={onClose} title="Đóng">
          ✕
        </button>
      </div>
      <div style={{ padding: '8px 12px' }}>
        <button
          className="chat-suggestion-btn"
          style={{ width: '100%', textAlign: 'center', fontWeight: 500 }}
          onClick={() => {
            createNewSession();
            onClose();
          }}
        >
          ＋ Cuộc trò chuyện mới
        </button>
      </div>
      <div className="chat-sidebar-list">
        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 24, color: '#999', fontSize: 13 }}>
            Chưa có cuộc trò chuyện nào
          </div>
        ) : (
          sessions.map((session) => (
            <div key={session.id} className="chat-session-item">
              <div
                style={{ flex: 1, minWidth: 0, cursor: 'pointer' }}
                onClick={() => {
                  selectSession(session.id);
                  onClose();
                }}
              >
                <div className="session-title">{session.title || 'Cuộc trò chuyện'}</div>
                <div className="session-meta">
                  {session.messageCount} tin nhắn •{' '}
                  {new Date(session.createdAt).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <button
                className="chat-session-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(session.id);
                }}
                title="Xoá"
              >
                🗑️
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ----- Main Component -----

export default function AIChatWidget() {
  const { isAuthenticated } = useAuthStore();
  const {
    isOpen,
    toggleChat,
    messages,
    isStreaming,
    streamingContent,
    streamingSources,
    isLoading,
    error,
    setError,
    sendMessage,
    stopStreaming,
    loadSessions,
  } = useChatStore();

  const [input, setInput] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
      loadSessions();
    }
  }, [isOpen, loadSessions]);

  const handleSend = useCallback(
    (msg?: string) => {
      const text = (msg || input).trim();
      if (!text || isStreaming) return;

      sendMessage(text);
      setInput('');

      // Reset textarea height
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
    },
    [input, isStreaming, sendMessage],
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    // Auto-resize
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  };

  // Don't render for unauthenticated users
  if (!isAuthenticated) return null;

  return (
    <div className="print:hidden">
      {/* Toggle Button */}
      <button
        className="chat-toggle-btn"
        onClick={toggleChat}
        title={isOpen ? 'Đóng trợ lý AI' : 'Mở trợ lý AI'}
        aria-label="Toggle AI Chat"
      >
        {!isOpen && <span className="pulse-ring" />}
        {isOpen ? '✕' : '🤖'}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div className="chat-container">
          {/* Header */}
          <div className="chat-header">
            <div className="chat-header-left">
              <div className="chat-header-avatar">🤖</div>
              <div className="chat-header-info">
                <h3>Trợ lý AI StaffUp</h3>
                <p>Nội quy & Chính sách công ty</p>
              </div>
            </div>
            <div className="chat-header-actions">
              <button
                className="chat-header-btn"
                onClick={() => setShowSidebar(!showSidebar)}
                title="Lịch sử"
              >
                📋
              </button>
              <button className="chat-header-btn" onClick={toggleChat} title="Đóng">
                ✕
              </button>
            </div>
          </div>

          {/* Sidebar */}
          {showSidebar && <SessionSidebar onClose={() => setShowSidebar(false)} />}

          {/* Messages */}
          <div className="chat-messages">
            {isLoading ? (
              <div className="chat-loading">Đang tải...</div>
            ) : messages.length === 0 && !isStreaming ? (
              <WelcomeScreen onSuggestionClick={handleSend} />
            ) : (
              <>
                {messages.map((msg) => (
                  <div key={msg.id} className={`chat-msg ${msg.role}`}>
                    <div className="chat-msg-avatar">{msg.role === 'user' ? '👤' : '🤖'}</div>
                    <div className="chat-msg-bubble">
                      {msg.role === 'assistant' ? (
                        <>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{msg.content}</ReactMarkdown>
                          {msg.sources && <MessageSources sources={msg.sources} />}
                        </>
                      ) : (
                        msg.content
                      )}
                    </div>
                  </div>
                ))}

                {/* Streaming message */}
                {isStreaming && (
                  <div className="chat-msg assistant">
                    <div className="chat-msg-avatar">🤖</div>
                    <div className="chat-msg-bubble">
                      {streamingContent ? (
                        <>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {streamingContent}
                          </ReactMarkdown>
                          {streamingSources.length > 0 && (
                            <MessageSources sources={streamingSources} />
                          )}
                        </>
                      ) : (
                        <StreamingDots />
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Error */}
          {error && (
            <div className="chat-error" onClick={() => setError(null)}>
              ⚠️ {error}
            </div>
          )}

          {/* Input */}
          <div className="chat-input-area">
            <div className="chat-input-form">
              <div className="chat-input-wrapper">
                <textarea
                  ref={inputRef}
                  className="chat-input"
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Hỏi về nội quy, chính sách công ty..."
                  rows={1}
                  disabled={isStreaming}
                />
              </div>
              {isStreaming ? (
                <button className="chat-stop-btn" onClick={stopStreaming} title="Dừng">
                  ⏹
                </button>
              ) : (
                <button
                  className="chat-send-btn"
                  onClick={() => handleSend()}
                  disabled={!input.trim()}
                  title="Gửi"
                >
                  ➤
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
