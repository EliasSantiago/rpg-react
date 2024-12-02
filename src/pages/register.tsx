import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');
    const [rpgClassId, setRpgClassId] = useState(1); // Você pode ajustar essa classe de RPG conforme necessário
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Usando a variável de ambiente para a base URL

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!apiBaseUrl) {
            toast.error('API base URL não configurada');
            return;
        }

        const payload = {
            name,
            email,
            password,
            password_confirmation: passwordConfirmation,
            rpg_class_id: rpgClassId,
        };

        try {
            const response = await fetch(`${apiBaseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                toast.success('Cadastro realizado com sucesso');
                router.push('/login'); // Redireciona para a página de login
            } else {
                const errorData = await response.json();
                toast.error(errorData.message || 'Erro ao realizar o cadastro');
            }
        } catch (error) {
            toast.error('Erro ao realizar o cadastro');
        }
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-6 sm:px-12">
            <div className="max-w-md mx-auto">
                <div className="bg-gray-800 rounded-lg p-8">
                    <h2 className="text-3xl font-extrabold mb-6">Cadastro</h2>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium">
                                Nome
                            </label>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="mt-2 w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                E-mail
                            </label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="mt-2 w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Senha
                            </label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="mt-2 w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium">
                                Confirmação de Senha
                            </label>
                            <input
                                type="password"
                                id="password_confirmation"
                                value={passwordConfirmation}
                                onChange={(e) => setPasswordConfirmation(e.target.value)}
                                className="mt-2 w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="rpg_class_id" className="block text-sm font-medium">
                                Classe de RPG
                            </label>
                            <select
                                id="rpg_class_id"
                                value={rpgClassId}
                                onChange={(e) => setRpgClassId(Number(e.target.value))}
                                className="mt-2 w-full px-4 py-2 bg-gray-700 text-white rounded-lg"
                            >
                                {/* Ajuste conforme as classes de RPG disponíveis */}
                                <option value={1}>Guerreiro</option>
                                <option value={2}>Mago</option>
                                <option value={3}>Arqueiro</option>
                                <option value={3}>Clérigo</option>
                            </select>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Criar Conta
                            </button>
                        </div>
                        <div className="mt-4 text-center">
                            <button
                                type="button"
                                onClick={handleLogin}
                                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
                            >
                                Já tenho conta!
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default Register;
