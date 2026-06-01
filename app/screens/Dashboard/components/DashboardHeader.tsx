import { useTheme } from '@/contexts/ThemeContext';

export function DashboardHeader() {
  const { theme } = useTheme();
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
      <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`} />
      <div className={`absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-5 blur-3xl rounded-full animate-pulse delay-1000`} />

      <div className="relative z-10 flex items-center justify-between">
        <div>
          <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
            Dashboard
          </h2>
          <p className="text-gray-600 text-xl font-medium">Resumen del estado del consorcio en tiempo real</p>
        </div>
        <div className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder} shadow-inner`}>
          <span className={`text-sm font-bold ${theme.badgeText}`}>
            Marzo 2026 {/* Hardcodeado temporalmente, debería venir del back */}
          </span>
        </div>
      </div>
    </div>
  );
}
