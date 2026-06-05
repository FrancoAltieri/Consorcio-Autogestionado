import { Wallet } from 'lucide-react';

export function GastosHeader() {
    return (
        <div className="flex items-center gap-4">
            <div>
                <h2 className={`text-4xl font-extrabold tracking-tighter mb-1`}>Gastos Comunes</h2>
                <p className="text-gray-600 text-sm font-medium">Control y aprobación de egresos del consorcio</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg text-white">
                <Wallet className="w-6 h-6" />
            </div>
        </div>
    );
}

export default GastosHeader;
