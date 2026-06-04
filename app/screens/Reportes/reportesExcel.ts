import * as XLSX from 'xlsx';
import { formatPeriod } from './reportesPdf';

// ─── Utilities ────────────────────────────────────────────────────────────────

const n   = (v: unknown) => Number(v ?? 0);
const f2  = (v: unknown) => +n(v).toFixed(2);
const pct = (num: number, den: number) =>
    den > 0 ? `${((num / den) * 100).toFixed(1)}%` : '0%';

const todayStr = () => new Date().toLocaleDateString('es-AR');

function makeSheet(data: any[][], colWidths: number[]): XLSX.WorkSheet {
    const ws = XLSX.utils.aoa_to_sheet(data);
    ws['!cols'] = colWidths.map(w => ({ wch: w }));
    return ws;
}

export type ExcelReportType = 'resumen' | 'socios' | 'gastos' | 'morosidad';

// ─── Main export ──────────────────────────────────────────────────────────────

export function downloadExcel(
    reporte: any,
    period: string,
    type: ExcelReportType,
): void {
    const wb       = XLSX.utils.book_new();
    const all: any[] = reporte.perPartnerBalance ?? [];
    const fp        = formatPeriod(period);
    const ts        = todayStr();

    // ── Resumen Mensual ─────────────────────────────────────────────────────
    if (type === 'resumen') {
        const diff = n(reporte.diferencia);
        const cob  = n(reporte.totalExpenses) > 0
            ? pct(n(reporte.totalPayments), n(reporte.totalExpenses))
            : 'N/D';

        const data: any[][] = [
            [`RESUMEN MENSUAL — ${fp.toUpperCase()}`],
            [`Emitido el ${ts}`],
            [],
            ['INDICADORES GENERALES',         ''                            ],
            ['Total Gastos',                  f2(reporte.totalExpenses)     ],
            ['Total Pagos',                   f2(reporte.totalPayments)     ],
            [diff >= 0 ? 'Superávit' : 'Déficit', f2(Math.abs(diff))       ],
            ['Mora Acumulada',                f2(reporte.totalMora)         ],
            ['Cobertura de Gastos',           cob                          ],
            [],
            ['ESTADO POR SOCIO', '', '', '', ''],
            ['Socio', 'Cuota', 'Pagado', 'Saldo', 'Estado'],
            ...[...all]
                .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
                .map(p => {
                    const debt = n(p.debt), payments = n(p.payments);
                    const saldo = payments - debt;
                    const estado =
                        saldo >  0.01 ? 'A favor' :
                        saldo < -0.01 ? 'Debe'    : 'Al día';
                    return [p.name ?? '-', f2(debt), f2(payments), f2(Math.abs(saldo)), estado];
                }),
        ];

        XLSX.utils.book_append_sheet(wb, makeSheet(data, [32, 18, 18, 18, 12]), 'Resumen Mensual');
    }

    // ── Estado de Socios ────────────────────────────────────────────────────
    if (type === 'socios') {
        const alDia  = all.filter(p => Math.abs(n(p.payments) - n(p.debt)) <= 0.01).length;
        const aFavor = all.filter(p => n(p.payments) > n(p.debt) + 0.01).length;
        const deben  = all.filter(p => n(p.payments) < n(p.debt) - 0.01).length;

        const data: any[][] = [
            [`ESTADO DE CUENTAS POR SOCIO — ${fp.toUpperCase()}`],
            [`Emitido el ${ts}`],
            [],
            ['Total socios:', all.length,  '', 'Al día:',   alDia  ],
            ['A favor:',      aFavor,       '', 'Con deuda:', deben  ],
            [],
            ['#', 'Socio', 'Cuota del Período', 'Total Pagado', 'Saldo', 'Estado'],
            ...[...all]
                .sort((a, b) => (n(b.debt) - n(b.payments)) - (n(a.debt) - n(a.payments)))
                .map((p, i) => {
                    const debt = n(p.debt), payments = n(p.payments);
                    const saldo = payments - debt;
                    const estado =
                        saldo >  0.01 ? 'A favor' :
                        saldo < -0.01 ? 'Debe'    : 'Al día';
                    return [i + 1, p.name ?? '-', f2(debt), f2(payments), f2(Math.abs(saldo)), estado];
                }),
        ];

        XLSX.utils.book_append_sheet(wb, makeSheet(data, [6, 32, 18, 18, 18, 12]), 'Estado de Socios');
    }

    // ── Análisis de Gastos ──────────────────────────────────────────────────
    if (type === 'gastos') {
        const totalDebt = all.reduce((acc, p) => acc + n(p.debt), 0);
        const totalPaid = n(reporte.totalPayments);
        const totalExp  = n(reporte.totalExpenses);
        const cob       = pct(totalPaid, totalExp);

        const data: any[][] = [
            [`ANÁLISIS DE GASTOS — ${fp.toUpperCase()}`],
            [`Emitido el ${ts}`],
            [],
            ['RESUMEN FINANCIERO',  ''         ],
            ['Total Gastos',        f2(totalExp)],
            ['Total Recaudado',     f2(totalPaid)],
            ['Cobertura',           cob          ],
            ['Diferencia',          f2(Math.abs(n(reporte.diferencia)))],
            [],
            ['Socio', 'Cuota Asignada', '% del Total', 'Pagado', '% Pagado', 'Saldo'],
            ...[...all]
                .sort((a, b) => n(b.debt) - n(a.debt))
                .map(p => {
                    const debt = n(p.debt), payments = n(p.payments);
                    const saldo = payments - debt;
                    return [
                        p.name ?? '-',
                        f2(debt),
                        pct(debt, totalDebt),
                        f2(payments),
                        pct(payments, debt),
                        f2(Math.abs(saldo)),
                    ];
                }),
            [],
            ['TOTAL', f2(totalDebt), '100%', f2(totalPaid), cob, f2(Math.abs(n(reporte.diferencia)))],
        ];

        XLSX.utils.book_append_sheet(wb, makeSheet(data, [32, 18, 13, 18, 13, 18]), 'Análisis de Gastos');
    }

    // ── Morosidad ───────────────────────────────────────────────────────────
    if (type === 'morosidad') {
        const morosos = [...all]
            .filter(p => n(p.payments) < n(p.debt) - 0.01)
            .sort((a, b) => (n(b.debt) - n(b.payments)) - (n(a.debt) - n(a.payments)));

        const totalPend = morosos.reduce((acc, p) => acc + n(p.debt) - n(p.payments), 0);

        const data: any[][] = [
            [`REPORTE DE MOROSIDAD — ${fp.toUpperCase()}`],
            [`Emitido el ${ts}`],
            [],
            ['Socios morosos:',  morosos.length, '', 'Total pendiente:', f2(totalPend)],
            ['Total socios:',    all.length,     '', 'Mora acumulada:',  f2(n(reporte.totalMora))],
            [],
        ];

        if (morosos.length === 0) {
            data.push(['Sin socios morosos en este período.']);
        } else {
            data.push(['#', 'Socio', 'Cuota', 'Pagado', '% Pagado', 'Pendiente']);
            morosos.forEach((p, i) => {
                const debt = n(p.debt), payments = n(p.payments);
                data.push([
                    i + 1,
                    p.name ?? '-',
                    f2(debt),
                    f2(payments),
                    pct(payments, debt),
                    f2(debt - payments),
                ]);
            });
            data.push([]);
            data.push(['', 'TOTAL PENDIENTE', '', '', '', f2(totalPend)]);
        }

        XLSX.utils.book_append_sheet(wb, makeSheet(data, [6, 32, 18, 18, 12, 18]), 'Morosidad');
    }

    XLSX.writeFile(wb, `${type}_${period}.xlsx`);
}
