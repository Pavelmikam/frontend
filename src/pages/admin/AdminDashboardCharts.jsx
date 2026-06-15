import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

const COLORS = ['#3b82f6', '#22c55e', '#a855f7', '#f59e0b'];

const AdminDashboardCharts = ({ charts }) => {
  const registrations = charts.registrations_per_month ?? [];
  const properties = charts.properties_per_month ?? [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Inscriptions par mois */}
      {registrations.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Inscriptions par mois</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={registrations}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Annonces par mois */}
      {properties.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Annonces soumises / approuvées</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={properties}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend iconSize={10} />
              <Bar dataKey="submitted" fill="#93c5fd" name="Soumises" radius={[2,2,0,0]} />
              <Bar dataKey="approved"  fill="#22c55e" name="Approuvées" radius={[2,2,0,0]} />
              <Bar dataKey="rejected"  fill="#f87171" name="Rejetées" radius={[2,2,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardCharts;
