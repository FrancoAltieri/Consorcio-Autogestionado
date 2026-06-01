import { Button } from '@/components/ui/button';
import { Copy, Check, Users } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';

interface Props {
    consorcio: any;
    copied: boolean;
    onCopy: () => void;
}

export function InviteCodeCard({ consorcio, copied, onCopy }: Props) {
    const { theme } = useTheme();

    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white border-2 border-gray-200 shadow-xl p-8 transition-all duration-500">
            <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r ${theme.iconGradient}`}></div>

            <div className="flex items-center justify-between gap-6">
                <div className="flex-1">
                    <h3 className="text-2xl font-bold text-black mb-2">Código de Invitación</h3>
                    <p className="text-gray-700 font-medium">Comparte este código para que nuevos miembros se unan al consorcio</p>
                </div>
                <div className="flex items-center gap-4">
                    <code className="bg-gray-100 px-6 py-3 rounded-2xl border border-gray-300 font-mono text-2xl font-black text-black shadow-sm">
                        {consorcio.codigoInvitacion}
                    </code>
                    <Button
                        onClick={onCopy}
                        className={`px-5 py-3 rounded-2xl bg-gradient-to-r ${theme.iconGradient} text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 flex items-center gap-2`}
                    >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                        {copied ? 'Copiado' : 'Copiar'}
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default InviteCodeCard;
