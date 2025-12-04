export interface Admin {
  id: string;
  email: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    token: string;
    admin: Admin;
  };
}

export class AuthService {
  private static readonly TOKEN_KEY = 'cms_token';
  private static readonly ADMIN_KEY = 'cms_admin';

  static async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002';
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      return data;
    } catch (error) {
      return {
        success: false,
        message: 'Network error. Please check if the backend server is running.',
      };
    }
  }

  static async verifyToken(): Promise<boolean> {
    const token = this.getToken();
    if (!token) return false;

    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5002';
      const response = await fetch(`${backendUrl}/api/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        // Check if it's a rate limit error
        if (response.status === 429) {
          console.warn('Rate limited, token verification skipped');
          return true; // Assume valid if rate limited
        }
        return false;
      }

      const data = await response.json();
      return data.success === true;
    } catch (error) {
      console.error('Token verification error:', error);
      // If network error, assume token is still valid to avoid logout
      return true;
    }
  }

  static setToken(token: string, admin: Admin): void {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.ADMIN_KEY, JSON.stringify(admin));
  }

  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  static getAdmin(): Admin | null {
    const adminStr = localStorage.getItem(this.ADMIN_KEY);
    return adminStr ? JSON.parse(adminStr) : null;
  }

  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_KEY);
  }

  static isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getAdmin();
  }

  static getAuthHeaders(): { Authorization: string } | {} {
    const token = this.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
}