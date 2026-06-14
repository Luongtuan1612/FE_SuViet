const AUTH_API_URL = "http://localhost:8080/api/v1/auth";

export const AUTH_CHANGE_EVENT = "suviet-auth-change";

export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  username: string;
  role: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  fullName: string;
}

function emitAuthChange() {
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

function clearStoredAuth() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
  localStorage.removeItem("role");
  localStorage.removeItem("rememberLogin");

  sessionStorage.removeItem("token");
  sessionStorage.removeItem("username");
  sessionStorage.removeItem("role");
}

async function getResponseMessage(response: Response) {
  const text = await response.text();

  if (!text) {
    return response.ok ? "Thành công." : "Có lỗi xảy ra.";
  }

  try {
    const json = JSON.parse(text);
    return json.message || json.error || json.detail || text;
  } catch {
    return text;
  }
}

export const authService = {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const response = await fetch(`${AUTH_API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
      }),
    });

    if (!response.ok) {
      const message = await getResponseMessage(response);
      throw new Error(message || "Tên đăng nhập hoặc mật khẩu không đúng.");
    }

    return response.json();
  },

  async register(payload: RegisterPayload): Promise<string> {
    const response = await fetch(`${AUTH_API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: payload.username,
        password: payload.password,
        email: payload.email,
        fullName: payload.fullName,
      }),
    });

    const message = await getResponseMessage(response);

    if (!response.ok) {
      throw new Error(message || "Đăng ký thất bại. Vui lòng thử lại.");
    }

    return message || "Đăng ký thành công. Vui lòng đăng nhập.";
  },

  saveAuthSession(data: LoginResponse) {
    clearStoredAuth();

    localStorage.setItem("token", data.token);
    localStorage.setItem("username", data.username);
    localStorage.setItem("role", data.role || "USER");

    emitAuthChange();
  },

  getToken() {
    return localStorage.getItem("token");
  },

  getUsername() {
    return localStorage.getItem("username");
  },

  getRole() {
    return localStorage.getItem("role");
  },

  clearAuthSession() {
    clearStoredAuth();
    emitAuthChange();
  },
};