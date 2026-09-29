import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Boton } from '@/components/common/Boton'
import { Campo } from '@/components/common/Campo'
import { useAuth } from '@/features/auth/useAuth'
import { RUTA_INICIAL } from '@/routes/RutaProtegida'
import { sinErrores, validarLogin, type ErroresFormulario } from '@/utils/validaciones'

const CUENTAS_DEMO = [
  { rol: 'Paciente', email: 'martin.godoy@correo.cl' },
  { rol: 'Doctora', email: 'laura.mendoza@clinicasalud.cl' },
  { rol: 'Admin', email: 'admin@clinicasalud.cl' },
]

export const EntrarPage = () => {
  const { entrar, cargando, error, descartarError } = useAuth()
  const navegar = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState<ErroresFormulario>({})

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault()
    const encontrados = validarLogin(email, password)
    setErrores(encontrados)
    if (!sinErrores(encontrados)) return

    descartarError()
    const sesion = await entrar({ email: email.trim(), password }).catch(() => null)
    if (sesion) navegar(RUTA_INICIAL[sesion.rol], { replace: true })
  }

  return (
    <div className="acceso">
      <section className="acceso__panel">
        <motion.div
          className="acceso__formulario"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.32, ease: [0.22, 0.61, 0.36, 1] }}
        >
          <div className="fila" style={{ gap: 10 }}>
            <img src="/logo.svg" alt="" width={32} height={32} />
            <span style={{ fontFamily: 'var(--display)', fontWeight: 600 }}>Clinica Meridiano</span>
          </div>

          <h1 style={{ marginTop: 28 }}>Entra a tu cuenta</h1>
          <p className="tenue" style={{ marginTop: 6, fontSize: '0.9rem' }}>
            Agenda, revisa y gestiona tus consultas medicas.
          </p>

          <form className="acceso__campos" onSubmit={enviar}>
            <Campo
              etiqueta="Correo electronico"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.cl"
              value={email}
              error={errores.email}
              onChange={(evento) => setEmail(evento.target.value)}
            />
            <Campo
              etiqueta="Contrasena"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              error={errores.password}
              onChange={(evento) => setPassword(evento.target.value)}
            />

            {error ? (
              <div className="aviso aviso--error" role="alert">
                {error}
              </div>
            ) : null}

            <Boton type="submit" bloque cargando={cargando}>
              Entrar
            </Boton>
          </form>

          <p className="tenue" style={{ marginTop: 20, fontSize: '0.87rem' }}>
            No tienes cuenta?{' '}
            <Link to="/registro" style={{ color: 'var(--teal)', fontWeight: 550 }}>
              Crea una como paciente
            </Link>
          </p>
        </motion.div>
      </section>

      <section className="acceso__escenario">
        <div>
          <p className="rotulo" style={{ color: '#7fb5b3', position: 'relative' }}>
            Sistema de reservas
          </p>
          <h2 className="acceso__tesis" style={{ marginTop: 14 }}>
            Una hora, <em>un paciente</em>. Sin excepciones.
          </h2>
          <p className="acceso__nota">
            La agenda se bloquea en la base de datos, no en la pantalla. Si dos personas piden la misma hora al
            mismo instante, solo una la obtiene y la otra ve el tablero actualizado al segundo.
          </p>
        </div>

        <div className="acceso__demo">
          <p className="rotulo" style={{ color: '#7fb5b3' }}>
            Cuentas de demostracion
          </p>
          {CUENTAS_DEMO.map((cuenta) => (
            <div className="acceso__demo-fila" key={cuenta.email}>
              <span>{cuenta.rol}</span>
              <strong>{cuenta.email}</strong>
            </div>
          ))}
          <div className="acceso__demo-fila" style={{ marginTop: 6 }}>
            <span>Contrasena</span>
            <strong>Clave.Segura1</strong>
          </div>
        </div>
      </section>
    </div>
  )
}
