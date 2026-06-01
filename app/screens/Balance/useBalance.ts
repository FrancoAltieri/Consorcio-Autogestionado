import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { BalanceDeConsorcio, getBalance } from '@/services/balanceService';

export default function useBalance() {
    const { consorcioId } = useParams<{ consorcioId: string }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [balanceData, setBalanceData] = useState<BalanceDeConsorcio | null>(null);

    useEffect(() => {
        const loadBalance = async () => {
            if (!consorcioId) return;
            try {
                setLoading(true);
                const balance = await getBalance(consorcioId);
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

    return {
        loading,
        error,
        balanceData,
        consorcioId,
    } as const;
}
