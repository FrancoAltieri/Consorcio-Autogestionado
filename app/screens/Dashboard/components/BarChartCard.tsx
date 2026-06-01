import { BarChart3 } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { CHART_DISTINCT_COLORS } from '../constants';
import { ChartTooltip } from './ChartTooltip';
import { GastoCategoria } from '../types';

interface Props {
  gastosPorCategoria: GastoCategoria[];
}

export function BarChartCard({ gastosPorCategoria }: Props) {
  const { theme } = useTheme();

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`} />
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              Gastos por Categoría
            </h3>
            <p className="text-base text-gray-500 mt-1">Distribución monetaria del período actual</p>
          </div>
          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
            <BarChart3 className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100 shadow-inner">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={gastosPorCategoria} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
              <defs>
                {CHART_DISTINCT_COLORS.map((color, index) => (
                  <linearGradient key={`barGrad-${index}`} id={`barGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color.fillStart} stopOpacity={1} />
                    <stop offset="100%" stopColor={color.fillEnd} stopOpacity={0.8} />
                  </linearGradient>
                ))}
                <filter id="shadow" height="130%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
                  <feOffset dx="2" dy="2" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.2" />
                  </feComponentTransfer>
                  <feMerge>
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }}
                tickLine={false}
                axisLine={false}
                interval={0}
                dy={10}
              />
              <YAxis
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                dx={-10}
                tickFormatter={(value) => `$${Number(value) / 1000}k`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(229, 231, 235, 0.3)', radius: 10 }} />
              <Bar dataKey="monto" radius={[12, 12, 0, 0]} animationDuration={1500} maxBarSize={60} filter="url(#shadow)">
                {gastosPorCategoria.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={`url(#barGrad-${index % CHART_DISTINCT_COLORS.length})`}
                    stroke={CHART_DISTINCT_COLORS[index % CHART_DISTINCT_COLORS.length].stroke}
                    strokeWidth={1}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
