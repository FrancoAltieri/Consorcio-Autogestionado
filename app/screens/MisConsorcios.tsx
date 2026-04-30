import React, { useState, useEffect } from 'react';
import { Building2, Plus, UserPlus, Home, Users, LogOut, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { authService } from '@/services/authService';
import { consorcioService, ConsorcioData } from '@/services/consorcioService';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeSelector from '@/components/ui/ThemeSelector';
import ModalCrearConsorcio from '@/components/modals/ModalCrearConsorcio';
import ModalUnirseConsorcio from '@/components/modals/ModalUnirseConsorcio';

const MisConsorcios: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const [consorcios, setConsorcios] = useState<ConsorcioData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);

  const userInfo = authService.getUserInfo();

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate('/login');
      return;
    }
    cargarConsorcios();
  }, [navigate]);

  const cargarConsorcios = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await consorcioService.getMisConsorcios();
      setConsorcios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar consorcios');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearConsorcio = async (nombre: string, maxPartners: number) => {
    try {
      const result = await consorcioService.crearConsorcio({ nombre, maxPartners });
      setConsorcios(prev => [...prev, result]);
      return result;
    } catch (err) {
      throw err;
    }
  };

  const handleUnirseConsorcio = async (codigo: string) => {
    try {
      const result = await consorcioService.unirseConsorcio({ codigoInvitacion: codigo });
      setConsorcios(prev => {
        const existe = prev.find(c => c.id === result.id);
        if (existe) return prev.map(c => c.id === result.id ? result : c);
        return [...prev, result];
      });
      setShowJoinModal(false);
    } catch (err) {
      throw err;
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${theme?.gradientFrom || 'from-slate-900'} ${theme?.gradientVia || 'via-purple-900'} ${theme?.gradientTo || 'to-slate-900'} relative overflow-hidden transition-colors duration-700`}>
      {/* Blobs decorativos */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      </div>

      <header className="sticky top-0 z-50 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className={`bg-gradient-to-br ${theme?.iconGradient || 'from-purple-500 to-pink-500'} p-2 rounded-xl shadow-lg`}>
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-white tracking-tight">
                GestorPH
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white font-medium leading-none">{userInfo?.nombre}</p>
                <p className="text-white/60 text-xs mt-1">{userInfo?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-all cursor-pointer"
                title="Cerrar sesión"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">Mis Consorcios</h1>
          <p className="text-white/70 text-lg">Gestiona tus propiedades de forma eficiente</p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => setShowCreateModal(true)}
            className={`group relative overflow-hidden bg-gradient-to-r ${theme?.buttonGradient || 'from-purple-500 to-pink-500'} rounded-2xl p-8 hover:scale-[1.02] transition-all duration-300 shadow-xl cursor-pointer ${theme?.buttonShadow || ''}`}
          >
            <div className="relative flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">Crear Consorcio</h3>
                <p className="text-white/80">Configura un nuevo edificio</p>
              </div>
              <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="group relative overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-[1.02] shadow-xl cursor-pointer"
          >
            <div className="relative flex items-center gap-4">
              <div className={`bg-gradient-to-r ${theme?.iconGradient || 'from-blue-500 to-purple-500'} p-4 rounded-xl`}>
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">Unirse a Consorcio</h3>
                <p className="text-white/60">Ingresa con un código</p>
              </div>
              <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Home className="w-6 h-6 opacity-70" />
            Tus Edificios
          </h2>

          {loading ? (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
              <Loader className="w-12 h-12 text-white/50 mx-auto mb-4 animate-spin" />
              <p className="text-white/50">Cargando consorcios...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/50 rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          ) : consorcios.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
              <Building2 className="w-16 h-16 text-white/20 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No hay consorcios</h3>
              <p className="text-white/50">Creá uno para empezar a trabajar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {consorcios.map((consorcio) => (
                <button
                  key={consorcio.id}
                  onClick={() => navigate(`/app/${consorcio.id}`)}
                  className="group relative text-left bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 hover:scale-[1.01] shadow-lg cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors">{consorcio.nombre}</h3>
                        <span className={`px-2 py-0.5 border rounded-full text-[10px] font-bold uppercase tracking-wider ${consorcio.rol === 'ADMIN'
                          ? 'bg-white/20 border-white/30 text-white'
                          : 'bg-blue-500/20 border-blue-400/30 text-blue-200'
                          }`}>
                          {consorcio.rol}
                        </span>
                      </div>
                      <p className="text-white/50 text-xs">Administrado por {consorcio.creadoPor}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-white/30 group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </div>

                  <div className="flex items-center gap-6 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className={`w-4 h-4 ${consorcio.cantidadMiembros >= consorcio.maxPartners ? 'text-orange-400' : 'text-white/40'}`} />
                      <span className={`text-sm ${consorcio.cantidadMiembros >= consorcio.maxPartners ? 'text-orange-300 font-bold' : 'text-white/60'}`}>
                        {consorcio.cantidadMiembros} / {consorcio.maxPartners}
                      </span>
                    </div>
                    <div className="bg-white/5 px-2 py-1 rounded border border-white/5">
                      <span className="font-mono text-white/80 text-xs font-bold">{consorcio.codigoInvitacion}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-white/30 text-[10px] uppercase font-bold tracking-widest">
                      Desde {new Date(consorcio.fechaCreacion).toLocaleDateString()}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <ModalCrearConsorcio
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCrear={handleCrearConsorcio}
      />

      <ModalUnirseConsorcio
        isOpen={showJoinModal}
        onClose={() => setShowJoinModal(false)}
        onUnirse={handleUnirseConsorcio}
      />

      <ThemeSelector />

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
};

export default MisConsorcios;