import { useState, useEffect, useMemo } from 'react';
import { AlertCircle, CheckCircle, Receipt, Loader2, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useParams } from 'react-router';
import { dashboardService, DashboardSummary } from '@/services/dashboardService';
import { useTheme } from '@/contexts/ThemeContext';

export function Dashboard() {
  const { consorcioId } = useParams<{ consorcioId: string }>();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      if (!consorcioId) return;
      try {
        setLoading(true);
        const data = await dashboardService.getDashboardSummary(consorcioId);
        setDashboardData(data);
        setError(null);
      } catch (err) {
        console.error('Error cargando dashboard:', err);
        setError('Error al cargar los datos del dashboard');
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, [consorcioId]);

  // Cálculos dinámicos reales del back
  const gastosPorCategoria = useMemo(() => {
    if (!dashboardData?.gastos) return [];
    const categorias = dashboardData.gastos.reduce((acc: Record<string, number>, gasto) => {
      const categoria = gasto.category || 'Sin categoría';
      acc[categoria] = (acc[categoria] || 0) + gasto.amount;
      return acc;
    }, {});

    return Object.entries(categorias).map(([name, monto]) => ({
      name,
      monto,
    }));
  }, [dashboardData]);

  const gastosPendientes = useMemo(() => {
    return dashboardData?.gastos.filter(g => !g.aprobado) || [];
  }, [dashboardData]);

  const CHART_DISTINCT_COLORS = [
    { stroke: '#3b82f6', fillStart: '#60a5fa', fillEnd: '#2563eb' }, // Azul vibrante
    { stroke: '#10b981', fillStart: '#34d399', fillEnd: '#059669' }, // Esmeralda
    { stroke: '#f59e0b', fillStart: '#fbbf24', fillEnd: '#d97706' }, // Ámbar/Naranja
    { stroke: '#ef4444', fillStart: '#f87171', fillEnd: '#dc2626' }, // Rojo
    { stroke: '#8b5cf6', fillStart: '#a78bfa', fillEnd: '#7c3aed' }, // Violeta
    { stroke: '#ec4899', fillStart: '#f472b6', fillEnd: '#db2777' }, // Rosa
    { stroke: '#06b6d4', fillStart: '#22d3ee', fillEnd: '#0891b2' }, // Cian
    { stroke: '#84cc16', fillStart: '#a3e635', fillEnd: '#65a30d' }, // Lima
  ];

  const balance = dashboardData ? dashboardData.totalPagos - dashboardData.totalGastos : 0;
  const isPositive = balance >= 0;

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-100/50 min-w-[200px]">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{data.name}</p>
          <p className="text-2xl font-bold text-gray-950">
            ${data.monto.toLocaleString('es-AR')}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Gasto total de la categoría
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="relative">
          <div className={`absolute inset-0 bg-gradient-to-r ${theme.iconGradient} opacity-20 blur-2xl animate-pulse`}></div>
          <Loader2 className={`w-16 h-16 animate-spin text-transparent bg-gradient-to-r ${theme.iconGradient} bg-clip-text relative z-10`} />
        </div>
      </div>
    );
  }

  if (error || !dashboardData) {
    return (
      <div className="p-6 animate-in fade-in slide-in-from-top-4 duration-700">
        <div className="bg-gradient-to-br from-red-50 via-white to-red-50/30 border border-red-200/50 rounded-2xl p-6 flex items-start gap-4 shadow-xl shadow-red-100/50 backdrop-blur-sm">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-red-900">{error || 'Error de conexión'}</p>
            <p className="text-sm text-red-700 mt-1">No se pudieron cargar los datos del dashboard</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section - Más aire y mejor tipografía */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
        <div className={`absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-5 blur-3xl rounded-full animate-pulse delay-1000`}></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
              Dashboard
            </h2>
            <p className="text-gray-600 text-xl font-medium">Resumen del estado del consorcio en tiempo real</p>
          </div>
          <div className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder} shadow-inner`}>
            <span className={`text-sm font-bold ${theme.badgeText}`}>
              Marzo 2026 {/* Hardcodeado temporalmente, debería venir del back */}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Cards - Integración final de iconos lógicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Card 1 - Total Gastos */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gray-200/50">
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.iconGradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30 group-hover:scale-110 transition-transform duration-500`}>
                <Receipt className="w-6 h-6 text-white" />
              </div>
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder}`}>
                <span className={`text-xs font-bold ${theme.badgeText}`}>
                  {dashboardData.gastos.length} registros
                </span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total Gastos</h3>
            <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              ${dashboardData.totalGastos.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* Card 2 - Total Pagado */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-green-100">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 rounded-full bg-green-50 border border-green-200">
                <span className="text-xs font-bold text-green-700">Cobrado</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total Pagado</h3>
            <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ${dashboardData.totalPagos.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* Card 3 - Socios en Mora - Vuelve el icono de alerta rojo */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-red-100">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-500">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 rounded-full bg-red-50 border border-red-200">
                <span className="text-xs font-bold text-red-700">Atención</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Socios en Mora</h3>
            <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {dashboardData.sociosEnMora}
            </p>
          </div>
        </div>

        {/* Card 4 - Gastos Pendientes - Vuelve el icono de alerta naranja */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-100">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-600 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-500">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                <span className="text-xs font-bold text-orange-700">Por Aprobar</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Gastos Pendientes</h3>
            <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              {gastosPendientes.length}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Gráfico de Barras - Volumen, Degradados Individuales, Contraste */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                  Gastos por Categoría
                </h3>
                <p className="text-base text-gray-500 mt-1">Distribución monetaria del período actual</p>
              </div>
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30 group-hover:scale-110 transition-transform duration-500`}>
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
            </div>

            {/* Contenedor del gráfico con estilo Glassmorphism sutil */}
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100 shadow-inner">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={gastosPorCategoria} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <defs>
                    {/* Generación dinámica de degradados */}
                    {CHART_DISTINCT_COLORS.map((color, index) => (
                      <linearGradient key={`barGrad-${index}`} id={`barGrad-${index}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={color.fillStart} stopOpacity={1} />
                        <stop offset="100%" stopColor={color.fillEnd} stopOpacity={0.8} />
                      </linearGradient>
                    ))}
                    {/* Sombra interna para las barras */}
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
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(229, 231, 235, 0.3)', radius: 10 }} />

                  <Bar
                    dataKey="monto"
                    radius={[12, 12, 0, 0]}
                    animationDuration={1500}
                    maxBarSize={60}
                    filter="url(#shadow)"
                  >
                    {gastosPorCategoria.map((entry, index) => (
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

        {/* Gráfico de Torta */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                  Distribución Monetaria
                </h3>
                <p className="text-base text-gray-500 mt-1">Proporción por categoría de gasto</p>
              </div>
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30 group-hover:scale-110 transition-transform duration-500`}>
                <PieChartIcon className="w-6 h-6 text-white" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100 shadow-inner">
              <ResponsiveContainer width="100%" height={350}>
                <PieChart margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                  <defs>
                    {/* Degradados radiales para efecto de brillo central en la torta */}
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
                    {gastosPorCategoria.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#pieGrad-${index % CHART_DISTINCT_COLORS.length})`}
                        stroke="#fff"
                        strokeWidth={3}
                        className="hover:opacity-90 transition-opacity cursor-pointer outline-none"
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
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
      </div>

      {/* Recent Activity */}
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                Actividad Reciente
              </h3>
              <p className="text-base text-gray-500 mt-1">Últimos movimientos registrados en el sistema</p>
            </div>
          </div>

          <div className="space-y-4">
            {dashboardData.gastos.slice(0, 5).map((gasto, index) => (
              <div key={gasto.id} className="group/item flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:border-gray-200/50 transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center gap-5">
                  <div className={`p-3.5 rounded-xl ${gasto.aprobado ? 'bg-green-100' : 'bg-orange-100'} shadow-md transition-transform duration-300 group-hover/item:scale-110`}>
                    <Receipt className={`w-6 h-6 ${gasto.aprobado ? 'text-green-600' : 'text-orange-600'}`} />
                  </div>
                  <div>
                    <p className="font-bold text-gray-950 text-lg group-hover/item:text-gray-800 transition-colors">
                      {gasto.description || gasto.concepto}
                    </p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2.5 py-0.5 rounded-full border border-gray-200">
                        {gasto.category || 'Sin categoría'}
                      </span>
                      <span className="text-sm text-gray-400 font-medium">
                        {new Date(gasto.date || gasto.fecha).toLocaleDateString('es-AR', { day: '2-digit', month: 'long', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-3xl font-extrabold tracking-tight bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                    ${gasto.amount?.toLocaleString('es-AR') || gasto.monto?.toLocaleString('es-AR')}
                  </p>
                  <div className={`inline-flex items-center gap-1.5 mt-1 text-xs font-bold ${gasto.aprobado ? 'text-green-700' : 'text-orange-700'}`}>
                    {gasto.aprobado ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                    {gasto.aprobado ? 'Aprobado' : 'Pendiente'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}