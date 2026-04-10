export interface Student {
  id: number;
  initial: string;
  name: string;
  email: string;
  department: string;
  role: string;
  courses: number;
  joinDate: string;
  status: 'active' | 'inactive';
}
