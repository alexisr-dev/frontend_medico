import { configureStore } from '@reduxjs/toolkit'
import authReducer from '@/features/auth/authSlice'
import citasReducer from '@/features/citas/citasSlice'
import doctoresReducer from '@/features/doctores/doctoresSlice'
import notificacionesReducer from '@/features/notificaciones/notificacionesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    citas: citasReducer,
    doctores: doctoresReducer,
    notificaciones: notificacionesReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
