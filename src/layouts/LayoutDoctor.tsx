import { BarChart3, CalendarDays, Clock4, Users } from 'lucide-react'
import { Shell, type EnlaceNav } from './Shell'

const ENLACES: EnlaceNav[] = [
  { a: '/doctor/agenda', texto: 'Agenda del dia', icono: <CalendarDays size={17} /> },
  { a: '/doctor/disponibilidad', texto: 'Mi disponibilidad', icono: <Clock4 size={17} /> },
  { a: '/doctor/pacientes', texto: 'Mis pacientes', icono: <Users size={17} /> },
  { a: '/doctor/reportes', texto: 'Reportes', icono: <BarChart3 size={17} /> },
]

export const LayoutDoctor = () => <Shell enlaces={ENLACES} rotuloRol="Doctor" />
