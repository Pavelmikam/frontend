import { useQuery } from '@tanstack/react-query';
import {
  getPropertyStats, getOwnerDashboard, getTenantDashboard,
  getPopularProperties, getAdminAdvancedStats,
  getViewsTimeline, getTopProperties,
} from '@/api/statistics.api';
import useAuth from './useAuth';

export const usePropertyStats = (propertyId, period = '30days') => {
  const { isAuthenticated } = useAuth();
  return useQuery({
    queryKey: ['propertyStats', propertyId, period],
    queryFn: () => getPropertyStats(propertyId, period),
    enabled: isAuthenticated && !!propertyId,
    staleTime: 1000 * 60 * 2,
    retry: false,
  });
};

export const useOwnerDashboard = (period = '30days') => {
  const { isAuthenticated, isProprietaire, isAdmin } = useAuth();
  return useQuery({
    queryKey: ['ownerDashboard', period],
    queryFn: () => getOwnerDashboard(period),
    enabled: isAuthenticated && (isProprietaire || isAdmin),
    staleTime: 1000 * 60 * 3,
    retry: false,
  });
};

export const useTenantDashboard = (period = '30days') => {
  const { isAuthenticated, isLocataire } = useAuth();
  return useQuery({
    queryKey: ['tenantDashboard', period],
    queryFn: () => getTenantDashboard(period),
    enabled: isAuthenticated && isLocataire,
    staleTime: 1000 * 60 * 3,
    retry: false,
  });
};

export const usePopularProperties = () => useQuery({
  queryKey: ['popularProperties'],
  queryFn: getPopularProperties,
  staleTime: 1000 * 60 * 10,
  retry: false,
  throwOnError: false,
});

export const useAdminAdvancedStats = (period = '30days', city = null) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['adminAdvancedStats', period, city],
    queryFn: () => getAdminAdvancedStats(period, city),
    enabled: isAdmin,
    staleTime: 1000 * 60 * 5,
  });
};

export const useViewsTimeline = (period = '30days', propertyId = null) => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['viewsTimeline', period, propertyId],
    queryFn: () => getViewsTimeline(period, propertyId),
    enabled: isAdmin,
    staleTime: 1000 * 60 * 2,
  });
};

export const useTopProperties = (metric = 'views_count') => {
  const { isAdmin } = useAuth();
  return useQuery({
    queryKey: ['topProperties', metric],
    queryFn: () => getTopProperties(metric),
    enabled: isAdmin,
    staleTime: 1000 * 60 * 5,
  });
};
