import { Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function SociosLoading() {
    const { theme } = useTheme();

    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="relative">
                <div className={`absolute inset-0 bg-gradient-to-r ${theme.iconGradient} opacity-20 blur-2xl animate-pulse`}></div>
                <Loader2 className={`w-16 h-16 animate-spin text-transparent bg-gradient-to-r ${theme.iconGradient} bg-clip-text relative z-10`} />
            </div>
        </div>
    );
}

export default SociosLoading;
