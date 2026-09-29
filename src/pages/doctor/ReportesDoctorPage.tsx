import { reportesApi } from '@/api/reportes.api'
import { AvisoError, Cargando } from '@/components/common/Estados'
import { Metrica } from '@/components/common/Metrica'
import { GraficoCitasPorDia, GraficoOcupacion } from '@/components/reportes/GraficoOcupacion'
import { usePeticion } from '@/hooks/usePeticion'

export const ReportesDoctorPage = () => {
  const ocupacion = usePeticion(() => reportesApi.ocupacion())
  const noAsistencia = usePeticion(() => reportesApi.noAsistencia())
  const porDia = usePeticion(() => reportesApi.citasPorDia())

  const cargando = ocupacion.cargando || noAsistencia.cargando || porDia.cargando
  const error = ocupacion.error ?? noAsistencia.error ?? porDia.error

  if (cargando) return <Cargando texto="Calculando indicadores" />
  if (error) return <AvisoError mensaje={error} />

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Ultimos 30 dias</p>
          <h1 style={{ marginTop: 6 }}>Reportes de la clinica</h1>
          <p className="encabezado-pagina__texto">
            Ocupacion por profesional, evolucion diaria de la demanda y tasa de inasistencia.
          </p>
        </div>
      </header>

      {noAsistencia.datos ? (
        <div className="rejilla rejilla--metricas" style={{ marginBottom: 24 }}>
          <Metrica rotulo="Citas del periodo" valor={noAsistencia.datos.total_citas} acento pie="Agendadas en 30 dias" />
          <Metrica rotulo="Finalizadas" valor={noAsistencia.datos.finalizadas} pie="Completadas + no asistio" />
          <Metrica
            rotulo="Tasa de inasistencia"
            valor={`${noAsistencia.datos.tasa_no_asistencia}%`}
            pie="Sobre citas finalizadas"
          />
          <Metrica
            rotulo="Tasa de cancelacion"
            valor={`${noAsistencia.datos.tasa_cancelacion}%`}
            pie="Sobre el total agendado"
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
          <div className="tarjeta__cuerpo">
            {ocupacion.datos ? <GraficoOcupacion datos={ocupacion.datos} /> : null}
          </div>
        </section>

        <section className="tarjeta">
          <div className="tarjeta__cabecera">
            <div>
              <p className="rotulo">Demanda diaria</p>
              <h3 style={{ marginTop: 6 }}>Citas agendadas por dia</h3>
            </div>
          </div>
          <div className="tarjeta__cuerpo">{porDia.datos ? <GraficoCitasPorDia datos={porDia.datos} /> : null}</div>
        </section>
      </div>
    </>
  )
}
