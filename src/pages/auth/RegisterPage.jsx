import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Home, User } from 'lucide-react';
import toast from 'react-hot-toast';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { ROUTES } from '@/utils/constants';

const schema = z.object({
  name:                  z.string().min(2, 'Minimum 2 caractères').max(100),
  email:                 z.string().email('Email invalide'),
  phone:                 z.string().regex(/^(\+?[0-9\s\-]{7,20})$/, 'Téléphone invalide').optional().or(z.literal('')),
  city:                  z.string().max(100).optional(),
  role:                  z.enum(['locataire', 'proprietaire'], { message: 'Choisissez un rôle' }),
  password:              z.string()
    .min(8, 'Minimum 8 caractères')
    .regex(/[A-Z]/, 'Doit contenir au moins une majuscule')
    .regex(/[a-z]/, 'Doit contenir au moins une minuscule')
    .regex(/[0-9]/, 'Doit contenir au moins un chiffre'),
  password_confirmation: z.string().min(1, 'Confirmez le mot de passe'),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
});

const getPasswordStrength = (password) => {
  if (!password || password.length < 6) return { label: 'Faible', color: 'bg-red-400', width: 'w-1/3' };
  if (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  ) {
    return { label: 'Fort', color: 'bg-green-500', width: 'w-full' };
  }
  return { label: 'Moyen', color: 'bg-yellow-400', width: 'w-2/3' };
};

const RegisterPage = () => {
  const { register: authRegister, isLoading } = useAuth();
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState(null);
  const [passwordValue, setPasswordValue] = useState('');

  const { register, handleSubmit, setError, control, watch, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { role: '' },
  });

  const selectedRole = watch('role');
  const strength = getPasswordStrength(passwordValue);

  const onSubmit = async (data) => {
    setGlobalError(null);
    try {
      await authRegister(data);
      toast.success('Bienvenue sur ImmoConnect !');
      navigate(ROUTES.DASHBOARD);
    } catch (error) {
      if (error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
      } else {
        setGlobalError(error.userMessage || "Erreur lors de l'inscription.");
      }
    }
  };

  return (
    <div className="w-full max-w-2xl">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 bg-blue-600 rounded-xl mb-4">
          <span className="text-white font-bold text-xl">IC</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
        <p className="text-gray-500 mt-1">Rejoignez ImmoConnect Cameroun</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {globalError && (
          <div className="mb-4">
            <Alert type="error" message={globalError} onClose={() => setGlobalError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Sélecteur de rôle */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-3">
              Je suis <span className="text-red-500">*</span>
            </p>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { value: 'locataire', label: 'Locataire', desc: 'Je cherche un logement', Icon: User },
                    { value: 'proprietaire', label: 'Propriétaire', desc: 'Je propose des biens', Icon: Home },
                  ].map(({ value, label, desc, Icon }) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => field.onChange(value)}
                      className={`
                        flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center
                        ${field.value === value
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 hover:border-gray-300 text-gray-600'
                        }
                      `}
                    >
                      <Icon className={`h-6 w-6 ${field.value === value ? 'text-blue-500' : 'text-gray-400'}`} />
                      <div>
                        <p className="font-semibold text-sm">{label}</p>
                        <p className="text-xs opacity-70">{desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            />
            {errors.role && (
              <p className="text-xs text-red-600 mt-1">{errors.role.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input label="Nom complet" name="name" placeholder="Jean Dupont" register={register} error={errors.name?.message} required />
            <Input label="Adresse email" name="email" type="email" placeholder="votre@email.cm" register={register} error={errors.email?.message} required />
            <Input label="Téléphone" name="phone" type="tel" placeholder="+237 6XX XXX XXX" register={register} error={errors.phone?.message} />
            <Input label="Ville" name="city" placeholder="Yaoundé, Douala..." register={register} error={errors.city?.message} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                label="Mot de passe"
                name="password"
                type="password"
                placeholder="Minimum 8 caractères"
                register={register}
                error={errors.password?.message}
                required
                onChange={(e) => setPasswordValue(e.target.value)}
              />
              {passwordValue && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${strength.color} ${strength.width}`} />
                  </div>
                  <p className={`text-xs mt-1 ${strength.color.includes('red') ? 'text-red-500' : strength.color.includes('yellow') ? 'text-yellow-600' : 'text-green-600'}`}>
                    Force : {strength.label}
                  </p>
                </div>
              )}
            </div>
            <Input
              label="Confirmer le mot de passe"
              name="password_confirmation"
              type="password"
              placeholder="••••••••"
              register={register}
              error={errors.password_confirmation?.message}
              required
            />
          </div>

          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            Créer mon compte
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Déjà inscrit ?{' '}
          <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline font-medium">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
