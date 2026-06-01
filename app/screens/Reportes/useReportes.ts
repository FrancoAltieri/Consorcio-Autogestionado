import { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import { BalanceDeConsorcio, getBalance } from '@/services/balanceService';

export default function useReportes() {
    const { consorcioId } = useParams<{ consorcioId: string }>();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [reporte, setReporte] = useState<BalanceDeConsorcio | null>(null);

    useEffect(() => {
        const loadReporte = async () => {
            if (!consorcioId) return;
            try {
                setLoading(true);
                const data = await getBalance(consorcioId);
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
    }, [consorcioId]);

    return {
        loading,
        error,
        reporte,
    } as const;
}
