import { Receipt } from 'lucide-react';
import { DashboardSummary } from '@/services/dashboardService';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
  gastos: DashboardSummary['gastos'];
}

export function RecentActivity({ gastos }: Props) {
  const { theme } = useTheme();

  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
      <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`} />
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
          {gastos.slice(0, 5).map((gasto) => (
            <div
              key={gasto.id}
              className="group/item flex items-center justify-between p-5 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:border-gray-200/50 transition-all duration-300 hover:-translate-y-1"
            >
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
                      {new Date(gasto.date || gasto.fecha).toLocaleDateString('es-AR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-3xl font-extrabold tracking-tight bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                  ${gasto.amount?.toLocaleString('es-AR') || gasto.monto?.toLocaleString('es-AR')}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
