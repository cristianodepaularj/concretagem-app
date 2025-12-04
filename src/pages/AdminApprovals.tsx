import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Trash2, Phone, MessageCircle, ArrowRight } from 'lucide-react';

export const AdminApprovals = () => {
    const { orders, updateOrderStatus } = useData();
    const navigate = useNavigate();

    const pendingOrders = orders.filter(o => o.status === 'Pending');
    const historyOrders = orders.filter(o => o.status !== 'Pending');

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <h1 className="text-xl font-bold text-gray-700 mb-4 uppercase">Centro de Controle</h1>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 min-h-0">
                {/* Left Column: Aprovar Pedidos */}
                <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                        <h2 className="font-semibold text-gray-700">APROVAR PEDIDOS</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => navigate('/pre-schedule')}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                            >
                                + Add
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {pendingOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Nenhum pedido pendente.
                            </div>
                        ) : (
                            pendingOrders.map(order => (
                                <div
                                    key={order.id}
                                    className="border-b border-gray-100 pb-4 last:border-0 hover:bg-gray-50 p-3 rounded-lg cursor-pointer transition-colors"
                                    onClick={() => navigate(`/admin/approvals/${order.id}`)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-gray-900">{order.client}</span>
                                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">{order.volume}m³</span>
                                            </div>
                                            <div className="text-sm text-gray-500 mt-1">
                                                {order.consultantName} | {order.branch}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {new Date(order.concreteDate).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-3 mt-3" onClick={(e) => e.stopPropagation()}>
                                        <button onClick={() => updateOrderStatus(order.id, 'Rejected')} className="text-gray-400 hover:text-red-500">
                                            <Trash2 size={18} />
                                        </button>
                                        <button className="text-gray-400 hover:text-blue-500">
                                            <Phone size={18} />
                                        </button>
                                        <button className="text-gray-400 hover:text-green-500">
                                            <MessageCircle size={18} />
                                        </button>
                                        <button onClick={() => updateOrderStatus(order.id, 'Approved')} className="text-gray-400 hover:text-blue-600">
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Right Column: Meus Pedidos */}
                <div className="bg-white rounded-lg shadow border border-gray-200 flex flex-col">
                    <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-lg">
                        <h2 className="font-semibold text-gray-700">MEUS PEDIDOS</h2>
                        <button
                            onClick={() => navigate('/pre-schedule')}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                        >
                            + Add
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {historyOrders.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                Nenhum pedido no histórico.
                            </div>
                        ) : (
                            <>
                                <div className="text-xs text-gray-500 uppercase mb-2">All</div>
                                {historyOrders.map(order => (
                                    <div
                                        key={order.id}
                                        className="border-b border-gray-100 pb-3 last:border-0 hover:bg-gray-50 p-3 rounded-lg cursor-pointer transition-colors"
                                        onClick={() => navigate(`/admin/approvals/${order.id}`)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="flex-1">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {new Date(order.concreteDate).toLocaleDateString('pt-BR', {
                                                        day: '2-digit',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    }).toUpperCase()}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {order.client} - {order.branch}
                                                </div>
                                            </div>
                                            <div className="text-sm font-medium text-gray-600">
                                                {order.volume}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminApprovals;
