export interface Submission {
  id: number;
  name: string;
  email: string;
  course: string;
  assignment: string;
  submitDate: string;
  status: 'Pending' | 'AIGraded' | 'Graded';
  aiScore: number | null;
  manualScore: number | null;
}
