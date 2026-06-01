import { DollarSign, TrendingUp, CheckCircle } from 'lucide-react';

interface Props {
    totalPagos: number;
    movimientos: number;
    sociosAlDia: number;
}

export function PagosStats({ totalPagos, movimientos, sociosAlDia }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-green-100">
                <div className="relative p-8">
                    <div className="flex items-center justify-between mb-5">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg text-white"><DollarSign className="w-6 h-6" /></div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Total Recaudado</h3>
                    <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent`}>${totalPagos.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative p-8">
                    <div className="flex items-center justify-between mb-5">
                        <div className={`p-3.5 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-600 shadow-lg text-white`}><TrendingUp className="w-6 h-6" /></div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Transacciones</h3>
                    <p className={`text-4xl font-extrabold tracking-tight bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent`}>{movimientos}</p>
                </div>
            </div>

            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2">
                <div className="relative p-8">
                    <div className="flex items-center justify-between mb-5">
                        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg text-white"><CheckCircle className="w-6 h-6" /></div>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-widest">Socios al Día</h3>
                    <p className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">{sociosAlDia}</p>
                </div>
            </div>
        </div>
    );
}

export default PagosStats;
