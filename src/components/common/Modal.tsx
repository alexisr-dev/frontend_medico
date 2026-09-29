import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

interface Props {
  abierto: boolean
  titulo: string
  onCerrar: () => void
  children: ReactNode
  pie?: ReactNode
}

export const Modal = ({ abierto, titulo, onCerrar, children, pie }: Props) => {
  useEffect(() => {
    if (!abierto) return
    const alPresionar = (evento: KeyboardEvent) => {
      if (evento.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPresionar)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', alPresionar)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  return createPortal(
    <AnimatePresence>
      {abierto ? (
        <motion.div
          className="modal__fondo"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.16 }}
          onClick={onCerrar}
        >
          <motion.div
            className="modal__panel"
            role="dialog"
            aria-modal="true"
            aria-label={titulo}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.99 }}
            transition={{ duration: 0.2, ease: [0.22, 0.61, 0.36, 1] }}
            onClick={(evento) => evento.stopPropagation()}
          >
            <div className="modal__cabecera">
              <h2>{titulo}</h2>
              <button className="boton boton--fantasma boton--sm" onClick={onCerrar} aria-label="Cerrar">
                <X size={17} />
              </button>
            </div>
            <div className="modal__cuerpo">{children}</div>
            {pie ? <div className="modal__pie">{pie}</div> : null}
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  )
}
