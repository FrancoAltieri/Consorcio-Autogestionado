import { Outlet, NavLink } from 'react-router';
import { Home, Users, Receipt, Wallet, BarChart3, FileText, Building2 } from 'lucide-react';

export function RootLayout() {
  const navItems = [
    { path: '/app', label: 'Dashboard', icon: Home },
    { path: '/app/socios', label: 'Socios', icon: Users },
    { path: '/app/gastos', label: 'Gastos', icon: Receipt },
    { path: '/app/pagos', label: 'Pagos', icon: Wallet },
    { path: '/app/balance', label: 'Balance', icon: BarChart3 },
    { path: '/app/reportes', label: 'Reportes', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Consorcio Autogestionado</h1>
              <p className="text-sm text-gray-500">Edificio Los Cedros - 6 Departamentos</p>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto">
            {navItems.map(({ path, label, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                end={path === '/app'}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    isActive
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
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

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}
