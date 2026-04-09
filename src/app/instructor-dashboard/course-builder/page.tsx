'use client';

import React, { useState } from 'react';
import { InstructorSidebar } from '@/components/instructor/InstructorSidebar';
import { CourseBuilderHeader } from '@/components/instructor/course-builder/CourseBuilderHeader';
import { CourseBuilderStepper } from '@/components/instructor/course-builder/CourseBuilderStepper';
import { StepGeneralInfo } from '@/components/instructor/course-builder/StepGeneralInfo';
import { StepCurriculum } from '@/components/instructor/course-builder/StepCurriculum';
import { StepSettings } from '@/components/instructor/course-builder/StepSettings';
import { CourseBuilderFooter } from '@/components/instructor/course-builder/CourseBuilderFooter';

export default function CourseBuilderPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => {
        alert('Xuất bản khóa học thành công! Hệ thống sẽ thông báo cho học viên.');
        window.location.href = '/instructor-dashboard';
      }, 1500);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#f8fafc] font-sans text-slate-700">
      <InstructorSidebar />

      <main className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden bg-[#f8fafc]">
        <CourseBuilderHeader />

        <div className="relative flex flex-1 flex-col overflow-hidden">
          <CourseBuilderStepper currentStep={currentStep} />

          <div className="flex-1 overflow-hidden bg-[#f0f2f5]">
            <StepGeneralInfo isActive={currentStep === 1} />
            <StepCurriculum isActive={currentStep === 2} />
            <StepSettings isActive={currentStep === 3} />
          </div>

          <CourseBuilderFooter
            currentStep={currentStep}
            totalSteps={totalSteps}
            isSubmitting={isSubmitting}
            onPrevStep={handlePrevStep}
            onNextStep={handleNextStep}
          />
        </div>
      </main>
    </div>
  );
}
