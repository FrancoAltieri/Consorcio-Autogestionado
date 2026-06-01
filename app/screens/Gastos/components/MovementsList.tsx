import type { Gasto, Socio } from '../useGastos';
import { MovementCard } from './MovementCard';

interface Props {
    gastos: Gasto[];
    socios: Socio[];
}

export function MovementsList({ gastos, socios }: Props) {
    return (
        <div className="space-y-4">
            {gastos.map((gasto) => (
                <MovementCard key={gasto.id} gasto={gasto} socios={socios} />
            ))}
        </div>
    );
}

export default MovementsList;
