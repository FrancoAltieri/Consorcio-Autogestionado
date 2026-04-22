import { useState, ChangeEvent, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Percent, CircleAlert, Loader2, Copy, Check } from 'lucide-react';
import { saveSocio, getAllSocios, deleteSocio, updateSocio } from "../services/sociosService";
import { consorcioService } from '../services/consorcioService';
import { authService } from '../services/authService';

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
  const [consorcio, setConsorcio] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const initialFormData = {
    apartment: "",
    participation: "",
    role: "MEMBER"
  };

  const initialFieldErrors = {
    apartment: "",
    participation: "",
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

      // Obtener el rol del usuario actual
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
      participation: "",
      role: ""
    };

    const participationValue = Number(formData.participation);

    if (!formData.participation.trim()) {
      errors.participation = "La participación es obligatoria.";
    } else if (Number.isNaN(participationValue) || participationValue <= 0) {
      errors.participation = "La participación debe ser mayor a 0.";
    }

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
      participation: String(socio.participation || ""),
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

      // Verificar si el socio eliminado es el usuario actual
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
      participation: Number(formData.participation),
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

  const handleSubmitSocio = async () => {
    editingSocio ? await handleUpdateSocio() : await handleAddSocio();
  };

  const handleAddSocio = async () => {
    // This method is no longer used since we don't add socios manually
  };

  const copyToClipboard = async () => {
    if (consorcio?.codigoInvitacion) {
      await navigator.clipboard.writeText(consorcio.codigoInvitacion);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Sección del código de invitación */}
      {consorcio && (
        <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="py-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-1">
                  Código de Invitación del Consorcio
                </h3>
                <p className="text-blue-700">
                  Comparte este código para que nuevos miembros se unan al consorcio
                </p>
              </div>
              <div className="flex items-center gap-3">
                <code className="bg-white px-4 py-2 rounded-lg border font-mono text-lg font-bold text-blue-800">
                  {consorcio.codigoInvitacion}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyToClipboard}
                  className="flex items-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copiado' : 'Copiar'}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Socios del Consorcio</h2>
          <p className="text-gray-600 mt-1">Gestiona la información de los socios</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </div>
      ) : sociosList.length === 0 ? (
        <Card className="border-dashed border-blue-200 bg-blue-50/40">
          <CardContent className="py-10 text-center">
            <p className="text-sm font-medium text-blue-700">Aún no hay socios. Comparte el código de invitación para agregar miembros.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sociosList.map((socio) => (
            <Card key={socio.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="truncate mr-2">{socio.name}</span>
                  <span className="text-sm font-normal text-gray-500 shrink-0">{socio.apartment}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-sm text-gray-600">
                  <span className="truncate block">{socio.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-600">{socio.participation}% participación</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="font-medium">Rol:</span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${socio.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                    }`}>
                    {socio.role === 'ADMIN' ? 'Administrador' : 'Miembro'}
                  </span>
                </div>
                <div className="pt-3 flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => openEditDialog(socio)}>Editar</Button>
                  {currentUserRole === 'ADMIN' && (
                    <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:bg-red-50" onClick={() => handleDeleteSocio(socio.id)}>Eliminar</Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Editar Socio</DialogTitle>
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
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                value={formData.apartment}
                onChange={(e) => handleFieldChange("apartment", e.target.value)}
                className={fieldErrors.apartment ? "border-red-500" : ""}
              />
              {fieldErrors.apartment && <p className="text-xs text-red-500">{fieldErrors.apartment}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="porcentaje">Participación (%)</Label>
              <Input
                id="porcentaje"
                type="number"
                value={formData.participation}
                onChange={(e) => handleFieldChange("participation", e.target.value)}
                className={fieldErrors.participation ? "border-red-500" : ""}
              />
              {fieldErrors.participation && <p className="text-xs text-red-500">{fieldErrors.participation}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rol">Rol</Label>
              <Select value={formData.role} onValueChange={(value) => handleFieldChange("role", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MEMBER">Miembro</SelectItem>
                  <SelectItem value="ADMIN">Administrador</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <Button variant="outline" onClick={closeDialog}>Cancelar</Button>
              <Button className="bg-blue-600" onClick={handleUpdateSocio}>Guardar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
