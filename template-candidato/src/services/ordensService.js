import { supabase } from '../supabaseClient';
import { STATUS_PENDENTE, STATUS_FINALIZADA, STATUS_OS } from '../constants/os';

/**
 * Camada de acesso à tabela `ordens_servico` no Supabase.
 * Traz o nome do cliente via join (`clientes(nome)`) em uma única query.
 */

// Colunas da OS + nome do cliente associado.
const SELECT_COM_CLIENTE = '*, clientes(nome)';

export async function listOrdens({ status } = {}) {
  let query = supabase
    .from('ordens_servico')
    .select(SELECT_COM_CLIENTE)
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function createOrdem({ cliente_id, descricao, valor }) {
  const { data, error } = await supabase
    .from('ordens_servico')
    .insert([
      {
        cliente_id,
        descricao: descricao.trim(),
        valor: Number(valor),
        status: STATUS_PENDENTE, // status inicial sempre 'Pendente'
      },
    ])
    .select(SELECT_COM_CLIENTE)
    .single();

  if (error) throw error;
  return data;
}

// Conta as OS de um status sem trafegar linhas (apenas o cabeçalho com count).
async function contarPorStatus(status) {
  const { count, error } = await supabase
    .from('ordens_servico')
    .select('*', { count: 'exact', head: true })
    .eq('status', status);

  if (error) throw error;
  return count ?? 0;
}

/**
 * Agrega as métricas do Dashboard em um único objeto:
 * - total: total de OS cadastradas
 * - porStatus: contagem de OS por status
 * - faturamento: soma de `valor` das OS finalizadas
 *
 * Usa queries separadas com count exato (head: true) para não trafegar linhas,
 * e busca apenas a coluna `valor` das finalizadas para somar.
 */
export async function getResumoDashboard() {
  const [{ count: total, error: erroTotal }, valoresFinalizadas, ...contagens] =
    await Promise.all([
      supabase.from('ordens_servico').select('*', { count: 'exact', head: true }),
      supabase.from('ordens_servico').select('valor').eq('status', STATUS_FINALIZADA),
      ...STATUS_OS.map((status) => contarPorStatus(status)),
    ]);

  if (erroTotal) throw erroTotal;
  if (valoresFinalizadas.error) throw valoresFinalizadas.error;

  const porStatus = STATUS_OS.reduce((acc, status, i) => {
    acc[status] = contagens[i];
    return acc;
  }, {});

  const faturamento = (valoresFinalizadas.data ?? []).reduce(
    (soma, os) => soma + Number(os.valor || 0),
    0
  );

  return { total: total ?? 0, porStatus, faturamento };
}

export async function updateStatusOrdem(id, status) {
  const { data, error } = await supabase
    .from('ordens_servico')
    .update({ status })
    .eq('id', id)
    .select(SELECT_COM_CLIENTE)
    .single();

  if (error) throw error;
  return data;
}
