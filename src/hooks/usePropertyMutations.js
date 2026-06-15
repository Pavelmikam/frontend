import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  createProperty, updateProperty, deleteProperty,
  updatePropertyStatus, moderateProperty, submitProperty, archiveProperty,
} from '@/api/property.api';
import toast from 'react-hot-toast';

export const usePropertyMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['properties'] });
    queryClient.invalidateQueries({ queryKey: ['myProperties'] });
  };

  const createMutation = useMutation({
    mutationFn: ({ data, images }) => createProperty(data, images),
    onSuccess: () => {
      invalidate();
    },
    onError: (error) => {
      toast.error(error.userMessage || "Erreur lors de la création de l'annonce.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data, newImages }) => updateProperty(id, data, newImages),
    onSuccess: (_, { id }) => {
      toast.success('Annonce mise à jour.');
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      invalidate();
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Erreur lors de la mise à jour.');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => deleteProperty(id),
    onSuccess: () => {
      toast.success('Annonce supprimée.');
      invalidate();
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Erreur lors de la suppression.');
    },
  });

  const statusMutation = useMutation({
    mutationFn: ({ id, status }) => updatePropertyStatus(id, status),
    onSuccess: (_, { id }) => {
      toast.success('Statut mis à jour.');
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      invalidate();
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Erreur lors du changement de statut.');
    },
  });

  const moderateMutation = useMutation({
    mutationFn: ({ id, data }) => moderateProperty(id, data),
    onSuccess: () => {
      toast.success('Opération effectuée.');
      queryClient.invalidateQueries({ queryKey: ['pendingProperties'] });
      invalidate();
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Erreur lors de la modération.');
    },
  });

  const submitMutation = useMutation({
    mutationFn: (id) => submitProperty(id),
    onSuccess: (_, id) => {
      toast.success("Annonce soumise à la modération.");
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      invalidate();
    },
    onError: (error) => {
      toast.error(error.userMessage || "Erreur lors de la soumission.");
    },
  });

  const archiveMutation = useMutation({
    mutationFn: (id) => archiveProperty(id),
    onSuccess: (_, id) => {
      toast.success("Annonce archivée.");
      queryClient.invalidateQueries({ queryKey: ['property', id] });
      invalidate();
    },
    onError: (error) => {
      toast.error(error.userMessage || "Erreur lors de l'archivage.");
    },
  });

  return {
    createProperty:       createMutation,
    updateProperty:       updateMutation,
    deleteProperty:       deleteMutation,
    updatePropertyStatus: statusMutation,
    moderateProperty:     moderateMutation,
    submitProperty:       submitMutation,
    archiveProperty:      archiveMutation,
  };
};
