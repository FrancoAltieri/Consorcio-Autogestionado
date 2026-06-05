import usePagos from '../usePagos';
import { PagosHeader } from './PagosHeader';
import { NewPagoDialog } from './NewPagoDialog';
import { PagosStats } from './PagosStats';
import { PagosLoading } from './PagosLoading';
import { SociosStatus } from './SociosStatus';
import { PaymentsTable } from './PaymentsTable';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function PagosMain() {
    const {
        loading,
        showDialog,
        setShowDialog,
        filteredPagosList,
        sociosList,
        gastosList,
        totalPagos,
        formData,
        // fieldErrors: _unused, // not used here
        submitError,
        paymentFile,
        months,
        currentYear,
        selectedFilterMonth,
        selectedFilterYear,
        handleFieldChange,
        handleFileChange,
        handleFilterChange,
        handleAddPago,
        sociosAlDia,
        partnerBalances,
        formatPeriod,
        periodOptions,
        selectedPeriod,
        fetchFilteredPagosByPeriod,
        handlePrevPeriod,
        handleNextPeriod,
    } = usePagos() as any;

    if (loading) return <PagosLoading />;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-sky-400 to-indigo-600 opacity-10 blur-3xl rounded-full animate-pulse`}></div>
                <div className="relative z-10 flex items-center justify-between">
                    <PagosHeader />
                    <NewPagoDialog
                        open={showDialog}
                        onOpenChange={setShowDialog}
                        formData={formData}
                        months={months}
                        currentYear={currentYear}
                        submitError={submitError}
                        paymentFile={paymentFile}
                        onFieldChange={handleFieldChange}
                        onFileChange={handleFileChange}
                        onSave={handleAddPago}
                        gastosList={gastosList}
                    />
                </div>
            </div>

            <PagosStats totalPagos={totalPagos} movimientos={filteredPagosList.length} sociosAlDia={sociosAlDia} />

            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 to-indigo-600`}></div>
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className={`text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent`}>Movimientos</h3>
                        <div className="flex items-center gap-2">
                            <button onClick={handlePrevPeriod} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-gray-700 border border-gray-200`}>‹</button>
                            <div className="w-56">
                                <Select value={selectedPeriod} onValueChange={(val: string) => { fetchFilteredPagosByPeriod(val); }}>
                                    <SelectTrigger className="rounded-xl text-sm py-2 border-gray-200 focus:border-blue-500 transition-colors">
                                        <SelectValue placeholder="Seleccionar período" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {periodOptions && periodOptions.length > 0 ? (
                                            periodOptions.map((p) => (
                                                <SelectItem key={p} value={p}>{formatPeriod(p)}</SelectItem>
                                            ))
                                        ) : (
                                            <SelectItem value={selectedPeriod}>{formatPeriod(selectedPeriod)}</SelectItem>
                                        )}
                                    </SelectContent>
                                </Select>
                            </div>
                            <button onClick={handleNextPeriod} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-gray-700 border border-gray-200`}>›</button>
                            <button onClick={() => fetchFilteredPagosByPeriod(selectedPeriod)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all bg-white text-gray-950 shadow-sm`}>FILTRAR</button>
                        </div>
                    </div>

                    <SociosStatus socios={sociosList} pagos={filteredPagosList} gastos={gastosList} partnerBalances={partnerBalances} formatPeriod={formatPeriod} />

                    {filteredPagosList.length > 0 && (
                        <PaymentsTable pagos={filteredPagosList} socios={sociosList} gastos={gastosList} formatPeriod={formatPeriod} />
                    )}
                </div>
            </div>
        </div>
    );
}
