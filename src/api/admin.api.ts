import { cliente } from './client'
import type { RegistroAuditoria, RespuestaPaginada } from '@/types/api.types'
import type { Usuario } from '@/types/usuario.types'

export interface ResumenUsuarios {
  total: number
  pacientes: number
  doctores: number
  administradores: number
  inactivos: number
}

export interface NuevoDoctor {
  email: string
  first_name: string
  last_name: string
  telefono?: string
  password: string
  especialidad_id: number
  numero_licencia: string
  duracion_consulta_default: number
  biografia?: string
}

export const adminApi = {
  usuarios: (params: { rol?: string; q?: string; page?: number } = {}) =>
    cliente.get<RespuestaPaginada<Usuario>>('/auth/usuarios/', { params }).then((r) => r.data),

  resumenUsuarios: () => cliente.get<ResumenUsuarios>('/auth/usuarios/resumen/').then((r) => r.data),

  desactivarUsuario: (id: string) => cliente.delete(`/auth/usuarios/${id}/`),

  activarUsuario: (id: string) => cliente.post<Usuario>(`/auth/usuarios/${id}/activar/`).then((r) => r.data),

  crearDoctor: (datos: NuevoDoctor) => cliente.post<Usuario>('/auth/registro-doctor/', datos).then((r) => r.data),

  auditoria: (params: { accion?: string; modelo_afectado?: string; page?: number } = {}) =>
    cliente.get<RespuestaPaginada<RegistroAuditoria>>('/auditoria/', { params }).then((r) => r.data),
}
