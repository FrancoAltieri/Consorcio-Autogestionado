import { authService } from './authService';

const baseUrl = import.meta.env.VITE_API_BASE_URL + "/report";

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authService.getToken()}`
});

export const reporteService = {

    async downloadMonthlySummary(consorcioId: number, period: string): Promise<void> {
        const response = await fetch(`${baseUrl}/monthly-summary/pdf?consorcioId=${consorcioId}&period=${period}`, {
            method: "GET",
            headers: getAuthHeaders()
        });

        if (!response.ok) {
            throw new Error("Error al descargar el reporte");
        }

        // Convertir la respuesta a blob (archivo)
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `reporte-${period}.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
    }
}