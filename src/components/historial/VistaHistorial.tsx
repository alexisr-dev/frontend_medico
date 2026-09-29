import { FileText } from 'lucide-react'
import { EstadoVacio } from '@/components/common/Estados'
import { Insignia } from '@/components/common/Insignia'
import { fechaYHora } from '@/utils/fechas'
import type { HistorialMedico } from '@/types/historial.types'

const SECCIONES: { clave: keyof HistorialMedico; titulo: string }[] = [
  { clave: 'alergias', titulo: 'Alergias' },
  { clave: 'enfermedades_cronicas', titulo: 'Enfermedades cronicas' },
  { clave: 'medicamentos_actuales', titulo: 'Medicamentos actuales' },
  { clave: 'antecedentes_familiares', titulo: 'Antecedentes familiares' },
]

export const VistaHistorial = ({ historial }: { historial: HistorialMedico }) => (
  <div className="rejilla" style={{ gap: 18 }}>
    <section className="tarjeta">
      <div className="tarjeta__cabecera">
        <div>
          <p className="rotulo">Ficha clinica</p>
          <h2 style={{ marginTop: 6 }}>{historial.paciente_nombre}</h2>
          <p className="tenue" style={{ fontSize: '0.85rem' }}>
            {historial.edad ? `${historial.edad} anos` : 'Edad no registrada'}
            {historial.genero ? ` · ${historial.genero}` : ''}
          </p>
        </div>
        {historial.tipo_sangre ? <Insignia tono="alerta">Grupo {historial.tipo_sangre}</Insignia> : null}
      </div>

      <div className="tarjeta__cuerpo" style={{ paddingTop: 6, paddingBottom: 6 }}>
        {SECCIONES.map((seccion) => (
          <div className="historial-seccion" key={seccion.clave}>
            <p className="rotulo">{seccion.titulo}</p>
            <p style={{ fontSize: '0.9rem' }}>
              {(historial[seccion.clave] as string) || <span className="tenue">Sin registro</span>}
            </p>
          </div>
        ))}
      </div>
    </section>

    <section className="tarjeta">
      <div className="tarjeta__cabecera">
        <div>
          <p className="rotulo">Consultas registradas</p>
          <h3 style={{ marginTop: 6 }}>{historial.registros.length} atenciones</h3>
        </div>
      </div>

      <div className="tarjeta__cuerpo">
        {historial.registros.length === 0 ? (
          <EstadoVacio
            titulo="Aun no hay consultas registradas"
            texto="Las atenciones completadas apareceran aqui con su diagnostico, tratamiento y recetas."
            icono={<FileText size={22} />}
          />
        ) : (
          <div className="linea-consultas">
            {historial.registros.map((registro) => (
              <article className="consulta" key={registro.id}>
                <p className="consulta__fecha">
                  {fechaYHora(registro.fecha_consulta)} · {registro.doctor_nombre} · {registro.especialidad}
                </p>
                <h4 className="consulta__diagnostico">{registro.diagnostico}</h4>
                {registro.tratamiento ? <p className="consulta__detalle">Tratamiento: {registro.tratamiento}</p> : null}
                {registro.notas ? <p className="consulta__detalle">{registro.notas}</p> : null}

                {registro.recetas.map((receta) => (
                  <div className="receta" key={receta.id}>
                    <span className="receta__nombre">{receta.medicamento}</span>
                    <span className="receta__pauta">
                      {receta.dosis} · {receta.frecuencia} · {receta.duracion}
                    </span>
                  </div>
                ))}
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  </div>
)
