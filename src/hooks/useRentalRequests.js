import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getRentalRequests, getRentalRequest,
  createRentalRequest, decideRentalRequest,
  cancelRentalRequest, scheduleVisit, confirmVisit,
} from '@/api/rentalRequest.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export const useRentalRequests = (params = {}, options = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['rentalRequests', params],
    queryFn: () => getRentalRequests(params),
    enabled: isAuthenticated && (options.enabled !== false),
  });
};

export const useRentalRequest = (id) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['rentalRequest', id],
    queryFn: () => getRentalRequest(id),
    enabled: isAuthenticated && !!id,
  });
};

export const useRentalRequestMutations = () => {
  const queryClient = useQueryClient();

  const invalidate = (id = null) => {
    queryClient.invalidateQueries({ queryKey: ['rentalRequests'] });
    if (id) queryClient.invalidateQueries({ queryKey: ['rentalRequest', id] });
    queryClient.invalidateQueries({ queryKey: ['properties'] });
    queryClient.invalidateQueries({ queryKey: ['myProperties'] });
  };

  const createMutation = useMutation({
    mutationFn: ({ propertyId, data }) => createRentalRequest(propertyId, data),
    onSuccess: (_, { propertyId }) => {
      toast.success('Votre candidature a été envoyée avec succès !');
      invalidate();
      queryClient.invalidateQueries({ queryKey: ['property', propertyId] });
    },
    onError: (error) => {
      toast.error(error.userMessage || "Erreur lors de l'envoi de la candidature.");
    },
  });

  const decideMutation = useMutation({
    mutationFn: ({ id, data }) => decideRentalRequest(id, data),
    onSuccess: (response, { id }) => {
      toast.success(response.message || 'Décision enregistrée.');
      invalidate(id);
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Erreur lors de la décision.');
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id) => cancelRentalRequest(id),
    onSuccess: (_, id) => {
      toast.success('Demande annulée.');
      invalidate(id);
    },
    onError: (error) => {
      toast.error(error.userMessage || "Erreur lors de l'annulation.");
    },
  });

  const scheduleVisitMutation = useMutation({
    mutationFn: ({ id, visitScheduledAt }) => scheduleVisit(id, visitScheduledAt),
    onSuccess: (_, { id }) => {
      toast.success('Date de visite planifiée.');
      invalidate(id);
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Erreur lors de la planification.');
    },
  });

  const confirmVisitMutation = useMutation({
    mutationFn: (id) => confirmVisit(id),
    onSuccess: (_, id) => {
      toast.success('Votre présence a été confirmée.');
      invalidate(id);
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Erreur lors de la confirmation.');
    },
  });

  return {
    create:        createMutation,
    decide:        decideMutation,
    cancel:        cancelMutation,
    scheduleVisit: scheduleVisitMutation,
    confirmVisit:  confirmVisitMutation,
  };
};
