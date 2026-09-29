import { useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { cerrarSesion, iniciarSesion, limpiarError, registrarPaciente } from './authSlice'
import type { CredencialesLogin, DatosRegistro } from '@/types/usuario.types'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { usuario, cargando, iniciando, error } = useAppSelector((estado) => estado.auth)

  const entrar = useCallback(
    (credenciales: CredencialesLogin) => dispatch(iniciarSesion(credenciales)).unwrap(),
    [dispatch],
  )

  const registrar = useCallback((datos: DatosRegistro) => dispatch(registrarPaciente(datos)).unwrap(), [dispatch])

  const salir = useCallback(() => dispatch(cerrarSesion()), [dispatch])

  const descartarError = useCallback(() => dispatch(limpiarError()), [dispatch])

  return {
    usuario,
    cargando,
    iniciando,
    error,
    autenticado: Boolean(usuario),
    esPaciente: usuario?.rol === 'paciente',
    esDoctor: usuario?.rol === 'doctor',
    esAdmin: usuario?.rol === 'admin',
    entrar,
    registrar,
    salir,
    descartarError,
  }
}
