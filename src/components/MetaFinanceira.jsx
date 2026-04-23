import { useState } from 'react'

function MetaFinanceira({ totalGastos, totalReceitas, mes }) {
  const chave = `meta_${mes}`
  const [meta, setMeta] = useState(() => {
    const salvo = localStorage.getItem(chave)
    return salvo ? JSON.parse(salvo) : null
  })
  const [editando, setEditando] = useState(false)
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState('economia')

  function salvarMeta() {
    if (!valor) return
    const nova = { valor: parseFloat(valor), tipo }
    setMeta(nova)
    localStorage.setItem(chave, JSON.stringify(nova))
    setEditando(false)
    setValor('')
  }

  function removerMeta() {
    setMeta(null)
    localStorage.removeItem(chave)
  }

  const economia = totalReceitas - totalGastos
  const progresso = meta
    ? Math.min(100, Math.round((meta.tipo === 'economia' ? economia : totalGastos) / meta.valor * 100))
    : 0

  const atingiu = meta && (meta.tipo === 'economia' ? economia >= meta.valor : totalGastos <= meta.valor)

  return (
    <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-5">
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm font-medium text-slate-300">Meta do mês</p>
        {meta && (
          <div className="flex gap-2">
            <button onClick={() => setEditando(true)} className="text-xs text-slate-500 hover:text-blue-400 transition-colors">Editar</button>
            <button onClick={removerMeta} className="text-xs text-slate-500 hover:text-rose-400 transition-colors">Remover</button>
          </div>
        )}
      </div>

      {!meta && !editando && (
        <div className="text-center py-4">
          <p className="text-sm text-slate-600 mb-3">Nenhuma meta definida para {mes}</p>
          <button
            onClick={() => setEditando(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors"
          >
            Definir meta
          </button>
        </div>
      )}

      {editando && (
        <div>
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setTipo('economia')}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${tipo === 'economia' ? 'bg-emerald-900 border-emerald-600 text-emerald-300' : 'border-[#30363d] text-slate-500'}`}
            >
              Economizar
            </button>
            <button
              onClick={() => setTipo('gasto')}
              className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-colors ${tipo === 'gasto' ? 'bg-rose-900 border-rose-600 text-rose-300' : 'border-[#30363d] text-slate-500'}`}
            >
              Limite de gasto
            </button>
          </div>
          <input
            type="number"
            placeholder={tipo === 'economia' ? 'Economizar R$...' : 'Gastar no máximo R$...'}
            value={valor}
            onChange={e => setValor(e.target.value)}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 mb-3 outline-none focus:border-blue-500 placeholder-slate-600"
          />
          <div className="flex gap-2">
            <button onClick={() => setEditando(false)} className="flex-1 py-2.5 rounded-xl text-sm border border-[#30363d] text-slate-400 hover:border-slate-500 transition-colors">
              Cancelar
            </button>
            <button onClick={salvarMeta} className="flex-1 py-2.5 rounded-xl text-sm bg-blue-600 text-white hover:bg-blue-500 transition-colors">
              Salvar
            </button>
          </div>
        </div>
      )}

      {meta && !editando && (
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-xs text-slate-500">
              {meta.tipo === 'economia' ? `Economizar R$ ${meta.valor.toFixed(2)}` : `Gastar até R$ ${meta.valor.toFixed(2)}`}
            </p>
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${atingiu ? 'bg-emerald-900 text-emerald-300' : 'bg-[#0d1117] text-slate-400'}`}>
              {atingiu ? 'Meta atingida!' : `${progresso}%`}
            </span>
          </div>
          <div className="w-full bg-[#0d1117] rounded-full h-2 mb-2">
            <div
              className={`h-2 rounded-full transition-all duration-500 ${atingiu ? 'bg-emerald-500' : meta.tipo === 'gasto' && progresso > 90 ? 'bg-rose-500' : 'bg-blue-500'}`}
              style={{ width: `${progresso}%` }}
            />
          </div>
          <p className="text-xs text-slate-500">
            {meta.tipo === 'economia'
              ? `Economizado: R$ ${Math.max(0, economia).toFixed(2)} de R$ ${meta.valor.toFixed(2)}`
              : `Gasto: R$ ${totalGastos.toFixed(2)} de R$ ${meta.valor.toFixed(2)}`
            }
          </p>
        </div>
      )}
    </div>
  )
}

export default MetaFinanceira