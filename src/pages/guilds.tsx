import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    useEffect(() => {
        async function fetchGuilds() {
            if (!token) {
                toast.error('Token não encontrado');
                return;
            }

            const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

            if (!apiBaseUrl) {
                toast.error('URL da API não configurada');
                return;
            }

            const response = await fetch(`${apiBaseUrl}/guilds`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setGuilds(data.data);
            } else {
                toast.error('Erro ao buscar guildas');
            }
        }
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
        router.push('/create-guild');
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
            const response = await fetch(`${apiBaseUrl}/guilds/balance`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                toast.success(data.message);
            } else {
                toast.error('Erro ao balancear guildas');
            }
        } catch {
            toast.error('Erro ao balancear guildas');
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
                    {guilds.map((guild) => (
                        <div key={guild.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
                            <h3 className="text-2xl font-semibold">{guild.name}</h3>
                            <p>{guild.description}</p>
                            <p className="text-sm text-gray-400">Jogadores: {guild.users.length}</p>
                            <button
                                onClick={() => openModal(guild)}
                                className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                            >
                                Ver Jogadores
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            {isModalOpen && selectedGuild && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
                    <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-2xl font-semibold">Jogadores de {selectedGuild.name}</h3>
                            <button
                                onClick={closeModal}
                                className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
                            >
                                Fechar
                            </button>
                        </div>
                        <table className="min-w-full table-auto text-sm">
                            <thead>
                                <tr className="text-left border-b border-gray-700">
                                    <th className="py-2 px-4">Jogador</th>
                                    <th className="py-2 px-4">XP</th>
                                    <th className="py-2 px-4">Classe</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selectedGuild.users.map((user) => (
                                    <tr key={user.id} className="border-b border-gray-700">
                                        <td className="py-2 px-4">{user.name}</td>
                                        <td className="py-2 px-4">{user.xp}</td>
                                        <td className="py-2 px-4">{user.rpg_class.name}</td>
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
