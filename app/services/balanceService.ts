import { authService } from './authService';
import { getAllSocios } from './sociosService';


const baseUrl = import.meta.env.VITE_API_BASE_URL + "/balance";

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authService.getToken()}`
});

export interface BalanceSocio {
    partnerId: number;    
    name: string;
    payments: number;
    debt: number;
    penaltyForLatePayment: number;
    outstandingDebt: number;
    overdueDebt: number;
    moroseDebt: number;
    pendingDebts: number;
    overdueDebts: number;
    moroseDebts: number;
    debtStatus: 'PAGADA' | 'PENDIENTE' | 'VENCIDA' | 'EN_MORA';
    nextDueDate?: string | null;
    oldestDueDate?: string | null;
}

export interface BalanceDeConsorcio {
    totalPayments: number;
    totalExpenses: number;
    diferencia: number;
    totalMora: number;
    totalOverdueDebt: number;
    totalMoroseDebt: number;
    countExpenses: number;
    countPayments: number;
    countDebtsPending: number;
    countOverdueDebts: number;
    countMoroseDebts: number;
    countPartnersWithDebt: number;
    countPartnersWithOverdueDebt: number;
    countPartnersInMorosity: number;
    morosityRate: number;
    perPartnerBalance: BalanceSocio[];
}

export async function getBalance(consorcioId: string | number, period?: string) {
        const params = new URLSearchParams({ consorcioId: String(consorcioId) });
        if (period) params.set('period', period);
        const url = `${baseUrl}?${params.toString()}`;
        const response = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Error al obtener el balance del consorcio");
        }

        const balance = await response.json();
        const totalPayments = Number(balance.totalPayments ?? 0);
        const totalExpenses = Number(balance.totalExpenses ?? 0);
        const diferencia = totalPayments - totalExpenses;

        // Resolve partner names by fetching all socios once
        const socios = await getAllSocios(consorcioId);
        const perPartner = (balance.perPartnerBalance || []).map((balanceSocio: any) => {
                        const socio = socios.find((s: any) => String(s.id) === String(balanceSocio.partnerId));
                        return {
                                partnerId: balanceSocio.partnerId,
                                name: socio ? socio.name.split(' ')[0] : 'Socio',
                                payments: Number(balanceSocio.payments ?? 0),
                                debt: Number(balanceSocio.debt ?? 0),
                                penaltyForLatePayment: Number(balanceSocio.penaltyForLatePayment ?? 0),
                                outstandingDebt: Number(balanceSocio.outstandingDebt ?? 0),
                                overdueDebt: Number(balanceSocio.overdueDebt ?? 0),
                                moroseDebt: Number(balanceSocio.moroseDebt ?? 0),
                                pendingDebts: Number(balanceSocio.pendingDebts ?? 0),
                                overdueDebts: Number(balanceSocio.overdueDebts ?? 0),
                                moroseDebts: Number(balanceSocio.moroseDebts ?? 0),
                                debtStatus: balanceSocio.debtStatus ?? 'PAGADA',
                                nextDueDate: balanceSocio.nextDueDate ?? null,
                                oldestDueDate: balanceSocio.oldestDueDate ?? null,
                                gastosRealizados: Number(balanceSocio.gastosRealizados ?? 0)
                        };
                });

        const totalMora = Number(balance.totalMora ?? 0);

        return {
                totalPayments: totalPayments,
                totalExpenses: totalExpenses,
                diferencia: diferencia,
                totalMora: totalMora,
                totalOverdueDebt: Number(balance.totalOverdueDebt ?? 0),
                totalMoroseDebt: Number(balance.totalMoroseDebt ?? totalMora),
                countExpenses: Number(balance.countExpenses ?? 0),
                countPayments: Number(balance.countPayments ?? 0),
                countDebtsPending: Number(balance.countDebtsPending ?? 0),
                countOverdueDebts: Number(balance.countOverdueDebts ?? 0),
                countMoroseDebts: Number(balance.countMoroseDebts ?? 0),
                countPartnersWithDebt: Number(balance.countPartnersWithDebt ?? 0),
                countPartnersWithOverdueDebt: Number(balance.countPartnersWithOverdueDebt ?? 0),
                countPartnersInMorosity: Number(balance.countPartnersInMorosity ?? 0),
                morosityRate: Number(balance.morosityRate ?? 0),
                perPartnerBalance: perPartner
        };
        }
