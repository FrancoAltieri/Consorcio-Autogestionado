import { Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function SociosEmpty() {
    const { theme } = useTheme();

    return (
        <div className="animate-in fade-in slide-in-from-top-4 duration-700">
            <div className={`bg-gradient-to-br from-blue-50 via-white to-blue-50/30 border border-blue-200/50 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-xl shadow-blue-100/50 backdrop-blur-sm`}>
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${theme.iconGradient} shadow-lg mb-4`}>
                    <Users className="w-8 h-8 text-white" />
                </div>
                <p className="text-lg font-bold text-blue-900">Aún no hay socios en el consorcio</p>
                <p className="text-blue-700 mt-2">Comparte el código de invitación para agregar miembros al consorcio</p>
            </div>
        </div>
    );
}

export default SociosEmpty;
