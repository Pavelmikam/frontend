import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import { forgotPassword } from '@/api/auth.api';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { ROUTES } from '@/utils/constants';

const schema = z.object({
  email: z.string().email('Email invalide'),
});

const ForgotPasswordPage = () => {
  const [success, setSuccess] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setError, getValues, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    setGlobalError(null);
    setIsLoading(true);
    try {
      await forgotPassword(data.email);
      setSuccess(true);
    } catch (error) {
      if (error.validationErrors) {
        Object.entries(error.validationErrors).forEach(([field, messages]) => {
          setError(field, { message: messages[0] });
        });
      } else {
        setGlobalError(error.userMessage || 'Une erreur est survenue.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setSuccess(false);
    setGlobalError(null);
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-12 w-12 bg-blue-600 rounded-xl mb-4">
          <span className="text-white font-bold text-xl">IC</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Mot de passe oublié</h1>
        <p className="text-gray-500 mt-1">Recevez un lien de réinitialisation par email</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
        {success ? (
          <div className="space-y-4">
            <Alert
              type="success"
              message="Un lien de réinitialisation a été envoyé à votre adresse email. Vérifiez votre boîte de réception."
            />
            <Button variant="secondary" size="lg" className="w-full" onClick={handleResend}>
              Renvoyer l'email
            </Button>
          </div>
        ) : (
          <>
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
                placeholder="votre@email.cm"
                register={register}
                error={errors.email?.message}
                required
              />
              <Button type="submit" variant="primary" size="lg" isLoading={isLoading} className="w-full">
                Envoyer le lien
              </Button>
            </form>
          </>
        )}

        <p className="text-center text-sm text-gray-500 mt-6">
          <Link to={ROUTES.LOGIN} className="text-blue-600 hover:underline font-medium">
            ← Retour à la connexion
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
