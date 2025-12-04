import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Plus, Trash2, Phone, Mail, Shield, Loader } from 'lucide-react';
import type { Role, User } from '../types';

export const AdminUsers = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'consultant' as Role,
        phone: '',
        branch: ''
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const { data, error } = await supabase
                .from('users')
                .select('*');

            if (error) throw error;
            setUsers(data || []);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    const addUser = async (userData: any) => {
        // Note: Creating a user in Supabase Auth usually requires admin API or calling a function.
        // For this demo, we will just insert into the public.users table.
        // In a real app, you'd want to create the Auth user too.
        try {
            const newUser = {
                id: crypto.randomUUID(), // Generate a random ID since we aren't creating an Auth user here
                ...userData
            };

            const { error } = await supabase
                .from('users')
                .insert([newUser]);

            if (error) throw error;

            setUsers([...users, newUser]);
            alert('Usuário adicionado! (Nota: Para login real, o usuário precisa se registrar ou ser criado no Auth)');
        } catch (error) {
            console.error('Error adding user:', error);
            alert('Erro ao adicionar usuário');
        }
    };

    const deleteUser = async (id: string) => {
        if (!confirm('Tem certeza que deseja excluir este usuário?')) return;

        try {
            const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', id);

            if (error) throw error;
            setUsers(users.filter(u => u.id !== id));
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Erro ao excluir usuário');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addUser(formData);
        setIsModalOpen(false);
        setFormData({ name: '', email: '', role: 'consultant', phone: '', branch: '' });
    };

    if (loading) return <div className="flex justify-center p-8"><Loader className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                >
                    <Plus size={20} />
                    <span>Novo Usuário</span>
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-200">
                            <tr>
                                <th className="px-6 py-4 font-medium text-gray-500">Nome</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Email</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Função</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Telefone</th>
                                <th className="px-6 py-4 font-medium text-gray-500">Filial</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                                    <td className="px-6 py-4 text-gray-500">
                                        <div className="flex items-center space-x-2">
                                            <Mail size={14} />
                                            <span>{user.email}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                            }`}>
                                            <Shield size={12} className="mr-1" />
                                            {user.role === 'admin' ? 'Admin' : 'Consultor'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {user.phone && (
                                            <div className="flex items-center space-x-2">
                                                <Phone size={14} />
                                                <span>{user.phone}</span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">{user.branch || '-'}</td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => deleteUser(user.id)}
                                            className="text-red-400 hover:text-red-600 p-1 transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold text-gray-900 mb-4">Cadastrar Usuário</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                <input
                                    type="email"
                                    required
                                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    value={formData.email}
                                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.role}
                                        onChange={e => setFormData({ ...formData, role: e.target.value as Role })}
                                    >
                                        <option value="consultant">Consultor</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                    <input
                                        type="text"
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.phone}
                                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                            {formData.role === 'consultant' && (
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Filial</label>
                                    <select
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        value={formData.branch}
                                        onChange={e => setFormData({ ...formData, branch: e.target.value })}
                                    >
                                        <option value="">Selecione...</option>
                                        <option value="PIRACICABA">PIRACICABA</option>
                                        <option value="SANTA BARBARA">SANTA BARBARA</option>
                                        <option value="RIO CLARO">RIO CLARO</option>
                                    </select>
                                </div>
                            )}

                            <div className="flex space-x-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
                                >
                                    Salvar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
