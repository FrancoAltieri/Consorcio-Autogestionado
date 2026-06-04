import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// ─── Color palette ────────────────────────────────────────────────────────────

const C = {
    blue:   [37,  99,  235],
    green:  [16,  185, 129],
    red:    [220, 38,  38],
    orange: [249, 115, 22],
    purple: [124, 58,  237],
    gray:   [107, 114, 128],
    dark:   [15,  23,  42],
    light:  [248, 250, 252],
    white:  [255, 255, 255],
    border: [226, 232, 240],
};

// ─── Utilities ────────────────────────────────────────────────────────────────

const n = (v: unknown) => Number(v ?? 0);

const fmt = (v: unknown) =>
    `$${n(v).toLocaleString('es-AR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const formatPeriod = (period: string): string => {
    if (!period) return '';
    const [y, m] = period.split('-').map(Number);
    return new Date(y, m - 1, 1).toLocaleString('es-AR', { month: 'long', year: 'numeric' });
};

const todayStr = () => new Date().toLocaleDateString('es-AR');

const trunc = (s: string, max: number) =>
    s.length > max ? s.slice(0, max - 1) + '…' : s;

// ─── Layout helpers ───────────────────────────────────────────────────────────

function addHeader(
    doc: jsPDF,
    title: string,
    subtitle: string,
    period: string,
    color: number[] = C.blue,
): number {
    const pw = doc.internal.pageSize.getWidth();

    doc.setFillColor(color[0], color[1], color[2]);
    doc.rect(0, 0, pw, 46, 'F');

    // Brand
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    doc.setTextColor(255, 255, 255);
    doc.text('CONSORCIO AUTOGESTIONADO', 14, 15);

    // Title
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10.5);
    doc.text(title, 14, 27);

    // Subtitle
    doc.setFontSize(8.5);
    doc.setTextColor(200, 220, 255);
    doc.text(subtitle, 14, 37);

    // Right: period & date
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9.5);
    doc.setTextColor(255, 255, 255);
    doc.text(`Período: ${formatPeriod(period)}`, pw - 14, 20, { align: 'right' });

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(200, 220, 255);
    doc.text(`Emitido: ${todayStr()}`, pw - 14, 31, { align: 'right' });

    doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
    return 54;
}

interface KPIItem { label: string; value: string; color?: number[] }

function addKPIRow(doc: jsPDF, items: KPIItem[], y: number): number {
    const pw  = doc.internal.pageSize.getWidth();
    const ml  = 14, mr = 14, gap = 5;
    const boxW = (pw - ml - mr - gap * (items.length - 1)) / items.length;
    const boxH = 24;

    items.forEach((item, i) => {
        const x = ml + i * (boxW + gap);

        doc.setFillColor(C.light[0], C.light[1], C.light[2]);
        doc.roundedRect(x, y, boxW, boxH, 2.5, 2.5, 'F');

        doc.setDrawColor(C.border[0], C.border[1], C.border[2]);
        doc.setLineWidth(0.3);
        doc.roundedRect(x, y, boxW, boxH, 2.5, 2.5, 'S');

        // Label
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7);
        doc.setTextColor(C.gray[0], C.gray[1], C.gray[2]);
        doc.text(item.label.toUpperCase(), x + 5, y + 9);

        // Value
        const clr = item.color ?? C.blue;
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(clr[0], clr[1], clr[2]);
        doc.text(trunc(item.value, 18), x + 5, y + 19);
    });

    doc.setLineWidth(0.2);
    doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
    return y + boxH + 8;
}

function addSectionTitle(doc: jsPDF, title: string, y: number): number {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(C.dark[0], C.dark[1], C.dark[2]);
    doc.text(title, 14, y);

    doc.setDrawColor(C.blue[0], C.blue[1], C.blue[2]);
    doc.setLineWidth(0.6);
    doc.line(14, y + 2.5, 14 + doc.getTextWidth(title) + 2, y + 2.5);
    doc.setLineWidth(0.2);
    return y + 9;
}

function addFooters(doc: jsPDF): void {
    const pages = doc.getNumberOfPages();
    const pw = doc.internal.pageSize.getWidth();
    const ph = doc.internal.pageSize.getHeight();
    for (let i = 1; i <= pages; i++) {
        doc.setPage(i);
        doc.setDrawColor(C.border[0], C.border[1], C.border[2]);
        doc.setLineWidth(0.3);
        doc.line(14, ph - 13, pw - 14, ph - 13);
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(C.gray[0], C.gray[1], C.gray[2]);
        doc.text('Sistema de Consorcio Autogestionado', 14, ph - 7);
        doc.text(`Página ${i} de ${pages}`, pw - 14, ph - 7, { align: 'right' });
    }
}

function statusCell(saldo: number) {
    const label = saldo > 0.01 ? 'A favor' : saldo < -0.01 ? 'Debe' : 'Al día';
    const color = saldo > 0.01 ? C.green : saldo < -0.01 ? C.red : C.blue;
    return { content: label, styles: { textColor: color, fontStyle: 'bold', halign: 'center' } };
}

// ─── Report 1: Resumen Mensual ────────────────────────────────────────────────

export function downloadResumenPDF(reporte: any, period: string): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    let y = addHeader(
        doc,
        'Resumen Mensual Completo',
        'Balance general de gastos y pagos del período',
        period,
        C.blue,
    );

    const diff = n(reporte.diferencia);
    y = addKPIRow(doc, [
        { label: 'Total Gastos',    value: fmt(reporte.totalExpenses),    color: C.red    },
        { label: 'Total Pagos',     value: fmt(reporte.totalPayments),    color: C.green  },
        { label: diff >= 0 ? 'Superávit' : 'Déficit',
          value: fmt(Math.abs(diff)),
          color: diff >= 0 ? C.green : C.red },
        { label: 'Mora Acumulada',  value: fmt(reporte.totalMora),        color: C.orange },
    ], y);

    y = addSectionTitle(doc, 'Estado de Cuentas por Socio', y);

    const partners: any[] = reporte.perPartnerBalance ?? [];

    const rows = [...partners]
        .sort((a, b) => (a.name ?? '').localeCompare(b.name ?? ''))
        .map((p: any) => {
            const debt = n(p.debt), payments = n(p.payments);
            const saldo = payments - debt;
            return [p.name ?? '-', fmt(debt), fmt(payments), fmt(Math.abs(saldo)), statusCell(saldo)];
        });

    autoTable(doc, {
        startY: y,
        head: [['Socio', 'Cuota', 'Pagado', 'Saldo', 'Estado']],
        body: rows,
        headStyles:      { fillColor: C.blue,  textColor: C.white, fontStyle: 'bold', fontSize: 9 } as any,
        bodyStyles:      { fontSize: 9, textColor: C.dark } as any,
        alternateRowStyles: { fillColor: C.light } as any,
        columnStyles: {
            0: { cellWidth: 60 },
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'center' },
        },
        margin: { left: 14, right: 14, bottom: 20 },
    });

    const finalY: number = (doc as any).lastAutoTable.finalY + 6;
    const cob = n(reporte.totalExpenses) > 0
        ? `${((n(reporte.totalPayments) / n(reporte.totalExpenses)) * 100).toFixed(1)}%`
        : 'N/D';

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(C.gray[0], C.gray[1], C.gray[2]);
    doc.text(
        `Cobertura de gastos: ${cob}  ·  Total socios: ${partners.length}`,
        14,
        finalY,
    );

    addFooters(doc);
    doc.save(`resumen_mensual_${period}.pdf`);
}

// ─── Report 2: Estado de Socios ───────────────────────────────────────────────

export function downloadSociosPDF(reporte: any, period: string): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    let y = addHeader(
        doc,
        'Estado de Cuentas por Socio',
        'Detalle individual ordenado por saldo pendiente',
        period,
        C.green,
    );

    const partners: any[] = reporte.perPartnerBalance ?? [];
    const alDia  = partners.filter(p => Math.abs(n(p.payments) - n(p.debt)) <= 0.01).length;
    const aFavor = partners.filter(p => n(p.payments) > n(p.debt) + 0.01).length;
    const deben  = partners.filter(p => n(p.payments) < n(p.debt) - 0.01).length;

    y = addKPIRow(doc, [
        { label: 'Total Socios', value: String(partners.length), color: C.blue  },
        { label: 'Al día',       value: String(alDia),           color: C.blue  },
        { label: 'A favor',      value: String(aFavor),          color: C.green },
        { label: 'Con deuda',    value: String(deben),           color: C.red   },
    ], y);

    y = addSectionTitle(doc, 'Detalle por Socio (mayor deuda primero)', y);

    const rows = [...partners]
        .sort((a, b) => (n(b.debt) - n(b.payments)) - (n(a.debt) - n(a.payments)))
        .map((p: any, i) => {
            const debt = n(p.debt), payments = n(p.payments);
            const saldo = payments - debt;
            return [
                String(i + 1),
                p.name ?? '-',
                fmt(debt),
                fmt(payments),
                fmt(Math.abs(saldo)),
                statusCell(saldo),
            ];
        });

    autoTable(doc, {
        startY: y,
        head: [['#', 'Socio', 'Cuota del Período', 'Total Pagado', 'Saldo', 'Estado']],
        body: rows,
        headStyles:      { fillColor: C.green, textColor: C.white, fontStyle: 'bold', fontSize: 9 } as any,
        bodyStyles:      { fontSize: 9, textColor: C.dark } as any,
        alternateRowStyles: { fillColor: C.light } as any,
        columnStyles: {
            0: { cellWidth: 10, halign: 'center' },
            1: { cellWidth: 55 },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'center' },
        },
        margin: { left: 14, right: 14, bottom: 20 },
    });

    addFooters(doc);
    doc.save(`estado_socios_${period}.pdf`);
}

// ─── Report 3: Análisis de Gastos ────────────────────────────────────────────

export function downloadGastosPDF(reporte: any, period: string): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    let y = addHeader(
        doc,
        'Análisis de Gastos',
        'Distribución porcentual de cuotas y estado de pago por socio',
        period,
        C.purple,
    );

    const partners: any[] = reporte.perPartnerBalance ?? [];
    const totalDebt = partners.reduce((acc, p) => acc + n(p.debt), 0);
    const totalPaid = n(reporte.totalPayments);
    const totalExp  = n(reporte.totalExpenses);
    const cobPct    = totalExp > 0
        ? `${((totalPaid / totalExp) * 100).toFixed(1)}%`
        : 'N/D';

    y = addKPIRow(doc, [
        { label: 'Total Gastos',    value: fmt(totalExp),                         color: C.red    },
        { label: 'Total Recaudado', value: fmt(totalPaid),                        color: C.green  },
        { label: 'Cobertura',       value: cobPct,                                color: totalPaid >= totalExp ? C.green : C.orange },
        { label: 'Diferencia',      value: fmt(Math.abs(n(reporte.diferencia))),  color: n(reporte.diferencia) >= 0 ? C.green : C.red },
    ], y);

    y = addSectionTitle(doc, 'Distribución de Gastos por Socio (mayor cuota primero)', y);

    const rows = [...partners]
        .sort((a, b) => n(b.debt) - n(a.debt))
        .map((p: any) => {
            const debt = n(p.debt), payments = n(p.payments);
            const saldo = payments - debt;
            const pctT = totalDebt > 0 ? `${((debt / totalDebt) * 100).toFixed(2)}%` : '0%';
            const pctP = debt > 0       ? `${((payments / debt) * 100).toFixed(1)}%`  : '100%';
            return [
                p.name ?? '-',
                fmt(debt),
                pctT,
                fmt(payments),
                pctP,
                {
                    content: fmt(Math.abs(saldo)),
                    styles: { textColor: saldo >= 0 ? C.green : C.red, fontStyle: 'bold', halign: 'right' },
                },
            ];
        });

    autoTable(doc, {
        startY: y,
        head: [['Socio', 'Cuota Asignada', '% del Total', 'Pagado', '% Pagado', 'Saldo']],
        body: rows,
        foot: [['TOTAL', fmt(totalDebt), '100%', fmt(totalPaid), cobPct, fmt(Math.abs(n(reporte.diferencia)))]],
        headStyles: { fillColor: C.purple, textColor: C.white,  fontStyle: 'bold', fontSize: 9 } as any,
        bodyStyles: { fontSize: 9, textColor: C.dark } as any,
        alternateRowStyles: { fillColor: C.light } as any,
        footStyles: { fillColor: [237, 233, 254], textColor: C.purple, fontStyle: 'bold' } as any,
        columnStyles: {
            0: { cellWidth: 50 },
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' },
        },
        margin: { left: 14, right: 14, bottom: 20 },
    });

    addFooters(doc);
    doc.save(`analisis_gastos_${period}.pdf`);
}

// ─── Report 4: Morosidad ──────────────────────────────────────────────────────

export function downloadMorosidadPDF(reporte: any, period: string): void {
    const doc = new jsPDF('p', 'mm', 'a4');
    let y = addHeader(
        doc,
        'Reporte de Morosidad',
        'Socios con pagos pendientes al cierre del período',
        period,
        C.red,
    );

    const all: any[] = reporte.perPartnerBalance ?? [];
    const morosos = [...all]
        .filter(p => n(p.payments) < n(p.debt) - 0.01)
        .sort((a, b) => (n(b.debt) - n(b.payments)) - (n(a.debt) - n(a.payments)));

    const totalPend = morosos.reduce((acc, p) => acc + n(p.debt) - n(p.payments), 0);
    const pctMor    = all.length > 0
        ? `${((morosos.length / all.length) * 100).toFixed(1)}%`
        : '0%';

    y = addKPIRow(doc, [
        { label: 'Socios Morosos',   value: `${morosos.length} / ${all.length}`, color: C.red    },
        { label: '% Morosidad',      value: pctMor,                              color: C.red    },
        { label: 'Total Pendiente',  value: fmt(totalPend),                      color: C.red    },
        { label: 'Mora Acumulada',   value: fmt(reporte.totalMora),              color: C.orange },
    ], y);

    if (morosos.length === 0) {
        doc.setFillColor(220, 252, 231);
        doc.roundedRect(14, y, doc.internal.pageSize.getWidth() - 28, 22, 3, 3, 'F');
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.setTextColor(C.green[0], C.green[1], C.green[2]);
        doc.text('Sin socios con pagos pendientes en este período.', 22, y + 14);
    } else {
        y = addSectionTitle(doc, `Socios con Pagos Pendientes (${morosos.length})`, y);

        const rows = morosos.map((p: any, i) => {
            const debt = n(p.debt), payments = n(p.payments);
            const pending = debt - payments;
            const pct = debt > 0 ? `${((payments / debt) * 100).toFixed(1)}%` : '0%';
            return [
                String(i + 1),
                p.name ?? '-',
                fmt(debt),
                fmt(payments),
                pct,
                { content: fmt(pending), styles: { textColor: C.red, fontStyle: 'bold', halign: 'right' } },
            ];
        });

        autoTable(doc, {
            startY: y,
            head: [['#', 'Socio', 'Cuota', 'Pagado', '% Pagado', 'Pendiente']],
            body: rows,
            foot: [['', 'TOTAL PENDIENTE', '', '', '', fmt(totalPend)]],
            headStyles: { fillColor: C.red, textColor: C.white, fontStyle: 'bold', fontSize: 9 } as any,
            bodyStyles: { fontSize: 9, textColor: C.dark } as any,
            alternateRowStyles: { fillColor: [255, 241, 242] } as any,
            footStyles: { fillColor: [255, 228, 230], textColor: C.red, fontStyle: 'bold' } as any,
            columnStyles: {
                0: { cellWidth: 10, halign: 'center' },
                1: { cellWidth: 55 },
                2: { halign: 'right' },
                3: { halign: 'right' },
                4: { halign: 'right' },
                5: { halign: 'right' },
            },
            margin: { left: 14, right: 14, bottom: 20 },
        });
    }

    addFooters(doc);
    doc.save(`morosidad_${period}.pdf`);
}
