import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, Moon, Sun, X } from 'lucide-react';
import logo from '../assets/logo1.png';
import { useTheme } from '../contexts/ThemeContext';

const navItems = [
  { to: '/', label: 'Dashboard', end: true },
  { to: '/clientes', label: 'Clientes' },
  { to: '/ordens', label: 'Ordens de Serviço' },
];

const linkClass = ({ isActive }) =>
  `cursor-pointer text-sm font-semibold transition-colors ${
    isActive ? 'text-accent' : 'text-white/80 hover:text-white'
  }`;

/**
 * Barra de navegação principal da aplicação.
 * Logo + links entre seções; em telas pequenas a navegação vira menu hambúrguer.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-10 bg-primary-dark shadow-sm">
      <div className="flex justify-center px-6 sm:px-12">
      <div className="flex h-16 w-full max-w-5xl items-center justify-between">
        <NavLink to="/" end onClick={() => setOpen(false)}>
          <span className="logo-container flex items-center rounded-xl bg-white px-3 py-1 shadow-md">
            <img src={logo} alt="TecFix" className="h-11 w-auto" />
          </span>
        </NavLink>

        {/* Navegação desktop */}
        <nav className="hidden items-center gap-6 sm:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={linkClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {/* Toggle light/dark */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            className="cursor-pointer rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white"
          >
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Botão hambúrguer (mobile) */}
          <button
            type="button"
            className="cursor-pointer text-white sm:hidden"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      </div>

      {/* Navegação mobile (dropdown) */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-white/10 px-4 pb-4 sm:hidden">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={linkClass}
              onClick={() => setOpen(false)}
            >
              <span className="block py-2">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
}
