import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { pagoService } from '@/services/pagosService';
import { getAllSocios } from '@/services/sociosService';
import { getDebtForPartner } from '@/services/gastosService';
import { authService } from '@/services/authService';
import { BalanceSocio, getBalance } from '@/services/balanceService';

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
    dueDate?: string;
    status?: 'PAGADA' | 'PENDIENTE' | 'VENCIDA' | 'EN_MORA';
    daysOverdue?: number;
    daysInMorosity?: number;
    interestAccrued?: number;
    totalOwed?: number;
    expenseId?: number;
}

export default function usePagos() {
    const { consorcioId } = useParams<{ consorcioId: string }>();

    const currentYear = new Date().getFullYear();

    // Generate month names dynamically (no hardcoded month list)
    const months = Array.from({ length: 12 }).map((_, i) => {
        const monthIndex = i; // 0-based
        const date = new Date(2020, monthIndex, 1);
        const name = date.toLocaleDateString('es-ES', { month: 'long' });
        return { val: String(i + 1).padStart(2, '0'), name: name.charAt(0).toUpperCase() + name.slice(1) };
    });

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
    const [periodOptions, setPeriodOptions] = useState<string[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<string>(`${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`);
    const [sociosAlDia, setSociosAlDia] = useState(0);
    const [partnerBalances, setPartnerBalances] = useState<BalanceSocio[]>([]);

    const totalPagos = filteredPagosList.reduce((sum, p) => sum + (p.amount || 0), 0);

    const getSocioAlDia = async () => {
        if (!consorcioId) return;
        try {
            const cantidad = await pagoService.getSociosAlDia(consorcioId, selectedPeriod);
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

    const addMonthsToPeriod = (period: string, delta: number) => {
        const parts = period.split('-');
        const y = Number(parts[0]);
        const m = Number(parts[1]);
        const d = new Date(y, m - 1 + delta, 1);
        const ny = d.getFullYear();
        const nm = String(d.getMonth() + 1).padStart(2, '0');
        return `${ny}-${nm}-01`;
    };

    const fetchFilteredPagosByPeriod = async (period: string) => {
        if (!consorcioId) return;
        setLoading(true);
        try {
            const [data, balance] = await Promise.all([
                pagoService.getPagosByPeriod(consorcioId, period),
                getBalance(consorcioId, period)
            ]);
            setFilteredPagosList(Array.isArray(data) ? data : []);
            setPartnerBalances(balance.perPartnerBalance || []);
            setSociosAlDia(Math.max((balance.perPartnerBalance || []).length - (balance.countPartnersWithOverdueDebt || 0), 0));
        } catch (error) {
            console.error('Error fetching pagos by period:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailablePeriods = async () => {
        if (!consorcioId) return;
        try {
            const periods = await pagoService.getAvailablePeriods(consorcioId);
            setPeriodOptions(periods || []);
            // choose default period: current month if present, otherwise last available
            const currentPeriod = `${currentYear}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`;
            const defaultPeriod = (periods && periods.includes(currentPeriod)) ? currentPeriod : (periods && periods.length > 0 ? periods[periods.length - 1] : currentPeriod);
            setSelectedPeriod(defaultPeriod);
            await fetchFilteredPagosByPeriod(defaultPeriod);
        } catch (error) {
            console.error('Error fetching available periods:', error);
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
                await fetchAvailablePeriods();
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
        const periodFilter = `${year}-${month}-01`;
        setSelectedPeriod(periodFilter);
        fetchFilteredPagosByPeriod(periodFilter);
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

        const nuevoPago: any = {
            partnerId: currentSocio.id,
            debtId: Number(formData.expenseId),
            paymentDate: formData.paymentDate,
            period: formattedPeriod,
            paymentMethod: formData.paymentMethod,
            amount: Number((formData as any).amount) || 0,
            description: formData.description
        };

        setIsSubmittingPayment(true);
        try {
            const response: any = await pagoService.savePago(nuevoPago, paymentFile as File);
            if (response.ok) {
                await fetchAllPagos();
                await fetchFilteredPagosByPeriod(selectedPeriod);
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

    const handlePrevPeriod = async () => {
        const prev = addMonthsToPeriod(selectedPeriod, -1);
        setSelectedPeriod(prev);
        await fetchFilteredPagosByPeriod(prev);
    };

    const handleNextPeriod = async () => {
        const next = addMonthsToPeriod(selectedPeriod, 1);
        setSelectedPeriod(next);
        await fetchFilteredPagosByPeriod(next);
    };

    const getMontoPendientePorGasto = (gastoId: number, socioId: number): number => {
        const gasto = gastosList.find(g => g.id === gastoId);
        const currentSocio = sociosList.find(s => s.id === socioId);
        if (!gasto || !currentSocio) return 0;

        const targetExpenseId = gasto.expenseId ?? gasto.id;
        const montoPagado = allPagosList
            .filter(p => p.expenseId === targetExpenseId && p.partnerId === socioId)
            .reduce((sum, p) => sum + (p.amount || 0), 0);
        
        // CORRECCIÓN DEL BUG DE DOBLE DIVISIÓN:
        // El monto de la deuda ya está prorrateado en el backend, no se vuelve a dividir.
        // Además sumamos intereses de mora si existen.
        const montoTotal = gasto.totalOwed ?? gasto.amount;

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
        partnerBalances,
        months,
        currentYear,
        periodOptions,
        selectedPeriod,
        fetchFilteredPagosByPeriod, // 👈 Esta es la que tu PagosMain necesita
        handlePrevPeriod,
        handleNextPeriod,
        totalPagos,
        getSocioAlDia,
        fetchAllPagos,
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
