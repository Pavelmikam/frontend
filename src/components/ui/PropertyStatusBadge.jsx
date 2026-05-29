import { getStatusInfo } from '@/utils/formatters';

const colorClasses = {
  green:  'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red:    'bg-red-100 text-red-700',
  orange: 'bg-orange-100 text-orange-700',
  gray:   'bg-gray-100 text-gray-600',
};

const sizeClasses = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
};

const PropertyStatusBadge = ({ status, size = 'sm' }) => {
  const { label, color } = getStatusInfo(status);
  return (
    <span className={`inline-flex items-center rounded-full font-medium ${colorClasses[color] || colorClasses.gray} ${sizeClasses[size]}`}>
      <span className={`mr-1.5 h-1.5 w-1.5 rounded-full bg-current`} />
      {label}
    </span>
  );
};

export default PropertyStatusBadge;
