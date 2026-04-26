import { authService } from "./authService";

const baseUrl = import.meta.env.VITE_API_BASE_URL + "/payment";

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authService.getToken()}`
});

export const pagoService = {
    async getAllPagos(consorcioId: string | number) {
        const url = `${baseUrl}/all?consorcioId=${consorcioId}`;

        const response = await fetch(url, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) throw new Error("Error al obtener los pagos de este consorcio");

        const data = await response.json();
        return Array.isArray(data.response) ? data.response : [];
    },

    async savePago(pago: any) {
        const url = `${baseUrl}/save`;
        return fetch(url, {
            method: "POST",
            headers: getAuthHeaders(),
            body: JSON.stringify(pago)
        });
    }

};

// export async function deletePago(id: number) {
//     const url = `${baseUrl}/delete/${id}`;
//     return fetch(url, {
//         method: "DELETE",
//         headers: getAuthHeaders()
//     });
// }

// export async function updatePago(pago: any) {
//     const url = `${baseUrl}/edit`;
//     return fetch(url, {
//         method: "PUT",
//         headers: getAuthHeaders(),
//         body: JSON.stringify(pago)
//     });
// }   