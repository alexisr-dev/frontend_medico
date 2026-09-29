import { useCallback } from 'react'
import type { FiltrosCitas } from '@/api/citas.api'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { useToast } from '@/components/common/ToastProvider'
import type { Cita, NuevaCita } from '@/types/cita.types'
import {
  actualizarEstadoCita,
  cancelarCita,
  cargarCitas,
  cargarResumen,
  cargarSlots,
  limpiarConflicto,
  reprogramarCita,
  reservarCita,
  seleccionarDoctor,
  seleccionarFecha,
} from './citasSlice'

export const useCitas = () => {
  const dispatch = useAppDispatch()
  const estado = useAppSelector((raiz) => raiz.citas)
  const { mostrar } = useToast()

  const listar = useCallback((filtros: FiltrosCitas = {}) => dispatch(cargarCitas(filtros)), [dispatch])

  const resumir = useCallback(() => dispatch(cargarResumen()), [dispatch])

  const verSlots = useCallback(
    (doctor: number, fecha: string) => dispatch(cargarSlots({ doctor, fecha })),
    [dispatch],
  )

  const reservar = useCallback(
    async (datos: NuevaCita) => {
      try {
        const cita = await dispatch(reservarCita(datos)).unwrap()
        mostrar('Hora reservada', `Tu cita quedo agendada con ${cita.doctor_nombre}.`, 'exito')
        return cita
      } catch (fallo) {
        const { mensaje, conflicto } = fallo as { mensaje: string; conflicto: boolean }
        mostrar(
          conflicto ? 'Ese horario ya fue tomado' : 'No se pudo reservar',
          conflicto ? 'Alguien reservo primero. Actualizamos las horas disponibles.' : mensaje,
          conflicto ? 'aviso' : 'error',
        )
        return null
      }
    },
    [dispatch, mostrar],
  )

  const cancelar = useCallback(
    async (id: string, motivo: string) => {
      try {
        await dispatch(cancelarCita({ id, motivo })).unwrap()
        mostrar('Cita cancelada', 'La hora vuelve a quedar disponible.', 'exito')
        return true
      } catch (fallo) {
        mostrar('No se pudo cancelar', String(fallo), 'error')
        return false
      }
    },
    [dispatch, mostrar],
  )

  const reprogramar = useCallback(
    async (id: string, inicio: string, version: number) => {
      try {
        await dispatch(reprogramarCita({ id, inicio, version })).unwrap()
        mostrar('Cita reprogramada', 'Enviamos la nueva hora al paciente y al doctor.', 'exito')
        return true
      } catch (fallo) {
        const { mensaje } = fallo as { mensaje: string }
        mostrar('No se pudo reprogramar', mensaje, 'aviso')
        return false
      }
    },
    [dispatch, mostrar],
  )

  const cambiarEstado = useCallback(
    async (id: string, nuevoEstado: Cita['estado'], notas?: string) => {
      try {
        await dispatch(actualizarEstadoCita({ id, estado: nuevoEstado, notas })).unwrap()
        mostrar('Cita actualizada', `Estado cambiado a ${nuevoEstado}.`, 'exito')
        return true
      } catch (fallo) {
        mostrar('No se pudo actualizar', String(fallo), 'error')
        return false
      }
    },
    [dispatch, mostrar],
  )

  const elegirDoctor = useCallback((doctor: number | null) => dispatch(seleccionarDoctor(doctor)), [dispatch])
  const elegirFecha = useCallback((fecha: string) => dispatch(seleccionarFecha(fecha)), [dispatch])
  const descartarConflicto = useCallback(() => dispatch(limpiarConflicto()), [dispatch])

  return {
    ...estado,
    listar,
    resumir,
    verSlots,
    reservar,
    cancelar,
    reprogramar,
    cambiarEstado,
    elegirDoctor,
    elegirFecha,
    descartarConflicto,
  }
}
