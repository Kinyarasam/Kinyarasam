import { API_ENDPOINTS } from "@/app/config";
import { Login, LoginRequest } from "./interface";
import { ApiResponse, BaseApiService } from "../admin";

export class AuthService extends BaseApiService {
  private readonly endpoint = "/api/v1/auth"

  // login
  async login(data: LoginRequest) {
    return this.post<ApiResponse<Login>>(`${this.endpoint}/login`, data)
  }

  // logout
  async logout() {
    return this.post(`${this.endpoint}/logout`)
  }
}

export const authService = new AuthService();
