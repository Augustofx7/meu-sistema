import { useState } from 'react'
import Transicao from '../components/Transicao'
function Onboarding({ onConcluir }) {
  const [passo, setPasso] = useState(0)
  const [nome, setNome] = useState('')

  const passos = [
    {
      titulo: 'Bem-vindo ao seu sistema pessoal',
      descricao: 'Tudo que você precisa para organizar sua vida em um só lugar — finanças, aulas e rotina.',
      acao: null,
    },
    {
      titulo: 'Como você quer ser chamado?',
      descricao: 'Seu nome vai aparecer no painel principal.',
      acao: (
        <input
          type="text"
          placeholder="Digite seu nome"
          value={nome}
          onChange={e => setNome(e.target.value)}
          className="w-full bg-[#0d1117] border border-[#30363d] rounded-xl px-4 py-3 text-sm text-slate-200 outline-none focus:border-blue-500 placeholder-slate-600 mt-4"
          autoFocus
        />
      ),
    },
    {
      titulo: 'Tudo pronto!',
      descricao: `Olá${nome ? ', ' + nome : ''}! Seu sistema está configurado. Você pode personalizar tudo nas configurações a qualquer momento.`,
      acao: null,
    },
  ]

  function avancar() {
    if (passo < passos.length - 1) {
      setPasso(passo + 1)
    } else {
      if (nome) localStorage.setItem('usuario_nome', nome)
      localStorage.setItem('onboarding_concluido', 'true')
      onConcluir()
    }
  }

  const atual = passos[passo]

  return (
    <Transicao>
    <div className="min-h-screen bg-[#0d1117] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">

        {/* Indicador de passo */}
        <div className="flex gap-2 justify-center mb-10">
          {passos.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full transition-all duration-300 ${i === passo ? 'w-8 bg-blue-500' : i < passo ? 'w-4 bg-blue-800' : 'w-4 bg-[#30363d]'}`}
            />
          ))}
        </div>

        {/* Ícone */}
        <div className="w-16 h-16 rounded-2xl bg-blue-600 flex items-center justify-center text-3xl mb-6 mx-auto">
          {passo === 0 ? '◈' : passo === 1 ? '✦' : '✓'}
        </div>

        <h1 className="text-xl font-semibold text-white text-center mb-3">{atual.titulo}</h1>
        <p className="text-sm text-slate-400 text-center leading-relaxed">{atual.descricao}</p>

        {atual.acao}

        <button
          onClick={avancar}
          disabled={passo === 1 && !nome}
          className={`w-full py-3 rounded-xl text-sm font-medium mt-8 transition-colors ${passo === 1 && !nome ? 'bg-[#161b22] text-slate-600 border border-[#30363d] cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500'}`}
        >
          {passo < passos.length - 1 ? 'Continuar' : 'Começar'}
        </button>

        {passo > 0 && (
          <button onClick={() => setPasso(passo - 1)} className="w-full py-2 mt-2 text-sm text-slate-600 hover:text-slate-400 transition-colors">
            Voltar
          </button>
        )}
      </div>
    </div>
  </Transicao>
)
}

export default Onboarding