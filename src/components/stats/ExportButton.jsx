import { FileText, Table, Download } from 'lucide-react';

const ExportButton = ({
  label,
  onExport,
  isLoading = false,
  format = 'xlsx',
  icon,
  variant = 'primary',
}) => {
  const FormatIcon = format === 'pdf' ? FileText : Table;

  const variantClasses = {
    primary:   'bg-blue-600 hover:bg-blue-700 text-white',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
    ghost:     'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50',
  };

  const title = `Télécharger en ${format.toUpperCase()}`;

  return (
    <button
      onClick={onExport}
      disabled={isLoading}
      title={title}
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-60 disabled:cursor-not-allowed ${variantClasses[variant] ?? variantClasses.primary}`}
    >
      {isLoading ? (
        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : (
        icon ?? <FormatIcon className="h-4 w-4" />
      )}
      {label}
      {!isLoading && <Download className="h-3.5 w-3.5 opacity-60" />}
    </button>
  );
};

export default ExportButton;
