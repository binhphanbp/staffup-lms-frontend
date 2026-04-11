'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelfEnroll } from '@/hooks/useEnrollments';
import { useAuthStore } from '@/store/useAuthStore';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface EnrollButtonProps {
  courseId: string;
  courseTitle: string;
}

export function EnrollButton({ courseId, courseTitle }: EnrollButtonProps) {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [showSuccess, setShowSuccess] = useState(false);

  const enrollMutation = useSelfEnroll();

  const handleEnroll = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    enrollMutation.mutate(courseId, {
      onSuccess: () => {
        setShowSuccess(true);
        // Redirect to learning room after 1.5 seconds
        setTimeout(() => {
          router.push(`/courses/detail/learning-room?courseId=${courseId}`);
        }, 1500);
      },
    });
  };

  if (showSuccess) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-center">
        <CheckCircle className="mx-auto mb-2 h-8 w-8 text-green-600" />
        <p className="mb-1 text-sm font-semibold text-green-800">
          Ghi danh thành công!
        </p>
        <p className="text-xs text-green-600">
          Đang chuyển đến phòng học...
        </p>
      </div>
    );
  }

  if (enrollMutation.isError) {
    return (
      <div className="space-y-3">
        <div className="rounded-lg border border-red-200 bg-red-50 p-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-600" />
            <div>
              <p className="text-xs font-semibold text-red-800">Ghi danh thất bại</p>
              <p className="text-xs text-red-600">
                {(enrollMutation.error as any)?.response?.data?.message || 
                  'Có lỗi xảy ra. Vui lòng thử lại.'}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleEnroll}
          className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={enrollMutation.isPending}
      className="w-full rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {enrollMutation.isPending ? (
        <span className="flex items-center justify-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Đang ghi danh...
        </span>
      ) : (
        <span className="flex items-center justify-center gap-2">
          <i className="fa-solid fa-user-plus"></i>
          Ghi danh khóa học
        </span>
      )}
    </button>
  );
}
