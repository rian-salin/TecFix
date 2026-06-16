import feedbackCarregar from '../assets/feedbackCarregar.mp4';

/**
 * Overlay de carregamento fullscreen.
 *
 * Cobre a tela inteira com um backdrop claro e exibe a animação
 * `feedbackCarregar.mp4` centralizada. Usado em transições e ao
 * buscar dados via Supabase.
 *
 * @param {boolean} show   controla a renderização (não renderiza se false)
 * @param {string}  [label] texto opcional exibido abaixo da animação
 */
export default function LoadingOverlay({ show = true, label }) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm"
    >
      <video
        src={feedbackCarregar}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="h-32 w-32 max-w-[160px] object-contain"
      />
      {label && <p className="text-sm text-text-muted">{label}</p>}
    </div>
  );
}
