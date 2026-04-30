import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Check, X, Calendar, CircleAlert, CheckCircle } from 'lucide-react';
import { getAllSocios } from '../services/sociosService';
import { getAllGastos, saveGasto } from '../services/gastosService';

interface Socio {
  id: number;
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
  const { consorcioId } = useParams();
  const initialFormData = {
    date: new Date().toISOString().split('T')[0],
    description: "",
    category: "",
    amount: "",
    partnerId: ""
  };

  const initialFieldErrors = {
    date: "",
    description: "",
    category: "",
    amount: "",
    partnerId: ""
  };

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
      amount: "",
      partnerId: formData.partnerId ? "" : "El socio es obligatorio."
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

  const handleSaveGastos = async () => {
    if (!consorcioId || !validateForm()) return;

    const nuevoGasto = {
      amount: parseFloat(formData.amount),
      description: formData.description.trim(),
      date: formData.date,
      consorcioId: Number(consorcioId),
      partnerId: Number(formData.partnerId),
      category: formData.category
    };

    try {
      const response = await saveGasto(nuevoGasto);

      if (response.ok) {
        await handleGetAllGastos();
        closeDialog();
        setSuccessMessage("Gasto registrado correctamente.");
        setShowSuccessMessage(true);
        return;
      }

      const errorData = await response.json().catch(() => ({}));
      setSubmitError(errorData?.message || "No se pudo guardar el gasto. Verifica los datos e inténtalo nuevamente.");

    } catch (error) {
      console.error("Error al guardar el gasto:", error);
      setSubmitError("Ocurrió un error de conexión al guardar el gasto.");
    }
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

  useEffect(() => {
    const handleGetSocios = async () => {
      if (consorcioId) {
        try {
          const sociosData = await getAllSocios(consorcioId);
          setSocios(sociosData);
        } catch (error) {
          console.error("Error al obtener socios:", error);
        }
      }
    };
    handleGetSocios();
    handleGetAllGastos();
  }, [consorcioId]);

  useEffect(() => {
    if (!successMessage) return;

    const hideTimeoutId = window.setTimeout(() => {
      setShowSuccessMessage(false);
    }, 2600);

    const clearTimeoutId = window.setTimeout(() => {
      setSuccessMessage("");
    }, 3200);

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

  const totalGastos = filteredGastos
    .filter(g => g.approved)
    .reduce((sum, g) => sum + g.amount, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-gray-900">Gastos Comunes</h2>
        <p className="text-gray-600 mt-1">Gestiona y aprueba los gastos del consorcio</p>
      </div>

      {successMessage && (
        <Alert
          className={`fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 border-green-200 bg-green-100 text-green-800 shadow-lg transition-all duration-500 ease-out ${showSuccessMessage ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
            }`}
        >
          <CheckCircle className="h-4 w-4 text-green-700" />
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

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
              {submitError && (
                <Alert variant="destructive">
                  <CircleAlert className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              )}
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleFieldChange('date', e.target.value)}
                  className={fieldErrors.date ? "border-red-500" : ""}
                />
                {fieldErrors.date && (
                  <p className="text-red-500 text-xs">{fieldErrors.date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="concepto">Concepto</Label>
                <Textarea
                  id="concepto"
                  placeholder="Describe el gasto..."
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleFieldChange('description', e.target.value)}
                  className={fieldErrors.description ? "border-red-500" : ""}
                />
                {fieldErrors.description && (
                  <p className="text-red-500 text-xs">{fieldErrors.description}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleFieldChange('category', value)}
                >
                  <SelectTrigger className={fieldErrors.category ? "border-red-500" : ""}>
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
                {fieldErrors.category && (
                  <p className="text-red-500 text-xs">{fieldErrors.category}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="monto">Monto ($)</Label>
                <Input
                  id="monto"
                  type="number"
                  placeholder="0"
                  value={formData.amount}
                  onChange={(e) => handleFieldChange('amount', e.target.value)}
                  className={fieldErrors.amount ? "border-red-500" : ""}
                />
                {fieldErrors.amount && (
                  <p className="text-red-500 text-xs">{fieldErrors.amount}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="socio">Socio que realizó el gasto</Label>
                <Select
                  value={formData.partnerId}
                  onValueChange={(value) => handleFieldChange('partnerId', value)}
                >
                  <SelectTrigger className={fieldErrors.partnerId ? "border-red-500" : ""}>
                    <SelectValue placeholder="Selecciona socio" />
                  </SelectTrigger>
                  <SelectContent>
                    {socios.map(socio => (
                      <SelectItem key={socio.id} value={String(socio.id)}>
                        {socio.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {fieldErrors.partnerId && (
                  <p className="text-red-500 text-xs">{fieldErrors.partnerId}</p>
                )}
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveGastos}>
                  Guardar Gasto
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

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
            <div className="text-2xl font-semibold">{gastos.filter(g => g.approved).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-gray-600">Pendientes Aprobación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-semibold">{gastos.filter(g => !g.approved).length}</div>
          </CardContent>
        </Card>
      </div>

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

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Concepto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Categoría</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Socio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredGastos.map((gasto) => {
                  const socio = socios.find(s => s.id === gasto.partnerId);
                  return (
                    <tr key={gasto.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {new Date(gasto.date).toLocaleDateString('es-AR')}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">{gasto.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Badge variant="outline">{gasto.category}</Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{socio?.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ${gasto.amount.toLocaleString('es-AR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {gasto.approved ? (
                          <Badge className="bg-green-100 text-green-800">Aprobado</Badge>
                        ) : (
                          <Badge className="bg-orange-100 text-orange-800">Pendiente</Badge>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {!gasto.approved && (
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