import { DollarSign, CheckCircle, CircleAlert } from 'lucide-react';
import type { Socio, Pago, Gasto } from '../usePagos';

interface Props {
    socios: Socio[];
    pagos: Pago[];
    gastos: Gasto[];
    formatPeriod?: (p: string) => string;
}

export function SociosStatus({ socios, pagos, gastos }: Props) {
    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50 mb-6">
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className={`text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent`}>Estado de Pagos por Socio</h3>
                        <p className="text-base text-gray-500 mt-1">Visualiza el historial de pagos de cada socio</p>
                    </div>
                </div>

                {socios.length === 0 ? (
                    <div className="text-center py-12 text-gray-500"><p className="font-medium">No hay socios registrados</p></div>
                ) : (
                    <div className="space-y-4">
                        {socios.map((socio) => {
                            const socoPagos = pagos.filter(p => p.partnerId === socio.id);
                            const totalPagado = socoPagos.reduce((sum, p) => sum + p.amount, 0);
                            const tienePagos = socoPagos.length > 0;
                            return (
                                <div key={socio.id} className="group/item flex items-center justify-between p-6 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-100 hover:shadow-lg hover:border-gray-200/50 transition-all duration-300 hover:-translate-y-1">
                                    <div className="flex items-center gap-5">
                                        <div className={`p-3.5 rounded-xl ${tienePagos ? 'bg-green-100' : 'bg-orange-100'} shadow-md transition-transform duration-300 group-hover/item:scale-110`}>
                                            <DollarSign className={`w-6 h-6 ${tienePagos ? 'text-green-600' : 'text-orange-600'}`} />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-950 text-lg group-hover/item:text-gray-800 transition-colors">{socio.name}</p>
                                            <p className="text-sm text-gray-500 font-medium">{socio.apartment}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className={`text-3xl font-extrabold tracking-tight bg-gradient-to-r ${tienePagos ? 'from-green-600 to-emerald-600' : 'from-orange-600 to-yellow-600'} bg-clip-text text-transparent`}>${totalPagado.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                                        <div className={`inline-flex items-center gap-1.5 mt-1 text-xs font-bold ${tienePagos ? 'text-green-700' : 'text-orange-700'}`}>
                                            {tienePagos ? <CheckCircle className="w-3 h-3" /> : <CircleAlert className="w-3 h-3" />}
                                            {socoPagos.length} {socoPagos.length === 1 ? 'pago' : 'pagos'}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SociosStatus;
