import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Calendar, PlusCircle, LayoutDashboard, CheckSquare, Users } from 'lucide-react';
import clsx from 'clsx';

export const Layout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return <Outlet />;

    const NavItem = ({ to, icon: Icon, label }: { to: string; icon: any; label: string }) => (
        <Link
            to={to}
            className={clsx(
                "flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors",
                location.pathname === to
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:bg-gray-100"
            )}
        >
            <Icon size={20} />
            <span>{label}</span>
        </Link>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-xl">C</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900 hidden sm:block">Concretagem App</span>
                    </div>

                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-sm font-medium text-gray-900">{user.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                            title="Sair"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
                <Outlet />
            </main>

            {/* Bottom Navigation (Mobile) */}
            <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 pb-safe">
                <div className="flex justify-around p-2">
                    {user.role === 'consultant' && (
                        <>
                            <Link to="/pre-schedule" className="flex flex-col items-center p-2 text-gray-600">
                                <PlusCircle size={24} />
                                <span className="text-xs mt-1">Novo</span>
                            </Link>
                            <Link to="/calendar" className="flex flex-col items-center p-2 text-gray-600">
                                <Calendar size={24} />
                                <span className="text-xs mt-1">Agenda</span>
                            </Link>
                        </>
                    )}
                    {user.role === 'admin' && (
                        <>
                            <Link to="/admin/approvals" className="flex flex-col items-center p-2 text-gray-600">
                                <CheckSquare size={24} />
                                <span className="text-xs mt-1">Aprovar</span>
                            </Link>
                            <Link to="/admin/dashboard" className="flex flex-col items-center p-2 text-gray-600">
                                <LayoutDashboard size={24} />
                                <span className="text-xs mt-1">Dash</span>
                            </Link>
                        </>
                    )}
                </div>
            </nav>

            {/* Sidebar Navigation (Desktop) */}
            <div className="hidden sm:block fixed left-0 top-16 bottom-0 w-64 bg-white border-r border-gray-200 p-4">
                <nav className="space-y-2">
                    {user.role === 'consultant' && (
                        <>
                            <NavItem to="/pre-schedule" icon={PlusCircle} label="Pré-Agendamento" />
                            <NavItem to="/calendar" icon={Calendar} label="Minha Agenda" />
                        </>
                    )}
                    {user.role === 'admin' && (
                        <>
                            <NavItem to="/admin/approvals" icon={CheckSquare} label="Aprovações Pendentes" />
                            <NavItem to="/admin/dashboard" icon={LayoutDashboard} label="Dashboard Geral" />
                            <NavItem to="/admin/users" icon={Users} label="Usuários" />
                        </>
                    )}
                </nav>
            </div>

            {/* Adjust main content margin for desktop sidebar */}
            <style>{`
        @media (min-width: 640px) {
          main { margin-left: 16rem; }
        }
      `}</style>
        </div>
    );
};
