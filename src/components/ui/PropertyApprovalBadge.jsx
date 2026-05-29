import { CheckCircle, XCircle, Clock } from 'lucide-react';

const PropertyApprovalBadge = ({ isApproved, rejectionReason, size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1';

  if (isApproved) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-green-100 text-green-700 ${sizeClass}`}>
        <CheckCircle className="h-3 w-3" />
        Approuvée
      </span>
    );
  }

  if (rejectionReason) {
    return (
      <span
        title={rejectionReason}
        className={`inline-flex items-center gap-1 rounded-full font-medium bg-red-100 text-red-700 cursor-help ${sizeClass}`}
      >
        <XCircle className="h-3 w-3" />
        Rejetée
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium bg-orange-100 text-orange-700 ${sizeClass}`}>
      <Clock className="h-3 w-3" />
      En attente
    </span>
  );
};

export default PropertyApprovalBadge;
