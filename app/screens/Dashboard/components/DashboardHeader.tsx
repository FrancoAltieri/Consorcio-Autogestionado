import { useTheme } from '@/contexts/ThemeContext';
import { formatPeriodToMonthYear } from '@/utils/period';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Props = {
  selectedPeriod?: string;
  onPrev?: () => void;
  onNext?: () => void;
};

export function DashboardHeader({ selectedPeriod, onPrev, onNext }: Props) {
  const { theme } = useTheme();

  const label = formatPeriodToMonthYear(selectedPeriod);

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
        <div className="flex items-center gap-3">
          <button onClick={onPrev} className="p-2 rounded-md hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5 text-gray-700" />
          </button>
          <div className={`px-5 py-2.5 rounded-2xl bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder} shadow-inner`}>
            <span className={`text-sm font-bold`}>
              {label.charAt(0).toUpperCase() + label.slice(1)}
            </span>
          </div>
          <button onClick={onNext} className="p-2 rounded-md hover:bg-gray-100">
            <ChevronRight className="w-5 h-5 text-gray-700" />
          </button>
        </div>
      </div>
    </div>
  );
}
