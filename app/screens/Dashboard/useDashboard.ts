import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { dashboardService, DashboardSummary } from '@/services/dashboardService';
import { pagoService } from '@/services/pagosService';
import { currentPeriod, ensurePeriodInList } from '@/utils/period';

export function useDashboard() {
  const { consorcioId } = useParams<{ consorcioId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardSummary | null>(null);
  const [periodOptions, setPeriodOptions] = useState<string[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<string>(currentPeriod());

  useEffect(() => {
    const loadDashboard = async () => {
      if (!consorcioId) return;
      try {
        setLoading(true);
        const periods = await pagoService.getAvailablePeriods(consorcioId);
        const current = currentPeriod();
        const finalPeriods = ensurePeriodInList(periods, current);
        setPeriodOptions(finalPeriods);
        setSelectedPeriod(current);
        const data = await dashboardService.getDashboardSummary(consorcioId, current);
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

  useEffect(() => {
    if (!consorcioId || !selectedPeriod) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await dashboardService.getDashboardSummary(consorcioId, selectedPeriod);
        setDashboardData(data);
      } catch (err) {
        console.error('Error cargando dashboard por período:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [consorcioId, selectedPeriod]);

  const addMonthsToPeriod = (period: string, delta: number) => {
    const parts = period.split('-');
    const y = Number(parts[0]);
    const m = Number(parts[1]);
    const d = new Date(y, m - 1 + delta, 1);
    const ny = d.getFullYear();
    const nm = String(d.getMonth() + 1).padStart(2, '0');
    return `${ny}-${nm}-01`;
  };

  const handlePrevPeriod = async () => {
    const prev = addMonthsToPeriod(selectedPeriod, -1);
    setSelectedPeriod(prev);
  };

  const handleNextPeriod = async () => {
    const next = addMonthsToPeriod(selectedPeriod, 1);
    setSelectedPeriod(next);
  };

  const gastosPorCategoria = useMemo(() => {
    if (!dashboardData?.gastos) return [];
    const categorias = dashboardData.gastos.reduce((acc: Record<string, number>, gasto) => {
      const categoria = gasto.category || 'Sin categoría';
      acc[categoria] = (acc[categoria] || 0) + gasto.amount;
      return acc;
    }, {});
    return Object.entries(categorias).map(([name, monto]) => ({ name, monto }));
  }, [dashboardData]);

  const gastosPendientes = useMemo(() => {
    return dashboardData?.gastos.filter(g => !g.aprobado) || [];
  }, [dashboardData]);

  const morosidadPorEstado = useMemo(() => {
    if (!dashboardData) return [];
    const vencidos = Math.max((dashboardData.sociosConDeudaVencida ?? 0) - (dashboardData.sociosEnMora ?? 0), 0);
    const enMora = dashboardData.sociosEnMora ?? 0;
    const alDia = Math.max((dashboardData.totalSocios ?? 0) - vencidos - enMora, 0);
    return [
      { name: 'Al dia', value: alDia },
      { name: 'Vencidos', value: vencidos },
      { name: 'En mora', value: enMora },
    ];
  }, [dashboardData]);

  return { loading, error, dashboardData, gastosPorCategoria, gastosPendientes, morosidadPorEstado, periodOptions, selectedPeriod, setSelectedPeriod, handlePrevPeriod, handleNextPeriod };
}
