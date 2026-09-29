import { historialesApi } from '@/api/historiales.api'
import { AvisoError, Cargando } from '@/components/common/Estados'
import { VistaHistorial } from '@/components/historial/VistaHistorial'
import { usePeticion } from '@/hooks/usePeticion'

export const MiHistorialPage = () => {
  const { datos, cargando, error } = usePeticion(() => historialesApi.miHistorial())

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Ficha clinica</p>
          <h1 style={{ marginTop: 6 }}>Mi historial medico</h1>
          <p className="encabezado-pagina__texto">
            Tus datos clinicos estan cifrados. Cada vez que un profesional abre esta ficha queda un registro de
            auditoria con su identidad y la hora del acceso.
          </p>
        </div>
      </header>

      {cargando ? <Cargando texto="Descifrando ficha" /> : null}
      {error ? <AvisoError mensaje={error} /> : null}
      {datos ? <VistaHistorial historial={datos} /> : null}
    </>
  )
}
