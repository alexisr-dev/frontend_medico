import { useCallback, useEffect, useState } from 'react'
import { CalendarOff, Plus, Trash2 } from 'lucide-react'
import { doctoresApi } from '@/api/doctores.api'
import { mensajeDeError } from '@/api/client'
import { Boton } from '@/components/common/Boton'
import { Campo, CampoSelect } from '@/components/common/Campo'
import { Cargando, EstadoVacio } from '@/components/common/Estados'
import { Tabla, type Columna } from '@/components/common/Tabla'
import { useToast } from '@/components/common/ToastProvider'
import { DIAS_SEMANA, fechaYHora, horaCorta } from '@/utils/fechas'
import type { Bloqueo, Disponibilidad } from '@/types/cita.types'

const BLOQUE_INICIAL = { dia_semana: '0', hora_inicio: '09:00', hora_fin: '13:00' }
const BLOQUEO_INICIAL = { fecha_inicio: '', fecha_fin: '', motivo: '' }

export const DisponibilidadPage = () => {
  const { mostrar } = useToast()
  const [disponibilidades, setDisponibilidades] = useState<Disponibilidad[]>([])
  const [bloqueos, setBloqueos] = useState<Bloqueo[]>([])
  const [cargando, setCargando] = useState(true)
  const [bloque, setBloque] = useState(BLOQUE_INICIAL)
  const [bloqueo, setBloqueo] = useState(BLOQUEO_INICIAL)
  const [guardando, setGuardando] = useState(false)

  const recargar = useCallback(() => {
    setCargando(true)
    Promise.all([doctoresApi.disponibilidades(), doctoresApi.bloqueos()])
      .then(([horarios, ausencias]) => {
        setDisponibilidades(horarios)
        setBloqueos(ausencias)
      })
      .finally(() => setCargando(false))
  }, [])

  useEffect(recargar, [recargar])

  const agregarBloque = async (evento: React.FormEvent) => {
    evento.preventDefault()
    setGuardando(true)
    try {
      await doctoresApi.crearDisponibilidad({
        dia_semana: Number(bloque.dia_semana),
        hora_inicio: bloque.hora_inicio,
        hora_fin: bloque.hora_fin,
        activo: true,
      })
      mostrar('Horario agregado', 'Los pacientes ya pueden reservar en ese bloque.', 'exito')
      setBloque(BLOQUE_INICIAL)
      recargar()
    } catch (fallo) {
      mostrar('No se pudo agregar', mensajeDeError(fallo), 'error')
    } finally {
      setGuardando(false)
    }
  }

  const agregarBloqueo = async (evento: React.FormEvent) => {
    evento.preventDefault()
    setGuardando(true)
    try {
      await doctoresApi.crearBloqueo({
        fecha_inicio: new Date(bloqueo.fecha_inicio).toISOString(),
        fecha_fin: new Date(bloqueo.fecha_fin).toISOString(),
        motivo: bloqueo.motivo,
      })
      mostrar('Ausencia registrada', 'Esas horas dejaron de ofrecerse a los pacientes.', 'exito')
      setBloqueo(BLOQUEO_INICIAL)
      recargar()
    } catch (fallo) {
      mostrar('No se pudo registrar', mensajeDeError(fallo), 'error')
    } finally {
      setGuardando(false)
    }
  }

  const eliminarBloque = async (id: number) => {
    await doctoresApi.eliminarDisponibilidad(id)
    mostrar('Horario eliminado', 'El bloque ya no aparece en tu agenda.', 'exito')
    recargar()
  }

  const eliminarAusencia = async (id: number) => {
    await doctoresApi.eliminarBloqueo(id)
    mostrar('Ausencia eliminada', 'Esas horas vuelven a estar disponibles.', 'exito')
    recargar()
  }

  const columnasHorario: Columna<Disponibilidad>[] = [
    { clave: 'dia', titulo: 'Dia', render: (fila) => DIAS_SEMANA[fila.dia_semana] },
    {
      clave: 'rango',
      titulo: 'Rango',
      render: (fila) => (
        <span className="mono">
          {horaCorta(fila.hora_inicio)} – {horaCorta(fila.hora_fin)}
        </span>
      ),
    },
    {
      clave: 'acciones',
      titulo: '',
      ancho: '110px',
      render: (fila) => (
        <Boton variante="fantasma" pequeno icono={<Trash2 size={14} />} onClick={() => eliminarBloque(fila.id)}>
          Quitar
        </Boton>
      ),
    },
  ]

  const columnasBloqueo: Columna<Bloqueo>[] = [
    { clave: 'desde', titulo: 'Desde', render: (fila) => fechaYHora(fila.fecha_inicio) },
    { clave: 'hasta', titulo: 'Hasta', render: (fila) => fechaYHora(fila.fecha_fin) },
    { clave: 'motivo', titulo: 'Motivo', render: (fila) => fila.motivo || <span className="tenue">Sin detalle</span> },
    {
      clave: 'acciones',
      titulo: '',
      ancho: '110px',
      render: (fila) => (
        <Boton variante="fantasma" pequeno icono={<Trash2 size={14} />} onClick={() => eliminarAusencia(fila.id)}>
          Quitar
        </Boton>
      ),
    },
  ]

  if (cargando) return <Cargando texto="Cargando tu disponibilidad" />

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Configuracion</p>
          <h1 style={{ marginTop: 6 }}>Mi disponibilidad</h1>
          <p className="encabezado-pagina__texto">
            Define tus bloques semanales de atencion y registra tus ausencias. El sistema genera las horas
            reservables a partir de esto.
          </p>
        </div>
      </header>

      <div className="rejilla rejilla--dos">
        <section className="tarjeta">
          <div className="tarjeta__cabecera">
            <div>
              <p className="rotulo">Horario semanal</p>
              <h3 style={{ marginTop: 6 }}>Bloques de atencion</h3>
            </div>
          </div>

          <form className="tarjeta__cuerpo apilar" style={{ gap: 12, paddingBottom: 16 }} onSubmit={agregarBloque}>
            <div className="rejilla" style={{ gridTemplateColumns: '1.4fr 1fr 1fr', gap: 10 }}>
              <CampoSelect
                etiqueta="Dia"
                value={bloque.dia_semana}
                onChange={(e) => setBloque((p) => ({ ...p, dia_semana: e.target.value }))}
              >
                {DIAS_SEMANA.map((dia, indice) => (
                  <option key={dia} value={indice}>
                    {dia}
                  </option>
                ))}
              </CampoSelect>
              <Campo
                etiqueta="Desde"
                type="time"
                value={bloque.hora_inicio}
                onChange={(e) => setBloque((p) => ({ ...p, hora_inicio: e.target.value }))}
              />
              <Campo
                etiqueta="Hasta"
                type="time"
                value={bloque.hora_fin}
                onChange={(e) => setBloque((p) => ({ ...p, hora_fin: e.target.value }))}
              />
            </div>
            <Boton type="submit" variante="secundario" icono={<Plus size={15} />} cargando={guardando}>
              Agregar bloque
            </Boton>
          </form>

          <Tabla
            columnas={columnasHorario}
            filas={disponibilidades}
            claveDe={(fila) => fila.id}
            vacio={
              <EstadoVacio
                titulo="Aun no defines tu horario"
                texto="Agrega al menos un bloque para que los pacientes puedan reservar contigo."
              />
            }
          />
        </section>

        <section className="tarjeta">
          <div className="tarjeta__cabecera">
            <div>
              <p className="rotulo">Excepciones</p>
              <h3 style={{ marginTop: 6 }}>Ausencias y bloqueos</h3>
            </div>
          </div>

          <form className="tarjeta__cuerpo apilar" style={{ gap: 12, paddingBottom: 16 }} onSubmit={agregarBloqueo}>
            <div className="rejilla" style={{ gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <Campo
                etiqueta="Desde"
                type="datetime-local"
                required
                value={bloqueo.fecha_inicio}
                onChange={(e) => setBloqueo((p) => ({ ...p, fecha_inicio: e.target.value }))}
              />
              <Campo
                etiqueta="Hasta"
                type="datetime-local"
                required
                value={bloqueo.fecha_fin}
                onChange={(e) => setBloqueo((p) => ({ ...p, fecha_fin: e.target.value }))}
              />
            </div>
            <Campo
              etiqueta="Motivo"
              placeholder="Congreso, pabellon, vacaciones"
              value={bloqueo.motivo}
              onChange={(e) => setBloqueo((p) => ({ ...p, motivo: e.target.value }))}
            />
            <Boton type="submit" variante="secundario" icono={<CalendarOff size={15} />} cargando={guardando}>
              Bloquear horas
            </Boton>
          </form>

          <Tabla
            columnas={columnasBloqueo}
            filas={bloqueos}
            claveDe={(fila) => fila.id}
            vacio={
              <EstadoVacio
                titulo="Sin ausencias registradas"
                texto="Bloquea rangos puntuales cuando no puedas atender."
                icono={<CalendarOff size={22} />}
              />
            }
          />
        </section>
      </div>
    </>
  )
}
