import { authService } from './authService';

const baseUrl = import.meta.env.VITE_API_BASE_URL + "/partner";

const getAuthHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authService.getToken()}`
});

/**
 * Obtiene los socios filtrados por el ID del consorcio actual.
 * @param consorcioId ID del consorcio obtenido de los params de la URL
 */
export async function getAllSocios(consorcioId: string | number) {
    const url = `${baseUrl}/all?consorcioId=${consorcioId}`;

    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders()
    });

    if (!response.ok) throw new Error("Error al obtener los socios de este consorcio");

    const data = await response.json();
    return Array.isArray(data.response) ? data.response : [];
}

export async function getSocioById(socioId: string | number) {
    const url = `${baseUrl}/${socioId}`;
    const response = await fetch(url, {
        method: "GET",
        headers: getAuthHeaders()
    });
    
    if (!response.ok) throw new Error("Error al obtener el socio");
    return response.json();
}

export async function saveSocio(socio: any) {
    const url = `${baseUrl}/save`;
    return fetch(url, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify(socio)
    });
}

/**
 * Elimina un socio por su ID. 
 * Recordar que en el backend hay que validar que el socio pertenezca al consorcio del admin
 */
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