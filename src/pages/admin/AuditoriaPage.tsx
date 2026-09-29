import { useCallback, useEffect, useState } from 'react'
import { ShieldCheck } from 'lucide-react'
import { adminApi } from '@/api/admin.api'
import { Cargando, EstadoVacio } from '@/components/common/Estados'
import { Insignia } from '@/components/common/Insignia'
import { Metrica } from '@/components/common/Metrica'
import { Tabla, type Columna } from '@/components/common/Tabla'
import { fechaYHora } from '@/utils/fechas'
import type { RegistroAuditoria } from '@/types/api.types'

const ACCIONES = [
  { valor: '', texto: 'Todas' },
  { valor: 'lectura', texto: 'Lecturas' },
  { valor: 'escritura', texto: 'Escrituras' },
  { valor: 'eliminacion', texto: 'Eliminaciones' },
]

const TONO_ACCION: Record<string, 'activo' | 'espera' | 'alerta' | 'neutro'> = {
  lectura: 'activo',
  escritura: 'espera',
  eliminacion: 'alerta',
  exportacion: 'neutro',
}

export const AuditoriaPage = () => {
  const [registros, setRegistros] = useState<RegistroAuditoria[]>([])
  const [total, setTotal] = useState(0)
  const [accion, setAccion] = useState('')
  const [cargando, setCargando] = useState(true)

  const recargar = useCallback(() => {
    setCargando(true)
    adminApi
      .auditoria({ accion: accion || undefined })
      .then((pagina) => {
        setRegistros(pagina.resultados)
        setTotal(pagina.total)
      })
      .finally(() => setCargando(false))
  }, [accion])

  useEffect(recargar, [recargar])

  const lecturas = registros.filter((fila) => fila.accion === 'lectura').length
  const escrituras = registros.filter((fila) => fila.accion === 'escritura').length

  const columnas: Columna<RegistroAuditoria>[] = [
    { clave: 'fecha', titulo: 'Fecha', render: (fila) => <span className="mono">{fechaYHora(fila.fecha)}</span> },
    {
      clave: 'usuario',
      titulo: 'Quien accedio',
      render: (fila) => (
        <div>
          <p>
            <strong>{fila.usuario_nombre || 'Cuenta eliminada'}</strong>
          </p>
          <p className="tenue" style={{ fontSize: '0.78rem' }}>
            {fila.usuario_email} · {fila.usuario_rol}
          </p>
        </div>
      ),
    },
    {
      clave: 'accion',
      titulo: 'Accion',
      render: (fila) => <Insignia tono={TONO_ACCION[fila.accion] ?? 'neutro'}>{fila.accion_display}</Insignia>,
    },
    { clave: 'modelo', titulo: 'Recurso', render: (fila) => fila.modelo_afectado },
    {
      clave: 'objeto',
      titulo: 'Objeto',
      render: (fila) => <span className="mono">{fila.objeto_id || '—'}</span>,
    },
    { clave: 'ip', titulo: 'IP', render: (fila) => <span className="mono">{fila.ip_address ?? '—'}</span> },
  ]

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Cumplimiento</p>
          <h1 style={{ marginTop: 6 }}>Auditoria de accesos clinicos</h1>
          <p className="encabezado-pagina__texto">
            Cada lectura y escritura sobre historiales, consultas y recetas queda registrada con el usuario, la
            hora y la direccion IP de origen.
          </p>
        </div>
      </header>

      <div className="rejilla rejilla--metricas" style={{ marginBottom: 24 }}>
        <Metrica rotulo="Registros totales" valor={total} acento pie="Desde el inicio del sistema" />
        <Metrica rotulo="Lecturas en pagina" valor={lecturas} pie="Consultas a ficha clinica" />
        <Metrica rotulo="Escrituras en pagina" valor={escrituras} pie="Modificaciones registradas" />
      </div>

      <div className="filtros">
        {ACCIONES.map((item) => (
          <button
            key={item.valor}
            className={`pastilla ${accion === item.valor ? 'pastilla--activa' : ''}`}
            onClick={() => setAccion(item.valor)}
          >
            {item.texto}
          </button>
        ))}
      </div>

      {cargando ? (
        <Cargando texto="Cargando registros" />
      ) : (
        <section className="tarjeta">
          <Tabla
            columnas={columnas}
            filas={registros}
            claveDe={(fila) => fila.id}
            vacio={
              <EstadoVacio
                titulo="Sin accesos registrados"
                texto="Los accesos a fichas clinicas apareceran aqui apenas ocurran."
                icono={<ShieldCheck size={22} />}
              />
            }
          />
        </section>
      )}
    </>
  )
}
