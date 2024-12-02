import { useState } from 'react';
import { useRouter } from 'next/router';
import { ToastContainer, toast } from 'react-toastify';

const CreateClass = () => {
  const [classData, setClassData] = useState({
    name: '',
  });

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setClassData({ ...classData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      toast.error('Token de autenticação não encontrado');
      return;
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    if (!apiBaseUrl) {
      toast.error('URL da API não configurada');
      return;
    }

    const response = await fetch(`${apiBaseUrl}/classes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(classData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Classe criada:', data);
      toast.success('Classe criada com sucesso!');
      router.push('/rpg-class');
    } else {
      const errorData = await response.json();
      console.error('Erro ao criar classe:', errorData);
      toast.error(`Erro: ${errorData.message || 'Algo deu errado!'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center mb-10">Criar Classe</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-400">Nome da Classe</label>
            <input
              id="name"
              name="name"
              type="text"
              value={classData.name}
              onChange={handleChange}
              className="mt-2 p-3 w-full bg-gray-800 text-white border border-gray-700 rounded-md"
            />
          </div>
          <div className="flex space-x-4">
            <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">
              Criar Classe
            </button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CreateClass;
