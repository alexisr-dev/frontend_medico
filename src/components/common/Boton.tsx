import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variante = 'primario' | 'secundario' | 'fantasma' | 'peligro'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: Variante
  pequeno?: boolean
  bloque?: boolean
  cargando?: boolean
  icono?: ReactNode
}

export const Boton = ({
  variante = 'primario',
  pequeno = false,
  bloque = false,
  cargando = false,
  icono,
  children,
  className = '',
  disabled,
  ...resto
}: Props) => {
  const clases = [
    'boton',
    `boton--${variante}`,
    pequeno && 'boton--sm',
    bloque && 'boton--bloque',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button className={clases} disabled={disabled || cargando} {...resto}>
      {cargando ? <span className="girador" aria-hidden /> : icono}
      {children}
    </button>
  )
}
