import { useNavigate } from 'react-router';
import { User, LogOut, ArrowLeft } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { authService } from '@/services/authService';

interface UserMenuProps {
    userName?: string;
    userEmail?: string;
}

export function UserMenu({ userName, userEmail }: UserMenuProps) {
    const navigate = useNavigate();

    const handleBackToConsorcios = () => {
        navigate('/mis-consorcios');
    };

    const handleLogout = () => {
        authService.logout();
        navigate('/login');
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="group flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-700 hover:bg-gray-50 rounded-lg transition-all">
                    <User className="w-4 h-4" />
                    <span>{userName || 'Usuario'}</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuItem onClick={handleBackToConsorcios}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    <span>Volver a mis consorcios</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Cerrar sesión</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}