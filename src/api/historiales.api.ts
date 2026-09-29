import { cliente } from './client'
import type { RespuestaPaginada } from '@/types/api.types'
import type { HistorialMedico, NuevaConsulta, RegistroConsulta } from '@/types/historial.types'
import type { PacienteResumen } from '@/types/usuario.types'

export const historialesApi = {
  miHistorial: () => cliente.get<HistorialMedico>('/historiales/mi-historial/').then((r) => r.data),

  porPaciente: (pacienteId: number) =>
    cliente.get<HistorialMedico>(`/historiales/paciente/${pacienteId}/`).then((r) => r.data),

  actualizar: (id: number, datos: Partial<HistorialMedico>) =>
    cliente.patch<HistorialMedico>(`/historiales/${id}/`, datos).then((r) => r.data),

  crearConsulta: (datos: NuevaConsulta) =>
    cliente.post<RegistroConsulta>('/historiales/consultas/', datos).then((r) => r.data),

  consultas: (historial?: number) =>
    cliente
      .get<RespuestaPaginada<RegistroConsulta>>('/historiales/consultas/', { params: { historial } })
      .then((r) => r.data.resultados),

  misPacientes: (q?: string) =>
    cliente.get<PacienteResumen[]>('/pacientes/mis-pacientes/', { params: { q } }).then((r) => r.data),
}
