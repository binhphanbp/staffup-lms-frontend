'use client';

// ============================================================
// Login Page — Staffup LMS
// Professional login with react-hook-form + zod validation
// ============================================================

import { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn, Loader2, GraduationCap, AlertCircle, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

// ----- Helper: Set browser cookie -----
function setCookie(name: string, value: string, days: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * days}; SameSite=Lax`;
}

// ----- Validation Schema -----
const loginSchema = z.object({
  email: z.email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormData = z.infer<typeof loginSchema>;

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setServerError(null);
      const response = await authService.login(data);

      // Save to zustand store
      login(response.user, response.token);

      // Set cookie for proxy.ts route protection
      setCookie('staffup-auth-token', response.token, 7);

      // Redirect based on user role codes
      const roleCodes = response.user.roleCodes || [];
      
      let redirectUrl = '/'; // Default for employee
      
      if (roleCodes.includes('admin')) {
        redirectUrl = '/admin-dashboard';
      } else if (roleCodes.includes('trainer')) {
        redirectUrl = '/dashboard';
      } else if (roleCodes.includes('employee')) {
        redirectUrl = '/';
      }

      router.push(redirectUrl);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setServerError(err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  return (
    <div className="auth-form-container">
      {/* Mobile Logo (hidden on desktop since branding panel shows) */}
      <div className="mb-8 flex items-center gap-3 lg:hidden">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 shadow-lg shadow-blue-600/20">
          <GraduationCap className="h-6 w-6 text-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">Staffup LMS</span>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Chào mừng trở lại</h1>
        <p className="mt-2 text-sm text-gray-500">
          Đăng nhập vào tài khoản của bạn để tiếp tục học tập
        </p>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Email Field */}
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

        {/* Password Field */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Mật khẩu
            </label>
            <Link
              href="/forgot-password"
              className="text-xs font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="current-password"
              className={`auth-input pr-10 ${errors.password ? 'auth-input-error' : ''}`}
              {...register('password')}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
              tabIndex={-1}
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="text-xs text-red-500">{errors.password.message}</p>}
        </div>

        {/* Submit Button */}
        <Button type="submit" size="lg" disabled={isSubmitting} className="auth-submit-btn w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang đăng nhập...</span>
            </>
          ) : (
            <>
              <LogIn className="h-4 w-4" />
              <span>Đăng nhập</span>
            </>
          )}
        </Button>
      </form>

      {/* Security Note */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Kết nối được bảo mật bằng SSL</span>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
      </div>

      {/* Register Link */}
      <p className="text-center text-sm text-gray-500">
        Chưa có tài khoản?{' '}
        <Link
          href="/register"
          className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="auth-form-container">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        </div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
