import { useQuery } from '@tanstack/react-query';
import { certificateService } from '@/services/certificate.service';
import type { CertificateListParams } from '@/services/certificate.service';

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
