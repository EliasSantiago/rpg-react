import { useState } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const router = useRouter();
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // API Base URL configurada nas variáveis de ambiente

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!apiBaseUrl) {
      toast.error('URL da API não configurada');
      return;
    }

    const response = await fetch(`${apiBaseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Login bem-sucedido:', data);
      localStorage.setItem('token', data.token); // Armazena o token no localStorage
      router.push('/users');
    } else {
      const errorData = await response.json();
      console.error('Erro no login:', errorData);
      toast.error(`Erro: ${errorData.message || 'Email ou senha inválidos!'}`);
    }
  };

  const handleRegister = () => {
    router.push('/register'); // Redireciona para a página de cadastro
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white py-12 px-6 sm:px-12">
      <div className="max-w-md mx-auto">
        <div className="bg-gray-800 rounded-lg p-8">
          <h2 className="text-3xl font-extrabold text-center mb-6">Login</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-400">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-2 p-3 w-full bg-gray-700 text-white border border-gray-700 rounded-lg"
                required
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-400">Senha</label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-2 p-3 w-full bg-gray-700 text-white border border-gray-700 rounded-lg"
                required
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
              >
                Entrar
              </button>
            </div>
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={handleRegister}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              >
                Cadastre-se
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Login;
