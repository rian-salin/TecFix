-- =============================================================
-- Row Level Security (RLS) - TecFix
-- Aplicar no SQL Editor do Supabase Dashboard
-- =============================================================

-- ---------------------------------------------------------------
-- Tabela: clientes
-- ---------------------------------------------------------------

ALTER TABLE clientes ENABLE ROW LEVEL SECURITY;

-- Leitura pública (anon pode listar clientes)
CREATE POLICY "clientes_select"
  ON clientes
  FOR SELECT
  TO anon
  USING (true);

-- Inserção pública (anon pode criar clientes)
CREATE POLICY "clientes_insert"
  ON clientes
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Atualização pública (anon pode editar clientes)
CREATE POLICY "clientes_update"
  ON clientes
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Exclusão pública (anon pode deletar clientes)
CREATE POLICY "clientes_delete"
  ON clientes
  FOR DELETE
  TO anon
  USING (true);

-- ---------------------------------------------------------------
-- Tabela: ordens_servico
-- ---------------------------------------------------------------

ALTER TABLE ordens_servico ENABLE ROW LEVEL SECURITY;

-- Leitura pública (anon pode listar ordens)
CREATE POLICY "ordens_select"
  ON ordens_servico
  FOR SELECT
  TO anon
  USING (true);

-- Inserção pública (anon pode criar ordens)
CREATE POLICY "ordens_insert"
  ON ordens_servico
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Atualização pública (anon pode atualizar status e dados)
CREATE POLICY "ordens_update"
  ON ordens_servico
  FOR UPDATE
  TO anon
  USING (true)
  WITH CHECK (true);

-- Exclusão pública (anon pode deletar ordens)
CREATE POLICY "ordens_delete"
  ON ordens_servico
  FOR DELETE
  TO anon
  USING (true);
