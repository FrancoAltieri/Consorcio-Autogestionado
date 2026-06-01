import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router';
import { dashboardService, DashboardSummary } from '@/services/dashboardService';

export function useDashboard() {
  const { consorcioId } = useParams<{ consorcioId: string }>();
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

  return { loading, error, dashboardData, gastosPorCategoria, gastosPendientes };
}
