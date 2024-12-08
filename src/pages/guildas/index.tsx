import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';

interface RPGClass {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    xp: number;
    rpg_class: RPGClass;
}

interface Guild {
    id: number;
    name: string;
    description: string;
    max_players: number;
    created_at: string;
    users: User[];
}

const Guilds = () => {
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [selectedGuild, setSelectedGuild] = useState<Guild | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [token, setToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedToken = localStorage.getItem('token');
            if (storedToken) {
                setToken(storedToken);
            }
        }
    }, []);

    const fetchGuilds = async () => {
        if (!token) {
            toast.error('Token não encontrado');
            return;
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
            toast.error('URL da API não configurada');
            return;
        }

        try {
            const response = await axios.get(`${apiBaseUrl}/guilds`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            setGuilds(response.data.data);
        } catch (error) {
            toast.error('Erro ao buscar guildas');
        }
    };

    useEffect(() => {
        if (token) {
            fetchGuilds();
        }
    }, [token]);

    const openModal = (guild: Guild) => {
        setSelectedGuild(guild);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedGuild(null);
    };

    const createGuild = () => {
        router.push('/guildas/criar');
    };

    const balanceGuilds = async () => {
        if (!token) {
            toast.error('Token não encontrado');
            return;
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
            toast.error('URL da API não configurada');
            return;
        }

        try {
            const response = await axios.get(`${apiBaseUrl}/guilds/balance`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            const message = response.data?.message || 'Guildas balanceadas com sucesso';

            toast.success(message);

            await fetchGuilds();
        } catch (error) {
            toast.error('Erro ao balancear guildas');
        }
    };

    const removeUserFromGuild = async (userId: number, guildId: number) => {
        if (!token) {
            toast.error('Token não encontrado');
            return;
        }

        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

        if (!apiBaseUrl) {
            toast.error('URL da API não configurada');
            return;
        }

        try {
            await axios.delete(`${apiBaseUrl}/guilds/${guildId}/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            setGuilds((prevGuilds) =>
                prevGuilds.map((guild) =>
                    guild.id === guildId
                        ? {
                            ...guild,
                            users: guild.users.filter((user) => user.id !== userId),
                        }
                        : guild
                )
            );

            setSelectedGuild((prevSelectedGuild) => {
                if (prevSelectedGuild && prevSelectedGuild.id === guildId) {
                    return {
                        ...prevSelectedGuild,
                        users: prevSelectedGuild.users.filter((user) => user.id !== userId),
                    };
                }
                return prevSelectedGuild;
            });

            toast.success('Usuário removido da guilda com sucesso');
        } catch (error) {
            toast.error('Erro ao remover o usuário da guilda');
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-6 sm:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-extrabold">Guildas</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={createGuild}
                            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Criar Guilda
                        </button>
                        <button
                            onClick={balanceGuilds}
                            className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
                        >
                            Balancear Guildas
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {guilds.map((guild) => {
                        const totalXP = guild.users.reduce((acc, user) => acc + user.xp, 0);

                        return (
                            <div key={guild.id} className="bg-gray-800 rounded-lg p-6 space-y-4 transition transform hover:scale-105">
                                <h3 className="text-2xl font-semibold">{guild.name}</h3>
                                <p>{guild.description}</p>
                                <div className="flex items-center justify-between">
                                    <span className="px-4 py-1 bg-gray-500 text-white rounded-full text-sm shadow-md">
                                        Jogadores: {guild.users.length} / {guild.max_players}
                                    </span>
                                    <span className="px-4 py-1 bg-green-600 text-white rounded-full text-sm shadow-md">
                                        XP Total: {totalXP}
                                    </span>
                                </div>
                                <button
                                    onClick={() => openModal(guild)}
                                    className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                                >
                                    Ver Jogadores
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {isModalOpen && selectedGuild && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-semibold">Jogadores de {selectedGuild.name}</h3>
                            <button
                                onClick={closeModal}
                                className="bg-gray-600 text-white p-2 rounded-full hover:bg-gray-700 transition focus:outline-none"
                            >
                                <FaTimes className="text-2xl" />
                            </button>
                        </div>
                        <table className="min-w-full table-auto text-sm">
                            <thead>
                                <tr className="text-left border-b border-gray-700">
                                    <th className="py-2 px-4">Jogador</th>
                                    <th className="py-2 px-4">XP</th>
                                    <th className="py-2 px-4">Classe</th>
                                    <th className="py-2 px-4">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedGuild.users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-700">
                                        <td className="py-2 px-4">{user.name}</td>
                                        <td className="py-2 px-4">{user.xp}</td>
                                        <td className="py-2 px-4">{user.rpg_class.name}</td>
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => removeUserFromGuild(user.id, selectedGuild.id)}
                                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                                            >
                                                Remover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
};

export default Guilds;
