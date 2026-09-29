import { reportesApi } from '@/api/reportes.api'
import { AvisoError, Cargando } from '@/components/common/Estados'
import { Metrica } from '@/components/common/Metrica'
import { Tabla, type Columna } from '@/components/common/Tabla'
import { GraficoCitasPorDia, GraficoDemanda, GraficoOcupacion } from '@/components/reportes/GraficoOcupacion'
import { usePeticion } from '@/hooks/usePeticion'
import type { DisponibilidadDoctor } from '@/types/api.types'

export const ReportesPage = () => {
  const indicadores = usePeticion(() => reportesApi.indicadores())
  const ocupacion = usePeticion(() => reportesApi.ocupacion())
  const porDia = usePeticion(() => reportesApi.citasPorDia())
  const demanda = usePeticion(() => reportesApi.demandaEspecialidad())
  const disponibilidad = usePeticion(() => reportesApi.disponibilidad(7))

  const cargando =
    indicadores.cargando || ocupacion.cargando || porDia.cargando || demanda.cargando || disponibilidad.cargando
  const error = indicadores.error ?? ocupacion.error ?? porDia.error ?? demanda.error ?? disponibilidad.error

  const columnas: Columna<DisponibilidadDoctor>[] = [
    { clave: 'doctor', titulo: 'Profesional', render: (fila) => <strong>{fila.doctor}</strong> },
    { clave: 'especialidad', titulo: 'Especialidad', render: (fila) => fila.especialidad },
    {
      clave: 'duracion',
      titulo: 'Consulta',
      render: (fila) => <span className="mono">{fila.duracion_consulta} min</span>,
    },
    {
      clave: 'libres',
      titulo: 'Horas libres (7 dias)',
      render: (fila) => (
        <div className="fila" style={{ gap: 10 }}>
          <span className="mono" style={{ minWidth: 28 }}>
            {fila.slots_libres}
          </span>
          <div className="barra-progreso" style={{ flex: 1, minWidth: 80 }}>
            <div className="barra-progreso__relleno" style={{ width: `${Math.min(fila.slots_libres, 100)}%` }} />
          </div>
        </div>
      ),
    },
  ]

  if (cargando) return <Cargando texto="Consolidando reportes" />
  if (error) return <AvisoError mensaje={error} />

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Ultimos 30 dias</p>
          <h1 style={{ marginTop: 6 }}>Panel de gestion</h1>
          <p className="encabezado-pagina__texto">
            Indicadores de operacion, ocupacion de agenda y capacidad disponible de la proxima semana.
          </p>
        </div>
      </header>

      {indicadores.datos ? (
        <div className="rejilla rejilla--metricas" style={{ marginBottom: 24 }}>
          <Metrica rotulo="Citas del periodo" valor={indicadores.datos.total_citas} acento pie="Agendadas en 30 dias" />
          <Metrica rotulo="Pacientes activos" valor={indicadores.datos.total_pacientes} pie="Cuentas registradas" />
          <Metrica rotulo="Profesionales" valor={indicadores.datos.total_doctores} pie="Recibiendo pacientes" />
          <Metrica
            rotulo="Anticipacion media"
            valor={`${indicadores.datos.anticipacion_promedio_horas} h`}
            pie="Entre reserva y consulta"
          />
        </div>
      ) : null}

      <div className="rejilla" style={{ gap: 18 }}>
        <section className="tarjeta">
          <div className="tarjeta__cabecera">
            <div>
              <p className="rotulo">Ocupacion</p>
              <h3 style={{ marginTop: 6 }}>Uso de agenda por profesional</h3>
            </div>
          </div>
          <div className="tarjeta__cuerpo">{ocupacion.datos ? <GraficoOcupacion datos={ocupacion.datos} /> : null}</div>
        </section>

        <div className="rejilla rejilla--dos">
          <section className="tarjeta">
            <div className="tarjeta__cabecera">
              <div>
                <p className="rotulo">Demanda diaria</p>
                <h3 style={{ marginTop: 6 }}>Citas por dia</h3>
              </div>
            </div>
            <div className="tarjeta__cuerpo">{porDia.datos ? <GraficoCitasPorDia datos={porDia.datos} /> : null}</div>
          </section>

          <section className="tarjeta">
            <div className="tarjeta__cabecera">
              <div>
                <p className="rotulo">Especialidades</p>
                <h3 style={{ marginTop: 6 }}>Demanda por area</h3>
              </div>
            </div>
            <div className="tarjeta__cuerpo">{demanda.datos ? <GraficoDemanda datos={demanda.datos} /> : null}</div>
          </section>
        </div>

        <section className="tarjeta">
          <div className="tarjeta__cabecera">
            <div>
              <p className="rotulo">Capacidad</p>
              <h3 style={{ marginTop: 6 }}>Horas libres en los proximos 7 dias</h3>
            </div>
          </div>
          <Tabla columnas={columnas} filas={disponibilidad.datos ?? []} claveDe={(fila) => fila.doctor_id} />
        </section>
      </div>
    </>
  )
}
