import { Navigate, useLocation } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/features/auth/useAuth'
import { Cargando } from '@/components/common/Estados'
import type { Rol } from '@/types/usuario.types'

export const RUTA_INICIAL: Record<Rol, string> = {
  paciente: '/paciente/agendar',
  doctor: '/doctor/agenda',
  admin: '/admin/reportes',
}

export const RutaProtegida = ({ roles, children }: { roles: Rol[]; children: ReactNode }) => {
  const { usuario, iniciando } = useAuth()
  const ubicacion = useLocation()

  if (iniciando) return <Cargando texto="Verificando sesion" />
  if (!usuario) return <Navigate to="/entrar" state={{ desde: ubicacion.pathname }} replace />
  if (!roles.includes(usuario.rol)) return <Navigate to={RUTA_INICIAL[usuario.rol]} replace />

  return <>{children}</>
}

export const RutaPublica = ({ children }: { children: ReactNode }) => {
  const { usuario, iniciando } = useAuth()

  if (iniciando) return <Cargando texto="Verificando sesion" />
  if (usuario) return <Navigate to={RUTA_INICIAL[usuario.rol]} replace />

  return <>{children}</>
}
