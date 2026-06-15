import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminNeighborhoodReports, flagNeighborhoodReport,
  validateNeighborhoodReport, recomputeNeighborhoodScores,
} from '@/api/neighborhood.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export const useAdminNeighborhoodReports = (params = {}) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['adminNeighborhoodReports', params],
    queryFn: () => getAdminNeighborhoodReports(params),
    enabled: isAdmin,
  });
};

export const useAdminNeighborhoodMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['adminNeighborhoodReports'] });
    queryClient.invalidateQueries({ queryKey: ['neighborhoodScore'] });
    queryClient.invalidateQueries({ queryKey: ['propertyNeighborhoodScore'] });
  };

  const flagMutation = useMutation({
    mutationFn: flagNeighborhoodReport,
    onSuccess: () => { toast.success('Rapport signalé comme suspect.'); invalidate(); },
    onError: (e) => toast.error(e.userMessage || 'Erreur.'),
  });

  const validateMutation = useMutation({
    mutationFn: validateNeighborhoodReport,
    onSuccess: () => { toast.success('Rapport revalidé.'); invalidate(); },
    onError: (e) => toast.error(e.userMessage || 'Erreur.'),
  });

  const recomputeMutation = useMutation({
    mutationFn: ({ city, neighborhood }) => recomputeNeighborhoodScores(city, neighborhood),
    onSuccess: (data) => {
      toast.success(`Scores recalculés (${data.scores_updated} mis à jour).`);
      invalidate();
    },
    onError: (e) => toast.error(e.userMessage || 'Erreur.'),
  });

  return { flag: flagMutation, validate: validateMutation, recompute: recomputeMutation };
};
