-- =============================================================
-- Esquema do Banco de Dados - TecFix
-- Aplicar no SQL Editor do Supabase Dashboard
-- Execute este script ANTES de docs/rls_policies.sql
-- =============================================================

-- ---------------------------------------------------------------
-- Tabela: clientes
-- ---------------------------------------------------------------

CREATE TABLE IF NOT EXISTS clientes (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  nome       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  telefone   TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------
-- Tabela: ordens_servico
-- ---------------------------------------------------------------

CREATE TABLE IF NOT EXISTS ordens_servico (
  id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  cliente_id BIGINT       NOT NULL REFERENCES clientes (id) ON DELETE CASCADE,
  descricao  TEXT         NOT NULL,
  valor      NUMERIC(10, 2) NOT NULL DEFAULT 0,
  status     TEXT         NOT NULL DEFAULT 'Pendente'
               CHECK (status IN ('Pendente', 'Em Andamento', 'Finalizada', 'Cancelada')),
  created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

-- Índice para acelerar filtros e o join por cliente
CREATE INDEX IF NOT EXISTS idx_ordens_servico_cliente_id ON ordens_servico (cliente_id);

-- Índice para acelerar o filtro por status
CREATE INDEX IF NOT EXISTS idx_ordens_servico_status ON ordens_servico (status);
