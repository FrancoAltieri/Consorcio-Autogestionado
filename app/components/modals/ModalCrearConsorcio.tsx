import React, { useState } from 'react';
import { X, Loader, AlertCircle, CheckCircle, Copy } from 'lucide-react';

interface ModalCrearConsorcioProps {
  isOpen: boolean;
  onClose: () => void;
  onCrear: (nombre: string, maxPartners: number) => Promise<{ codigoInvitacion: string }>;
}

const ModalCrearConsorcio: React.FC<ModalCrearConsorcioProps> = ({ isOpen, onClose, onCrear }) => {
  const [nombre, setNombre] = useState('');
  // Cambiamos el '10' por un string vacío para que el usuario elija
  const [maxPartners, setMaxPartners] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [codigoGenerado, setCodigoGenerado] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim()) {
      setError('El nombre del consorcio es obligatorio');
      return;
    }

    const maxPartnersNum = parseInt(maxPartners);
    if (isNaN(maxPartnersNum) || maxPartnersNum <= 0) {
      setError('Debes ingresar una cantidad válida de partners');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await onCrear(nombre, maxPartnersNum);
      setCodigoGenerado(result.codigoInvitacion);
      setNombre('');
      setMaxPartners('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear consorcio');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCodigo = () => {
    if (codigoGenerado) {
      navigator.clipboard.writeText(codigoGenerado);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleClose = () => {
    setNombre('');
    setMaxPartners(''); // Limpiamos al cerrar
    setError(null);
    setCodigoGenerado(null);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Crear Consorcio</h2>
          <button
            onClick={handleClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        {codigoGenerado ? (
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <p className="text-green-800 font-medium">¡Consorcio creado exitosamente!</p>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Comparte este código con los miembros de tu consorcio:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={codigoGenerado}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-green-300 rounded-lg font-mono font-bold text-center"
                />
                <button
                  onClick={handleCopyCodigo}
                  className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
              {copied && (
                <p className="text-sm text-green-700 mt-2">✓ Código copiado</p>
              )}
            </div>
            <button
              onClick={handleClose}
              className="w-full py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors"
            >
              Listo
            </button>
          </div>
        ) : (
          <form onSubmit={handleCrear} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Consorcio
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all"
                placeholder="Ej: Edificio Las Flores"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cantidad Máxima de Partners
              </label>
              <input
                type="number"
                value={maxPartners}
                onChange={(e) => setMaxPartners(e.target.value)}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 transition-all"
                placeholder="Cantidad de socios (ej: 25)"
                min="1"
                required
              />
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
                disabled={loading || !nombre.trim() || !maxPartners.trim()}
                className="flex-1 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading && <Loader className="w-4 h-4 animate-spin" />}
                {loading ? 'Creando...' : 'Crear'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ModalCrearConsorcio;