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
  InfoIcon,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

import { pagoService } from '../services/pagosService';
import { getAllSocios } from '../services/sociosService';
import { authService } from '../services/authService';
import { useTheme } from '@/contexts/ThemeContext';

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
  const { theme } = useTheme();

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
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
        <div className={`absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-5 blur-3xl rounded-full animate-pulse delay-1000`}></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
              Pagos de Expensas
            </h2>
            <p className="text-gray-600 text-xl font-medium">Registra y gestiona los pagos del consorcio</p>
          </div>
          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30`}>
            <CreditCard className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.iconGradient} opacity-20 blur-2xl animate-pulse`}></div>
            <Loader2 className={`w-16 h-16 animate-spin text-transparent bg-gradient-to-r ${theme.iconGradient} bg-clip-text relative z-10`} />
          </div>
        </div>
      ) : (
        <>
          {/* Stats Cards - 3 métricas importantes */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 - Total Recaudado */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-green-100">
              <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/30 group-hover:scale-110 transition-transform duration-500">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-green-50 border border-green-200">
                    <span className="text-xs font-bold text-green-700">Recaudado</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total Recaudado</h3>
                <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  ${totalPagos.toLocaleString('es-AR')}
                </p>
              </div>
            </div>

            {/* Card 2 - Total Transacciones */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gray-200/50">
              <div className={`absolute inset-0 bg-gradient-to-br ${theme.iconGradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30 group-hover:scale-110 transition-transform duration-500`}>
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder}`}>
                    <span className={`text-xs font-bold ${theme.badgeText}`}>Movimientos</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Transacciones</h3>
                <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                  {pagosList.length}
                </p>
              </div>
            </div>

            {/* Card 3 - Socios al Día */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-blue-100">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative p-8">
                <div className="flex items-center justify-between mb-5">
                  <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform duration-500">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
                    <span className="text-xs font-bold text-blue-700">Al Día</span>
                  </div>
                </div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Socios al Día</h3>
                <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  {sociosQuePagaron} / {sociosList.length}
                </p>
              </div>
            </div>
          </div>

          {/* Botón Registrar Pago */}
          <div className="flex justify-end">
            <Dialog open={showDialog} onOpenChange={setShowDialog}>
              <DialogTrigger asChild>
                <Button className={`px-8 py-3 rounded-2xl bg-gradient-to-r ${theme.iconGradient} text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2`}>
                  <Plus className="w-5 h-5" />
                  Registrar Mi Pago
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md rounded-2xl shadow-2xl">
                <DialogHeader className="pb-4 border-b border-gray-100">
                  <DialogTitle className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                    Registrar Nuevo Pago
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 mt-6">
                  {submitError && (
                    <div className="bg-gradient-to-br from-red-50 to-red-50/50 border border-red-200/50 rounded-xl p-4 flex items-start gap-3">
                      <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-bold text-red-900">Error</p>
                        <p className="text-sm text-red-700 mt-1">{submitError}</p>
                      </div>
                    </div>
                  )}

                  <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl flex items-center gap-3 border border-blue-200/50`}>
                    <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Socio Pagador</p>
                      <p className="text-sm font-semibold text-blue-900">{userInfo.nombre}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-base font-bold text-gray-900">Fecha de Pago</Label>
                      <Input
                        type="date"
                        value={formData.paymentDate}
                        onChange={(e) => handleFieldChange('paymentDate', e.target.value)}
                        className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-base font-bold text-gray-900">Monto ($)</Label>
                      <Input
                        type="number"
                        placeholder="0.00"
                        value={formData.amount}
                        onChange={(e) => handleFieldChange('amount', e.target.value)}
                        className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-base font-bold text-gray-900">Mes a Pagar</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Select
                        value={formData.selectedMonth}
                        onValueChange={(val) => handleFieldChange('selectedMonth', val)}
                      >
                        <SelectTrigger className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors">
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
                        <SelectTrigger className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors">
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
                    <Label className="text-base font-bold text-gray-900">Método de Pago</Label>
                    <Select onValueChange={(val) => handleFieldChange('paymentMethod', val)}>
                      <SelectTrigger className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors">
                        <SelectValue placeholder="Seleccionar..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CASH">💵 Efectivo</SelectItem>
                        <SelectItem value="TRANSFER">🏦 Transferencia</SelectItem>
                        <SelectItem value="CREDIT_CARD">💳 Tarjeta Crédito</SelectItem>
                        <SelectItem value="DEBIT_CARD">💳 Tarjeta Débito</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex gap-3 justify-end pt-6 border-t border-gray-100 mt-6">
                    <Button
                      onClick={() => setShowDialog(false)}
                      variant="outline"
                      className="px-6 py-2.5 rounded-xl font-semibold border-gray-200 hover:bg-gray-50 transition-all duration-300"
                    >
                      Cancelar
                    </Button>
                    <Button
                      onClick={handleAddPago}
                      className={`px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r ${theme.iconGradient} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
                    >
                      Confirmar Pago
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Estado de Pagos por Socio */}
          <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                    Estado de Pagos por Socio
                  </h3>
                  <p className="text-base text-gray-500 mt-1">Visualiza el historial de pagos de cada socio</p>
                </div>
              </div>

              {sociosList.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <p className="font-medium">No hay socios registrados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sociosList.map((socio) => {
                    const socoPagos = pagosList.filter(p => p.partnerId === socio.id);
                    const totalPagado = socoPagos.reduce((sum, p) => sum + p.amount, 0);
                    const tienePagos = socoPagos.length > 0;
                    return (
                      <div key={socio.id} className="group/item flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:border-gray-200/50 transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center gap-5">
                          <div className={`p-3.5 rounded-xl ${tienePagos ? 'bg-green-100' : 'bg-orange-100'} shadow-md transition-transform duration-300 group-hover/item:scale-110`}>
                            <DollarSign className={`w-6 h-6 ${tienePagos ? 'text-green-600' : 'text-orange-600'}`} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-950 text-lg group-hover/item:text-gray-800 transition-colors">
                              {socio.name}
                            </p>
                            <p className="text-sm text-gray-500 font-medium">
                              {socio.apartment}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`text-3xl font-extrabold tracking-tight bg-gradient-to-r ${tienePagos ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-yellow-600'} bg-clip-text text-transparent`}>
                            ${totalPagado.toLocaleString('es-AR')}
                          </p>
                          <div className={`inline-flex items-center gap-1.5 mt-1 text-xs font-bold ${tienePagos ? 'text-green-700' : 'text-orange-700'}`}>
                            {tienePagos ? <CheckCircle className="w-3 h-3" /> : <CircleAlert className="w-3 h-3" />}
                            {socoPagos.length} {socoPagos.length === 1 ? 'pago' : 'pagos'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Historial de Pagos */}
          {pagosList.length > 0 && (
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
              <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                      Historial de Pagos
                    </h3>
                    <p className="text-base text-gray-500 mt-1">Últimos movimientos registrados</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Fecha</th>
                        <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Socio</th>
                        <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Mes</th>
                        <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Método</th>
                        <th className="px-6 py-4 text-right font-bold text-gray-700 uppercase tracking-widest text-xs">Monto</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {pagosList.map((pago) => {
                        const socio = sociosList.find(s => s.id === pago.partnerId);
                        return (
                          <tr key={pago.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-colors">
                            <td className="px-6 py-4">
                              <span className="font-medium text-gray-900">{new Date(pago.paymentDate).toLocaleDateString('es-AR')}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="font-semibold text-gray-900">{socio?.name}</div>
                              <div className="text-xs text-gray-500 font-medium">{socio?.apartment}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="font-medium text-gray-900">{formatPeriod(pago.period)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 font-semibold">
                                {pago.paymentMethod === 'CASH' && '💵 Efectivo'}
                                {pago.paymentMethod === 'TRANSFER' && '🏦 Transferencia'}
                                {pago.paymentMethod === 'CREDIT_CARD' && '💳 Crédito'}
                                {pago.paymentMethod === 'DEBIT_CARD' && '💳 Débito'}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <p className="text-lg font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                ${pago.amount.toLocaleString('es-AR')}
                              </p>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}