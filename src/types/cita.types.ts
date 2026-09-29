export type EstadoCita = 'pendiente' | 'confirmada' | 'cancelada' | 'completada' | 'no_asistio'

export interface Cita {
  id: string
  paciente: number
  paciente_nombre: string
  paciente_email: string
  doctor: number
  doctor_nombre: string
  especialidad: string
  fecha_hora_inicio: string
  fecha_hora_fin: string
  duracion_minutos: number
  estado: EstadoCita
  estado_display: string
  motivo_consulta: string
  notas_doctor: string
  motivo_cancelacion: string
  puede_cancelarse: boolean
  version: number
  created_at: string
  updated_at: string
}

export interface Slot {
  inicio: string
  fin: string
  hora: string
  duracion_minutos: number
}

export interface DisponibilidadDia {
  doctor: number
  fecha: string
  duracion_minutos: number
  slots: Slot[]
}

export interface DiaAgenda {
  fecha: string
  dia_semana: number
  total_slots: number
  slots: Slot[]
}

export interface NuevaCita {
  doctor: number
  paciente?: number
  fecha_hora_inicio: string
  fecha_hora_fin?: string
  motivo_consulta: string
}

export interface ResumenCitas {
  pendientes: number
  confirmadas: number
  completadas: number
  canceladas: number
  no_asistio: number
  proximas_7_dias: number
  total: number
}

export interface Especialidad {
  id: number
  nombre: string
  descripcion: string
  total_doctores?: number
}

export interface Doctor {
  id: number
  nombre_completo: string
  especialidad: number
  especialidad_nombre: string
  duracion_consulta_default: number
  tarifa_consulta: string
  biografia: string
  activo: boolean
  email?: string
  telefono?: string
  numero_licencia?: string
  disponibilidades?: Disponibilidad[]
}

export interface Disponibilidad {
  id: number
  doctor: number
  dia_semana: number
  dia_semana_display: string
  hora_inicio: string
  hora_fin: string
  activo: boolean
}

export interface Bloqueo {
  id: number
  doctor: number
  fecha_inicio: string
  fecha_fin: string
  motivo: string
  created_at: string
}
