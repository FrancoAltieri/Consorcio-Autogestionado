import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { BalanceDeConsorcio, getBalance } from '@/services/balanceService';
import { pagoService } from '@/services/pagosService';
import { currentPeriod, ensurePeriodInList } from '@/utils/period';

export default function useBalance() {
    const { consorcioId } = useParams<{ consorcioId: string }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [balanceData, setBalanceData] = useState<BalanceDeConsorcio | null>(null);
    const [periodOptions, setPeriodOptions] = useState<string[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<string>(currentPeriod());

    useEffect(() => {
        const loadBalance = async () => {
            if (!consorcioId) return;
            try {
                setLoading(true);
                const periods = await pagoService.getAvailablePeriods(consorcioId);
                const current = currentPeriod();
                const finalPeriods = ensurePeriodInList(periods, current);
                setPeriodOptions(finalPeriods);
                setSelectedPeriod(current);
                const balance = await getBalance(consorcioId, current);
                setBalanceData(balance);
                setError(null);
            } catch (err) {
                console.error('Error cargando balance:', err);
                setError('Error al obtener el balance del consorcio');
            } finally {
                setLoading(false);
            }
        };

        loadBalance();
    }, [consorcioId]);

    useEffect(() => {
        if (!consorcioId || !selectedPeriod) return;
        const load = async () => {
            setLoading(true);
            try {
                const balance = await getBalance(consorcioId, selectedPeriod);
                setBalanceData(balance);
            } catch (err) {
                console.error('Error cargando balance por período:', err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [consorcioId, selectedPeriod]);

    const addMonthsToPeriod = (period: string, delta: number) => {
        const parts = period.split('-');
        const y = Number(parts[0]);
        const m = Number(parts[1]);
        const d = new Date(y, m - 1 + delta, 1);
        const ny = d.getFullYear();
        const nm = String(d.getMonth() + 1).padStart(2, '0');
        return `${ny}-${nm}-01`;
    };

    const handlePrevPeriod = async () => {
        const prev = addMonthsToPeriod(selectedPeriod, -1);
        setSelectedPeriod(prev);
    };

    const handleNextPeriod = async () => {
        const next = addMonthsToPeriod(selectedPeriod, 1);
        setSelectedPeriod(next);
    };

    return {
        loading,
        error,
        balanceData,
        consorcioId,
        periodOptions,
        selectedPeriod,
        handlePrevPeriod,
        handleNextPeriod,
        setSelectedPeriod,
    } as const;
}
