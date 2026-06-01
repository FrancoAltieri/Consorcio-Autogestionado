import { Receipt, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Gasto, Socio } from '../useGastos';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
    gasto: Gasto;
    socios: Socio[];
}

export function MovementCard({ gasto, socios }: Props) {
    const socio = socios.find((s) => s.id === gasto.partnerId);
    const { theme } = useTheme();

    return (
        <div className="group/item flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-6">
                <div className={`p-4 rounded-xl shadow-sm ${gasto.approved ? 'bg-green-100 text-green-600' : 'bg-orange-100 text-orange-600'}`}>
                    <Receipt className="w-6 h-6" />
                </div>
                <div>
                    <p className="font-bold text-gray-950 text-lg">{gasto.description}</p>
                    <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs font-medium text-gray-500">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(gasto.date).toLocaleDateString('es-AR')}
                        </span>
                        <Badge variant="outline" className="text-[10px] font-black uppercase tracking-tighter">{gasto.category}</Badge>
                        <span className="text-xs font-bold text-blue-600/60 italic">Responsable: {socio?.name}</span>
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-6">
                <div className="text-right">
                    <p className={`text-2xl font-black bg-gradient-to-r ${theme.textGradient} bg-clip-text text-transparent`}>${gasto.amount.toLocaleString('es-AR')}</p>
                    <span className={`text-[10px] font-black uppercase ${gasto.approved ? 'text-green-600' : 'text-orange-600'}`}>{gasto.approved ? 'Aprobado' : 'Pendiente'}</span>
                </div>
                {!gasto.approved && (
                    <div className="flex gap-2">
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl border-green-100 text-green-600 hover:bg-green-600 hover:text-white transition-all shadow-sm">
                            ✓
                        </Button>
                        <Button size="icon" variant="outline" className="h-10 w-10 rounded-xl border-red-100 text-red-600 hover:bg-red-600 hover:text-white transition-all shadow-sm">
                            ✕
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MovementCard;
