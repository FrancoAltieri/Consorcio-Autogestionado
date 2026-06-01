import { Button } from '@/components/ui/button';
import { Percent, Shield, Handshake } from 'lucide-react';
import type { Socio } from '../useSocios';

interface Props {
    socio: Socio;
    currentUserRole: string | null;
    onEdit: (s: Socio) => void;
    onDelete: (id: number) => void;
}

export function SocioCard({ socio, currentUserRole, onEdit, onDelete }: Props) {
    return (
        <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-gray-200/50">
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${socio.role === 'ADMIN' ? 'from-purple-500 to-indigo-500' : 'from-emerald-500 to-green-500'}`}></div>

            <div className="relative p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-950 mb-1 group-hover:text-gray-800 transition-colors">{socio.name}</h3>
                        <p className="text-sm font-semibold text-gray-600 bg-gray-100 inline-block px-3 py-1 rounded-full border border-gray-200">{socio.apartment}</p>
                    </div>
                    <div className={`p-3 rounded-2xl ${socio.role === 'ADMIN' ? 'bg-purple-100' : 'bg-emerald-100'} shadow-md transition-transform duration-300 group-hover:scale-110`}>
                        {socio.role === 'ADMIN' ? (
                            <Shield className={`w-5 h-5 ${socio.role === 'ADMIN' ? 'text-purple-600' : 'text-emerald-600'}`} />
                        ) : (
                            <Handshake className={`w-5 h-5 ${socio.role === 'ADMIN' ? 'text-purple-600' : 'text-emerald-600'}`} />
                        )}
                    </div>
                </div>

                <div className="space-y-4 mb-6">
                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Email</p>
                        <p className="text-sm text-gray-700 break-all">{socio.email}</p>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gradient-to-br from-gray-50 to-white rounded-2xl border border-gray-100">
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Participación</p>
                            <p className="text-2xl font-extrabold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">{socio.participation}%</p>
                        </div>
                        <Percent className="w-8 h-8 text-emerald-600 opacity-20" />
                    </div>

                    <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1">Rol</p>
                        <div className={`inline-block px-4 py-2 rounded-full font-bold text-sm ${socio.role === 'ADMIN' ? 'bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700' : 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-700'}`}>
                            {socio.role === 'ADMIN' ? '🛡️ Administrador' : '👥 Miembro'}
                        </div>
                    </div>
                </div>

                {currentUserRole === 'ADMIN' && (
                    <div className="flex gap-3 pt-4 border-t border-gray-100">
                        <Button onClick={() => onEdit(socio)} className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300">Editar</Button>
                        <Button onClick={() => onDelete(socio.id)} className="flex-1 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300">Eliminar</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default SocioCard;
