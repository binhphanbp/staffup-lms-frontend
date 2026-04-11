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
