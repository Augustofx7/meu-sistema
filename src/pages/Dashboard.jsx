import { useNavigate } from 'react-router-dom'
import Transicao from '../components/Transicao'

function Dashboard() {
  const navigate = useNavigate()
  const hoje = new Date()
  const diaSemana = hoje.toLocaleDateString('pt-BR', { weekday: 'long' })
  const dataFormatada = hoje.toLocaleDateString('pt-BR', { day: 'numeric', month: 'long' })
  const diaNome = diaSemana.charAt(0).toUpperCase() + diaSemana.slice(1)

  const nome = localStorage.getItem('usuario_nome') || ''
  const transacoes = JSON.parse(localStorage.getItem('financas') || '[]')
  const aulas = JSON.parse(localStorage.getItem('cronograma') || '[]')
  const habitos = JSON.parse(localStorage.getItem('habitos') || '[]')
  const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]')

  const totalReceitas = transacoes.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0)
  const totalGastos = transacoes.filter(t => t.tipo === 'gasto').reduce((acc, t) => acc + t.valor, 0)
  const saldo = totalReceitas - totalGastos

  const diasMap = {
    'segunda-feira': 'Segunda', 'terça-feira': 'Terça', 'quarta-feira': 'Quarta',
    'quinta-feira': 'Quinta', 'sexta-feira': 'Sexta', 'sábado': 'Sábado', 'domingo': 'Domingo',
  }

  const diaHoje = diasMap[diaSemana.toLowerCase()] || ''
  const aulasHoje = aulas.filter(a => a.dia === diaHoje).sort((a, b) => a.horario.localeCompare(b.horario))
  const totalItens = habitos.length + tarefas.length
  const feitos = habitos.filter(h => h.feito).length + tarefas.filter(t => t.feita).length
  const porcentagem = totalItens === 0 ? 0 : Math.round((feitos / totalItens) * 100)

  const saudacao = () => {
    const hora = hoje.getHours()
    if (hora < 12) return 'Bom dia'
    if (hora < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <Transicao>
    <div className="max-w-2xl mx-auto">

      {/* Header com nome */}
      <div className="mb-6">
        <p className="text-sm text-slate-400">{diaNome}, {dataFormatada}</p>
        <h1 className="text-2xl font-semibold text-white">
          {saudacao()}{nome ? ', ' + nome.split(' ')[0] : ''}!
        </h1>
      </div>

      {/* Card de saldo */}
      <div
        onClick={() => navigate('/financas')}
        className={`rounded-2xl p-5 mb-4 cursor-pointer hover:opacity-90 transition-opacity ${saldo >= 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}
      >
        <p className="text-sm text-white opacity-70 mb-1">Saldo do mês</p>
        <p className="text-3xl font-semibold text-white">R$ {saldo.toFixed(2)}</p>
        <div className="flex gap-4 mt-3">
          <p className="text-xs text-white opacity-60">Receitas: R$ {totalReceitas.toFixed(2)}</p>
          <p className="text-xs text-white opacity-60">Gastos: R$ {totalGastos.toFixed(2)}</p>
        </div>
      </div>

      {/* Progresso da rotina */}
      <div
        onClick={() => navigate('/rotina')}
        className="bg-[#161b22] rounded-2xl p-5 border border-[#30363d] mb-4 cursor-pointer hover:border-slate-500 transition-colors"
      >
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-slate-300">Rotina de hoje</p>
          <p className="text-sm font-semibold text-white">{porcentagem}%</p>
        </div>
        <div className="w-full bg-[#30363d] rounded-full h-2 mb-2">
          <div className="bg-blue-400 h-2 rounded-full transition-all duration-500" style={{ width: `${porcentagem}%` }} />
        </div>
        <p className="text-xs text-slate-500">{feitos} de {totalItens} itens concluídos</p>
      </div>

      {/* Aulas de hoje */}
      <div
        onClick={() => navigate('/cronograma')}
        className="bg-[#161b22] rounded-2xl border border-[#30363d] overflow-hidden cursor-pointer hover:border-slate-500 transition-colors"
      >
        <div className="px-5 py-3.5 border-b border-[#30363d]">
          <p className="text-sm font-semibold text-slate-300">Aulas de hoje</p>
        </div>
        {aulasHoje.length === 0 ? (
          <p className="text-center text-slate-600 text-sm py-6">Sem aulas hoje</p>
        ) : (
          aulasHoje.map(a => (
            <div key={a.id} className="flex items-center justify-between px-5 py-3 border-b border-[#30363d] last:border-0">
              <div className="flex items-center gap-3">
                <span className="text-sm font-mono text-slate-500 w-12">{a.horario}</span>
                <p className="text-sm font-medium text-slate-200">{a.descricao}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${a.tipo === 'professor' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
                {a.tipo === 'professor' ? 'Prof' : 'Aluno'}
              </span>
            </div>
          ))
        )}
      </div>

    </div>
    </Transicao>
  )
}

export default Dashboard