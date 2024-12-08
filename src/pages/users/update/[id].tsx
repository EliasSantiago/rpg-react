import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import API_BASE_URL from '../../../../config';

interface RPGClass {
  id: number;
  name: string;
}

export interface User {
  id: number;
  name: string;
  xp: number;
  rpg_class_id: number;
  rpg_class: RPGClass;
}

const UpdateUser = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<User | null>(null);
  const [rpgClasses, setRpgClasses] = useState<RPGClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    xp: 0,
    rpg_class_id: 0,
  });

  useEffect(() => {
    if (id) {
      fetchUserData(Number(id));
      fetchRPGClasses();
    }
  }, [id]);

  const fetchUserData = async (userId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      router.push('/login');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      setUser(response.data);
      setFormData({
        name: response.data.name,
        xp: response.data.xp,
        rpg_class_id: response.data.rpg_class_id,
      });
    } catch (error) {
      console.error('Erro ao carregar os dados do usuário', error);
      setError('Erro ao carregar os dados do usuário');
    }
  };

  const fetchRPGClasses = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token não encontrado no localStorage');
      return;
    }

    try {
      const response = await axios.get(`${API_BASE_URL}/classes`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      setRpgClasses(response.data.data);
    } catch (error) {
      console.error('Erro ao carregar as classes de RPG', error);
      setError('Erro ao carregar as classes de RPG');
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
      console.error('Token não encontrado no localStorage');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.put(
        `${API_BASE_URL}/users/${id}`,
        formData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      toast.success(`Usuário atualizado com sucesso.`);
      router.push('/users');
    } catch (error) {
      console.error('Erro ao atualizar o usuário', error);
      setError('Erro ao atualizar o usuário');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/users');
  };

  if (!user) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <div>Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold mb-6">Editar Usuário</h1>
        {error && <div className="bg-red-500 text-white p-4 rounded mb-4">{error}</div>}
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
            <label htmlFor="xp" className="block text-sm font-medium text-gray-300">
              XP
            </label>
            <input
              type="number"
              id="xp"
              name="xp"
              value={formData.xp}
              onChange={handleInputChange}
              className="mt-1 px-4 py-2 w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="rpg_class_id" className="block text-sm font-medium text-gray-300">
              Classe de RPG
            </label>
            <select
              id="rpg_class_id"
              name="rpg_class_id"
              value={formData.rpg_class_id}
              onChange={handleInputChange}
              className="mt-1 px-4 py-2 w-full bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {rpgClasses.map((rpgClass) => (
                <option key={rpgClass.id} value={rpgClass.id}>
                  {rpgClass.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-between space-x-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? 'Atualizando...' : 'Atualizar Usuário'}
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

export default UpdateUser;
