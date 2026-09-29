import { useId } from 'react'
import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

interface Base {
  etiqueta: string
  error?: string
  ayuda?: string
}

export const Campo = ({
  etiqueta,
  error,
  ayuda,
  ...resto
}: Base & InputHTMLAttributes<HTMLInputElement>) => {
  const id = useId()
  return (
    <div className="campo">
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      <input
        id={id}
        className={`campo__control ${error ? 'campo__control--error' : ''}`}
        aria-invalid={Boolean(error)}
        {...resto}
      />
      {error ? <span className="campo__error">{error}</span> : ayuda ? <span className="campo__ayuda">{ayuda}</span> : null}
    </div>
  )
}

export const CampoArea = ({
  etiqueta,
  error,
  ayuda,
  ...resto
}: Base & TextareaHTMLAttributes<HTMLTextAreaElement>) => {
  const id = useId()
  return (
    <div className="campo">
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      <textarea
        id={id}
        className={`campo__control ${error ? 'campo__control--error' : ''}`}
        aria-invalid={Boolean(error)}
        {...resto}
      />
      {error ? <span className="campo__error">{error}</span> : ayuda ? <span className="campo__ayuda">{ayuda}</span> : null}
    </div>
  )
}

export const CampoSelect = ({
  etiqueta,
  error,
  ayuda,
  children,
  ...resto
}: Base & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) => {
  const id = useId()
  return (
    <div className="campo">
      <label className="campo__etiqueta" htmlFor={id}>
        {etiqueta}
      </label>
      <select
        id={id}
        className={`campo__control ${error ? 'campo__control--error' : ''}`}
        aria-invalid={Boolean(error)}
        {...resto}
      >
        {children}
      </select>
      {error ? <span className="campo__error">{error}</span> : ayuda ? <span className="campo__ayuda">{ayuda}</span> : null}
    </div>
  )
}
