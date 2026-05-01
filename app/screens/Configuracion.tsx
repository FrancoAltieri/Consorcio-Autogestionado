import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle, Loader2, Settings, Users, Code, User } from 'lucide-react';
import { consorcioService, ConsorcioData } from '../services/consorcioService';
import { useTheme } from '@/contexts/ThemeContext';

export function Configuracion() {
    const { consorcioId } = useParams<{ consorcioId: string }>();
    const navigate = useNavigate();
    const { theme } = useTheme();

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
            <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
                    <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
                    <div className="relative z-10 flex items-center gap-4">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30`}>
                            <Settings className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
                                Configuración
                            </h2>
                            <p className="text-gray-600 text-xl font-medium">Gestiona la configuración de tu consorcio</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="relative">
                        <div className={`absolute inset-0 bg-gradient-to-r ${theme.iconGradient} opacity-20 blur-2xl animate-pulse`}></div>
                        <Loader2 className={`w-16 h-16 animate-spin text-transparent bg-gradient-to-r ${theme.iconGradient} bg-clip-text relative z-10`} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header Section  */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
                <div className={`absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-5 blur-3xl rounded-full animate-pulse delay-1000`}></div>

                <div className="relative z-10 flex items-center justify-between">
                    <div>
                        <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
                            Configuración
                        </h2>
                        <p className="text-gray-600 text-xl font-medium">Gestiona la configuración y parámetros de tu consorcio</p>
                    </div>
                    <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30`}>
                        <Settings className="w-8 h-8 text-white" />
                    </div>
                </div>
            </div>

            {/* Mensaje de éxito */}
            {successMessage && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="bg-gradient-to-br from-green-50 via-white to-green-50/30 border border-green-200/50 rounded-2xl p-6 flex items-start gap-4 shadow-xl shadow-green-100/50 backdrop-blur-sm">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg flex-shrink-0">
                            <CheckCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-green-900">Éxito</p>
                            <p className="text-sm text-green-700 mt-1">{successMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Mensaje de error */}
            {errorMessage && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="bg-gradient-to-br from-red-50 via-white to-red-50/30 border border-red-200/50 rounded-2xl p-6 flex items-start gap-4 shadow-xl shadow-red-100/50 backdrop-blur-sm">
                        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg flex-shrink-0">
                            <AlertCircle className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <p className="text-base font-bold text-red-900">Error</p>
                            <p className="text-sm text-red-700 mt-1">{errorMessage}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Sección de Nombre del Consorcio */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                                Nombre del Consorcio
                            </h3>
                            <p className="text-base text-gray-500 mt-1">Edita el nombre de tu consorcio</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="nombre" className="text-base font-bold text-gray-900">
                                Nombre del Consorcio
                            </Label>
                            <Input
                                id="nombre"
                                type="text"
                                placeholder="Ej: Consorcio Centro"
                                value={nombreInput}
                                onChange={handleNombreChange}
                                disabled={isSaving}
                                className="rounded-xl text-base py-3 border-gray-200 focus:border-blue-500 transition-colors"
                            />
                            <p className="text-xs text-gray-500 mt-2">
                                Nombre actual: <span className="font-bold text-gray-700">{consorcio?.nombre}</span>
                            </p>
                        </div>

                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                            <Button
                                onClick={handleGuardar}
                                disabled={!hasChanges || isSaving || !nombreInput.trim()}
                                className={`px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r ${theme.iconGradient} text-white shadow-lg hover:shadow-xl transition-all duration-300 ${!hasChanges || isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                                className="px-6 py-2.5 rounded-xl font-semibold border-gray-200 hover:bg-gray-50 transition-all duration-300"
                            >
                                Cancelar
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Información del Consorcio */}
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className={`text-2xl font-bold bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>
                                Información del Consorcio
                            </h3>
                            <p className="text-base text-gray-500 mt-1">Detalles y configuración del consorcio</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Código de Invitación */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Código de Invitación</p>
                                    <p className="text-lg font-bold text-blue-950 font-mono break-all">{consorcio?.codigoInvitacion}</p>
                                </div>
                                <div className="p-2 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-md flex-shrink-0">
                                    <Code className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Creado por */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-purple-700 uppercase tracking-wider mb-2">Creado por</p>
                                    <p className="text-lg font-bold text-purple-950">{consorcio?.creadoPor}</p>
                                </div>
                                <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-md flex-shrink-0">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Cantidad de Miembros */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2">Cantidad de Miembros</p>
                                    <div className="flex items-baseline gap-2">
                                        <p className="text-3xl font-extrabold text-green-600">{consorcio?.cantidadMiembros}</p>
                                        <p className="text-sm text-green-600 font-bold">/ {consorcio?.maxPartners} máx</p>
                                    </div>
                                </div>
                                <div className="p-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-md flex-shrink-0">
                                    <Users className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>

                        {/* Tu Rol */}
                        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-100 p-6">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <p className="text-xs font-bold text-orange-700 uppercase tracking-wider mb-2">Tu Rol</p>
                                    <p className="text-lg font-bold text-orange-950">{consorcio?.rol === 'ADMIN' ? '🛡️ Administrador' : '👥 Miembro'}</p>
                                </div>
                                <div className={`p-2 rounded-xl bg-gradient-to-br ${consorcio?.rol === 'ADMIN' ? 'from-orange-500 to-amber-600' : 'from-green-500 to-emerald-600'} shadow-md flex-shrink-0`}>
                                    <Settings className="w-5 h-5 text-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
