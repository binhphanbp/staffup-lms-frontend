'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import type { RoleCode } from '@/types';

// ============================================================
// RoleGuard — Client-side role-based access control
// Wraps layout content to ensure user has required roles
// ============================================================

interface RoleGuardProps {
  children: React.ReactNode;
  allowedRoles: RoleCode[];
}

export function RoleGuard({ children, allowedRoles }: RoleGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  const hasAccess =
    isAuthenticated && user?.roleCodes?.some((role) => allowedRoles.includes(role));

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
    } else if (!hasAccess) {
      router.replace('/403');
    }
  }, [isAuthenticated, hasAccess, router]);

  if (!hasAccess) return null;

  return <>{children}</>;
}
