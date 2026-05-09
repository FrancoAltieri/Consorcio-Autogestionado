import { authService } from "./authService";

const baseUrl = import.meta.env.VITE_API_BASE_URL + "/payment";

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authService.getToken()}`
});

export enum PaymentMethod {
    CASH = 'CASH',
    TRANSFER = 'TRANSFER',
    CHECK = 'CHECK',
    DEBIT_CARD = 'DEBIT_CARD',
    CREDIT_CARD = 'CREDIT_CARD',
}

export interface Pago {
    id?: number;
    partnerId: number;
    expenseId: number;
    paymentDate: string;
    period: string;
    amount: number;
    paymentMethod: PaymentMethod | string;
    description?: string;
}

export const pagoService = {

    async getAllPagos(consorcioId: string | number): Promise<Pago[]> {
        const url = `${baseUrl}/all?consorcioId=${consorcioId}`;

        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error al obtener los pagos de este consorcio");

        const data = await response.json();
        return Array.isArray(data.response) ? data.response : [];
    },

    async getPagosByPeriod(consorcioId: string | number, period: string): Promise<Pago[]> {
        const url = `${baseUrl}/period?consorcioId=${consorcioId}&period=${period}`;

        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error al obtener los pagos por período");

        const data = await response.json();
        console.log("Pagos por período:", data);
        return Array.isArray(data.response) ? data.response : [];
    },

    async savePago(pago: Partial<Pago>, file?: File) {
        const url = `${baseUrl}/save`;

        if (!file) {
            throw new Error("El archivo es obligatorio para guardar un pago");
        }

        const formData = new FormData();
        formData.append("paymentDto", new Blob([JSON.stringify(pago)], { type: "application/json" }));
        formData.append("file", file);

        return fetch(url, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authService.getToken()}`
            }, 
            body: formData
        });
    },

    async getSociosAlDia(consorcioId: string | number): Promise<number> {
        const url = `${baseUrl}/socios-al-dia?consorcioId=${consorcioId}`;

        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error al obtener la cantidad de socios al día");

        const data = await response.json();
        return data.amount || 0;
    }

    // Te dejo los métodos comentados por si los necesitás habilitar luego
    /*
    async deletePago(id: number) {
        const url = `${baseUrl}/delete/${id}`;
        return fetch(url, {
            method: "DELETE",
            headers: getAuthHeaders()
        });
    },

    async updatePago(pago: Pago) {
        const url = `${baseUrl}/edit`;
        return fetch(url, {
            method: "PUT",
            headers: getAuthHeaders(),
            body: JSON.stringify(pago)
        });
    }
    */
};
