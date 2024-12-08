// src/components/Menu.tsx
import Link from 'next/link';

const Menu = () => {
  return (
    <nav className="bg-gray-900 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <ul className="flex space-x-8 justify-center">
          <li>
            <Link href="/users" className="text-lg hover:text-gray-400">Usuários</Link>
          </li>
          <li>
            <Link href="/guildas" className="text-lg hover:text-gray-400">Guildas</Link>
          </li>
          <li>
            <Link href="/rpg-class" className="text-lg hover:text-gray-400">Classes</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Menu;
