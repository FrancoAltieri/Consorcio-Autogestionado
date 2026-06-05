import { CheckCircle, Wallet } from 'lucide-react';
import type { Gasto } from '../useGastos';

interface Props {
    totalGastosMonto: number;
    gastos: Gasto[];
}

export function GastosStats({ totalGastosMonto, gastos }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative p-8">
                    <div className="flex items-center justify-between mb-5">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg text-white`}><Wallet className="w-6 h-6" /></div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total Gastos</h3>
                    <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent`}>${totalGastosMonto.toLocaleString('es-AR')}</p>
                </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative p-8">
                    <div className="flex items-center justify-between mb-5">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg text-white"><CheckCircle className="w-6 h-6" /></div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Aprobados</h3>
                    <p className="text-4xl font-extrabold tracking-tight text-emerald-600">{gastos.filter((g) => g.approved).length}</p>
                </div>
            </div>
        </div>
    );
}

export default GastosStats;
