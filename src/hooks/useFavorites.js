import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFavorites, toggleFavorite, checkFavorite } from '@/api/favorite.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export const useFavorites = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['favorites', params],
    queryFn: () => getFavorites(params),
    enabled: isAuthenticated,
  });
};

export const useFavoriteCheck = (propertyId) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['favoriteCheck', propertyId],
    queryFn: () => checkFavorite(propertyId),
    enabled: isAuthenticated && !!propertyId,
    staleTime: 1000 * 30,
  });
};

export const useToggleFavorite = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  return useMutation({
    mutationFn: (propertyId) => {
      if (!isAuthenticated) return Promise.reject(new Error('AUTH_REQUIRED'));
      return toggleFavorite(propertyId);
    },
    onMutate: async (propertyId) => {
      await queryClient.cancelQueries({ queryKey: ['favoriteCheck', propertyId] });
      const previousCheck = queryClient.getQueryData(['favoriteCheck', propertyId]);

      queryClient.setQueryData(['favoriteCheck', propertyId], (old) => {
        if (!old) return old;
        return {
          ...old,
          is_favorited: !old.is_favorited,
          favorites_count: old.is_favorited
            ? Math.max(0, (old.favorites_count || 0) - 1)
            : (old.favorites_count || 0) + 1,
        };
      });
      return { previousCheck, propertyId };
    },
    onError: (error, propertyId, context) => {
      if (context?.previousCheck !== undefined) {
        queryClient.setQueryData(['favoriteCheck', propertyId], context.previousCheck);
      }
      if (error.message === 'AUTH_REQUIRED') {
        toast.error('Connectez-vous pour ajouter des favoris.');
      } else {
        toast.error(error.userMessage || 'Erreur lors de la mise à jour des favoris.');
      }
    },
    onSuccess: (data) => {
      const msg = data.is_favorited ? '❤️ Ajouté aux favoris' : 'Retiré des favoris';
      toast.success(msg, { duration: 2000 });
    },
    onSettled: (_, __, propertyId) => {
      queryClient.invalidateQueries({ queryKey: ['favoriteCheck', propertyId] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
    },
  });
};
