# TecFix Admin - Template para Teste Técnico

Este é o template inicial para o desafio de **Desenvolvedor Júnior Fullstack**.

## 🚀 Como Executar o Projeto

1. **Instale as dependências:**
   ```bash
   npm install
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   ```
   Edite o `.env` com as credenciais do seu projeto Supabase:
   - `VITE_SUPABASE_URL` — encontrado em Project Settings → API
   - `VITE_SUPABASE_ANON_KEY` — encontrado em Project Settings → API

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Banco de dados:**
   - Crie um arquivo SQL e execute no editor SQL do Supabase, e comite ele no repositório.
   - Execute o script [`docs/rls_policies.sql`](docs/rls_policies.sql) no SQL Editor do Supabase para habilitar o **Row Level Security (RLS)** nas tabelas `clientes` e `ordens_servico`.

## 📝 Instruções de Desenvolvimento

As tarefas que você precisa implementar estão descritas em detalhes no arquivo **`INSTRUCOES.md`** localizado na raiz deste repositório.
