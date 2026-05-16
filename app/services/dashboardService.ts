import { gastosService, Gasto } from './gastosService';
import { pagoService, Pago } from './pagosService'; // Asegurate que el nombre del archivo sea el que unificamos
import { getAllSocios } from './sociosService';
import { BalanceDeConsorcio, getBalance } from '@/services/balanceService';

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
    totalSocios: number;
    socios: Socio[];
    gastos: Gasto[];
    pagos: Pago[];
}

export const dashboardService = {
    async getDashboardSummary(consorcioId: string | number): Promise<DashboardSummary> {
        try {
            
            const balance = await getBalance(consorcioId);

            const totalGastos = balance.totalExpenses;
            const totalPagos = balance.totalPayments;

            // Obtenemos todo en paralelo pasando el consorcioId a todos
            const [socios, gastos, pagos] = await Promise.all([
                getAllSocios(consorcioId),
                gastosService.getAllGastos(consorcioId),
                pagoService.getAllPagos(consorcioId), // Ahora sí usamos el filtro del backend
            ]);


            // Lógica de Mora (falta desarrollar bien esta parte)
            // Comparamos lo que pagó cada socio vs lo que le correspondía por participación
            const sociosEnMora = balance.perPartnerBalance.filter(balanceSocio => {
                return balanceSocio.penaltyForLatePayment > 0;
            }).length;

            return {
                totalGastos,
                totalPagos,
                gastosAprobados: gastos.length,
                gastosPendientes: 0,
                sociosEnMora,
                totalSocios: balance.perPartnerBalance.length,
                socios,
                gastos,
                pagos,
            };
        } catch (error) {
            console.error('Error al obtener resumen del dashboard:', error);
            throw error;
        }
    },
};