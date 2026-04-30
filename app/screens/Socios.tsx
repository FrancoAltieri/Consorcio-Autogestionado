import { useState, ChangeEvent, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Percent, CircleAlert, Loader2, Copy, Check, Users, Shield, Handshake } from 'lucide-react';
import { saveSocio, getAllSocios, deleteSocio, updateSocio } from "../services/sociosService";
import { consorcioService } from '../services/consorcioService';
import { authService } from '../services/authService';
import { useTheme } from '@/contexts/ThemeContext';

interface Socio {
  id: number;
  userId: number;
  consorcioId: number;
  name: string;
  email: string;
  apartment: string;
  participation: number;
  role: string;
}

export function Socios() {
  const { consorcioId } = useParams<{ consorcioId: string }>();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [consorcio, setConsorcio] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const initialFormData = {
    apartment: "",
    role: "MEMBER"
  };

  const initialFieldErrors = {
    apartment: "",
    role: ""
  };

  const [showDialog, setShowDialog] = useState(false);
  const [sociosList, setSociosList] = useState<Socio[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSocio, setEditingSocio] = useState<Socio | null>(null);
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
  const [submitError, setSubmitError] = useState("");
  const [formData, setFormData] = useState(initialFormData);

  const fetchConsorcio = async () => {
    if (!consorcioId) return;
    try {
      const data = await consorcioService.getConsorcioById(consorcioId);
      setConsorcio(data);
    } catch (error) {
      console.error("Error al obtener consorcio:", error);
    }
  };

  const fetchSocios = async () => {
    if (!consorcioId) return;
    setLoading(true);
    try {
      const data = await getAllSocios(consorcioId);
      setSociosList(Array.isArray(data) ? data : []);

      const userId = authService.getUserId();
      const currentSocio = data.find((socio: Socio) => socio.userId === userId);
      setCurrentUserRole(currentSocio ? currentSocio.role : null);
    } catch (error) {
      console.error("Error al obtener los socios:", error);
      setSociosList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsorcio();
    fetchSocios();
  }, [consorcioId]);

  const clearForm = () => {
    setFormData(initialFormData);
    setFieldErrors(initialFieldErrors);
    setSubmitError("");
  };

  const validateForm = () => {
    const errors = {
      apartment: formData.apartment.trim() ? "" : "El departamento es obligatorio.",
      role: ""
    };

    setFieldErrors(errors);
    return Object.values(errors).every((value) => value === "");
  };

  const handleFieldChange = (field: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [field]: value }));
    if (fieldErrors[field]) setFieldErrors((current) => ({ ...current, [field]: "" }));
    if (submitError) setSubmitError("");
  };

  const openEditDialog = (socio: Socio) => {
    setEditingSocio(socio);
    setFormData({
      apartment: socio.apartment || "",
      role: socio.role
    });
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingSocio(null);
    clearForm();
  };

  const handleDeleteSocio = async (id: number) => {
    if (!confirm("¿Estás seguro de eliminar este socio?")) return;
    try {
      await deleteSocio(id);

      const userId = authService.getUserId();
      const socioEliminado = sociosList.find(socio => socio.id === id);
      if (socioEliminado && socioEliminado.userId === userId) {
        // Redirigir a MisConsorcios
        navigate('/mis-consorcios');
        return;
      }

      fetchSocios();
    } catch (error) {
      console.error("Error al eliminar el socio:", error);
    }
  };

  const handleUpdateSocio = async () => {
    if (!editingSocio || !validateForm()) return;

    const socioActualizado = {
      id: editingSocio.id,
      apartment: formData.apartment.trim(),
      role: formData.role
    };

    try {
      const response = await updateSocio(socioActualizado);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        setSubmitError(errorData.message || "No se pudo actualizar el socio.");
        return;
      }
      fetchSocios();
      closeDialog();
    } catch (error) {
      setSubmitError("Error de conexión al actualizar el socio.");
    }
  };


  const copyToClipboard = async () => {
    if (consorcio?.codigoInvitacion) {
      await navigator.clipboard.writeText(consorcio.codigoInvitacion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section*/}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
        <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
        <div className={`absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-5 blur-3xl rounded-full animate-pulse delay-1000`}></div>

        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
              Socios del Consorcio
            </h2>
            <p className="text-gray-600 text-xl font-medium">Gestiona y visualiza la información de todos los miembros</p>
          </div>
          <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30`}>
            <Users className="w-8 h-8 text-white" />
          </div>
        </div>
      </div>
      {consorcio && (
        <div className="group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-200 shadow-xl p-8 transition-all duration-500">
          <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>

          <div className="flex items-center justify-between gap-6">
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-black mb-2">
                Código de Invitación
              </h3>
              <p className="text-gray-700 font-medium">Comparte este código para que nuevos miembros se unan al consorcio</p>
            </div>
            <div className="flex items-center gap-4">
              <code className="bg-gray-100 px-6 py-3 rounded-2xl border border-gray-300 font-mono text-2xl font-black text-black shadow-sm">
                {consorcio.codigoInvitacion}
              </code>
              <Button
                onClick={copyToClipboard}
                className={`px-5 py-3 rounded-2xl bg-gradient-to-r ${theme.iconGradient} text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2`}
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                {copied ? 'Copiado' : 'Copiar'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards - 3 métricas importantes */}
      {!loading && sociosList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1 - Total Socios */}
          <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gray-200/50">
            <div className={`absolute inset-0 bg-gradient-to-br ${theme.iconGradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-5">
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30 group-hover:scale-110 transition-transform duration-500`}>
                  <Users className="w-6 h-6 text-white" />
                </div>
                <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder}`}>
                  <span className={`text-xs font-bold ${theme.badgeText}`}>Total</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total de Socios</h3>
              <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                {sociosList.length}
              </p>
            </div>
          </div>

          {/* Card 2 - Administradores */}
          <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-100">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
                  <span className="text-xs font-bold text-purple-700">Admins</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Administradores</h3>
              <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
                {sociosList.filter(s => s.role === 'ADMIN').length}
              </p>
            </div>
          </div>

          {/* Card 3 - Participación Promedio */}
          <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-100">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative p-8">
              <div className="flex items-center justify-between mb-5">
                <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                  <Percent className="w-6 h-6 text-white" />
                </div>
                <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                  <span className="text-xs font-bold text-emerald-700">Promedio</span>
                </div>
              </div>
              <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Participación Promedio</h3>
              <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                {sociosList.length > 0 ? (sociosList.reduce((sum, s) => sum + s.participation, 0) / sociosList.length).toFixed(1) : 0}%
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Loading State*/}
      {loading && (
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="relative">
            <div className={`absolute inset-0 bg-gradient-to-r ${theme.iconGradient} opacity-20 blur-2xl animate-pulse`}></div>
            <Loader2 className={`w-16 h-16 animate-spin text-transparent bg-gradient-to-r ${theme.iconGradient} bg-clip-text relative z-10`} />
          </div>
        </div>
      )}

      {/* Sin Socios */}
      {!loading && sociosList.length === 0 && (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
          <div className={`bg-gradient-to-br from-blue-50 via-white to-blue-50/30 border border-blue-200/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-xl shadow-blue-100/50 backdrop-blur-sm`}>
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg mb-4`}>
              <Users className="w-8 h-8 text-white" />
            </div>
            <p className="text-lg font-bold text-blue-900">Aún no hay socios en el consorcio</p>
            <p className="text-blue-700 mt-2">Comparte el código de invitación para agregar miembros al consorcio</p>
          </div>
        </div>
      )}

      {/* Grid de Socios*/}
      {!loading && sociosList.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sociosList.map((socio) => (
            <div key={socio.id} className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gray-200/50">
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${socio.role === 'ADMIN' ? 'from-purple-500 to-indigo-500' : 'from-emerald-500 to-green-500'}`}></div>

              <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-950 mb-1 group-hover:text-gray-800 transition-colors">
                      {socio.name}
                    </h3>
                    <p className="text-sm font-semibold text-gray-600 bg-gray-100 inline-block px-3 py-1 rounded-full border border-gray-200">
                      {socio.apartment}
                    </p>
                  </div>
                  <div className={`p-3 rounded-2xl ${socio.role === 'ADMIN' ? 'bg-purple-100' : 'bg-emerald-100'} shadow-md transition-transform duration-300 group-hover:scale-110`}>
                    {socio.role === 'ADMIN' ? (
                      <Shield className={`w-5 h-5 ${socio.role === 'ADMIN' ? 'text-purple-600' : 'text-emerald-600'}`} />
                    ) : (
                      <Handshake className={`w-5 h-5 ${socio.role === 'ADMIN' ? 'text-purple-600' : 'text-emerald-600'}`} />
                    )}
                  </div>
                </div>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Email</p>
                    <p className="text-sm text-gray-700 break-all">{socio.email}</p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Participación</p>
                      <p className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                        {socio.participation}%
                      </p>
                    </div>
                    <Percent className="w-8 h-8 text-emerald-600 opacity-20" />
                  </div>

                  <div>
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Rol</p>
                    <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${socio.role === 'ADMIN'
                      ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700'
                      : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700'
                      }`}>
                      {socio.role === 'ADMIN' ? '🛡️ Administrador' : '👥 Miembro'}
                    </div>
                  </div>
                </div>

                {currentUserRole === 'ADMIN' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <Button
                      onClick={() => openEditDialog(socio)}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeleteSocio(socio.id)}
                      className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                    >
                      Eliminar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Dialog de Edición */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md rounded-2xl shadow-2xl">
          <DialogHeader className="pb-4 border-b border-gray-100">
            <DialogTitle className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
              Editar Información del Socio
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

            <div className="space-y-2">
              <Label className="text-base font-bold text-gray-900">Departamento</Label>
              <Input
                value={formData.apartment}
                onChange={(e) => handleFieldChange("apartment", e.target.value)}
                placeholder="Ej: Departamento 4B"
                className={`rounded-xl text-base py-2.5 ${fieldErrors.apartment ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} transition-colors`}
              />
              {fieldErrors.apartment && <p className="text-xs text-red-500 font-medium">{fieldErrors.apartment}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-base font-bold text-gray-900">Rol</Label>
              <Select value={formData.role} onValueChange={(value) => handleFieldChange("role", value)}>
                <SelectTrigger className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors">
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">👥 Miembro</SelectItem>
                  <SelectItem value="ADMIN">🛡️ Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-3 justify-end pt-6 border-t border-gray-100 mt-6">
              <Button
                onClick={closeDialog}
                variant="outline"
                className="px-6 py-2.5 rounded-xl font-semibold border-gray-200 hover:bg-gray-50 transition-all duration-300"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateSocio}
                className={`px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r ${theme.iconGradient} text-white shadow-lg hover:shadow-xl transition-all duration-300`}
              >
                Guardar Cambios
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}