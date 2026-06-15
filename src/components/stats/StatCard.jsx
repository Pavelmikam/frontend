const COLOR_MAP = {
  blue:   { bg: 'bg-blue-100',   icon: 'text-blue-600',   text: 'text-blue-600' },
  green:  { bg: 'bg-green-100',  icon: 'text-green-600',  text: 'text-green-600' },
  yellow: { bg: 'bg-yellow-100', icon: 'text-yellow-600', text: 'text-yellow-600' },
  red:    { bg: 'bg-red-100',    icon: 'text-red-600',    text: 'text-red-600' },
  purple: { bg: 'bg-purple-100', icon: 'text-purple-600', text: 'text-purple-600' },
  orange: { bg: 'bg-orange-100', icon: 'text-orange-600', text: 'text-orange-600' },
};

const StatCard = ({
  title,
  value,
  unit,
  trend,
  icon,
  color = 'blue',
  isLoading = false,
  onClick,
}) => {
  const colors = COLOR_MAP[color] ?? COLOR_MAP.blue;

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse" style={{ minWidth: '200px' }}>
        <div className="flex items-center gap-3 mb-3">
          <div className={`h-10 w-10 rounded-lg ${colors.bg}`} />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-gray-200 rounded w-3/4" />
            <div className="h-5 bg-gray-200 rounded w-1/2" />
          </div>
        </div>
      </div>
    );
  }

  const trendPositive = trend && trend.value > 0;
  const trendNegative = trend && trend.value < 0;

  return (
    <div
      className={`bg-white rounded-xl border border-gray-200 p-5 ${onClick ? 'cursor-pointer hover:border-blue-300 transition-colors' : ''}`}
      style={{ minWidth: '200px' }}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`h-10 w-10 ${colors.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <span className={colors.icon}>{icon}</span>
            </div>
          )}
          <div>
            <p className="text-sm text-gray-500">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
              {value ?? '—'}
              {unit && <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>}
            </p>
          </div>
        </div>
      </div>

      {trend && (
        <div className={`mt-3 flex items-center gap-1 text-xs font-medium ${
          trendPositive ? 'text-green-600' : trendNegative ? 'text-red-500' : 'text-gray-400'
        }`}>
          <span>{trendPositive ? '↑' : trendNegative ? '↓' : '→'}</span>
          <span>
            {trendPositive ? '+' : ''}{trend.value}% {trend.period}
          </span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
