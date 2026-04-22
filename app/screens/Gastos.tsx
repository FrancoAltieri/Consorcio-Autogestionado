import { useState } from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { gastos, socios } from '@/data/mockData';
import { Plus, Check, X, Calendar, InfoIcon } from 'lucide-react';

export function Gastos() {
  const { consorcioId } = useParams();
  const [showDialog, setShowDialog] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'aprobados' | 'pendientes'>('todos');

  const filteredGastos = gastos.filter((g) => {
    if (filter === 'aprobados') return g.aprobado;
    if (filter === 'pendientes') return !g.aprobado;
    return true;
  });

  const totalGastos = filteredGastos
    .filter(g => g.aprobado)
    .reduce((sum, g) => sum + g.monto, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Gastos Comunes</h2>
        <p className="text-gray-600 mt-1">Gestiona y aprueba los gastos del consorcio</p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
        <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-blue-900">Consorcio: #{consorcioId}</p>
          <p className="text-xs text-blue-700 mt-1">Visualizando datos de prueba. Los gastos reales serán almacenados en la base de datos una vez completado el desarrollo del backend.</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div></div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Gasto
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Gasto</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input id="fecha" type="date" defaultValue="2026-03-22" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="concepto">Concepto</Label>
                <Textarea id="concepto" placeholder="Describe el gasto..." rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                    <SelectItem value="jardineria">Jardinería</SelectItem>
                    <SelectItem value="limpieza">Limpieza</SelectItem>
                    <SelectItem value="mejoras">Mejoras</SelectItem>
                    <SelectItem value="insumos">Insumos</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="monto">Monto ($)</Label>
                <Input id="monto" type="number" placeholder="0" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="socio">Socio que realizó el gasto</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona socio" />
                  </SelectTrigger>
                  <SelectContent>
                    {socios.map(socio => (
                      <SelectItem key={socio.id} value={socio.id}>
                        {socio.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <Button variant="outline" onClick={() => setShowDialog(false)}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => setShowDialog(false)}>
                  Guardar Gasto
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Gastos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">${totalGastos.toLocaleString('es-AR')}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Gastos Aprobados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{gastos.filter(g => g.aprobado).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pendientes Aprobación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{gastos.filter(g => !g.aprobado).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={filter === 'todos' ? 'default' : 'outline'}
          onClick={() => setFilter('todos')}
        >
          Todos
        </Button>
        <Button
          variant={filter === 'aprobados' ? 'default' : 'outline'}
          onClick={() => setFilter('aprobados')}
        >
          Aprobados
        </Button>
        <Button
          variant={filter === 'pendientes' ? 'default' : 'outline'}
          onClick={() => setFilter('pendientes')}
        >
          Pendientes
        </Button>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categoría
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Socio
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGastos.map((gasto) => {
                  const socio = socios.find(s => s.id === gasto.socioId);
                  return (
                    <tr key={gasto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(gasto.fecha).toLocaleDateString('es-AR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {gasto.concepto}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant="outline">{gasto.categoria}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {socio?.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${gasto.monto.toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {gasto.aprobado ? (
                          <Badge className="bg-green-100 text-green-800">Aprobado</Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-800">Pendiente</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!gasto.aprobado && (
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                              <Check className="w-4 h-4" />
                            </Button>
                            <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
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
    </div>
  );
}
