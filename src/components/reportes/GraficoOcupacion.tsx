import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import type { CitasPorDia, DemandaEspecialidad, OcupacionDoctor } from '@/types/api.types'
import { fechaCorta } from '@/utils/fechas'

const EJE = { fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fill: '#7d8f9b' }
const CUADRO = {
  border: '1px solid #dde5e6',
  borderRadius: 10,
  fontSize: 12,
  fontFamily: 'Inter, sans-serif',
  boxShadow: '0 12px 32px rgba(18,33,43,0.13)',
}
const PALETA = ['#0A5C5B', '#0E7C7B', '#2F9E9C', '#4FB3B0', '#78CAC7', '#A3DEDB']

export const GraficoOcupacion = ({ datos }: { datos: OcupacionDoctor[] }) => (
  <div className="grafico">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={datos} layout="vertical" margin={{ top: 4, right: 20, bottom: 4, left: 8 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#e9eef0" horizontal={false} />
        <XAxis type="number" domain={[0, 100]} unit="%" tick={EJE} axisLine={false} tickLine={false} />
        <YAxis type="category" dataKey="doctor" width={132} tick={EJE} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={CUADRO}
          formatter={(valor) => [`${valor}%`, 'Ocupacion']}
          cursor={{ fill: 'rgba(14,124,123,0.06)' }}
        />
        <Bar dataKey="ocupacion_porcentaje" radius={[0, 5, 5, 0]} barSize={16}>
          {datos.map((fila, indice) => (
            <Cell key={fila.doctor_id} fill={PALETA[indice % PALETA.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  </div>
)

export const GraficoCitasPorDia = ({ datos }: { datos: CitasPorDia[] }) => (
  <div className="grafico">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={datos} margin={{ top: 8, right: 18, bottom: 4, left: -12 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#e9eef0" />
        <XAxis
          dataKey="dia"
          tickFormatter={(valor) => format(parseISO(valor), 'd MMM', { locale: es })}
          tick={EJE}
          axisLine={false}
          tickLine={false}
          minTickGap={28}
          interval="preserveStartEnd"
        />
        <YAxis allowDecimals={false} tick={EJE} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={CUADRO} labelFormatter={(valor) => fechaCorta(String(valor))} />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
        <Line type="monotone" dataKey="total" name="Agendadas" stroke="#0E7C7B" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="completadas" name="Completadas" stroke="#15803D" strokeWidth={2} dot={false} />
        <Line type="monotone" dataKey="canceladas" name="Canceladas" stroke="#B91C1C" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
)

export const GraficoDemanda = ({ datos }: { datos: DemandaEspecialidad[] }) => (
  <div className="grafico">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={datos} margin={{ top: 8, right: 18, bottom: 4, left: -12 }}>
        <CartesianGrid strokeDasharray="2 4" stroke="#e9eef0" vertical={false} />
        <XAxis
          dataKey="doctor__especialidad__nombre"
          tick={{ ...EJE, fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          interval={0}
          angle={-12}
          textAnchor="end"
          height={54}
        />
        <YAxis allowDecimals={false} tick={EJE} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={CUADRO} cursor={{ fill: 'rgba(14,124,123,0.06)' }} />
        <Legend wrapperStyle={{ fontSize: 12, fontFamily: 'Inter, sans-serif' }} />
        <Bar dataKey="total" name="Citas" fill="#0E7C7B" radius={[5, 5, 0, 0]} barSize={26} />
        <Bar dataKey="pacientes_unicos" name="Pacientes unicos" fill="#8AD3D0" radius={[5, 5, 0, 0]} barSize={26} />
      </BarChart>
    </ResponsiveContainer>
  </div>
)
