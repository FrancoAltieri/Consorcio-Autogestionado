import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { pagoService } from '@/services/pagosService';
import { getAllSocios } from '@/services/sociosService';
import { getDebtForPartner } from '@/services/gastosService';
import { authService } from '@/services/authService';

export interface Pago {
    id?: number;
    partnerId: number;
    expenseId?: number;
    amount: number;
    period: string;
    paymentMethod?: string;
    paymentDate: string;
    receiptUrl?: string;
}

export interface Socio {
    id: number;
    userId?: number;
    name: string;
    apartment?: string;
    participation?: number;
}

export interface Gasto {
    id: number;
    description: string;
    amount: number;
}

export default function usePagos() {
    const { consorcioId } = useParams<{ consorcioId: string }>();

    const currentYear = new Date().getFullYear();
    const months = [
        { val: '01', name: 'Enero' }, { val: '02', name: 'Febrero' }, { val: '03', name: 'Marzo' },
        { val: '04', name: 'Abril' }, { val: '05', name: 'Mayo' }, { val: '06', name: 'Junio' },
        { val: '07', name: 'Julio' }, { val: '08', name: 'Agosto' }, { val: '09', name: 'Septiembre' },
        { val: '10', name: 'Octubre' }, { val: '11', name: 'Noviembre' }, { val: '12', name: 'Diciembre' }
    ];

    const initialFormData = {
        expenseId: '',
        paymentDate: new Date().toISOString().split('T')[0],
        selectedMonth: (new Date().getMonth() + 1).toString().padStart(2, '0'),
        selectedYear: currentYear.toString(),
        paymentMethod: '',
        description: ''
    };

    const [showDialog, setShowDialog] = useState(false);
    const [allPagosList, setAllPagosList] = useState<Pago[]>([]);
    const [filteredPagosList, setFilteredPagosList] = useState<Pago[]>([]);
    const [sociosList, setSociosList] = useState<Socio[]>([]);
    const [gastosList, setGastosList] = useState<Gasto[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSubmittingPayment, setIsSubmittingPayment] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [formData, setFormData] = useState(initialFormData);
    const [paymentFile, setPaymentFile] = useState<File | null>(null);
    const [selectedFilterMonth, setSelectedFilterMonth] = useState((new Date().getMonth() + 1).toString().padStart(2, '0'));
    const [selectedFilterYear, setSelectedFilterYear] = useState(currentYear.toString());
    const [sociosAlDia, setSociosAlDia] = useState(0);

    const totalPagos = filteredPagosList.reduce((sum, p) => sum + (p.amount || 0), 0);

    const getSocioAlDia = async () => {
        if (!consorcioId) return;
        try {
            const cantidad = await pagoService.getSociosAlDia(consorcioId);
            setSociosAlDia(cantidad || 0);
        } catch (error) {
            console.error('Error fetching socios al dia:', error);
        }
    };

    const fetchAllPagos = async () => {
        if (!consorcioId) return;
        setLoading(true);
        try {
            const data = await pagoService.getAllPagos(consorcioId);
            setAllPagosList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching pagos:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchFilteredPagos = async (month: string, year: string) => {
        if (!consorcioId) return;
        setLoading(true);
        try {
            const periodFilter = `${year}-${month}-01`;
            const data = await pagoService.getPagosByPeriod(consorcioId, periodFilter);
            setFilteredPagosList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching pagos by period:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchSocios = async () => {
        if (!consorcioId) return [] as Socio[];
        try {
            const data = await getAllSocios(consorcioId);
            const socios = Array.isArray(data) ? data : [];
            setSociosList(socios);
            return socios;
        } catch (error) {
            console.error('Error fetching socios', error);
        }
        return [] as Socio[];
    };

    const fetchGastos = async (currentPartnerId?: number) => {
        if (!consorcioId || !currentPartnerId) return;
        try {
            const data = await getDebtForPartner(currentPartnerId, consorcioId);
            setGastosList(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching gastos', error);
        }
    };

    useEffect(() => {
        const initData = async () => {
            setLoading(true);
            try {
                const socios = await fetchSocios();
                const userId = authService.getUserId();
                const currentSocio = socios.find((socio) => String(socio.userId) === String(userId) || socio.userId === userId);

                if (currentSocio) {
                    await fetchGastos(currentSocio.id);
                } else {
                    setGastosList([]);
                }

                await fetchAllPagos();
                await fetchFilteredPagos(selectedFilterMonth, selectedFilterYear);
                await getSocioAlDia();
            } finally {
                setLoading(false);
            }
        };

        initData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [consorcioId]);

    useEffect(() => {
        if (!submitError) return;
        const t = window.setTimeout(() => setSubmitError(''), 4000);
        return () => window.clearTimeout(t);
    }, [submitError]);

    const handleFieldChange = (field: keyof typeof formData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        setSubmitError('');
    };

    const handleFileChange = (file: File | null) => {
        setPaymentFile(file);
        setSubmitError('');
    };

    const handleFilterChange = (month: string, year: string) => {
        setSelectedFilterMonth(month);
        setSelectedFilterYear(year);
        fetchFilteredPagos(month, year);
    };

    const handleAddPago = async () => {
        if (isSubmittingPayment) return;
        const userId = authService.getUserId();
        if (!formData.paymentMethod || !userId || !formData.expenseId || !paymentFile) {
            setSubmitError('Por favor, completa los campos obligatorios.');
            return;
        }

        const currentSocio = sociosList.find(s => Number(s.userId) === Number(userId) || s.userId === userId);
        if (!currentSocio) {
            setSubmitError('Socio no encontrado.');
            return;
        }

        const formattedPeriod = `${formData.selectedYear}-${formData.selectedMonth}-01`;

        const nuevoPago: Partial<Pago> = {
            partnerId: currentSocio.id,
            expenseId: Number(formData.expenseId),
            paymentDate: formData.paymentDate,
            period: formattedPeriod,
            paymentMethod: formData.paymentMethod,
            amount: Number((formData as any).amount) || 0,
            // description optionally included
        };

        setIsSubmittingPayment(true);
        try {
            const response: any = await pagoService.savePago(nuevoPago, paymentFile as File);
            if (response.ok) {
                await fetchAllPagos();
                await fetchFilteredPagos(selectedFilterMonth, selectedFilterYear);
                setShowDialog(false);
                setFormData(initialFormData);
                setPaymentFile(null);
                await getSocioAlDia();
            } else {
                const errorData = await response.json().catch(() => ({}));
                setSubmitError(errorData?.message || 'Error al guardar el pago.');
            }
        } catch (error) {
            setSubmitError('Error de conexión.');
        } finally {
            setIsSubmittingPayment(false);
        }
    };

    const formatPeriod = (periodDate: string) => {
        if (!periodDate) return '';
        const parts = periodDate.split('-');
        const date = new Date(Number(parts[0]), Number(parts[1]) - 1);
        const month = date.toLocaleDateString('es-ES', { month: 'long' });
        return month.charAt(0).toUpperCase() + month.slice(1) + ' ' + parts[0];
    };

    const getMontoPendientePorGasto = (gastoId: number, socioId: number): number => {
        const gasto = gastosList.find(g => g.id === gastoId);
        const currentSocio = sociosList.find(s => s.id === socioId);
        if (!gasto || !currentSocio) return 0;

        const montoPagado = allPagosList
            .filter(p => p.expenseId === gastoId && p.partnerId === socioId)
            .reduce((sum, p) => sum + (p.amount || 0), 0);
        const userParticipation = currentSocio.participation || 0;
        const montoTotal = (gasto.amount * userParticipation) / 100;

        return Math.max(0, montoTotal - montoPagado);
    };

    return {
        showDialog,
        setShowDialog,
        allPagosList,
        filteredPagosList,
        sociosList,
        gastosList,
        loading,
        isSubmittingPayment,
        submitError,
        formData,
        paymentFile,
        selectedFilterMonth,
        selectedFilterYear,
        sociosAlDia,
        months,
        currentYear,
        totalPagos,
        getSocioAlDia,
        fetchAllPagos,
        fetchFilteredPagos,
        fetchSocios,
        fetchGastos,
        handleFieldChange,
        handleFileChange,
        handleFilterChange,
        handleAddPago,
        formatPeriod,
        getMontoPendientePorGasto
    } as const;
}
