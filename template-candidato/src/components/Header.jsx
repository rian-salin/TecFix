import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
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
 * Logo + links entre seções; em telas pequenas a navegação vira menu hambúrguer.
 */
export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-10 bg-primary-dark shadow-sm">
      <div className="flex justify-center px-6 sm:px-12">
      <div className="flex h-16 w-full max-w-5xl items-center justify-between">
        <NavLink to="/" end onClick={() => setOpen(false)}>
          <span className="flex items-center rounded-xl bg-white px-3 py-1 shadow-md">
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

        {/* Botão hambúrguer (mobile) */}
        <button
          type="button"
          className="text-white sm:hidden"
          aria-label={open ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
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
