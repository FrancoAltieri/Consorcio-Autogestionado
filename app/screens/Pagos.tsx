import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { pagos, socios } from '@/data/mockData';
import { Plus, Calendar, CreditCard, DollarSign } from 'lucide-react';

export function Pagos() {
  const [showDialog, setShowDialog] = useState(false);

  const totalPagos = pagos.reduce((sum, p) => sum + p.monto, 0);
  const sociosQuePagaron = new Set(pagos.map(p => p.socioId)).size;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Pagos de Expensas</h2>
          <p className="text-gray-600 mt-1">Registra y gestiona los pagos de los socios</p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Pago
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Pago</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fecha-pago">Fecha de Pago</Label>
                <Input id="fecha-pago" type="date" defaultValue="2026-03-22" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socio-pago">Socio</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona socio" />
                  </SelectTrigger>
                  <SelectContent>
                    {socios.map(socio => (
                      <SelectItem key={socio.id} value={socio.id}>
                        {socio.nombre} - {socio.departamento}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="mes">Mes de Pago</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona mes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="enero">Enero 2026</SelectItem>
                    <SelectItem value="febrero">Febrero 2026</SelectItem>
                    <SelectItem value="marzo">Marzo 2026</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monto-pago">Monto ($)</Label>
                <Input id="monto-pago" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="metodo">Método de Pago</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowDialog(false)}>
                  Registrar Pago
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Total Recaudado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold text-green-600">
              ${totalPagos.toLocaleString('es-AR')}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pagos Registrados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{pagos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Socios al Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {sociosQuePagaron} / {socios.length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Payments by Member */}
      <Card>
        <CardHeader>
          <CardTitle>Estado de Pagos por Socio</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {socios.map((socio) => {
              const socoPagos = pagos.filter(p => p.socioId === socio.id);
              const totalPagado = socoPagos.reduce((sum, p) => sum + p.monto, 0);
              const tienePagos = socoPagos.length > 0;
              
              return (
                <div key={socio.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      tienePagos ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <DollarSign className={`w-5 h-5 ${
                        tienePagos ? 'text-green-600' : 'text-red-600'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{socio.nombre}</p>
                      <p className="text-sm text-gray-500">{socio.departamento}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">
                      ${totalPagado.toLocaleString('es-AR')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {socoPagos.length} {socoPagos.length === 1 ? 'pago' : 'pagos'}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Historial de Pagos</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Socio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Mes
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Método
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pagos.map((pago) => {
                  const socio = socios.find(s => s.id === pago.socioId);
                  return (
                    <tr key={pago.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(pago.fecha).toLocaleDateString('es-AR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{socio?.nombre}</div>
                          <div className="text-gray-500">{socio?.departamento}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pago.mes}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <Badge variant="outline">{pago.metodo}</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ${pago.monto.toLocaleString('es-AR')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
