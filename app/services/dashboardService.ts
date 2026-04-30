import { gastosService, Gasto } from './gastosService';
import { pagoService, Pago } from './pagosService'; // Asegurate que el nombre del archivo sea el que unificamos
import { getAllSocios } from './sociosService';

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
            // Obtenemos todo en paralelo pasando el consorcioId a todos
            const [socios, gastos, pagos] = await Promise.all([
                getAllSocios(consorcioId),
                gastosService.getAllGastos(consorcioId),
                pagoService.getAllPagos(consorcioId), // Ahora sí usamos el filtro del backend
            ]);

            // Calculamos los totales directamente (ya vienen filtrados de la DB)
            const totalGastos = gastos.reduce((sum, g) => sum + g.amount, 0);
            const totalPagos = pagos.reduce((sum, p) => sum + p.amount, 0);

            // Lógica de Mora (falta desarrollar bien esta parte)
            // Comparamos lo que pagó cada socio vs lo que le correspondía por participación
            const sociosEnMora = socios.filter(s => {
                const pagosSocio = pagos.filter(p => p.partnerId === s.id);
                const totalPagoSocio = pagosSocio.reduce((sum, p) => sum + p.amount, 0);

                // El socio debe aportar su % de los gastos totales
                const debeAportar = (totalGastos * s.participation) / 100;

                return totalPagoSocio < debeAportar;
            }).length;

            return {
                totalGastos,
                totalPagos,
                gastosAprobados: gastos.length,
                gastosPendientes: 0,
                sociosEnMora,
                totalSocios: socios.length,
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