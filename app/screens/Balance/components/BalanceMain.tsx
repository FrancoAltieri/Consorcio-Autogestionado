import React from 'react';
import useBalance from '../useBalance';
import BalanceLoading from './BalanceLoading';
import { Badge } from '@/components/ui/badge';
import { TrendingDown, AlertCircle, CheckCircle, InfoIcon, BarChart3 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useTheme } from '@/contexts/ThemeContext';
import { formatPeriodToMonthYear } from '@/utils/period';

export default function BalanceMain() {
    const { loading, error, balanceData, consorcioId, selectedPeriod, handlePrevPeriod, handleNextPeriod } = useBalance();
    const { theme } = useTheme();

    if (loading) {
        return <BalanceLoading />;
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

    const chartData = balanceData.perPartnerBalance || [];

    // Normalize and sort data by outstanding amount (debt - payments) desc
    const sortedChartData = [...chartData].map((p: any) => ({
        name: p.name || 'Socio',
        debt: Number(p.debt ?? 0),
        payments: Number(p.payments ?? 0),
        overdueDebt: Number(p.overdueDebt ?? 0),
        moroseDebt: Number(p.moroseDebt ?? 0),
        status: p.debtStatus ?? 'PAGADA',
    })).sort((a: any, b: any) => ((b.overdueDebt || b.debt - b.payments) - (a.overdueDebt || a.debt - a.payments)));

    const totalMora = balanceData.totalMoroseDebt ?? balanceData.totalMora ?? 0;
    const sociosEnMora = balanceData.countPartnersInMorosity ?? 0;
    const sociosConVencida = balanceData.countPartnersWithOverdueDebt ?? 0;
    const sociosAFavor = sortedChartData.filter((socio: any) => (socio.payments ?? 0) > (socio.debt ?? 0)).length;
    const statusLabel = (status?: string) => {
        if (status === 'EN_MORA') return 'En mora';
        if (status === 'VENCIDA') return 'Vencida';
        if (status === 'PENDIENTE') return 'Pendiente';
        return 'Al dia';
    };
    const statusBadge = (status?: string) => {
        if (status === 'EN_MORA') return 'bg-gradient-to-r from-red-100 to-orange-100 text-red-800';
        if (status === 'VENCIDA') return 'bg-gradient-to-r from-orange-100 to-yellow-100 text-orange-800';
        if (status === 'PENDIENTE') return 'bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800';
        return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800';
    };

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-100/50 min-w-[200px]">
                    <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">{label}</p>
                    <div className="space-y-2">
                        {payload.map((p: any, idx: number) => (
                            <div key={idx} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span style={{ backgroundColor: p.color || p.stroke }} className="w-3 h-3 rounded-sm inline-block" />
                                    <span className="text-sm text-gray-600">{p.name}</span>
                                </div>
                                <div className="text-right">
                                    <p className="text-lg font-bold text-gray-900">${Number(p.value).toLocaleString('es-AR')}</p>
                                </div>
                            </div>
                        ))}
                    </div>
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
                    <div className="flex items-center gap-3">
                        <button onClick={handlePrevPeriod} className="p-2 rounded-md hover:bg-gray-100">
                            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M15 18l-6-6 6-6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <div className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder} shadow-inner`}>
                            <span className={`text-sm font-bold`}>
                                {selectedPeriod ? formatPeriodToMonthYear(selectedPeriod) : ''}
                            </span>
                        </div>
                        <button onClick={handleNextPeriod} className="p-2 rounded-md hover:bg-gray-100">
                            <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M9 6l6 6-6 6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </button>
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30`}>
                            <BarChart3 className="w-8 h-8 text-white" />
                        </div>
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
                        <p className="mt-2 text-xs font-semibold text-red-700">{sociosConVencida} con deuda vencida</p>
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
                                <BarChart data={sortedChartData} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                                    <defs>
                                        <linearGradient id="gradDebt" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
                                        </linearGradient>
                                        <linearGradient id="gradPaid" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor="#10b981" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#34d399" stopOpacity={0.6} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fill: '#6b7280', fontSize: 13, fontWeight: 500 }} tickLine={false} axisLine={false} />
                                    <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(value) => `$${Number(value) / 1000}k`} />
                                    <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(229, 231, 235, 0.3)', radius: 10 }} />
                                    <Legend />
                                    <Bar dataKey="debt" fill="url(#gradDebt)" name="Debe" radius={[12, 12, 0, 0]} animationDuration={1500} />
                                    <Bar dataKey="payments" fill="url(#gradPaid)" name="Pagos" radius={[12, 12, 0, 0]} animationDuration={1500} />
                                    <Bar dataKey="overdueDebt" fill="#f97316" name="Deuda Vencida" radius={[12, 12, 0, 0]} animationDuration={1500} />
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
                                        <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Pendiente</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Vencida</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">En Mora</th>
                                        <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Estado</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {balanceData.perPartnerBalance.map((balance: any) => (
                                        <tr key={balance.partnerId} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-gray-900">{balance.name}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-gray-900">${((balance as any).gastosRealizados ?? 0).toLocaleString('es-AR')}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-green-600">${balance.payments}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-blue-600">${balance.debt}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-orange-600">{(balance.outstandingDebt ?? 0) > 0 ? `$${Number(balance.outstandingDebt).toLocaleString('es-AR', { maximumFractionDigits: 2 })}` : '-'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-orange-700">{(balance.overdueDebt ?? 0) > 0 ? `$${Number(balance.overdueDebt).toLocaleString('es-AR', { maximumFractionDigits: 2 })}` : '-'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-bold text-red-700">{(balance.moroseDebt ?? 0) > 0 ? `$${Number(balance.moroseDebt).toLocaleString('es-AR', { maximumFractionDigits: 2 })}` : '-'}</p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge className={`${statusBadge(balance.debtStatus)} border-0 font-semibold`}>
                                                    {statusLabel(balance.debtStatus)}
                                                </Badge>
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
                                <span><strong>Mora:</strong> una deuda vence al cierre del período y pasa a mora si atraviesa un mes completo sin pago.</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
