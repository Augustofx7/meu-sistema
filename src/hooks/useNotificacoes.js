import { useEffect } from 'react'

export function useNotificacoes() {
  useEffect(() => {
    if (!('Notification' in window)) return
    if (Notification.permission !== 'granted') return

    function verificarPendentes() {
      const habitos = JSON.parse(localStorage.getItem('habitos') || '[]')
      const tarefas = JSON.parse(localStorage.getItem('tarefas') || '[]')

      const pendentes = [
        ...habitos.filter(h => !h.feito),
        ...tarefas.filter(t => !t.feita),
      ]

      if (pendentes.length === 0) return

      new Notification('Rotina pendente', {
        body: `Você ainda tem ${pendentes.length} item${pendentes.length > 1 ? 's' : ''} para concluir hoje!`,
        icon: '/vite.svg',
      })
    }

    const agora = new Date()
    const hojeAs21 = new Date()
    hojeAs21.setHours(21, 0, 0, 0)

    if (agora > hojeAs21) {
      hojeAs21.setDate(hojeAs21.getDate() + 1)
    }

    const tempoAte21 = hojeAs21.getTime() - agora.getTime()
    const timer = setTimeout(verificarPendentes, tempoAte21)

    return () => clearTimeout(timer)
  }, [])
}