import React, { useState, useEffect } from 'react';
import { Building2, Plus, UserPlus, Home, Users, Settings, LogOut, ChevronRight, Loader, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router';
import { authService } from '@/services/authService';
import { consorcioService, ConsorcioData } from '@/services/consorcioService';
import ModalCrearConsorcio from '@/components/modals/ModalCrearConsorcio';
import ModalUnirseConsorcio from '@/components/modals/ModalUnirseConsorcio';

const MisConsorcios: React.FC = () => {
  const navigate = useNavigate();
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

  const handleCrearConsorcio = async (nombre: string) => {
    const result = await consorcioService.crearConsorcio({ nombre });
    setConsorcios([...consorcios, result]);
    setShowCreateModal(false);
    return result;
  };

  const handleUnirseConsorcio = async (codigo: string) => {
    const result = await consorcioService.unirseConsorcio({ codigoInvitacion: codigo });
    setConsorcios([...consorcios, result]);
    setShowJoinModal(false);
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-pink-500/30 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-xl shadow-lg">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                GestorPH
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <p className="text-white font-medium">{userInfo?.nombre}</p>
                <p className="text-purple-300 text-sm">{userInfo?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
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
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Mis Consorcios</h1>
          <p className="text-purple-200 text-lg">Gestiona todos tus consorcios desde un solo lugar</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <button
            onClick={() => setShowCreateModal(true)}
            className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-8 hover:from-purple-600 hover:to-pink-600 transition-all duration-300 hover:scale-[1.02] shadow-xl hover:shadow-purple-500/50"
          >
            <div className="relative flex items-center gap-4">
              <div className="bg-white/20 p-4 rounded-xl backdrop-blur-sm">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">Crear Consorcio</h3>
                <p className="text-purple-100">Configura un nuevo consorcio desde cero</p>
              </div>
              <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          <button
            onClick={() => setShowJoinModal(true)}
            className="group relative overflow-hidden bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] shadow-xl"
          >
            <div className="relative flex items-center gap-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-4 rounded-xl">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
              <div className="text-left flex-1">
                <h3 className="text-2xl font-bold text-white mb-1">Unirse a Consorcio</h3>
                <p className="text-purple-200">Ingresa con un código de invitación</p>
              </div>
              <ChevronRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Home className="w-6 h-6 text-purple-400" />
            Tus Consorcios
          </h2>

          {loading ? (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
              <Loader className="w-12 h-12 text-purple-400 mx-auto mb-4 animate-spin" />
              <p className="text-purple-200">Cargando tus consorcios...</p>
            </div>
          ) : error ? (
            <div className="bg-red-500/10 backdrop-blur-lg border border-red-500/50 rounded-2xl p-6 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          ) : consorcios.length === 0 ? (
            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-2xl p-12 text-center">
              <Building2 className="w-16 h-16 text-purple-400 mx-auto mb-4 opacity-50" />
              <h3 className="text-xl font-semibold text-white mb-2">No tienes consorcios todavía</h3>
              <p className="text-purple-200 mb-6">Crea tu primer consorcio o únete a uno existente para comenzar</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {consorcios.map((consorcio) => (
                <div
                  key={consorcio.id}
                  className="group relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 hover:bg-white/15 transition-all duration-300 hover:scale-[1.02] shadow-lg"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{consorcio.nombre}</h3>
                        <span className={`px-2 py-1 border rounded-lg text-xs font-medium ${consorcio.rol === 'ADMIN'
                          ? 'bg-purple-500/30 border-purple-400/50 text-purple-200'
                          : 'bg-blue-500/30 border-blue-400/50 text-blue-200'
                          }`}>
                          {consorcio.rol === 'ADMIN' ? 'Admin' : 'Miembro'}
                        </span>
                      </div>
                      <p className="text-purple-200 text-sm">Creador: {consorcio.creadoPor}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-purple-300 group-hover:translate-x-1 group-hover:text-white transition-all" />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-purple-400" />
                      <span className="text-purple-200 text-sm">
                        {consorcio.cantidadMiembros} miembro{consorcio.cantidadMiembros !== 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-purple-300 text-sm font-bold">{consorcio.codigoInvitacion}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/10">
                    <p className="text-purple-300 text-xs">
                      Creado el {new Date(consorcio.fechaCreacion).toLocaleDateString('es-AR')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modales */}
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
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default MisConsorcios;