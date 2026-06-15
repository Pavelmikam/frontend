import { TrendingUp, TrendingDown } from 'lucide-react';

const COLOR_MAP = {
  blue:   { bg: 'bg-blue-100',   icon: 'text-blue-600',   value: 'text-blue-700'   },
  green:  { bg: 'bg-green-100',  icon: 'text-green-600',  value: 'text-green-700'  },
  yellow: { bg: 'bg-yellow-100', icon: 'text-yellow-600', value: 'text-yellow-700' },
  red:    { bg: 'bg-red-100',    icon: 'text-red-600',    value: 'text-red-700'    },
  purple: { bg: 'bg-purple-100', icon: 'text-purple-600', value: 'text-purple-700' },
};

const KpiCard = ({ title, value, icon, color = 'blue', trend, isLoading }) => {
  const c = COLOR_MAP[color] ?? COLOR_MAP.blue;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-lg bg-gray-200" />
          <div className="h-3 bg-gray-200 rounded w-1/2" />
        </div>
        <div className="h-7 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-lg ${c.bg} flex items-center justify-center flex-shrink-0`}>
          <span className={c.icon}>{icon}</span>
        </div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
      </div>
      <p className={`text-2xl font-bold ${c.value}`}>{value ?? '—'}</p>
      {trend && (
        <div className={`flex items-center gap-1 mt-1 text-xs ${trend.value >= 0 ? 'text-green-600' : 'text-red-500'}`}>
          {trend.value >= 0
            ? <TrendingUp className="h-3 w-3" />
            : <TrendingDown className="h-3 w-3" />}
          <span>{Math.abs(trend.value)}% {trend.label}</span>
        </div>
      )}
    </div>
  );
};

export default KpiCard;
