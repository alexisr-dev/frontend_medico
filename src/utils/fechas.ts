import { format, formatDistanceToNow, isToday, isTomorrow, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'

export const DIAS_SEMANA = ['Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado', 'Domingo']

export const aFecha = (valor: string | Date): Date => (typeof valor === 'string' ? parseISO(valor) : valor)

export const fechaCorta = (valor: string | Date) => format(aFecha(valor), "d 'de' MMMM", { locale: es })

export const fechaLarga = (valor: string | Date) => format(aFecha(valor), "EEEE d 'de' MMMM, yyyy", { locale: es })

export const hora = (valor: string | Date) => format(aFecha(valor), 'HH:mm')

export const fechaYHora = (valor: string | Date) =>
  format(aFecha(valor), "d MMM yyyy · HH:mm", { locale: es })

export const isoDelDia = (valor: Date) => format(valor, 'yyyy-MM-dd')

export const relativo = (valor: string | Date) =>
  formatDistanceToNow(aFecha(valor), { locale: es, addSuffix: true })

export const etiquetaDia = (valor: string | Date) => {
  const fecha = aFecha(valor)
  if (isToday(fecha)) return 'Hoy'
  if (isTomorrow(fecha)) return 'Manana'
  return format(fecha, "EEEE d", { locale: es })
}

export const rangoHorario = (inicio: string, fin: string) => `${hora(inicio)} – ${hora(fin)}`

export const diasDesdeHoy = (cantidad: number): Date[] => {
  const base = new Date()
  base.setHours(0, 0, 0, 0)
  return Array.from({ length: cantidad }, (_, indice) => {
    const dia = new Date(base)
    dia.setDate(base.getDate() + indice)
    return dia
  })
}

export const horaCorta = (valor: string) => valor.slice(0, 5)
