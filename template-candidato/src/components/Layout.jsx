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
      <main className="mx-auto w-full max-w-5xl p-4 sm:p-8">
        <Outlet />
      </main>
    </div>
  );
}
