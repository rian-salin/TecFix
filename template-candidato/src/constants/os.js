/**
 * Constantes da entidade Ordem de Serviço.
 * Centraliza os status e o mapeamento para os tokens de cor do design system,
 * reaproveitado por StatusBadge, filtro e atualização inline.
 */

export const STATUS_PENDENTE = 'Pendente';
export const STATUS_EM_ANDAMENTO = 'Em Andamento';
export const STATUS_FINALIZADA = 'Finalizada';
export const STATUS_CANCELADA = 'Cancelada';

// Ordem usada em dropdowns e selects.
export const STATUS_OS = [
  STATUS_PENDENTE,
  STATUS_EM_ANDAMENTO,
  STATUS_FINALIZADA,
  STATUS_CANCELADA,
];

// Status → sufixo do token Tailwind (bg-status-<token>-bg / text-status-<token>-text).
export const statusToToken = {
  [STATUS_PENDENTE]: 'pendente',
  [STATUS_EM_ANDAMENTO]: 'andamento',
  [STATUS_FINALIZADA]: 'finalizada',
  [STATUS_CANCELADA]: 'cancelada',
};
