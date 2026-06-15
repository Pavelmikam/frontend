import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const STATUS_COLORS = {
  en_attente: '#facc15',
  acceptees:  '#22c55e',
  refusees:   '#ef4444',
  annulees:   '#9ca3af',
};

const RequestsDonutChart = ({ requests, isLoading = false, title = 'Répartition des candidatures' }) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-4" />
        <div className="h-48 bg-gray-100 rounded-full w-48 mx-auto" />
      </div>
    );
  }

  if (!requests || !requests.total) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <p className="text-sm font-medium text-gray-700 mb-4">{title}</p>
        <div className="flex items-center justify-center h-40 text-sm text-gray-400">
          Aucune candidature
        </div>
      </div>
    );
  }

  const segments = [
    { name: 'En attente', value: requests.en_attente ?? 0, color: STATUS_COLORS.en_attente },
    { name: 'Acceptées',  value: requests.acceptees  ?? 0, color: STATUS_COLORS.acceptees  },
    { name: 'Refusées',   value: requests.refusees   ?? 0, color: STATUS_COLORS.refusees   },
    ...(requests.annulees != null
      ? [{ name: 'Annulées', value: requests.annulees, color: STATUS_COLORS.annulees }]
      : []),
  ].filter((s) => s.value > 0);

  const CustomLabel = ({ cx, cy }) => (
    <>
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#111827" className="text-base font-bold" fontSize={20} fontWeight={700}>
        {requests.total}
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#6b7280" fontSize={11}>
        Candidatures
      </text>
    </>
  );

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5">
      <p className="text-sm font-medium text-gray-700 mb-4">{title}</p>
      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={segments}
            cx="50%"
            cy="45%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={<CustomLabel />}
          >
            {segments.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(v, name) => [`${v}`, name]} />
          <Legend iconSize={10} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RequestsDonutChart;
