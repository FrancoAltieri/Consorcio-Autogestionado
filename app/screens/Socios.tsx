import { useState, ChangeEvent, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { type Socio } from '@/data/mockData';
import { Plus, Mail, Phone, Percent, CircleAlert } from 'lucide-react';
import {saveSocio, getAllSocios, deleteSocio, updateSocio} from "../services/sociosService";

export function Socios() {
  const initialFormData = {
    name: "",
    apartment: "",
    participation: "",
    email: "",
    phone: ""
  };

  const initialFieldErrors = {
    name: "",
    apartment: "",
    participation: "",
    email: "",
    phone: ""
  };

  const [showDialog, setShowDialog] = useState(false);
  const [sociosList, setSociosList] = useState<Socio[]>([]);
  const [editingSocio, setEditingSocio] = useState<Socio | null>(null);
  const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
  const [submitError, setSubmitError] = useState("");

  const [formData, setFormData] = useState(initialFormData);

  const fetchSocios = async () => {
    try {
      const allSocios = await getAllSocios();
      setSociosList(allSocios);
    } catch (error) {
      console.error("Error al obtener los socios:", error);
      return;
    }
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  const clearForm = () => {
    setFormData(initialFormData);
    setFieldErrors(initialFieldErrors);
    setSubmitError("");
  };

  const validateForm = () => {
    const errors = {
      name: formData.name.trim() ? "" : "El nombre es obligatorio.",
      apartment: formData.apartment.trim() ? "" : "El departamento es obligatorio.",
      email: formData.email.trim() ? "" : "El email es obligatorio.",
      phone: formData.phone.trim() ? "" : "El teléfono es obligatorio.",
      participation: ""
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

    if (fieldErrors[field]) {
      setFieldErrors((current) => ({ ...current, [field]: "" }));
    }

    if (submitError) {
      setSubmitError("");
    }
  };

  const openAddDialog = () => {
    setEditingSocio(null);
    clearForm();
    setShowDialog(true);
  };

  const openEditDialog = (socio: Socio) => {
    setEditingSocio(socio);
    setFormData({
      name: socio.name,
      apartment: socio.apartment,
      participation: String(socio.participation),
      email: socio.email,
      phone: socio.phone
    });
    setShowDialog(true);
  };

  const closeDialog = () => {
    setShowDialog(false);
    setEditingSocio(null);
    clearForm();
  };

  const handleAddSocio = async () => {
    if (!validateForm()) {
      return;
    }

    const nuevoSocio: Socio = {
      id: "",
      name: formData.name.trim(),
      apartment: formData.apartment.trim(),
      participation: Number(formData.participation),
      email: formData.email.trim(),
      phone: formData.phone.trim()
    };

    try {
        const response = await saveSocio(nuevoSocio);

        if (response.status !== 200) {
          let errorMessage = "No se pudo guardar el socio.";
          try {
            const errorData = await response.json();
            errorMessage = errorData?.message || errorMessage;
          } catch (parseError) {
            console.error("Error al parsear la respuesta de error:", parseError);
          }
          setSubmitError(errorMessage);
          return;
        } else {
          fetchSocios();
        }
    } catch (error) {
        console.error("Error al guardar el socio:", error);
        setSubmitError("Ocurrió un error al guardar el socio. Inténtalo nuevamente.");
        return;
    }

    closeDialog();
  };

  const handleDeleteSocio = async (id: number) => {
    try {
      await deleteSocio(id);
    } catch (error) {
      console.error("Error al eliminar el socio:", error);
      return;
    }

    fetchSocios();
  };

  const handleUpdateSocio = async () => {
      if (!editingSocio) {
        return;
      }

      if (!validateForm()) {
        return;
      }

      const socioActualizado: Socio = {
        ...editingSocio,
        name: formData.name.trim(),
        apartment: formData.apartment.trim(),
        participation: Number(formData.participation),
        email: formData.email.trim(),
        phone: formData.phone.trim()
      };

      try {
        const response = await updateSocio(socioActualizado);

        if (response.status !== 200) {
          let errorMessage = "No se pudo actualizar el socio.";

          try {
            const errorData = await response.json();
            errorMessage = errorData?.message || errorMessage;
          } catch (parseError) {
            console.error("Error al parsear la respuesta de error:", parseError);
          }

          setSubmitError(errorMessage);
          return;
        }
      } catch (error) {
        console.error("Error al actualizar el socio:", error);
        setSubmitError("Ocurrió un error al actualizar el socio. Inténtalo nuevamente.");
        return;
      }

      fetchSocios();
      closeDialog();
  };

  const handleSubmitSocio = async () => {
    if (editingSocio) {
      await handleUpdateSocio();
      return;
    }

    await handleAddSocio();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Socios del Consorcio</h2>
          <p className="text-gray-600 mt-1">Gestiona la información de los socios</p>
        </div>
        <Dialog open={showDialog} onOpenChange={(open: boolean) => {
          if (!open) {
            closeDialog();
            return;
          }

          setShowDialog(true);
        }}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Agregar Socio
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingSocio ? 'Editar Socio' : 'Agregar Nuevo Socio'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              {submitError ? (
                <Alert variant="destructive">
                  <CircleAlert className="h-4 w-4" />
                  <AlertTitle>{editingSocio ? 'No se pudo actualizar el socio' : 'No se pudo guardar el socio'}</AlertTitle>
                  <AlertDescription>{submitError}</AlertDescription>
                </Alert>
              ) : null}
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input 
                  id="nombre"
                  placeholder="Ej: Juan Pérez"
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChange("name", e.target.value)}
                  aria-invalid={Boolean(fieldErrors.name)}
                  className={fieldErrors.name ? "border-red-300 focus-visible:ring-red-200" : ""}
                />
                {fieldErrors.name ? (
                  <p className="text-xs text-red-600">{fieldErrors.name}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Input 
                  id="departamento"
                  placeholder="Ej: Depto 1A"
                  value={formData.apartment}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChange("apartment", e.target.value)}
                  aria-invalid={Boolean(fieldErrors.apartment)}
                  className={fieldErrors.apartment ? "border-red-300 focus-visible:ring-red-200" : ""}
                />
                {fieldErrors.apartment ? (
                  <p className="text-xs text-red-600">{fieldErrors.apartment}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="porcentaje">Porcentaje de Participación (%)</Label>
                <Input 
                  id="porcentaje"
                  type="number"
                  placeholder="Ej: 16.67"
                  value={formData.participation}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChange("participation", e.target.value)}
                  aria-invalid={Boolean(fieldErrors.participation)}
                  className={fieldErrors.participation ? "border-red-300 focus-visible:ring-red-200" : ""}
                />
                {fieldErrors.participation ? (
                  <p className="text-xs text-red-600">{fieldErrors.participation}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Ej: juan@example.com"
                  value={formData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChange("email", e.target.value)}
                  aria-invalid={Boolean(fieldErrors.email)}
                  className={fieldErrors.email ? "border-red-300 focus-visible:ring-red-200" : ""}
                />
                {fieldErrors.email ? (
                  <p className="text-xs text-red-600">{fieldErrors.email}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono" 
                  placeholder="Ej: +54 11 1234-5678"
                  value={formData.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => handleFieldChange("phone", e.target.value)}
                  aria-invalid={Boolean(fieldErrors.phone)}
                  className={fieldErrors.phone ? "border-red-300 focus-visible:ring-red-200" : ""}
                />
                {fieldErrors.phone ? (
                  <p className="text-xs text-red-600">{fieldErrors.phone}</p>
                ) : null}
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <Button variant="outline" onClick={closeDialog}>
                  Cancelar
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSubmitSocio}>
                  {editingSocio ? 'Guardar Cambios' : 'Guardar Socio'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sociosList.length === 0 ? (
        <Card className="border-dashed border-blue-200 bg-blue-50/40">
          <CardContent className="py-10 text-center">
            <p className="text-sm font-medium text-blue-700">añade un nuevo socio</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sociosList.map((socio) => (
            <Card key={socio.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{socio.name}</span>
                  <span className="text-sm font-normal text-gray-500">{socio.apartment}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span>{socio.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{socio.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Percent className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-600">{socio.participation}% de participación</span>
                </div>
                <div className="pt-3 flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => openEditDialog(socio)}
                  >
                    Editar
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => {handleDeleteSocio(socio.id)}}
                  >
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
