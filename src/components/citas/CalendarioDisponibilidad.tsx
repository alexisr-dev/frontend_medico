import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { doctoresApi } from '@/api/doctores.api'
import { Cargando, EstadoVacio } from '@/components/common/Estados'
import { DIAS_SEMANA, isoDelDia } from '@/utils/fechas'
import type { DiaAgenda, Slot } from '@/types/cita.types'

interface Props {
  doctorId: number
  duracion: number
  slotElegido: Slot | null
  conflicto: boolean
  onElegirSlot: (slot: Slot) => void
  onCambiarFecha: (fecha: string) => void
  refrescar: number
}

const DIAS_VISIBLES = 14

export const CalendarioDisponibilidad = ({
  doctorId,
  duracion,
  slotElegido,
  conflicto,
  onElegirSlot,
  onCambiarFecha,
  refrescar,
}: Props) => {
  const [agenda, setAgenda] = useState<DiaAgenda[]>([])
  const [fecha, setFecha] = useState(() => isoDelDia(new Date()))
  const [cargando, setCargando] = useState(true)

  const rango = useMemo(() => {
    const desde = new Date()
    const hasta = new Date()
    hasta.setDate(desde.getDate() + DIAS_VISIBLES - 1)
    return { desde: isoDelDia(desde), hasta: isoDelDia(hasta) }
  }, [])

  useEffect(() => {
    let vigente = true
    setCargando(true)

    doctoresApi
      .agenda(doctorId, rango.desde, rango.hasta)
      .then((dias) => {
        if (!vigente) return
        setAgenda(dias)
        const primerDisponible = dias.find((dia) => dia.total_slots > 0)
        const elegido = dias.find((dia) => dia.fecha === fecha && dia.total_slots > 0)
        const siguiente = elegido?.fecha ?? primerDisponible?.fecha ?? dias[0]?.fecha
        if (siguiente && siguiente !== fecha) {
          setFecha(siguiente)
          onCambiarFecha(siguiente)
        }
      })
      .catch(() => {
        if (vigente) setAgenda([])
      })
      .finally(() => {
        if (vigente) setCargando(false)
      })

    return () => {
      vigente = false
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId, rango.desde, rango.hasta, refrescar])

  const diaActivo = agenda.find((dia) => dia.fecha === fecha)
  const totalLibres = agenda.reduce((suma, dia) => suma + dia.total_slots, 0)

  const elegirDia = (nuevaFecha: string) => {
    setFecha(nuevaFecha)
    onCambiarFecha(nuevaFecha)
  }

  return (
    <section className="tablero">
      <header className="tablero__cabecera">
        <div>
          <p className="tablero__titulo">Horas disponibles</p>
          <p className="tablero__meta">
            Bloques de {duracion} min · {totalLibres} libres en {DIAS_VISIBLES} dias
          </p>
        </div>
        <p className="tablero__meta">Se actualiza al reservar</p>
      </header>

      <div className="tablero__cinta" role="tablist" aria-label="Dias con disponibilidad">
        {agenda.map((dia) => {
          const fechaDia = new Date(`${dia.fecha}T00:00:00`)
          const activo = dia.fecha === fecha
          return (
            <button
              key={dia.fecha}
              role="tab"
              aria-selected={activo}
              className={`dia-chip ${activo ? 'dia-chip--activo' : ''}`}
              disabled={dia.total_slots === 0}
              onClick={() => elegirDia(dia.fecha)}
            >
              <span className="dia-chip__dia">{DIAS_SEMANA[dia.dia_semana].slice(0, 3)}</span>
              <span className="dia-chip__numero">{fechaDia.getDate()}</span>
              <span className="dia-chip__libres">{dia.total_slots > 0 ? `${dia.total_slots} hrs` : 'sin cupo'}</span>
            </button>
          )
        })}
      </div>

      <div className="tablero__cuerpo">
        {cargando ? (
          <Cargando texto="Consultando agenda" />
        ) : !diaActivo || diaActivo.slots.length === 0 ? (
          <EstadoVacio
            titulo="No quedan horas ese dia"
            texto="Elige otro dia en la cinta superior o cambia de profesional."
          />
        ) : (
          <div className={`slots ${conflicto ? 'slots--conflicto' : ''}`}>
            <AnimatePresence mode="popLayout">
              {diaActivo.slots.map((slot, indice) => (
                <motion.button
                  key={slot.inicio}
                  layout
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.18, delay: Math.min(indice * 0.012, 0.24) }}
                  className={`slot ${slotElegido?.inicio === slot.inicio ? 'slot--elegido' : ''}`}
                  onClick={() => onElegirSlot(slot)}
                  aria-pressed={slotElegido?.inicio === slot.inicio}
                >
                  {slot.hora}
                </motion.button>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  )
}
