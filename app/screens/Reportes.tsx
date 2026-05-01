import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { Download, FileText, DollarSign, TrendingUp, AlertTriangle, InfoIcon, Loader2, BarChart3 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { reportesService, type ReporteSummary } from '@/services/reportesService';
import { useTheme } from '@/contexts/ThemeContext';

export function Reportes() {
  const { consorcioId } = useParams<{ consorcioId: string }>();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reporte, setReporte] = useState<ReporteSummary | null>(null);

  useEffect(() => {
    const loadReporte = async () => {
      if (!consorcioId) return;
      try {
        setLoading(true);
        const data = await reportesService.getReporteSummary(consorcioId);
        setReporte(data);
        setError(null);
      } catch (err) {
        console.error('Error cargando reporte:', err);
        setError('Error al cargar los reportes');
      } finally {
        setLoading(false);
      }
    };

    loadReporte();
  }, [consorcioId]);

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

  if (error || !reporte) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
          <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
          <div className="relative z-10">
            <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
              Reportes
            </h2>
            <p className="text-gray-600 text-xl font-medium">Genera y descarga reportes del consorcio</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 via-white to-red-50/30 border border-red-200/50 rounded-2xl p-8 flex items-start gap-4 shadow-xl shadow-red-100/50 backdrop-blur-sm">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-red-900">{error || 'Error de conexión'}</p>
            <p className="text-sm text-red-700 mt-1">No se pudieron cargar los reportes</p>
          </div>
        </div>
      </div>
    );
  }

  // Datos simulados para evolución
  const evolucionMensual = [
    { mes: 'Sem 1', gastos: reporte.totalGastos * 0.25, pagos: reporte.totalPagos * 0.2 },
    { mes: 'Sem 2', gastos: reporte.totalGastos * 0.5, pagos: reporte.totalPagos * 0.4 },
    { mes: 'Sem 3', gastos: reporte.totalGastos * 0.75, pagos: reporte.totalPagos * 0.6 },
    { mes: 'Sem 4', gastos: reporte.totalGastos, pagos: reporte.totalPagos },
  ];

  const reportes = [
    { id: 1, nombre: 'Resumen Mensual Completo', descripcion: 'Balance general con todos los gastos y pagos del mes', icono: FileText, color: 'from-blue-500 to-indigo-600' },
    { id: 2, nombre: 'Estado de Cuentas por Socio', descripcion: 'Detalle individual de cada socio con saldo y mora', icono: DollarSign, color: 'from-green-500 to-emerald-600' },
    { id: 3, nombre: 'Análisis de Gastos', descripcion: 'Desglose detallado de gastos registrados', icono: TrendingUp, color: 'from-purple-500 to-indigo-600' },
    { id: 4, nombre: 'Reporte de Morosidad', descripcion: 'Listado de socios con pagos pendientes y mora acumulada', icono: AlertTriangle, color: 'from-orange-500 to-red-600' },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-100/50 min-w-[180px]">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{payload[0].name}</p>
          <p className="text-2xl font-bold text-gray-950">
            ${Number(payload[0].value).toLocaleString('es-AR')}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
        <div className={`absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-5 blur-3xl rounded-full animate-pulse delay-1000`}></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
              Reportes & Estado de Cuentas
            </h2>
            <p className="text-gray-600 text-xl font-medium">Genera reportes detallados del consorcio</p>
          </div>
          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30`}>
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4 flex items-start gap-3 shadow-lg shadow-blue-100/50`}>
        <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-bold text-blue-900 uppercase tracking-wider">Información del Consorcio</p>
          <p className="text-sm text-blue-700 mt-1">Datos en tiempo real • Consorcio #{consorcioId}</p>
        </div>
      </div>

      {/* Stats Cards - 4 métricas importantes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Card 1 - Total Gastos */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gray-200/50">
          <div className={`absolute inset-0 bg-gradient-to-br ${theme.iconGradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30 group-hover:scale-110 transition-transform duration-500`}>
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder}`}>
                <span className={`text-xs font-bold ${theme.badgeText}`}>Registrados</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total Gastos</h3>
            <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              ${reporte.totalGastos.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* Card 2 - Total Pagos */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-green-100">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-500">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 rounded-full bg-green-50 border border-green-200">
                <span className="text-xs font-bold text-green-700">Recaudado</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total Pagos</h3>
            <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              ${reporte.totalPagos.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* Card 3 - Diferencia */}
        <div className={`group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${reporte.diferencia >= 0 ? 'hover:border-green-100' : 'hover:border-red-100'}`}>
          <div className={`absolute inset-0 bg-gradient-to-br ${reporte.diferencia >= 0 ? 'from-green-500/5 to-emerald-500/5' : 'from-red-500/5 to-orange-500/5'} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${reporte.diferencia >= 0 ? 'from-green-500 to-emerald-600 shadow-green-500/30' : 'from-red-500 to-orange-600 shadow-red-500/30'} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                {reporte.diferencia >= 0 ? <TrendingUp className="w-6 h-6 text-white" /> : <TrendingUp className="w-6 h-6 text-white rotate-180" />}
              </div>
              <div className={`px-3 py-1 rounded-full ${reporte.diferencia >= 0 ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <span className={`text-xs font-bold ${reporte.diferencia >= 0 ? 'text-green-700' : 'text-red-700'}`}>
                  {reporte.diferencia >= 0 ? 'Superávit' : 'Déficit'}
                </span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Diferencia</h3>
            <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${reporte.diferencia >= 0 ? 'from-green-600 to-emerald-600' : 'from-red-600 to-orange-600'} bg-clip-text text-transparent`}>
              ${Math.abs(reporte.diferencia).toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        {/* Card 4 - Mora Acumulada */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-100">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-600 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-500">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                <span className="text-xs font-bold text-orange-700">Total</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Mora Acumulada</h3>
            <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              ${reporte.totalMora.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolución - Mejorado */}
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                Evolución de Gastos y Pagos
              </h3>
              <p className="text-base text-gray-500 mt-1">Tendencia acumulada durante el período</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100 shadow-inner">
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={evolucionMensual} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                <defs>
                  <linearGradient id="lineGradGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ef4444" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#ef4444" stopOpacity={0.1} />
                  </linearGradient>
                  <linearGradient id="lineGradPagos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity={0.8} />
                    <stop offset="100%" stopColor="#10b981" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="mes" tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={3} name="Gastos Acumulados" dot={{ fill: '#ef4444', r: 5 }} animationDuration={1500} />
                <Line type="monotone" dataKey="pagos" stroke="#10b981" strokeWidth={3} name="Pagos Acumulados" dot={{ fill: '#10b981', r: 5 }} animationDuration={1500} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Reportes Disponibles */}
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                Reportes Disponibles
              </h3>
              <p className="text-base text-gray-500 mt-1">Descarga los reportes en PDF o Excel</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportes.map((reporteItem) => {
              const Icon = reporteItem.icono;
              return (
                <div key={reporteItem.id} className="group/item relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl hover:border-gray-200/50 transition-all duration-300 hover:-translate-y-1 p-6">
                  <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${reporteItem.color}`}></div>

                  <div className="flex items-start gap-4">
                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${reporteItem.color} shadow-lg group-hover/item:scale-110 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900 text-lg mb-1 group-hover/item:text-gray-800 transition-colors">
                        {reporteItem.nombre}
                      </h4>
                      <p className="text-sm text-gray-600 mb-4">{reporteItem.descripcion}</p>
                      <div className="flex gap-3">
                        <Button size="sm" className={`flex-1 bg-gradient-to-r ${reporteItem.color} text-white font-semibold shadow-md hover:shadow-lg transition-all duration-300 rounded-xl`}>
                          <Download className="w-4 h-4 mr-2" /> PDF
                        </Button>
                        <Button size="sm" variant="outline" className="flex-1 border-gray-200 hover:bg-gray-50 font-semibold rounded-xl">
                          <Download className="w-4 h-4 mr-2" /> Excel
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Resumen Ejecutivo */}
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                Resumen Ejecutivo
              </h3>
              <p className="text-base text-gray-500 mt-1">Indicadores clave del período</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Socios por Estado */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg">Socios por Estado</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
                  <span className="font-semibold text-gray-900">Al día</span>
                  <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 font-bold text-base px-4 py-1">
                    {reporte.balancePorSocio.filter(b => b.estado === 'al dia').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
                  <span className="font-semibold text-gray-900">A favor</span>
                  <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0 font-bold text-base px-4 py-1">
                    {reporte.balancePorSocio.filter(b => b.estado === 'a favor').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-red-50 to-orange-50 border border-red-100">
                  <span className="font-semibold text-gray-900">Debe</span>
                  <Badge className="bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-0 font-bold text-base px-4 py-1">
                    {reporte.balancePorSocio.filter(b => b.estado === 'debe').length}
                  </Badge>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                  <span className="font-semibold text-gray-900">Total socios</span>
                  <span className="font-bold text-lg text-gray-950">{reporte.balancePorSocio.length}</span>
                </div>
              </div>
            </div>

            {/* Indicadores Financieros */}
            <div className="space-y-4">
              <h4 className="font-bold text-gray-900 text-lg">Indicadores Financieros</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                  <span className="font-semibold text-gray-900">Participación Promedio</span>
                  <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                    {reporte.balancePorSocio.length > 0
                      ? (reporte.balancePorSocio.reduce((sum, b) => sum + b.participation, 0) / reporte.balancePorSocio.length).toFixed(2)
                      : '0'}%
                  </span>
                </div>
                <div className={`flex items-center justify-between p-4 rounded-2xl ${reporte.totalPagos >= reporte.totalGastos ? 'bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100' : 'bg-gradient-to-br from-red-50 to-orange-50 border border-red-100'}`}>
                  <span className="font-semibold text-gray-900">Cobertura de Gastos</span>
                  <span className={`font-bold text-lg ${reporte.totalPagos >= reporte.totalGastos ? 'text-green-600' : 'text-red-600'}`}>
                    {reporte.totalGastos > 0 ? ((reporte.totalPagos / reporte.totalGastos) * 100).toFixed(1) : '0'}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}