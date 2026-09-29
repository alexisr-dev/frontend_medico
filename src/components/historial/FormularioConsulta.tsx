import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { Boton } from '@/components/common/Boton'
import { Campo, CampoArea } from '@/components/common/Campo'
import { sinErrores, validarConsulta, type ErroresFormulario } from '@/utils/validaciones'
import type { NuevaConsulta, Receta } from '@/types/historial.types'

type BorradorReceta = Omit<Receta, 'id' | 'registro_consulta'>

const RECETA_VACIA: BorradorReceta = {
  medicamento: '',
  dosis: '',
  frecuencia: '',
  duracion: '',
  indicaciones: '',
}

interface Props {
  citaId: string
  guardando: boolean
  onGuardar: (datos: NuevaConsulta) => void
}

export const FormularioConsulta = ({ citaId, guardando, onGuardar }: Props) => {
  const [diagnostico, setDiagnostico] = useState('')
  const [tratamiento, setTratamiento] = useState('')
  const [notas, setNotas] = useState('')
  const [recetas, setRecetas] = useState<BorradorReceta[]>([])
  const [errores, setErrores] = useState<ErroresFormulario>({})

  const cambiarReceta = (indice: number, campo: keyof BorradorReceta, valor: string) => {
    setRecetas((previas) => previas.map((receta, i) => (i === indice ? { ...receta, [campo]: valor } : receta)))
  }

  const enviar = (evento: React.FormEvent) => {
    evento.preventDefault()
    const encontrados = validarConsulta(diagnostico)
    setErrores(encontrados)
    if (!sinErrores(encontrados)) return

    onGuardar({
      cita: citaId,
      diagnostico: diagnostico.trim(),
      tratamiento: tratamiento.trim(),
      notas: notas.trim(),
      recetas: recetas.filter((receta) => receta.medicamento.trim().length > 0),
    })
  }

  return (
    <form className="apilar" style={{ gap: 14 }} onSubmit={enviar}>
      <CampoArea
        etiqueta="Diagnostico"
        placeholder="Ej: hipertension arterial etapa 1"
        value={diagnostico}
        error={errores.diagnostico}
        onChange={(evento) => setDiagnostico(evento.target.value)}
      />
      <CampoArea
        etiqueta="Tratamiento indicado"
        placeholder="Ej: dieta hiposodica, control en 30 dias"
        value={tratamiento}
        onChange={(evento) => setTratamiento(evento.target.value)}
      />
      <CampoArea
        etiqueta="Notas de la atencion"
        placeholder="Observaciones relevantes para la proxima consulta"
        value={notas}
        onChange={(evento) => setNotas(evento.target.value)}
      />

      <div className="apilar" style={{ gap: 10 }}>
        <div className="fila" style={{ justifyContent: 'space-between' }}>
          <p className="rotulo">Recetas</p>
          <Boton
            type="button"
            variante="fantasma"
            pequeno
            icono={<Plus size={15} />}
            onClick={() => setRecetas((previas) => [...previas, { ...RECETA_VACIA }])}
          >
            Agregar medicamento
          </Boton>
        </div>

        {recetas.map((receta, indice) => (
          <div
            key={indice}
            className="apilar"
            style={{ gap: 10, padding: 14, border: '1px solid var(--borde)', borderRadius: 'var(--radio)' }}
          >
            <Campo
              etiqueta="Medicamento"
              placeholder="Paracetamol 500mg"
              value={receta.medicamento}
              onChange={(evento) => cambiarReceta(indice, 'medicamento', evento.target.value)}
            />
            <div className="rejilla" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
              <Campo
                etiqueta="Dosis"
                placeholder="1 comprimido"
                value={receta.dosis}
                onChange={(evento) => cambiarReceta(indice, 'dosis', evento.target.value)}
              />
              <Campo
                etiqueta="Frecuencia"
                placeholder="cada 8 horas"
                value={receta.frecuencia}
                onChange={(evento) => cambiarReceta(indice, 'frecuencia', evento.target.value)}
              />
              <Campo
                etiqueta="Duracion"
                placeholder="5 dias"
                value={receta.duracion}
                onChange={(evento) => cambiarReceta(indice, 'duracion', evento.target.value)}
              />
            </div>
            <Boton
              type="button"
              variante="fantasma"
              pequeno
              icono={<Trash2 size={15} />}
              onClick={() => setRecetas((previas) => previas.filter((_, i) => i !== indice))}
            >
              Quitar
            </Boton>
          </div>
        ))}
      </div>

      <Boton type="submit" cargando={guardando}>
        Guardar consulta
      </Boton>
    </form>
  )
}
