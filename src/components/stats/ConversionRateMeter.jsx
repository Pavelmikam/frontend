const getConversionMeta = (rate) => {
  if (rate > 5)  return { color: 'bg-green-500',  label: 'Excellent',    text: 'text-green-700' };
  if (rate > 2)  return { color: 'bg-yellow-400', label: 'Bien',         text: 'text-yellow-700' };
  return         { color: 'bg-red-500',           label: 'À améliorer',  text: 'text-red-700' };
};

const ConversionRateMeter = ({ rate = 0, views = 0, requests = 0, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="h-3 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-4 bg-gray-200 rounded mb-2" />
        <div className="h-3 bg-gray-200 rounded w-2/3" />
      </div>
    );
  }

  const { color, label, text } = getConversionMeta(rate);
  const pct = Math.min(rate, 100);

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-medium text-gray-700 mb-3">Taux de conversion</p>
      <div className="flex items-center justify-between mb-2">
        <span className="text-2xl font-bold text-gray-900">{rate.toFixed(1)}%</span>
        <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-opacity-10 ${text}`}>{label}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2">
        <div
          className={`h-2.5 rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500">
        {requests} demande(s) pour {views} vue(s)
      </p>
    </div>
  );
};

export default ConversionRateMeter;
