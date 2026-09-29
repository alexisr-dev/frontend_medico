import { CalendarX2 } from 'lucide-react'
import type { ReactNode } from 'react'

export const Cargando = ({ texto = 'Cargando' }: { texto?: string }) => (
  <div className="centrado" style={{ padding: '48px 0', gap: 10 }}>
    <span className="girador" style={{ color: 'var(--teal)' }} aria-hidden />
    <span className="rotulo">{texto}</span>
  </div>
)

export const EstadoVacio = ({
  titulo,
  texto,
  icono,
  accion,
}: {
  titulo: string
  texto: string
  icono?: ReactNode
  accion?: ReactNode
}) => (
  <div className="vacio">
    <span className="vacio__icono" aria-hidden>
      {icono ?? <CalendarX2 size={22} />}
    </span>
    <p className="vacio__titulo">{titulo}</p>
    <p className="vacio__texto">{texto}</p>
    {accion}
  </div>
)

export const AvisoError = ({ mensaje }: { mensaje: string }) => (
  <div className="aviso aviso--error" role="alert">
    {mensaje}
  </div>
)

export const Esqueleto = ({ alto = 18, ancho = '100%' }: { alto?: number; ancho?: string | number }) => (
  <div className="esqueleto" style={{ height: alto, width: ancho }} />
)
