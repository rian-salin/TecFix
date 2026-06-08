# Desafio Técnico: Desenvolvedor Júnior Fullstack
## Sistema de Controle de Ordens de Serviço (OS)

Seja bem-vindo(a) ao desafio técnico para a vaga de **Desenvolvedor Júnior Fullstack**! 

O objetivo deste teste é avaliar suas habilidades práticas em desenvolvimento de software utilizando **React JS** no frontend, **Supabase/PostgreSQL** no backend, e a integração entre ambos via API REST.

---

## 📌 Contexto do Desafio

Você foi contratado para desenvolver um sistema web para a **TecFix**, uma assistência técnica que conserta aparelhos eletrônicos. A TecFix precisa de um sistema simples e intuitivo para gerenciar seus clientes e as ordens de serviço (OS) em andamento.

---

## 🛠️ Tecnologias Obrigatórias

- **Frontend**: React JS (pode ser inicializado via Vite).
- **Backend / Banco de Dados**: Supabase (PostgreSQL).
- **Lógica e Estilização**: Javascript e CSS (Vanilla CSS, Tailwind CSS ou outra de sua preferência).

---

## 📋 Requisitos do Sistema

### 1. Banco de Dados (Supabase/Postgres)
Você deve estruturar o seu banco de dados no Supabase com as seguintes tabelas e relacionamentos:

*   **Tabela `clientes`**
    *   `id` 
    *   `nome`
    *   `email`
    *   `telefone`
    *   `created_at`

*   **Tabela `ordens_servico`**
    *   `id`
    *   `cliente_id`
    *   `descricao`
    *   `valor`
    *   `status`
    *   `created_at`

### 2. Frontend (React JS)

A aplicação deve conter uma interface com as seguintes páginas/seções (pode ser uma Single Page Application com rotas ou abas):

#### A. Painel de Controle (Dashboard)
*   Exibir cards de resumo com:
    *   Total de Ordens de Serviço cadastradas.
    *   Quantidade de OS agrupadas por status (ex: X Pendentes, Y Em Andamento).
    *   Faturamento total (soma do valor de todas as OS com status `'Finalizada'`).

#### B. Gestão de Clientes
*   Exibir uma lista simples com os clientes cadastrados.
*   Formulário para cadastrar um novo cliente (campos: nome, email e telefone).
*   *Validação básica de formulário* (ex: não permitir campos vazios, validação simples de e-mail).

#### C. Gestão de Ordens de Serviço (OS)
*   **Listagem de OS**: Uma lista/tabela que exibe as ordens de serviço com:
    *   Nome do cliente associado.
    *   Descrição do problema.
    *   Valor formatado em R$.
    *   Status com cores indicativas (ex: Vermelho para Pendente, Amarelo para Em Andamento, Verde para Finalizada).
*   **Filtro**: Permitir filtrar a listagem pelo status da OS.
*   **Criar Nova OS**: Formulário para criar uma nova OS contendo:
    *   Seleção do cliente (dropdown/select listando os clientes do banco).
    *   Descrição do problema (textarea).
    *   Valor (input numérico).
    *   O status inicial da nova OS deve ser sempre `'Pendente'`.
*   **Atualizar Status**: Mecanismo rápido (botão ou select na listagem/detalhes) para alterar o status da OS (ex: mudar de 'Pendente' para 'Em Andamento', 'Finalizada' ou 'Cancelada').

---

## 🌟 Diferenciais (Não Obrigatórios, mas contam pontos extras)

Se você terminar o escopo principal e quiser se destacar, implemente:
1.  **Filtro de Busca por Texto**: Buscar ordens de serviço pelo nome do cliente ou descrição do problema.
2.  **Row Level Security (RLS)**: Configuração básica de políticas de segurança no Supabase.
3.  **UI/UX Premium**: Uso de micro-animações, modo escuro (Dark Mode) ou uma interface visualmente impressionante.
4.  **Responsividade**: Aplicação adaptada perfeitamente para telas de celulares e tablets.

---

## 🗂️ Como Iniciar

Nós disponibilizamos uma pasta `template-candidato/` que possui:
- Um projeto React estruturado via Vite.
- O SDK do `@supabase/supabase-js` instalado.
- Um arquivo `src/supabaseClient.js` pronto para você preencher com suas credenciais do Supabase.

Para rodar o template:
1. Navegue até a pasta: `cd template-candidato`
2. Instale as dependências: `npm install`
3. Crie um arquivo `.env` e adicione a URL e a Anon Key do seu projeto Supabase.
4. Execute o projeto localmente: `npm run dev`

---

## 📝 O que será avaliado (Critérios)

1.  **Lógica e Organização do Código (30%)**: Código limpo, componentes reutilizáveis, boa nomenclatura de variáveis e funções.
2.  **Funcionamento e Integração (30%)**: Integração correta com o Supabase (criação, listagem e atualização de dados em tempo real).
3.  **Interface e Usabilidade - UI/UX (20%)**: Apresentação visual limpa, facilidade de uso, feedback visual de carregamento ou erros.
4.  **Git e Boas Práticas (10%)**: Commits frequentes e descritivos.
5.  **Instruções e Execução (10%)**: Se a aplicação roda de primeira sem bugs críticos.

Boa sorte! Mostre o seu potencial e dedicação no desenvolvimento deste mini ERP.
