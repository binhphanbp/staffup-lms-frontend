import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { certificateService, type CertificateListParams } from '@/services/certificate.service';

export function useCertificates(params?: CertificateListParams) {
  return useQuery({
    queryKey: ['certificates', params],
    queryFn: () => certificateService.list(params),
  });
}

export function useCertificateDetail(id: string | null) {
  return useQuery({
    queryKey: ['certificate-detail', id],
    queryFn: () => certificateService.getDetail(id!),
    enabled: !!id,
  });
}

export function useIssueCertificate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (enrollmentId: string) => certificateService.issue(enrollmentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['certificates'] });
      queryClient.invalidateQueries({ queryKey: ['enrollment-progress'] });
      queryClient.invalidateQueries({ queryKey: ['enrollments'] });
    },
  });
}

export function useDownloadCertificate() {
  return useMutation({
    mutationFn: async (certificateId: string) => {
      const blob = await certificateService.downloadPdf(certificateId);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `certificate-${certificateId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

export function useVerifyCertificate() {
  return useMutation({
    mutationFn: (certificateNumber: string) => 
      certificateService.verify(certificateNumber),
  });
}
