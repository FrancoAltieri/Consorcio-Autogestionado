import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Calendar,
  CreditCard,
  DollarSign,
  CircleAlert,
  Loader2,
  InfoIcon
} from 'lucide-react';

import { pagoService } from '../services/pagosService';
import { getAllSocios } from '../services/sociosService';
import { authService } from '../services/authService';

interface Pago {
  id?: number;
  partnerId: number;
  paymentDate: string;
  period: string;
  amount: number;
  paymentMethod: string;
  description: string;
}

interface Socio {
  id: number;
  name: string;
  apartment: string;
}

export function Pagos() {
  const { consorcioId } = useParams<{ consorcioId: string }>();

  const userId = authService.getUserId();
  const userInfo = authService.getUserInfo();

  const currentYear = new Date().getFullYear();
  const months = [
    { val: "01", name: "Enero" }, { val: "02", name: "Febrero" }, { val: "03", name: "Marzo" },
    { val: "04", name: "Abril" }, { val: "05", name: "Mayo" }, { val: "06", name: "Junio" },
    { val: "07", name: "Julio" }, { val: "08", name: "Agosto" }, { val: "09", name: "Septiembre" },
    { val: "10", name: "Octubre" }, { val: "11", name: "Noviembre" }, { val: "12", name: "Diciembre" }
  ];

  const initialFormData = {
    paymentDate: new Date().toISOString().split('T')[0],
    selectedMonth: (new Date().getMonth() + 1).toString().padStart(2, '0'),
    selectedYear: currentYear.toString(),
    amount: "",
    paymentMethod: "",
    description: ""
  };

  const [showDialog, setShowDialog] = useState(false);
  const [pagosList, setPagosList] = useState<Pago[]>([]);
  const [sociosList, setSociosList] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState(initialFormData);

  const totalPagos = pagosList.reduce((sum, p) => sum + p.amount, 0);
  const sociosQuePagaron = new Set(pagosList.map(p => p.partnerId)).size;

  const fetchPagos = async () => {
    if (!consorcioId) return;
    setLoading(true);
    try {
      const data = await pagoService.getAllPagos(consorcioId);
      setPagosList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocios = async () => {
    if (!consorcioId) return;
    try {
      const data = await getAllSocios(consorcioId);
      setSociosList(Array.isArray(data) ? data : []);
    } catch (error) { }
  };

  useEffect(() => {
    fetchPagos();
    fetchSocios();
  }, [consorcioId]);

  const handleFieldChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSubmitError("");
  };

  const handleAddPago = async () => {
    if (!formData.amount || !formData.paymentMethod || !userId) {
      setSubmitError("Por favor, completa los campos obligatorios.");
      return;
    }

    const formattedPeriod = `${formData.selectedYear}-${formData.selectedMonth}-01`;

    const nuevoPago: Pago = {
      partnerId: userId,
      paymentDate: formData.paymentDate,
      period: formattedPeriod,
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      description: formData.description || ""
    };

    try {
      const response = await pagoService.savePago(nuevoPago);
      if (response.ok) {
        await fetchPagos();
        setShowDialog(false);
        setFormData(initialFormData);
      } else {
        const errorData = await response.json();
        setSubmitError(errorData?.message || "Error al guardar el pago.");
      }
    } catch (error) {
      setSubmitError("Error de conexión.");
    }
  };

  const formatPeriod = (periodDate: string) => {
    if (!periodDate) return "";
    const parts = periodDate.split('-');
    const date = new Date(Number(parts[0]), Number(parts[1]) - 1);
    const month = date.toLocaleDateString('es-ES', { month: 'long' });
    return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + parts[0];
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Pagos de Expensas</h2>
          <p className="text-gray-600 mt-1">Registra y gestiona los pagos</p>
        </div>

        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Registrar Mi Pago
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px]">
            <DialogHeader>
              <DialogTitle>Registrar Nuevo Pago</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-2">
              {submitError && (
                <Alert variant="destructive">
                  <CircleAlert className="h-4 w-4" />
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}

              <div className="bg-blue-50 p-3 rounded-lg flex items-center gap-3 border border-blue-100">
                <InfoIcon className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-xs text-blue-600 font-bold uppercase">Socio Pagador</p>
                  <p className="text-sm font-medium text-blue-900">{userInfo.nombre}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Fecha de Pago</Label>
                  <Input
                    type="date"
                    value={formData.paymentDate}
                    onChange={(e) => handleFieldChange('paymentDate', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Monto ($)</Label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => handleFieldChange('amount', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Mes a pagar</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={formData.selectedMonth}
                    onValueChange={(val) => handleFieldChange('selectedMonth', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map(m => (
                        <SelectItem key={m.val} value={m.val}>{m.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select
                    value={formData.selectedYear}
                    onValueChange={(val) => handleFieldChange('selectedYear', val)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                      <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                      <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Método de Pago</Label>
                <Select onValueChange={(val) => handleFieldChange('paymentMethod', val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                    <SelectItem value="TRANSFER">Transferencia</SelectItem>
                    <SelectItem value="CREDIT_CARD">Tarjeta Crédito</SelectItem>
                    <SelectItem value="DEBIT_CARD">Tarjeta Débito</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 justify-end mt-4">
                <Button variant="outline" onClick={() => setShowDialog(false)}>Cancelar</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddPago}>
                  Confirmar Pago
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Total Recaudado</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold text-green-600">${totalPagos.toLocaleString('es-AR')}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Transacciones</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{pagosList.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm font-medium">Socios al Día</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{sociosQuePagaron} / {sociosList.length}</div></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Estado de Pagos por Socio</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sociosList.map((socio) => {
              const socoPagos = pagosList.filter(p => p.partnerId === socio.id);
              const totalPagado = socoPagos.reduce((sum, p) => sum + p.amount, 0);
              const tienePagos = socoPagos.length > 0;
              return (
                <div key={socio.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tienePagos ? 'bg-green-100' : 'bg-red-100'}`}>
                      <DollarSign className={`w-5 h-5 ${tienePagos ? 'text-green-600' : 'text-red-600'}`} />
                    </div>
                    <div>
                      <p className="font-medium">{socio.name}</p>
                      <p className="text-sm text-gray-500">{socio.apartment}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${totalPagado.toLocaleString('es-AR')}</p>
                    <p className="text-sm text-gray-500">{socoPagos.length} pagos</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Historial de Pagos</CardTitle></CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4">Fecha</th>
                  <th className="px-6 py-4">Socio</th>
                  <th className="px-6 py-4">Mes</th>
                  <th className="px-6 py-4">Método</th>
                  <th className="px-6 py-4 text-right">Monto</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {pagosList.map((pago) => {
                  const socio = sociosList.find(s => s.id === pago.partnerId);
                  return (
                    <tr key={pago.id}>
                      <td className="px-6 py-4">{new Date(pago.paymentDate).toLocaleDateString('es-AR')}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium">{socio?.name}</div>
                        <div className="text-xs text-gray-500">{socio?.apartment}</div>
                      </td>
                      <td className="px-6 py-4">{formatPeriod(pago.period)}</td>
                      <td className="px-6 py-4"><Badge variant="outline">{pago.paymentMethod}</Badge></td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">${pago.amount.toLocaleString('es-AR')}</td>
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