import useGastos from '../useGastos';
import { GastosHeader } from './GastosHeader';
import { NewGastoDialog } from './NewGastoDialog';
import { GastosStats } from './GastosStats';
import { GastosLoading } from './GastosLoading';
import { MovementsList } from './MovementsList';

export function GastosMain() {
    const {
        loading,
        showDialog,
        setShowDialog,
        filter,
        setFilter,
        socios,
        filteredGastos,
        totalGastosMonto,
        formData,
        fieldErrors,
        submitError,
        successMessage,
        showSuccessMessage,
        handleFieldChange,
        closeDialog,
        handleSaveGastos,
    } = useGastos();

    if (loading) return <GastosLoading />;

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

            {successMessage && (
                <div className={`fixed left-1/2 top-4 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 border-green-200 bg-green-50/90 backdrop-blur-md text-green-800 shadow-2xl transition-all duration-500 ${showSuccessMessage ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0'}`}>
                    <div className="p-3 font-bold flex items-center gap-3">
                        <span className="text-green-600">✓</span>
                        <span>{successMessage}</span>
                    </div>
                </div>
            )}

            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white via-gray-50 to-white p-10 border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className={`absolute -top-20 -right-20 w-80 h-80 bg-gradient-to-br from-sky-400 to-indigo-600 opacity-10 blur-3xl rounded-full animate-pulse`}></div>
                <div className="relative z-10 flex items-center justify-between">
                    <GastosHeader />
                    <NewGastoDialog open={showDialog} onOpenChange={setShowDialog} formData={formData} fieldErrors={fieldErrors} submitError={submitError} onFieldChange={handleFieldChange} onClose={closeDialog} onSave={handleSaveGastos} />
                </div>
            </div>

            <GastosStats totalGastosMonto={totalGastosMonto} gastos={filteredGastos} />

            <div className="group relative overflow-hidden rounded-3xl bg-white border border-gray-100 shadow-xl shadow-gray-100/50">
                <div className={`absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-sky-400 to-indigo-600`}></div>
                <div className="p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className={`text-2xl font-bold bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent`}>Movimientos</h3>
                        <div className="flex bg-gray-100/50 p-1 rounded-xl border border-gray-100">
                            {(['todos'] as const).map((f) => (
                                <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${filter === f ? 'bg-white text-gray-950 shadow-sm' : 'text-gray-500'}`}>
                                    {f.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <MovementsList gastos={filteredGastos} socios={socios} />
                </div>
            </div>
        </div>
    );
}

export default GastosMain;
