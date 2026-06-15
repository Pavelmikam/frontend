import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getAdminReports, getAdminReport, handleReport } from '@/api/admin.api';
import { reportProperty, reportMessage } from '@/api/report.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export const useAdminReports = (params = {}) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['adminReports', params],
    queryFn: () => getAdminReports(params),
    enabled: isAdmin,
  });
};

export const useAdminReport = (id) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['adminReport', id],
    queryFn: () => getAdminReport(id),
    enabled: isAdmin && !!id,
  });
};

export const useHandleReport = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => handleReport(id, data),
    onSuccess: (_, { id }) => {
      toast.success('Signalement traité.');
      queryClient.invalidateQueries({ queryKey: ['adminReports'] });
      queryClient.invalidateQueries({ queryKey: ['adminReport', id] });
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] });
    },
    onError: (error) => toast.error(error.userMessage || 'Erreur lors du traitement.'),
  });
};

export const useReportMutations = () => {
  const reportPropertyMutation = useMutation({
    mutationFn: ({ propertyId, data }) => reportProperty(propertyId, data),
    onSuccess: () => toast.success('Signalement envoyé. Notre équipe va examiner.'),
    onError: (error) => {
      if (error.response?.status === 422) {
        toast.error(error.userMessage || 'Vous avez déjà signalé cet élément.');
      } else {
        toast.error(error.userMessage || 'Erreur lors du signalement.');
      }
    },
  });

  const reportMessageMutation = useMutation({
    mutationFn: ({ messageId, data }) => reportMessage(messageId, data),
    onSuccess: () => toast.success('Message signalé. Notre équipe va examiner.'),
    onError: (error) => toast.error(error.userMessage || 'Erreur lors du signalement.'),
  });

  return { reportProperty: reportPropertyMutation, reportMessage: reportMessageMutation };
};
