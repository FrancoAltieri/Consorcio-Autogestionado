interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { name: string; monto: number } }>;
}

export function ChartTooltip({ active, payload }: TooltipProps) {
  if (!active || !payload?.length) return null;

  const { name, monto } = payload[0].payload;
  return (
    <div className="bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-100/50 min-w-[200px]">
      <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">{name}</p>
      <p className="text-2xl font-bold text-gray-950">
        ${monto.toLocaleString('es-AR')}
      </p>
      <p className="text-xs text-gray-500 mt-1">Gasto total de la categoría</p>
    </div>
  );
}
