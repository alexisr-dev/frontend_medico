import { useEffect, useState } from 'react'

export const useDebounce = <T,>(valor: T, retardo = 350): T => {
  const [diferido, setDiferido] = useState(valor)

  useEffect(() => {
    const temporizador = setTimeout(() => setDiferido(valor), retardo)
    return () => clearTimeout(temporizador)
  }, [valor, retardo])

  return diferido
}
