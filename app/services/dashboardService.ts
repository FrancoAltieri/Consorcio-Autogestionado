import { authService } from './authService';
import { Gasto } from './gastosService';
import { Pago } from './pagosService';

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

export interface DashboardSummary {
    totalGastos: number;
    totalPagos: number;
    gastosAprobados: number;
    gastosPendientes: number;
    sociosEnMora: number;
    sociosConDeudaVencida: number;
    totalSocios: number;
    deudaTotalVencida: number;
    deudaTotalEnMora: number;
    porcentajeSociosMorosos: number;
    totalInterestAccrued: number;
    socios: Socio[];
    gastos: Gasto[];
    pagos: Pago[];
}

export const dashboardService = {
    async getDashboardSummary(consorcioId: string | number, period?: string): Promise<DashboardSummary> {
        try {
            const baseUrl = import.meta.env.VITE_API_BASE_URL + '/dashboard';
            const params = new URLSearchParams({ consorcioId: String(consorcioId) });
            if (period) params.set('period', period);

            const response = await fetch(`${baseUrl}?${params.toString()}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authService.getToken()}`,
                },
            });

            if (!response.ok) throw new Error('Error al obtener resumen del dashboard');

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error al obtener resumen del dashboard:', error);
            throw error;
        }
    },
};
