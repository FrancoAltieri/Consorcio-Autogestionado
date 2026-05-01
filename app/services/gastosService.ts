import { get } from 'react-hook-form';
import { authService } from './authService';

const baseUrl = import.meta.env.VITE_API_BASE_URL + "/expense";

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authService.getToken()}`
});

export interface Gasto {
    id?: number;
    amount: number;
    description: string;
    date: string;
    consorcioId: number;
    partnerId: number;
    category: string;
    approved?: boolean;
}

export async function getAllGastos(consorcioId: string | number) {
    const url = `${baseUrl}/all?consorcioId=${consorcioId}`;
    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("Error al obtener los gastos");

    const data = await response.json();
    return Array.isArray(data.response) ? data.response : [];
}

export async function getApprovedGastos(consorcioId: string | number) {
    const url = `${baseUrl}/approved?consorcioId=${consorcioId}`;
    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("Error al obtener los gastos aprobados");

    const data = await response.json();
    return Array.isArray(data.response) ? data.response : [];
}

export async function saveGasto(gasto: any) {
    const url = `${baseUrl}/save`;
    return fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(gasto)
    });
}

export const gastosService = {
    getAllGastos,
    getApprovedGastos,
    saveGasto,
};