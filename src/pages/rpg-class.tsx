import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface RPGClass {
    id: number;
    name: string;
}

const RPGClasses = () => {
    const [classes, setClasses] = useState<RPGClass[]>([]);
    const router = useRouter();
    const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL; // Usando a variável de ambiente para a base URL

    useEffect(() => {
        async function fetchClasses() {
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Token de autenticação não encontrado');
                return;
            }

            if (!apiBaseUrl) {
                toast.error('API base URL não configurada');
                return;
            }

            const response = await fetch(`${apiBaseUrl}/classes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setClasses(data.data);
            } else {
                toast.error('Erro ao buscar classes');
            }
        }

        fetchClasses();
    }, [apiBaseUrl]);

    const createClass = () => {
        router.push('/create-class');
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12 px-6 sm:px-12">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-extrabold">Classes de RPG</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={createClass}
                            className="bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
                        >
                            Criar Classe
                        </button>
                    </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {classes.map((rpgClass) => (
                        <div key={rpgClass.id} className="bg-gray-800 rounded-lg p-6 space-y-4">
                            <h3 className="text-2xl font-semibold">{rpgClass.name}</h3>
                        </div>
                    ))}
                </div>
            </div>

            <ToastContainer />
        </div>
    );
};

export default RPGClasses;
