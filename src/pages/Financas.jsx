import { useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis } from 'recharts'
import Modal from '../components/Modal'
import MetaFinanceira from '../components/MetaFinanceira'
import Transicao from '../components/Transicao'

function Financas() {
  const [transacoes, setTransacoes] = useState(() => {
    const salvo = localStorage.getItem('financas')
    return salvo ? JSON.parse(salvo) : []
  })
  const [descricao, setDescricao] = useState('')
  const [valor, setValor] = useState('')
  const [tipo, setTipo] = useState('gasto')
  const [categoria, setCategoria] = useState('alimentacao')
  const [aba, setAba] = useState('resumo')
  const [modalApagar, setModalApagar] = useState(null)
  const [modalReset, setModalReset] = useState(false)
  const [editando, setEditando] = useState(null)
  const [mesFiltro, setMesFiltro] = useState(() => {
    const hoje = new Date()
    return `${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`
  })

  const categorias = {
    alimentacao: 'Alimentação', transporte: 'Transporte', saude: 'Saúde',
    lazer: 'Lazer', salario: 'Salário', freela: 'Freela', outro: 'Outro',
  }

  const cores = {
    alimentacao: '#6366f1', transporte: '#f59e0b', saude: '#10b981',
    lazer: '#f43f5e', salario: '#3b82f6', freela: '#8b5cf6', outro: '#94a3b8',
  }

  function salvar(novas) {
    setTransacoes(novas)
    localStorage.setItem('financas', JSON.stringify(novas))
  }

  function adicionarTransacao() {
    if (!descricao || !valor) return
    if (editando) {
      salvar(transacoes.map(t => t.id === editando
        ? { ...t, descricao, valor: parseFloat(valor), tipo, categoria }
        : t
      ))
      setEditando(null)
    } else {
      salvar([{ id: Date.now(), descricao, valor: parseFloat(valor), tipo, categoria, data: new Date().toLocaleDateString('pt-BR') }, ...transacoes])
    }
    setDescricao('')
    setValor('')
    setAba('historico')
  }

  function iniciarEdicao(t) {
    setEditando(t.id)
    setDescricao(t.descricao)
    setValor(String(t.valor))
    setTipo(t.tipo)
    setCategoria(t.categoria)
    setAba('adicionar')
  }

  function cancelarEdicao() {
    setEditando(null)
    setDescricao('')
    setValor('')
    setTipo('gasto')
    setCategoria('alimentacao')
  }

  function confirmarRemover() {
    salvar(transacoes.filter(t => t.id !== modalApagar))
    setModalApagar(null)
  }

  function resetarTudo() {
    salvar([])
    setModalReset(false)
  }

  // Gera lista de meses disponíveis a partir das transações
  const mesesDisponiveis = [...new Set(transacoes.map(t => {
    const partes = t.data.split('/')
    return `${partes[1]}/${partes[2]}`
  }))].sort((a, b) => {
    const [ma, aa] = a.split('/')
    const [mb, ab] = b.split('/')
    return new Date(ab, mb - 1) - new Date(aa, ma - 1)
  })

  const transacoesFiltradas = transacoes.filter(t => {
    const partes = t.data.split('/')
    const mes = `${partes[1]}/${partes[2]}`
    return mes === mesFiltro
  })

  const totalReceitas = transacoesFiltradas.filter(t => t.tipo === 'receita').reduce((acc, t) => acc + t.valor, 0)
  const totalGastos = transacoesFiltradas.filter(t => t.tipo === 'gasto').reduce((acc, t) => acc + t.valor, 0)
  const saldo = totalReceitas - totalGastos

  const dadosGrafico = Object.entries(categorias)
    .map(([key, label]) => ({ name: label, value: transacoesFiltradas.filter(t => t.categoria === key && t.tipo === 'gasto').reduce((acc, t) => acc + t.valor, 0), key }))
    .filter(d => d.value > 0)

  const inputClass = "w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 mb-3 outline-none focus:border-blue-500 placeholder-slate-600"
  const inputRowClass = "flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500"

  return (
    <Transicao>    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Finanças</h1>
        <select
          value={mesFiltro}
          onChange={e => setMesFiltro(e.target.value)}
          className="bg-[#161b22] border border-[#30363d] rounded-xl px-3 py-2 text-sm text-slate-300 outline-none focus:border-blue-500"
        >
          {mesesDisponiveis.length === 0 ? (
            <option value={mesFiltro}>{mesFiltro}</option>
          ) : (
            mesesDisponiveis.map(m => <option key={m} value={m}>{m}</option>)
          )}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#161b22] rounded-2xl p-4 border border-[#30363d]">
          <p className="text-xs text-slate-500 mb-1">Receitas</p>
          <p className="text-lg font-semibold text-emerald-400">R$ {totalReceitas.toFixed(2)}</p>
        </div>
        <div className="bg-[#161b22] rounded-2xl p-4 border border-[#30363d]">
          <p className="text-xs text-slate-500 mb-1">Gastos</p>
          <p className="text-lg font-semibold text-rose-400">R$ {totalGastos.toFixed(2)}</p>
        </div>
        <div className={`rounded-2xl p-4 border ${saldo >= 0 ? 'bg-emerald-900 border-emerald-700' : 'bg-rose-900 border-rose-700'}`}>
          <p className="text-xs text-slate-400 mb-1">Saldo</p>
          <p className={`text-lg font-semibold ${saldo >= 0 ? 'text-emerald-300' : 'text-rose-300'}`}>R$ {saldo.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['resumo', 'adicionar', 'historico'].map(a => (
          <button key={a} onClick={() => { setAba(a); if (a !== 'adicionar') cancelarEdicao() }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${aba === a ? 'bg-blue-600 text-white' : 'bg-[#161b22] text-slate-400 border border-[#30363d] hover:border-slate-500'}`}>
            {a === 'resumo' ? 'Resumo' : a === 'adicionar' ? (editando ? 'Editando' : '+ Adicionar') : 'Histórico'}
          </button>
        ))}
        <button
          onClick={() => setModalReset(true)}
          className="ml-auto px-4 py-2 rounded-xl text-sm font-medium bg-[#161b22] text-rose-400 border border-[#30363d] hover:border-rose-800 transition-colors"
        >
          Limpar
        </button>
      </div>

      {aba === 'resumo' && (
        <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-5">
          <p className="text-sm font-medium text-slate-300 mb-4">Gastos por categoria — {mesFiltro}</p>
          {dadosGrafico.length === 0 ? (
            <p className="text-center text-slate-600 text-sm py-8">Nenhum gasto registrado nesse mês</p>
          ) : (
            <>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={dadosGrafico} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                    {dadosGrafico.map(entry => <Cell key={entry.key} fill={cores[entry.key]} />)}
                  </Pie>
                  <Tooltip formatter={v => `R$ ${v.toFixed(2)}`} contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, color: '#e5e5e5' }} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-2 mt-2">
                {dadosGrafico.map(d => (
                  <div key={d.key} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ background: cores[d.key] }} />
                      <span className="text-sm text-slate-400">{d.name}</span>
                    </div>
                    <span className="text-sm font-medium text-slate-200">R$ {d.value.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {aba === 'adicionar' && (
        <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-5">
          {editando && (
            <div className="flex items-center justify-between mb-4 bg-blue-950 border border-blue-900 rounded-xl px-4 py-2.5">
              <p className="text-sm text-blue-300">Editando transação</p>
              <button onClick={cancelarEdicao} className="text-xs text-slate-400 hover:text-white transition-colors">Cancelar</button>
            </div>
          )}
          <div className="flex gap-3 mb-4">
            <button onClick={() => setTipo('gasto')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${tipo === 'gasto' ? 'bg-rose-900 border-rose-600 text-rose-300' : 'border-[#30363d] text-slate-500'}`}>
              Gasto
            </button>
            <button onClick={() => setTipo('receita')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${tipo === 'receita' ? 'bg-emerald-900 border-emerald-600 text-emerald-300' : 'border-[#30363d] text-slate-500'}`}>
              Receita
            </button>
          </div>
          <input type="text" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} className={inputClass} />
          <div className="flex gap-3 mb-4">
            <input type="number" placeholder="Valor (R$)" value={valor} onChange={e => setValor(e.target.value)} className={inputRowClass} />
            <select value={categoria} onChange={e => setCategoria(e.target.value)} className={inputRowClass}>
              {Object.entries(categorias).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
            </select>
          </div>
          <button onClick={adicionarTransacao} className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors">
            {editando ? 'Salvar alterações' : 'Adicionar'}
          </button>
        </div>
      )}
{aba === 'resumo' && (
  <div className="flex flex-col gap-4">
    {/* Gráfico de pizza por categoria */}
    <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-5">
      <p className="text-sm font-medium text-slate-300 mb-4">Gastos por categoria — {mesFiltro}</p>
      {dadosGrafico.length === 0 ? (
        <p className="text-center text-slate-600 text-sm py-8">Nenhum gasto registrado nesse mês</p>
      ) : (
        <>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={dadosGrafico} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value">
                {dadosGrafico.map(entry => <Cell key={entry.key} fill={cores[entry.key]} />)}
              </Pie>
              <Tooltip formatter={v => `R$ ${v.toFixed(2)}`} contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, color: '#e5e5e5' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col gap-2 mt-2">
            {dadosGrafico.map(d => (
              <div key={d.key} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ background: cores[d.key] }} />
                  <span className="text-sm text-slate-400">{d.name}</span>
                </div>
                <span className="text-sm font-medium text-slate-200">R$ {d.value.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>

    {/* Gráfico de barras por mês */}
    <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-5">
      <p className="text-sm font-medium text-slate-300 mb-4">Evolução mensal</p>
      {mesesDisponiveis.length === 0 ? (
        <p className="text-center text-slate-600 text-sm py-8">Nenhum dado ainda</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={[...mesesDisponiveis].reverse().map(m => {
              const t = transacoes.filter(t => {
                const p = t.data.split('/')
                return `${p[1]}/${p[2]}` === m
              })
              return {
                mes: m.split('/')[0] + '/' + m.split('/')[1].slice(2),
                receitas: t.filter(x => x.tipo === 'receita').reduce((a, x) => a + x.valor, 0),
                gastos: t.filter(x => x.tipo === 'gasto').reduce((a, x) => a + x.valor, 0),
              }
            })}
            margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
          >
            <XAxis dataKey="mes" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              formatter={(v, name) => [`R$ ${v.toFixed(2)}`, name === 'receitas' ? 'Receitas' : 'Gastos']}
              contentStyle={{ background: '#161b22', border: '1px solid #30363d', borderRadius: 12, color: '#e5e5e5' }}
            />
            <Bar dataKey="receitas" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="gastos" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>

    {/* Meta financeira */}
    <MetaFinanceira totalGastos={totalGastos} totalReceitas={totalReceitas} mes={mesFiltro} />
  </div>

      )}

      {modalApagar && (
        <Modal titulo="Apagar transação" mensagem="Tem certeza que quer apagar essa transação? Essa ação não pode ser desfeita." onConfirmar={confirmarRemover} onCancelar={() => setModalApagar(null)} />
      )}
      {modalReset && (
        <Modal titulo="Apagar tudo" mensagem="Isso vai apagar todas as transações permanentemente. Tem certeza?" onConfirmar={resetarTudo} onCancelar={() => setModalReset(false)} />
      )}
    </div>
    </Transicao>

  )
}

export default Financas