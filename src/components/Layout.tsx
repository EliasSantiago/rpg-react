// components/Layout.tsx
import React from 'react';
import Menu from './Menu';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="bg-gradient-to-b from-indigo-900 via-purple-800 to-black min-h-screen text-white">
      <Menu />

      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12">{children}</div>
      </main>

      <footer className="bg-gray-900 bg-opacity-80 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-12 text-center text-sm">
          <p>RPG</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
