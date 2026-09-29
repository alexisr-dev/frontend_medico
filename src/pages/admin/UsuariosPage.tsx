import { useCallback, useEffect, useState } from 'react'
import { UserPlus } from 'lucide-react'
import { adminApi, type NuevoDoctor, type ResumenUsuarios } from '@/api/admin.api'
import { doctoresApi } from '@/api/doctores.api'
import { mensajeDeError } from '@/api/client'
import { Boton } from '@/components/common/Boton'
import { Campo, CampoArea, CampoSelect } from '@/components/common/Campo'
import { Cargando, EstadoVacio } from '@/components/common/Estados'
import { Insignia } from '@/components/common/Insignia'
import { Metrica } from '@/components/common/Metrica'
import { Modal } from '@/components/common/Modal'
import { Tabla, type Columna } from '@/components/common/Tabla'
import { useToast } from '@/components/common/ToastProvider'
import { useDebounce } from '@/hooks/useDebounce'
import { fechaCorta } from '@/utils/fechas'
import type { Especialidad } from '@/types/cita.types'
import type { Usuario } from '@/types/usuario.types'

const ROLES = [
  { valor: '', texto: 'Todos' },
  { valor: 'paciente', texto: 'Pacientes' },
  { valor: 'doctor', texto: 'Doctores' },
  { valor: 'admin', texto: 'Administradores' },
]

const DOCTOR_INICIAL = {
  first_name: '',
  last_name: '',
  email: '',
  telefono: '',
  password: '',
  especialidad_id: '',
  numero_licencia: '',
  duracion_consulta_default: '30',
  biografia: '',
}

export const UsuariosPage = () => {
  const { mostrar } = useToast()
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [resumen, setResumen] = useState<ResumenUsuarios | null>(null)
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([])
  const [rol, setRol] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [cargando, setCargando] = useState(true)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [nuevo, setNuevo] = useState(DOCTOR_INICIAL)
  const [guardando, setGuardando] = useState(false)

  const termino = useDebounce(busqueda)

  const recargar = useCallback(() => {
    setCargando(true)
    Promise.all([
      adminApi.usuarios({ rol: rol || undefined, q: termino.trim() || undefined }),
      adminApi.resumenUsuarios(),
    ])
      .then(([pagina, totales]) => {
        setUsuarios(pagina.resultados)
        setResumen(totales)
      })
      .finally(() => setCargando(false))
  }, [rol, termino])

  useEffect(recargar, [recargar])

  useEffect(() => {
    doctoresApi.especialidades().then(setEspecialidades)
  }, [])

  const alternarActivo = async (usuario: Usuario) => {
    if (usuario.is_active) await adminApi.desactivarUsuario(usuario.id)
    else await adminApi.activarUsuario(usuario.id)
    mostrar(
      usuario.is_active ? 'Cuenta desactivada' : 'Cuenta activada',
      `${usuario.nombre_completo} ${usuario.is_active ? 'ya no puede entrar' : 'vuelve a tener acceso'}.`,
      'exito',
    )
    recargar()
  }

  const crearDoctor = async (evento: React.FormEvent) => {
    evento.preventDefault()
    setGuardando(true)
    try {
      const datos: NuevoDoctor = {
        ...nuevo,
        especialidad_id: Number(nuevo.especialidad_id),
        duracion_consulta_default: Number(nuevo.duracion_consulta_default),
      }
      await adminApi.crearDoctor(datos)
      mostrar('Doctor creado', `${nuevo.first_name} ${nuevo.last_name} ya puede iniciar sesion.`, 'exito')
      setNuevo(DOCTOR_INICIAL)
      setModalAbierto(false)
      recargar()
    } catch (fallo) {
      mostrar('No se pudo crear', mensajeDeError(fallo), 'error')
    } finally {
      setGuardando(false)
    }
  }

  const cambiar = (campo: keyof typeof DOCTOR_INICIAL) => (evento: { target: { value: string } }) =>
    setNuevo((previos) => ({ ...previos, [campo]: evento.target.value }))

  const columnas: Columna<Usuario>[] = [
    { clave: 'nombre', titulo: 'Nombre', render: (fila) => <strong>{fila.nombre_completo}</strong> },
    { clave: 'email', titulo: 'Correo', render: (fila) => <span className="tenue">{fila.email}</span> },
    {
      clave: 'rol',
      titulo: 'Rol',
      render: (fila) => (
        <Insignia tono={fila.rol === 'admin' ? 'alerta' : fila.rol === 'doctor' ? 'activo' : 'neutro'}>
          {fila.rol}
        </Insignia>
      ),
    },
    {
      clave: 'estado',
      titulo: 'Estado',
      render: (fila) => (
        <Insignia tono={fila.is_active ? 'exito' : 'neutro'}>{fila.is_active ? 'Activa' : 'Inactiva'}</Insignia>
      ),
    },
    { clave: 'alta', titulo: 'Alta', render: (fila) => <span className="mono">{fechaCorta(fila.date_joined)}</span> },
    {
      clave: 'acciones',
      titulo: '',
      ancho: '130px',
      render: (fila) => (
        <Boton pequeno variante={fila.is_active ? 'peligro' : 'secundario'} onClick={() => alternarActivo(fila)}>
          {fila.is_active ? 'Desactivar' : 'Activar'}
        </Boton>
      ),
    },
  ]

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Administracion</p>
          <h1 style={{ marginTop: 6 }}>Usuarios del sistema</h1>
          <p className="encabezado-pagina__texto">
            Da de alta profesionales, revisa las cuentas registradas y desactiva accesos cuando corresponda.
          </p>
        </div>
        <Boton icono={<UserPlus size={16} />} onClick={() => setModalAbierto(true)}>
          Dar de alta un doctor
        </Boton>
      </header>

      {resumen ? (
        <div className="rejilla rejilla--metricas" style={{ marginBottom: 24 }}>
          <Metrica rotulo="Cuentas totales" valor={resumen.total} acento />
          <Metrica rotulo="Pacientes" valor={resumen.pacientes} />
          <Metrica rotulo="Doctores" valor={resumen.doctores} />
          <Metrica rotulo="Inactivas" valor={resumen.inactivos} pie="Sin acceso al sistema" />
        </div>
      ) : null}

      <div className="filtros">
        {ROLES.map((item) => (
          <button
            key={item.valor}
            className={`pastilla ${rol === item.valor ? 'pastilla--activa' : ''}`}
            onClick={() => setRol(item.valor)}
          >
            {item.texto}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 340, marginBottom: 20 }}>
        <Campo
          etiqueta="Buscar"
          placeholder="Nombre o correo"
          value={busqueda}
          onChange={(evento) => setBusqueda(evento.target.value)}
        />
      </div>

      {cargando ? (
        <Cargando texto="Cargando usuarios" />
      ) : (
        <section className="tarjeta">
          <Tabla
            columnas={columnas}
            filas={usuarios}
            claveDe={(fila) => fila.id}
            vacio={<EstadoVacio titulo="Sin resultados" texto="Ajusta el filtro de rol o la busqueda." />}
          />
        </section>
      )}

      <Modal abierto={modalAbierto} titulo="Dar de alta un doctor" onCerrar={() => setModalAbierto(false)}>
        <form className="apilar" style={{ gap: 13 }} onSubmit={crearDoctor}>
          <div className="rejilla" style={{ gridTemplateColumns: '1fr 1fr', gap: 11 }}>
            <Campo etiqueta="Nombres" required value={nuevo.first_name} onChange={cambiar('first_name')} />
            <Campo etiqueta="Apellidos" required value={nuevo.last_name} onChange={cambiar('last_name')} />
          </div>
          <Campo etiqueta="Correo" type="email" required value={nuevo.email} onChange={cambiar('email')} />
          <Campo etiqueta="Telefono" value={nuevo.telefono} onChange={cambiar('telefono')} />
          <Campo
            etiqueta="Contrasena inicial"
            type="password"
            required
            ayuda="Al menos 8 caracteres, con letras y numeros."
            value={nuevo.password}
            onChange={cambiar('password')}
          />
          <CampoSelect etiqueta="Especialidad" required value={nuevo.especialidad_id} onChange={cambiar('especialidad_id')}>
            <option value="">Selecciona una especialidad</option>
            {especialidades.map((item) => (
              <option key={item.id} value={item.id}>
                {item.nombre}
              </option>
            ))}
          </CampoSelect>
          <div className="rejilla" style={{ gridTemplateColumns: '1fr 1fr', gap: 11 }}>
            <Campo
              etiqueta="Numero de licencia"
              required
              value={nuevo.numero_licencia}
              onChange={cambiar('numero_licencia')}
            />
            <Campo
              etiqueta="Duracion de consulta (min)"
              type="number"
              min={10}
              max={180}
              value={nuevo.duracion_consulta_default}
              onChange={cambiar('duracion_consulta_default')}
            />
          </div>
          <CampoArea etiqueta="Biografia" value={nuevo.biografia} onChange={cambiar('biografia')} />
          <Boton type="submit" cargando={guardando}>
            Crear cuenta de doctor
          </Boton>
        </form>
      </Modal>
    </>
  )
}
