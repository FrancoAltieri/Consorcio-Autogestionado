import { AlertCircle, CheckCircle, Receipt } from 'lucide-react';
import { DashboardSummary } from '@/services/dashboardService';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  dashboardData: DashboardSummary;
  gastosPendientes: DashboardSummary['gastos'];
}

export function StatsCards({ dashboardData, gastosPendientes }: Props) {
  const { theme } = useTheme();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

      {/* Total Gastos */}
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gray-200/50">
        <div className={`absolute inset-0 bg-gradient-to-br ${theme.iconGradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`} />
        <div className="relative p-8">
          <div className="flex items-center justify-between mb-5">
            <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
              <Receipt className="w-6 h-6 text-white" />
            </div>
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder}`}>
              <span className="text-xs font-bold">{dashboardData.gastos.length} registros</span>
            </div>
          </div>
          <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total Gastos</h3>
          <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
            ${dashboardData.totalGastos.toLocaleString('es-AR')}
          </p>
        </div>
      </div>

      {/* Total Pagado */}
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-green-100">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

      {/* Socios en Mora */}
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-red-100">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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

      {/* Gastos Pendientes */}
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-100">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
  );
}
