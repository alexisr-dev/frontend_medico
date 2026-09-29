import { useEffect, useState } from 'react'
import { Cargando, EstadoVacio } from '@/components/common/Estados'
import { InsigniaEstado } from '@/components/common/Insignia'
import { Metrica } from '@/components/common/Metrica'
import { Tabla, type Columna } from '@/components/common/Tabla'
import { useCitas } from '@/features/citas/useCitas'
import { fechaYHora } from '@/utils/fechas'
import type { Cita, EstadoCita } from '@/types/cita.types'

const FILTROS: { valor: EstadoCita | 'todas'; texto: string }[] = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'pendiente', texto: 'Pendientes' },
  { valor: 'confirmada', texto: 'Confirmadas' },
  { valor: 'completada', texto: 'Completadas' },
  { valor: 'cancelada', texto: 'Canceladas' },
  { valor: 'no_asistio', texto: 'No asistio' },
]

export const CitasPage = () => {
  const { lista, total, cargandoLista, resumen, listar, resumir } = useCitas()
  const [filtro, setFiltro] = useState<EstadoCita | 'todas'>('todas')

  useEffect(() => {
    resumir()
  }, [resumir])

  useEffect(() => {
    listar(filtro === 'todas' ? { page_size: 50 } : { estado: filtro, page_size: 50 })
  }, [filtro, listar])

  const columnas: Columna<Cita>[] = [
    {
      clave: 'fecha',
      titulo: 'Fecha y hora',
      render: (fila) => <span className="mono">{fechaYHora(fila.fecha_hora_inicio)}</span>,
    },
    { clave: 'paciente', titulo: 'Paciente', render: (fila) => <strong>{fila.paciente_nombre}</strong> },
    {
      clave: 'doctor',
      titulo: 'Profesional',
      render: (fila) => (
        <div>
          <p>{fila.doctor_nombre}</p>
          <p className="tenue" style={{ fontSize: '0.78rem' }}>
            {fila.especialidad}
          </p>
        </div>
      ),
    },
    {
      clave: 'duracion',
      titulo: 'Duracion',
      render: (fila) => <span className="mono">{fila.duracion_minutos} min</span>,
    },
    { clave: 'estado', titulo: 'Estado', render: (fila) => <InsigniaEstado estado={fila.estado} /> },
    {
      clave: 'motivo',
      titulo: 'Motivo',
      render: (fila) => (
        <span className="tenue" style={{ display: 'block', maxWidth: 260 }}>
          {fila.motivo_consulta}
        </span>
      ),
    },
  ]

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Operacion</p>
          <h1 style={{ marginTop: 6 }}>Todas las citas</h1>
          <p className="encabezado-pagina__texto">
            Vista transversal de la agenda de la clinica, con el estado de cada consulta.
          </p>
        </div>
      </header>

      {resumen ? (
        <div className="rejilla rejilla--metricas" style={{ marginBottom: 24 }}>
          <Metrica rotulo="Total historico" valor={resumen.total} acento />
          <Metrica rotulo="Pendientes" valor={resumen.pendientes} pie="Sin confirmar" />
          <Metrica rotulo="Completadas" valor={resumen.completadas} pie="Con registro clinico" />
          <Metrica rotulo="No asistio" valor={resumen.no_asistio} pie="Ausencias registradas" />
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
        <Cargando texto="Cargando citas" />
      ) : (
        <section className="tarjeta">
          <Tabla
            columnas={columnas}
            filas={lista}
            claveDe={(fila) => fila.id}
            vacio={<EstadoVacio titulo="Sin citas en este filtro" texto="Cambia el estado seleccionado." />}
          />
          {lista.length > 0 ? (
            <div className="paginador">
              <span className="rotulo">
                Mostrando {lista.length} de {total}
              </span>
            </div>
          ) : null}
        </section>
      )}
    </>
  )
}
