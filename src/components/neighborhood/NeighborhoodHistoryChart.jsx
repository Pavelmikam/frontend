import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { useNeighborhoodHistory } from '@/hooks/useNeighborhoodScore';
import { NEIGHBORHOOD_CRITERIA, getScoreColor } from '@/utils/constants';

const COLOR_HEX = {
  green:  '#22c55e',
  lime:   '#84cc16',
  yellow: '#eab308',
  red:    '#ef4444',
  gray:   '#9ca3af',
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const { label, average_score } = payload[0]?.payload ?? {};
  return (
    <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 shadow text-xs">
      <p className="font-semibold text-gray-700">{label}</p>
      <p className="text-blue-600">
        {average_score != null ? `${average_score.toFixed(1)}/5` : 'Aucune donnée'}
      </p>
    </div>
  );
};

const NeighborhoodHistoryChart = ({ city, neighborhood, criterion, isVisible = true }) => {
  const { data, isLoading } = useNeighborhoodHistory(city, neighborhood, criterion);
  const criterionMeta = NEIGHBORHOOD_CRITERIA.find((c) => c.value === criterion);

  if (!isVisible) return null;

  if (isLoading) {
    return <div className="h-48 bg-gray-200 rounded-xl animate-pulse" />;
  }

  const history = data?.data ?? [];
  const hasData = history.some((h) => h.average_score != null);

  if (!hasData) {
    return (
      <div className="h-48 flex items-center justify-center bg-gray-50 rounded-xl border border-gray-200">
        <p className="text-sm text-gray-400">Données insuffisantes pour afficher l'historique.</p>
      </div>
    );
  }

  const lastValid = [...history].reverse().find((h) => h.average_score != null);
  const color = getScoreColor(lastValid?.average_score);
  const hex = COLOR_HEX[color] ?? COLOR_HEX.gray;

  return (
    <div>
      <p className="text-sm font-medium text-gray-700 mb-3">
        Évolution — {criterionMeta?.icon} {criterionMeta?.label ?? criterion}
      </p>
      <ResponsiveContainer width="100%" height={180}>
        <LineChart data={history} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fontSize: 11, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="average_score"
            stroke={hex}
            strokeWidth={2.5}
            dot={{ r: 4, fill: hex, strokeWidth: 0 }}
            connectNulls={false}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default NeighborhoodHistoryChart;
