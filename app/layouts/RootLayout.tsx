import { useEffect, useState } from 'react';
import { Outlet, NavLink, useParams, useNavigate } from 'react-router';
import { Home, Users, Receipt, Wallet, BarChart3, FileText, Building2, LogOut } from 'lucide-react';
import { consorcioService, ConsorcioData } from '@/services/consorcioService';
import { authService } from '@/services/authService';
import { useTheme } from '@/contexts/ThemeContext';
import ThemeSelector from '@/components/ui/ThemeSelector';

export function RootLayout() {
  const { consorcioId } = useParams();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const [consorcio, setConsorcio] = useState<ConsorcioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Helpers centralizados para consistencia visual
  const activeTextColor = theme?.primaryText || 'text-blue-600';
  const activeBorderColor = theme?.primaryText ? theme.primaryText.replace('text', 'border') : 'border-blue-600';
  const iconGradient = theme?.iconGradient || 'from-blue-600 to-blue-400';

  useEffect(() => {
    let isMounted = true;

    if (!consorcioId) {
      setError("ID de consorcio no especificado");
      setLoading(false);
      return;
    }

    const cargarConsorcio = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await consorcioService.getConsorcioById(consorcioId);
        if (isMounted) setConsorcio(data);
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Error al cargar el consorcio");
          setTimeout(() => navigate('/mis-consorcios'), 2000);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    cargarConsorcio();
    return () => { isMounted = false; };
  }, [consorcioId, navigate]);

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { path: `/app/${consorcioId}`, label: 'Dashboard', icon: Home },
    { path: `/app/${consorcioId}/socios`, label: 'Socios', icon: Users },
    { path: `/app/${consorcioId}/gastos`, label: 'Gastos', icon: Receipt },
    { path: `/app/${consorcioId}/pagos`, label: 'Pagos', icon: Wallet },
    { path: `/app/${consorcioId}/balance`, label: 'Balance', icon: BarChart3 },
    { path: `/app/${consorcioId}/reportes`, label: 'Reportes', icon: FileText },
  ];

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white border border-red-100 shadow-sm rounded-2xl p-8 max-w-md text-center">
          <div className="bg-red-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="text-red-500 w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Ups, algo salió mal</h2>
          <p className="text-gray-500">{error}</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className={`inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-r-2 ${activeBorderColor}`}></div>
          <p className="text-gray-400 font-medium mt-4">Sincronizando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 transition-all duration-500 ease-in-out">
      {/* Top Navbar */}
      <header className="bg-white/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <div className={`bg-gradient-to-br ${iconGradient} p-2 rounded-xl shadow-sm transition-all duration-500`}>
                <Building2 className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-gray-900 leading-none">
                  {consorcio?.nombre || "Cargando..."}
                </span>
                <span className="text-[11px] text-gray-400 font-medium mt-1">
                  ID: {consorcio?.codigoInvitacion}
                </span>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </header>

      {/* Sub-Navigation */}
      <nav className="bg-white border-b sticky top-16 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === `/app/${consorcioId}`}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-4 text-sm font-semibold border-b-2 transition-all duration-300 whitespace-nowrap ${isActive
                    ? `${activeTextColor} ${activeBorderColor}`
                    : 'border-transparent text-gray-400 hover:text-gray-600 hover:border-gray-200'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                {label}
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* Viewport */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Outlet context={{ consorcioId, consorcio }} />
        </div>
      </main>

      {/* Global Components */}
      <ThemeSelector />
    </div>
  );
}