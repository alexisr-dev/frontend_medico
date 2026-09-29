import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { doctoresApi } from '@/api/doctores.api'
import type { Doctor, Especialidad } from '@/types/cita.types'

interface EstadoDoctores {
  lista: Doctor[]
  especialidades: Especialidad[]
  filtroEspecialidad: number | null
  busqueda: string
  cargando: boolean
}

const estadoInicial: EstadoDoctores = {
  lista: [],
  especialidades: [],
  filtroEspecialidad: null,
  busqueda: '',
  cargando: false,
}

export const cargarDoctores = createAsyncThunk(
  'doctores/cargar',
  async (params: { especialidad?: number; search?: string } = {}) =>
    doctoresApi.listar({ ...params, activo: true }).then((r) => r.resultados),
)

export const cargarEspecialidades = createAsyncThunk('doctores/especialidades', async () =>
  doctoresApi.especialidades(),
)

const doctoresSlice = createSlice({
  name: 'doctores',
  initialState: estadoInicial,
  reducers: {
    filtrarPorEspecialidad: (estado, accion: { payload: number | null }) => {
      estado.filtroEspecialidad = accion.payload
    },
    buscar: (estado, accion: { payload: string }) => {
      estado.busqueda = accion.payload
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarDoctores.pending, (estado) => {
        estado.cargando = true
      })
      .addCase(cargarDoctores.fulfilled, (estado, accion) => {
        estado.cargando = false
        estado.lista = accion.payload
      })
      .addCase(cargarDoctores.rejected, (estado) => {
        estado.cargando = false
      })
      .addCase(cargarEspecialidades.fulfilled, (estado, accion) => {
        estado.especialidades = accion.payload
      })
  },
})

export const { filtrarPorEspecialidad, buscar } = doctoresSlice.actions
export default doctoresSlice.reducer
