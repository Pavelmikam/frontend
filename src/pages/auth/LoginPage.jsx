import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import useAuth from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { ROUTES } from '@/utils/constants';

const schema = z.object({
  email:    z.string().email('Email invalide').min(1, 'Email requis'),
  password: z.string().min(1, 'Mot de passe requis'),
});

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect');
  const [globalError, setGlobalError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, setError, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setGlobalError(null);
    try {
      await login(data);
      navigate(redirect || ROUTES.DASHBOARD);
    } catch (error) {
      const status = error.response?.status;
      if (status === 422 && error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
      } else {
        setGlobalError(error.userMessage || 'Identifiants incorrects.');
      }
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12  rounded-xl mb-4">
          <img 
    src="images/logo2.png" 
    alt="ImmoConnect" 
    className="h-8 w-8 sm:h-9 sm:w-9 md:h-10 md:w-10 object-contain"
  />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Connexion</h1>
        <p className="text-gray-500 mt-1">Accédez à votre espace ImmoConnect</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {globalError && (
          <div className="mb-4">
            <Alert type="error" message={globalError} onClose={() => setGlobalError(null)} />
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input
            label="Adresse email"
            name="email"
            type="email"
            placeholder="votre@email.com"
            register={register}
            error={errors.email?.message}
            required
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Mot de passe <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`
                  w-full px-3 py-2 pr-10 rounded-lg border text-sm text-gray-900
                  placeholder:text-gray-400 bg-white
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.password ? 'border-red-500 ring-1 ring-red-200' : 'border-gray-300'}
                `}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
            <div className="flex justify-end mt-1">
              <Link
                to={ROUTES.FORGOT_PASSWORD}
                className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
              >
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            size="lg"
            isLoading={isLoading}
            className="w-full mt-2"
          >
            Se connecter
          </Button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-6">
          Pas encore de compte ?{' '}
          <Link
            to={redirect ? `${ROUTES.REGISTER}?redirect=${encodeURIComponent(redirect)}` : ROUTES.REGISTER}
            className="text-blue-600 hover:underline font-medium"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
