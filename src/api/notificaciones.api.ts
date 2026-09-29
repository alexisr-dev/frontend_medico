import { cliente } from './client'
import type { Notificacion, RespuestaPaginada } from '@/types/api.types'

export const notificacionesApi = {
  listar: (leido?: boolean) =>
    cliente
      .get<RespuestaPaginada<Notificacion>>('/notificaciones/', { params: { leido } })
      .then((r) => r.data.resultados),

  noLeidas: () => cliente.get<{ total: number }>('/notificaciones/no-leidas/').then((r) => r.data.total),

  marcarLeida: (id: number) =>
    cliente.post<Notificacion>(`/notificaciones/${id}/marcar-leida/`).then((r) => r.data),

  marcarTodas: () =>
    cliente.post<{ actualizadas: number }>('/notificaciones/marcar-todas/').then((r) => r.data.actualizadas),
}
