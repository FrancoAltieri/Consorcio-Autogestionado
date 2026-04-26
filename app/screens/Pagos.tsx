import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Percent, CircleAlert, Loader2, Copy, Check } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
// import { pagos, socios } from '@/data/mockData';
import { Plus, Calendar, CreditCard, DollarSign, InfoIcon } from 'lucide-react';
import { pagoService } from '../services/pagosService';
//import { savePago } from '../services/pagosService';
import { getAllSocios } from '../services/sociosService';

interface Pago {
  id?: number,
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
  const navigate = useNavigate();
  //const [pagos, setPagos] = useState<Pago[]>([]);

  const initialFormData = {
    partnerId: "",
    paymentDate: new Date().toISOString().split('T')[0],
    period: "",
    amount: "",
    paymentMethod: "",
    description: ""
  };

  const initialFieldErrors = {
    partnerId: "",
    paymentDate: "",
    period: "",
    amount: "",
    paymentMethod: "",
    description: ""
  };

  const [showDialog, setShowDialog] = useState(false);
  const [pagosList, setPagosList] = useState<Pago[]>([]);
  const [sociosList, setSociosList] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
  const [submitError, setSubmitError] = useState('');
  const [formData, setFormData] = useState(initialFormData);



  const totalPagos = pagosList.reduce((sum, p) => sum + p.amount, 0);
  const sociosQuePagaron = new Set(pagosList.map(p => p.partnerId)).size;

  const fetchPagos = async () => {
    if (!consorcioId) return;
    setLoading(true);
    try {
      const data = await pagoService.getAllPagos(consorcioId!);
      setPagosList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al cargar los pagos:", error);
      setPagosList([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchSocios = async () => {
    if (!consorcioId) return;
    try {
      const data = await getAllSocios(consorcioId);
      setSociosList(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error al obtener los socios:", error);
      setSociosList([]);
    }
  };

  useEffect(() => {
    fetchPagos();
    fetchSocios();
  }, [consorcioId]);

  const clearForm = () => {
    setFormData(initialFormData);
    setFieldErrors(initialFieldErrors);
    setSubmitError("");
  };

  const validateForm = () => {
    const errors = {
      paymentDate: formData.paymentDate ? "" : "La fecha es obligatoria.",
      partnerId: formData.partnerId ? "" : "El socio es obligatorio.",
      period: formData.period ? "" : "El mes es obligatorio.",
      amount: formData.amount ? "" : "El monto es obligatorio.",
      paymentMethod: formData.paymentMethod ? "" : "El método de pago es obligatorio.",
      description: ""
    };

    if (!formData.amount.trim()) {
      errors.amount = "El monto es obligatorio.";
    } else if (Number.isNaN(formData.amount) || Number(formData.amount) <= 0) {
      errors.amount = "El monto debe ser mayor a 0.";
    }

    setFieldErrors(errors);
    return Object.values(errors).every(error => error === "");
  };

  const handleFieldChange = (field: keyof typeof formData, value: string | number) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((current) => ({ ...current, [field]: "" }));
    if (submitError) setSubmitError("");
  };

  const closeDialog = () => {
    setShowDialog(false);
    clearForm();
  };

  const handleAddPago = async () => {
    if (!validateForm()) return;

    const formattedPeriod = formData.period + "-01";

    const nuevoPago: Pago = {
      partnerId: Number(formData.partnerId),
      paymentDate: formData.paymentDate,
      period: formattedPeriod,  //YYYY-MM-DD
      amount: Number(formData.amount),
      paymentMethod: formData.paymentMethod,
      description: formData.description || ""
    }

    try {
      const response = await pagoService.savePago(nuevoPago);

      if (response.status !== 200) {
        setSubmitError("No se pudo guardar el pago. Verifica los datos e inténtalo nuevamente.");
        let errorMessage = "No se pudo guardar el pago.";
        try {
          const errorData = await response.json();
          errorMessage = errorData?.message || errorMessage;
        } catch (parseError) {
          console.error("Error al parsear la respuesta de error:", parseError);
        }
        setSubmitError(errorMessage);
        return;
      } else {
        fetchPagos();
      }

    } catch (error) {
      console.error("Error al guardar el pago:", error);
      setSubmitError("Ocurrió un error al guardar el pago. Inténtalo nuevamente.");
      return;
    }

    setPagosList([...pagosList, nuevoPago]);
    closeDialog();
  };

  const formatPeriod = (periodDate: string) => {
    if (!periodDate) return "";
    const date = new Date(periodDate);
    const month = date.toLocaleDateString('es-ES', { month: 'long' });
    const year = date.getFullYear();
    return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + year;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Pagos de Expensas</h2>
        <p className="text-gray-600 mt-1">Registra y gestiona los pagos de los socios</p>
      </div>

      <div className="flex items-center justify-between">
        <div></div>
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
              {submitError && (
                <Alert variant="destructive">
                  <CircleAlert className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="fecha-pago">Fecha de Pago</Label>
                <Input
                  id="paymentDate"
                  type="date"
                  value={formData.paymentDate}
                  onChange={(e) => handleFieldChange('paymentDate', e.target.value)}
                  className={fieldErrors.paymentDate ? "border-red-500" : ""}
                />
                {fieldErrors.paymentDate && (
                  <p className="text-red-500 text-xs">{fieldErrors.paymentDate}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="socio-pago">Socio</Label>
                <Select
                  value={formData.partnerId}
                  onValueChange={(value: string) => handleFieldChange('partnerId', value)}>
                  <SelectTrigger className={fieldErrors.partnerId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecciona socio" />
                  </SelectTrigger>
                  <SelectContent>
                    {sociosList.map(socio => (
                      <SelectItem key={socio.id} value={socio.id}>
                        {socio.name} - {socio.apartment}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.partnerId && (
                  <p className="text-red-500 text-xs">{fieldErrors.partnerId}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="periodo">Mes de Pago</Label>
                <Input
                  id="periodo"
                  type="month"
                  value={formData.period}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('period', e.target.value)}
                  className={fieldErrors.period ? "border-red-500" : ""}
                />
                {fieldErrors.period && (
                  <p className="text-red-500 text-xs">{fieldErrors.period}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="monto-pago">Monto ($)</Label>
                <Input
                  id="monto-pago"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFieldChange('amount', e.target.value)}
                  className={fieldErrors.amount ? "border-red-500" : ""}
                />
                {fieldErrors.amount && (
                  <p className="text-red-500 text-xs">{fieldErrors.amount}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="metodo">Método de Pago</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value: string) => handleFieldChange('paymentMethod', value)}
                >
                  <SelectTrigger className={fieldErrors.paymentMethod ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecciona método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CASH">Efectivo</SelectItem>
                    <SelectItem value="TRANSFER">Transferencia</SelectItem>
                    <SelectItem value="CREDIT_CARD">Tarjeta Crédito</SelectItem>
                    <SelectItem value="DEBIT_CARD">Tarjeta Débito</SelectItem>
                    <SelectItem value="OTHER">Otro</SelectItem>
                  </SelectContent>
                </Select>
                {fieldErrors.paymentMethod && (
                  <p className="text-red-500 text-xs">{fieldErrors.paymentMethod}</p>
                )}
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleAddPago}>
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
            <div className="text-2xl font-semibold">{pagosList.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Socios al Día</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">
              {sociosQuePagaron} / {sociosList.length}
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
            {sociosList.map((socio) => {
              const socoPagos = pagosList.filter(p => p.partnerId === socio.id);
              const totalPagado = socoPagos.reduce((sum, p) => sum + p.amount, 0);
              const tienePagos = socoPagos.length > 0;

              return (
                <div key={socio.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tienePagos ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                      <DollarSign className={`w-5 h-5 ${tienePagos ? 'text-green-600' : 'text-red-600'
                        }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{socio.name}</p>
                      <p className="text-sm text-gray-500">{socio.apartment}</p>
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
                {pagosList.map((pago) => {
                  const socio = sociosList.find(s => s.id === pago.partnerId);
                  return (
                    <tr key={pago.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(pago.paymentDate).toLocaleDateString('es-AR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div>
                          <div className="font-medium">{socio?.name}</div>
                          <div className="text-gray-500">{socio?.apartment}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatPeriod(pago.period)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-gray-400" />
                          <Badge variant="outline">{pago.paymentMethod}</Badge>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        ${pago.amount.toLocaleString('es-AR')}
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
