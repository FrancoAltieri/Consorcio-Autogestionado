import { Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function SociosHeader() {
    const { theme } = useTheme();

    return (
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
            <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-10 blur-3xl rounded-full animate-pulse`}></div>
            <div className={`absolute -bottom-20 -left-20 w-80 h-80 bg-gradient-to-br ${theme.iconGradient} opacity-5 blur-3xl rounded-full animate-pulse delay-1000`}></div>

            <div className="relative z-10 flex items-center justify-between">
                <div>
                    <h2 className={`text-5xl font-extrabold tracking-tighter bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent mb-2`}>
                        Socios del Consorcio
                    </h2>
                    <p className="text-gray-600 text-xl font-medium">Gestiona y visualiza la información de todos los miembros</p>
                </div>
                <div className={`p-3.5 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg shadow-${theme.iconGradient.split(' ')[1]}/30`}>
                    <Users className="w-8 h-8 text-white" />
                </div>
            </div>
        </div>
    );
}

export default SociosHeader;
