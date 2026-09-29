import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Boton } from '@/components/common/Boton'
import { Campo, CampoSelect } from '@/components/common/Campo'
import { useAuth } from '@/features/auth/useAuth'
import { RUTA_INICIAL } from '@/routes/RutaProtegida'
import { sinErrores, validarRegistro, type ErroresFormulario } from '@/utils/validaciones'

const FORMULARIO_INICIAL = {
  first_name: '',
  last_name: '',
  email: '',
  telefono: '',
  fecha_nacimiento: '',
  genero: '',
  password: '',
  password_confirmacion: '',
}

export const RegistroPage = () => {
  const { registrar, cargando, error, descartarError } = useAuth()
  const navegar = useNavigate()
  const [datos, setDatos] = useState(FORMULARIO_INICIAL)
  const [errores, setErrores] = useState<ErroresFormulario>({})

  const cambiar = (campo: keyof typeof FORMULARIO_INICIAL) => (evento: { target: { value: string } }) =>
    setDatos((previos) => ({ ...previos, [campo]: evento.target.value }))

  const enviar = async (evento: React.FormEvent) => {
    evento.preventDefault()
    const encontrados = validarRegistro(datos)
    setErrores(encontrados)
    if (!sinErrores(encontrados)) return

    descartarError()
    const sesion = await registrar({
      ...datos,
      email: datos.email.trim().toLowerCase(),
      fecha_nacimiento: datos.fecha_nacimiento || undefined,
      genero: datos.genero || undefined,
    }).catch(() => null)

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

          <h1 style={{ marginTop: 28 }}>Crea tu cuenta</h1>
          <p className="tenue" style={{ marginTop: 6, fontSize: '0.9rem' }}>
            Solo necesitas tus datos basicos para empezar a agendar.
          </p>

          <form className="acceso__campos" onSubmit={enviar}>
            <div className="rejilla" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Campo
                etiqueta="Nombres"
                autoComplete="given-name"
                value={datos.first_name}
                error={errores.first_name}
                onChange={cambiar('first_name')}
              />
              <Campo
                etiqueta="Apellidos"
                autoComplete="family-name"
                value={datos.last_name}
                error={errores.last_name}
                onChange={cambiar('last_name')}
              />
            </div>

            <Campo
              etiqueta="Correo electronico"
              type="email"
              autoComplete="email"
              placeholder="tu@correo.cl"
              value={datos.email}
              error={errores.email}
              onChange={cambiar('email')}
            />

            <div className="rejilla" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Campo
                etiqueta="Telefono"
                type="tel"
                placeholder="+56 9 1234 5678"
                value={datos.telefono}
                onChange={cambiar('telefono')}
              />
              <Campo
                etiqueta="Fecha de nacimiento"
                type="date"
                value={datos.fecha_nacimiento}
                onChange={cambiar('fecha_nacimiento')}
              />
            </div>

            <CampoSelect etiqueta="Genero" value={datos.genero} onChange={cambiar('genero')}>
              <option value="">Prefiero no decirlo</option>
              <option value="femenino">Femenino</option>
              <option value="masculino">Masculino</option>
              <option value="otro">Otro</option>
            </CampoSelect>

            <Campo
              etiqueta="Contrasena"
              type="password"
              autoComplete="new-password"
              value={datos.password}
              error={errores.password}
              ayuda="Al menos 8 caracteres, con letras y numeros."
              onChange={cambiar('password')}
            />
            <Campo
              etiqueta="Repite la contrasena"
              type="password"
              autoComplete="new-password"
              value={datos.password_confirmacion}
              error={errores.password_confirmacion}
              onChange={cambiar('password_confirmacion')}
            />

            {error ? (
              <div className="aviso aviso--error" role="alert">
                {error}
              </div>
            ) : null}

            <Boton type="submit" bloque cargando={cargando}>
              Crear cuenta
            </Boton>
          </form>

          <p className="tenue" style={{ marginTop: 20, fontSize: '0.87rem' }}>
            Ya tienes cuenta?{' '}
            <Link to="/entrar" style={{ color: 'var(--teal)', fontWeight: 550 }}>
              Entra aqui
            </Link>
          </p>
        </motion.div>
      </section>

      <section className="acceso__escenario">
        <div>
          <p className="rotulo" style={{ color: '#7fb5b3', position: 'relative' }}>
            Tu ficha, tuya
          </p>
          <h2 className="acceso__tesis" style={{ marginTop: 14 }}>
            Tu historial se guarda <em>cifrado</em>.
          </h2>
          <p className="acceso__nota">
            Diagnosticos, alergias y notas clinicas se cifran antes de tocar la base de datos. Cada lectura de tu
            ficha queda registrada con quien la abrio, cuando y desde donde.
          </p>
        </div>
      </section>
    </div>
  )
}
