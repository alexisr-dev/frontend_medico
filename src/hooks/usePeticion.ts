import { useCallback, useEffect, useState } from 'react'
import { mensajeDeError } from '@/api/client'

interface Resultado<T> {
  datos: T | null
  cargando: boolean
  error: string | null
  recargar: () => void
}

export const usePeticion = <T,>(peticion: () => Promise<T>, dependencias: unknown[] = []): Resultado<T> => {
  const [datos, setDatos] = useState<T | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [contador, setContador] = useState(0)

  const recargar = useCallback(() => setContador((valor) => valor + 1), [])

  useEffect(() => {
    let vigente = true
    setCargando(true)
    setError(null)

    peticion()
      .then((respuesta) => {
        if (vigente) setDatos(respuesta)
      })
      .catch((fallo) => {
        if (vigente) setError(mensajeDeError(fallo))
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...dependencias, contador])

  return { datos, cargando, error, recargar }
}
