import { useState, ChangeEvent, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { type Socio } from '@/data/mockData';
import { Plus, Mail, Phone, Percent } from 'lucide-react';
import {saveSocio, getAllSocios, deleteSocio, updateSocio} from "../services/sociosService";

export function Socios() {
  const [showDialog, setShowDialog] = useState(false);
  const [sociosList, setSociosList] = useState<Socio[]>([]);
  const [editingSocio, setEditingSocio] = useState<Socio | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    apartment: "",
    participation: "",
    email: "",
    phone: ""
  });

  const fetchSocios = async () => {
    try {
      const response = await getAllSocios();
      const allsocios = await response.json();
      setSociosList(allsocios);
    } catch (error) {
      console.error("Error al obtener los socios:", error);
      return;
    }
  };

  useEffect(() => {
    fetchSocios();
  }, []);

  const clearForm = () => {
    setFormData({
      name: "",
      apartment: "",
      participation: "",
      email: "",
      phone: ""
    });
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
    const nuevoSocio: Socio = {
      id: Date.now(),
      name: formData.name,
      apartment: formData.apartment,
      participation: Number(formData.participation),
      email: formData.email,
      phone: formData.phone
    };

    try {
        await saveSocio(nuevoSocio);
    } catch (error) {
        console.error("Error al guardar el socio:", error);
        return;
    }

    setSociosList([...sociosList, nuevoSocio]);
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

      const socioActualizado: Socio = {
        ...editingSocio,
        name: formData.name,
        apartment: formData.apartment,
        participation: Number(formData.participation),
        email: formData.email,
        phone: formData.phone
      };

      try {
        await updateSocio(socioActualizado);
      } catch (error) {        
        console.error("Error al actualizar el socio:", error);
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
        <Dialog open={showDialog} onOpenChange={(open) => {
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
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre Completo</Label>
                <Input 
                  id="nombre"
                  placeholder="Ej: Juan Pérez"
                  value={formData.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, name: e.target.value })}
                  />
              </div>
              <div className="space-y-2">
                <Label htmlFor="departamento">Departamento</Label>
                <Input 
                  id="departamento"
                  placeholder="Ej: Depto 1A"
                  value={formData.apartment}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, apartment: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="porcentaje">Porcentaje de Participación (%)</Label>
                <Input 
                  id="porcentaje"
                  type="number"
                  placeholder="Ej: 16.67"
                  value={formData.participation}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, participation: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  placeholder="Ej: juan@example.com"
                  value={formData.email}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="telefono">Teléfono</Label>
                <Input 
                  id="telefono" 
                  placeholder="Ej: +54 11 1234-5678"
                  value={formData.phone}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                />
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
