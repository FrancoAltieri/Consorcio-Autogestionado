const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface LoginRequest {
    email: string;
    password: string;
}

interface RegisterRequest {
    email: string;
    password: string;
    nombre: string;
    telefono: string;
}

interface AuthResponse {
    token: string;
    userId: number;
    email: string;
    nombre: string;
}

export const authService = {
    async login(credentials: LoginRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(credentials),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Error en la operación";

            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
            } catch (e) {
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        const data: AuthResponse = await response.json();
        // Guardar token en localStorage
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId.toString());
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.nombre);

        return data;
    },

    async register(userData: RegisterRequest): Promise<AuthResponse> {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            let errorMessage = "Error en la operación";

            try {
                const errorJson = JSON.parse(errorText);
                errorMessage = errorJson.message || errorMessage;
            } catch (e) {
                errorMessage = `Error ${response.status}: ${response.statusText}`;
            }

            throw new Error(errorMessage);
        }

        const data: AuthResponse = await response.json();
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userId.toString());
        localStorage.setItem("userEmail", data.email);
        localStorage.setItem("userName", data.nombre);

        return data;
    },

    logout(): void {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userId");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("userName");
    },

    isAuthenticated(): boolean {
        return !!localStorage.getItem("authToken");
    },

    getToken(): string | null {
        return localStorage.getItem("authToken");
    },

    getUserId(): number | null {
        const userId = localStorage.getItem("userId");
        return userId ? parseInt(userId) : null;
    },

    getUserInfo() {
        return {
            email: localStorage.getItem("userEmail"),
            nombre: localStorage.getItem("userName"),
            userId: localStorage.getItem("userId"),
        };
    },
};
