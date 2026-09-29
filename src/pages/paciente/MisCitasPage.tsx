import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Boton } from '@/components/common/Boton'
import { CampoArea } from '@/components/common/Campo'
import { Cargando, EstadoVacio } from '@/components/common/Estados'
import { Metrica } from '@/components/common/Metrica'
import { Modal } from '@/components/common/Modal'
import { TarjetaCita } from '@/components/citas/TarjetaCita'
import { useCitas } from '@/features/citas/useCitas'
import type { Cita, EstadoCita } from '@/types/cita.types'

const FILTROS: { valor: EstadoCita | 'todas' | 'proximas'; texto: string }[] = [
  { valor: 'proximas', texto: 'Proximas' },
  { valor: 'todas', texto: 'Todas' },
  { valor: 'completada', texto: 'Completadas' },
  { valor: 'cancelada', texto: 'Canceladas' },
]

export const MisCitasPage = () => {
  const { lista, cargandoLista, resumen, listar, resumir, cancelar } = useCitas()
  const [filtro, setFiltro] = useState<EstadoCita | 'todas' | 'proximas'>('proximas')
  const [porCancelar, setPorCancelar] = useState<Cita | null>(null)
  const [motivo, setMotivo] = useState('')
  const [cancelando, setCancelando] = useState(false)

  useEffect(() => {
    resumir()
  }, [resumir])

  useEffect(() => {
    if (filtro === 'proximas') listar({ proximas: true, page_size: 50 })
    else if (filtro === 'todas') listar({ page_size: 50 })
    else listar({ estado: filtro, page_size: 50 })
  }, [filtro, listar])

  const confirmarCancelacion = async () => {
    if (!porCancelar) return
    setCancelando(true)
    const exito = await cancelar(porCancelar.id, motivo.trim())
    setCancelando(false)
    if (exito) {
      setPorCancelar(null)
      setMotivo('')
      resumir()
    }
  }

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Mis horas</p>
          <h1 style={{ marginTop: 6 }}>Citas agendadas</h1>
          <p className="encabezado-pagina__texto">
            Revisa el estado de cada consulta. Puedes cancelar hasta 2 horas antes del inicio.
          </p>
        </div>
        <Link to="/paciente/agendar">
          <Boton>Agendar otra hora</Boton>
        </Link>
      </header>

      {resumen ? (
        <div className="rejilla rejilla--metricas" style={{ marginBottom: 24 }}>
          <Metrica rotulo="Proximos 7 dias" valor={resumen.proximas_7_dias} acento pie="Citas por atender" />
          <Metrica rotulo="Pendientes" valor={resumen.pendientes} pie="Esperan confirmacion" />
          <Metrica rotulo="Confirmadas" valor={resumen.confirmadas} pie="Listas para asistir" />
          <Metrica rotulo="Completadas" valor={resumen.completadas} pie="Historico de atenciones" />
        </div>
      ) : null}

      <div className="filtros">
        {FILTROS.map((item) => (
          <button
            key={item.valor}
            className={`pastilla ${filtro === item.valor ? 'pastilla--activa' : ''}`}
            onClick={() => setFiltro(item.valor)}
          >
            {item.texto}
          </button>
        ))}
      </div>

      {cargandoLista ? (
        <Cargando texto="Cargando tus citas" />
      ) : lista.length === 0 ? (
        <EstadoVacio
          titulo="No hay citas en esta vista"
          texto="Cuando agendes una hora aparecera aqui con su estado y sus recordatorios."
          accion={
            <Link to="/paciente/agendar">
              <Boton pequeno>Agendar hora</Boton>
            </Link>
          }
        />
      ) : (
        <div className="lista-citas">
          {lista.map((cita) => (
            <TarjetaCita key={cita.id} cita={cita} perspectiva="paciente" onCancelar={setPorCancelar} />
          ))}
        </div>
      )}

      <Modal
        abierto={Boolean(porCancelar)}
        titulo="Cancelar la cita"
        onCerrar={() => setPorCancelar(null)}
        pie={
          <>
            <Boton variante="secundario" onClick={() => setPorCancelar(null)}>
              Volver
            </Boton>
            <Boton variante="peligro" cargando={cancelando} onClick={confirmarCancelacion}>
              Cancelar la cita
            </Boton>
          </>
        }
      >
        <p style={{ fontSize: '0.9rem', marginBottom: 14 }}>
          Vas a liberar la hora del {porCancelar?.fecha_hora_inicio.slice(0, 10)} con{' '}
          <strong>{porCancelar?.doctor_nombre}</strong>. Otra persona podra tomarla de inmediato.
        </p>
        <CampoArea
          etiqueta="Motivo (opcional)"
          placeholder="Ej: se me cruzo un compromiso laboral"
          value={motivo}
          onChange={(evento) => setMotivo(evento.target.value)}
        />
      </Modal>
    </>
  )
}
