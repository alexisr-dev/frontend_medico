import { cliente } from './client'
import type {
  CitasPorDia,
  DemandaEspecialidad,
  DisponibilidadDoctor,
  IndicadoresGenerales,
  OcupacionDoctor,
  ReporteNoAsistencia,
} from '@/types/api.types'

interface Rango {
  desde?: string
  hasta?: string
}

export const reportesApi = {
  ocupacion: (rango: Rango = {}) =>
    cliente
      .get<{ rango: Rango; resultados: OcupacionDoctor[] }>('/reportes/ocupacion/', { params: rango })
      .then((r) => r.data.resultados),

  noAsistencia: (rango: Rango = {}) =>
    cliente.get<ReporteNoAsistencia>('/reportes/no-asistencia/', { params: rango }).then((r) => r.data),

  citasPorDia: (rango: Rango = {}) =>
    cliente
      .get<{ resultados: CitasPorDia[] }>('/reportes/citas-por-dia/', { params: rango })
      .then((r) => r.data.resultados),

  demandaEspecialidad: (rango: Rango = {}) =>
    cliente
      .get<{ resultados: DemandaEspecialidad[] }>('/reportes/demanda-especialidad/', { params: rango })
      .then((r) => r.data.resultados),

  disponibilidad: (dias = 7) =>
    cliente
      .get<{ dias: number; resultados: DisponibilidadDoctor[] }>('/reportes/disponibilidad/', { params: { dias } })
      .then((r) => r.data.resultados),

  indicadores: (rango: Rango = {}) =>
    cliente.get<IndicadoresGenerales>('/reportes/indicadores/', { params: rango }).then((r) => r.data),
}
