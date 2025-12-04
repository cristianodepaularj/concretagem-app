import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Lock, Loader } from 'lucide-react';

export const Login = () => {
    const { loginWithPassword, signUp, user } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [isRegister, setIsRegister] = useState(false);

    useEffect(() => {
        if (user) {
            navigate('/calendar');
        }
    }, [user, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        try {
            if (isRegister) {
                await signUp(email, password);
                setMessage('Cadastro realizado! Verifique seu email para confirmar.');
            } else {
                await loginWithPassword(email, password);
            }
        } catch (error: any) {
            console.error(error);
            setMessage(error.message || 'Erro ao fazer login. Verifique suas credenciais.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                <div className="bg-blue-600 p-8 text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="text-white" size={32} />
                    </div>
                    <h1 className="text-2xl font-bold text-white">Concretagem App</h1>
                    <p className="text-blue-100 mt-2">Faça login para continuar</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                                placeholder="seu@email.com"
                                required
                            />
                        </div>

                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.includes('Erro') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                {message}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? <Loader className="animate-spin" size={20} /> : <User size={20} />}
                            <span>{loading ? 'Enviando...' : 'Entrar com Email'}</span>
                        </button>

                        <p className="text-xs text-center text-gray-400 mt-4">
                            Será redirecionado para: {window.location.origin}
                        </p>
                    </form>
                </div>
            </div>
        </div>
    );
};
