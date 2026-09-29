import { BarChart3, CalendarRange, ShieldCheck, Users } from 'lucide-react'
import { Shell, type EnlaceNav } from './Shell'

const ENLACES: EnlaceNav[] = [
  { a: '/admin/reportes', texto: 'Reportes', icono: <BarChart3 size={17} /> },
  { a: '/admin/usuarios', texto: 'Usuarios', icono: <Users size={17} /> },
  { a: '/admin/citas', texto: 'Todas las citas', icono: <CalendarRange size={17} /> },
  { a: '/admin/auditoria', texto: 'Auditoria', icono: <ShieldCheck size={17} /> },
]

export const LayoutAdmin = () => <Shell enlaces={ENLACES} rotuloRol="Administracion" />
