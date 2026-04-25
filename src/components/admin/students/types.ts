export interface Student {
  id: number;
  userId: string;
  initial: string;
  name: string;
  email: string;
  departmentId?: string | null;
  department: string;
  role: string;
  avatarUrl?: string | null;
  isActive?: boolean;
  courses: number;
  joinDate: string;
  status: 'active' | 'inactive';
}
