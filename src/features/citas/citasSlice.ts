import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { citasApi, type FiltrosCitas } from '@/api/citas.api'
import { doctoresApi } from '@/api/doctores.api'
import { esConflictoDeHorario, mensajeDeError } from '@/api/client'
import type { Cita, NuevaCita, ResumenCitas, Slot } from '@/types/cita.types'

interface EstadoCitas {
  lista: Cita[]
  total: number
  resumen: ResumenCitas | null
  slots: Slot[]
  doctorSeleccionado: number | null
  fechaSeleccionada: string
  cargandoLista: boolean
  cargandoSlots: boolean
  reservando: boolean
  error: string | null
  conflicto: boolean
}

const hoy = () => new Date().toISOString().slice(0, 10)

const estadoInicial: EstadoCitas = {
  lista: [],
  total: 0,
  resumen: null,
  slots: [],
  doctorSeleccionado: null,
  fechaSeleccionada: hoy(),
  cargandoLista: false,
  cargandoSlots: false,
  reservando: false,
  error: null,
  conflicto: false,
}

export const cargarCitas = createAsyncThunk('citas/cargar', async (filtros: FiltrosCitas = {}) =>
  citasApi.listar(filtros),
)

export const cargarResumen = createAsyncThunk('citas/resumen', async () => citasApi.resumen())

export const cargarSlots = createAsyncThunk(
  'citas/slots',
  async ({ doctor, fecha }: { doctor: number; fecha: string }) => doctoresApi.disponibilidad(doctor, fecha),
)

export const reservarCita = createAsyncThunk<Cita, NuevaCita, { rejectValue: { mensaje: string; conflicto: boolean } }>(
  'citas/reservar',
  async (datos, { rejectWithValue, dispatch }) => {
    try {
      return await citasApi.crear(datos)
    } catch (error) {
      const conflicto = esConflictoDeHorario(error)
      if (conflicto) {
        dispatch(cargarSlots({ doctor: datos.doctor, fecha: datos.fecha_hora_inicio.slice(0, 10) }))
      }
      return rejectWithValue({
        mensaje: mensajeDeError(error, 'No fue posible reservar la hora.'),
        conflicto,
      })
    }
  },
)

export const cancelarCita = createAsyncThunk<Cita, { id: string; motivo: string }, { rejectValue: string }>(
  'citas/cancelar',
  async ({ id, motivo }, { rejectWithValue }) => {
    try {
      return await citasApi.cancelar(id, motivo)
    } catch (error) {
      return rejectWithValue(mensajeDeError(error, 'No fue posible cancelar la cita.'))
    }
  },
)

export const reprogramarCita = createAsyncThunk<
  Cita,
  { id: string; inicio: string; version: number },
  { rejectValue: { mensaje: string; conflicto: boolean } }
>('citas/reprogramar', async ({ id, inicio, version }, { rejectWithValue }) => {
  try {
    return await citasApi.reprogramar(id, inicio, version)
  } catch (error) {
    return rejectWithValue({
      mensaje: mensajeDeError(error, 'No fue posible reprogramar la cita.'),
      conflicto: esConflictoDeHorario(error),
    })
  }
})

export const actualizarEstadoCita = createAsyncThunk<
  Cita,
  { id: string; estado: Cita['estado']; notas?: string },
  { rejectValue: string }
>('citas/estado', async ({ id, estado, notas }, { rejectWithValue }) => {
  try {
    return await citasApi.cambiarEstado(id, estado, notas)
  } catch (error) {
    return rejectWithValue(mensajeDeError(error, 'No fue posible actualizar la cita.'))
  }
})

const reemplazar = (lista: Cita[], cita: Cita) => lista.map((item) => (item.id === cita.id ? cita : item))

const citasSlice = createSlice({
  name: 'citas',
  initialState: estadoInicial,
  reducers: {
    seleccionarDoctor: (estado, accion: { payload: number | null }) => {
      estado.doctorSeleccionado = accion.payload
      estado.slots = []
    },
    seleccionarFecha: (estado, accion: { payload: string }) => {
      estado.fechaSeleccionada = accion.payload
    },
    limpiarConflicto: (estado) => {
      estado.conflicto = false
      estado.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(cargarCitas.pending, (estado) => {
        estado.cargandoLista = true
      })
      .addCase(cargarCitas.fulfilled, (estado, accion) => {
        estado.cargandoLista = false
        estado.lista = accion.payload.resultados
        estado.total = accion.payload.total
      })
      .addCase(cargarCitas.rejected, (estado) => {
        estado.cargandoLista = false
      })
      .addCase(cargarResumen.fulfilled, (estado, accion) => {
        estado.resumen = accion.payload
      })
      .addCase(cargarSlots.pending, (estado) => {
        estado.cargandoSlots = true
      })
      .addCase(cargarSlots.fulfilled, (estado, accion) => {
        estado.cargandoSlots = false
        estado.slots = accion.payload.slots
      })
      .addCase(cargarSlots.rejected, (estado) => {
        estado.cargandoSlots = false
        estado.slots = []
      })
      .addCase(reservarCita.pending, (estado) => {
        estado.reservando = true
        estado.error = null
        estado.conflicto = false
      })
      .addCase(reservarCita.fulfilled, (estado, accion) => {
        estado.reservando = false
        estado.lista = [accion.payload, ...estado.lista]
        estado.slots = estado.slots.filter((slot) => slot.inicio !== accion.payload.fecha_hora_inicio)
      })
      .addCase(reservarCita.rejected, (estado, accion) => {
        estado.reservando = false
        estado.error = accion.payload?.mensaje ?? 'No fue posible reservar la hora.'
        estado.conflicto = accion.payload?.conflicto ?? false
      })
      .addCase(cancelarCita.fulfilled, (estado, accion) => {
        estado.lista = reemplazar(estado.lista, accion.payload)
      })
      .addCase(reprogramarCita.fulfilled, (estado, accion) => {
        estado.lista = reemplazar(estado.lista, accion.payload)
      })
      .addCase(reprogramarCita.rejected, (estado, accion) => {
        estado.error = accion.payload?.mensaje ?? null
        estado.conflicto = accion.payload?.conflicto ?? false
      })
      .addCase(actualizarEstadoCita.fulfilled, (estado, accion) => {
        estado.lista = reemplazar(estado.lista, accion.payload)
      })
  },
})

export const { seleccionarDoctor, seleccionarFecha, limpiarConflicto } = citasSlice.actions
export default citasSlice.reducer
