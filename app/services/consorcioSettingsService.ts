import { authService } from './authService';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export interface ConsorcioSettings {
    consorcioId?: number;
    monthlyInterestRate: number;
    gracePeriodDays: number;
    fixedPenalty: number;
}

const getAuthHeader = () => {
    const token = authService.getToken();
    return {
        "Content-Type": "application/json",
        ...(token && { "Authorization": `Bearer ${token}` }),
    };
};

export const consorcioSettingsService = {
    async getSettings(consorcioId: number | string): Promise<ConsorcioSettings> {
        const response = await fetch(`${API_BASE_URL}/consorcios/${consorcioId}/settings`, {
            method: "GET",
            headers: getAuthHeader(),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Error al obtener la configuración del consorcio");
        }

        return await response.json();
    },

    async updateSettings(consorcioId: number | string, data: ConsorcioSettings): Promise<ConsorcioSettings> {
        const response = await fetch(`${API_BASE_URL}/consorcios/${consorcioId}/settings`, {
            method: "PUT",
            headers: getAuthHeader(),
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || "Error al guardar la configuración del consorcio");
        }

        return await response.json();
    }
};
