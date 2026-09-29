import { Suspense, lazy } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Cargando } from '@/components/common/Estados'
import { LayoutAdmin } from '@/layouts/LayoutAdmin'
import { LayoutDoctor } from '@/layouts/LayoutDoctor'
import { LayoutPaciente } from '@/layouts/LayoutPaciente'
import { EntrarPage } from '@/pages/EntrarPage'
import { RegistroPage } from '@/pages/RegistroPage'
import { AgendarCitaPage } from '@/pages/paciente/AgendarCitaPage'
import { MiHistorialPage } from '@/pages/paciente/MiHistorialPage'
import { MiPerfilPage } from '@/pages/paciente/MiPerfilPage'
import { MisCitasPage } from '@/pages/paciente/MisCitasPage'
import { AgendaDelDiaPage } from '@/pages/doctor/AgendaDelDiaPage'
import { DisponibilidadPage } from '@/pages/doctor/DisponibilidadPage'
import { MisPacientesPage } from '@/pages/doctor/MisPacientesPage'
import { PacienteHistorialPage } from '@/pages/doctor/PacienteHistorialPage'
import { AuditoriaPage } from '@/pages/admin/AuditoriaPage'
import { CitasPage } from '@/pages/admin/CitasPage'
import { UsuariosPage } from '@/pages/admin/UsuariosPage'
import { RutaProtegida, RutaPublica } from './RutaProtegida'

const ReportesPage = lazy(() => import('@/pages/admin/ReportesPage').then((m) => ({ default: m.ReportesPage })))
const ReportesDoctorPage = lazy(() =>
  import('@/pages/doctor/ReportesDoctorPage').then((m) => ({ default: m.ReportesDoctorPage })),
)

const ConGraficos = ({ children }: { children: React.ReactNode }) => (
  <Suspense fallback={<Cargando texto="Cargando reportes" />}>{children}</Suspense>
)

export const AppRoutes = () => (
  <Routes>
    <Route
      path="/entrar"
      element={
        <RutaPublica>
          <EntrarPage />
        </RutaPublica>
      }
    />
    <Route
      path="/registro"
      element={
        <RutaPublica>
          <RegistroPage />
        </RutaPublica>
      }
    />

    <Route
      path="/paciente"
      element={
        <RutaProtegida roles={['paciente']}>
          <LayoutPaciente />
        </RutaProtegida>
      }
    >
      <Route index element={<Navigate to="agendar" replace />} />
      <Route path="agendar" element={<AgendarCitaPage />} />
      <Route path="citas" element={<MisCitasPage />} />
      <Route path="historial" element={<MiHistorialPage />} />
      <Route path="perfil" element={<MiPerfilPage />} />
    </Route>

    <Route
      path="/doctor"
      element={
        <RutaProtegida roles={['doctor']}>
          <LayoutDoctor />
        </RutaProtegida>
      }
    >
      <Route index element={<Navigate to="agenda" replace />} />
      <Route path="agenda" element={<AgendaDelDiaPage />} />
      <Route path="disponibilidad" element={<DisponibilidadPage />} />
      <Route path="pacientes" element={<MisPacientesPage />} />
      <Route path="pacientes/:pacienteId" element={<PacienteHistorialPage />} />
      <Route
        path="reportes"
        element={
          <ConGraficos>
            <ReportesDoctorPage />
          </ConGraficos>
        }
      />
    </Route>

    <Route
      path="/admin"
      element={
        <RutaProtegida roles={['admin']}>
          <LayoutAdmin />
        </RutaProtegida>
      }
    >
      <Route index element={<Navigate to="reportes" replace />} />
      <Route
        path="reportes"
        element={
          <ConGraficos>
            <ReportesPage />
          </ConGraficos>
        }
      />
      <Route path="usuarios" element={<UsuariosPage />} />
      <Route path="citas" element={<CitasPage />} />
      <Route path="auditoria" element={<AuditoriaPage />} />
    </Route>

    <Route path="*" element={<Navigate to="/entrar" replace />} />
  </Routes>
)
