import type { ReactNode } from 'react'

export interface Columna<T> {
  clave: string
  titulo: string
  render: (fila: T) => ReactNode
  ancho?: string
}

interface Props<T> {
  columnas: Columna<T>[]
  filas: T[]
  claveDe: (fila: T) => string | number
  vacio?: ReactNode
}

export const Tabla = <T,>({ columnas, filas, claveDe, vacio }: Props<T>) => {
  if (!filas.length && vacio) return <>{vacio}</>

  return (
    <div className="desplazable">
      <table className="tabla">
        <thead>
          <tr>
            {columnas.map((columna) => (
              <th key={columna.clave} style={columna.ancho ? { width: columna.ancho } : undefined}>
                {columna.titulo}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={claveDe(fila)}>
              {columnas.map((columna) => (
                <td key={columna.clave}>{columna.render(fila)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
