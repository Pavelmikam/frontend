import { useState } from 'react';
import { updateProfile, uploadAvatar, changePassword } from '@/api/user.api';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

const useProfile = () => {
  const updateUser = useAuthStore((state) => state.updateUser);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handleUpdateProfile = async (data) => {
    setIsUpdating(true);
    try {
      const response = await updateProfile(data);
      const updatedUser = response.data || response;
      updateUser(updatedUser);
      toast.success('Profil mis à jour avec succès.');
      return updatedUser;
    } catch (error) {
      toast.error(error.userMessage || 'Erreur lors de la mise à jour.');
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUploadAvatar = async (file) => {
    const maxSize = 2 * 1024 * 1024;
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      toast.error('Format non supporté. Utilisez JPG, PNG ou WebP.');
      return;
    }
    if (file.size > maxSize) {
      toast.error('Image trop lourde. Maximum 2 Mo.');
      return;
    }

    setIsUploadingAvatar(true);
    try {
      const response = await uploadAvatar(file);
      const updatedUser = response.data || response;
      updateUser(updatedUser);
      toast.success('Photo de profil mise à jour.');
      return updatedUser;
    } catch (error) {
      toast.error(error.userMessage || "Erreur lors de l'upload.");
      throw error;
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const handleChangePassword = async (data) => {
    setIsChangingPassword(true);
    try {
      const response = await changePassword(data);
      toast.success('Mot de passe modifié avec succès.');
      return response;
    } catch (error) {
      toast.error(error.userMessage || 'Erreur lors du changement de mot de passe.');
      throw error;
    } finally {
      setIsChangingPassword(false);
    }
  };

  return {
    isUpdating,
    isUploadingAvatar,
    isChangingPassword,
    updateProfile: handleUpdateProfile,
    uploadAvatar: handleUploadAvatar,
    changePassword: handleChangePassword,
  };
};

export default useProfile;
