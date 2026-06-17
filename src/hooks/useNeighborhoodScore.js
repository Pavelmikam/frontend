import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getNeighborhoodScore, getPropertyNeighborhoodScore,
  getNeighborhoodHistory, submitNeighborhoodReport,
  getMyNeighborhoodReports, getMyContributorProfile,
  getPropertyNeighborhoodReviews,
} from '@/api/neighborhood.api';
import useAuth from './useAuth';
import toast from 'react-hot-toast';

export const useNeighborhoodScoreByLocation = (lat, lng, radiusKm = 2, enabled = true) => {
  return useQuery({
    queryKey: ['neighborhoodScore', lat, lng, radiusKm],
    queryFn: () => getNeighborhoodScore(lat, lng, radiusKm),
    enabled: enabled && !!lat && !!lng,
    staleTime: 1000 * 60 * 5,
  });
};

export const usePropertyNeighborhoodScore = (propertyId) => {
  return useQuery({
    queryKey: ['propertyNeighborhoodScore', propertyId],
    queryFn: () => getPropertyNeighborhoodScore(propertyId),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useNeighborhoodHistory = (city, neighborhood, criterion) => {
  return useQuery({
    queryKey: ['neighborhoodHistory', city, neighborhood, criterion],
    queryFn: () => getNeighborhoodHistory(city, neighborhood, criterion),
    enabled: !!city && !!criterion,
    staleTime: 1000 * 60 * 10,
  });
};

export const useSubmitNeighborhoodReport = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: submitNeighborhoodReport,
    onSuccess: () => {
      toast.success('Évaluation soumise ! +5 points contributeur.');
      queryClient.invalidateQueries({ queryKey: ['neighborhoodScore'] });
      queryClient.invalidateQueries({ queryKey: ['propertyNeighborhoodScore'] });
      queryClient.invalidateQueries({ queryKey: ['neighborhoodReviews'] });
      queryClient.invalidateQueries({ queryKey: ['myNeighborhoodReports'] });
      queryClient.invalidateQueries({ queryKey: ['myContributorProfile'] });
    },
    onError: (error) => {
      if (error.response?.status === 422) {
        const msg = error.userMessage || error.response?.data?.message;
        if (msg?.includes('déjà évalué')) {
          toast.error('Vous avez déjà évalué ce critère dans cette zone ce mois-ci.');
        } else {
          toast.error(msg || 'Données invalides.');
        }
      } else {
        toast.error(error.userMessage || 'Erreur lors de la soumission.');
      }
    },
  });
};

export const useMyNeighborhoodReports = (params = {}) => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['myNeighborhoodReports', params],
    queryFn: () => getMyNeighborhoodReports(params),
    enabled: isAuthenticated,
  });
};

export const usePropertyNeighborhoodReviews = (propertyId) => {
  return useQuery({
    queryKey: ['neighborhoodReviews', propertyId],
    queryFn: () => getPropertyNeighborhoodReviews(propertyId),
    enabled: !!propertyId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useMyContributorProfile = () => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['myContributorProfile'],
    queryFn: getMyContributorProfile,
    enabled: isAuthenticated,
    staleTime: 1000 * 60 * 2,
  });
};
