import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CircleAlert } from 'lucide-react';
import type { Socio } from '../useSocios';

interface Props {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    editingSocio: Socio | null;
    formData: { apartment: string; role: string };
    fieldErrors: { apartment?: string; role?: string };
    submitError: string;
    onFieldChange: (field: keyof typeof formData, value: string) => void;
    onClose: () => void;
    onSave: () => void;
}

export function EditSocioDialog({ open, onOpenChange, editingSocio, formData, fieldErrors, submitError, onFieldChange, onClose, onSave }: Props) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-2xl shadow-2xl">
                <DialogHeader className="pb-4 border-b border-gray-100">
                    <DialogTitle className={`text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent`}>
                        Editar Información del Socio
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-5 mt-6">
                    {submitError && (
                        <div className="bg-gradient-to-br from-red-50 to-red-50/50 border border-red-200/50 rounded-xl p-4 flex items-start gap-3">
                            <CircleAlert className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-bold text-red-900">Error</p>
                                <p className="text-sm text-red-700 mt-1">{submitError}</p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-900">Departamento</Label>
                        <Input value={formData.apartment} onChange={(e) => onFieldChange('apartment', e.target.value)} placeholder="Ej: Departamento 4B" className={`rounded-xl text-base py-2.5 ${fieldErrors.apartment ? 'border-red-500 focus:border-red-500' : 'border-gray-200 focus:border-blue-500'} transition-colors`} />
                        {fieldErrors.apartment && <p className="text-xs text-red-500 font-medium">{fieldErrors.apartment}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label className="text-base font-bold text-gray-900">Rol</Label>
                        <Select value={formData.role} onValueChange={(value) => onFieldChange('role', value)}>
                            <SelectTrigger className="rounded-xl text-base py-2.5 border-gray-200 focus:border-blue-500 transition-colors">
                                <SelectValue placeholder="Seleccionar rol" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="MEMBER">👥 Miembro</SelectItem>
                                <SelectItem value="ADMIN">🛡️ Administrador</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 justify-end pt-6 border-t border-gray-100 mt-6">
                        <Button onClick={onClose} variant="outline" className="px-6 py-2.5 rounded-xl font-semibold border-gray-200 hover:bg-gray-50 transition-all duration-300">Cancelar</Button>
                        <Button onClick={onSave} className={`px-6 py-2.5 rounded-xl font-semibold bg-gradient-to-r from-sky-600 to-indigo-600 text-white shadow-lg hover:shadow-xl transition-all duration-300`}>Guardar Cambios</Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default EditSocioDialog;
