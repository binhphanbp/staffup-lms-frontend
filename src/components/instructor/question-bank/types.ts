export interface Question {
  id: string;
  content: string;
  type: 'MCQ' | 'Essay' | 'TrueFalse';
  diff: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
}
