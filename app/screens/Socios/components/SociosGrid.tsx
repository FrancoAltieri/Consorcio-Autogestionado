import type { Socio } from '../useSocios';
import { SocioCard } from './SocioCard';

interface Props {
    socios: Socio[];
    currentUserRole: string | null;
    onEdit: (s: Socio) => void;
    onDelete: (id: number) => void;
}

export function SociosGrid({ socios, currentUserRole, onEdit, onDelete }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {socios.map((socio) => (
                <SocioCard key={socio.id} socio={socio} currentUserRole={currentUserRole} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    );
}

export default SociosGrid;
