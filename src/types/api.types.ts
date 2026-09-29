export interface RespuestaPaginada<T> {
  total: number
  paginas: number
  pagina_actual: number
  siguiente: string | null
  anterior: string | null
  resultados: T[]
}

export interface ErrorApi {
  detail: string
  codigo: string
  errores?: Record<string, string[]> | string[]
}

export interface Notificacion {
  id: number
  titulo: string
  mensaje: string
  tipo: string
  tipo_display: string
  leido: boolean
  url_destino: string
  created_at: string
}

export interface OcupacionDoctor {
  doctor_id: number
  doctor: string
  especialidad: string
  capacidad_estimada: number
  citas_agendadas: number
  completadas: number
  canceladas: number
  no_asistio: number
  ocupacion_porcentaje: number
}

export interface ReporteNoAsistencia {
  total_citas: number
  finalizadas: number
  no_asistio: number
  canceladas: number
  tasa_no_asistencia: number
  tasa_cancelacion: number
  por_especialidad: { doctor__especialidad__nombre: string; total: number; no_asistio: number }[]
}

export interface CitasPorDia {
  dia: string
  total: number
  completadas: number
  canceladas: number
}

export interface DemandaEspecialidad {
  doctor__especialidad__nombre: string
  total: number
  pacientes_unicos: number
}

export interface DisponibilidadDoctor {
  doctor_id: number
  doctor: string
  especialidad: string
  slots_libres: number
  duracion_consulta: number
}

export interface IndicadoresGenerales {
  rango: { desde: string; hasta: string }
  total_citas: number
  total_pacientes: number
  total_doctores: number
  pacientes_atendidos: number
  anticipacion_promedio_horas: number
  tendencia_mensual: { mes: string; total: number }[]
}

export interface RegistroAuditoria {
  id: number
  usuario: string | null
  usuario_email: string
  usuario_nombre: string
  usuario_rol: string
  accion: string
  accion_display: string
  modelo_afectado: string
  objeto_id: string
  ruta: string
  metodo: string
  ip_address: string | null
  fecha: string
}
