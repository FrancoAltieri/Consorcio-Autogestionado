import { AlertTriangle } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  data: { name: string; value: number }[];
}

const COLORS = ['#10b981', '#f97316', '#dc2626'];

export function MorosityChartCard({ data }: Props) {
  const { theme } = useTheme();
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`} />
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              Estado de Morosidad
            </h3>
            <p className="text-base text-gray-500 mt-1">Socios al dia, vencidos y en mora</p>
          </div>
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg group-hover:scale-110 transition-transform duration-500">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px] gap-6 items-center rounded-3xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white p-6 shadow-inner">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={58} outerRadius={96} paddingAngle={3}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="#fff" strokeWidth={3} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number, name: string) => [`${value} socios`, name]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center justify-between gap-3 rounded-xl bg-white px-3 py-2 border border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                </div>
                <span className="text-sm font-bold text-gray-950">{item.value}</span>
              </div>
            ))}
            <div className="pt-2 text-xs font-semibold text-gray-500">Total socios: {total}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
