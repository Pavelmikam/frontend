import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminUsers, getAdminUser, suspendUser, activateUser, deleteAdminUser, restoreUser } from '@/api/admin.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

const toApiParams = ({ status, ...rest }) => {
  const filtered = Object.fromEntries(
    Object.entries(rest).filter(([, v]) => v !== '' && v !== null && v !== undefined)
  );
  return {
    ...filtered,
    ...(status === 'active'    && { is_active: true }),
    ...(status === 'suspended' && { is_active: false }),
    ...(status === 'deleted'   && { deleted: 1 }),
  };
};

export const useAdminUsers = (params = {}) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['adminUsers', params],
    queryFn: () => getAdminUsers(toApiParams(params)),
    enabled: isAdmin,
  });
};

export const useAdminUser = (id) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['adminUser', id],
    queryFn: () => getAdminUser(id),
    enabled: isAdmin && !!id,
  });
};

export const useAdminUserMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = (id = null) => {
    queryClient.invalidateQueries({ queryKey: ['adminUsers'] });
    queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    if (id) queryClient.invalidateQueries({ queryKey: ['adminUser', id] });
  };

  const suspendMutation = useMutation({
    mutationFn: ({ id, reason }) => suspendUser(id, reason),
    onSuccess: (_, { id }) => { toast.success('Utilisateur suspendu.'); invalidate(id); },
    onError: (error) => toast.error(error.userMessage || 'Erreur lors de la suspension.'),
  });

  const activateMutation = useMutation({
    mutationFn: (id) => activateUser(id),
    onSuccess: (_, id) => { toast.success('Utilisateur réactivé.'); invalidate(id); },
    onError: (error) => toast.error(error.userMessage || 'Erreur lors de la réactivation.'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteAdminUser(id),
    onSuccess: (_, id) => { toast.success('Utilisateur supprimé.'); invalidate(id); },
    onError: (error) => toast.error(error.userMessage || 'Erreur lors de la suppression.'),
  });

  const restoreMutation = useMutation({
    mutationFn: (id) => restoreUser(id),
    onSuccess: (_, id) => { toast.success('Compte restauré.'); invalidate(id); },
    onError: (error) => toast.error(error.userMessage || 'Erreur lors de la restauration.'),
  });

  return { suspend: suspendMutation, activate: activateMutation, delete: deleteMutation, restore: restoreMutation };
};
