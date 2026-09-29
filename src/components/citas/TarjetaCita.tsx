import { motion } from 'framer-motion'
import { Boton } from '@/components/common/Boton'
import { InsigniaEstado } from '@/components/common/Insignia'
import { etiquetaDia, fechaCorta, hora, rangoHorario } from '@/utils/fechas'
import type { Cita } from '@/types/cita.types'

interface Props {
  cita: Cita
  perspectiva: 'paciente' | 'doctor'
  onCancelar?: (cita: Cita) => void
  onReprogramar?: (cita: Cita) => void
  onConfirmar?: (cita: Cita) => void
  onCerrar?: (cita: Cita) => void
  onVerHistorial?: (cita: Cita) => void
}

export const TarjetaCita = ({
  cita,
  perspectiva,
  onCancelar,
  onReprogramar,
  onConfirmar,
  onCerrar,
  onVerHistorial,
}: Props) => {
  const contraparte = perspectiva === 'paciente' ? cita.doctor_nombre : cita.paciente_nombre
  const detalle = perspectiva === 'paciente' ? cita.especialidad : cita.paciente_email

  return (
    <motion.article
      className="cita-tarjeta"
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: [0.22, 0.61, 0.36, 1] }}
    >
      <div className="cita-tarjeta__hora">
        <span className="cita-tarjeta__hora-valor">{hora(cita.fecha_hora_inicio)}</span>
        <span className="cita-tarjeta__hora-dia">{etiquetaDia(cita.fecha_hora_inicio)}</span>
      </div>

      <div className="cita-tarjeta__cuerpo">
        <div className="fila" style={{ gap: 10, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <div>
            <p className="cita-tarjeta__titulo">{contraparte}</p>
            <p className="cita-tarjeta__meta">
              {detalle} · {fechaCorta(cita.fecha_hora_inicio)} · {rangoHorario(cita.fecha_hora_inicio, cita.fecha_hora_fin)}
            </p>
          </div>
          <InsigniaEstado estado={cita.estado} />
        </div>

        <p className="cita-tarjeta__motivo">{cita.motivo_consulta}</p>

        {cita.motivo_cancelacion ? (
          <p className="cita-tarjeta__meta" style={{ marginTop: 6 }}>
            Motivo de cancelacion: {cita.motivo_cancelacion}
          </p>
        ) : null}

        {cita.notas_doctor ? (
          <p className="cita-tarjeta__meta" style={{ marginTop: 6 }}>
            Notas: {cita.notas_doctor}
          </p>
        ) : null}

        <div className="cita-tarjeta__acciones">
          {onConfirmar && cita.estado === 'pendiente' ? (
            <Boton pequeno onClick={() => onConfirmar(cita)}>
              Confirmar
            </Boton>
          ) : null}
          {onCerrar && cita.estado === 'confirmada' ? (
            <Boton pequeno variante="secundario" onClick={() => onCerrar(cita)}>
              Registrar atencion
            </Boton>
          ) : null}
          {onVerHistorial ? (
            <Boton pequeno variante="secundario" onClick={() => onVerHistorial(cita)}>
              Ver historial
            </Boton>
          ) : null}
          {onReprogramar && cita.puede_cancelarse ? (
            <Boton pequeno variante="secundario" onClick={() => onReprogramar(cita)}>
              Reprogramar
            </Boton>
          ) : null}
          {onCancelar && cita.puede_cancelarse ? (
            <Boton pequeno variante="peligro" onClick={() => onCancelar(cita)}>
              Cancelar
            </Boton>
          ) : null}
        </div>
      </div>
    </motion.article>
  )
}
