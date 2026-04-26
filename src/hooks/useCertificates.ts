import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateService, type CertificateListParams } from '@/services/certificate.service';

// ============================================================
// React Query Hooks — Certificates
// ============================================================

export function useCertificates(params?: CertificateListParams) {
  return useQuery({
    queryKey: ['certificates', params],
    queryFn: () => certificateService.list(params),
  });
}

export function useCertificateDetail(id: string | null) {
  return useQuery({
    queryKey: ['certificate', id],
    queryFn: () => certificateService.getById(id!),
    enabled: !!id,
  });
}

export function useCertificateByEnrollment(enrollmentId: string | null) {
  return useQuery({
    queryKey: ['certificate', 'enrollment', enrollmentId],
    queryFn: () => certificateService.getByEnrollment(enrollmentId!),
    enabled: !!enrollmentId,
    retry: (failureCount, error: unknown) => {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status === 404) return false;
      return failureCount < 2;
    },
  });
}

export function useIssueCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentId: string) => certificateService.issue(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
}

export function useRevokeCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => certificateService.revoke(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
    },
  });
}
