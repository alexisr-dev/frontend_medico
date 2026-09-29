import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import type { ErrorApi } from '@/types/api.types'

const BASE_URL = import.meta.env.VITE_API_URL ?? '/api'

export const LLAVE_ACCESS = 'medico.access'
export const LLAVE_REFRESH = 'medico.refresh'

export const cliente = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

export const guardarTokens = (access: string, refresh: string) => {
  localStorage.setItem(LLAVE_ACCESS, access)
  localStorage.setItem(LLAVE_REFRESH, refresh)
}

export const limpiarTokens = () => {
  localStorage.removeItem(LLAVE_ACCESS)
  localStorage.removeItem(LLAVE_REFRESH)
}

export const tokenActual = () => localStorage.getItem(LLAVE_ACCESS)

cliente.interceptors.request.use((config) => {
  const token = tokenActual()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

let renovando: Promise<string | null> | null = null

const renovarToken = async (): Promise<string | null> => {
  const refresh = localStorage.getItem(LLAVE_REFRESH)
  if (!refresh) return null

  try {
    const { data } = await axios.post<{ access: string; refresh?: string }>(`${BASE_URL}/auth/refresh/`, {
      refresh,
    })
    localStorage.setItem(LLAVE_ACCESS, data.access)
    if (data.refresh) localStorage.setItem(LLAVE_REFRESH, data.refresh)
    return data.access
  } catch {
    limpiarTokens()
    return null
  }
}

cliente.interceptors.response.use(
  (respuesta) => respuesta,
  async (error: AxiosError<ErrorApi>) => {
    const original = error.config as InternalAxiosRequestConfig & { _reintentado?: boolean }

    if (error.response?.status === 401 && original && !original._reintentado) {
      original._reintentado = true
      renovando = renovando ?? renovarToken()
      const token = await renovando
      renovando = null

      if (token) {
        original.headers.Authorization = `Bearer ${token}`
        return cliente(original)
      }

      window.dispatchEvent(new CustomEvent('sesion:expirada'))
    }

    return Promise.reject(error)
  },
)

export const mensajeDeError = (error: unknown, respaldo = 'Ocurrio un error inesperado.'): string => {
  if (!axios.isAxiosError(error)) return respaldo

  const datos = error.response?.data as ErrorApi | undefined
  if (!datos) return error.message || respaldo
  if (datos.detail) return datos.detail

  if (datos.errores) {
    const valores = Array.isArray(datos.errores) ? datos.errores : Object.values(datos.errores).flat()
    if (valores.length) return String(valores[0])
  }

  const primerCampo = Object.values(datos as unknown as Record<string, unknown>).flat()
  return primerCampo.length ? String(primerCampo[0]) : respaldo
}

export const codigoDeError = (error: unknown): string | null => {
  if (!axios.isAxiosError(error)) return null
  return (error.response?.data as ErrorApi | undefined)?.codigo ?? null
}

export const esConflictoDeHorario = (error: unknown): boolean =>
  axios.isAxiosError(error) && error.response?.status === 409
