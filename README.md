# TecFix Admin — Sistema de Controle de Ordens de Serviço

Aplicação web (mini-ERP) para uma assistência técnica gerenciar **clientes** e **ordens de serviço (OS)**.

A interface cobre três áreas: um **Dashboard** com indicadores do negócio, a **Gestão de Clientes** e a **Gestão de Ordens de Serviço**, com integração em tempo real ao Supabase.

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Frontend | React 19 + Vite |
| Roteamento | React Router DOM 7 |
| Estilização | Tailwind CSS 4 (plugin oficial do Vite) |
| Ícones | lucide-react |
| Backend / Banco | Supabase (PostgreSQL) via `@supabase/supabase-js` |
| Qualidade | ESLint 10 (flat config) |

---

## 🚀 Como Executar

> Todos os comandos são executados a partir da pasta `template-candidato/`.

### 1. Pré-requisitos
- Node.js 18+ e npm
- Um projeto criado no [Supabase](https://supabase.com)

### 2. Instalar dependências
```bash
cd template-candidato
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```
Preencha o `.env` com as credenciais do seu projeto (Supabase → *Project Settings → API*):
```
VITE_SUPABASE_URL=https://<seu-projeto>.supabase.co
VITE_SUPABASE_ANON_KEY=<sua-anon-key>
```
O cliente já vem pré-configurado em [`src/supabaseClient.js`](template-candidato/src/supabaseClient.js) e lê essas variáveis automaticamente.

### 4. Preparar o banco de dados
No SQL Editor do Supabase, execute os scripts **nesta ordem**:
```bash
# 1. Cria as tabelas, constraints e índices:
template-candidato/docs/schema.sql

# 2. Habilita o Row Level Security e as políticas de acesso:
template-candidato/docs/rls_policies.sql
```
O esquema das tabelas está descrito abaixo.

### 5. Rodar a aplicação
```bash
npm run dev       # servidor de desenvolvimento (Vite)
npm run build     # build de produção
npm run preview   # pré-visualização do build
npm run lint      # análise estática com ESLint
```

---

## Esquema do Banco de Dados

Definição completa (tabelas, constraints e índices) em [`docs/schema.sql`](template-candidato/docs/schema.sql).

**`clientes`**

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | bigint | PK (identity) |
| `nome` | text | `NOT NULL` |
| `email` | text | `NOT NULL` |
| `telefone` | text | `NOT NULL` |
| `created_at` | timestamptz | default `now()` |

**`ordens_servico`**

| Coluna | Tipo | Observação |
| --- | --- | --- |
| `id` | bigint | PK (identity) |
| `cliente_id` | bigint | FK → `clientes.id` (`ON DELETE CASCADE`) |
| `descricao` | text | `NOT NULL` |
| `valor` | numeric(10,2) | default `0` |
| `status` | text | `CHECK` em `Pendente` (default), `Em Andamento`, `Finalizada`, `Cancelada` |
| `created_at` | timestamptz | default `now()` |

> Índices em `cliente_id` (join/filtro) e `status` (filtro da listagem) acompanham o script.

---

## Itens Contemplados do Teste

### Requisitos obrigatórios

- **Dashboard**
  - Total de OS cadastradas.
  - Quantidade de OS agrupada por status.
  - Faturamento total (soma de `valor` das OS com status `Finalizada`).
  - As contagens são feitas no banco com `count: 'exact', head: true` e disparadas em paralelo via `Promise.all`, evitando trazer linhas desnecessárias para o cliente.

- **Gestão de Clientes**
  - Listagem dos clientes cadastrados.
  - Formulário de cadastro (nome, e-mail, telefone) com **validação** (campos obrigatórios e formato de e-mail).
  - Atualização imediata da lista após o cadastro.

- **Gestão de Ordens de Serviço**
  - Listagem com nome do cliente associado (via join `*, clientes(nome)`), descrição, **valor formatado em R$** e **status com cores indicativas**.
  - **Filtro por status** aplicado diretamente na query (`.eq('status', ...)`).
  - Formulário de criação (select de cliente, descrição, valor) com status inicial sempre `Pendente`.
  - **Atualização rápida de status** inline na própria listagem.

### Diferenciais implementados

- **Busca por texto** — filtra as OS por nome do cliente ou descrição, combinada ao filtro de status.
- **Row Level Security (RLS)** — políticas versionadas em [`docs/rls_policies.sql`](template-candidato/docs/rls_policies.sql).
- **Dark Mode** — tema claro/escuro com persistência em `localStorage` via Context API.
- **Responsividade** — layout adaptado para celular, tablet e desktop, com hook `useIsMobile` para ajustes pontuais de comportamento.
- **Feedback visual** — estados de carregamento (overlay/spinners) e mensagens de erro em todas as operações com o Supabase.

---

## Boas Práticas Adotadas

- **Separação de responsabilidades** — acesso a dados isolado em uma camada de *services* (`clientesService.js`, `ordensService.js`); as páginas consomem essas funções e cuidam apenas da UI e do estado.
- **Componentes reutilizáveis** — `FormInput`, `StatusBadge`, `StatusSelect`, `SummaryCard`, `LoadingOverlay`, `Header` e `Layout` evitam duplicação de UI.
- **Funções utilitárias puras** — formatação de moeda (`formatBRL` com `Intl.NumberFormat`) e validações (`validators.js`) centralizadas e testáveis.
- **Constantes centralizadas** — valores de status e regras correlatas em `constants/os.js`, eliminando *magic strings* espalhadas pelo código.
- **Integração consistente** — toda mutação (criar/atualizar) reflete imediatamente na UI por re-fetch ou atualização otimista do estado.
- **Tratamento de erros** — os *services* propagam o erro (`throw error`) e as páginas o traduzem em feedback ao usuário.
- **Acessibilidade** — uso de `aria-label` em campos de busca e controles interativos.
- **Variáveis de ambiente** — credenciais fora do código-fonte, com `.env.example` versionado como referência.

### Lint / Qualidade de Código

O projeto usa **ESLint 10** com a *flat config* ([`eslint.config.js`](template-candidato/eslint.config.js)), incluindo:

- `@eslint/js` — regras recomendadas para JavaScript.
- `eslint-plugin-react-hooks` — garante o uso correto das *Rules of Hooks* (dependências de efeitos, chamadas condicionais).
- `eslint-plugin-react-refresh` — compatibilidade com o Fast Refresh do Vite.
- A pasta `dist/` é ignorada via `globalIgnores`.

Para validar o código:
```bash
npm run lint
```

---

## 📁 Estrutura do Projeto

```
template-candidato/
├── docs/
│   ├── schema.sql              # criação das tabelas, constraints e índices
│   └── rls_policies.sql        # políticas de Row Level Security
├── src/
│   ├── components/             # componentes reutilizáveis de UI
│   ├── constants/              # constantes de domínio (status de OS)
│   ├── contexts/               # ThemeContext (dark mode)
│   ├── hooks/                  # hooks customizados (useIsMobile)
│   ├── pages/                  # Dashboard, Clientes, Ordens
│   ├── services/               # acesso a dados (Supabase)
│   ├── utils/                  # formatação e validação
│   ├── supabaseClient.js       # cliente Supabase pré-configurado
│   ├── App.jsx                 # definição de rotas
│   └── main.jsx                # ponto de entrada
├── .env.example
├── eslint.config.js
└── vite.config.js
```
