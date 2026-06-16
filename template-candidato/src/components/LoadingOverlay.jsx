import feedbackCarregar from '../assets/feedbackCarregar.gif';

export default function LoadingOverlay({ show = true, label }) {
  if (!show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-3 bg-white/80 backdrop-blur-sm"
    >
      <img
        src={feedbackCarregar}
        alt=""
        aria-hidden="true"
        className="h-32 w-32 max-w-[160px] object-contain"
      />
      {label && <p className="text-sm text-text-muted">{label}</p>}
    </div>
  );
}
