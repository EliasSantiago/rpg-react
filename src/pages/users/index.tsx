import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import API_BASE_URL from '../../../config';
import { FaTimes } from 'react-icons/fa';

interface RPGClass {
  id: number;
  name: string;
}

export interface User {
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      router.push('/login');
      return;
    }

    const fetchUsers = async () => {
      setIsLoading(true);

      try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
        setUsers(response.data.data);
      } catch (error) {
        toast.error('Erro ao buscar usuários');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [router]);

  const updateUserConfirmation = async (id: number, confirmed: boolean) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.patch(
        `${API_BASE_URL}/users/change-confirmation/${id}`,
        { confirmed },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUsers(prevUsers =>
          prevUsers.map(user =>
            user.id === id ? { ...user, confirmed } : user
          )
        );
        toast.success(`Usuário ${confirmed ? 'confirmado' : 'desconfirmado'} com sucesso.`);
      } else {
        toast.error(`Erro ao ${confirmed ? 'confirmar' : 'desconfirmar'} usuário`);
      }
    } catch (error) {
      toast.error('Erro ao atualizar a confirmação do usuário');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmAllUsers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/change-confirmation-all`,
        { confirmed: 1 },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUsers(prevUsers => prevUsers.map(user => ({ ...user, confirmed: true })));
        toast.success('Todos os usuários foram confirmados com sucesso.');
      } else {
        toast.error('Erro ao confirmar todos os usuários');
      }
    } catch (error) {
      toast.error('Erro ao confirmar todos os usuários');
    } finally {
      setLoading(false);
    }
  };

  const disconfirmAllUsers = async () => {
    setLoading(true);

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/change-confirmation-all`,
        { confirmed: 0 },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setUsers(prevUsers => prevUsers.map(user => ({ ...user, confirmed: false })));
        toast.success('Todos os usuários foram desconfirmados com sucesso.');
      } else {
        toast.error('Erro ao desconfirmar todos os usuários');
      }
    } catch (error) {
      toast.error('Erro ao desconfirmar todos os usuários');
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: number) => {

    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    try {
      const response = await axios.delete(`${API_BASE_URL}/users/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setUsers(prevUsers => prevUsers.filter(user => user.id !== id));
        toast.success('Usuário deletado com sucesso.');
      } else {
        toast.error('Erro ao deletar usuário');
      }
    } catch (error) {
      toast.error('Erro ao deletar usuário');
    }
  };

  const editUser = (id: number) => {
    router.push(`/users/update/${id}`);
  };

  const viewUser = (id: number) => {
    const user = users.find(u => u.id === id);
    if (user) {
      setSelectedUser(user);
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold">Usuários</h1>
          <div className="flex space-x-2">
            <button
              onClick={confirmAllUsers}
              className={`bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Confirmando...' : 'Confirmar Todos'}
            </button>
            <button
              onClick={disconfirmAllUsers}
              className={`bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Desconfirmando...' : 'Desconfirmar Todos'}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50 z-50 backdrop-blur-sm">
            <div className="w-64 h-2 bg-gray-300 rounded-full overflow-hidden">
              <div className="h-full bg-lime-500 animate-widening"></div>
            </div>
          </div>
        ) : null}

        <div className="overflow-x-auto bg-gray-800 shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Nome</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">XP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase">Classe</th>
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
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    {user.confirmed ? (
                      <button
                        onClick={() => updateUserConfirmation(user.id, false)}
                        className="bg-orange-400 text-white px-4 py-2 rounded hover:bg-orange-600"
                      >
                        Desconfirmar
                      </button>
                    ) : (
                      <button
                        onClick={() => updateUserConfirmation(user.id, true)}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      >
                        Confirmar
                      </button>
                    )}
                    <button
                      onClick={() => deleteUser(user.id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Deletar
                    </button>
                    <button
                      onClick={() => editUser(user.id)}
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => viewUser(user.id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Visualizar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 backdrop-blur-sm">
          <div className="bg-gray-800 rounded-lg p-8 max-w-lg w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold">Detalhes do Usuário</h3>
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
                  <th className="py-2 px-4">Campo</th>
                  <th className="py-2 px-4">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-4"><strong>Nome</strong></td>
                  <td className="py-2 px-4">{selectedUser.name}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-4"><strong>Email</strong></td>
                  <td className="py-2 px-4">{selectedUser.email}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-4"><strong>XP</strong></td>
                  <td className="py-2 px-4">{selectedUser.xp}</td>
                </tr>
                <tr className="border-b border-gray-700">
                  <td className="py-2 px-4"><strong>Classe</strong></td>
                  <td className="py-2 px-4">{selectedUser.rpg_class.name}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Users;
