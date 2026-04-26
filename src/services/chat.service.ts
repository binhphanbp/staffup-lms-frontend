import api from '@/lib/axios';
import { useAuthStore } from '@/store/useAuthStore';

// ============================================================
// AI Chat API Service — SSE Streaming + REST endpoints
// ============================================================

const API_BASE = '/ai-chat';

// ----- Types -----

export interface ChatSource {
  sourceType: string;
  sourceId: string;
  title: string;
  snippet: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  sources?: ChatSource[];
  createdAt: string;
}

export interface ChatSession {
  id: string;
  title: string | null;
  createdAt: string;
  messageCount: number;
}

// ----- Course Q&A (Learning Assistant) -----

export interface LessonSource {
  lessonTitle: string;
  moduleTitle: string;
  courseTitle: string;
  snippet: string;
}

export interface CourseAskResponse {
  content: string;
  sources: LessonSource[];
}

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// ----- Session Management -----

export const chatApi = {
  getSessions: async (): Promise<ChatSession[]> => {
    const { data } = await api.get<ApiResponse<ChatSession[]>>(`${API_BASE}/sessions`);
    return data.data;
  },

  createSession: async (title?: string): Promise<{ id: string; title: string | null }> => {
    const { data } = await api.post<ApiResponse<{ id: string; title: string | null }>>(
      `${API_BASE}/sessions`,
      { title },
    );
    return data.data;
  },

  getMessages: async (sessionId: string): Promise<ChatMessage[]> => {
    const { data } = await api.get<ApiResponse<ChatMessage[]>>(
      `${API_BASE}/sessions/${sessionId}/messages`,
    );
    return data.data;
  },

  deleteSession: async (sessionId: string): Promise<void> => {
    await api.delete(`${API_BASE}/sessions/${sessionId}`);
  },

  // Non-streaming chat
  sendMessage: async (
    message: string,
    sessionId?: string | null,
  ): Promise<{ sessionId: string; content: string; sources: ChatSource[] }> => {
    const { data } = await api.post<
      ApiResponse<{ sessionId: string; content: string; sources: ChatSource[] }>
    >(`${API_BASE}/message`, { message, sessionId });
    return data.data;
  },

  // SSE Streaming chat
  sendMessageStream: (
    message: string,
    sessionId: string | null,
    onEvent: (event: { type: string; data: string }) => void,
    onDone: () => void,
    onError: (error: string) => void,
  ): (() => void) => {
    const controller = new AbortController();
    const token = useAuthStore.getState().token;
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

    fetch(`${baseURL}${API_BASE}/message/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ message, sessionId }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            onError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          } else if (response.status === 429) {
            onError('Bạn đã gửi quá nhiều tin nhắn. Vui lòng chờ một chút.');
          } else {
            onError('Không thể kết nối đến server. Vui lòng thử lại.');
          }
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          onError('Trình duyệt không hỗ trợ streaming.');
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let completed = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event = JSON.parse(line.slice(6));
                if (event.type === 'done') {
                  completed = true;
                  onDone();
                } else if (event.type === 'error') {
                  completed = true;
                  onError(event.data);
                } else {
                  onEvent(event);
                }
              } catch {
                // Skip malformed events
              }
            }
          }
        }

        if (!completed) {
          onDone();
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          onError('Kết nối bị gián đoạn. Vui lòng thử lại.');
        }
      });

    // Return abort function
    return () => controller.abort();
  },

  // ----- Course Q&A (scoped per course) -----

  // Non-streaming course Q&A
  askCourse: async (courseId: string, question: string): Promise<CourseAskResponse> => {
    const { data } = await api.post<ApiResponse<CourseAskResponse>>(
      `${API_BASE}/course/${courseId}/ask`,
      { question },
    );
    return data.data;
  },

  // SSE Streaming course Q&A
  askCourseStream: (
    courseId: string,
    question: string,
    onEvent: (event: { type: string; data: string }) => void,
    onDone: () => void,
    onError: (error: string) => void,
  ): (() => void) => {
    const controller = new AbortController();
    const token = useAuthStore.getState().token;
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

    fetch(`${baseURL}${API_BASE}/course/${courseId}/ask/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ question }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          if (response.status === 401) {
            onError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
          } else if (response.status === 403) {
            onError('Bạn chưa được ghi danh vào khóa học này.');
          } else if (response.status === 429) {
            onError('Bạn đã gửi quá nhiều câu hỏi. Vui lòng chờ một chút.');
          } else {
            onError('Không thể kết nối đến server. Vui lòng thử lại.');
          }
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          onError('Trình duyệt không hỗ trợ streaming.');
          return;
        }

        const decoder = new TextDecoder();
        let buffer = '';
        let completed = false;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const event = JSON.parse(line.slice(6));
                if (event.type === 'done') {
                  completed = true;
                  onDone();
                } else if (event.type === 'error') {
                  completed = true;
                  onError(event.data);
                } else {
                  onEvent(event);
                }
              } catch {
                // Skip malformed events
              }
            }
          }
        }

        if (!completed) {
          onDone();
        }
      })
      .catch((err) => {
        if (err.name !== 'AbortError') {
          onError('Kết nối bị gián đoạn. Vui lòng thử lại.');
        }
      });

    return () => controller.abort();
  },
};
