import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAdminAmenityCategories, createAmenityCategory,
  updateAmenityCategory, disableAmenityCategory,
} from '@/api/admin.api';
import { getReferenceAmenities, getReferencePropertyTypes } from '@/api/reference.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export const useAdminCategories = (params = {}) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['adminCategories', params],
    queryFn: () => getAdminAmenityCategories(params),
    enabled: isAdmin,
  });
};

export const useReferenceAmenities = () => useQuery({
  queryKey: ['referenceAmenities'],
  queryFn: getReferenceAmenities,
  staleTime: 1000 * 60 * 10,
});

export const useReferencePropertyTypes = () => useQuery({
  queryKey: ['referencePropertyTypes'],
  queryFn: getReferencePropertyTypes,
  staleTime: 1000 * 60 * 10,
});

export const useAdminCategoryMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['adminCategories'] });
    queryClient.invalidateQueries({ queryKey: ['referenceAmenities'] });
    queryClient.invalidateQueries({ queryKey: ['referencePropertyTypes'] });
  };

  const createMutation = useMutation({
    mutationFn: createAmenityCategory,
    onSuccess: () => { toast.success('Catégorie créée.'); invalidate(); },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateAmenityCategory(id, data),
    onSuccess: () => { toast.success('Catégorie mise à jour.'); invalidate(); },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  const disableMutation = useMutation({
    mutationFn: disableAmenityCategory,
    onSuccess: () => { toast.success('Catégorie désactivée.'); invalidate(); },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  return { create: createMutation, update: updateMutation, disable: disableMutation };
};
