import { CalendarPlus, ClipboardList, HeartPulse, UserRound } from 'lucide-react'
import { Shell, type EnlaceNav } from './Shell'

const ENLACES: EnlaceNav[] = [
  { a: '/paciente/agendar', texto: 'Agendar hora', icono: <CalendarPlus size={17} /> },
  { a: '/paciente/citas', texto: 'Mis citas', icono: <ClipboardList size={17} /> },
  { a: '/paciente/historial', texto: 'Mi historial', icono: <HeartPulse size={17} /> },
  { a: '/paciente/perfil', texto: 'Mi perfil', icono: <UserRound size={17} /> },
]

export const LayoutPaciente = () => <Shell enlaces={ENLACES} rotuloRol="Paciente" />
