export type Rol = 'paciente' | 'doctor' | 'admin'

export interface Usuario {
  id: string
  email: string
  first_name: string
  last_name: string
  nombre_completo: string
  telefono: string
  rol: Rol
  mfa_habilitado: boolean
  is_active: boolean
  date_joined: string
}

export interface SesionUsuario extends Usuario {
  perfil_id: number | null
  especialidad?: string
  duracion_consulta_default?: number
}

export interface RespuestaLogin {
  access: string
  refresh: string
  usuario: Usuario
  perfil_id: number | null
}

export interface CredencialesLogin {
  email: string
  password: string
}

export interface DatosRegistro {
  email: string
  first_name: string
  last_name: string
  telefono?: string
  password: string
  password_confirmacion: string
  fecha_nacimiento?: string
  genero?: string
  direccion?: string
}

export interface PacientePerfil {
  id: number
  usuario: string
  nombre_completo: string
  email: string
  telefono: string
  fecha_nacimiento: string | null
  edad: number | null
  genero: string
  direccion: string
  contacto_emergencia: string
  numero_seguro: string
  created_at: string
}

export interface PacienteResumen {
  id: number
  nombre_completo: string
  email: string
  edad: number | null
  genero: string
}
