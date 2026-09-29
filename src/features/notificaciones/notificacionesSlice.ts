import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { notificacionesApi } from '@/api/notificaciones.api'
import type { Notificacion } from '@/types/api.types'

interface EstadoNotificaciones {
  lista: Notificacion[]
  noLeidas: number
  cargando: boolean
}

const estadoInicial: EstadoNotificaciones = { lista: [], noLeidas: 0, cargando: false }

export const cargarNotificaciones = createAsyncThunk('notificaciones/cargar', async () => {
  const [lista, noLeidas] = await Promise.all([notificacionesApi.listar(), notificacionesApi.noLeidas()])
  return { lista, noLeidas }
})

export const marcarLeida = createAsyncThunk('notificaciones/marcarLeida', async (id: number) =>
  notificacionesApi.marcarLeida(id),
)

export const marcarTodasLeidas = createAsyncThunk('notificaciones/marcarTodas', async () => {
  await notificacionesApi.marcarTodas()
})

const notificacionesSlice = createSlice({
  name: 'notificaciones',
  initialState: estadoInicial,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(cargarNotificaciones.pending, (estado) => {
        estado.cargando = true
      })
      .addCase(cargarNotificaciones.fulfilled, (estado, accion) => {
        estado.cargando = false
        estado.lista = accion.payload.lista
        estado.noLeidas = accion.payload.noLeidas
      })
      .addCase(cargarNotificaciones.rejected, (estado) => {
        estado.cargando = false
      })
      .addCase(marcarLeida.fulfilled, (estado, accion) => {
        estado.lista = estado.lista.map((item) => (item.id === accion.payload.id ? accion.payload : item))
        estado.noLeidas = Math.max(0, estado.noLeidas - 1)
      })
      .addCase(marcarTodasLeidas.fulfilled, (estado) => {
        estado.lista = estado.lista.map((item) => ({ ...item, leido: true }))
        estado.noLeidas = 0
      })
  },
})

export default notificacionesSlice.reducer
