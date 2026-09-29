import { useEffect, useState } from 'react'
import { authApi } from '@/api/auth.api'
import { mensajeDeError } from '@/api/client'
import { Boton } from '@/components/common/Boton'
import { Campo, CampoSelect } from '@/components/common/Campo'
import { Cargando } from '@/components/common/Estados'
import { useToast } from '@/components/common/ToastProvider'
import { actualizarUsuario } from '@/features/auth/authSlice'
import { useAuth } from '@/features/auth/useAuth'
import { usePeticion } from '@/hooks/usePeticion'
import { useAppDispatch } from '@/store/hooks'

export const MiPerfilPage = () => {
  const { usuario } = useAuth()
  const dispatch = useAppDispatch()
  const { mostrar } = useToast()
  const { datos: perfil, cargando } = usePeticion(() => authApi.miPerfilPaciente())

  const [contacto, setContacto] = useState({ first_name: '', last_name: '', telefono: '' })
  const [clinico, setClinico] = useState({
    fecha_nacimiento: '',
    genero: '',
    direccion: '',
    contacto_emergencia: '',
    numero_seguro: '',
  })
  const [passwords, setPasswords] = useState({ actual: '', nueva: '' })
  const [guardando, setGuardando] = useState(false)

  useEffect(() => {
    if (usuario) {
      setContacto({
        first_name: usuario.first_name,
        last_name: usuario.last_name,
        telefono: usuario.telefono ?? '',
      })
    }
  }, [usuario])

  useEffect(() => {
    if (perfil) {
      setClinico({
        fecha_nacimiento: perfil.fecha_nacimiento ?? '',
        genero: perfil.genero ?? '',
        direccion: perfil.direccion ?? '',
        contacto_emergencia: perfil.contacto_emergencia ?? '',
        numero_seguro: perfil.numero_seguro ?? '',
      })
    }
  }, [perfil])

  const guardarDatos = async (evento: React.FormEvent) => {
    evento.preventDefault()
    setGuardando(true)
    try {
      const actualizado = await authApi.actualizarPerfil(contacto)
      await authApi.actualizarPerfilPaciente({
        ...clinico,
        fecha_nacimiento: clinico.fecha_nacimiento || null,
      })
      dispatch(actualizarUsuario(actualizado))
      mostrar('Datos guardados', 'Tu informacion quedo actualizada.', 'exito')
    } catch (fallo) {
      mostrar('No se pudo guardar', mensajeDeError(fallo), 'error')
    } finally {
      setGuardando(false)
    }
  }

  const cambiarPassword = async (evento: React.FormEvent) => {
    evento.preventDefault()
    try {
      await authApi.cambiarPassword(passwords.actual, passwords.nueva)
      setPasswords({ actual: '', nueva: '' })
      mostrar('Contrasena actualizada', 'Usa la nueva contrasena la proxima vez que entres.', 'exito')
    } catch (fallo) {
      mostrar('No se pudo cambiar', mensajeDeError(fallo), 'error')
    }
  }

  if (cargando) return <Cargando texto="Cargando perfil" />

  return (
    <>
      <header className="encabezado-pagina">
        <div>
          <p className="rotulo">Cuenta</p>
          <h1 style={{ marginTop: 6 }}>Mi perfil</h1>
          <p className="encabezado-pagina__texto">
            Tu direccion, contacto de emergencia y numero de seguro se guardan cifrados.
          </p>
        </div>
      </header>

      <div className="rejilla rejilla--dos">
        <section className="tarjeta">
          <div className="tarjeta__cabecera">
            <div>
              <p className="rotulo">Datos personales</p>
              <h3 style={{ marginTop: 6 }}>Como te contactamos</h3>
            </div>
          </div>
          <form className="tarjeta__cuerpo apilar" style={{ gap: 14 }} onSubmit={guardarDatos}>
            <div className="rejilla" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Campo
                etiqueta="Nombres"
                value={contacto.first_name}
                onChange={(e) => setContacto((p) => ({ ...p, first_name: e.target.value }))}
              />
              <Campo
                etiqueta="Apellidos"
                value={contacto.last_name}
                onChange={(e) => setContacto((p) => ({ ...p, last_name: e.target.value }))}
              />
            </div>
            <Campo etiqueta="Correo" value={usuario?.email ?? ''} disabled ayuda="El correo no se puede modificar." />
            <Campo
              etiqueta="Telefono"
              value={contacto.telefono}
              onChange={(e) => setContacto((p) => ({ ...p, telefono: e.target.value }))}
            />
            <div className="rejilla" style={{ gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <Campo
                etiqueta="Fecha de nacimiento"
                type="date"
                value={clinico.fecha_nacimiento}
                onChange={(e) => setClinico((p) => ({ ...p, fecha_nacimiento: e.target.value }))}
              />
              <CampoSelect
                etiqueta="Genero"
                value={clinico.genero}
                onChange={(e) => setClinico((p) => ({ ...p, genero: e.target.value }))}
              >
                <option value="">Prefiero no decirlo</option>
                <option value="femenino">Femenino</option>
                <option value="masculino">Masculino</option>
                <option value="otro">Otro</option>
              </CampoSelect>
            </div>
            <Campo
              etiqueta="Direccion"
              value={clinico.direccion}
              onChange={(e) => setClinico((p) => ({ ...p, direccion: e.target.value }))}
            />
            <Campo
              etiqueta="Contacto de emergencia"
              placeholder="+56 9 ..."
              value={clinico.contacto_emergencia}
              onChange={(e) => setClinico((p) => ({ ...p, contacto_emergencia: e.target.value }))}
            />
            <Campo
              etiqueta="Numero de seguro"
              value={clinico.numero_seguro}
              onChange={(e) => setClinico((p) => ({ ...p, numero_seguro: e.target.value }))}
            />
            <Boton type="submit" cargando={guardando}>
              Guardar cambios
            </Boton>
          </form>
        </section>

        <section className="tarjeta" style={{ alignSelf: 'start' }}>
          <div className="tarjeta__cabecera">
            <div>
              <p className="rotulo">Seguridad</p>
              <h3 style={{ marginTop: 6 }}>Cambiar contrasena</h3>
            </div>
          </div>
          <form className="tarjeta__cuerpo apilar" style={{ gap: 14 }} onSubmit={cambiarPassword}>
            <Campo
              etiqueta="Contrasena actual"
              type="password"
              autoComplete="current-password"
              value={passwords.actual}
              onChange={(e) => setPasswords((p) => ({ ...p, actual: e.target.value }))}
            />
            <Campo
              etiqueta="Nueva contrasena"
              type="password"
              autoComplete="new-password"
              ayuda="Al menos 8 caracteres, con letras y numeros."
              value={passwords.nueva}
              onChange={(e) => setPasswords((p) => ({ ...p, nueva: e.target.value }))}
            />
            <Boton type="submit" variante="secundario">
              Actualizar contrasena
            </Boton>
          </form>
        </section>
      </div>
    </>
  )
}
