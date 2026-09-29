const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

export const emailValido = (valor: string) => PATRON_EMAIL.test(valor.trim())

export const passwordValida = (valor: string) => valor.length >= 8 && /[a-zA-Z]/.test(valor) && /\d/.test(valor)

export const requerido = (valor: string) => valor.trim().length > 0

export interface ErroresFormulario {
  [campo: string]: string
}

export const validarLogin = (email: string, password: string): ErroresFormulario => {
  const errores: ErroresFormulario = {}
  if (!requerido(email)) errores.email = 'Escribe tu correo.'
  else if (!emailValido(email)) errores.email = 'Ese correo no tiene un formato valido.'
  if (!requerido(password)) errores.password = 'Escribe tu contrasena.'
  return errores
}

export const validarRegistro = (datos: {
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirmacion: string
}): ErroresFormulario => {
  const errores: ErroresFormulario = {}
  if (!requerido(datos.first_name)) errores.first_name = 'Escribe tu nombre.'
  if (!requerido(datos.last_name)) errores.last_name = 'Escribe tu apellido.'
  if (!emailValido(datos.email)) errores.email = 'Ese correo no tiene un formato valido.'
  if (!passwordValida(datos.password))
    errores.password = 'Usa al menos 8 caracteres, con letras y numeros.'
  if (datos.password !== datos.password_confirmacion)
    errores.password_confirmacion = 'Las contrasenas no coinciden.'
  return errores
}

export const validarConsulta = (diagnostico: string): ErroresFormulario => {
  const errores: ErroresFormulario = {}
  if (diagnostico.trim().length < 5) errores.diagnostico = 'Describe el diagnostico con al menos 5 caracteres.'
  return errores
}

export const sinErrores = (errores: ErroresFormulario) => Object.keys(errores).length === 0
