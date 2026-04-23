function Modal({ titulo, mensagem, onConfirmar, onCancelar }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 px-6">
      <div className="bg-[#161b22] border border-[#30363d] rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-base font-semibold text-white mb-2">{titulo}</h2>
        <p className="text-sm text-slate-400 mb-6">{mensagem}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancelar}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-[#0d1117] text-slate-400 border border-[#30363d] hover:border-slate-500 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-rose-600 text-white hover:bg-rose-500 transition-colors"
          >
            Confirmar
          </button>
        </div>
      </div>
    </div>
  )
}

export default Modal