import React, { useState } from 'react';
import { X, Loader, AlertCircle, CheckCircle } from 'lucide-react';

interface ModalUnirseConsorcioProps {
  isOpen: boolean;
  onClose: () => void;
  onUnirse: (codigo: string) => Promise<void>;
}

const ModalUnirseConsorcio: React.FC<ModalUnirseConsorcioProps> = ({ isOpen, onClose, onUnirse }) => {
  const [displayCodigo, setDisplayCodigo] = useState(''); // Lo que ve el usuario (con guion)
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUnirse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Sanitización: Quitamos el guion antes de enviarlo al Backend
    const codigoLimpio = displayCodigo.replace('-', '');

    try {
      await onUnirse(codigoLimpio);
      setSuccess(true);
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al unirse al consorcio');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setDisplayCodigo('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase();

    // 1. Limpiar: Solo permitir letras y números
    const cleanValue = value.replace(/[^A-Z0-9]/g, '');

    // 2. Aplicar Chunking (formato XXX-111)
    let formatted = cleanValue;
    if (cleanValue.length > 3) {
      formatted = cleanValue.slice(0, 3) + '-' + cleanValue.slice(3, 6);
    }

    setDisplayCodigo(formatted);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Unirse a Consorcio</h2>
          <button onClick={handleClose} className="p-1 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
            <X className="w-6 h-6 text-gray-400" />
          </button>
        </div>

        {success ? (
          <div className="py-8 text-center space-y-4">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">¡Bienvenido!</h3>
            <p className="text-gray-500">Te has unido correctamente al consorcio.</p>
          </div>
        ) : (
          <form onSubmit={handleUnirse} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm font-medium">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3 text-center">
                Código de Invitación
              </label>
              <input
                type="text"
                value={displayCodigo}
                onChange={handleChange}
                disabled={loading}
                className="w-full px-4 py-4 border-2 border-gray-100 rounded-2xl focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 outline-none disabled:opacity-50 transition-all text-center font-mono font-bold text-3xl tracking-[0.2em] text-purple-600 placeholder:text-gray-200"
                placeholder="ABC-123"
                maxLength={7} // Importante: 6 caracteres + 1 guion
                required
                autoComplete="off"
                spellCheck="false"
              />
              <p className="text-center text-sm text-gray-400 mt-4">
                El código debe tener <span className="font-bold text-gray-600">6 caracteres</span>
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 py-3 text-gray-500 font-bold rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || displayCodigo.replace('-', '').length < 6}
                className="flex-[2] py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg shadow-purple-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {loading ? <Loader className="w-5 h-5 animate-spin" /> : 'Confirmar Ingreso'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalUnirseConsorcio;