import { useState } from 'react';
import {
  exportProperties, exportUsers, exportRentalRequests,
  exportActivityReport, exportPropertyReport,
} from '@/api/statistics.api';
import toast from 'react-hot-toast';

export const useExports = () => {
  const [loading, setLoading] = useState({
    properties: false,
    users: false,
    rentalRequests: false,
    activityReport: false,
    propertyReport: false,
  });

  const withLoading = async (key, fn) => {
    setLoading((prev) => ({ ...prev, [key]: true }));
    try {
      await fn();
      toast.success('Export téléchargé avec succès.');
    } catch (error) {
      toast.error(error.userMessage || "Erreur lors de l'export.");
    } finally {
      setLoading((prev) => ({ ...prev, [key]: false }));
    }
  };

  return {
    loading,
    exportProperties: (filters, format) =>
      withLoading('properties', () => exportProperties(filters, format)),
    exportUsers: (role, isActive, format) =>
      withLoading('users', () => exportUsers(role, isActive, format)),
    exportRentalRequests: (status, propertyId, format) =>
      withLoading('rentalRequests', () => exportRentalRequests(status, propertyId, format)),
    exportActivityReport: (period) =>
      withLoading('activityReport', () => exportActivityReport(period)),
    exportPropertyReport: (propertyId, period) =>
      withLoading('propertyReport', () => exportPropertyReport(propertyId, period)),
  };
};
