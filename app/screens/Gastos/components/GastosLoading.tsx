import { Loader2 } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

export function GastosLoading() {
    const { theme } = useTheme();
    return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className={`w-16 h-16 animate-spin text-transparent bg-gradient-to-r ${theme.iconGradient} bg-clip-text`} />
        </div>
    );
}

export default GastosLoading;
