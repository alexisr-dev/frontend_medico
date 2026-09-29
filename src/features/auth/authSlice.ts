import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { authApi } from '@/api/auth.api'
import { guardarTokens, limpiarTokens, mensajeDeError, tokenActual } from '@/api/client'
import type { CredencialesLogin, DatosRegistro, SesionUsuario } from '@/types/usuario.types'

interface EstadoAuth {
  usuario: SesionUsuario | null
  cargando: boolean
  iniciando: boolean
  error: string | null
}

const estadoInicial: EstadoAuth = {
  usuario: null,
  cargando: false,
  iniciando: Boolean(tokenActual()),
  error: null,
}

export const iniciarSesion = createAsyncThunk<SesionUsuario, CredencialesLogin, { rejectValue: string }>(
  'auth/iniciarSesion',
  async (credenciales, { rejectWithValue }) => {
    try {
      const datos = await authApi.login(credenciales)
      guardarTokens(datos.access, datos.refresh)
      return { ...datos.usuario, perfil_id: datos.perfil_id }
    } catch (error) {
      return rejectWithValue(mensajeDeError(error, 'Credenciales incorrectas.'))
    }
  },
)

export const registrarPaciente = createAsyncThunk<SesionUsuario, DatosRegistro, { rejectValue: string }>(
  'auth/registrarPaciente',
  async (datos, { rejectWithValue }) => {
    try {
      await authApi.registro(datos)
      const sesion = await authApi.login({ email: datos.email, password: datos.password })
      guardarTokens(sesion.access, sesion.refresh)
      return { ...sesion.usuario, perfil_id: sesion.perfil_id }
    } catch (error) {
      return rejectWithValue(mensajeDeError(error, 'No fue posible crear la cuenta.'))
    }
  },
)

export const restaurarSesion = createAsyncThunk<SesionUsuario | null, void>('auth/restaurarSesion', async () => {
  if (!tokenActual()) return null
  try {
    return await authApi.yo()
  } catch {
    limpiarTokens()
    return null
  }
})

const authSlice = createSlice({
  name: 'auth',
  initialState: estadoInicial,
  reducers: {
    cerrarSesion: (estado) => {
      limpiarTokens()
      estado.usuario = null
      estado.error = null
    },
    limpiarError: (estado) => {
      estado.error = null
    },
    actualizarUsuario: (estado, accion: { payload: Partial<SesionUsuario> }) => {
      if (estado.usuario) estado.usuario = { ...estado.usuario, ...accion.payload }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(iniciarSesion.pending, (estado) => {
        estado.cargando = true
        estado.error = null
      })
      .addCase(iniciarSesion.fulfilled, (estado, accion) => {
        estado.cargando = false
        estado.usuario = accion.payload
      })
      .addCase(iniciarSesion.rejected, (estado, accion) => {
        estado.cargando = false
        estado.error = accion.payload ?? 'No fue posible iniciar sesion.'
      })
      .addCase(registrarPaciente.pending, (estado) => {
        estado.cargando = true
        estado.error = null
      })
      .addCase(registrarPaciente.fulfilled, (estado, accion) => {
        estado.cargando = false
        estado.usuario = accion.payload
      })
      .addCase(registrarPaciente.rejected, (estado, accion) => {
        estado.cargando = false
        estado.error = accion.payload ?? 'No fue posible crear la cuenta.'
      })
      .addCase(restaurarSesion.pending, (estado) => {
        estado.iniciando = true
      })
      .addCase(restaurarSesion.fulfilled, (estado, accion) => {
        estado.iniciando = false
        estado.usuario = accion.payload
      })
      .addCase(restaurarSesion.rejected, (estado) => {
        estado.iniciando = false
        estado.usuario = null
      })
  },
})

export const { cerrarSesion, limpiarError, actualizarUsuario } = authSlice.actions
export default authSlice.reducer
