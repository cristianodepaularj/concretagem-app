import { useState } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Truck, User, FileText, Droplet } from 'lucide-react';

export const PreSchedule = () => {
    const { addOrder } = useData();
    const { user } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        branch: '',
        client: '',
        volume: '',
        pumpType: 'CONVENCIONAL',
        concreteDate: '',
        notes: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        addOrder({
            dateRequest: new Date().toISOString().split('T')[0],
            branch: formData.branch,
            consultantId: user.id,
            consultantName: user.name,
            client: formData.client,
            volume: Number(formData.volume),
            pumpType: formData.pumpType,
            concreteDate: formData.concreteDate,
            notes: formData.notes
        });

        alert('Pré-agendamento enviado com sucesso!');
        navigate('/calendar');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-xl font-bold text-gray-900">Novo Pré-Agendamento</h2>
                    <p className="text-sm text-gray-500 mt-1">Preencha os dados para solicitar agendamento</p>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Branch Selection */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Truck size={16} className="mr-2" /> Filial
                            </label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.branch}
                                onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                required
                            >
                                <option value="">Selecione a filial...</option>
                                <option value="PIRACICABA">PIRACICABA</option>
                                <option value="SANTA BARBARA">SANTA BARBARA</option>
                                <option value="RIO CLARO">RIO CLARO</option>
                            </select>
                        </div>

                        {/* Client */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <User size={16} className="mr-2" /> Cliente
                            </label>
                            <input
                                type="text"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="Nome do Cliente / Obra"
                                value={formData.client}
                                onChange={e => setFormData({ ...formData, client: e.target.value })}
                            />
                        </div>

                        {/* Volume */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Droplet size={16} className="mr-2" /> Volume (m³)
                            </label>
                            <input
                                type="number"
                                required
                                min="0"
                                step="0.5"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                placeholder="0.0"
                                value={formData.volume}
                                onChange={e => setFormData({ ...formData, volume: e.target.value })}
                            />
                        </div>

                        {/* Pump Type */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Truck size={16} className="mr-2" /> Tipo de Descarga
                            </label>
                            <select
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.pumpType}
                                onChange={e => setFormData({ ...formData, pumpType: e.target.value })}
                            >
                                <option value="CONVENCIONAL">Convencional</option>
                                <option value="BOMBEADO">Bombeado</option>
                                <option value="LANÇA">Lança</option>
                            </select>
                        </div>

                        {/* Date */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <Calendar size={16} className="mr-2" /> Data da Concretagem
                            </label>
                            <input
                                type="date"
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                value={formData.concreteDate}
                                onChange={e => setFormData({ ...formData, concreteDate: e.target.value })}
                            />
                        </div>

                        {/* Notes */}
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <FileText size={16} className="mr-2" /> Observações
                            </label>
                            <textarea
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-24"
                                placeholder="Detalhes adicionais..."
                                value={formData.notes}
                                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-lg shadow-blue-600/20"
                        >
                            Enviar Solicitação
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PreSchedule;
