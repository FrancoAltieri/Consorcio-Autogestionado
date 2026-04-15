const baseUrl = import.meta.env.VITE_API_BASE_URL;

export async function saveSocio(socio: any) {
    var url = baseUrl + "/save";
    
    return fetch(url, {
        method: "POST",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(socio)
    });
}

export async function getAllSocios() {
    var url = baseUrl + "/all";
    const response = await fetch(url, {
        method: "GET",
        headers: {
            "Content-Type": "application/json"
        }
    });
   
    const data = await response.json();
    return data.response;
}

export async function deleteSocio(id: number) {
    var url = baseUrl + "/delete/" + id;
    return fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export async function updateSocio(socio: any) {
    var url = baseUrl + "/edit";
    return fetch(url, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(socio)
    });

}