import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams } from 'react-router';
import { socios, gastos, pagos, calcularBalance } from '@/data/mockData';
import { Download, FileText, Calendar, DollarSign, TrendingUp, AlertTriangle, InfoIcon } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Reportes() {
  const { consorcioId } = useParams();
  const balance = calcularBalance();
  const totalGastos = gastos.filter(g => g.aprobado).reduce((sum, g) => sum + g.monto, 0);
  const totalPagos = pagos.reduce((sum, p) => sum + p.monto, 0);
  const totalMora = balance.reduce((sum, b) => sum + b.mora, 0);

  const evolucionMensual = [
    { mes: 'Sem 1', gastos: 45000, pagos: 0 },
    { mes: 'Sem 2', gastos: 75000, pagos: 70000 },
    { mes: 'Sem 3', gastos: 140000, pagos: 105000 },
    { mes: 'Sem 4', gastos: 210500, pagos: 140000 },
  ];

  const reportes = [
    { id: 1, nombre: 'Resumen Mensual Completo', descripcion: 'Balance general con todos los gastos y pagos del mes', icono: FileText, color: 'blue' },
    { id: 2, nombre: 'Estado de Cuentas por Socio', descripcion: 'Detalle individual de cada socio con saldo y mora', icono: DollarSign, color: 'green' },
    { id: 3, nombre: 'Gastos por Categoría', descripcion: 'Análisis de gastos agrupados por categoría', icono: TrendingUp, color: 'purple' },
    { id: 4, nombre: 'Reporte de Morosidad', descripcion: 'Listado de socios con pagos pendientes y mora acumulada', icono: AlertTriangle, color: 'orange' },
  ];

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    green: 'bg-green-100 text-green-600',
    purple: 'bg-purple-100 text-purple-600',
    orange: 'bg-orange-100 text-orange-600',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Reportes y Estado de Cuentas</h2>
        <p className="text-gray-600 mt-1">Genera y descarga reportes del consorcio</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Consorcio: #{consorcioId}</p>
          <p className="text-xs text-blue-700 mt-1">Visualizando datos de prueba. Los reportes reales se generarán desde los datos almacenados en la base de datos.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Select defaultValue="marzo">
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="enero">Enero 2026</SelectItem>
            <SelectItem value="febrero">Febrero 2026</SelectItem>
            <SelectItem value="marzo">Marzo 2026</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalGastos.toLocaleString('es-AR')}</div>
            <p className="text-xs text-gray-500 mt-1">Marzo 2026</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">${totalPagos.toLocaleString('es-AR')}</div>
            <p className="text-xs text-gray-500 mt-1">Marzo 2026</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Diferencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold ${totalPagos - totalGastos >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(totalPagos - totalGastos).toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-gray-500 mt-1">{totalPagos - totalGastos >= 0 ? 'Superávit' : 'Déficit'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Mora Acumulada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-orange-600">
              ${totalMora.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total del mes</p>
          </CardContent>
        </Card>
      </div>

      {/* Evolution Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Evolución de Gastos y Pagos</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={evolucionMensual}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-AR')}`} />
              <Legend />
              <Line type="monotone" dataKey="gastos" stroke="#ef4444" strokeWidth={2} name="Gastos Acumulados" />
              <Line type="monotone" dataKey="pagos" stroke="#10b981" strokeWidth={2} name="Pagos Acumulados" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Available Reports */}
      <Card>
        <CardHeader>
          <CardTitle>Reportes Disponibles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportes.map((reporte) => {
              const Icon = reporte.icono;
              return (
                <div key={reporte.id} className="border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${colorClasses[reporte.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{reporte.nombre}</h3>
                      <p className="text-sm text-gray-600 mb-3">{reporte.descripcion}</p>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" /> PDF</Button>
                        <Button size="sm" variant="outline" className="flex-1"><Download className="w-4 h-4 mr-2" /> Excel</Button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Resumen Ejecutivo - Marzo 2026</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Gastos por Categoría</h4>
                <div className="space-y-2">
                  {Object.entries(
                    gastos.filter(g => g.aprobado).reduce((acc, g) => {
                      acc[g.categoria] = (acc[g.categoria] || 0) + g.monto;
                      return acc;
                    }, {} as Record<string, number>)
                  )
                    .sort(([, a], [, b]) => b - a)
                    .map(([categoria, monto]) => (
                      <div key={categoria} className="flex items-center justify-between">
                        <Badge variant="outline">{categoria}</Badge>
                        <span className="font-semibold text-gray-900">${monto.toLocaleString('es-AR')}</span>
                      </div>
                    ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Estado de Socios</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Al día</span>
                    <Badge className="bg-blue-100 text-blue-800">{balance.filter(b => b.estado === 'al dia').length} socios</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">A favor</span>
                    <Badge className="bg-green-100 text-green-800">{balance.filter(b => b.estado === 'a favor').length} socios</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Debe</span>
                    <Badge className="bg-red-100 text-red-800">{balance.filter(b => b.estado === 'debe').length} socios</Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Total socios</span>
                    <span className="font-semibold">{socios.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}