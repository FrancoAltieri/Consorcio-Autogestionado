import { PieChart as PieChartIcon } from 'lucide-react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { CHART_DISTINCT_COLORS } from '../constants';
import { ChartTooltip } from './ChartTooltip';
import { GastoCategoria } from '../types';

interface Props {
  gastosPorCategoria: GastoCategoria[];
}

export function PieChartCard({ gastosPorCategoria }: Props) {
  const { theme } = useTheme();

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`} />
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              Distribución Monetaria
            </h3>
            <p className="text-base text-gray-500 mt-1">Proporción por categoría de gasto</p>
          </div>
          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <PieChartIcon className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100 shadow-inner">
          <ResponsiveContainer width="100%" height={350}>
            <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
              <defs>
                {CHART_DISTINCT_COLORS.map((color, index) => (
                  <radialGradient key={`pieGrad-${index}`} id={`pieGrad-${index}`} cx="50%" cy="50%" r="80%" fx="50%" fy="50%">
                    <stop offset="0%" stopColor={color.fillStart} stopOpacity={1} />
                    <stop offset="100%" stopColor={color.stroke} stopOpacity={1} />
                  </radialGradient>
                ))}
              </defs>

              <Pie
                data={gastosPorCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={130}
                innerRadius={70}
                dataKey="monto"
                animationDuration={1500}
                paddingAngle={3}
                cornerRadius={8}
              >
                {gastosPorCategoria.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#pieGrad-${index % CHART_DISTINCT_COLORS.length})`}
                    stroke="#fff"
                    strokeWidth={3}
                    className="hover:opacity-90 transition-opacity cursor-pointer outline-none"
                  />
                ))}
              </Pie>

              <Tooltip content={<ChartTooltip />} />
              <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="text-3xl font-extrabold fill-gray-950">
                100%
              </text>
              <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-sm font-medium fill-gray-500 uppercase tracking-widest">
                Gastos
              </text>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
