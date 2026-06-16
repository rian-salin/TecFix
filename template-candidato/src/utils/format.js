const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

export function formatBRL(valor) {
  const numero = Number(valor);
  return BRL.format(Number.isFinite(numero) ? numero : 0);
}
