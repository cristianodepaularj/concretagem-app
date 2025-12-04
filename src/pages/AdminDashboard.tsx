import { useState } from 'react';
import { useData } from '../context/DataContext';
import { TrendingUp, Filter, Edit } from 'lucide-react';

export const AdminDashboard = () => {
    const { orders, branches } = useData();
    const [startDate, setStartDate] = useState('2025-12-01');
    const [endDate, setEndDate] = useState('2025-12-06');

    // Filter Logic
    const filteredOrders = orders.filter(o => {
        const orderDate = new Date(o.dateRequest); // Using request date for report as per screenshot likely
        const start = new Date(startDate);
        const end = new Date(endDate);
        return orderDate >= start && orderDate <= end;
    });

    const totalVolume = filteredOrders.reduce((acc, curr) => acc + curr.volume, 0);
    const totalCount = filteredOrders.length;
    const averageVolume = totalCount > 0 ? Math.round(totalVolume / totalCount) : 0;

    // Chart Data (Mocking visually with HTML/CSS for now as no Chart lib installed)
    const volumeByBranch = branches.map(branch => {
        const volume = filteredOrders
            .filter(o => o.branch === branch.name)
            .reduce((acc, curr) => acc + curr.volume, 0);
        return { name: branch.name, volume };
    });

    const maxVolume = Math.max(...volumeByBranch.map(v => v.volume), 1);

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <h1 className="text-xl font-bold text-gray-700 mb-4 uppercase">Dashboard Filtro</h1>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-0">
                {/* Left Panel: Filter & Report Table */}
                <div className="lg:col-span-5 flex flex-col gap-6">
                    {/* Filter Section */}
                    <div className="bg-white rounded-lg shadow border border-gray-200 p-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-gray-700">FILTRO</h2>
                            <div className="flex space-x-2">
                                <button className="p-1 text-gray-400 hover:text-blue-600"><Filter size={18} /></button>
                                <button className="p-1 text-gray-400 hover:text-blue-600"><Edit size={18} /></button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Inicio</label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 text-sm mt-1"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Fim</label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={e => setEndDate(e.target.value)}
                                    className="w-full border border-gray-300 rounded p-2 text-sm mt-1"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Volume</label>
                                    <div className="flex items-center text-green-600 font-bold text-xl">
                                        <TrendingUp size={20} className="mr-1" />
                                        {totalVolume}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 uppercase">Quantidade</label>
                                    <div className="flex items-center text-blue-600 font-bold text-xl">
                                        <Filter size={20} className="mr-1" />
                                        {totalCount}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-500 uppercase">Media</label>
                                <div className="flex items-center justify-between border border-gray-300 rounded p-2 mt-1">
                                    <span className="font-bold text-gray-700"># {averageVolume}</span>
                                    <div className="flex space-x-2">
                                        <button className="text-gray-400 hover:text-gray-600">-</button>
                                        <button className="text-gray-400 hover:text-gray-600">+</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Report Table Section */}
                    <div className="bg-white rounded-lg shadow border border-gray-200 flex-1 flex flex-col min-h-0">
                        <div className="p-3 border-b border-gray-200">
                            <h2 className="font-semibold text-gray-700 text-sm uppercase">Relatorio</h2>
                        </div>
                        <div className="overflow-auto flex-1">
                            <table className="w-full text-xs text-left">
                                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                                    <tr>
                                        <th className="p-2">DATA SOLICITACAO</th>
                                        <th className="p-2">ID PEDIDO</th>
                                        <th className="p-2">STATUS</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredOrders.map(order => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="p-2">{new Date(order.dateRequest).toLocaleDateString('pt-BR')}</td>
                                            <td className="p-2 flex items-center gap-1">
                                                {order.status === 'Approved' && <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>}
                                                {order.status}
                                            </td>
                                            <td className="p-2">{order.status.substring(0, 4).toUpperCase()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Chart */}
                <div className="lg:col-span-7 bg-white rounded-lg shadow border border-gray-200 p-6 flex flex-col">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="font-semibold text-gray-700 uppercase">Gráfico</h2>
                        <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm flex items-center gap-1">
                            + Add
                        </button>
                    </div>

                    <div className="flex-1 flex items-end justify-around space-x-4 pb-6 border-b border-gray-200 min-h-[300px]">
                        {volumeByBranch.map(branch => {
                            // Use pixel heights: min 40px, max 240px
                            const heightPx = branch.volume > 0
                                ? Math.max(40, Math.min(240, (branch.volume / maxVolume) * 240))
                                : 0;

                            return (
                                <div key={branch.name} className="flex flex-col items-center justify-end w-full group">
                                    {branch.volume > 0 && (
                                        <>
                                            <div className="text-xs font-bold text-gray-600 mb-1">
                                                {branch.volume}
                                            </div>
                                            <div
                                                className="w-full max-w-[80px] bg-green-500 rounded-t transition-all duration-500 group-hover:bg-green-600"
                                                style={{ height: `${heightPx}px` }}
                                            />
                                        </>
                                    )}
                                    <span className="text-xs text-gray-500 mt-2 transform -rotate-45 origin-top-left translate-y-4 whitespace-nowrap">
                                        {branch.name}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
