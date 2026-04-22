import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { socios, gastos, pagos, calcularBalance } from '@/data/mockData';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Users, Receipt, InfoIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useParams } from 'react-router';

export function Dashboard() {
  const { consorcioId } = useParams();
  const balance = calcularBalance();
  const gastosAprobados = gastos.filter(g => g.aprobado);
  const gastosPendientes = gastos.filter(g => !g.aprobado);
  const totalGastos = gastosAprobados.reduce((sum, g) => sum + g.monto, 0);
  const totalPagos = pagos.reduce((sum, p) => sum + p.monto, 0);
  const sociosEnMora = balance.filter(b => b.estado === 'debe').length;

  // Datos para gráficos
  const gastosPorCategoria = gastosAprobados.reduce((acc, g) => {
    acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(gastosPorCategoria).map(([name, value]) => ({
    name,
    monto: value,
  }));

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-1">Resumen del estado del consorcio - Marzo 2026</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Consorcio: #{consorcioId}</p>
          <p className="text-xs text-blue-700 mt-1">Actualmente visualizando datos de prueba. Los datos en tiempo real serán disponibles cuando el backend esté completamente configurado.</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Gastos</CardTitle>
            <Receipt className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalGastos.toLocaleString('es-AR')}</div>
            <p className="text-xs text-gray-500 mt-1">{gastosAprobados.length} gastos aprobados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pagado</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalPagos.toLocaleString('es-AR')}</div>
            <p className="text-xs text-gray-500 mt-1">{pagos.length} pagos registrados</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Socios en Mora</CardTitle>
            <AlertCircle className="w-4 h-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{sociosEnMora}</div>
            <p className="text-xs text-gray-500 mt-1">de {socios.length} socios totales</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Gastos Pendientes</CardTitle>
            <AlertCircle className="w-4 h-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{gastosPendientes.length}</div>
            <p className="text-xs text-gray-500 mt-1">Esperando aprobación</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-AR')}`} />
                <Bar dataKey="monto" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribución de Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="monto"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-AR')}`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Actividad Reciente</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {gastos.slice(0, 5).map((gasto) => {
              const socio = socios.find(s => s.id === gasto.socioId);
              return (
                <div key={gasto.id} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${gasto.aprobado ? 'bg-green-100' : 'bg-orange-100'}`}>
                      <Receipt className={`w-4 h-4 ${gasto.aprobado ? 'text-green-600' : 'text-orange-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{gasto.concepto}</p>
                      <p className="text-sm text-gray-500">
                        {socio?.nombre} • {new Date(gasto.fecha).toLocaleDateString('es-AR')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">${gasto.monto.toLocaleString('es-AR')}</p>
                    <p className={`text-xs ${gasto.aprobado ? 'text-green-600' : 'text-orange-600'}`}>
                      {gasto.aprobado ? 'Aprobado' : 'Pendiente'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
