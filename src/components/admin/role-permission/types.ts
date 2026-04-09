export interface Role {
  id: string;
  name: string;
  type: 'admin' | 'manager' | 'trainer' | 'learner' | 'custom';
  desc: string;
  isDefault: boolean;
}
