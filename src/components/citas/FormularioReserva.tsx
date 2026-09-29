import { useState } from 'react'
import { CalendarCheck, Clock } from 'lucide-react'
import { Boton } from '@/components/common/Boton'
import { CampoArea } from '@/components/common/Campo'
import { fechaLarga, rangoHorario } from '@/utils/fechas'
import type { Doctor, Slot } from '@/types/cita.types'

interface Props {
  doctor: Doctor | null
  slot: Slot | null
  reservando: boolean
  onConfirmar: (motivo: string) => void
}

export const FormularioReserva = ({ doctor, slot, reservando, onConfirmar }: Props) => {
  const [motivo, setMotivo] = useState('')
  const [error, setError] = useState('')

  const enviar = (evento: React.FormEvent) => {
    evento.preventDefault()
    if (motivo.trim().length < 5) {
      setError('Cuentanos en pocas palabras el motivo de la consulta.')
      return
    }
    setError('')
    onConfirmar(motivo.trim())
    setMotivo('')
  }

  if (!doctor) {
    return (
      <aside className="tarjeta">
        <div className="tarjeta__cuerpo">
          <p className="rotulo">Paso 1</p>
          <h3 style={{ marginTop: 8 }}>Elige un profesional</h3>
          <p className="tenue" style={{ marginTop: 6, fontSize: '0.88rem' }}>
            Filtra por especialidad y selecciona a quien te atendera. Despues eliges el dia y la hora.
          </p>
        </div>
      </aside>
    )
  }

  return (
    <aside className="tarjeta">
      <div className="tarjeta__cabecera">
        <div>
          <p className="rotulo">Resumen de tu hora</p>
          <h3 style={{ marginTop: 6 }}>{doctor.nombre_completo}</h3>
          <p className="tenue" style={{ fontSize: '0.85rem' }}>
            {doctor.especialidad_nombre}
          </p>
        </div>
      </div>

      <form className="tarjeta__cuerpo apilar" style={{ gap: 16 }} onSubmit={enviar}>
        {slot ? (
          <div className="apilar" style={{ gap: 8 }}>
            <div className="fila" style={{ gap: 9 }}>
              <CalendarCheck size={16} color="var(--teal)" />
              <span style={{ fontSize: '0.9rem' }}>{fechaLarga(slot.inicio)}</span>
            </div>
            <div className="fila" style={{ gap: 9 }}>
              <Clock size={16} color="var(--teal)" />
              <span className="mono" style={{ fontSize: '0.9rem' }}>
                {rangoHorario(slot.inicio, slot.fin)} · {slot.duracion_minutos} min
              </span>
            </div>
          </div>
        ) : (
          <div className="aviso aviso--info">Selecciona una hora en el tablero para continuar.</div>
        )}

        <CampoArea
          etiqueta="Motivo de la consulta"
          placeholder="Ej: control de presion arterial y renovacion de receta"
          value={motivo}
          error={error}
          maxLength={1000}
          onChange={(evento) => setMotivo(evento.target.value)}
        />

        <Boton type="submit" bloque cargando={reservando} disabled={!slot}>
          Reservar hora
        </Boton>

        <p className="campo__ayuda">
          Puedes cancelar sin costo hasta 2 horas antes. Te enviaremos recordatorios 24 y 2 horas antes.
        </p>
      </form>
    </aside>
  )
}
