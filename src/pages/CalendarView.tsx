import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const CalendarView = () => {
    const { orders } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState(new Date());
    const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('month');

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const days = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay();
        return { days, firstDay };
    };

    const { days, firstDay } = getDaysInMonth(currentDate);

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const filteredOrders = orders.filter(o => {
        // Role Filter
        if (user?.role !== 'admin' && o.consultantId !== user?.id) return false;
        // Show all orders for consultants (Pending, Approved, Rejected)
        // Show only Approved for admins in calendar
        if (user?.role === 'admin') {
            return o.status === 'Approved';
        }
        return true; // Show all statuses for consultants
    });

    const getOrdersForDay = (day: number) => {
        return filteredOrders.filter(o => {
            const orderDate = new Date(o.concreteDate);
            return (
                orderDate.getDate() === day &&
                orderDate.getMonth() === currentDate.getMonth() &&
                orderDate.getFullYear() === currentDate.getFullYear()
            );
        });
    };

    const monthNames = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];

    return (
        <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-4 text-sm font-medium text-gray-500">
                    <span
                        className={`cursor-pointer hover:text-blue-600 ${viewMode === 'day' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}
                        onClick={() => setViewMode('day')}
                    >
                        Day
                    </span>
                    <span
                        className={`cursor-pointer hover:text-blue-600 ${viewMode === 'week' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}
                        onClick={() => setViewMode('week')}
                    >
                        Week
                    </span>
                    <span
                        className={`cursor-pointer hover:text-blue-600 ${viewMode === 'month' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : ''}`}
                        onClick={() => setViewMode('month')}
                    >
                        Month
                    </span>
                </div>
                <div className="flex items-center space-x-4">
                    <button onClick={prevMonth} className="p-1 hover:bg-gray-100 rounded-full">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-lg font-semibold text-gray-700">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button onClick={nextMonth} className="p-1 hover:bg-gray-100 rounded-full">
                        <ChevronRight size={20} />
                    </button>
                </div>
                <button className="text-blue-600 text-sm font-medium hover:underline" onClick={() => setCurrentDate(new Date())}>
                    Today
                </button>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border border-gray-200">
                {['do', '2ª', '3ª', '4ª', '5ª', '6ª', 'sa'].map(day => (
                    <div key={day} className="bg-white py-2 text-center text-xs font-medium text-gray-500 uppercase">
                        {day}
                    </div>
                ))}

                {Array.from({ length: firstDay }).map((_, index) => (
                    <div key={`empty-${index}`} className="bg-white h-32" />
                ))}

                {Array.from({ length: days }).map((_, index) => {
                    const day = index + 1;
                    const dayOrders = getOrdersForDay(day);
                    const isToday =
                        day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();

                    return (
                        <div key={day} className="bg-white h-32 p-2 border-t border-gray-100 relative hover:bg-gray-50 transition-colors">
                            <div className={`text-xs font-medium mb-1 ${isToday ? 'bg-blue-600 text-white w-6 h-6 flex items-center justify-center rounded-full mx-auto' : 'text-center text-gray-700'}`}>
                                {day}
                            </div>
                            <div className="space-y-1 overflow-y-auto max-h-[calc(100%-24px)]">
                                {dayOrders.map(order => {
                                    const statusColor =
                                        order.status === 'Approved' ? 'bg-green-500 hover:bg-green-600' :
                                            order.status === 'Pending' ? 'bg-yellow-500 hover:bg-yellow-600' :
                                                order.status === 'Rejected' ? 'bg-red-500 hover:bg-red-600' :
                                                    'bg-blue-500 hover:bg-blue-600';

                                    return (
                                        <div
                                            key={order.id}
                                            className={`${statusColor} text-white text-[10px] px-1 py-0.5 rounded truncate cursor-pointer transition-colors`}
                                            title={`${order.status} - ${order.pumpType} - ${order.client}`}
                                            onClick={() => navigate(`/admin/approvals/${order.id}`)}
                                        >
                                            {order.pumpType} - {order.client}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default CalendarView;
