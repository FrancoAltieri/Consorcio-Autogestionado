export function currentPeriod(): string {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    return `${y}-${m}-01`;
}

export function parsePeriodToLocalDate(period?: string): Date {
    if (!period) return new Date();
    const parts = period.split('-');
    const y = Number(parts[0]);
    const m = Number(parts[1]) - 1;
    const d = Number(parts[2] ?? 1);
    return new Date(y, m, d);
}

export function formatPeriodToMonthYear(period?: string, locale = 'es-AR') {
    const date = parsePeriodToLocalDate(period);
    return date.toLocaleString(locale, { month: 'long', year: 'numeric' });
}

export function ensurePeriodInList(periods: string[] | undefined, periodToEnsure: string) {
    const set = new Set<string>(periods || []);
    set.add(periodToEnsure);
    const arr = Array.from(set).sort();
    return arr;
}
