import { useMutation, useQueryClient } from '@tanstack/react-query';
import { uploadDocument, deleteDocument, verifyDocument } from '@/api/rentalRequest.api';
import toast from 'react-hot-toast';

export const useDocumentMutations = (rentalRequestId) => {
  const queryClient = useQueryClient();

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['rentalRequest', rentalRequestId] });
    queryClient.invalidateQueries({ queryKey: ['rentalRequests'] });
  };

  const validateFile = (file) => {
    const allowed = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 10 * 1024 * 1024;
    if (!allowed.includes(file.type)) {
      toast.error('Format non supporté. Utilisez PDF, JPG ou PNG.');
      return false;
    }
    if (file.size > maxSize) {
      toast.error('Document trop lourd. Maximum 10 Mo.');
      return false;
    }
    return true;
  };

  const uploadMutation = useMutation({
    mutationFn: ({ file, type, description }) => {
      if (!validateFile(file)) return Promise.reject(new Error('INVALID_FILE'));
      return uploadDocument(rentalRequestId, file, type, description);
    },
    onSuccess: (_, { type }) => {
      const label = type === 'cni' ? 'CNI' : 'Document';
      toast.success(`${label} uploadé avec succès.`);
      invalidate();
    },
    onError: (error) => {
      if (error.message !== 'INVALID_FILE') {
        toast.error(error.userMessage || "Erreur lors de l'upload.");
      }
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (documentId) => deleteDocument(rentalRequestId, documentId),
    onSuccess: () => {
      toast.success('Document supprimé.');
      invalidate();
    },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  const verifyMutation = useMutation({
    mutationFn: verifyDocument,
    onSuccess: () => {
      toast.success('Document vérifié.');
      invalidate();
    },
    onError: (error) => toast.error(error.userMessage || 'Erreur.'),
  });

  return {
    upload:       uploadMutation,
    delete:       deleteMutation,
    verify:       verifyMutation,
    validateFile,
  };
};
