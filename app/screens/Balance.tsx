import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useParams } from 'react-router';
import { socios, calcularBalance } from '@/data/mockData';
import { TrendingUp, TrendingDown, AlertCircle, CheckCircle, Download, InfoIcon } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export function Balance() {
  const { consorcioId } = useParams();
  const balanceData = calcularBalance();

  const chartData = socios.map(socio => {
    const balance = balanceData.find(b => b.socioId === socio.id);
    return {
      nombre: socio.nombre.split(' ')[0],
      gastosRealizados: balance?.gastosRealizados || 0,
      pagosPagados: balance?.pagosPagados || 0,
      debeAportar: balance?.debeAportar || 0,
    };
  });

  const totalMora = balanceData.reduce((sum, b) => sum + b.mora, 0);
  const sociosEnMora = balanceData.filter(b => b.estado === 'debe').length;
  const sociosAFavor = balanceData.filter(b => b.estado === 'a favor').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Balance Mensual</h2>
        <p className="text-gray-600 mt-1">Estado de cuentas de cada socio - Marzo 2026</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Consorcio: #{consorcioId}</p>
          <p className="text-xs text-blue-700 mt-1">Visualizando datos de prueba. El balance real se calculará automáticamente desde los datos del backend.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          Descargar PDF
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Socios en Mora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-red-600">{sociosEnMora}</div>
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Socios a Favor</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-green-600">{sociosAFavor}</div>
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Mora</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-semibold text-orange-600">
                ${totalMora.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
              </div>
              <AlertCircle className="w-8 h-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Comparativa de Gastos, Pagos y Aportes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="nombre" />
              <YAxis />
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString('es-AR')}`} />
              <Legend />
              <Bar dataKey="gastosRealizados" fill="#3b82f6" name="Gastos Realizados" />
              <Bar dataKey="pagosPagados" fill="#10b981" name="Pagos Realizados" />
              <Bar dataKey="debeAportar" fill="#f59e0b" name="Debe Aportar" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Detailed Balance */}
      <Card>
        <CardHeader>
          <CardTitle>Balance Detallado por Socio</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Socio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Gastos Realizados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pagos Efectuados
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Debe Aportar
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Saldo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mora
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {balanceData.map((balance) => {
                  const socio = socios.find(s => s.id === balance.socioId);
                  const saldo = balance.pagosPagados + balance.gastosRealizados - balance.debeAportar;

                  return (
                    <tr key={balance.socioId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm">
                        <div>
                          <div className="font-medium text-gray-900">{socio?.nombre}</div>
                          <div className="text-gray-500">{socio?.departamento}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${balance.gastosRealizados.toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ${balance.pagosPagados.toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${balance.debeAportar.toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          {saldo >= 0 ? (
                            <>
                              <TrendingUp className="w-4 h-4 text-green-600" />
                              <span className="font-semibold text-green-600">
                                ${Math.abs(saldo).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                              </span>
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-4 h-4 text-red-600" />
                              <span className="font-semibold text-red-600">
                                -${Math.abs(saldo).toLocaleString('es-AR', { maximumFractionDigits: 2 })}
                              </span>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                        {balance.mora > 0 ? `$${balance.mora.toLocaleString('es-AR', { maximumFractionDigits: 2 })}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {balance.estado === 'debe' && (
                          <Badge className="bg-red-100 text-red-800">Debe</Badge>
                        )}
                        {balance.estado === 'a favor' && (
                          <Badge className="bg-green-100 text-green-800">A Favor</Badge>
                        )}
                        {balance.estado === 'al dia' && (
                          <Badge className="bg-blue-100 text-blue-800">Al Día</Badge>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Notes */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <p className="font-medium mb-2">Cómo se calcula el balance:</p>
              <ul className="space-y-1 list-disc list-inside">
                <li><strong>Gastos Realizados:</strong> Suma de gastos aprobados que realizó cada socio</li>
                <li><strong>Pagos Efectuados:</strong> Suma de pagos registrados por el socio</li>
                <li><strong>Debe Aportar:</strong> Porcentaje del total de gastos según participación</li>
                <li><strong>Saldo:</strong> (Pagos + Gastos Realizados) - Debe Aportar</li>
                <li><strong>Mora:</strong> 5% sobre saldo negativo si debe aportar</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
