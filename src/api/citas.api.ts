import { cliente } from './client'
import type { RespuestaPaginada } from '@/types/api.types'
import type { Cita, EstadoCita, NuevaCita, ResumenCitas } from '@/types/cita.types'

export interface FiltrosCitas {
  estado?: EstadoCita
  doctor?: number
  paciente?: number
  desde?: string
  hasta?: string
  proximas?: boolean
  page?: number
  page_size?: number
  ordering?: string
}

export const citasApi = {
  listar: (filtros: FiltrosCitas = {}) =>
    cliente
      .get<RespuestaPaginada<Cita>>('/citas/', {
        params: { ...filtros, proximas: filtros.proximas ? 'true' : undefined },
      })
      .then((r) => r.data),

  detalle: (id: string) => cliente.get<Cita>(`/citas/${id}/`).then((r) => r.data),

  crear: (datos: NuevaCita) => cliente.post<Cita>('/citas/', datos).then((r) => r.data),

  reprogramar: (id: string, fecha_hora_inicio: string, version: number) =>
    cliente.post<Cita>(`/citas/${id}/reprogramar/`, { fecha_hora_inicio, version }).then((r) => r.data),

  cancelar: (id: string, motivo_cancelacion: string) =>
    cliente.post<Cita>(`/citas/${id}/cancelar/`, { motivo_cancelacion }).then((r) => r.data),

  cambiarEstado: (id: string, estado: EstadoCita, notas_doctor?: string) =>
    cliente.post<Cita>(`/citas/${id}/estado/`, { estado, notas_doctor }).then((r) => r.data),

  agendaHoy: () => cliente.get<Cita[]>('/citas/agenda-hoy/').then((r) => r.data),

  resumen: () => cliente.get<ResumenCitas>('/citas/resumen/').then((r) => r.data),
}
