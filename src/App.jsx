import { useState } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Financas from './pages/Financas'
import Cronograma from './pages/Cronograma'
import Rotina from './pages/Rotina'
import Configuracoes from './pages/Configuracoes'
import Onboarding from './pages/Onboarding'
import { useNotificacoes } from './hooks/useNotificacoes'

function AppComNotificacoes() {
  useNotificacoes()
  return null
}

function NavBar() {
  const location = useLocation()
  const links = [
    { to: '/', label: 'Início', icon: '⊞' },
    { to: '/financas', label: 'Finanças', icon: '₢' },
    { to: '/cronograma', label: 'Aulas', icon: '▦' },
    { to: '/rotina', label: 'Rotina', icon: '✓' },
    { to: '/configuracoes', label: 'Config', icon: '⚙' },
  ]
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[#161b22] border-t border-[#30363d] flex z-50">
      {links.map(link => {
        const ativo = location.pathname === link.to
        return (
          <Link key={link.to} to={link.to}
            className={`flex-1 flex flex-col items-center py-3 gap-1 text-xs font-medium transition-colors ${ativo ? 'text-blue-400' : 'text-slate-600'}`}>
            <span className="text-lg leading-none">{link.icon}</span>
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}

function PaginasComAnimacao() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/financas" element={<Financas />} />
        <Route path="/cronograma" element={<Cronograma />} />
        <Route path="/rotina" element={<Rotina />} />
        <Route path="/configuracoes" element={<Configuracoes />} />
      </Routes>
    </AnimatePresence>
  )
}

function App() {
  const [onboardingFeito, setOnboardingFeito] = useState(
    () => localStorage.getItem('onboarding_concluido') === 'true'
  )

  if (!onboardingFeito) {
    return <Onboarding onConcluir={() => setOnboardingFeito(true)} />
  }

  return (
    <BrowserRouter>
      <AppComNotificacoes />
      <div className="dark min-h-screen bg-[#0d1117] pb-20">
        <main className="p-4 pt-6">
          <PaginasComAnimacao />
        </main>
        <NavBar />
      </div>
    </BrowserRouter>
  )
}

export default App