import { statusToToken } from '../constants/os';

const CLASSES = {
  pendente: 'bg-status-pendente-bg text-status-pendente-text',
  andamento: 'bg-status-andamento-bg text-status-andamento-text',
  finalizada: 'bg-status-finalizada-bg text-status-finalizada-text',
  cancelada: 'bg-status-cancelada-bg text-status-cancelada-text',
};

export default function StatusBadge({ status }) {
  const token = statusToToken[status] ?? 'pendente';
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${CLASSES[token]}`}
    >
      {status}
    </span>
  );
}
