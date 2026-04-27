import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  managerCoachService,
  type ManagerCoachHistoryMessage,
} from '@/services/manager-coach.service';

export const MANAGER_COACH_OVERVIEW_QUERY_KEY = ['manager-coach', 'team-overview'] as const;

export function useManagerCoachOverview() {
  return useQuery({
    queryKey: MANAGER_COACH_OVERVIEW_QUERY_KEY,
    queryFn: () => managerCoachService.getTeamOverview(),
    staleTime: 3 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}

export function useManagerCoachChat() {
  return useMutation({
    mutationFn: ({
      message,
      history,
    }: {
      message: string;
      history: ManagerCoachHistoryMessage[];
    }) => managerCoachService.chat(message, history),
  });
}

export function useGenerateWeeklyBriefing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (focus?: string) => managerCoachService.generateWeeklyBriefing(focus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MANAGER_COACH_OVERVIEW_QUERY_KEY });
    },
  });
}
