import client from './client'

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  firstName: string
  lastName: string
}

export interface AuthResponse {
  id: number
  email: string
  firstName: string
  lastName: string
  accessToken: string
  tokenType: string
}

export const authAPI = {
  login: (data: LoginRequest) =>
    client.post<any>('/auth/login', data),

  register: (data: RegisterRequest) =>
    client.post<any>('/auth/register', data),
}
