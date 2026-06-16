import { useState, useEffect } from 'react';

/**
 * Retorna true em telas de celular (< 640px), conforme breakpoint do design system.
 * Usado para alternar layouts (ex.: tabela → cards).
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 640);

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 639px)');
    const handler = (e) => setIsMobile(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isMobile;
}
