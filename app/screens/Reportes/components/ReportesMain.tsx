import React from 'react';
import useReportes from '../useReportes';
import ReportesLoading from './ReportesLoading';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    Download,
    FileText,
    DollarSign,
    TrendingUp,
    AlertTriangle,
    InfoIcon,
    BarChart3,
    Users,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import {
    downloadResumenPDF,
    downloadSociosPDF,
    downloadGastosPDF,
    downloadMorosidadPDF,
    formatPeriod,
} from '../reportesPdf';
import { downloadExcel } from '../reportesExcel';

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReporteDef {
    id: number;
    nombre: string;
    descripcion: string;
    icono: React.ElementType;
    color: string;
    pdfFn: () => void;
    excelFn: () => void;
}

interface ChartEntry {
    name: string;
    fullName: string;
    cuota: number;
    pagado: number;
    vencida: number;
    mora: number;
}

// ─── Custom chart tooltip ─────────────────────────────────────────────────────

function CustomTooltip({
    active,
    payload,
    label,
    chartData,
}: {
    active?: boolean;
    payload?: any[];
    label?: string;
    chartData: ChartEntry[];
}) {
    if (!active || !payload?.length) return null;
    const item = chartData.find(d => d.name === label);
    return (
        <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-2xl border border-gray-100 min-w-[210px]">
            <p className="text-sm font-bold text-gray-800 mb-3 truncate">
                {item?.fullName ?? label}
            </p>
            <div className="space-y-2">
                {payload.map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <span
                                className="w-3 h-3 rounded-sm flex-shrink-0"
                                style={{ background: p.fill }}
                            />
                            <span className="text-sm text-gray-600">{p.name}</span>
                        </div>
                        <span className="font-bold text-gray-900 tabular-nums">
                            ${Number(p.value).toLocaleString('es-AR', {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                            })}
                        </span>
                    </div>
                ))}
                {/* Show pending if cuota > pagado */}
                {(() => {
                    const cuota  = payload.find(p => p.dataKey === 'cuota')?.value  ?? 0;
                    const pagado = payload.find(p => p.dataKey === 'pagado')?.value ?? 0;
                    const pend   = cuota - pagado;
                    if (pend <= 0.01) return null;
                    return (
                        <div className="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between gap-4">
                            <span className="text-sm font-semibold text-red-500">Pendiente</span>
                            <span className="font-bold text-red-500 tabular-nums">
                                ${pend.toLocaleString('es-AR', {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                })}
                            </span>
                        </div>
                    );
                })()}
            </div>
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ReportesMain() {
    const {
        loading,
        error,
        reporte,
        selectedPeriod,
        handlePrevPeriod,
        handleNextPeriod,
    } = useReportes();

    const { theme } = useTheme();

    // ── Loading ───────────────────────────────────────────────────────────

    if (loading) return <ReportesLoading />;

    // ── Error / empty ─────────────────────────────────────────────────────

    if (error || !reporte) {
        return (
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <HeaderCard theme={theme} selectedPeriod={selectedPeriod} handlePrevPeriod={handlePrevPeriod} handleNextPeriod={handleNextPeriod} />
                <div className="bg-gradient-to-br from-red-50 via-white to-red-50/30 border border-red-200/50 rounded-2xl p-8 flex items-start gap-4 shadow-xl shadow-red-100/50">
                    <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg flex-shrink-0">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <p className="text-base font-bold text-red-900">
                            {error ?? 'No hay datos para este período'}
                        </p>
                        <p className="text-sm text-red-700 mt-1">
                            Intentá con otro período o verificá la conexión.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    // ── Derived values ────────────────────────────────────────────────────

    const partners: any[] = reporte.perPartnerBalance ?? [];

    const alDia  = Math.max(partners.length - Number(reporte.countPartnersWithOverdueDebt ?? 0), 0);
    const aFavor = partners.filter(p => Number(p.payments ?? 0) > Number(p.debt ?? 0) + 0.01).length;
    const deben  = Number(reporte.countPartnersWithDebt ?? 0);
    const vencidos = Number(reporte.countPartnersWithOverdueDebt ?? 0);
    const morosos = Number(reporte.countPartnersInMorosity ?? 0);

    const totalExp  = Number(reporte.totalExpenses  ?? 0);
    const totalPaid = Number(reporte.totalPayments  ?? 0);
    const diff      = Number(reporte.diferencia     ?? 0);
    const mora      = Number(reporte.totalMora      ?? 0);

    const cobPct = totalExp > 0
        ? `${((totalPaid / totalExp) * 100).toFixed(1)}%`
        : '0%';

    // ── Chart data: real per-partner cuota vs pagado ──────────────────────
    //
    // The old chart showed fake "Sem 1–4" data derived by multiplying
    // totalExpenses × [0.25, 0.5, 0.75, 1]. That has nothing to do with
    // what actually happened. We replace it with the real data we DO have:
    // each partner's assigned cuota vs what they actually paid this period.

    const chartData: ChartEntry[] = [...partners]
        .sort((a: any, b: any) => Number(b.debt ?? 0) - Number(a.debt ?? 0))
        .slice(0, 12)
        .map((p: any) => {
            const full = p.name ?? 'Socio';
            // For many partners with long names, use initials
            const short =
                full.length > 13
                    ? full
                          .split(' ')
                          .map((w: string) => (w[0] ?? '').toUpperCase())
                          .join('')
                          .slice(0, 5)
                    : full;
            return {
                name:     short,
                fullName: full,
                cuota:    Number(p.debt     ?? 0),
                pagado:   Number(p.payments ?? 0),
                vencida:  Number(p.overdueDebt ?? 0),
                mora:     Number(p.moroseDebt ?? 0),
            };
        });

    const manyBars = chartData.length > 5;

    // ── Report definitions ────────────────────────────────────────────────

    const reportes: ReporteDef[] = [
        {
            id: 1,
            nombre: 'Resumen Mensual Completo',
            descripcion: 'Balance general con todos los gastos y pagos del período',
            icono: FileText,
            color: 'from-blue-500 to-indigo-600',
            pdfFn:   () => downloadResumenPDF(reporte, selectedPeriod),
            excelFn: () => downloadExcel(reporte, selectedPeriod, 'resumen'),
        },
        {
            id: 2,
            nombre: 'Estado de Cuentas por Socio',
            descripcion: 'Detalle individual de cada socio con saldo y estado de pago',
            icono: Users,
            color: 'from-green-500 to-emerald-600',
            pdfFn:   () => downloadSociosPDF(reporte, selectedPeriod),
            excelFn: () => downloadExcel(reporte, selectedPeriod, 'socios'),
        },
        {
            id: 3,
            nombre: 'Análisis de Gastos',
            descripcion: 'Distribución porcentual de cuotas y cobertura financiera',
            icono: TrendingUp,
            color: 'from-purple-500 to-indigo-600',
            pdfFn:   () => downloadGastosPDF(reporte, selectedPeriod),
            excelFn: () => downloadExcel(reporte, selectedPeriod, 'gastos'),
        },
        {
            id: 4,
            nombre: 'Reporte de Morosidad',
            descripcion: 'Socios con pagos pendientes y mora acumulada al cierre',
            icono: AlertTriangle,
            color: 'from-orange-500 to-red-600',
            pdfFn:   () => downloadMorosidadPDF(reporte, selectedPeriod),
            excelFn: () => downloadExcel(reporte, selectedPeriod, 'morosidad'),
        },
    ];

    // ── Render ────────────────────────────────────────────────────────────

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {/* Header ──────────────────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`} />
                <div className={`absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-br ${theme.iconGradient} opacity-5 blur-3xl rounded-full animate-pulse delay-1000`} />

                <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
                            Reportes
                        </h2>
                        <p className="text-gray-600 text-xl font-medium">
                            Genera y descargá reportes detallados del consorcio
                        </p>
                    </div>

                    {/* Period navigator */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrevPeriod}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            aria-label="Período anterior"
                        >
                            <ChevronLeft className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder} shadow-inner min-w-[150px] text-center`}>
                            <span className={`text-sm font-bold capitalize`}>
                                {formatPeriod(selectedPeriod)}
                            </span>
                        </div>

                        <button
                            onClick={handleNextPeriod}
                            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                            aria-label="Período siguiente"
                        >
                            <ChevronRight className="w-5 h-5 text-gray-600" />
                        </button>

                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg ml-1`}>
                            <BarChart3 className="w-7 h-7 text-white" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Info banner ─────────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl p-4 flex items-start gap-3">
                <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-blue-800">
                    <span className="font-bold uppercase tracking-wider">Datos del período·</span>{' '}
                    Los reportes reflejan la información real registrada en{' '}
                    <span className="font-semibold capitalize">{formatPeriod(selectedPeriod)}</span>.
                </p>
            </div>

            {/* KPI cards ───────────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Total Gastos */}
                <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${theme.iconGradient}`} />
                    <div className="p-7">
                        <div className="flex items-center justify-between mb-5">
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <Badge className={`bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder} ${theme.badgeText} text-xs font-bold`}>
                                Registrados
                            </Badge>
                        </div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                            Total Gastos
                        </p>
                        <p className={`text-3xl font-extrabold tracking-tight bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                            ${totalExp.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Total Pagos */}
                <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-green-100 transition-all duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-500 to-emerald-500" />
                    <div className="p-7">
                        <div className="flex items-center justify-between mb-5">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-200 group-hover:scale-110 transition-transform duration-500">
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <Badge className="bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
                                Recaudado
                            </Badge>
                        </div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                            Total Pagos
                        </p>
                        <p className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                            ${totalPaid.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Diferencia */}
                <div className={`group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 ${diff >= 0 ? 'hover:border-green-100' : 'hover:border-red-100'}`}>
                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${diff >= 0 ? 'from-green-500 to-emerald-500' : 'from-red-500 to-orange-500'}`} />
                    <div className="p-7">
                        <div className="flex items-center justify-between mb-5">
                            <div className={`p-3 rounded-2xl bg-gradient-to-br ${diff >= 0 ? 'from-green-500 to-emerald-600 shadow-green-200' : 'from-red-500 to-orange-600 shadow-red-200'} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                                <TrendingUp className="w-5 h-5 text-white" />
                            </div>
                            <Badge className={`${diff >= 0 ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'} border text-xs font-bold`}>
                                {diff >= 0 ? 'Superávit' : 'Déficit'}
                            </Badge>
                        </div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                            Diferencia
                        </p>
                        <p className={`text-3xl font-extrabold tracking-tight bg-gradient-to-r ${diff >= 0 ? 'from-green-600 to-emerald-600' : 'from-red-600 to-orange-600'} bg-clip-text text-transparent`}>
                            ${Math.abs(diff).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

                {/* Mora */}
                <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:border-orange-100 transition-all duration-500">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
                    <div className="p-7">
                        <div className="flex items-center justify-between mb-5">
                            <div className="p-3 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 shadow-lg shadow-orange-200 group-hover:scale-110 transition-transform duration-500">
                                <AlertTriangle className="w-5 h-5 text-white" />
                            </div>
                            <Badge className="bg-orange-50 border border-orange-200 text-orange-700 text-xs font-bold">
                                Acumulada
                            </Badge>
                        </div>
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
                            Mora
                        </p>
                        <p className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                            ${mora.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                        </p>
                    </div>
                </div>

            </div>

            {/* Chart: Cuota vs Pagado por socio ────────────────────────── */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`} />
                <div className="p-8">

                    <div className="flex items-start justify-between mb-2 flex-wrap gap-3">
                        <div>
                            <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                                Cuota vs Pagado por Socio
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Comparación real de cuota asignada y monto abonado en{' '}
                                <span className="font-semibold capitalize">
                                    {formatPeriod(selectedPeriod)}
                                </span>
                                {partners.length > 12 && (
                                    <span className="ml-2 text-amber-600 font-medium">
                                        — mostrando top 12 de {partners.length} socios
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>

                    {chartData.length === 0 ? (
                        <div className="flex items-center justify-center h-64 text-gray-400">
                            Sin datos de socios para este período
                        </div>
                    ) : (
                        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-5 border border-gray-100 mt-4">
                            <ResponsiveContainer width="100%" height={320}>
                                <BarChart
                                    data={chartData}
                                    margin={{
                                        top: 10,
                                        right: 20,
                                        left: 10,
                                        bottom: manyBars ? 70 : 30,
                                    }}
                                    barCategoryGap="30%"
                                    barGap={3}
                                >
                                    <defs>
                                        <linearGradient id="gradCuota" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%"   stopColor="#94a3b8" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#64748b" stopOpacity={0.7} />
                                        </linearGradient>
                                        <linearGradient id="gradPagado" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%"   stopColor="#10b981" stopOpacity={0.9} />
                                            <stop offset="100%" stopColor="#059669" stopOpacity={0.7} />
                                        </linearGradient>
                                    </defs>

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="#f0f4f8"
                                        vertical={false}
                                    />

                                    <XAxis
                                        dataKey="name"
                                        tick={{ fill: '#6b7280', fontSize: 11, fontWeight: 500 }}
                                        tickLine={false}
                                        axisLine={false}
                                        angle={manyBars ? -40 : 0}
                                        textAnchor={manyBars ? 'end' : 'middle'}
                                        height={manyBars ? 75 : 30}
                                        interval={0}
                                    />

                                    <YAxis
                                        tick={{ fill: '#9ca3af', fontSize: 11 }}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(v: number) => {
                                            if (v === 0)           return '$0';
                                            if (v >= 1_000_000)    return `$${(v / 1_000_000).toFixed(1)}M`;
                                            if (v >= 1_000)        return `$${(v / 1_000).toFixed(0)}k`;
                                            return `$${v}`;
                                        }}
                                    />

                                    <Tooltip
                                        content={
                                            <CustomTooltip chartData={chartData} />
                                        }
                                        cursor={{ fill: 'rgba(148,163,184,0.07)' }}
                                    />

                                    <Legend
                                        wrapperStyle={{
                                            paddingTop: '10px',
                                            fontSize: '13px',
                                            color: '#374151',
                                        }}
                                    />

                                    <Bar
                                        dataKey="cuota"
                                        name="Cuota del Período"
                                        fill="url(#gradCuota)"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={34}
                                    />
                                    <Bar
                                        dataKey="pagado"
                                        name="Pagado"
                                        fill="url(#gradPagado)"
                                        radius={[4, 4, 0, 0]}
                                        maxBarSize={34}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            {/* Reportes disponibles ─────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`} />
                <div className="p-8">

                    <div className="mb-7">
                        <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                            Reportes Disponibles
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Descargá cada reporte como PDF prolijo o Excel (.xlsx) directamente al dispositivo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        {reportes.map(r => {
                            const Icon = r.icono;
                            return (
                                <div
                                    key={r.id}
                                    className="group/item relative overflow-hidden rounded-2xl border border-gray-100 bg-gradient-to-br from-gray-50 to-white hover:shadow-xl hover:border-gray-200 transition-all duration-300 hover:-translate-y-1 p-6"
                                >
                                    <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${r.color}`} />

                                    <div className="flex items-start gap-4">
                                        <div className={`p-4 rounded-2xl bg-gradient-to-br ${r.color} shadow-lg group-hover/item:scale-110 transition-transform duration-300 flex-shrink-0`}>
                                            <Icon className="w-6 h-6 text-white" />
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-bold text-gray-900 text-base mb-1">
                                                {r.nombre}
                                            </h4>
                                            <p className="text-sm text-gray-500 mb-4">
                                                {r.descripcion}
                                            </p>

                                            <div className="flex gap-3">
                                                <Button
                                                    onClick={r.pdfFn}
                                                    size="sm"
                                                    className={`flex-1 bg-gradient-to-r ${r.color} text-white font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition-all rounded-xl`}
                                                >
                                                    <Download className="w-4 h-4 mr-1.5" />
                                                    PDF
                                                </Button>
                                                <Button
                                                    onClick={r.excelFn}
                                                    size="sm"
                                                    variant="outline"
                                                    className="flex-1 border-gray-200 hover:bg-green-50 hover:border-green-300 hover:text-green-700 font-semibold rounded-xl transition-colors"
                                                >
                                                    <Download className="w-4 h-4 mr-1.5" />
                                                    Excel
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

            {/* Resumen ejecutivo ───────────────────────────────────────── */}
            <div className="relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`} />
                <div className="p-8">

                    <div className="mb-7">
                        <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                            Resumen Ejecutivo
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Indicadores clave del período
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                        {/* Socios por estado */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                Socios por Estado
                            </h4>

                            <StatRow label="Al día"     value={String(alDia)}          bg="from-blue-50 to-indigo-50"   border="border-blue-100"   badge="from-blue-100 to-indigo-100 text-blue-800"    />
                            <StatRow label="A favor"    value={String(aFavor)}          bg="from-green-50 to-emerald-50" border="border-green-100"  badge="from-green-100 to-emerald-100 text-green-800" />
                            <StatRow label="Con deuda"  value={String(deben)}           bg="from-red-50 to-orange-50"    border="border-red-100"    badge="from-red-100 to-orange-100 text-red-800"      />
                            <StatRow label="Vencidos"   value={String(vencidos)}        bg="from-orange-50 to-yellow-50" border="border-orange-100" badge="from-orange-100 to-yellow-100 text-orange-800" />
                            <StatRow label="En mora"    value={String(morosos)}         bg="from-red-50 to-rose-50"      border="border-red-100"    badge="from-red-100 to-rose-100 text-red-800"         />
                            <StatRow label="Total"      value={String(partners.length)} bg="from-gray-50 to-gray-100"    border="border-gray-200"   badge="" plain />
                        </div>

                        {/* Indicadores financieros */}
                        <div className="space-y-3">
                            <h4 className="font-bold text-gray-900 text-base flex items-center gap-2">
                                <TrendingUp className="w-4 h-4 text-gray-400" />
                                Indicadores Financieros
                            </h4>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100">
                                <span className="font-semibold text-gray-800 text-sm">Participación Promedio</span>
                                <span className="font-bold text-base bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                                    {partners.length > 0 ? (100 / partners.length).toFixed(2) : '0'}%
                                </span>
                            </div>

                            <div className={`flex items-center justify-between p-4 rounded-2xl border ${totalPaid >= totalExp ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-100' : 'bg-gradient-to-br from-red-50 to-orange-50 border-red-100'}`}>
                                <span className="font-semibold text-gray-800 text-sm">Cobertura de Gastos</span>
                                <span className={`font-bold text-base ${totalPaid >= totalExp ? 'text-green-600' : 'text-red-600'}`}>
                                    {cobPct}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-100">
                                <span className="font-semibold text-gray-800 text-sm">% Socios Morosos</span>
                                <span className={`font-bold text-base ${deben > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                                    {Number(reporte.morosityRate ?? 0).toFixed(1)}%
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200">
                                <span className="font-semibold text-gray-800 text-sm">Cuota Promedio</span>
                                <span className="font-bold text-base text-gray-800">
                                    {partners.length > 0
                                        ? `$${(totalExp / partners.length).toLocaleString('es-AR', { maximumFractionDigits: 2 })}`
                                        : '$0'}
                                </span>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

        </div>
    );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function HeaderCard({ theme, selectedPeriod, handlePrevPeriod, handleNextPeriod }: any) {
    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl">
            <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full`} />
            <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
                <div>
                    <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
                        Reportes
                    </h2>
                    <p className="text-gray-600 text-xl font-medium">Genera y descargá reportes del consorcio</p>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handlePrevPeriod} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <ChevronLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder} shadow-inner min-w-[150px] text-center`}>
                        <span className={`text-sm font-bold capitalize ${theme.badgeText}`}>
                            {formatPeriod(selectedPeriod)}
                        </span>
                    </div>
                    <button onClick={handleNextPeriod} className="p-2 rounded-xl hover:bg-gray-100 transition-colors">
                        <ChevronRight className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function StatRow({
    label,
    value,
    bg,
    border,
    badge,
    plain = false,
}: {
    label: string;
    value: string;
    bg: string;
    border: string;
    badge: string;
    plain?: boolean;
}) {
    return (
        <div className={`flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br ${bg} border ${border}`}>
            <span className="font-semibold text-gray-800 text-sm">{label}</span>
            {plain ? (
                <span className="font-bold text-lg text-gray-900">{value}</span>
            ) : (
                <Badge className={`bg-gradient-to-r ${badge} border-0 font-bold text-sm px-3 py-1`}>
                    {value}
                </Badge>
            )}
        </div>
    );
}
