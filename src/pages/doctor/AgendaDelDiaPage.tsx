import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CalendarCheck2 } from 'lucide-react'
import { citasApi } from '@/api/citas.api'
import { historialesApi } from '@/api/historiales.api'
import { mensajeDeError } from '@/api/client'
import { Cargando, EstadoVacio } from '@/components/common/Estados'
import { Metrica } from '@/components/common/Metrica'
import { Modal } from '@/components/common/Modal'
import { TarjetaCita } from '@/components/citas/TarjetaCita'
import { FormularioConsulta } from '@/components/historial/FormularioConsulta'
import { useToast } from '@/components/common/ToastProvider'
import { useCitas } from '@/features/citas/useCitas'
import { fechaLarga } from '@/utils/fechas'
import type { Cita } from '@/types/cita.types'
import type { NuevaConsulta } from '@/types/historial.types'

export const AgendaDelDiaPage = () => {
  const { resumen, resumir, cambiarEstado } = useCitas()
  const { mostrar } = useToast()
  const navegar = useNavigate()

  const [agenda, setAgenda] = useState<Cita[]>([])
  const [cargando, setCargando] = useState(true)
  const [enAtencion, setEnAtencion] = useState<Cita | null>(null)
  const [guardando, setGuardando] = useState(false)

  const recargar = useCallback(() => {
    setCargando(true)
    citasApi
      .agendaHoy()
      .then(setAgenda)
      .catch(() => setAgenda([]))
      .finally(() => setCargando(false))
  }, [])

  useEffect(() => {
    recargar()
    resumir()
  }, [recargar, resumir])

  const confirmar = async (cita: Cita) => {
    if (await cambiarEstado(cita.id, 'confirmada')) recargar()
  }

  const registrar = async (datos: NuevaConsulta) => {
    if (!enAtencion) return
    setGuardando(true)
    try {
      await cambiarEstado(enAtencion.id, 'completada')
      await historialesApi.crearConsulta(datos)
      mostrar('Consulta registrada', 'El diagnostico quedo guardado en la ficha del paciente.', 'exito')
      setEnAtencion(null)
      recargar()
      resumir()
    } catch (fallo) {
      mostrar('No se pudo registrar', mensajeDeError(fallo), 'error')
    } finally {
      setGuardando(false)
    }
  }

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">{fechaLarga(new Date())}</p>
          <h1 style={{ marginTop: 6 }}>Agenda de hoy</h1>
          <p className="encabezado-pagina__texto">
            Confirma las horas pendientes y registra el diagnostico apenas termines cada atencion.
          </p>
        </div>
      </header>

      {resumen ? (
        <div className="rejilla rejilla--metricas" style={{ marginBottom: 24 }}>
          <Metrica rotulo="Hoy" valor={agenda.length} acento pie="Pacientes agendados" />
          <Metrica rotulo="Por confirmar" valor={resumen.pendientes} pie="Requieren tu visto bueno" />
          <Metrica rotulo="Proximos 7 dias" valor={resumen.proximas_7_dias} pie="Carga de la semana" />
          <Metrica rotulo="No asistieron" valor={resumen.no_asistio} pie="Historico acumulado" />
        </div>
      ) : null}

      {cargando ? (
        <Cargando texto="Cargando agenda" />
      ) : agenda.length === 0 ? (
        <EstadoVacio
          titulo="Sin consultas para hoy"
          texto="Cuando un paciente reserve una hora de hoy la veras aqui en orden cronologico."
          icono={<CalendarCheck2 size={22} />}
        />
      ) : (
        <div className="lista-citas">
          {agenda.map((cita) => (
            <TarjetaCita
              key={cita.id}
              cita={cita}
              perspectiva="doctor"
              onConfirmar={confirmar}
              onCerrar={setEnAtencion}
              onVerHistorial={(item) => navegar(`/doctor/pacientes/${item.paciente}`)}
            />
          ))}
        </div>
      )}

      <Modal
        abierto={Boolean(enAtencion)}
        titulo={`Registrar atencion de ${enAtencion?.paciente_nombre ?? ''}`}
        onCerrar={() => setEnAtencion(null)}
      >
        {enAtencion ? (
          <FormularioConsulta citaId={enAtencion.id} guardando={guardando} onGuardar={registrar} />
        ) : null}
      </Modal>
    </>
  )
}
