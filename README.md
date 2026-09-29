# Reservas de Consultas Médicas — Frontend

![React](https://img.shields.io/badge/React-19.2-149eca?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6.0-3178c6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8.1-646cff?logo=vite&logoColor=white)
![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-2.12-764abc?logo=redux&logoColor=white)
![License](https://img.shields.io/badge/license-not%20specified-lightgrey)

SPA para la gestión de citas médicas de una clínica ficticia ("Clínica Meridiano"). Permite a **pacientes** agendar y consultar sus citas e historial clínico, a **doctores** administrar su agenda, disponibilidad e historiales de sus pacientes, y a **administradores** gestionar usuarios, ver reportes de ocupación y auditoría del sistema.

> Este repositorio contiene únicamente el **frontend**. Consume una API REST externa (no incluida en este repositorio) mediante Axios.

## Tabla de contenidos

- [Características principales](#características-principales)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Estructura de carpetas](#estructura-de-carpetas)
- [Requisitos previos](#requisitos-previos)
- [Instalación y configuración local](#instalación-y-configuración-local)
- [Variables de entorno](#variables-de-entorno)
- [Scripts disponibles](#scripts-disponibles)
- [Flujo de funcionamiento](#flujo-de-funcionamiento)
- [Endpoints consumidos](#endpoints-consumidos)

## Características principales

Verificadas directamente en el código fuente (`src/`):

- **Autenticación por roles** (`paciente`, `doctor`, `admin`) con JWT, renovación automática de token y redirección según rol (`src/routes/RutaProtegida.tsx`).
- **Agendamiento de citas**: calendario de disponibilidad, reserva, reprogramación y cancelación con control de conflictos de horario (`src/api/citas.api.ts`, `src/components/citas/`).
- **Gestión de disponibilidad y bloqueos** para doctores (horarios semanales y bloqueos puntuales).
- **Historial clínico**: consulta y registro de consultas médicas por paciente (`src/components/historial/`, `src/api/historiales.api.ts`).
- **Panel de reportes** con indicadores generales, ocupación por doctor, demanda por especialidad y tendencia de citas, graficados con Recharts (`src/pages/admin/ReportesPage.tsx`, `src/components/reportes/GraficoOcupacion.tsx`).
- **Auditoría del sistema** para administradores (`src/pages/admin/AuditoriaPage.tsx`).
- **Notificaciones** con contador de no leídas y panel desplegable, actualizado por polling cada 60s (`src/layouts/Shell.tsx`).
- **Layouts diferenciados por rol** (`LayoutPaciente`, `LayoutDoctor`, `LayoutAdmin`) sobre un shell de navegación compartido.

## Tecnologías

| Categoría | Herramientas |
|---|---|
| Core | React 19, TypeScript 6, Vite 8 |
| Enrutamiento | React Router DOM 7 |
| Estado global | Redux Toolkit 2, React Redux 9 |
| HTTP | Axios 1 (con interceptores de auth y refresh de token) |
| UI / UX | Framer Motion, Lucide React (iconos) |
| Datos y fechas | date-fns |
| Visualización | Recharts |
| Linting | Oxlint |
| Build/Tooling | @vitejs/plugin-react, TypeScript project references |

## Arquitectura

Aplicación de página única (SPA) organizada por **rol de usuario** y por **capas técnicas**:

```
UI (pages/layouts/components)
        │
        ▼
Hooks de estado (features/*Slice.ts + useAuth, useCitas)
        │
        ▼
Redux store (store/store.ts)
        │
        ▼
Capa de API (api/*.api.ts) ──► cliente Axios (api/client.ts) ──► API REST externa
```

- El **cliente Axios** (`src/api/client.ts`) centraliza la URL base, adjunta el token en cada petición y renueva automáticamente el `access token` ante una respuesta `401`, reintentando la petición original una sola vez.
- El **enrutamiento** (`src/routes/AppRoutes.tsx` + `RutaProtegida.tsx`) protege rutas por rol y redirige a la ruta inicial correspondiente (`/paciente/agendar`, `/doctor/agenda`, `/admin/reportes`).
- El **estado global** con Redux Toolkit gestiona sesión (`auth`), citas (`citas`), doctores (`doctores`) y notificaciones (`notificaciones`); el resto de datos de servidor se obtiene bajo demanda con el hook `usePeticion`.
- Los **reportes** (`ReportesPage`, `ReportesDoctorPage`) se cargan de forma perezosa (`React.lazy`) para no incluir Recharts en el bundle inicial.

## Estructura de carpetas

```
src/
├── api/            # Llamadas HTTP agrupadas por dominio (auth, citas, doctores, historiales, notificaciones, reportes, admin)
├── components/     # Componentes de UI reutilizables (comunes, citas, historial, reportes)
├── features/       # Slices de Redux y hooks asociados (auth, citas, doctores, notificaciones)
├── hooks/          # Hooks genéricos (usePeticion, useDebounce)
├── layouts/         # Layouts por rol + Shell de navegación compartido
├── pages/          # Vistas, organizadas en admin/, doctor/, paciente/ y públicas (Entrar, Registro)
├── routes/         # Definición de rutas y guardas de acceso por rol
├── store/          # Configuración del store de Redux
├── styles/         # Hojas de estilo globales y de componentes
├── types/          # Tipos TypeScript compartidos por dominio
└── utils/          # Utilidades (fechas, estados, validaciones)
```

## Requisitos previos

- [Node.js](https://nodejs.org/) 20 o superior (recomendado para compatibilidad con Vite 8 y TypeScript 6).
- npm (el repositorio incluye `package-lock.json`).
- Una API backend compatible corriendo y accesible (no incluida en este repositorio) que exponga los endpoints listados en [Endpoints consumidos](#endpoints-consumidos).

## Instalación y configuración local

```bash
# 1. Clonar el repositorio
git clone <URL-del-repositorio>
cd frontend_medico

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env según el entorno local (ver tabla de variables abajo)

# 4. Iniciar el servidor de desarrollo
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

## Variables de entorno

Definidas en `.env.example` (sin secretos reales):

| Variable | Descripción | Valor de ejemplo |
|---|---|---|
| `VITE_API_URL` | URL base de la API consumida por el cliente Axios | `http://localhost:8000/api` |
| `VITE_APP_NOMBRE` | Nombre de la aplicación mostrado en la UI | `Clinica Meridiano` |

Adicionalmente, `vite.config.ts` define un proxy de desarrollo que redirige `/api` y `/media` hacia `http://localhost:8000`, útil si se prefiere no usar `VITE_API_URL` en desarrollo.

## Scripts disponibles

| Script | Comando | Descripción |
|---|---|---|
| Desarrollo | `npm run dev` | Levanta el servidor de desarrollo de Vite con HMR |
| Build | `npm run build` | Verifica tipos (`tsc -b`) y genera el build de producción |
| Lint | `npm run lint` | Ejecuta Oxlint sobre el código fuente |
| Preview | `npm run preview` | Sirve localmente el build de producción generado |

## Flujo de funcionamiento

1. Al cargar la aplicación, `App.tsx` despacha `restaurarSesion`, que valida el token almacenado (`localStorage`) contra `GET /auth/yo/`.
2. Un usuario no autenticado es redirigido a `/entrar`. Tras iniciar sesión (`POST /auth/login/`), se reciben `access`/`refresh` tokens y los datos del usuario, incluyendo su rol.
3. Según el rol, `RutaProtegida` redirige a la sección correspondiente:
   - `paciente` → `/paciente/agendar`
   - `doctor` → `/doctor/agenda`
   - `admin` → `/admin/reportes`
4. Cada sección consume su propia capa de API (`src/api/*.api.ts`) mediante el hook `usePeticion` (para lecturas) o thunks de Redux (para estado compartido como citas, doctores y notificaciones).
5. Si una petición responde `401`, el interceptor de Axios intenta renovar el token una vez; si falla, se emite el evento `sesion:expirada`, que cierra la sesión y limpia el estado.

## Endpoints consumidos

Inferidos de `src/api/*.api.ts`. La API backend no forma parte de este repositorio.

**Autenticación** (`auth.api.ts`)

| Método | Endpoint | Uso |
|---|---|---|
| POST | `/auth/login/` | Inicio de sesión |
| POST | `/auth/registro/` | Registro de paciente |
| GET | `/auth/yo/` | Datos de la sesión actual |
| PATCH | `/auth/yo/` | Actualizar perfil de usuario |
| POST | `/auth/cambiar-password/` | Cambio de contraseña |
| GET / PATCH | `/pacientes/mi-perfil/` | Perfil extendido del paciente |

**Citas** (`citas.api.ts`)

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/citas/` | Listado con filtros (estado, doctor, paciente, rango de fechas) |
| GET | `/citas/{id}/` | Detalle de cita |
| POST | `/citas/` | Crear cita |
| POST | `/citas/{id}/reprogramar/` | Reprogramar (con control de versión) |
| POST | `/citas/{id}/cancelar/` | Cancelar cita |
| POST | `/citas/{id}/estado/` | Cambiar estado |
| GET | `/citas/agenda-hoy/` | Agenda del doctor autenticado |
| GET | `/citas/resumen/` | Resumen agregado de citas |

**Doctores y disponibilidad** (`doctores.api.ts`)

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/doctores/` | Listado de doctores |
| GET | `/doctores/{id}/` | Detalle de doctor |
| GET / PATCH | `/doctores/mi-perfil/` | Perfil del doctor autenticado |
| GET | `/doctores/{id}/disponibilidad/` | Slots disponibles por fecha |
| GET | `/doctores/{id}/agenda/` | Agenda en rango de fechas |
| GET / POST | `/doctores/especialidades/` | Especialidades médicas |
| GET / POST / DELETE | `/doctores/disponibilidades/` | Horarios recurrentes |
| GET / POST / DELETE | `/doctores/bloqueos/` | Bloqueos puntuales de agenda |

**Historiales clínicos** (`historiales.api.ts`)

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/historiales/mi-historial/` | Historial del paciente autenticado |
| GET | `/historiales/paciente/{id}/` | Historial por paciente (doctor) |
| PATCH | `/historiales/{id}/` | Actualizar historial |
| GET / POST | `/historiales/consultas/` | Registro de consultas médicas |
| GET | `/pacientes/mis-pacientes/` | Pacientes atendidos por el doctor |

**Notificaciones** (`notificaciones.api.ts`)

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/notificaciones/` | Listado (filtrable por leído) |
| GET | `/notificaciones/no-leidas/` | Total de no leídas |
| POST | `/notificaciones/{id}/marcar-leida/` | Marcar una como leída |
| POST | `/notificaciones/marcar-todas/` | Marcar todas como leídas |

**Reportes** (`reportes.api.ts`)

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/reportes/ocupacion/` | Ocupación de agenda por doctor |
| GET | `/reportes/no-asistencia/` | Tasa de no asistencia y cancelación |
| GET | `/reportes/citas-por-dia/` | Serie de citas por día |
| GET | `/reportes/demanda-especialidad/` | Demanda por especialidad |
| GET | `/reportes/disponibilidad/` | Capacidad disponible por doctor |
| GET | `/reportes/indicadores/` | Indicadores generales del período |

**Administración** (`admin.api.ts`)

| Método | Endpoint | Uso |
|---|---|---|
| GET | `/auth/usuarios/` | Listado de usuarios |
| GET | `/auth/usuarios/resumen/` | Conteo por rol/estado |
| DELETE | `/auth/usuarios/{id}/` | Desactivar usuario |
| POST | `/auth/usuarios/{id}/activar/` | Reactivar usuario |
| POST | `/auth/registro-doctor/` | Alta de un nuevo doctor |
| GET | `/auditoria/` | Registro de auditoría del sistema |





