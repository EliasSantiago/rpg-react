import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const CreateGuild = () => {
  const [guild, setGuild] = useState({
    name: '',
    description: '',
    max_players: 10,
    leader_id: 1,
  });

  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGuild({ ...guild, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      console.error('Token não encontrado');
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      console.error('URL da API não configurada');
      return;
    }

    const response = await fetch(`${apiBaseUrl}/guilds`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(guild),
    });

    if (response.ok) {
      const data = await response.json();
      router.push('/guildas');
    } else {
      console.error('Erro ao criar guilda');
    }
  };

  const handleCancel = () => {
    router.push('/guildas');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10">Criar Guilda</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Nome da Guilda</label>
            <input
              id="name"
              name="name"
              type="text"
              value={guild.name}
              onChange={handleChange}
              className="mt-1 px-4 py-2 w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-400">Descrição</label>
            <input
              id="description"
              name="description"
              type="text"
              value={guild.description}
              onChange={handleChange}
              className="t-1 px-4 py-2 w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="max_players" className="block text-sm font-medium text-gray-400">Máximo de Jogadores</label>
            <input
              id="max_players"
              name="max_players"
              type="number"
              value={guild.max_players}
              onChange={handleChange}
              className="t-1 px-4 py-2 w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              className="w-1/2 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Criar Guilda
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="w-1/2 py-2 px-4 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGuild;
