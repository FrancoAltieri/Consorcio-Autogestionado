import { useDashboard } from './useDashboard';
import { DashboardLoading } from './components/DashboardLoading';
import { DashboardError } from './components/DashboardError';
import { DashboardHeader } from './components/DashboardHeader';
import { StatsCards } from './components/StatsCards';
import { BarChartCard } from './components/BarChartCard';
import { PieChartCard } from './components/PieChartCard';
import { MorosityChartCard } from './components/MorosityChartCard';
import { RecentActivity } from './components/RecentActivity';

export function Dashboard() {
  const { loading, error, dashboardData, gastosPorCategoria, gastosPendientes, morosidadPorEstado, selectedPeriod, handlePrevPeriod, handleNextPeriod } = useDashboard();

  if (loading) return <DashboardLoading />;
  if (error || !dashboardData) return <DashboardError error={error ?? 'Error de conexión'} />;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DashboardHeader selectedPeriod={selectedPeriod} onPrev={handlePrevPeriod} onNext={handleNextPeriod} />
      <StatsCards dashboardData={dashboardData} gastosPendientes={gastosPendientes} />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <BarChartCard gastosPorCategoria={gastosPorCategoria} />
        <PieChartCard gastosPorCategoria={gastosPorCategoria} />
        <MorosityChartCard data={morosidadPorEstado} />
      </div>
      <RecentActivity gastos={dashboardData.gastos} />
    </div>
  );
}
