import { Badge } from '@/components/ui/badge';
import { useParams } from 'react-router';
import { TrendingDown, AlertCircle, CheckCircle, InfoIcon, Loader2, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState, useEffect } from 'react';
import { BalanceDeConsorcio, getBalance } from '@/services/balanceService';
import { useTheme } from '@/contexts/ThemeContext';

export function Balance() {
  const { consorcioId } = useParams<{ consorcioId: string }>();
  const { theme } = useTheme();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [balanceData, setBalanceData] = useState<BalanceDeConsorcio | null>(null);

  useEffect(() => {
    const loadBalance = async () => {
      if (!consorcioId) return;
      try {
        setLoading(true);
        const balance = await getBalance(consorcioId);
        setBalanceData(balance);
        setError(null);
      } catch (err) {
        console.error('Error cargando balance:', err);
        setError('Error al obtener el balance del consorcio');
      } finally {
        setLoading(false);
      }
    };

    loadBalance();
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

  if (error || !balanceData) {
    return (
      <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
          <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
          <div className="relative z-10">
            <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
              Balance Mensual
            </h2>
            <p className="text-gray-600 text-xl font-medium">Estado de cuentas de cada socio</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 via-white to-red-50/30 border border-red-200/50 rounded-2xl p-8 flex items-start gap-4 shadow-xl shadow-red-100/50 backdrop-blur-sm">
          <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-base font-bold text-red-900">{error || 'Error de conexión'}</p>
            <p className="text-sm text-red-700 mt-1">No se pudieron cargar los datos del balance</p>
          </div>
        </div>
      </div>
    );
  }

  const chartData = balanceData.perPartnerBalance;

  const totalMora = balanceData.totalMora;
  const sociosEnMora = chartData.filter(socio => socio.penaltyForLatePayment > 0).length;
  const sociosAFavor = chartData.length - sociosEnMora;

  // CustomTooltip para el gráfico
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      //const data = payload[0].payload;
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
      {/* Header Section - Profesional y Animado */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
        <div className={`absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-5 blur-3xl rounded-full animate-pulse delay-1000`}></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
              Balance Mensual
            </h2>
            <p className="text-gray-600 text-xl font-medium">Estado financiero detallado de cada socio</p>
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

      {/* Stats Cards - 3 métricas importantes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Card 1 - Socios en Mora */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-red-100">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-orange-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-red-500 to-orange-600 shadow-lg shadow-red-500/30 group-hover:scale-110 transition-transform duration-500">
                <AlertCircle className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 rounded-full bg-red-50 border border-red-200">
                <span className="text-xs font-bold text-red-700">Alerta</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Socios en Mora</h3>
            <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent">
              {sociosEnMora}
            </p>
          </div>
        </div>

        {/* Card 2 - Socios a Favor */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-green-100">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-500">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 rounded-full bg-green-50 border border-green-200">
                <span className="text-xs font-bold text-green-700">Positivo</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Socios a Favor</h3>
            <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              {sociosAFavor}
            </p>
          </div>
        </div>

        {/* Card 3 - Total Mora */}
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-orange-100">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-600 shadow-lg shadow-orange-500/30 group-hover:scale-110 transition-transform duration-500">
                <TrendingDown className="w-6 h-6 text-white" />
              </div>
              <div className="px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
                <span className="text-xs font-bold text-orange-700">Total</span>
              </div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total Mora</h3>
            <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
              ${totalMora.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
            </p>
          </div>
        </div>
      </div>

      {/* Gráfico de Comparativa*/}
      {balanceData.totalExpenses == 0 ? (
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-xl shadow-blue-100/50">
          <div className={`p-4 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg mb-4`}>
            <BarChart3 className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-bold text-blue-900">No hay datos disponibles</p>
          <p className="text-blue-700 mt-2">Se mostrarán los gráficos cuando haya datos registrados</p>
        </div>
      ) : (
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                  Comparativa de Mora
                </h3>
                <p className="text-base text-gray-500 mt-1">Gastos, Pagos y Aportes por Socio</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray-100 shadow-inner">
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <defs>
                    {/* <linearGradient id="gradGastos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                      <stop offset="100%" stopColor="#1e40af" stopOpacity={0.8} />
                    </linearGradient> */}
                    {/* <linearGradient id="gradPagos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity={1} />
                      <stop offset="100%" stopColor="#047857" stopOpacity={0.8} />
                    </linearGradient> */}
                    <linearGradient id="gradMora" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={1} />
                      <stop offset="100%" stopColor="#d97706" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }} tickLine={false} axisLine={false} />
                  <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(229, 231, 235, 0.3)', radius: 10 }} />
                  <Legend />
                  {/* <Bar dataKey="gastosRealizados" fill="url(#gradGastos)" name="Gastos Realizados" radius={[12, 12, 0, 0]} animationDuration={1500} /> */}
                  {/* <Bar dataKey="payments" fill="url(#gradPagos)" name="Pagos Realizados" radius={[12, 12, 0, 0]} animationDuration={1500} /> */}
                  <Bar dataKey="penaltyForLatePayment" fill="url(#gradMora)" name="Mora" radius={[12, 12, 0, 0]} animationDuration={1500} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}

      {/* Balance Detallado */}
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                Balance Detallado por Socio
              </h3>
              <p className="text-base text-gray-500 mt-1">Estado individual de cada miembro del consorcio</p>
            </div>
          </div>

          {balanceData.totalExpenses == 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 font-medium">No hay socios para mostrar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Socio</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Gastos</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Pagos</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Debe Aportar</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Mora</th>
                    <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Estado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {balanceData.perPartnerBalance.map((balance) => (
                    <tr key={balance.partnerId} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{balance.name}</div>
                        {/* <div className="text-xs text-gray-500 font-medium">{balance.apartment}</div> */}
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-gray-900">${((balance as any).gastosRealizados ?? 0).toLocaleString('es-AR')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-green-600">${balance.payments.toLocaleString('es-AR')}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-blue-600">${balance.debt.toLocaleString('es-AR', { maximumFractionDigits: 2 })}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-orange-600">{balance.penaltyForLatePayment > 0 ? `$${balance.penaltyForLatePayment.toLocaleString('es-AR', { maximumFractionDigits: 2 })}` : '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        {balance.penaltyForLatePayment > 0 && (
                          <Badge className="bg-gradient-to-r from-red-100 to-orange-100 text-red-800 border-0 font-semibold">Debe</Badge>
                        )}
                        {balance.payments > balance.debt && (
                          <Badge className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-0 font-semibold">A Favor</Badge>
                        )}
                        {balance.payments == balance.debt && (
                          <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 font-semibold">Al Día</Badge>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Información de Cálculos */}
      <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-8 shadow-lg shadow-blue-100/50`}>
        <div className="flex gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex-shrink-0">
            <InfoIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="font-bold text-blue-900 uppercase tracking-wider mb-3">Cómo se calcula el balance</p>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-900 mt-0.5">•</span>
                <span><strong>Participación:</strong> Porcentaje equitativo del socio en el consorcio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-900 mt-0.5">•</span>
                <span><strong>Debe Aportar:</strong> Porcentaje del total de gastos según su participación</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-900 mt-0.5">•</span>
                <span><strong>Mora:</strong> 5% sobre saldo negativo si tiene deuda</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}