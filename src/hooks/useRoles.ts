import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roleService } from '@/services/role.service';
import { permissionService } from '@/services/permission.service';
import type {
  RoleListParams,
  CreateRolePayload,
  UpdateRolePayload,
  PermissionListParams,
} from '@/types';

export function useRoles(params?: RoleListParams) {
  return useQuery({
    queryKey: ['roles', params],
    queryFn: () => roleService.list(params),
  });
}

export function useRole(id: string | null) {
  return useQuery({
    queryKey: ['role', id],
    queryFn: () => roleService.getById(id!),
    enabled: !!id,
  });
}

export function useCreateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateRolePayload) => roleService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useUpdateRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateRolePayload }) =>
      roleService.update(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function useDeleteRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => roleService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roles'] });
    },
  });
}

export function usePermissions(params?: PermissionListParams) {
  return useQuery({
    queryKey: ['permissions', params],
    queryFn: () => permissionService.list(params),
    staleTime: 5 * 60 * 1000,
  });
}
