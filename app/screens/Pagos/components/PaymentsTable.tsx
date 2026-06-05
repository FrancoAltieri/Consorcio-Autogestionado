import { Badge } from '@/components/ui/badge';
import type { Pago, Socio, Gasto } from '../usePagos';

interface Props {
    pagos: Pago[];
    socios: Socio[];
    gastos: Gasto[];
    formatPeriod?: (p: string) => string;
}

export function PaymentsTable({ pagos, socios, gastos, formatPeriod }: Props) {
    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl transition-all duration-500 hover:border-gray-200/50 mt-6">
            <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h3 className={`text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent`}>Historial de Pagos</h3>
                        <p className="text-base text-gray-500 mt-1">Últimos movimientos registrados</p>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-200">
                                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Fecha</th>
                                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Concepto</th>
                                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Socio</th>
                                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Mes</th>
                                <th className="px-6 py-4 text-left font-bold text-gray-700 uppercase tracking-widest text-xs">Método</th>
                                <th className="px-6 py-4 text-right font-bold text-gray-700 uppercase tracking-widest text-xs">Monto</th>
                                <th className="px-6 py-4 text-right font-bold text-gray-700 uppercase tracking-widest text-xs">Comprobante</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {pagos.map((pago) => {
                                const socio = socios.find(s => s.id === pago.partnerId);
                                return (
                                    <tr key={pago.id} className="hover:bg-gradient-to-r hover:from-gray-50 hover:to-white transition-colors">
                                        <td className="px-6 py-4"><span className="font-medium text-gray-900">{new Date(pago.paymentDate).toLocaleDateString('es-AR')}</span></td>
                                        <td className="px-6 py-4"><span className="font-medium text-gray-900">{gastos.find(g => g.id === pago.expenseId)?.description}</span></td>
                                        <td className="px-6 py-4"><div className="font-semibold text-gray-900">{socio?.name}</div><div className="text-xs text-gray-500 font-medium">{socio?.apartment}</div></td>
                                        <td className="px-6 py-4"><span className="font-medium text-gray-900">{formatPeriod ? formatPeriod(pago.period) : pago.period}</span></td>
                                        <td className="px-6 py-4">
                                            <Badge className="bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border-0 font-semibold">
                                                {pago.paymentMethod === 'CASH' && '💵 Efectivo'}
                                                {pago.paymentMethod === 'TRANSFER' && '🏦 Transferencia'}
                                                {pago.paymentMethod === 'CREDIT_CARD' && '💳 Crédito'}
                                                {pago.paymentMethod === 'DEBIT_CARD' && '💳 Débito'}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 text-right"><p className="text-lg font-extrabold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">${pago.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p></td>
                                        <td className="px-6 py-4 text-right">{pago.receiptUrl && (<a href={pago.receiptUrl} className="text-green-600 hover:underline" target="_blank" rel="noopener noreferrer">Recibo</a>)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PaymentsTable;
