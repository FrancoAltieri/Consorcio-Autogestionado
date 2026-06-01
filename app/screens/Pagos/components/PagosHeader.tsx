import { Wallet } from 'lucide-react';

export function PagosHeader() {
    return (
        <div className="relative flex items-center gap-4">
            <div>
                <h2 className={`text-5xl font-extrabold tracking-tighter mb-2`}>Pagos de Expensas</h2>
                <p className="text-gray-600 text-xl font-medium">Registra y gestiona los pagos del consorcio</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg text-white">
                <Wallet className="w-8 h-8" />
            </div>
        </div>
    );
}

export default PagosHeader;
