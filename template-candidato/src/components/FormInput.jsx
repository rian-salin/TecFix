/**
 * Campo de formulário reutilizável: label + input + mensagem de erro.
 * Estilizado com os tokens do design system; aceita qualquer prop nativa de <input>.
 */
export default function FormInput({ id, label, error, ...inputProps }) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-semibold text-text">
        {label}
      </label>
      <input
        id={id}
        aria-invalid={error ? 'true' : undefined}
        className={`rounded-lg border px-3 py-2 text-sm text-text outline-none transition focus:ring-2 ${
          error
            ? 'border-status-cancelada-text focus:ring-status-cancelada-bg'
            : 'border-border focus:border-primary focus:ring-primary/15'
        }`}
        {...inputProps}
      />
      {error && <span className="text-xs text-status-cancelada-text">{error}</span>}
    </div>
  );
}
