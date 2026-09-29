import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Users } from 'lucide-react'
import { historialesApi } from '@/api/historiales.api'
import { Boton } from '@/components/common/Boton'
import { Campo } from '@/components/common/Campo'
import { Cargando, EstadoVacio } from '@/components/common/Estados'
import { Tabla, type Columna } from '@/components/common/Tabla'
import { useDebounce } from '@/hooks/useDebounce'
import type { PacienteResumen } from '@/types/usuario.types'

export const MisPacientesPage = () => {
  const [pacientes, setPacientes] = useState<PacienteResumen[]>([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const termino = useDebounce(busqueda)

  useEffect(() => {
    setCargando(true)
    historialesApi
      .misPacientes(termino.trim() || undefined)
      .then(setPacientes)
      .catch(() => setPacientes([]))
      .finally(() => setCargando(false))
  }, [termino])

  const columnas: Columna<PacienteResumen>[] = [
    { clave: 'nombre', titulo: 'Paciente', render: (fila) => <strong>{fila.nombre_completo}</strong> },
    { clave: 'email', titulo: 'Correo', render: (fila) => <span className="tenue">{fila.email}</span> },
    {
      clave: 'edad',
      titulo: 'Edad',
      render: (fila) => <span className="mono">{fila.edad != null ? `${fila.edad}` : '—'}</span>,
    },
    { clave: 'genero', titulo: 'Genero', render: (fila) => fila.genero || <span className="tenue">—</span> },
    {
      clave: 'accion',
      titulo: '',
      ancho: '150px',
      render: (fila) => (
        <Link to={`/doctor/pacientes/${fila.id}`}>
          <Boton pequeno variante="secundario">
            Ver historial
          </Boton>
        </Link>
      ),
    },
  ]

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Cartera</p>
          <h1 style={{ marginTop: 6 }}>Mis pacientes</h1>
          <p className="encabezado-pagina__texto">
            Solo aparecen los pacientes con quienes tienes o tuviste una cita. Cada apertura de ficha queda auditada.
          </p>
        </div>
      </header>

      <div style={{ maxWidth: 340, marginBottom: 20 }}>
        <Campo
          etiqueta="Buscar paciente"
          placeholder="Nombre o correo"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
      </div>

      {cargando ? (
        <Cargando texto="Buscando pacientes" />
      ) : (
        <section className="tarjeta">
          <Tabla
            columnas={columnas}
            filas={pacientes}
            claveDe={(fila) => fila.id}
            vacio={
              <EstadoVacio
                titulo="Todavia no tienes pacientes"
                texto="Cuando alguien reserve una hora contigo, su ficha quedara accesible desde aqui."
                icono={<Users size={22} />}
              />
            }
          />
        </section>
      )}
    </>
  )
}
