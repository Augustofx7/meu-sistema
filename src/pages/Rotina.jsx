import { useState, useEffect } from 'react'
import Modal from '../components/Modal'
import Transicao from '../components/Transicao'

const PERIODOS = ['Manhã', 'Tarde', 'Noite']

function Rotina() {
  const [habitos, setHabitos] = useState(() => {
    const salvo = localStorage.getItem('habitos')
    return salvo ? JSON.parse(salvo) : []
  })
  const [tarefas, setTarefas] = useState(() => {
    const salvo = localStorage.getItem('tarefas')
    return salvo ? JSON.parse(salvo) : []
  })
  const [novoHabito, setNovoHabito] = useState('')
  const [periodoHabito, setPeriodoHabito] = useState('Manhã')
  const [novaTarefa, setNovaTarefa] = useState('')
  const [periodoTarefa, setPeriodoTarefa] = useState('Manhã')
  const [aba, setAba] = useState('hoje')
  const [busca, setBusca] = useState('')
  const [modalApagar, setModalApagar] = useState(null)
  const [modalReset, setModalReset] = useState(false)

  // Novo estado adicionado após o modalReset
  const [streak, setStreak] = useState(() => {
    const salvo = localStorage.getItem('rotina_streak')
    return salvo ? JSON.parse(salvo) : { atual: 0, maior: 0, ultimoDia: null }
  })

  useEffect(() => {
    const hoje = new Date().toLocaleDateString('pt-BR')
    const ultimoReset = localStorage.getItem('ultimoReset')
    if (ultimoReset !== hoje) {
      const hr = habitos.map(h => ({ ...h, feito: false }))
      const tr = tarefas.map(t => ({ ...t, feita: false }))
      setHabitos(hr)
      setTarefas(tr)
      localStorage.setItem('habitos', JSON.stringify(hr))
      localStorage.setItem('tarefas', JSON.stringify(tr))
      localStorage.setItem('ultimoReset', hoje)
    }
  }, [])

  function salvarHabitos(novos) {
    setHabitos(novos)
    localStorage.setItem('habitos', JSON.stringify(novos))
    atualizarStreak(novos, tarefas)
  }

  function salvarTarefas(novas) {
    setTarefas(novas)
    localStorage.setItem('tarefas', JSON.stringify(novas))
    atualizarStreak(habitos, novas)
  }

  function confirmarRemover() {
    if (modalApagar?.tipo === 'habito') salvarHabitos(habitos.filter(h => h.id !== modalApagar.id))
    else salvarTarefas(tarefas.filter(t => t.id !== modalApagar.id))
    setModalApagar(null)
  }

  function resetarTudo() {
    salvarHabitos([])
    salvarTarefas([])
    setModalReset(false)
  }

  // Função atualizarStreak adicionada após resetarTudo
  function atualizarStreak(habitosNovos, tarefasNovas) {
    const hoje = new Date().toLocaleDateString('pt-BR')
    const totalAtual = habitosNovos.length + tarefasNovas.length
    const feitosAtual = habitosNovos.filter(h => h.feito).length + tarefasNovas.filter(t => t.feita).length
    
    if (totalAtual === 0) return
    
    if (feitosAtual === totalAtual) {
      const ontem = new Date()
      ontem.setDate(ontem.getDate() - 1)
      const ontemStr = ontem.toLocaleDateString('pt-BR')
      
      const novoStreak = {
        atual: streak.ultimoDia === ontemStr || streak.ultimoDia === hoje
          ? streak.atual + (streak.ultimoDia === hoje ? 0 : 1)
          : 1,
        maior: 0,
        ultimoDia: hoje,
      }
      
      novoStreak.maior = Math.max(novoStreak.atual, streak.maior)
      setStreak(novoStreak)
      localStorage.setItem('rotina_streak', JSON.stringify(novoStreak))
    }
  }

  const totalItens = habitos.length + tarefas.length
  const feitos = habitos.filter(h => h.feito).length + tarefas.filter(t => t.feita).length
  const porcentagem = totalItens === 0 ? 0 : Math.round((feitos / totalItens) * 100)

  const inputClass = "w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 mb-3 outline-none focus:border-blue-500 placeholder-slate-600"
  const selectClass = "flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500"

  const CheckIcon = () => (
    <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
    </svg>
  )

  return (
    <Transicao>
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-semibold text-white">Rotina</h1>
        <button
          onClick={() => setModalReset(true)}
          className="px-3 py-2 rounded-xl text-sm font-medium bg-[#161b22] text-rose-400 border border-[#30363d] hover:border-rose-800 transition-colors"
        >
          Limpar tudo
        </button>
      </div>

      <p className="text-sm text-slate-500 mb-6">
        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
      </p>

      <div className="bg-[#161b22] rounded-2xl p-5 border border-[#30363d] mb-6">
        <div className="flex justify-between items-center mb-3">
          <p className="text-sm font-medium text-slate-300">Progresso do dia</p>
          <span className={`text-sm font-semibold px-3 py-1 rounded-full ${porcentagem === 100 ? 'bg-emerald-900 text-emerald-300' : 'bg-[#0d1117] text-slate-300'}`}>
            {porcentagem}%
          </span>
        </div>
        <div className="w-full bg-[#0d1117] rounded-full h-2.5">
          <div className={`h-2.5 rounded-full transition-all duration-500 ${porcentagem === 100 ? 'bg-emerald-500' : 'bg-blue-500'}`} style={{ width: `${porcentagem}%` }} />
        </div>
        <p className="text-xs text-slate-600 mt-2">{feitos} de {totalItens} itens concluídos</p>
      </div>

      {/* Streak adicionado após a barra de progresso */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-[#161b22] rounded-2xl p-4 border border-[#30363d]">
          <p className="text-xs text-slate-500 mb-1">Sequência atual</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-semibold text-amber-400">{streak.atual}</p>
            <p className="text-sm text-slate-500">dias</p>
          </div>
          <p className="text-xs text-amber-600 mt-1">
            {streak.atual === 0 ? 'Complete hoje para começar' : streak.atual === 1 ? 'Começou hoje!' : `${streak.atual} dias seguidos!`}
          </p>
        </div>
        <div className="bg-[#161b22] rounded-2xl p-4 border border-[#30363d]">
          <p className="text-xs text-slate-500 mb-1">Maior sequência</p>
          <div className="flex items-baseline gap-1">
            <p className="text-2xl font-semibold text-blue-400">{streak.maior}</p>
            <p className="text-sm text-slate-500">dias</p>
          </div>
          <p className="text-xs text-slate-600 mt-1">Seu recorde pessoal</p>
        </div>
      </div>

      <div className="flex gap-2 mb-6">
        {['hoje', 'habitos', 'tarefas'].map(a => (
          <button key={a} onClick={() => setAba(a)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${aba === a ? 'bg-blue-600 text-white' : 'bg-[#161b22] text-slate-400 border border-[#30363d] hover:border-slate-500'}`}>
            {a === 'hoje' ? 'Hoje' : a === 'habitos' ? 'Hábitos' : 'Tarefas'}
          </button>
        ))}
      </div>

      {(aba === 'habitos' || aba === 'tarefas') && (
        <input
          type="text"
          placeholder="Pesquisar..."
          value={busca}
          onChange={e => setBusca(e.target.value)}
          className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 mb-4 outline-none focus:border-blue-500 placeholder-slate-600"
        />
      )}

      {aba === 'hoje' && (
        <div className="flex flex-col gap-4">
          {PERIODOS.map(periodo => {
            const itens = [
              ...habitos.filter(h => h.periodo === periodo).map(h => ({ ...h, tipo: 'habito' })),
              ...tarefas.filter(t => t.periodo === periodo).map(t => ({ ...t, tipo: 'tarefa' })),
            ]
            if (itens.length === 0) return null
            return (
              <div key={periodo} className="bg-[#161b22] rounded-2xl border border-[#30363d] overflow-hidden">
                <div className="px-5 py-3 border-b border-[#30363d] flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-300">{periodo}</p>
                  <p className="text-xs text-slate-600">{itens.filter(i => i.feito || i.feita).length}/{itens.length}</p>
                </div>
                {itens.map(item => {
                  const concluido = item.feito || item.feita
                  return (
                    <div key={item.id} className="flex items-center gap-3 px-5 py-3.5 border-b border-[#30363d] last:border-0">
                      <button
                        onClick={() => item.tipo === 'habito'
                          ? salvarHabitos(habitos.map(h => h.id === item.id ? { ...h, feito: !h.feito } : h))
                          : salvarTarefas(tarefas.map(t => t.id === item.id ? { ...t, feita: !t.feita } : t))
                        }
                        className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center transition-all ${concluido ? 'bg-blue-500 border-blue-500' : 'border-slate-600 hover:border-slate-400'}`}
                      >
                        {concluido && <CheckIcon />}
                      </button>
                      <span className={`text-sm flex-1 transition-all ${concluido ? 'line-through text-slate-600' : 'text-slate-200'}`}>
                        {item.descricao}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${item.tipo === 'habito' ? 'bg-blue-900 text-blue-400' : 'bg-amber-900 text-amber-400'}`}>
                        {item.tipo === 'habito' ? 'hábito' : 'tarefa'}
                      </span>
                    </div>
                  )
                })}
              </div>
            )
          })}
          {totalItens === 0 && (
            <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-10 text-center">
              <p className="text-slate-600 text-sm">Nenhum item ainda</p>
              <p className="text-slate-700 text-xs mt-1">Adicione hábitos e tarefas nas abas acima</p>
            </div>
          )}
        </div>
      )}

      {aba === 'habitos' && (
        <div>
          <div className="bg-[#161b22] rounded-2xl p-5 border border-[#30363d] mb-4">
            <h2 className="text-base font-medium text-slate-300 mb-3">Novo hábito</h2>
            <input type="text" placeholder="Ex: Beber 2L de água" value={novoHabito} onChange={e => setNovoHabito(e.target.value)} className={inputClass} />
            <div className="flex gap-3">
              <select value={periodoHabito} onChange={e => setPeriodoHabito(e.target.value)} className={selectClass}>
                {PERIODOS.map(p => <option key={p}>{p}</option>)}
              </select>
              <button
                onClick={() => { if (!novoHabito) return; salvarHabitos([...habitos, { id: Date.now(), descricao: novoHabito, periodo: periodoHabito, feito: false }]); setNovoHabito('') }}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors">
                Adicionar
              </button>
            </div>
          </div>
          <div className="bg-[#161b22] rounded-2xl border border-[#30363d] overflow-hidden">
            {habitos.filter(h => h.descricao.toLowerCase().includes(busca.toLowerCase())).length === 0 ? (
              <p className="text-center text-slate-600 text-sm py-8">Nenhum hábito encontrado</p>
            ) : (
              habitos
                .filter(h => h.descricao.toLowerCase().includes(busca.toLowerCase()))
                .map(h => (
                  <div key={h.id} className="flex items-center justify-between px-5 py-3.5 border-b border-[#30363d] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{h.descricao}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{h.periodo}</p>
                    </div>
                    <button onClick={() => setModalApagar({ id: h.id, tipo: 'habito' })} className="text-slate-600 hover:text-rose-400 text-xl transition-colors">×</button>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {aba === 'tarefas' && (
        <div>
          <div className="bg-[#161b22] rounded-2xl p-5 border border-[#30363d] mb-4">
            <h2 className="text-base font-medium text-slate-300 mb-3">Nova tarefa de hoje</h2>
            <input type="text" placeholder="Ex: Revisar anotações de circuitos" value={novaTarefa} onChange={e => setNovaTarefa(e.target.value)} className={inputClass} />
            <div className="flex gap-3">
              <select value={periodoTarefa} onChange={e => setPeriodoTarefa(e.target.value)} className={selectClass}>
                {PERIODOS.map(p => <option key={p}>{p}</option>)}
              </select>
              <button
                onClick={() => { if (!novaTarefa) return; salvarTarefas([...tarefas, { id: Date.now(), descricao: novaTarefa, periodo: periodoTarefa, feita: false }]); setNovaTarefa('') }}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors">
                Adicionar
              </button>
            </div>
          </div>
          <div className="bg-[#161b22] rounded-2xl border border-[#30363d] overflow-hidden">
            {tarefas.filter(t => t.descricao.toLowerCase().includes(busca.toLowerCase())).length === 0 ? (
              <p className="text-center text-slate-600 text-sm py-8">Nenhuma tarefa encontrada</p>
            ) : (
              tarefas
                .filter(t => t.descricao.toLowerCase().includes(busca.toLowerCase()))
                .map(t => (
                  <div key={t.id} className="flex items-center justify-between px-5 py-3.5 border-b border-[#30363d] last:border-0">
                    <div>
                      <p className="text-sm font-medium text-slate-200">{t.descricao}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.periodo}</p>
                    </div>
                    <button onClick={() => setModalApagar({ id: t.id, tipo: 'tarefa' })} className="text-slate-600 hover:text-rose-400 text-xl transition-colors">×</button>
                  </div>
                ))
            )}
          </div>
        </div>
      )}

      {modalApagar && (
        <Modal
          titulo="Apagar item"
          mensagem="Tem certeza que quer apagar esse item? Essa ação não pode ser desfeita."
          onConfirmar={confirmarRemover}
          onCancelar={() => setModalApagar(null)}
        />
      )}

      {modalReset && (
        <Modal
          titulo="Limpar tudo"
          mensagem="Isso vai apagar todos os hábitos e tarefas permanentemente. Tem certeza?"
          onConfirmar={resetarTudo}
          onCancelar={() => setModalReset(false)}
        />
      )}
    </div>
    </Transicao>
  )
}

export default Rotina