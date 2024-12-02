import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import API_BASE_URL from '../../config';

interface RPGClass {
  id: number;
  name: string;
}

export interface User { // Garantir que a interface está correta
  id: number;
  name: string;
  email: string;
  xp: number;
  created_at: string;
  confirmed: boolean;
  rpg_class: RPGClass;
}

const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Verifica token no localStorage assim que o componente é montado
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      router.push('/login');
      return;
    }

    // Faz a requisição de usuários após verificar o token
    const fetchUsers = async () => {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data); // Atualiza estado com a lista de usuários
      } else {
        console.error('Erro ao buscar usuários');
      }
    };

    fetchUsers();
  }, [router]);

  // Função para confirmar todos os usuários
  const confirmAllUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/users/confirm-all`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ confirmed: 1 }),
      });

      if (response.ok) {
        setUsers(prevUsers => prevUsers.map(user => ({ ...user, confirmed: true })));
      } else {
        console.error('Erro ao confirmar todos os usuários');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para confirmar um usuário específico
  const confirmUser = async (id: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/users/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ confirmed: true }),
      });

      if (response.ok) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === id ? { ...user, confirmed: true } : user
          )
        );
      } else {
        console.error('Erro ao confirmar usuário');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold">Usuários</h1>
          <button
            onClick={confirmAllUsers}
            className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Confirmando...' : 'Confirmar Todos'}
          </button>
        </div>

        {/* Tabela de usuários */}
        <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">XP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Classe</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Data de Criação</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {users.map(user => (
                <tr key={user.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.xp}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{user.rpg_class.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {user.confirmed ? (
                      <span className="text-green-500">Confirmado</span>
                    ) : (
                      <button
                        onClick={() => confirmUser(user.id)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Confirmar
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Users;
