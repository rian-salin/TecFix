import { supabase } from '../supabaseClient';
import { STATUS_PENDENTE } from '../constants/os';

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
