import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { CheckCircle, XCircle, ArrowLeft, User, Calendar, Truck, Phone, Clock } from 'lucide-react';
import type { Order } from '../types';

export const OrderDetails = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { orders, updateOrderStatus } = useData();
    const [order, setOrder] = useState<Order | null>(null);

    useEffect(() => {
        const foundOrder = orders.find(o => o.id === id);
        if (foundOrder) {
            setOrder(foundOrder);
        }
    }, [id, orders]);

    const handleApprove = () => {
        if (order) {
            updateOrderStatus(order.id, 'Approved');
            alert('Pedido aprovado!');
            navigate('/admin/approvals');
        }
    };

    const handleReject = () => {
        if (order) {
            updateOrderStatus(order.id, 'Rejected');
            alert('Pedido rejeitado!');
            navigate('/admin/approvals');
        }
    };

    if (!order) {
        return (
            <div className="flex items-center justify-center h-64">
                <p className="text-gray-500">Pedido não encontrado</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/admin/approvals')}
                className="mb-4 flex items-center text-gray-600 hover:text-gray-900"
            >
                <ArrowLeft size={20} className="mr-2" />
                Voltar
            </button>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <div className="flex justify-between items-start">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">{order.client}</h2>
                            <p className="text-sm text-gray-500 mt-1">Pedido #{order.id.slice(0, 8)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                order.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                    'bg-blue-100 text-blue-800'
                            }`}>
                            {order.status === 'Pending' ? 'Pendente' :
                                order.status === 'Approved' ? 'Aprovado' :
                                    order.status === 'Rejected' ? 'Rejeitado' : 'Agendado'}
                        </span>
                    </div>
                </div>

                <div className="p-6 space-y-6">
                    {/* Informações do Consultor */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Consultor</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-700">
                                <User size={18} className="mr-2 text-gray-400" />
                                <span>{order.consultantName}</span>
                            </div>
                            <div className="flex items-center text-gray-700">
                                <Truck size={18} className="mr-2 text-gray-400" />
                                <span>{order.branch}</span>
                            </div>
                        </div>
                    </div>

                    {/* Informações do Cliente */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Cliente</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-center text-gray-700">
                                <User size={18} className="mr-2 text-gray-400" />
                                <span>{order.client}</span>
                            </div>
                            {order.clientPhone && (
                                <div className="flex items-center text-gray-700">
                                    <Phone size={18} className="mr-2 text-gray-400" />
                                    <span>{order.clientPhone}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Detalhes do Pedido */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Detalhes do Pedido</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Data da Concretagem</p>
                                <p className="text-gray-900 font-medium flex items-center mt-1">
                                    <Calendar size={18} className="mr-2 text-gray-400" />
                                    {new Date(order.concreteDate).toLocaleDateString('pt-BR')}
                                </p>
                            </div>
                            {order.concreteTime && (
                                <div>
                                    <p className="text-sm text-gray-500">Hora</p>
                                    <p className="text-gray-900 font-medium flex items-center mt-1">
                                        <Clock size={18} className="mr-2 text-gray-400" />
                                        {order.concreteTime}
                                    </p>
                                </div>
                            )}
                            <div>
                                <p className="text-sm text-gray-500">Volume</p>
                                <p className="text-gray-900 font-medium">{order.volume} m³</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Tipo de Descarga</p>
                                <p className="text-gray-900 font-medium">{order.pumpType}</p>
                            </div>
                            {order.fck && (
                                <div>
                                    <p className="text-sm text-gray-500">FCK</p>
                                    <p className="text-gray-900 font-medium">{order.fck}</p>
                                </div>
                            )}
                            {order.contract && (
                                <div>
                                    <p className="text-sm text-gray-500">Contrato</p>
                                    <p className="text-gray-900 font-medium">{order.contract}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Observações */}
                    {(order.notes || order.observations) && (
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-3">Observações</h3>
                            {order.notes && (
                                <div className="mb-3">
                                    <p className="text-sm text-gray-500 mb-1">Observações</p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-700">{order.notes}</p>
                                    </div>
                                </div>
                            )}
                            {order.observations && (
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">Observações Adicionais</p>
                                    <div className="bg-gray-50 p-3 rounded-lg">
                                        <p className="text-gray-700">{order.observations}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Ações */}
                    {order.status === 'Pending' && (
                        <div className="flex gap-4 pt-4 border-t">
                            <button
                                onClick={handleApprove}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                            >
                                <CheckCircle size={20} />
                                <span>Aprovar</span>
                            </button>
                            <button
                                onClick={handleReject}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                            >
                                <XCircle size={20} />
                                <span>Rejeitar</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;
