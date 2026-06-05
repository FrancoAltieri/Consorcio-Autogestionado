import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { BalanceDeConsorcio, getBalance } from '@/services/balanceService';
import { pagoService } from '@/services/pagosService';
import { currentPeriod, ensurePeriodInList } from '@/utils/period';

export default function useReportes() {
    const { consorcioId } = useParams<{ consorcioId: string }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reporte, setReporte] = useState<BalanceDeConsorcio | null>(null);
    const [periodOptions, setPeriodOptions] = useState<string[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<string>(currentPeriod());

    const addMonthsToPeriod = (period: string, delta: number) => {
        const parts = period.split('-');
        const y = Number(parts[0]);
        const m = Number(parts[1]);
        const d = new Date(y, m - 1 + delta, 1);
        const ny = d.getFullYear();
        const nm = String(d.getMonth() + 1).padStart(2, '0');
        return `${ny}-${nm}-01`;
    };

    const handlePrevPeriod = () => setSelectedPeriod((p) => addMonthsToPeriod(p, -1));
    const handleNextPeriod = () => setSelectedPeriod((p) => addMonthsToPeriod(p, 1));

    useEffect(() => {
        const init = async () => {
            if (!consorcioId) return;
            setLoading(true);
            try {
                const periods = await pagoService.getAvailablePeriods(consorcioId);
                const current = currentPeriod();
                const finalPeriods = ensurePeriodInList(periods, current);
                setPeriodOptions(finalPeriods);
                setSelectedPeriod(current);
            } catch (err) {
                console.error('Error fetching periods for reportes', err);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, [consorcioId]);

    useEffect(() => {
        const loadReporte = async () => {
            if (!consorcioId || !selectedPeriod) return;
            try {
                setLoading(true);
                const data = await getBalance(consorcioId, selectedPeriod);
                setReporte(data);
                setError(null);
            } catch (err) {
                console.error('Error cargando reporte:', err);
                setError('Error al cargar los reportes');
            } finally {
                setLoading(false);
            }
        };
        loadReporte();
    }, [consorcioId, selectedPeriod]);

    return {
        loading,
        error,
        reporte,
        periodOptions,
        selectedPeriod,
        setSelectedPeriod,
        handlePrevPeriod,
        handleNextPeriod,
    } as const;
}
