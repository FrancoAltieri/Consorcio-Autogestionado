import { AlertCircle } from 'lucide-react';

interface Props {
  error: string;
}

export function DashboardError({ error }: Props) {
  return (
    <div className="p-6 animate-in fade-in slide-in-from-top-4 duration-700">
      <div className="bg-gradient-to-br from-red-50 via-white to-red-50/30 border border-red-200/50 rounded-2xl p-6 flex items-start gap-4 shadow-xl shadow-red-100/50 backdrop-blur-sm">
        <div className="p-3 rounded-xl bg-gradient-to-br from-red-500 to-red-600 shadow-lg">
          <AlertCircle className="w-6 h-6 text-white" />
        </div>
        <div>
          <p className="text-base font-bold text-red-900">{error}</p>
          <p className="text-sm text-red-700 mt-1">No se pudieron cargar los datos del dashboard</p>
        </div>
      </div>
    </div>
  );
}
