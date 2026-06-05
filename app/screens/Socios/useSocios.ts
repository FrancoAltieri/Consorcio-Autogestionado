import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { getAllSocios, deleteSocio, updateSocio } from '@/services/sociosService';
import { consorcioService } from '@/services/consorcioService';
import { authService } from '@/services/authService';

export interface Socio {
    id: number;
    userId: number;
    consorcioId: number;
    name: string;
    email: string;
    apartment: string;
    participation: number;
    role: string;
}

export function useSocios() {
    const { consorcioId } = useParams<{ consorcioId: string }>();
    const navigate = useNavigate();

    const [consorcio, setConsorcio] = useState<any>(null);
    const [copied, setCopied] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

    const initialFormData = {
        apartment: '',
        role: 'MEMBER',
    };

    const initialFieldErrors = {
        apartment: '',
        role: '',
    };

    const [showDialog, setShowDialog] = useState(false);
    const [sociosList, setSociosList] = useState<Socio[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingSocio, setEditingSocio] = useState<Socio | null>(null);
    const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
    const [submitError, setSubmitError] = useState('');
    const [formData, setFormData] = useState(initialFormData);

    const fetchConsorcio = async () => {
        if (!consorcioId) return;
        try {
            const data = await consorcioService.getConsorcioById(consorcioId);
            setConsorcio(data);
        } catch (error) {
            console.error('Error al obtener consorcio:', error);
        }
    };

    const fetchSocios = async () => {
        if (!consorcioId) return;
        setLoading(true);
        try {
            const data = await getAllSocios(consorcioId);
            setSociosList(Array.isArray(data) ? data : []);

            const userId = authService.getUserId();
            const currentSocio = Array.isArray(data) ? data.find((socio: Socio) => socio.userId === userId) : null;
            setCurrentUserRole(currentSocio ? currentSocio.role : null);
        } catch (error) {
            console.error('Error al obtener los socios:', error);
            setSociosList([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConsorcio();
        fetchSocios();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consorcioId]);

    const clearForm = () => {
        setFormData(initialFormData);
        setFieldErrors(initialFieldErrors);
        setSubmitError('');
    };

    const validateForm = () => {
        const errors = {
            apartment: formData.apartment.trim() ? '' : 'El departamento es obligatorio.',
            role: '',
        };

        setFieldErrors(errors);
        return Object.values(errors).every((value) => value === '');
    };

    const handleFieldChange = (field: keyof typeof formData, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));
        if (fieldErrors[field]) setFieldErrors((current) => ({ ...current, [field]: '' }));
        if (submitError) setSubmitError('');
    };

    const openEditDialog = (socio: Socio) => {
        setEditingSocio(socio);
        setFormData({ apartment: socio.apartment || '', role: socio.role });
        setShowDialog(true);
    };

    const closeDialog = () => {
        setShowDialog(false);
        setEditingSocio(null);
        clearForm();
    };

    const handleDeleteSocio = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este socio?')) return;
        try {
            await deleteSocio(id);

            const userId = authService.getUserId();
            const socioEliminado = sociosList.find((socio) => socio.id === id);
            if (socioEliminado && socioEliminado.userId === userId) {
                navigate('/mis-consorcios');
                return;
            }

            fetchSocios();
        } catch (error) {
            console.error('Error al eliminar el socio:', error);
        }
    };

    const handlePromoteSocio = async (id: number) => {
        if (!confirm('¿Estás seguro de promover a este socio a Administrador?')) return;
        try {
            const socio = sociosList.find((s) => s.id === id);
            if (!socio) {
                setSubmitError('Socio no encontrado.');
                return;
            }

            const socioActualizado = {
                id: socio.id,
                apartment: socio.apartment || '',
                participation: socio.participation || 50,
                role: 'ADMIN',
            };

            const response: any = await updateSocio(socioActualizado);
            if (response && typeof response.ok !== 'undefined' && !response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setSubmitError(errorData.message || 'No se pudo promover el socio.');
                return;
            }

            await fetchSocios();
        } catch (error) {
            setSubmitError('Error de conexión al promover el socio.');
        }
    };

    const handleUpdateSocio = async () => {
        if (!editingSocio || !validateForm()) return;

        const socioActualizado = {
            id: editingSocio.id,
            apartment: formData.apartment.trim(),
            participation: 50,
            role: formData.role,
        };

        try {
            const response: any = await updateSocio(socioActualizado);
            // keep original behavior: if response.ok then success
            if (response && typeof response.ok !== 'undefined' && !response.ok) {
                const errorData = await response.json().catch(() => ({}));
                setSubmitError(errorData.message || 'No se pudo actualizar el socio.');
                return;
            }
            await fetchSocios();
            closeDialog();
        } catch (error) {
            setSubmitError('Error de conexión al actualizar el socio.');
        }
    };

    const copyToClipboard = async () => {
        if (consorcio?.codigoInvitacion) {
            await navigator.clipboard.writeText(consorcio.codigoInvitacion);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return {
        consorcio,
        sociosList,
        loading,
        copied,
        currentUserRole,
        showDialog,
        setShowDialog,
        editingSocio,
        fieldErrors,
        submitError,
        formData,
        fetchSocios,
        openEditDialog,
        closeDialog,
        handleFieldChange,
        handleDeleteSocio,
        handlePromoteSocio,
        handleUpdateSocio,
        copyToClipboard,
    } as const;
}

export default useSocios;
