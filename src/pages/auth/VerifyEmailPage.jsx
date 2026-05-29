import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { resendVerification } from '@/api/auth.api';
import useAuth from '@/hooks/useAuth';
import Button from '@/components/ui/Button';
import Alert from '@/components/ui/Alert';
import { maskEmail } from '@/utils/formatters';
import { ROUTES } from '@/utils/constants';

const COOLDOWN_SECONDS = 60;

const VerifyEmailPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((v) => v - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    setError(null);
    setMessage(null);
    setIsLoading(true);
    try {
      await resendVerification();
      setMessage('Email de vérification renvoyé avec succès.');
      setCooldown(COOLDOWN_SECONDS);
    } catch (err) {
      setError(err.userMessage || 'Erreur lors de l\'envoi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 bg-blue-100 rounded-2xl mb-4">
          <Mail className="h-8 w-8 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Vérifiez votre email</h1>
        <p className="text-gray-500 mt-2">
          Un email de confirmation a été envoyé
          {user?.email && (
            <> à <span className="font-medium text-gray-700">{maskEmail(user.email)}</span></>
          )}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-4">
        {message && <Alert type="success" message={message} />}
        {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

        <Button
          variant="primary"
          size="lg"
          className="w-full"
          isLoading={isLoading}
          disabled={cooldown > 0}
          onClick={handleResend}
        >
          {cooldown > 0 ? `Renvoyer dans ${cooldown}s` : "Renvoyer l'email"}
        </Button>

        <Button
          variant="ghost"
          size="lg"
          className="w-full"
          onClick={() => navigate(ROUTES.DASHBOARD)}
        >
          Continuer sans vérifier
        </Button>

        <p className="text-xs text-center text-gray-400">
          Vérifiez votre dossier spam si vous ne trouvez pas l'email.
        </p>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
