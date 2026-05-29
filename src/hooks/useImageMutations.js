import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  addPropertyImages, deletePropertyImage,
  reorderPropertyImages, setPrimaryImage,
} from '@/api/property.api';
import toast from 'react-hot-toast';

export const useImageMutations = (propertyId) => {
  const queryClient = useQueryClient();

  const invalidateProperty = () => {
    queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
    queryClient.invalidateQueries({ queryKey: ['myProperties'] });
  };

  const addMutation = useMutation({
    mutationFn: (images) => addPropertyImages(propertyId, images),
    onSuccess: () => {
      toast.success('Photos ajoutées avec succès.');
      invalidateProperty();
    },
    onError: (error) => toast.error(error.userMessage || "Erreur lors de l'upload."),
  });

  const deleteMutation = useMutation({
    mutationFn: (imageId) => deletePropertyImage(propertyId, imageId),
    onSuccess: () => {
      toast.success('Photo supprimée.');
      invalidateProperty();
    },
    onError: (error) => toast.error(error.userMessage || error.message || 'Erreur.'),
  });

  const reorderMutation = useMutation({
    mutationFn: (orderedImages) => reorderPropertyImages(propertyId, orderedImages),
    onSuccess: () => invalidateProperty(),
    onError: (error) => toast.error(error.userMessage || 'Erreur de réorganisation.'),
  });

  const setPrimaryMutation = useMutation({
    mutationFn: (imageId) => setPrimaryImage(propertyId, imageId),
    onSuccess: () => {
      toast.success('Photo principale mise à jour.');
      invalidateProperty();
    },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  return {
    addImages:     addMutation,
    deleteImage:   deleteMutation,
    reorderImages: reorderMutation,
    setPrimary:    setPrimaryMutation,
  };
};
