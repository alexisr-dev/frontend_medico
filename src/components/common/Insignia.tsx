import type { ReactNode } from 'react'
import type { EstadoCita } from '@/types/cita.types'
import { ETIQUETA_ESTADO, TONO_ESTADO } from '@/utils/estados'

type Tono = 'espera' | 'activo' | 'neutro' | 'exito' | 'alerta'

export const Insignia = ({ tono = 'neutro', children }: { tono?: Tono; children: ReactNode }) => (
  <span className={`insignia insignia--${tono}`}>{children}</span>
)

export const InsigniaEstado = ({ estado }: { estado: EstadoCita }) => (
  <Insignia tono={TONO_ESTADO[estado]}>{ETIQUETA_ESTADO[estado]}</Insignia>
)
