import { supabase } from '../supabaseClient';

/**
 * Camada de acesso à tabela `clientes` no Supabase.
 * Mantém as queries fora dos componentes (responsabilidade única).
 */

export async function listClientes() {
  const { data, error } = await supabase
    .from('clientes')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function createCliente({ nome, email, telefone }) {
  const { data, error } = await supabase
    .from('clientes')
    .insert([{ nome: nome.trim(), email: email.trim(), telefone: telefone.trim() }])
    .select()
    .single();

  if (error) throw error;
  return data;
}
