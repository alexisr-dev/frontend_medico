import { Link, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { historialesApi } from '@/api/historiales.api'
import { Boton } from '@/components/common/Boton'
import { AvisoError, Cargando } from '@/components/common/Estados'
import { VistaHistorial } from '@/components/historial/VistaHistorial'
import { usePeticion } from '@/hooks/usePeticion'

export const PacienteHistorialPage = () => {
  const { pacienteId } = useParams<{ pacienteId: string }>()
  const { datos, cargando, error } = usePeticion(
    () => historialesApi.porPaciente(Number(pacienteId)),
    [pacienteId],
  )

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <Link to="/doctor/pacientes">
            <Boton variante="fantasma" pequeno icono={<ArrowLeft size={15} />}>
              Volver a mis pacientes
            </Boton>
          </Link>
          <h1 style={{ marginTop: 10 }}>{datos?.paciente_nombre ?? 'Historial del paciente'}</h1>
          <p className="encabezado-pagina__texto">
            Este acceso quedo registrado en la auditoria con tu identidad, la hora y la direccion IP.
          </p>
        </div>
      </header>

      {cargando ? <Cargando texto="Descifrando ficha" /> : null}
      {error ? <AvisoError mensaje={error} /> : null}
      {datos ? <VistaHistorial historial={datos} /> : null}
    </>
  )
}
