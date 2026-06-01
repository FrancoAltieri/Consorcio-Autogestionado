import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { getAllSocios } from '@/services/sociosService';
import { getAllGastos, saveGasto } from '@/services/gastosService';
import { authService } from '@/services/authService';

export interface Socio {
    id: number;
    userId: number;
    name: string;
}

export interface Gasto {
    id?: number;
    partnerId: number;
    date: string;
    description: string;
    category: string;
    amount: number;
    approved?: boolean;
}

export function useGastos() {
    const { consorcioId } = useParams<{ consorcioId: string }>();

    const initialFormData = {
        date: new Date().toISOString().split('T')[0],
        description: '',
        category: '',
        amount: '',
    };

    const initialFieldErrors = {
        date: '',
        description: '',
        category: '',
        amount: '',
    };

    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [filter, setFilter] = useState<'todos' | 'aprobados' | 'pendientes'>('todos');
    const [socios, setSocios] = useState<Socio[]>([]);
    const [gastos, setGastos] = useState<Gasto[]>([]);
    const [formData, setFormData] = useState(initialFormData);
    const [fieldErrors, setFieldErrors] = useState(initialFieldErrors);
    const [submitError, setSubmitError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const clearForm = () => {
        setFormData(initialFormData);
        setFieldErrors(initialFieldErrors);
        setSubmitError('');
    };

    const validateForm = () => {
        const amountValue = Number(formData.amount);
        const errors = {
            date: formData.date ? '' : 'La fecha es obligatoria.',
            description: formData.description.trim() ? '' : 'El concepto es obligatorio.',
            category: formData.category ? '' : 'La categoría es obligatoria.',
            amount: '',
        };

        if (!formData.amount.trim()) {
            errors.amount = 'El monto es obligatorio.';
        } else if (Number.isNaN(amountValue) || amountValue <= 0) {
            errors.amount = 'El monto debe ser mayor a 0.';
        }

        setFieldErrors(errors);
        return Object.values(errors).every((error) => error === '');
    };

    const handleFieldChange = (field: keyof typeof formData, value: string) => {
        setFormData((current) => ({ ...current, [field]: value }));
        if (fieldErrors[field]) setFieldErrors((current) => ({ ...current, [field]: '' }));
        if (submitError) setSubmitError('');
    };

    const closeDialog = () => {
        setShowDialog(false);
        clearForm();
    };

    const handleGetAllGastos = async () => {
        if (!consorcioId) return;
        try {
            const gastosData = await getAllGastos(consorcioId);
            setGastos(gastosData);
        } catch (error) {
            console.error('Error al obtener gastos:', error);
        }
    };

    const handleSaveGastos = async () => {
        if (!consorcioId || !validateForm()) return;

        const userId = authService.getUserId();
        const currentSocio = socios.find((s) => s.userId === userId);
        if (!currentSocio) {
            setSubmitError('Socio no encontrado.');
            return;
        }

        const nuevoGasto = {
            amount: parseFloat(formData.amount),
            description: formData.description.trim(),
            date: formData.date,
            consorcioId: Number(consorcioId),
            partnerId: currentSocio.id,
            category: formData.category,
        };

        try {
            const response: any = await saveGasto(nuevoGasto);
            if (response.ok) {
                await handleGetAllGastos();
                closeDialog();
                setSuccessMessage('Gasto registrado correctamente.');
                setShowSuccessMessage(true);
            } else {
                const errorData = await response.json().catch(() => ({}));
                setSubmitError(errorData?.message || 'No se pudo guardar el gasto.');
            }
        } catch (error) {
            setSubmitError('Error de conexión al guardar.');
        }
    };

    useEffect(() => {
        const initData = async () => {
            if (!consorcioId) return;
            setLoading(true);
            try {
                const sociosData = await getAllSocios(consorcioId);
                setSocios(sociosData);
                await handleGetAllGastos();
            } finally {
                setLoading(false);
            }
        };
        initData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consorcioId]);

    useEffect(() => {
        if (!successMessage) return;
        const hideTimeoutId = window.setTimeout(() => setShowSuccessMessage(false), 2600);
        const clearTimeoutId = window.setTimeout(() => setSuccessMessage(''), 3200);
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

    const totalGastosMonto = filteredGastos.filter((g) => g.approved).reduce((sum, g) => sum + g.amount, 0);

    return {
        loading,
        showDialog,
        setShowDialog,
        filter,
        setFilter,
        socios,
        gastos,
        filteredGastos,
        totalGastosMonto,
        formData,
        fieldErrors,
        submitError,
        successMessage,
        showSuccessMessage,
        handleFieldChange,
        closeDialog,
        handleSaveGastos,
    } as const;
}

export default useGastos;
