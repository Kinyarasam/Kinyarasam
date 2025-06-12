import { BaseEntity } from "../interface"

export interface Login extends BaseEntity {
  phone_number: string
  role: string
  email: string
  first_name: string
  last_name: string
  surname: string
  auth_token: string
  refresh_token: string
}

export interface LoginRequest {
  phone_number: string
  password: string
}
