export interface LoginResponse {
    token: string;
    user: {
        id: string;
        name: string;
        role: string;
    };
}

export class AuthService {
    private static readonly API_URL = "/api/auth";

    static async login(email: string, password: string): Promise<LoginResponse> {
        try {
            const response = await fetch(`${this.API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Login failed");
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("AuthService Login Error:", error);
            throw error;
        }
    }

    static async logout(): Promise<void> {
        try {
            // Logic to clear cookies or tokens if needed on server side
            // For now, client-side cookie clearing is often handled by middleware or passing headers
            const response = await fetch(`${this.API_URL}/logout`, {
                method: "POST",
            });

            if (!response.ok) {
                console.warn("Logout endpoint failed, but proceeding with client cleanup");
            }
        } catch (error) {
            console.error("Logout error", error);
        }
    }
}
