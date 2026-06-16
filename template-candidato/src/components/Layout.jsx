import { Outlet } from 'react-router-dom';
import Header from './Header';

/**
 * Estrutura raiz da aplicação: header de navegação + área de conteúdo.
 * As páginas das rotas são renderizadas no <Outlet />.
 */
export default function Layout() {
  return (
    <div className="min-h-screen bg-surface">
      <Header />
      <div className="flex justify-center px-4 py-8 sm:px-8">
      <main className="w-full max-w-5xl">
        <Outlet />
      </main>
      </div>
    </div>
  );
}
