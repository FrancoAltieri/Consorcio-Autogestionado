import { authService } from './authService';

const baseUrl = import.meta.env.VITE_API_BASE_URL + "/expense";

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authService.getToken()}`
});

export async function getAllGastos (consorcioId: string | number) {
    const url = `${baseUrl}/all?consorcioId=${consorcioId}`;

    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("Error al obtener los gastos de este consorcio");

    const data = await response.json();
    return Array.isArray(data.response) ? data.response : [];
}