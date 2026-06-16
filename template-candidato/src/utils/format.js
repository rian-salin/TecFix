// Formatação de valores monetários em Real brasileiro.
const BRL = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
});

/**
 * Formata um número como moeda BRL (ex: 1234.5 → "R$ 1.234,50").
 * Valores ausentes ou inválidos caem para R$ 0,00.
 */
export function formatBRL(valor) {
  const numero = Number(valor);
  return BRL.format(Number.isFinite(numero) ? numero : 0);
}
