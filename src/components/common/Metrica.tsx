interface Props {
  rotulo: string
  valor: string | number
  pie?: string
  acento?: boolean
}

export const Metrica = ({ rotulo, valor, pie, acento = false }: Props) => (
  <div className={`metrica ${acento ? 'metrica--acento' : ''}`}>
    <p className="rotulo">{rotulo}</p>
    <p className="metrica__valor">{valor}</p>
    {pie ? <p className="metrica__pie">{pie}</p> : null}
  </div>
)
