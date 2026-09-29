import { useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Bell, LogOut } from 'lucide-react'
import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { cargarNotificaciones, marcarLeida, marcarTodasLeidas } from '@/features/notificaciones/notificacionesSlice'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { relativo } from '@/utils/fechas'

export interface EnlaceNav {
  a: string
  texto: string
  icono: ReactNode
}

interface Props {
  enlaces: EnlaceNav[]
  rotuloRol: string
}

const iniciales = (nombre: string) =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((parte) => parte[0]?.toUpperCase())
    .join('')

export const Shell = ({ enlaces, rotuloRol }: Props) => {
  const { usuario, salir } = useAuth()
  const dispatch = useAppDispatch()
  const { lista, noLeidas } = useAppSelector((estado) => estado.notificaciones)
  const [panelAbierto, setPanelAbierto] = useState(false)
  const contenedor = useRef<HTMLDivElement>(null)
  const ubicacion = useLocation()

  useEffect(() => {
    dispatch(cargarNotificaciones())
    const intervalo = setInterval(() => dispatch(cargarNotificaciones()), 60000)
    return () => clearInterval(intervalo)
  }, [dispatch])

  useEffect(() => {
    setPanelAbierto(false)
  }, [ubicacion.pathname])

  useEffect(() => {
    const alHacerClic = (evento: MouseEvent) => {
      if (contenedor.current && !contenedor.current.contains(evento.target as Node)) setPanelAbierto(false)
    }
    document.addEventListener('mousedown', alHacerClic)
    return () => document.removeEventListener('mousedown', alHacerClic)
  }, [])

  const tituloActual = enlaces.find((enlace) => ubicacion.pathname.startsWith(enlace.a))?.texto ?? 'Panel'

  return (
    <div className="shell">
      <nav className="rail">
        <div className="rail__marca">
          <img src="/logo.svg" alt="" width={30} height={30} />
          <div>
            <p className="rail__marca-texto">Meridiano</p>
            <p className="rail__rol">{rotuloRol}</p>
          </div>
        </div>

        {enlaces.map((enlace) => (
          <NavLink
            key={enlace.a}
            to={enlace.a}
            className={({ isActive }) => `rail__enlace ${isActive ? 'rail__enlace--activo' : ''}`}
          >
            {enlace.icono}
            {enlace.texto}
          </NavLink>
        ))}

        <div className="rail__pie">
          <div className="rail__usuario">
            <span className="avatar" aria-hidden>
              {iniciales(usuario?.nombre_completo ?? '')}
            </span>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.84rem', fontWeight: 550, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario?.nombre_completo}
              </p>
              <p className="tenue" style={{ fontSize: '0.74rem', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {usuario?.email}
              </p>
            </div>
          </div>
          <button className="rail__enlace" onClick={salir} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer' }}>
            <LogOut size={17} />
            Cerrar sesion
          </button>
        </div>
      </nav>

      <div className="principal">
        <header className="barra">
          <p className="barra__titulo">{tituloActual}</p>

          <div className="barra__acciones" ref={contenedor} style={{ position: 'relative' }}>
            <button
              className="campana"
              onClick={() => setPanelAbierto((abierto) => !abierto)}
              aria-label={`Notificaciones${noLeidas ? `, ${noLeidas} sin leer` : ''}`}
            >
              <Bell size={18} />
              {noLeidas > 0 ? <span className="campana__punto">{noLeidas > 9 ? '9+' : noLeidas}</span> : null}
            </button>

            {panelAbierto ? (
              <div className="panel-notificaciones">
                <div className="panel-notificaciones__cabecera">
                  <p className="rotulo">Notificaciones</p>
                  {noLeidas > 0 ? (
                    <button
                      className="boton boton--fantasma boton--sm"
                      onClick={() => dispatch(marcarTodasLeidas())}
                    >
                      Marcar todas
                    </button>
                  ) : null}
                </div>

                {lista.length === 0 ? (
                  <p className="tenue" style={{ padding: '24px 16px', fontSize: '0.86rem', textAlign: 'center' }}>
                    No tienes notificaciones.
                  </p>
                ) : (
                  lista.map((notificacion) => (
                    <div
                      key={notificacion.id}
                      className={`notificacion ${notificacion.leido ? '' : 'notificacion--nueva'}`}
                      onClick={() => !notificacion.leido && dispatch(marcarLeida(notificacion.id))}
                    >
                      {!notificacion.leido ? <span className="notificacion__punto" aria-hidden /> : null}
                      <div>
                        <p style={{ fontSize: '0.86rem', fontWeight: 550 }}>{notificacion.titulo}</p>
                        <p className="tenue" style={{ fontSize: '0.8rem' }}>
                          {notificacion.mensaje}
                        </p>
                        <p className="rotulo" style={{ marginTop: 4 }}>
                          {relativo(notificacion.created_at)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : null}
          </div>
        </header>

        <main className="contenido">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
