import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

const config = {
  success: {
    icon: CheckCircle,
    classes: 'bg-green-50 border-green-200 text-green-800',
    iconClass: 'text-green-500',
  },
  error: {
    icon: XCircle,
    classes: 'bg-red-50 border-red-200 text-red-800',
    iconClass: 'text-red-500',
  },
  warning: {
    icon: AlertTriangle,
    classes: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    iconClass: 'text-yellow-500',
  },
  info: {
    icon: Info,
    classes: 'bg-blue-50 border-blue-200 text-blue-800',
    iconClass: 'text-blue-500',
  },
};

const Alert = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const { icon: Icon, classes, iconClass } = config[type] || config.info;

  return (
    <div className={`flex items-start gap-3 p-4 rounded-lg border ${classes}`} role="alert">
      <Icon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconClass}`} />
      <p className="text-sm flex-1">{message}</p>
      {onClose && (
        <button
          onClick={onClose}
          className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;
