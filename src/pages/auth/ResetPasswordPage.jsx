import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { resetPassword } from '@/api/auth.api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { ROUTES } from '@/utils/constants';

const schema = z.object({
  password:              z.string().min(8, 'Minimum 8 caractères'),
  password_confirmation: z.string(),
}).refine((d) => d.password === d.password_confirmation, {
  message: 'Les mots de passe ne correspondent pas',
  path: ['password_confirmation'],
});

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [globalError, setGlobalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setGlobalError(null);
    setIsLoading(true);
    try {
      await resetPassword({ token, email, ...data });
      toast.success('Mot de passe réinitialisé avec succès.');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      setGlobalError(error.userMessage || 'Le lien de réinitialisation est invalide ou expiré.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <Alert type="error" message="Lien de réinitialisation invalide." />
          <p className="text-center mt-4">
            <Link to={ROUTES.FORGOT_PASSWORD} className="text-blue-600 hover:underline text-sm">
              Demander un nouveau lien
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 bg-blue-600 rounded-xl mb-4">
          <span className="text-white font-bold text-xl">IC</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Nouveau mot de passe</h1>
        <p className="text-gray-500 mt-1">Choisissez un nouveau mot de passe sécurisé</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {globalError && (
          <div className="mb-4">
            <Alert type="error" message={globalError} onClose={() => setGlobalError(null)} />
            <p className="text-sm text-center mt-3">
              <Link to={ROUTES.FORGOT_PASSWORD} className="text-blue-600 hover:underline">
                Demander un nouveau lien
              </Link>
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Nouveau mot de passe"
            name="password"
            type="password"
            placeholder="Minimum 8 caractères"
            register={register}
            error={errors.password?.message}
            required
          />
          <Input
            label="Confirmer le mot de passe"
            name="password_confirmation"
            type="password"
            placeholder="••••••••"
            register={register}
            error={errors.password_confirmation?.message}
            required
          />
          <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
            Réinitialiser le mot de passe
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
