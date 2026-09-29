import { cliente } from './client'
import type { RespuestaPaginada } from '@/types/api.types'
import type { Bloqueo, DiaAgenda, Disponibilidad, DisponibilidadDia, Doctor, Especialidad } from '@/types/cita.types'

export const doctoresApi = {
  listar: (params: { especialidad?: number; search?: string; activo?: boolean } = {}) =>
    cliente.get<RespuestaPaginada<Doctor>>('/doctores/', { params }).then((r) => r.data),

  detalle: (id: number) => cliente.get<Doctor>(`/doctores/${id}/`).then((r) => r.data),

  miPerfil: () => cliente.get<Doctor>('/doctores/mi-perfil/').then((r) => r.data),

  actualizar: (id: number, datos: Partial<Doctor>) =>
    cliente.patch<Doctor>(`/doctores/${id}/`, datos).then((r) => r.data),

  disponibilidad: (id: number, fecha: string) =>
    cliente.get<DisponibilidadDia>(`/doctores/${id}/disponibilidad/`, { params: { fecha } }).then((r) => r.data),

  agenda: (id: number, desde: string, hasta: string) =>
    cliente
      .get<{ doctor: number; agenda: DiaAgenda[] }>(`/doctores/${id}/agenda/`, { params: { desde, hasta } })
      .then((r) => r.data.agenda),

  especialidades: () =>
    cliente.get<RespuestaPaginada<Especialidad>>('/doctores/especialidades/').then((r) => r.data.resultados),

  crearEspecialidad: (datos: Pick<Especialidad, 'nombre' | 'descripcion'>) =>
    cliente.post<Especialidad>('/doctores/especialidades/', datos).then((r) => r.data),

  disponibilidades: (doctor?: number) =>
    cliente
      .get<RespuestaPaginada<Disponibilidad>>('/doctores/disponibilidades/', { params: { doctor } })
      .then((r) => r.data.resultados),

  crearDisponibilidad: (datos: Omit<Disponibilidad, 'id' | 'doctor' | 'dia_semana_display'> & { doctor?: number }) =>
    cliente.post<Disponibilidad>('/doctores/disponibilidades/', datos).then((r) => r.data),

  eliminarDisponibilidad: (id: number) => cliente.delete(`/doctores/disponibilidades/${id}/`),

  bloqueos: (doctor?: number) =>
    cliente.get<RespuestaPaginada<Bloqueo>>('/doctores/bloqueos/', { params: { doctor } }).then((r) => r.data.resultados),

  crearBloqueo: (datos: Pick<Bloqueo, 'fecha_inicio' | 'fecha_fin' | 'motivo'>) =>
    cliente.post<Bloqueo>('/doctores/bloqueos/', datos).then((r) => r.data),

  eliminarBloqueo: (id: number) => cliente.delete(`/doctores/bloqueos/${id}/`),
}
