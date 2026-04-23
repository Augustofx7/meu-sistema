import { useState } from 'react'
import Modal from '../components/Modal'
import Transicao from '../components/Transicao'

function BotaoNotificacao() {
  const [permissao, setPermissao] = useState(
    () => 'Notification' in window ? Notification.permission : 'indisponivel'
  )

  async function ativar() {
    if (!('Notification' in window)) return
    const resultado = await Notification.requestPermission()
    setPermissao(resultado)
    if (resultado === 'granted') {
      new Notification('Notificações ativadas!', {
        body: 'Você receberá lembretes de hábitos pendentes às 21h.',
        icon: '/vite.svg',
      })
    }
  }

  if (permissao === 'indisponivel') {
    return <p className="text-xs text-slate-600">Seu navegador não suporta notificações.</p>
  }

  if (permissao === 'granted') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-500" />
        <p className="text-sm text-emerald-400">Notificações ativadas</p>
      </div>
    )
  }

  if (permissao === 'denied') {
    return (
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-rose-500" />
          <p className="text-sm text-rose-400">Notificações bloqueadas</p>
        </div>
        <p className="text-xs text-slate-600">
          Para ativar, vá nas configurações do navegador e permita notificações para este site.
        </p>
      </div>
    )
  }

  return (
    <button
      onClick={ativar}
      className="w-full py-2.5 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-500 transition-colors"
    >
      Ativar notificações
    </button>
  )
}

function Configuracoes() {
  const [nome, setNome] = useState(() => localStorage.getItem('usuario_nome') || '')
  const [novoNome, setNovoNome] = useState(nome)
  const [modalReset, setModalReset] = useState(false)
  const [salvo, setSalvo] = useState(false)

  function salvarNome() {
    localStorage.setItem('usuario_nome', novoNome)
    setNome(novoNome)
    setSalvo(true)
    setTimeout(() => setSalvo(false), 2000)
  }

  function resetarTudo() {
    localStorage.clear()
    window.location.reload()
  }

  const chaves = [
    { key: 'financas', label: 'Finanças' },
    { key: 'cronograma', label: 'Cronograma' },
    { key: 'habitos', label: 'Hábitos' },
    { key: 'tarefas', label: 'Tarefas' },
  ]

  function tamanho(key) {
    const item = localStorage.getItem(key)
    if (!item) return '0 itens'
    try {
      const parsed = JSON.parse(item)
      return Array.isArray(parsed) ? `${parsed.length} itens` : '—'
    } catch { return '—' }
  }

  const inputClass = "w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-2.5 text-sm text-slate-200 outline-none focus:border-blue-500 placeholder-slate-600"

  return (
    <Transicao>
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-semibold text-white mb-6">Configurações</h1>

        {/* Perfil */}
        <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-5 mb-4">
          <p className="text-sm font-medium text-slate-300 mb-4">Perfil</p>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-xl font-semibold flex-shrink-0">
              {novoNome ? novoNome.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1">
              <input
                type="text"
                placeholder="Seu nome"
                value={novoNome}
                onChange={e => setNovoNome(e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
          <button
            onClick={salvarNome}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition-colors ${salvo ? 'bg-emerald-700 text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
          >
            {salvo ? 'Salvo!' : 'Salvar nome'}
          </button>
        </div>

        {/* Notificações */}
        <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-5 mb-4">
          <p className="text-sm font-medium text-slate-300 mb-1">Notificações</p>
          <p className="text-xs text-slate-500 mb-4">
            Receba um lembrete às 21h se tiver hábitos pendentes no dia.
          </p>
          <BotaoNotificacao />
        </div>

        {/* Dados salvos */}
        <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-5 mb-4">
          <p className="text-sm font-medium text-slate-300 mb-4">Dados salvos</p>
          <div className="flex flex-col gap-2">
            {chaves.map(c => (
              <div key={c.key} className="flex items-center justify-between py-2 border-b border-[#30363d] last:border-0">
                <span className="text-sm text-slate-400">{c.label}</span>
                <span className="text-sm text-slate-500">{tamanho(c.key)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Sobre */}
        <div className="bg-[#161b22] rounded-2xl border border-[#30363d] p-5 mb-4">
          <p className="text-sm font-medium text-slate-300 mb-3">Sobre</p>
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Versão</span>
              <span className="text-sm text-slate-400">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-slate-500">Armazenamento</span>
              <span className="text-sm text-slate-400">Local (dispositivo)</span>
            </div>
          </div>
        </div>

        {/* Zona de perigo */}
        <div className="bg-[#161b22] rounded-2xl border border-rose-900 p-5">
          <p className="text-sm font-medium text-rose-400 mb-2">Zona de perigo</p>
          <p className="text-xs text-slate-500 mb-4">Apaga todos os dados do sistema permanentemente. Essa ação não pode ser desfeita.</p>
          <button
            onClick={() => setModalReset(true)}
            className="w-full py-2.5 rounded-xl text-sm font-medium bg-rose-950 text-rose-400 border border-rose-900 hover:bg-rose-900 transition-colors"
          >
            Apagar todos os dados
          </button>
        </div>

        {modalReset && (
          <Modal
            titulo="Apagar tudo"
            mensagem="Isso vai apagar TODOS os dados do sistema: finanças, cronograma, hábitos e tarefas. Tem certeza absoluta?"
            onConfirmar={resetarTudo}
            onCancelar={() => setModalReset(false)}
          />
        )}
      </div>
    </Transicao>
  )
}

export default Configuracoes