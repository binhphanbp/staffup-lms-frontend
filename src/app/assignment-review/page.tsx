'use client';

import React, { useState } from 'react';
import { ReviewHeader } from '@/components/instructor/assignment-review/ReviewHeader';
import { ReviewQueue } from '@/components/instructor/assignment-review/ReviewQueue';
import { ReviewCodeViewer } from '@/components/instructor/assignment-review/ReviewCodeViewer';
import { ReviewRubric } from '@/components/instructor/assignment-review/ReviewRubric';

export default function AssignmentReviewPage() {
  // Trạng thái hàng đợi
  const [activeQueue, setActiveQueue] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Trạng thái các tiêu chí chấm điểm (Rubric)
  const [rubric1, setRubric1] = useState(5);
  const [rubric2, setRubric2] = useState(4);
  const [rubric3, setRubric3] = useState(5);

  const handleSubmitReview = (action: 'approve' | 'reject') => {
    if (action === 'approve') {
      setIsSubmitting(true);
      setTimeout(() => {
        alert('Đã lưu kết quả (Passed). Hệ thống sẽ chuyển sang bài tiếp theo.');
        setIsSubmitting(false);
        setActiveQueue(1); // Chuyển sang bài tiếp theo trong hàng đợi
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#f8fafc] text-slate-800">
      <ReviewHeader />

      <div className="flex w-full flex-1 overflow-hidden">
        <ReviewQueue activeQueue={activeQueue} setActiveQueue={setActiveQueue} />

        <ReviewCodeViewer />

        <ReviewRubric
          rubric1={rubric1}
          setRubric1={setRubric1}
          rubric2={rubric2}
          setRubric2={setRubric2}
          rubric3={rubric3}
          setRubric3={setRubric3}
          isSubmitting={isSubmitting}
          onSubmitReview={handleSubmitReview}
        />
      </div>
    </div>
  );
}
