import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import API_BASE_URL from '../../../../config';

export interface User {
    id: number;
    name: string;
}

export interface Guild {
    id: number;
    name: string;
    description: string;
    max_players: number;
    leader_id: number;
    users: User[];
}

const UpdateGuild = () => {
    const router = useRouter();
    const { id } = router.query;

    const [guild, setGuild] = useState<Guild | null>(null);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        max_players: 0,
        leader_id: 0,
    });

    useEffect(() => {
        if (id) {
            fetchGuildData(Number(id));
            fetchUsers();
        }
    }, [id]);

    const fetchGuildData = async (guildId: number) => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Token não encontrado no localStorage');
            router.push('/login');
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/guilds/${guildId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setGuild(response.data);
            setFormData({
                name: response.data.name,
                description: response.data.description,
                max_players: response.data.max_players,
                leader_id: response.data.leader_id,
            });
        } catch (error) {
            console.error('Erro ao carregar os dados da guilda', error);
            toast.error('Erro ao carregar os dados da guilda');
        }
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Token não encontrado no localStorage');
            return;
        }

        try {
            const response = await axios.get(`${API_BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            setUsers(response.data.data);
        } catch (error) {
            console.error('Erro ao carregar os usuários', error);
            toast.error('Erro ao carregar os usuários');
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('Token não encontrado no localStorage');
            return;
        }

        setLoading(true);
        try {
            await axios.put(`${API_BASE_URL}/guilds/${id}`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
            toast.success('Guilda atualizada com sucesso.');
            router.push('/guildas');
        } catch (error: any) {
            const errorMessage =
                error.response?.data?.message || 'Erro ao atualizar a guilda.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        router.push('/guildas');
    };

    if (!guild) {
        return (
            <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
                <div>Carregando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-6 sm:px-12">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl font-extrabold mb-6">Editar Guilda</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                            Nome
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="mt-1 px-4 py-2 w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-300">
                            Descrição
                        </label>
                        <input
                            type="text"
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            className="mt-1 px-4 py-2 w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="max_players" className="block text-sm font-medium text-gray-300">
                            Máximo de Jogadores
                        </label>
                        <input
                            type="number"
                            id="max_players"
                            name="max_players"
                            value={formData.max_players}
                            onChange={handleInputChange}
                            className="mt-1 px-4 py-2 w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="leader_id" className="block text-sm font-medium text-gray-300">
                            Líder
                        </label>
                        <select
                            id="leader_id"
                            name="leader_id"
                            value={formData.leader_id}
                            onChange={handleInputChange}
                            className="mt-1 px-4 py-2 w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Selecione um líder</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex justify-between space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-1/2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        >
                            {loading ? 'Atualizando...' : 'Atualizar Guilda'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="w-1/2 py-2 px-4 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UpdateGuild;
