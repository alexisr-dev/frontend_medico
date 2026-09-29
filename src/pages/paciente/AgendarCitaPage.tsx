import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { CalendarioDisponibilidad } from '@/components/citas/CalendarioDisponibilidad'
import { FormularioReserva } from '@/components/citas/FormularioReserva'
import { Campo } from '@/components/common/Campo'
import { Cargando, EstadoVacio } from '@/components/common/Estados'
import { cargarDoctores, cargarEspecialidades } from '@/features/doctores/doctoresSlice'
import { useCitas } from '@/features/citas/useCitas'
import { useDebounce } from '@/hooks/useDebounce'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import type { Doctor, Slot } from '@/types/cita.types'

export const AgendarCitaPage = () => {
  const dispatch = useAppDispatch()
  const { lista: doctores, especialidades, cargando } = useAppSelector((estado) => estado.doctores)
  const { reservar, reservando, conflicto, descartarConflicto } = useCitas()

  const [especialidad, setEspecialidad] = useState<number | null>(null)
  const [busqueda, setBusqueda] = useState('')
  const [doctorId, setDoctorId] = useState<number | null>(null)
  const [slot, setSlot] = useState<Slot | null>(null)
  const [refrescos, setRefrescos] = useState(0)

  const busquedaDiferida = useDebounce(busqueda)

  useEffect(() => {
    dispatch(cargarEspecialidades())
  }, [dispatch])

  useEffect(() => {
    dispatch(
      cargarDoctores({
        especialidad: especialidad ?? undefined,
        search: busquedaDiferida.trim() || undefined,
      }),
    )
  }, [dispatch, especialidad, busquedaDiferida])

  const doctor: Doctor | null = useMemo(
    () => doctores.find((item) => item.id === doctorId) ?? null,
    [doctores, doctorId],
  )

  useEffect(() => {
    if (doctorId && !doctores.some((item) => item.id === doctorId)) {
      setDoctorId(null)
      setSlot(null)
    }
  }, [doctores, doctorId])

  const confirmar = async (motivo: string) => {
    if (!doctor || !slot) return
    const cita = await reservar({
      doctor: doctor.id,
      fecha_hora_inicio: slot.inicio,
      fecha_hora_fin: slot.fin,
      motivo_consulta: motivo,
    })

    setSlot(null)
    setRefrescos((valor) => valor + 1)
    if (!cita) setTimeout(descartarConflicto, 600)
  }

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Reservar</p>
          <h1 style={{ marginTop: 6 }}>Agenda tu proxima consulta</h1>
          <p className="encabezado-pagina__texto">
            Elige la especialidad, revisa las horas libres del profesional y confirma. La disponibilidad se
            recalcula cada vez que alguien reserva.
          </p>
        </div>
      </header>

      <div className="filtros">
        <button
          className={`pastilla ${especialidad === null ? 'pastilla--activa' : ''}`}
          onClick={() => setEspecialidad(null)}
        >
          Todas
        </button>
        {especialidades.map((item) => (
          <button
            key={item.id}
            className={`pastilla ${especialidad === item.id ? 'pastilla--activa' : ''}`}
            onClick={() => setEspecialidad(item.id)}
          >
            {item.nombre}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 340, marginBottom: 20 }}>
        <Campo
          etiqueta="Buscar profesional"
          placeholder="Nombre o especialidad"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
      </div>

      {cargando ? (
        <Cargando texto="Buscando profesionales" />
      ) : doctores.length === 0 ? (
        <EstadoVacio
          titulo="No encontramos profesionales"
          texto="Prueba con otra especialidad o revisa la busqueda por nombre."
          icono={<Search size={22} />}
        />
      ) : (
        <div className="rejilla rejilla--dos" style={{ marginBottom: 24 }}>
          {doctores.map((item) => (
            <button
              key={item.id}
              className={`doctor-tarjeta ${doctorId === item.id ? 'doctor-tarjeta--elegido' : ''}`}
              onClick={() => {
                setDoctorId(item.id)
                setSlot(null)
              }}
              aria-pressed={doctorId === item.id}
            >
              <div>
                <p className="doctor-tarjeta__nombre">{item.nombre_completo}</p>
                <p className="rotulo" style={{ marginTop: 3 }}>
                  {item.especialidad_nombre}
                </p>
              </div>
              <p className="doctor-tarjeta__bio">{item.biografia || 'Profesional del equipo clinico.'}</p>
              <div className="doctor-tarjeta__pie">
                <span>{item.duracion_consulta_default} min por consulta</span>
                <span>${Number(item.tarifa_consulta).toLocaleString('es-CL')}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {doctor ? (
        <div className="rejilla rejilla--reserva">
          <CalendarioDisponibilidad
            doctorId={doctor.id}
            duracion={doctor.duracion_consulta_default}
            slotElegido={slot}
            conflicto={conflicto}
            refrescar={refrescos}
            onElegirSlot={setSlot}
            onCambiarFecha={() => setSlot(null)}
          />
          <FormularioReserva doctor={doctor} slot={slot} reservando={reservando} onConfirmar={confirmar} />
        </div>
      ) : null}
    </>
  )
}
