import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert } from '@/components/ui/alert';
import { InfoIcon, Plus } from 'lucide-react';
import type { Gasto } from '../useGastos';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    formData: { date: string; description: string; category: string; amount: string };
    fieldErrors: { date?: string; description?: string; category?: string; amount?: string };
    submitError: string;
    onFieldChange: (field: keyof typeof formData, value: string) => void;
    onClose: () => void;
    onSave: () => void;
}

export function NewGastoDialog({ open, onOpenChange, formData, fieldErrors, submitError, onFieldChange, onClose, onSave }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                <Button className={`h-14 px-8 rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg font-bold text-white border-0`}>
                    <Plus className="w-6 h-6 mr-2" />
                    Registrar Gasto
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md rounded-3xl border-0 shadow-2xl p-0 overflow-hidden">
                <div className={`h-2 bg-gradient-to-r from-sky-400 to-indigo-600`}></div>
                <div className="p-8">
                    <DialogHeader className="mb-6">
                        <DialogTitle className="text-2xl font-bold">Nuevo Gasto</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {submitError && (
                            <Alert variant="destructive" className="rounded-xl">
                                <div className="flex items-center gap-2">
                                    <InfoIcon className="h-4 w-4" />
                                    <div className="font-bold">{submitError}</div>
                                </div>
                            </Alert>
                        )}

                        <div className="flex items-center gap-3 rounded-xl border border-blue-200/60 bg-blue-50 p-4">
                            <InfoIcon className="h-5 w-5 flex-shrink-0 text-blue-600" />
                            <div>
                                <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Socio responsable</p>
                                <p className="text-sm font-semibold text-blue-900">Tu nombre</p>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-500 uppercase">Fecha</Label>
                            <Input type="date" value={formData.date} onChange={(e) => onFieldChange('date', e.target.value)} className={`rounded-xl ${fieldErrors.date ? 'border-red-500' : 'border-gray-100'}`} />
                            {fieldErrors.date && <p className="text-red-500 text-xs font-bold">{fieldErrors.date}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label className="text-sm font-bold text-gray-500 uppercase">Concepto</Label>
                            <Textarea rows={3} placeholder="Descripción del gasto..." value={formData.description} onChange={(e) => onFieldChange('description', e.target.value)} className={`rounded-xl ${fieldErrors.description ? 'border-red-500' : 'border-gray-100'}`} />
                            {fieldErrors.description && <p className="text-red-500 text-xs font-bold">{fieldErrors.description}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-500 uppercase">Categoría</Label>
                                <Select value={formData.category} onValueChange={(v) => onFieldChange('category', v)}>
                                    <SelectTrigger className={`rounded-xl ${fieldErrors.category ? 'border-red-500' : 'border-gray-100'}`}>
                                        <SelectValue placeholder="Seleccionar" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="mantenimiento">Mantenimiento</SelectItem>
                                        <SelectItem value="jardineria">Jardinería</SelectItem>
                                        <SelectItem value="limpieza">Limpieza</SelectItem>
                                        <SelectItem value="mejoras">Mejoras</SelectItem>
                                        <SelectItem value="insumos">Insumos</SelectItem>
                                    </SelectContent>
                                </Select>
                                {fieldErrors.category && <p className="text-red-500 text-xs font-bold">{fieldErrors.category}</p>}
                            </div>
                            <div className="space-y-2">
                                <Label className="text-sm font-bold text-gray-500 uppercase">Monto ($)</Label>
                                <Input type="number" placeholder="0" value={formData.amount} onChange={(e) => onFieldChange('amount', e.target.value)} className={`rounded-xl ${fieldErrors.amount ? 'border-red-500' : 'border-gray-100'}`} />
                                {fieldErrors.amount && <p className="text-red-500 text-xs font-bold">{fieldErrors.amount}</p>}
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <Button variant="outline" onClick={onClose} className="flex-1 rounded-xl">Cancelar</Button>
                            <Button onClick={onSave} className={`flex-1 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white font-bold border-0`}>Guardar</Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default NewGastoDialog;
