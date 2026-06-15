import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { formatPrice } from '@/utils/formatters';

const PROPERTY_TYPE_LABELS = {
  chambre_simple:    'Chambre simple',
  studio:            'Studio',
  appartement:       'Appartement',
  maison:            'Maison',
  mini_cite:         'Mini cité',
  local_commercial:  'Local comm.',
  chambre_etudiante: "Chambre étud.",
  logement_meuble:   'Meublé',
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const { avg_price, count } = payload[0]?.payload ?? {};
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow px-3 py-2 text-xs space-y-0.5">
      <p className="font-semibold text-gray-800">{label}</p>
      <p className="text-gray-500">{count} annonce(s)</p>
      <p className="text-blue-600 font-medium">Moy. {formatPrice(avg_price)}/mois</p>
    </div>
  );
};

const AvgPriceByTypeChart = ({ data = [], isLoading = false, title = 'Loyer moyen par type' }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
        <div className="h-48 bg-gray-100 rounded" />
      </div>
    );
  }

  const chartData = data.map((d) => ({
    ...d,
    label: PROPERTY_TYPE_LABELS[d.type] ?? d.type,
  }));

  if (!chartData.length) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-medium text-gray-700 mb-4">{title}</p>
        <div className="flex items-center justify-center h-40 text-sm text-gray-400">Aucune donnée</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-medium text-gray-700 mb-4">{title}</p>
      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={chartData} margin={{ top: 5, right: 5, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
          <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#9ca3af' }} tickLine={false} axisLine={false} />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="avg_price" fill="#3b82f6" radius={[4, 4, 0, 0]} maxBarSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AvgPriceByTypeChart;
