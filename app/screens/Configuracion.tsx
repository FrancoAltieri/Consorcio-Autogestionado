import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, CheckCircle, Loader2, Settings } from 'lucide-react';
import { consorcioService, ConsorcioData } from '../services/consorcioService';

export function Configuracion() {
    const { consorcioId } = useParams<{ consorcioId: string }>();
    const navigate = useNavigate();

    const [consorcio, setConsorcio] = useState<ConsorcioData | null>(null);
    const [nombreInput, setNombreInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [hasChanges, setHasChanges] = useState(false);

    useEffect(() => {
        if (!consorcioId) return;

        const fetchConsorcio = async () => {
            try {
                setLoading(true);
                const data = await consorcioService.getConsorcioById(consorcioId);

                if (data.rol !== 'ADMIN') {
                    navigate(`/app/${consorcioId}`);
                    return;
                }

                setConsorcio(data);
                setNombreInput(data.nombre);
            } catch (error) {
                setErrorMessage(
                    error instanceof Error ? error.message : 'Error al cargar la configuración'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchConsorcio();
    }, [consorcioId, navigate]);

    useEffect(() => {
        if (consorcio) {
            setHasChanges(nombreInput.trim() !== consorcio.nombre && nombreInput.trim() !== '');
        }
    }, [nombreInput, consorcio]);

    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNombreInput(e.target.value);
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleGuardar = async () => {
        if (!consorcioId || !nombreInput.trim()) {
            setErrorMessage('El nombre no puede estar vacío');
            return;
        }

        try {
            setIsSaving(true);
            setErrorMessage('');
            const consorcioActualizado = await consorcioService.actualizarNombreConsorcio(
                consorcioId,
                nombreInput.trim()
            );

            setConsorcio(consorcioActualizado);
            setHasChanges(false);
            setSuccessMessage('Nombre del consorcio actualizado exitosamente');

            setTimeout(() => setSuccessMessage(''), 3000);
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : 'Error al guardar los cambios'
            );
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancelar = () => {
        if (consorcio) {
            setNombreInput(consorcio.nombre);
            setHasChanges(false);
            setErrorMessage('');
            setSuccessMessage('');
        }
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                        <Settings className="w-6 h-6" />
                        Configuración
                    </h2>
                    <p className="text-gray-600 mt-1">Gestiona la configuración de tu consorcio</p>
                </div>
                <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                        <div className="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 border-blue-600"></div>
                        <p className="text-gray-400 font-medium mt-4">Cargando configuración...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 flex items-center gap-2">
                    <Settings className="w-6 h-6" />
                    Configuración
                </h2>
                <p className="text-gray-600 mt-1">Gestiona la configuración de tu consorcio</p>
            </div>

            {/* Mensaje de éxito */}
            {successMessage && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-900">Éxito</AlertTitle>
                    <AlertDescription className="text-green-700">{successMessage}</AlertDescription>
                </Alert>
            )}

            {/* Mensaje de error */}
            {errorMessage && (
                <Alert className="border-red-200 bg-red-50">
                    <AlertCircle className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-900">Error</AlertTitle>
                    <AlertDescription className="text-red-700">{errorMessage}</AlertDescription>
                </Alert>
            )}

            {/* Sección de Nombre del Consorcio */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Nombre del Consorcio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="nombre" className="text-gray-700 font-medium">
                            Nombre
                        </Label>
                        <Input
                            id="nombre"
                            type="text"
                            placeholder="Ingresa el nuevo nombre del consorcio"
                            value={nombreInput}
                            onChange={handleNombreChange}
                            disabled={isSaving}
                            className="text-base"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            El nombre actual: <span className="font-semibold">{consorcio?.nombre}</span>
                        </p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            onClick={handleGuardar}
                            disabled={!hasChanges || isSaving || !nombreInput.trim()}
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Guardando...
                                </>
                            ) : (
                                'Guardar cambios'
                            )}
                        </Button>
                        <Button
                            onClick={handleCancelar}
                            disabled={!hasChanges || isSaving}
                            variant="outline"
                            className="text-gray-700 border-gray-300"
                        >
                            Cancelar
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Información adicional */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Información del Consorcio</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Código de invitación</p>
                            <p className="font-semibold text-gray-900">{consorcio?.codigoInvitacion}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Creado por</p>
                            <p className="font-semibold text-gray-900">{consorcio?.creadoPor}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Cantidad de miembros</p>
                            <p className="font-semibold text-gray-900">
                                {consorcio?.cantidadMiembros} / {consorcio?.maxPartners}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Tu rol</p>
                            <p className="font-semibold text-blue-600">{consorcio?.rol}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
