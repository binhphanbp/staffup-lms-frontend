import { useQuery } from '@tanstack/react-query';
import { mediaService } from '@/services/media.service';

export function useCourseVideoMedia(folder: string | null, enabled = true) {
  return useQuery({
    queryKey: ['course-media-video', folder],
    queryFn: () =>
      mediaService.listByFolder({
        folder: folder!,
        resourceType: 'video',
        maxResults: 50,
      }),
    enabled: Boolean(folder) && enabled,
    staleTime: 5 * 60 * 1000,
  });
}

export function useMediaFolders(path: string | null, enabled = true) {
  return useQuery({
    queryKey: ['media-folders', path],
    queryFn: () =>
      mediaService.listFolders({
        path: path ?? undefined,
        maxResults: 100,
      }),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
