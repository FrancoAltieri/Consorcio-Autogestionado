// sociosService.ts corregido
import { authService } from './authService';

const baseUrl = import.meta.env.VITE_API_BASE_URL + "/partner"; // <--- AGREGADO /partner

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authService.getToken()}`
});

export async function getAllSocios() {
    const url = `${baseUrl}/all`;
    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("Error al obtener socios");

    const data = await response.json();
    // El controlador devuelve: Map.of("response", partnerList)
    // Por lo tanto, necesitamos data.response
    return Array.isArray(data.response) ? data.response : [];
}

export async function saveSocio(socio: any) {
    const url = `${baseUrl}/save`;
    return fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(socio)
    });
}

export async function deleteSocio(id: number) {
    const url = `${baseUrl}/delete/${id}`;
    return fetch(url, {
        method: "DELETE",
        headers: getAuthHeaders()
    });
}

export async function updateSocio(socio: any) {
    const url = `${baseUrl}/edit`;
    return fetch(url, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(socio)
    });
}