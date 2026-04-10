'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Mail, GraduationCap, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const forgotPasswordSchema = z.object({
  email: z.email('Email không hợp lệ'),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (_data: ForgotPasswordFormData) => {
    try {
      setServerError(null);
      // Hiện tại backend chưa có API forgot-password.
      // Hiển thị thông báo hướng dẫn liên hệ quản trị viên.
      setSubmitted(true);
    } catch {
      setServerError('Đã có lỗi xảy ra. Vui lòng thử lại.');
    }
  };

  return (
    <div className="auth-form-container">
      {/* Mobile Logo */}
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">Staffup LMS</span>
      </div>

      {/* Back to Login */}
      <Link
        href="/login"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-gray-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Quay lại đăng nhập
      </Link>

      {submitted ? (
        /* Success State */
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-6 w-6 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">Kiểm tra email</h1>
          <p className="text-sm leading-relaxed text-gray-500">
            Nếu tài khoản với email <strong className="text-gray-700">{getValues('email')}</strong>{' '}
            tồn tại, bạn sẽ nhận được hướng dẫn đặt lại mật khẩu.
          </p>
          <p className="text-sm leading-relaxed text-gray-500">
            Nếu không nhận được email, vui lòng liên hệ quản trị viên hệ thống để được hỗ trợ.
          </p>
          <Link
            href="/login"
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" />
            Quay lại đăng nhập
          </Link>
        </div>
      ) : (
        /* Form State */
        <>
          <div className="mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Quên mật khẩu</h1>
            <p className="mt-2 text-sm text-gray-500">
              Nhập email của bạn để nhận hướng dẫn đặt lại mật khẩu
            </p>
          </div>

          {serverError && (
            <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
              <p className="text-sm text-red-700">{serverError}</p>
            </div>
          )}

          <form method="post" onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email
              </label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className={`auth-input ${errors.email ? 'auth-input-error' : ''}`}
                {...register('email')}
              />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="auth-submit-btn w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Đang gửi...</span>
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  <span>Gửi hướng dẫn</span>
                </>
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
