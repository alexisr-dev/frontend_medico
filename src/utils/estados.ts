import type { EstadoCita } from '@/types/cita.types'

export const ETIQUETA_ESTADO: Record<EstadoCita, string> = {
  pendiente: 'Pendiente',
  confirmada: 'Confirmada',
  cancelada: 'Cancelada',
  completada: 'Completada',
  no_asistio: 'No asistio',
}

export const TONO_ESTADO: Record<EstadoCita, 'espera' | 'activo' | 'neutro' | 'exito' | 'alerta'> = {
  pendiente: 'espera',
  confirmada: 'activo',
  cancelada: 'neutro',
  completada: 'exito',
  no_asistio: 'alerta',
}

export const COLOR_ESTADO: Record<EstadoCita, string> = {
  pendiente: '#B45309',
  confirmada: '#0E7C7B',
  cancelada: '#64748B',
  completada: '#15803D',
  no_asistio: '#B91C1C',
}
