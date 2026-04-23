import { useState } from 'react'
import Modal from '../components/Modal'
import Transicao from '../components/Transicao'

const DIAS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']

function Cronograma() {
  const [aulas, setAulas] = useState(() => {
    const salvo = localStorage.getItem('cronograma')
    return salvo ? JSON.parse(salvo) : []
  })
  const [descricao, setDescricao] = useState('')
  const [horario, setHorario] = useState('')
  const [dia, setDia] = useState('Segunda')
  const [tipo, setTipo] = useState('aluno')
  const [notas, setNotas] = useState('')
  const [mostrarForm, setMostrarForm] = useState(false)
  const [editando, setEditando] = useState(null)
  const [busca, setBusca] = useState('')
  const [modalApagar, setModalApagar] = useState(null)
  const [modalReset, setModalReset] = useState(false)

  function salvar(novas) {
    setAulas(novas)
    localStorage.setItem('cronograma', JSON.stringify(novas))
  }

  function adicionarAula() {
    if (!descricao || !horario) return
    if (editando) {
      salvar(aulas.map(a => a.id === editando
        ? { ...a, descricao, horario, dia, tipo, notas }
        : a
      ))
      setEditando(null)
    } else {
      salvar([...aulas, { id: Date.now(), descricao, horario, dia, tipo, notas }])
    }
    setDescricao('')
    setHorario('')
    setNotas('')
    setMostrarForm(false)
  }

  function iniciarEdicao(a) {
    setEditando(a.id)
    setDescricao(a.descricao)
    setHorario(a.horario)
    setDia(a.dia)
    setTipo(a.tipo)
    setNotas(a.notas || '')
    setMostrarForm(true)
  }

  function cancelarEdicao() {
    setEditando(null)
    setDescricao('')
    setHorario('')
    setNotas('')
    setMostrarForm(false)
  }

  function confirmarRemover() {
    salvar(aulas.filter(a => a.id !== modalApagar))
    setModalApagar(null)
  }

  function resetarTudo() {
    salvar([])
    setModalReset(false)
  }

  const aulasFiltradas = busca
    ? aulas.filter(a => a.descricao.toLowerCase().includes(busca.toLowerCase()))
    : aulas

  const inputClass = "w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 mb-3 outline-none focus:border-blue-500 placeholder-slate-600"
  const selectClass = "flex-1 bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500"

  return (
    <Transicao>
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-white">Cronograma</h1>
        <div className="flex gap-2">
          <button onClick={() => setModalReset(true)}
            className="px-3 py-2 rounded-xl text-sm font-medium bg-[#161b22] text-rose-400 border border-[#30363d] hover:border-rose-800 transition-colors">
            Limpar
          </button>
          <button onClick={() => { if (mostrarForm && !editando) { setMostrarForm(false) } else if (editando) { cancelarEdicao() } else { setMostrarForm(true) } }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${mostrarForm ? 'bg-[#161b22] text-slate-400 border border-[#30363d]' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
            {mostrarForm ? 'Cancelar' : '+ Nova aula'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-[#161b22] rounded-2xl p-4 border border-[#30363d] text-center">
          <p className="text-2xl font-semibold text-white">{aulas.length}</p>
          <p className="text-xs text-slate-500 mt-1">Total</p>
        </div>
        <div className="bg-blue-950 rounded-2xl p-4 border border-blue-900 text-center">
          <p className="text-2xl font-semibold text-blue-300">{aulas.filter(a => a.tipo === 'aluno').length}</p>
          <p className="text-xs text-blue-500 mt-1">Como aluno</p>
        </div>
        <div className="bg-purple-950 rounded-2xl p-4 border border-purple-900 text-center">
          <p className="text-2xl font-semibold text-purple-300">{aulas.filter(a => a.tipo === 'professor').length}</p>
          <p className="text-xs text-purple-500 mt-1">Como prof</p>
        </div>
      </div>

      <input type="text" placeholder="Pesquisar aula..." value={busca} onChange={e => setBusca(e.target.value)}
        className="w-full bg-[#161b22] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 mb-6 outline-none focus:border-blue-500 placeholder-slate-600" />

      {mostrarForm && (
        <div className="bg-[#161b22] rounded-2xl p-5 border border-[#30363d] mb-6">
          {editando && (
            <div className="flex items-center justify-between mb-4 bg-blue-950 border border-blue-900 rounded-xl px-4 py-2.5">
              <p className="text-sm text-blue-300">Editando aula</p>
              <button onClick={cancelarEdicao} className="text-xs text-slate-400 hover:text-white transition-colors">Cancelar</button>
            </div>
          )}
          <h2 className="text-base font-medium text-slate-300 mb-4">{editando ? 'Editar aula' : 'Nova aula'}</h2>
          <div className="flex gap-3 mb-3">
            <button onClick={() => setTipo('aluno')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${tipo === 'aluno' ? 'bg-blue-900 border-blue-600 text-blue-300' : 'border-[#30363d] text-slate-500'}`}>
              Sou aluno
            </button>
            <button onClick={() => setTipo('professor')}
              className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-colors ${tipo === 'professor' ? 'bg-purple-900 border-purple-600 text-purple-300' : 'border-[#30363d] text-slate-500'}`}>
              Sou professor
            </button>
          </div>
          <input type="text" placeholder="Ex: Eletrotécnica — Circuitos" value={descricao} onChange={e => setDescricao(e.target.value)} className={inputClass} />
          <div className="flex gap-3 mb-3">
            <select value={dia} onChange={e => setDia(e.target.value)} className={selectClass}>
              {DIAS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
            <input type="time" value={horario} onChange={e => setHorario(e.target.value)} className={selectClass} />
          </div>
          <textarea placeholder="Observações (opcional)" value={notas} onChange={e => setNotas(e.target.value)} rows={3}
            className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 mb-3 outline-none focus:border-blue-500 placeholder-slate-600 resize-none" />
          <button onClick={adicionarAula} className="w-full bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-500 transition-colors">
            {editando ? 'Salvar alterações' : 'Salvar aula'}
          </button>
        </div>
      )}

      <div className="flex flex-col gap-4">
        {DIAS.map(d => {
          const aulasDoDia = aulasFiltradas.filter(a => a.dia === d).sort((a, b) => a.horario.localeCompare(b.horario))
          if (aulasDoDia.length === 0) return null
          return (
            <div key={d} className="bg-[#161b22] rounded-2xl border border-[#30363d] overflow-hidden">
              <div className="px-5 py-3 border-b border-[#30363d] flex items-center justify-between">
                <p className="text-sm font-semibold text-slate-300">{d}</p>
                <span className="text-xs text-slate-600">{aulasDoDia.length} aula{aulasDoDia.length > 1 ? 's' : ''}</span>
              </div>
              {aulasDoDia.map(a => (
                <div key={a.id} className="px-5 py-3.5 border-b border-[#30363d] last:border-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-mono text-slate-500 w-12">{a.horario}</span>
                      <div>
                        <p className="text-sm font-medium text-slate-200">{a.descricao}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${a.tipo === 'professor' ? 'bg-purple-900 text-purple-300' : 'bg-blue-900 text-blue-300'}`}>
                          {a.tipo === 'professor' ? 'Professor' : 'Aluno'}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => iniciarEdicao(a)} className="text-slate-600 hover:text-blue-400 text-sm transition-colors px-1">✎</button>
                      <button onClick={() => setModalApagar(a.id)} className="text-slate-600 hover:text-rose-400 text-xl transition-colors">×</button>
                    </div>
                  </div>
                  {a.notas && (
                    <p className="text-xs text-slate-500 mt-2 border-l-2 border-[#30363d] pl-3 ml-3">
                      {a.notas}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        })}
        {aulasFiltradas.length === 0 && (
          <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-10 text-center">
            <p className="text-slate-600 text-sm">{busca ? 'Nenhuma aula encontrada' : 'Nenhuma aula cadastrada ainda'}</p>
          </div>
        )}
      </div>

      {modalApagar && (
        <Modal titulo="Apagar aula" mensagem="Tem certeza que quer apagar essa aula? Essa ação não pode ser desfeita." onConfirmar={confirmarRemover} onCancelar={() => setModalApagar(null)} />
      )}
      {modalReset && (
        <Modal titulo="Apagar tudo" mensagem="Isso vai apagar todas as aulas permanentemente. Tem certeza?" onConfirmar={resetarTudo} onCancelar={() => setModalReset(false)} />
      )}
    </div>
    </Transicao>
  )
}

export default Cronograma