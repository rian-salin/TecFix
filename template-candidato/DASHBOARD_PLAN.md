# Plano de Implementação — Painel de Controle (Dashboard)

Documento de planejamento do módulo **Dashboard**, executado em fases com commits
frequentes e descritivos. Cada fase fecha em um commit isolado.

## Objetivo

Substituir o placeholder de [`DashboardPage.jsx`](src/pages/DashboardPage.jsx) por um
painel com cards de resumo:

1. **Total de Ordens de Serviço** cadastradas.
2. **OS agrupadas por status** (X Pendentes, Y Em Andamento, Z Finalizadas, W Canceladas).
3. **Faturamento total** — soma de `valor` das OS com `status = 'Finalizada'`.

## Decisões de arquitetura

Para reaproveitar os padrões já estabelecidos no projeto:

- **Cálculo das métricas no servidor (Supabase)**, não no cliente. Uma nova função
  `getResumoDashboard()` em [`ordensService.js`](src/services/ordensService.js) faz as
  consultas e devolve um objeto já agregado. Isso evita trazer todas as OS para o front
  só para contar — e mantém a camada de dados isolada da UI, como nas demais páginas.
- **Reuso de tokens e helpers existentes**: `statusToToken`/`STATUS_OS` de
  [`constants/os.js`](src/constants/os.js), cores do `StatusBadge`, `formatBRL` de
  [`utils/format.js`](src/utils/format.js).
- **Estados de UI consistentes**: loading via [`LoadingOverlay`](src/components/LoadingOverlay.jsx),
  bloco de erro com botão "Tentar novamente" (mesmo padrão da `OrdensPage`).
- **Responsividade**: grid de 1 coluna no mobile → 2–3 colunas em telas maiores
  (`grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`), conforme tabela do DESIGN_SYSTEM.

### Consultas no service

Usando `count` exato do Supabase para evitar trafegar linhas desnecessárias:

```js
// Total geral
supabase.from('ordens_servico').select('*', { count: 'exact', head: true })

// Contagem por status (uma query por status, com head:true)
supabase.from('ordens_servico')
  .select('*', { count: 'exact', head: true })
  .eq('status', STATUS)

// Faturamento: traz apenas a coluna `valor` das finalizadas e soma no service
supabase.from('ordens_servico').select('valor').eq('status', 'Finalizada')
```

Retorno padronizado:

```js
{
  total: number,
  porStatus: { 'Pendente': n, 'Em Andamento': n, 'Finalizada': n, 'Cancelada': n },
  faturamento: number, // soma dos valores das finalizadas
}
```

## Componente reutilizável: `SummaryCard`

Novo componente [`src/components/SummaryCard.jsx`] seguindo o estilo de card do
DESIGN_SYSTEM (radius 12px, borda `border`, `shadow-sm`, padding 24px, ícone de destaque
no canto superior). Props:

| Prop      | Tipo        | Descrição                                              |
| --------- | ----------- | ------------------------------------------------------ |
| `label`   | string      | Rótulo do card (ex: "Total de OS")                     |
| `value`   | string/num  | Valor em destaque                                      |
| `icon`    | component   | Ícone `lucide-react` (opcional)                        |
| `accent`  | string      | Classe de cor de destaque (default `primary`)          |

Os cards por status reaproveitam as cores de `statusToToken` para o destaque.

---

## Fases (1 commit cada)

### Fase 1 — Camada de dados
- Adicionar `getResumoDashboard()` em [`ordensService.js`](src/services/ordensService.js).
- **Commit:** `feat: adicionar service de resumo do dashboard`

### Fase 2 — Componente SummaryCard reutilizável
- Criar [`SummaryCard.jsx`] com estilo do design system e suporte a ícone/accent.
- **Commit:** `feat: componente SummaryCard reutilizavel`

### Fase 3 — Card de total + estados de loading/erro
- Montar `DashboardPage` com fetch via `getResumoDashboard`, `LoadingOverlay`,
  bloco de erro com "Tentar novamente" e o card de **Total de OS**.
- **Commit:** `feat: dashboard com total de OS e estados de UI`

### Fase 4 — Cards por status
- Renderizar um card por status (Pendente, Em Andamento, Finalizada, Cancelada)
  iterando sobre `STATUS_OS`, com cores do design system.
- **Commit:** `feat: cards de OS agrupadas por status no dashboard`

### Fase 5 — Card de faturamento
- Card de **Faturamento total** formatado com `formatBRL`, destaque em cor de sucesso.
- **Commit:** `feat: card de faturamento total no dashboard`

### Fase 6 — Responsividade e refino visual
- Ajustar grid responsivo, espaçamentos e título; revisar mobile/tablet.
- **Commit:** `style: ajustar grid responsivo do dashboard`

## Checklist de critérios de avaliação

- [ ] Commits frequentes e descritivos (uma fase = um commit)
- [ ] Componente reutilizável (`SummaryCard`)
- [ ] Feedback visual (loading + erro com retry)
- [ ] Código limpo (service isolado, sem cálculo na UI)
- [ ] Integração correta (dados reais do Supabase)
- [ ] Responsividade (1 col → 2–3 cols)
