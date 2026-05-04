import { authService } from './authService';
import { getSocioById } from './sociosService';


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
}

export interface BalanceDeConsorcio {
    totalPayments: number;
    totalExpenses: number;
    diferencia: number;
    totalMora: number;
    perPartnerBalance: BalanceSocio[];
}

export async function getBalance(consorcioId: string | number) {
        const url = `${baseUrl}?consorcioId=${consorcioId}`;
        const response = await fetch(url, {
                method: "GET",
                headers: getAuthHeaders()
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Error al obtener el balance del consorcio");
        }

        const balance = await response.json()
        const diferencia =  balance.totalPayments - balance.totalExpenses;
        return {
                totalPayments: balance.totalPayments,
                totalExpenses: balance.totalExpenses,
                diferencia: diferencia,
                totalMora: diferencia >= 0 ? 0 : diferencia*(-1.05),
                perPartnerBalance: balance.perPartnerBalance.map(async (balanceSocio: { partnerId: string | number; payments: number; debt: number; penaltyForLatePayment: number; }) => {
                                const socio = await getSocioById(balanceSocio.partnerId);
                                return {
                                        partnerId: balanceSocio.partnerId,
                                        name: socio.name.split(' ')[0],
                                        payments: balanceSocio.payments,
                                        debt: balanceSocio.debt,
                                        penaltyForLatePayment: balanceSocio.penaltyForLatePayment
                                };
                        }
                )};
        }