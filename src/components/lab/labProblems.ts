import type { CodeLabLanguage, CodeLabTestCase } from '@/services/code-lab.service';

export interface LabProblem {
  id: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  language: CodeLabLanguage;
  /** Markdown-ish problem description, rendered as JSX in TaskPanel. */
  problemStatement: string;
  starterCode: string;
  testCases: CodeLabTestCase[];
}

const DIFFICULTY_LABEL_VI: Record<LabProblem['difficulty'], string> = {
  easy: 'Dễ',
  medium: 'Trung bình',
  hard: 'Khó',
};

const DIFFICULTY_BADGE_CLASS: Record<LabProblem['difficulty'], string> = {
  easy: 'border border-green-100 bg-green-50 text-green-700',
  medium: 'border border-amber-100 bg-amber-50 text-amber-700',
  hard: 'border border-red-100 bg-red-50 text-red-600',
};

export function difficultyLabel(d: LabProblem['difficulty']): string {
  return DIFFICULTY_LABEL_VI[d];
}

export function difficultyBadgeClass(d: LabProblem['difficulty']): string {
  return DIFFICULTY_BADGE_CLASS[d];
}

// ====================================================================
// Default seed problem — "Consistent Hashing"
// (Lab is currently a single-problem demo; the registry shape lets us
//  drive multi-problem mode from BE later without UI churn.)
// ====================================================================

export const consistentHashingProblem: LabProblem = {
  id: 'consistent-hashing-py',
  title: 'Triển khai Consistent Hashing',
  difficulty: 'hard',
  category: 'System Design',
  language: 'python',
  problemStatement: `Trong các hệ thống phân tán, việc phân bổ dữ liệu đều lên các server (nodes) là rất quan trọng. Thuật toán modulo thông thường (hash(key) % N) sẽ gặp vấn đề lớn (re-hashing) khi thêm hoặc bớt server.

Nhiệm vụ của bạn: Cài đặt class ConsistentHash hỗ trợ các thao tác:
- add_node(node_name): Thêm server mới vào vòng (Ring).
- remove_node(node_name): Xóa server khỏi vòng.
- get_node(key): Trả về tên server lưu trữ key.

Ràng buộc:
- Số lượng virtual nodes mặc định là 100.
- get_node phải có độ phức tạp O(log N) (gợi ý: dùng bisect).`,
  starterCode: `import hashlib
import bisect


class ConsistentHash:
    def __init__(self, replicas: int = 100):
        # Số lượng virtual nodes
        self.replicas = replicas
        self.hash_ring: dict[int, str] = {}
        self.sorted_keys: list[int] = []

    def _hash(self, key: str) -> int:
        return int(hashlib.md5(key.encode()).hexdigest(), 16)

    def add_node(self, node: str) -> None:
        # TODO: thêm 'replicas' virtual node vào ring + duy trì sorted_keys
        pass

    def remove_node(self, node: str) -> None:
        # TODO: xóa virtual node của 'node' khỏi ring
        pass

    def get_node(self, key: str) -> str | None:
        # TODO: dùng bisect để tìm node gần nhất theo chiều kim đồng hồ
        return None
`,
  testCases: [
    {
      description: 'Một node duy nhất — mọi key đều trỏ về nó',
      input: `ch = ConsistentHash()
ch.add_node("DB_Master_1")
print(ch.get_node("user_id_456"))`,
      expectedOutput: 'DB_Master_1',
    },
    {
      description: 'Hai node — key phải map về một trong hai',
      input: `ch = ConsistentHash()
ch.add_node("Server_A")
ch.add_node("Server_B")
n = ch.get_node("session_42")
print(n in ("Server_A", "Server_B"))`,
      expectedOutput: 'True',
    },
    {
      description: 'Sau khi remove, get_node không được trả về node đã xóa',
      input: `ch = ConsistentHash()
ch.add_node("Server_A")
ch.add_node("Server_B")
ch.remove_node("Server_A")
print(ch.get_node("anything") == "Server_B")`,
      expectedOutput: 'True',
    },
  ],
};

export const LAB_PROBLEMS: Record<string, LabProblem> = {
  [consistentHashingProblem.id]: consistentHashingProblem,
};
