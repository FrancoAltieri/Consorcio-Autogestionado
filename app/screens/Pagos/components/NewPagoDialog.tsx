import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Alert } from '@/components/ui/alert';
import { InfoIcon, Plus, Upload } from 'lucide-react';
import type { Gasto } from '../usePagos';

type FormShape = {
    expenseId: string;
    paymentDate: string;
    selectedMonth: string;
    selectedYear: string;
    paymentMethod: string;
    description: string;
};

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: FormShape;
    months: { val: string; name: string }[];
    currentYear: number;
    submitError: string;
    paymentFile: File | null;
    onFieldChange: (field: keyof FormShape, value: string) => void;
    onFileChange: (file: File | null) => void;
    onSave: () => void;
    gastosList: Gasto[];
}

export function NewPagoDialog({ open, onOpenChange, formData, months, currentYear, submitError, paymentFile, onFieldChange, onFileChange, onSave, gastosList }: Props) {
    const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        onFileChange(e.target.files?.[0] ?? null);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className={`h-14 px-8 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg font-bold text-white border-0`}>
                    <Plus className="w-5 h-5" />
                    Registrar Mi Pago
                </Button>
            </DialogTrigger>

            <DialogContent className="max-h-[90vh] w-[calc(100vw-2rem)] max-w-md overflow-y-auto rounded-2xl shadow-2xl">
                <DialogHeader className="pb-4 border-b border-gray-100">
                    <DialogTitle className={`text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent`}>Registrar Nuevo Pago</DialogTitle>
                </DialogHeader>

                <div className="space-y-5 mt-6 p-6">
                    {submitError && (
                        <div className="bg-gradient-to-br from-red-50 to-red-50/50 border border-red-200/50 rounded-xl p-4 flex items-start gap-3">
                            <div className="w-5 h-5 text-red-600">!</div>
                            <div>
                                <p className="font-bold text-red-900">Error</p>
                                <p className="text-sm text-red-700 mt-1">{submitError}</p>
                            </div>
                        </div>
                    )}

                    <div className={`bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl flex items-center gap-3 border border-blue-200/50`}>
                        <InfoIcon className="w-5 h-5 text-blue-600 flex-shrink-0" />
                        <div>
                            <p className="text-xs text-blue-600 font-bold uppercase tracking-wider">Socio Pagador</p>
                            <p className="text-sm font-semibold text-blue-900">Tu nombre</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-900">Gasto</Label>
                        <Select value={formData.expenseId} onValueChange={(val: string) => onFieldChange('expenseId', val)}>
                            <SelectTrigger className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                {gastosList.length === 0 ? (
                                    <SelectItem value="none" disabled>No hay gastos aprobados</SelectItem>
                                ) : (
                                    gastosList.map((gasto) => (
                                        <SelectItem key={gasto.id} value={String(gasto.id)}>{gasto.description} - ${gasto.amount.toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</SelectItem>
                                    ))
                                )}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-900">Fecha de Pago</Label>
                        <Input type="date" value={formData.paymentDate} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onFieldChange('paymentDate', e.target.value)} className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors" />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-900">Mes a Pagar</Label>
                        <div className="grid grid-cols-2 gap-2">
                            <Select value={formData.selectedMonth} onValueChange={(val: string) => onFieldChange('selectedMonth', val)}>
                                <SelectTrigger className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors">
                                    <SelectValue placeholder="Mes" />
                                </SelectTrigger>
                                <SelectContent>
                                    {months.map(m => (
                                        <SelectItem key={m.val} value={m.val}>{m.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={formData.selectedYear} onValueChange={(val: string) => onFieldChange('selectedYear', val)}>
                                <SelectTrigger className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors">
                                    <SelectValue placeholder="Año" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value={(currentYear - 1).toString()}>{currentYear - 1}</SelectItem>
                                    <SelectItem value={currentYear.toString()}>{currentYear}</SelectItem>
                                    <SelectItem value={(currentYear + 1).toString()}>{currentYear + 1}</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-900">Método de Pago</Label>
                        <Select value={formData.paymentMethod} onValueChange={(val: string) => onFieldChange('paymentMethod', val)}>
                            <SelectTrigger className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors">
                                <SelectValue placeholder="Seleccionar..." />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="CASH">💵 Efectivo</SelectItem>
                                <SelectItem value="TRANSFER">🏦 Transferencia</SelectItem>
                                <SelectItem value="CREDIT_CARD">💳 Tarjeta Crédito</SelectItem>
                                <SelectItem value="DEBIT_CARD">💳 Tarjeta Débito</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-900">Comprobante</Label>
                        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-dashed border-gray-300 bg-gray-50 px-4 py-4 transition-colors hover:border-blue-400 hover:bg-blue-50/60">
                            <Upload className="h-5 w-5 flex-shrink-0 text-blue-600" />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-semibold text-gray-900">{paymentFile ? paymentFile.name : 'Subir archivo'}</p>
                                <p className="text-xs font-medium text-gray-500">Adjunta el comprobante del pago</p>
                            </div>
                            <Input type="file" onChange={handleFileInput} className="hidden" />
                        </label>
                    </div>

                    <div className="flex gap-3 justify-end pt-6 border-t border-gray-100 mt-6">
                        <Button onClick={() => onOpenChange(false)} variant="outline" className="px-6 py-2.5 rounded-xl font-semibold border-gray-200 hover:bg-gray-50 transition-all duration-300">Cancelar</Button>
                        <Button onClick={onSave} className={`px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300`}>
                            Confirmar Pago
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default NewPagoDialog;
