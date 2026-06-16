import { STATUS_OS } from '../constants/os';

/**
 * Select de status reutilizável (filtro e atualização inline).
 * Quando `includeAll` é true, adiciona a opção "Todos" (valor vazio).
 */
export default function StatusSelect({
  value,
  onChange,
  includeAll = false,
  allLabel = 'Todos os status',
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`rounded-lg border border-border px-3 py-2 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60 ${className}`}
    >
      {includeAll && <option value="">{allLabel}</option>}
      {STATUS_OS.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
