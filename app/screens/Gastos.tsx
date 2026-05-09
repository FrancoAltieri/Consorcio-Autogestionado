import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import {
  Plus, Check, X, Calendar, CircleAlert, CheckCircle,
  Receipt, AlertCircle, Wallet, Loader2, InfoIcon
} from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

import { useTheme } from '@/contexts/ThemeContext';
import { getAllSocios } from '../services/sociosService';
import { getAllGastos, saveGasto } from '../services/gastosService';
import { authService } from '../services/authService';

interface Socio {
  id: number;
  userId: number;
  name: string;
}

interface Gasto {
  id?: number;
  partnerId: number;
  date: string;
  description: string;
  category: string;
  amount: number;
  approved?: boolean;
}

export function Gastos() {
  const { consorcioId } = useParams<{ consorcioId: string }>();
  const { theme } = useTheme();
  const userId = authService.getUserId();
  const userInfo = authService.getUserInfo();

  const initialFormData = {
    date: new Date().toISOString().split('T')[0],
    description: "",
    category: "",
    amount: ""
  };

  const initialFieldErrors = {
    date: "",
    description: "",
    category: "",
    amount: ""
  };

  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [filter, setFilter] = useState<'todos' | 'aprobados' | 'pendientes'>('todos');
  const [socios, setSocios] = useState<Socio[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [formData, setFormData] = useState(initialFormData);
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
  const [submitError, setSubmitError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const clearForm = () => {
    setFormData(initialFormData);
    setFieldErrors(initialFieldErrors);
    setSubmitError("");
  };

  const validateForm = () => {
    const amountValue = Number(formData.amount);
    const errors = {
      date: formData.date ? "" : "La fecha es obligatoria.",
      description: formData.description.trim() ? "" : "El concepto es obligatorio.",
      category: formData.category ? "" : "La categoría es obligatoria.",
      amount: ""
    };

    if (!formData.amount.trim()) {
      errors.amount = "El monto es obligatorio.";
    } else if (Number.isNaN(amountValue) || amountValue <= 0) {
      errors.amount = "El monto debe ser mayor a 0.";
    }

    setFieldErrors(errors);
    return Object.values(errors).every(error => error === "");
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((current) => ({ ...current, [field]: "" }));
    if (submitError) setSubmitError("");
  };

  const closeDialog = () => {
    setShowDialog(false);
    clearForm();
  };

  const handleGetAllGastos = async () => {
    if (consorcioId) {
      try {
        const gastosData = await getAllGastos(consorcioId);
        setGastos(gastosData);
      } catch (error) {
        console.error("Error al obtener gastos:", error);
      }
    }
  };

  const handleSaveGastos = async () => {
    if (!consorcioId || !validateForm()) return;

    const currentSocio = socios.find(s => s.userId === userId);
    if (!currentSocio) {
      setSubmitError("Socio no encontrado.");
      return;
    }

    const nuevoGasto = {
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      date: formData.date,
      consorcioId: Number(consorcioId),
      partnerId: currentSocio.id,
      category: formData.category
    };

    try {
      const response = await saveGasto(nuevoGasto);
      if (response.ok) {
        await handleGetAllGastos();
        closeDialog();
        setSuccessMessage("Gasto registrado correctamente.");
        setShowSuccessMessage(true);
      } else {
        const errorData = await response.json().catch(() => ({}));
        setSubmitError(errorData?.message || "No se pudo guardar el gasto.");
      }
    } catch (error) {
      setSubmitError("Error de conexión al guardar.");
    }
  };

  useEffect(() => {
    const initData = async () => {
      if (consorcioId) {
        setLoading(true);
        try {
          const sociosData = await getAllSocios(consorcioId);
          setSocios(sociosData);
          await handleGetAllGastos();
        } finally {
          setLoading(false);
        }
      }
    };
    initData();
  }, [consorcioId]);

  useEffect(() => {
    if (!successMessage) return;
    const hideTimeoutId = window.setTimeout(() => setShowSuccessMessage(false), 2600);
    const clearTimeoutId = window.setTimeout(() => setSuccessMessage(""), 3200);
    return () => {
      window.clearTimeout(hideTimeoutId);
      window.clearTimeout(clearTimeoutId);
    };
  }, [successMessage]);

  const filteredGastos = gastos.filter((g) => {
    if (filter === 'aprobados') return g.approved;
    if (filter === 'pendientes') return !g.approved;
    return true;
  });

  const totalGastosMonto = filteredGastos
    .filter(g => g.approved)
    .reduce((sum, g) => sum + g.amount, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className={`w-16 h-16 animate-spin text-transparent bg-gradient-to-r ${theme.iconGradient} bg-clip-text`} />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* Mensaje de Éxito Flotante */}
      {successMessage && (
        <Alert className={`fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 border-green-200 bg-green-50/90 backdrop-blur-md text-green-800 shadow-2xl transition-all duration-500 ${showSuccessMessage ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"}`}>
          <CheckCircle className="h-5 w-5 text-green-600" />
          <AlertDescription className="font-bold">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Header Section */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
              Gastos Comunes
            </h2>
            <p className="text-gray-600 text-xl font-medium">Control y aprobación de egresos del consorcio</p>
          </div>
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button className={`h-14 px-8 rounded-2xl bg-gradient-to-r ${theme.iconGradient} hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg font-bold text-white border-0`}>
                <Plus className="w-6 h-6 mr-2" />
                Registrar Gasto
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
              <div className={`h-2 bg-gradient-to-r ${theme.iconGradient}`}></div>
              <div className="p-8">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-bold">Nuevo Gasto</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {submitError && (
                    <Alert variant="destructive" className="rounded-xl">
                      <CircleAlert className="h-4 w-4" />
                      <AlertDescription>{submitError}</AlertDescription>
                    </Alert>
                  )}
                  <div className="flex items-center gap-3 rounded-xl border border-blue-200/60 bg-blue-50 p-4">
                    <InfoIcon className="h-5 w-5 flex-shrink-0 text-blue-600" />
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Socio responsable</p>
                      <p className="text-sm font-semibold text-blue-900">{userInfo.nombre}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-500 uppercase">Fecha</Label>
                    <Input type="date" value={formData.date} onChange={(e) => handleFieldChange('date', e.target.value)} className={`rounded-xl ${fieldErrors.date ? "border-red-500" : "border-gray-100"}`} />
                    {fieldErrors.date && <p className="text-red-500 text-xs font-bold">{fieldErrors.date}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-bold text-gray-500 uppercase">Concepto</Label>
                    <Textarea rows={3} placeholder="Descripción del gasto..." value={formData.description} onChange={(e) => handleFieldChange('description', e.target.value)} className={`rounded-xl ${fieldErrors.description ? "border-red-500" : "border-gray-100"}`} />
                    {fieldErrors.description && <p className="text-red-500 text-xs font-bold">{fieldErrors.description}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-500 uppercase">Categoría</Label>
                      <Select value={formData.category} onValueChange={(v) => handleFieldChange('category', v)}>
                        <SelectTrigger className={`rounded-xl ${fieldErrors.category ? "border-red-500" : "border-gray-100"}`}>
                          <SelectValue placeholder="Seleccionar" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                          <SelectItem value="jardineria">Jardinería</SelectItem>
                          <SelectItem value="limpieza">Limpieza</SelectItem>
                          <SelectItem value="mejoras">Mejoras</SelectItem>
                          <SelectItem value="insumos">Insumos</SelectItem>
                        </SelectContent>
                      </Select>
                      {fieldErrors.category && <p className="text-red-500 text-xs font-bold">{fieldErrors.category}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-bold text-gray-500 uppercase">Monto ($)</Label>
                      <Input type="number" placeholder="0" value={formData.amount} onChange={(e) => handleFieldChange('amount', e.target.value)} className={`rounded-xl ${fieldErrors.amount ? "border-red-500" : "border-gray-100"}`} />
                      {fieldErrors.amount && <p className="text-red-500 text-xs font-bold">{fieldErrors.amount}</p>}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <Button variant="outline" onClick={closeDialog} className="flex-1 rounded-xl">Cancelar</Button>
                    <Button onClick={handleSaveGastos} className={`flex-1 rounded-xl bg-gradient-to-r ${theme.iconGradient} text-white font-bold border-0`}>Guardar</Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg text-white`}><Wallet className="w-6 h-6" /></div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total Gastos</h3>
            <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              ${totalGastosMonto.toLocaleString('es-AR')}
            </p>
          </div>
        </div>

        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg text-white"><CheckCircle className="w-6 h-6" /></div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Aprobados</h3>
            <p className="text-4xl font-extrabold tracking-tight text-emerald-600">
              {gastos.filter(g => g.approved).length}
            </p>
          </div>
        </div>

        {/*<div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
          <div className="relative p-8">
            <div className="flex items-center justify-between mb-5">
              <div className="p-3.5 rounded-2xl bg-gradient-to-br from-orange-500 to-yellow-600 shadow-lg text-white"><AlertCircle className="w-6 h-6" /></div>
            </div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Pendientes</h3>
            <p className="text-4xl font-extrabold tracking-tight text-orange-600">
              {gastos.filter(g => !g.approved).length}
            </p>
          </div>
        </div>*/}
      </div>

      {/* Main List Section*/}
      <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>Movimientos</h3>
            <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100">
              {(['todos'  /*, 'aprobados', 'pendientes'*/] as const).map((f) => (
                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500'}`}>
                  {f.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {filteredGastos.map((gasto) => {
              const socio = socios.find(s => s.id === gasto.partnerId);
              return (
                <div key={gasto.id} className="group/item flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300">
                  <div className="flex items-center gap-6">
                    <div className={`p-4 rounded-xl shadow-sm ${gasto.approved ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                      <Receipt className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-950 text-lg">{gasto.description}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(gasto.date).toLocaleDateString('es-AR')}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter">{gasto.category}</Badge>
                        <span className="text-xs font-bold text-blue-600/60 italic">Responsable: {socio?.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className={`text-2xl font-black bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                        ${gasto.amount.toLocaleString('es-AR')}
                      </p>
                      <span className={`text-[10px] font-black uppercase ${gasto.approved ? 'text-green-600' : 'text-orange-600'}`}>
                        {gasto.approved ? 'Aprobado' : 'Pendiente'}
                      </span>
                    </div>
                    {!gasto.approved && (
                      <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl border-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm">
                          <Check className="h-5 w-5" />
                        </Button>
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                          <X className="h-5 w-5" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
