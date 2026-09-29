export interface Receta {
  id: number
  registro_consulta: number
  medicamento: string
  dosis: string
  frecuencia: string
  duracion: string
  indicaciones: string
}

export interface ArchivoMedico {
  id: number
  registro_consulta: number
  archivo: string
  nombre: string
  tipo: string
  created_at: string
}

export interface RegistroConsulta {
  id: number
  cita: string
  historial: number
  doctor_nombre: string
  especialidad: string
  fecha_consulta: string
  diagnostico: string
  tratamiento: string
  notas: string
  recetas: Receta[]
  archivos: ArchivoMedico[]
  created_at: string
}

export interface HistorialMedico {
  id: number
  paciente: number
  paciente_nombre: string
  edad: number | null
  genero: string
  tipo_sangre: string
  alergias: string
  enfermedades_cronicas: string
  medicamentos_actuales: string
  antecedentes_familiares: string
  registros: RegistroConsulta[]
  updated_at: string
}

export interface NuevaConsulta {
  cita: string
  diagnostico: string
  tratamiento: string
  notas: string
  recetas: Omit<Receta, 'id' | 'registro_consulta'>[]
}
