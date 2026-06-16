import logo from '../assets/logo1.png';

/**
 * Barra de navegação principal da aplicação.
 * Exibe a logo do sistema sobre o azul escuro da marca.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-primary-dark shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center px-4 sm:px-8">
        <img src={logo} alt="TecFix" className="h-9 w-auto" />
      </div>
    </header>
  );
}
