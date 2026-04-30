import { gastosService, Gasto } from './gastosService';
import { pagoService, Pago } from './pagosService';
import { getAllSocios } from './sociosService';

export interface BalanceSocio {
    socioId: number;
    socioName: string;
    apartment: string;
    participation: number;
    pagosPagados: number;
    debeAportar: number;
    mora: number;
    estado: 'al dia' | 'debe' | 'a favor';
}

export interface ReporteSummary {
    totalGastos: number;
    totalPagos: number;
    diferencia: number;
    totalMora: number;
    balancePorSocio: BalanceSocio[];
}

export const reportesService = {
    async getReporteSummary(consorcioId: string | number): Promise<ReporteSummary> {
        try {
            const [socios, gastos, pagos] = await Promise.all([
                getAllSocios(consorcioId),
                gastosService.getAllGastos(consorcioId),
                pagoService.getAllPagos(consorcioId),
            ]);

            const totalGastos = gastos.reduce((sum, g) => sum + g.amount, 0);
            const totalPagos = pagos.reduce((sum, p) => sum + p.amount, 0);

            // 2. Calcular balance por socio
            const balancePorSocio = socios.map(socio => {
                // Pagos que efectivamente hizo este socio
                const pagosPagados = pagos
                    .filter(p => p.partnerId === socio.id)
                    .reduce((sum, p) => sum + p.amount, 0);

                // Lo que le corresponde pagar según su % de participación sobre los gastos totales
                const debeAportar = (totalGastos * socio.participation) / 100;

                // Saldo: lo que pagó menos lo que debía pagar
                const saldo = pagosPagados - debeAportar;

                let mora = 0;
                let estado: 'al dia' | 'debe' | 'a favor' = 'al dia';

                if (saldo < -1) { // Margen de 1 peso por redondeos
                    mora = Math.abs(saldo) * 0.05; // Aplicamos 5% de mora sobre la deuda
                    estado = 'debe';
                } else if (saldo > 1) {
                    estado = 'a favor';
                }

                return {
                    socioId: socio.id,
                    socioName: socio.name,
                    apartment: socio.apartment,
                    participation: socio.participation,
                    pagosPagados,
                    debeAportar,
                    mora,
                    estado,
                };
            });

            const totalMora = balancePorSocio.reduce((sum, b) => sum + b.mora, 0);

            return {
                totalGastos,
                totalPagos,
                diferencia: totalPagos - totalGastos,
                totalMora,
                balancePorSocio,
            };
        } catch (error) {
            console.error('Error al obtener reporte:', error);
            throw error;
        }
    },
};