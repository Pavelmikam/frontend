import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, User, Lock, Bell, Mail, MapPin, Phone, Info } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import useProfile from '@/hooks/useProfile';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import Avatar from '@/components/ui/Avatar';
import Badge from '@/components/ui/Badge';
import NotificationPreferencesPage from './NotificationPreferencesPage';

const profileSchema = z.object({
  name: z.string().min(2, 'Minimum 2 caractères').max(100),
  phone: z.string().regex(/^(\+?[0-9\s-]{7,20})$/, 'Téléphone invalide').optional().or(z.literal('')),
  city: z.string().max(100).optional(),
  bio: z.string().max(500, 'Maximum 500 caractères').optional(),
});

const passwordSchema = z.object({
  current_password: z.string().min(1, 'Mot de passe actuel requis'),
  password: z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
});

const TABS = [
  { key: 'infos', label: 'Informations', icon: User },
  { key: 'password', label: 'Mot de passe', icon: Lock },
  { key: 'notifs', label: 'Notifications', icon: Bell },
];

const ProfilePage = () => {
  const { user } = useAuth();
  const { updateProfile, uploadAvatar, changePassword, isUpdating, isUploadingAvatar, isChangingPassword } = useProfile();
  const [activeTab, setActiveTab] = useState('infos');

  const [profileError, setProfileError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [pendingAvatarFile, setPendingAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      city: user?.city || '',
      bio: user?.bio || '',
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Mon profil
          </h1>
          <p className="text-gray-500 mt-2">
            Gérez vos informations personnelles et préférences
          </p>
        </div>

        {/* Section avatar - Centrée */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 mb-6">
          <div className="flex flex-col items-center text-center">
            <div className="relative group mb-4">
              <Avatar
                src={avatarPreview || user?.avatar_url}
                name={user?.name}
                size="xl"
                className="ring-4 ring-blue-100"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 cursor-pointer"
                aria-label="Changer la photo"
              >
                <Camera className="h-8 w-8 text-white" />
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
              <div className="flex items-center justify-center gap-2">
                <span className="text-xl font-semibold text-gray-900">{user?.name}</span>
                <Badge role={user?.role} className="px-2 py-1" />
              </div>
              <div className="flex items-center justify-center gap-2 text-gray-500">
                <Mail className="h-4 w-4" />
                <p className="text-sm">{user?.email}</p>
              </div>
            </div>

            <div className="flex gap-3 mt-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="px-4"
              >
                Choisir une photo
              </Button>
              {pendingAvatarFile && (
                <Button
                  variant="primary"
                  size="sm"
                  isLoading={isUploadingAvatar}
                  onClick={handleSaveAvatar}
                  className="px-4"
                >
                  Enregistrer
                </Button>
              )}
            </div>
            <p className="text-xs text-gray-400 mt-2">
              JPG, PNG ou WebP — max 2 Mo
            </p>
          </div>
        </div>

        {/* Onglets - Centrés */}
        <div className="flex justify-center mb-6">
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1 max-w-md w-full">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === key
                    ? 'bg-white text-blue-600 shadow-md transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Onglet Informations */}
          {activeTab === 'infos' && (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                  <p className="text-sm text-gray-500">Mettez à jour vos informations de profil</p>
                </div>
              </div>

              {profileError && (
                <div className="mb-6">
                  <Alert type="error" message={profileError} onClose={() => setProfileError(null)} />
                </div>
              )}

              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <Input
                      label="Nom complet"
                      name="name"
                      register={profileForm.register}
                      error={profileForm.formState.errors.name?.message}
                      required
                      icon={<User className="h-4 w-4 text-gray-400" />}
                    />
                  </div>
                  <div>
                    <Input
                      label="Téléphone"
                      name="phone"
                      type="tel"
                      placeholder="+237 6XX XXX XXX"
                      register={profileForm.register}
                      error={profileForm.formState.errors.phone?.message}
                      icon={<Phone className="h-4 w-4 text-gray-400" />}
                    />
                  </div>
                </div>

                <div>
                  <Input
                    label="Ville"
                    name="city"
                    placeholder="Yaoundé, Douala..."
                    register={profileForm.register}
                    error={profileForm.formState.errors.city?.message}
                    icon={<MapPin className="h-4 w-4 text-gray-400" />}
                  />
                </div>

                <div>
                  <Textarea
                    label="Biographie"
                    name="bio"
                    placeholder="Présentez-vous en quelques mots..."
                    register={profileForm.register}
                    error={profileForm.formState.errors.bio?.message}
                    rows={4}
                    icon={<Info className="h-4 w-4 text-gray-400" />}
                  />
                </div>

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button type="submit" variant="primary" isLoading={isUpdating} className="px-8">
                    Enregistrer les modifications
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Onglet Mot de passe */}
          {activeTab === 'password' && (
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6 pb-3 border-b border-gray-200">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Lock className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">Changer le mot de passe</h2>
                  <p className="text-sm text-gray-500">Sécurisez votre compte avec un nouveau mot de passe</p>
                </div>
              </div>

              {passwordError && (
                <div className="mb-6">
                  <Alert type="error" message={passwordError} onClose={() => setPasswordError(null)} />
                </div>
              )}

              <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-5">
                <div>
                  <Input
                    label="Mot de passe actuel"
                    name="current_password"
                    type="password"
                    placeholder="••••••••"
                    register={passwordForm.register}
                    error={passwordForm.formState.errors.current_password?.message}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

                <div className="flex justify-end pt-4 border-t border-gray-200">
                  <Button type="submit" variant="primary" isLoading={isChangingPassword} className="px-8">
                    Modifier le mot de passe
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Onglet Notifications */}
          {activeTab === 'notifs' && (
            <div className="p-6 md:p-8">
              <NotificationPreferencesPage />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
