import { create } from 'zustand';
import { chatApi, type ChatMessage, type ChatSession, type ChatSource } from '@/services/chat.service';

// ============================================================
// AI Chat Store — Zustand
// Manages chat sessions, messages, streaming state
// ============================================================

interface ChatStore {
  // ----- State -----
  sessions: ChatSession[];
  activeSessionId: string | null;
  messages: ChatMessage[];
  isOpen: boolean;
  isLoading: boolean;
  isStreaming: boolean;
  streamingContent: string;
  streamingSources: ChatSource[];
  error: string | null;
  abortFn: (() => void) | null;

  // ----- Actions -----
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
  setError: (error: string | null) => void;

  // Session actions
  loadSessions: () => Promise<void>;
  selectSession: (sessionId: string) => Promise<void>;
  createNewSession: () => void;
  deleteSession: (sessionId: string) => Promise<void>;

  // Message actions
  sendMessage: (message: string) => Promise<void>;
  stopStreaming: () => void;
}

export const useChatStore = create<ChatStore>()((set, get) => ({
  // ----- Initial State -----
  sessions: [],
  activeSessionId: null,
  messages: [],
  isOpen: false,
  isLoading: false,
  isStreaming: false,
  streamingContent: '',
  streamingSources: [],
  error: null,
  abortFn: null,

  // ----- UI Actions -----
  toggleChat: () => set((s) => ({ isOpen: !s.isOpen })),
  openChat: () => {
    set({ isOpen: true });
    get().loadSessions();
  },
  closeChat: () => set({ isOpen: false }),
  setError: (error) => set({ error }),

  // ----- Session Actions -----
  loadSessions: async () => {
    try {
      const sessions = await chatApi.getSessions();
      set({ sessions });
    } catch {
      // Silent fail — sessions will be empty
    }
  },

  selectSession: async (sessionId: string) => {
    set({ activeSessionId: sessionId, isLoading: true, error: null });
    try {
      const messages = await chatApi.getMessages(sessionId);
      set({ messages, isLoading: false });
    } catch {
      set({ error: 'Không thể tải tin nhắn.', isLoading: false });
    }
  },

  createNewSession: () => {
    set({
      activeSessionId: null,
      messages: [],
      streamingContent: '',
      streamingSources: [],
      error: null,
    });
  },

  deleteSession: async (sessionId: string) => {
    try {
      await chatApi.deleteSession(sessionId);
      const { activeSessionId } = get();
      set((s) => ({
        sessions: s.sessions.filter((session) => session.id !== sessionId),
        ...(activeSessionId === sessionId
          ? { activeSessionId: null, messages: [] }
          : {}),
      }));
    } catch {
      set({ error: 'Không thể xoá phiên trò chuyện.' });
    }
  },

  // ----- Message Actions -----
  sendMessage: async (message: string) => {
    const { activeSessionId, isStreaming } = get();
    if (isStreaming) return;

    // Add user message optimistically
    const userMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      role: 'user',
      content: message,
      createdAt: new Date().toISOString(),
    };

    set((s) => ({
      messages: [...s.messages, userMsg],
      isStreaming: true,
      streamingContent: '',
      streamingSources: [],
      error: null,
    }));

    const abortFn = chatApi.sendMessageStream(
      message,
      activeSessionId,
      // onEvent
      (event) => {
        if (event.type === 'text') {
          set((s) => ({
            streamingContent: s.streamingContent + event.data,
          }));
        } else if (event.type === 'sources') {
          try {
            const sources = JSON.parse(event.data) as ChatSource[];
            set({ streamingSources: sources });
          } catch {
            // Skip
          }
        } else if (event.type === 'session') {
          const newSessionId = event.data;
          set({ activeSessionId: newSessionId });
          // Reload sessions to get the new one
          get().loadSessions();
        }
      },
      // onDone
      () => {
        const { streamingContent, streamingSources } = get();
        const assistantMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: streamingContent,
          sources: streamingSources.length > 0 ? streamingSources : undefined,
          createdAt: new Date().toISOString(),
        };

        set((s) => ({
          messages: [...s.messages, assistantMsg],
          isStreaming: false,
          streamingContent: '',
          streamingSources: [],
          abortFn: null,
        }));
      },
      // onError
      (error) => {
        set({
          isStreaming: false,
          streamingContent: '',
          error,
          abortFn: null,
        });
      },
    );

    set({ abortFn });
  },

  stopStreaming: () => {
    const { abortFn, streamingContent, streamingSources } = get();
    if (abortFn) abortFn();

    if (streamingContent) {
      const assistantMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: streamingContent + '\n\n*(Đã dừng tạo câu trả lời)*',
        sources: streamingSources.length > 0 ? streamingSources : undefined,
        createdAt: new Date().toISOString(),
      };

      set((s) => ({
        messages: [...s.messages, assistantMsg],
        isStreaming: false,
        streamingContent: '',
        streamingSources: [],
        abortFn: null,
      }));
    } else {
      set({ isStreaming: false, abortFn: null });
    }
  },
}));
