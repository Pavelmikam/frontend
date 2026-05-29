import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getSavedSearches, createSavedSearch, updateSavedSearch,
  deleteSavedSearch, toggleSavedSearchNotifications, getSavedSearchResults,
} from '@/api/savedSearch.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export const useSavedSearches = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['savedSearches'],
    queryFn: getSavedSearches,
    enabled: isAuthenticated,
  });
};

export const useSavedSearchResults = (id, params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['savedSearchResults', id, params],
    queryFn: () => getSavedSearchResults(id, params),
    enabled: isAuthenticated && !!id,
  });
};

export const useSavedSearchMutations = () => {
  const queryClient = useQueryClient();
  const invalidate = () => queryClient.invalidateQueries({ queryKey: ['savedSearches'] });

  const createMutation = useMutation({
    mutationFn: createSavedSearch,
    onSuccess: () => { toast.success('Recherche sauvegardée.'); invalidate(); },
    onError: (error) => {
      if (error.response?.data?.code === 'SAVED_SEARCH_LIMIT_REACHED') {
        toast.error('Limite de 10 recherches sauvegardées atteinte.');
      } else {
        toast.error(error.userMessage || 'Erreur lors de la sauvegarde.');
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateSavedSearch(id, data),
    onSuccess: () => { toast.success('Recherche mise à jour.'); invalidate(); },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSavedSearch,
    onSuccess: () => { toast.success('Recherche supprimée.'); invalidate(); },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  const toggleNotifMutation = useMutation({
    mutationFn: toggleSavedSearchNotifications,
    onSuccess: (data) => { toast.success(data.message); invalidate(); },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  return {
    create:       createMutation,
    update:       updateMutation,
    delete:       deleteMutation,
    toggleNotif:  toggleNotifMutation,
  };
};
