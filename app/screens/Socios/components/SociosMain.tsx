import { SociosHeader } from './SociosHeader';
import { InviteCodeCard } from './InviteCodeCard';
import { StatsCards } from './StatsCards';
import { SociosLoading } from './SociosLoading';
import { SociosEmpty } from './SociosEmpty';
import { SociosGrid } from './SociosGrid';
import { EditSocioDialog } from './EditSocioDialog';
import useSocios from '../useSocios';

export function SociosMain() {
    const {
        consorcio,
        sociosList,
        loading,
        copied,
        currentUserRole,
        showDialog,
        setShowDialog,
        editingSocio,
        fieldErrors,
        submitError,
        formData,
        openEditDialog,
        closeDialog,
        handleFieldChange,
        handleDeleteSocio,
        handleUpdateSocio,
        copyToClipboard,
    } = useSocios();

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <SociosHeader />

            {consorcio && (
                <InviteCodeCard consorcio={consorcio} copied={copied} onCopy={copyToClipboard} />
            )}

            {!loading && sociosList.length > 0 && <StatsCards sociosList={sociosList} />}

            {loading && <SociosLoading />}

            {!loading && sociosList.length === 0 && <SociosEmpty />}

            {!loading && sociosList.length > 0 && (
                <SociosGrid
                    socios={sociosList}
                    currentUserRole={currentUserRole}
                    onEdit={openEditDialog}
                    onDelete={handleDeleteSocio}
                />
            )}

            <EditSocioDialog
                open={showDialog}
                onOpenChange={setShowDialog}
                editingSocio={editingSocio}
                formData={formData}
                fieldErrors={fieldErrors}
                submitError={submitError}
                onFieldChange={handleFieldChange}
                onClose={closeDialog}
                onSave={handleUpdateSocio}
            />
        </div>
    );
}

export default SociosMain;
