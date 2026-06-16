import { NavLink } from 'react-router-dom';
import logo from '../assets/logo1.png';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/clientes', label: 'Clientes' },
  { to: '/ordens', label: 'Ordens de Serviço' },
];

const linkClass = ({ isActive }) =>
  `text-sm font-semibold transition-colors ${
    isActive ? 'text-accent' : 'text-white/80 hover:text-white'
  }`;

/**
 * Barra de navegação principal da aplicação.
 * Exibe a logo do sistema e os links entre as seções sobre o azul escuro da marca.
 */
export default function Header() {
  return (
    <header className="sticky top-0 z-10 bg-primary-dark shadow-sm">
      <div className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-8">
        <NavLink to="/" end>
          <img src={logo} alt="TecFix" className="h-9 w-auto" />
        </NavLink>

        <nav className="flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
