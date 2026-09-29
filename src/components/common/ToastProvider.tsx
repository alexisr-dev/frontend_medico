import { createContext, use, useCallback, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react'
import type { ReactNode } from 'react'

export type TonoToast = 'exito' | 'aviso' | 'error' | 'info'

interface Toast {
  id: number
  titulo: string
  texto: string
  tono: TonoToast
}

interface ContextoToast {
  mostrar: (titulo: string, texto: string, tono?: TonoToast) => void
}

const Contexto = createContext<ContextoToast>({ mostrar: () => {} })

const ICONOS: Record<TonoToast, ReactNode> = {
  exito: <CheckCircle2 size={18} color="#15803D" />,
  aviso: <AlertTriangle size={18} color="#B45309" />,
  error: <XCircle size={18} color="#B91C1C" />,
  info: <Info size={18} color="#0E7C7B" />,
}

let siguienteId = 0

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([])

  const mostrar = useCallback((titulo: string, texto: string, tono: TonoToast = 'info') => {
    const id = siguienteId++
    setToasts((previos) => [...previos, { id, titulo, texto, tono }])
    setTimeout(() => setToasts((previos) => previos.filter((item) => item.id !== id)), 5000)
  }, [])

  const valor = useMemo(() => ({ mostrar }), [mostrar])

  return (
    <Contexto.Provider value={valor}>
      {children}
      <div className="brindis" role="status" aria-live="polite">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              className={`brindis__item brindis__item--${toast.tono}`}
              initial={{ opacity: 0, x: 40, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 30, scale: 0.97 }}
              transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
            >
              <span aria-hidden>{ICONOS[toast.tono]}</span>
              <div>
                <p className="brindis__titulo">{toast.titulo}</p>
                <p className="brindis__texto">{toast.texto}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Contexto.Provider>
  )
}

export const useToast = () => use(Contexto)
