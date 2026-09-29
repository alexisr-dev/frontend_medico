import { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@/components/common/ToastProvider'
import { cerrarSesion, restaurarSesion } from '@/features/auth/authSlice'
import { AppRoutes } from '@/routes/AppRoutes'
import { useAppDispatch } from '@/store/hooks'

const Inicializador = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(restaurarSesion())
  }, [dispatch])

  useEffect(() => {
    const alExpirar = () => dispatch(cerrarSesion())
    window.addEventListener('sesion:expirada', alExpirar)
    return () => window.removeEventListener('sesion:expirada', alExpirar)
  }, [dispatch])

  return <AppRoutes />
}

export const App = () => (
  <BrowserRouter>
    <ToastProvider>
      <Inicializador />
    </ToastProvider>
  </BrowserRouter>
)
