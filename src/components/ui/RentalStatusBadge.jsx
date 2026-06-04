import { Clock, CheckCircle, XCircle, Archive, Ban } from 'lucide-react';
import { RENTAL_REQUEST_STATUSES } from '@/utils/constants';

const ICONS = {
  en_attente: Clock,
  acceptee:   CheckCircle,
  refusee:    XCircle,
  annulee:    Ban,
  terminee:   Archive,
};

const COLOR_CLASSES = {
  yellow: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  green:  'bg-green-100  text-green-800  border-green-200',
  red:    'bg-red-100    text-red-800    border-red-200',
  gray:   'bg-gray-100   text-gray-600   border-gray-200',
  blue:   'bg-blue-100   text-blue-800   border-blue-200',
};

const SIZE_CLASSES = {
  sm: 'text-xs px-2 py-0.5 gap-1',
  md: 'text-sm px-2.5 py-1 gap-1.5',
};

const RentalStatusBadge = ({ status, size = 'sm' }) => {
  const statusDef = RENTAL_REQUEST_STATUSES.find((s) => s.value === status);
  if (!statusDef) return null;

  const Icon = ICONS[status] ?? Clock;
  const colorClass = COLOR_CLASSES[statusDef.color] ?? COLOR_CLASSES.gray;
  const sizeClass = SIZE_CLASSES[size] ?? SIZE_CLASSES.sm;

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${colorClass} ${sizeClass}`}>
      <Icon className="h-3 w-3 flex-shrink-0" />
      {statusDef.label}
    </span>
  );
};

export default RentalStatusBadge;
