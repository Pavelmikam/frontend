import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import useProfile from '@/hooks/useProfile';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';

const profileSchema = z.object({
  name:  z.string().min(2, 'Minimum 2 caractères').max(100),
  phone: z.string().regex(/^(\+?[0-9\s\-]{7,20})$/, 'Téléphone invalide').optional().or(z.literal('')),
  city:  z.string().max(100).optional(),
  bio:   z.string().max(500, 'Maximum 500 caractères').optional(),
});

const passwordSchema = z.object({
  current_password:      z.string().min(1, 'Mot de passe actuel requis'),
  password:              z.string().min(8, 'Minimum 8 caractères'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
});

const ProfilePage = () => {
  const { user } = useAuth();
  const { updateProfile, uploadAvatar, changePassword, isUpdating, isUploadingAvatar, isChangingPassword } = useProfile();

  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name:  user?.name  || '',
      phone: user?.phone || '',
      city:  user?.city  || '',
      bio:   user?.bio   || '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
  });

  const onProfileSubmit = async (data) => {
    setProfileError(null);
    try {
      await updateProfile(data);
    } catch (error) {
      if (error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, messages]) => {
          profileForm.setError(field, { message: messages[0] });
        });
      } else {
        setProfileError(error.userMessage || 'Erreur lors de la mise à jour.');
      }
    }
  };

  const onPasswordSubmit = async (data) => {
    setPasswordError(null);
    try {
      await changePassword(data);
      passwordForm.reset();
    } catch (error) {
      if (error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, messages]) => {
          passwordForm.setError(field, { message: messages[0] });
        });
      } else {
        setPasswordError(error.userMessage || 'Erreur lors du changement de mot de passe.');
      }
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPendingAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSaveAvatar = async () => {
    if (!pendingAvatarFile) return;
    try {
      await uploadAvatar(pendingAvatarFile);
      setPendingAvatarFile(null);
      setAvatarPreview(null);
    } catch {
      // toast already shown in hook
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Mon profil</h1>
        <p className="text-gray-500 mt-1">Gérez vos informations personnelles et votre compte</p>
      </div>

      {/* Section avatar */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Photo de profil</h2>
        <div className="flex items-center gap-6">
          <div className="relative group">
            <Avatar
              src={avatarPreview || user?.avatar_url}
              name={user?.name}
              size="xl"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Changer la photo"
            >
              <Camera className="h-6 w-6 text-white" />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{user?.name}</span>
              <Badge role={user?.role} />
            </div>
            <p className="text-sm text-gray-500">{user?.email}</p>
            <div className="flex gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                Choisir une photo
              </Button>
              {pendingAvatarFile && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isUploadingAvatar}
                  onClick={handleSaveAvatar}
                >
                  Enregistrer
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-400">JPG, PNG ou WebP — max 2 Mo</p>
          </div>
        </div>
      </div>

      {/* Section infos personnelles */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations personnelles</h2>

        {profileError && (
          <div className="mb-4">
            <Alert type="error" message={profileError} onClose={() => setProfileError(null)} />
          </div>
        )}

        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nom complet"
              name="name"
              register={profileForm.register}
              error={profileForm.formState.errors.name?.message}
              required
            />
            <Input
              label="Téléphone"
              name="phone"
              type="tel"
              placeholder="+237 6XX XXX XXX"
              register={profileForm.register}
              error={profileForm.formState.errors.phone?.message}
            />
            <Input
              label="Ville"
              name="city"
              placeholder="Yaoundé, Douala..."
              register={profileForm.register}
              error={profileForm.formState.errors.city?.message}
            />
          </div>
          <Textarea
            label="Biographie"
            name="bio"
            placeholder="Présentez-vous en quelques mots..."
            register={profileForm.register}
            error={profileForm.formState.errors.bio?.message}
            rows={3}
          />
          <div className="flex justify-end">
            <Button type="submit" variant="primary" isLoading={isUpdating}>
              Enregistrer les modifications
            </Button>
          </div>
        </form>
      </div>

      {/* Section mot de passe */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Changer le mot de passe</h2>

        {passwordError && (
          <div className="mb-4">
            <Alert type="error" message={passwordError} onClose={() => setPasswordError(null)} />
          </div>
        )}

        <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
          <Input
            label="Mot de passe actuel"
            name="current_password"
            type="password"
            placeholder="••••••••"
            register={passwordForm.register}
            error={passwordForm.formState.errors.current_password?.message}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Nouveau mot de passe"
              name="password"
              type="password"
              placeholder="Minimum 8 caractères"
              register={passwordForm.register}
              error={passwordForm.formState.errors.password?.message}
              required
            />
            <Input
              label="Confirmer le nouveau mot de passe"
              name="password_confirmation"
              type="password"
              placeholder="••••••••"
              register={passwordForm.register}
              error={passwordForm.formState.errors.password_confirmation?.message}
              required
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" variant="primary" isLoading={isChangingPassword}>
              Modifier le mot de passe
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
