import { Percent, Shield, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import type { Socio } from '../useSocios';

interface Props {
    sociosList: Socio[];
}

export function StatsCards({ sociosList }: Props) {
    const { theme } = useTheme();

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gray-200/50">
                <div className={`absolute inset-0 bg-gradient-to-br ${theme.iconGradient} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
                <div className="relative p-8">
                    <div className="flex items-center justify-between mb-5">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30 group-hover:scale-110 transition-transform duration-500`}>
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${theme.badgeBg} border ${theme.badgeBorder}`}>
                            <span className={`text-xs font-bold `}>Total</span>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total de Socios</h3>
                    <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>{sociosList.length}</p>
                </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-purple-100">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                    <div className="flex items-center justify-between mb-5">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform duration-500">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
                            <span className="text-xs font-bold text-purple-700">Admins</span>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Administradores</h3>
                    <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">{sociosList.filter((s) => s.role === 'ADMIN').length}</p>
                </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-emerald-100">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-green-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative p-8">
                    <div className="flex items-center justify-between mb-5">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform duration-500">
                            <Percent className="w-6 h-6 text-white" />
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200">
                            <span className="text-xs font-bold text-emerald-700">Promedio</span>
                        </div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Participación Promedio</h3>
                    <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{sociosList.length > 0 ? (sociosList.reduce((sum, s) => sum + s.participation, 0) / sociosList.length).toFixed(1) : 0}%</p>
                </div>
            </div>
        </div>
    );
}

export default StatsCards;
