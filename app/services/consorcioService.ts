import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ConsorcioData {
    id: number;
    nombre: string;
    codigoInvitacion: string;
    creadoPor: string;
    fechaCreacion: string;
    rol: 'ADMIN' | 'USER';
    cantidadMiembros: number;
}

export interface CreateConsorcioRequest {
    nombre: string;
}

export interface UnirseConsorcioRequest {
    codigoInvitacion: string;
}

const getAuthHeader = () => {
    const token = authService.getToken();
    return {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
    };
};

export const consorcioService = {
    async crearConsorcio(data: CreateConsorcioRequest): Promise<ConsorcioData> {
        const response = await fetch(`${API_BASE_URL}/consorcios`, {
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Error al crear el consorcio");
        }

        return await response.json();
    },

    async unirseConsorcio(data: UnirseConsorcioRequest): Promise<ConsorcioData> {
        const codigoLimpio = data.codigoInvitacion.toUpperCase().replace(/[^A-Z0-9]/g, '');

        const response = await fetch(`${API_BASE_URL}/consorcios/unirse`, {
            method: "POST",
            headers: getAuthHeader(),
            body: JSON.stringify({ codigoInvitacion: codigoLimpio }),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Código inválido o ya eres miembro de este consorcio");
        }

        return await response.json();
    },

    async getMisConsorcios(): Promise<ConsorcioData[]> {
        const response = await fetch(`${API_BASE_URL}/consorcios/mios`, {
            method: "GET",
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Error al obtener consorcios");
        }

        const data = await response.json();
        // Maneja tanto el objeto con propiedad .consorcios como el array directo
        return data.consorcios || data || [];
    },

    async getConsorcioById(consorcioId: number | string): Promise<ConsorcioData> {
        const response = await fetch(`${API_BASE_URL}/consorcios/${consorcioId}`, {
            method: "GET",
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Error al obtener el consorcio");
        }

        return await response.json();
    },
};