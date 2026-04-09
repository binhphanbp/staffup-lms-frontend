'use client';

// ============================================================
// Register Page — Staffup LMS
// Professional registration with react-hook-form + zod validation
// ============================================================

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod/v4';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
  GraduationCap,
  AlertCircle,
  Check,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { authService } from '@/services/auth.service';
import { useAuthStore } from '@/store/useAuthStore';

// ----- Helper: Set browser cookie -----
function setCookie(name: string, value: string, days: number) {
  document.cookie = `${name}=${value}; path=/; max-age=${60 * 60 * 24 * days}; SameSite=Lax`;
}

// ----- Validation Schema -----
const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Họ phải có ít nhất 2 ký tự').max(50, 'Họ tối đa 50 ký tự'),
    lastName: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').max(50, 'Tên tối đa 50 ký tự'),
    email: z.email('Email không hợp lệ'),
    password: z
      .string()
      .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
      .regex(/[A-Z]/, 'Phải chứa ít nhất 1 chữ hoa')
      .regex(/[a-z]/, 'Phải chứa ít nhất 1 chữ thường')
      .regex(/[0-9]/, 'Phải chứa ít nhất 1 số'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Mật khẩu xác nhận không khớp',
    path: ['confirmPassword'],
  });

type RegisterFormData = z.infer<typeof registerSchema>;

// ----- Password Strength Indicator -----
function PasswordStrength({ password }: { password: string }) {
  const checks = [
    { label: 'Ít nhất 8 ký tự', valid: password.length >= 8 },
    { label: 'Chữ hoa (A-Z)', valid: /[A-Z]/.test(password) },
    { label: 'Chữ thường (a-z)', valid: /[a-z]/.test(password) },
    { label: 'Số (0-9)', valid: /[0-9]/.test(password) },
  ];

  const strength = checks.filter((c) => c.valid).length;

  const getStrengthColor = () => {
    if (strength <= 1) return 'bg-red-500';
    if (strength === 2) return 'bg-orange-500';
    if (strength === 3) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStrengthLabel = () => {
    if (strength <= 1) return 'Yếu';
    if (strength === 2) return 'Trung bình';
    if (strength === 3) return 'Khá';
    return 'Mạnh';
  };

  if (!password) return null;

  return (
    <div className="mt-3 space-y-3">
      {/* Strength Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">Độ mạnh mật khẩu</span>
          <span
            className={`text-xs font-medium ${
              strength <= 1
                ? 'text-red-500'
                : strength === 2
                  ? 'text-orange-500'
                  : strength === 3
                    ? 'text-yellow-600'
                    : 'text-green-600'
            }`}
          >
            {getStrengthLabel()}
          </span>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                i <= strength ? getStrengthColor() : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Checklist */}
      <div className="grid grid-cols-2 gap-1.5">
        {checks.map((check) => (
          <div key={check.label} className="flex items-center gap-1.5">
            <div
              className={`flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full transition-all duration-200 ${
                check.valid ? 'bg-green-500 text-white' : 'border border-gray-300 bg-white'
              }`}
            >
              {check.valid && <Check className="h-2 w-2" strokeWidth={3} />}
            </div>
            <span
              className={`text-[11px] transition-colors ${
                check.valid ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {check.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const watchedPassword = watch('password');

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setServerError(null);

      const response = await authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });

      // Auto-login after successful registration
      login(response.user, response.token);

      // Set cookie for proxy.ts route protection
      setCookie('staffup-auth-token', response.token, 7);

      router.push('/dashboard');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      setServerError(err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
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

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Tạo tài khoản mới</h1>
        <p className="mt-2 text-sm text-gray-500">Bắt đầu hành trình học tập cùng Staffup LMS</p>
      </div>

      {/* Server Error Alert */}
      {serverError && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-500" />
          <p className="text-sm text-red-700">{serverError}</p>
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        {/* Name Fields (2 columns) */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              Họ
            </label>
            <Input
              id="firstName"
              type="text"
              placeholder="Nguyễn"
              autoComplete="given-name"
              className={`auth-input ${errors.firstName ? 'auth-input-error' : ''}`}
              {...register('firstName')}
            />
            {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
          </div>
          <div className="space-y-2">
            <label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              Tên
            </label>
            <Input
              id="lastName"
              type="text"
              placeholder="Văn A"
              autoComplete="family-name"
              className={`auth-input ${errors.lastName ? 'auth-input-error' : ''}`}
              {...register('lastName')}
            />
            {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
          </div>
        </div>

        {/* Email Field */}
        <div className="space-y-2">
          <label htmlFor="register-email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <Input
            id="register-email"
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
          <label htmlFor="register-password" className="text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <div className="relative">
            <Input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
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

          {/* Password Strength */}
          <PasswordStrength password={watchedPassword} />
        </div>

        {/* Confirm Password Field */}
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">
            Xác nhận mật khẩu
          </label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="••••••••"
              autoComplete="new-password"
              className={`auth-input pr-10 ${errors.confirmPassword ? 'auth-input-error' : ''}`}
              {...register('confirmPassword')}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 transition-colors hover:text-gray-600"
              tabIndex={-1}
              aria-label={showConfirmPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Terms */}
        <p className="text-xs leading-5 text-gray-400">
          Bằng việc đăng ký, bạn đồng ý với{' '}
          <Link href="/terms" className="text-blue-600 hover:underline">
            Điều khoản dịch vụ
          </Link>{' '}
          và{' '}
          <Link href="/privacy" className="text-blue-600 hover:underline">
            Chính sách bảo mật
          </Link>{' '}
          của chúng tôi.
        </p>

        {/* Submit Button */}
        <Button type="submit" size="lg" disabled={isSubmitting} className="auth-submit-btn w-full">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Đang tạo tài khoản...</span>
            </>
          ) : (
            <>
              <UserPlus className="h-4 w-4" />
              <span>Tạo tài khoản</span>
            </>
          )}
        </Button>
      </form>

      {/* Security Note */}
      <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-400">
        <ShieldCheck className="h-3.5 w-3.5" />
        <span>Thông tin của bạn được bảo mật an toàn</span>
      </div>

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200" />
        </div>
      </div>

      {/* Login Link */}
      <p className="text-center text-sm text-gray-500">
        Đã có tài khoản?{' '}
        <Link
          href="/login"
          className="font-semibold text-blue-600 transition-colors hover:text-blue-700"
        >
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
