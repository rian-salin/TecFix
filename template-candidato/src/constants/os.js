export const STATUS_PENDENTE = 'Pendente';
export const STATUS_EM_ANDAMENTO = 'Em Andamento';
export const STATUS_FINALIZADA = 'Finalizada';
export const STATUS_CANCELADA = 'Cancelada';

export const STATUS_OS = [
  STATUS_PENDENTE,
  STATUS_EM_ANDAMENTO,
  STATUS_FINALIZADA,
  STATUS_CANCELADA,
];

export const statusToToken = {
  [STATUS_PENDENTE]: 'pendente',
  [STATUS_EM_ANDAMENTO]: 'andamento',
  [STATUS_FINALIZADA]: 'finalizada',
  [STATUS_CANCELADA]: 'cancelada',
};
