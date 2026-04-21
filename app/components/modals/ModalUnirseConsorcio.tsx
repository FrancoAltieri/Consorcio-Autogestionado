import React, { useState } from 'react';
import { X, Loader, AlertCircle, CheckCircle } from 'lucide-react';

interface ModalUnirseConsorcioProps {
  isOpen: boolean;
  onClose: () => void;
  onUnirse: (codigo: string) => Promise<void>;
}

const ModalUnirseConsorcio: React.FC<ModalUnirseConsorcioProps> = ({ isOpen, onClose, onUnirse }) => {
  const [codigo, setCodigo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUnirse = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onUnirse(codigo);
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
    setCodigo('');
    setError(null);
    setSuccess(false);
    onClose();
  };

  const formatCodigoInput = (value: string) => {
    // Aceptar solo alfanuméricos, sin guiones
    const cleaned = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    // Limitar a 6 caracteres
    return cleaned.slice(0, 6);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Unirse a Consorcio</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {success ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">¡Te uniste correctamente al consorcio!</p>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUnirse} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Código de Invitación
              </label>
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(formatCodigoInput(e.target.value))}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all text-center font-mono font-bold text-lg tracking-widest"
                placeholder="ABC123"
                maxLength={6}
                required
              />
              <p className="text-xs text-gray-500 mt-1">Ingresa el código sin guiones (6 caracteres)</p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="flex-1 py-2 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading || codigo.length < 6}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Uniéndome...' : 'Unirse'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalUnirseConsorcio;
