import { cliente } from './client'
import type {
  CredencialesLogin,
  DatosRegistro,
  PacientePerfil,
  RespuestaLogin,
  SesionUsuario,
  Usuario,
} from '@/types/usuario.types'

export const authApi = {
  login: (credenciales: CredencialesLogin) =>
    cliente.post<RespuestaLogin>('/auth/login/', credenciales).then((r) => r.data),

  registro: (datos: DatosRegistro) => cliente.post<Usuario>('/auth/registro/', datos).then((r) => r.data),

  yo: () => cliente.get<SesionUsuario>('/auth/yo/').then((r) => r.data),

  actualizarPerfil: (datos: Partial<Usuario>) =>
    cliente.patch<SesionUsuario>('/auth/yo/', datos).then((r) => r.data),

  cambiarPassword: (password_actual: string, password_nueva: string) =>
    cliente.post<{ detail: string }>('/auth/cambiar-password/', { password_actual, password_nueva }).then((r) => r.data),

  miPerfilPaciente: () => cliente.get<PacientePerfil>('/pacientes/mi-perfil/').then((r) => r.data),

  actualizarPerfilPaciente: (datos: Partial<PacientePerfil>) =>
    cliente.patch<PacientePerfil>('/pacientes/mi-perfil/', datos).then((r) => r.data),
}
