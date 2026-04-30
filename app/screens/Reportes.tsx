import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useParams } from 'react-router';
import { useState, useEffect } from 'react';
import { Download, FileText, DollarSign, TrendingUp, AlertTriangle, InfoIcon, Loader2 } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { reportesService, type ReporteSummary } from '@/services/reportesService';

export function Reportes() {
  const { consorcioId } = useParams<{ consorcioId: string }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reporte, setReporte] = useState<ReporteSummary | null>(null);

  useEffect(() => {
    const loadReporte = async () => {
      if (!consorcioId) return;
      try {
        setLoading(true);
        const data = await reportesService.getReporteSummary(consorcioId);
        setReporte(data);
        setError(null);
      } catch (err) {
        console.error('Error cargando reporte:', err);
        setError('Error al cargar los reportes');
      } finally {
        setLoading(false);
      }
    };

    loadReporte();
  }, [consorcioId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error || !reporte) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Reportes y Estado de Cuentas</h2>
          <p className="text-gray-600 mt-1">Genera y descarga reportes del consorcio</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-700">{error || 'Error al cargar los datos'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Datos simulados para evolución (falta implementar)
  const evolucionMensual = [
    { mes: 'Sem 1', gastos: reporte.totalGastos * 0.25, pagos: reporte.totalPagos * 0.2 },
    { mes: 'Sem 2', gastos: reporte.totalGastos * 0.5, pagos: reporte.totalPagos * 0.4 },
    { mes: 'Sem 3', gastos: reporte.totalGastos * 0.75, pagos: reporte.totalPagos * 0.6 },
    { mes: 'Sem 4', gastos: reporte.totalGastos, pagos: reporte.totalPagos },
  ];

  const reportes = [
    { id: 1, nombre: 'Resumen Mensual Completo', descripcion: 'Balance general con todos los gastos y pagos del mes', icono: FileText, color: 'blue' },
    { id: 2, nombre: 'Estado de Cuentas por Socio', descripcion: 'Detalle individual de cada socio con saldo y mora', icono: DollarSign, color: 'green' },
    { id: 3, nombre: 'Análisis de Gastos', descripcion: 'Desglose detallado de gastos registrados', icono: TrendingUp, color: 'purple' },
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
          <p className="text-xs text-blue-700 mt-1">Datos en tiempo real desde la base de datos</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${reporte.totalGastos.toLocaleString('es-AR')}</div>
            <p className="text-xs text-gray-500 mt-1">Registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Pagos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">${reporte.totalPagos.toLocaleString('es-AR')}</div>
            <p className="text-xs text-gray-500 mt-1">Registrados</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Diferencia</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-semibold ${reporte.diferencia >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ${Math.abs(reporte.diferencia).toLocaleString('es-AR')}
            </div>
            <p className="text-xs text-gray-500 mt-1">{reporte.diferencia >= 0 ? 'Superávit' : 'Déficit'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Mora Acumulada</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-orange-600">
              ${reporte.totalMora.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-500 mt-1">Total</p>
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
            {reportes.map((reporteItem) => {
              const Icon = reporteItem.icono;
              return (
                <div key={reporteItem.id} className="border rounded-lg p-4 hover:border-blue-300 hover:bg-blue-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${colorClasses[reporteItem.color as keyof typeof colorClasses]}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-1">{reporteItem.nombre}</h3>
                      <p className="text-sm text-gray-600 mb-3">{reporteItem.descripcion}</p>
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
          <CardTitle>Resumen Ejecutivo</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Socios por Estado</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Al día</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {reporte.balancePorSocio.filter(b => b.estado === 'al dia').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">A favor</span>
                    <Badge className="bg-green-100 text-green-800">
                      {reporte.balancePorSocio.filter(b => b.estado === 'a favor').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Debe</span>
                    <Badge className="bg-red-100 text-red-800">
                      {reporte.balancePorSocio.filter(b => b.estado === 'debe').length}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-2">
                    <span className="text-gray-600">Total socios</span>
                    <span className="font-semibold">{reporte.balancePorSocio.length}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Indicadores Financieros</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Promedio participación</span>
                    <span className="font-semibold">
                      {reporte.balancePorSocio.length > 0
                        ? (reporte.balancePorSocio.reduce((sum, b) => sum + b.participation, 0) / reporte.balancePorSocio.length).toFixed(2)
                        : '0'}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 border-b">
                    <span className="text-gray-600">Cobertura de gastos</span>
                    <span className={`font-semibold ${reporte.totalPagos >= reporte.totalGastos ? 'text-green-600' : 'text-red-600'}`}>
                      {reporte.totalGastos > 0 ? ((reporte.totalPagos / reporte.totalGastos) * 100).toFixed(1) : '0'}%
                    </span>
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