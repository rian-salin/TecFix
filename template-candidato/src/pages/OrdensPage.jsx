import { useCallback, useEffect, useMemo, useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import FormInput from '../components/FormInput';
import StatusBadge from '../components/StatusBadge';
import StatusSelect from '../components/StatusSelect';
import LoadingOverlay from '../components/LoadingOverlay';
import { useIsMobile } from '../hooks/useIsMobile';
import { listClientes } from '../services/clientesService';
import { listOrdens, createOrdem, updateStatusOrdem } from '../services/ordensService';
import { validarOrdemServico } from '../utils/validators';
import { formatBRL } from '../utils/format';

const FORM_INICIAL = { cliente_id: '', descricao: '', valor: '' };
const ERRO_CARREGAR = 'Não foi possível carregar as ordens de serviço. Tente novamente.';

function nomeCliente(os) {
  return os.clientes?.nome ?? '—';
}

export default function OrdensPage() {
  const isMobile = useIsMobile();

  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  // Filtros (status via re-fetch; busca textual client-side).
  const [filtroStatus, setFiltroStatus] = useState('');
  const [busca, setBusca] = useState('');

  // Atualização inline de status: id da OS sendo atualizada.
  const [atualizandoId, setAtualizandoId] = useState(null);

  // Formulário de criação.
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(FORM_INICIAL);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  const recarregarOrdens = useCallback(async () => {
    setLoading(true);
    try {
      setOrdens(await listOrdens({ status: filtroStatus || undefined }));
      setErro(null);
    } catch {
      setErro(ERRO_CARREGAR);
    } finally {
      setLoading(false);
    }
  }, [filtroStatus]);

  // Recarrega a lista sempre que o filtro de status muda.
  useEffect(() => {
    let ativo = true;
    (async () => {
      setLoading(true);
      try {
        const dados = await listOrdens({ status: filtroStatus || undefined });
        if (ativo) {
          setOrdens(dados);
          setErro(null);
        }
      } catch {
        if (ativo) setErro(ERRO_CARREGAR);
      } finally {
        if (ativo) setLoading(false);
      }
    })();
    return () => {
      ativo = false;
    };
  }, [filtroStatus]);

  // Carrega clientes para o dropdown do formulário (uma vez).
  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const dados = await listClientes();
        if (ativo) setClientes(dados);
      } catch {
        // Lista de clientes é tratada como vazia em caso de falha.
      }
    })();
    return () => {
      ativo = false;
    };
  }, []);

  // Busca textual: filtra a lista já carregada por nome do cliente ou descrição.
  const ordensFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return ordens;
    return ordens.filter(
      (os) =>
        os.descricao?.toLowerCase().includes(termo) ||
        nomeCliente(os).toLowerCase().includes(termo)
    );
  }, [ordens, busca]);

  function handleChange(campo) {
    return (e) => {
      setForm((atual) => ({ ...atual, [campo]: e.target.value }));
      setErros((atual) => ({ ...atual, [campo]: undefined }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroSalvar(null);
    setSucesso(null);

    const errosValidacao = validarOrdemServico(form);
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao);
      return;
    }

    setSalvando(true);
    try {
      await createOrdem(form);
      setForm(FORM_INICIAL);
      setErros({});
      setSucesso('Ordem de serviço criada com sucesso.');
      await recarregarOrdens();
    } catch {
      setErroSalvar('Não foi possível criar a ordem de serviço. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  // Atualização inline de status com update otimista e rollback em caso de erro.
  async function handleStatusChange(os, novoStatus) {
    if (novoStatus === os.status) return;
    const anterior = os.status;

    setAtualizandoId(os.id);
    setOrdens((atual) =>
      atual.map((item) => (item.id === os.id ? { ...item, status: novoStatus } : item))
    );

    try {
      await updateStatusOrdem(os.id, novoStatus);
      // Se há filtro ativo e o novo status não corresponde, recarrega para refletir.
      if (filtroStatus && filtroStatus !== novoStatus) {
        await recarregarOrdens();
      }
    } catch {
      // Rollback.
      setOrdens((atual) =>
        atual.map((item) => (item.id === os.id ? { ...item, status: anterior } : item))
      );
      setErro('Não foi possível atualizar o status. Tente novamente.');
    } finally {
      setAtualizandoId(null);
    }
  }

  const semClientes = clientes.length === 0;

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-primary-dark">Ordens de Serviço</h1>

      {/* Formulário de criação */}
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-text">Nova ordem de serviço</h2>

        {semClientes ? (
          <p className="rounded-lg bg-status-pendente-bg px-3 py-2 text-sm text-status-pendente-text">
            Cadastre um cliente antes de criar uma ordem de serviço.
          </p>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label htmlFor="cliente_id" className="text-sm font-semibold text-text">
                Cliente
              </label>
              <select
                id="cliente_id"
                value={form.cliente_id}
                onChange={handleChange('cliente_id')}
                aria-invalid={erros.cliente_id ? 'true' : undefined}
                className={`rounded-lg border px-3 py-2 text-sm text-text outline-none transition focus:ring-2 ${
                  erros.cliente_id
                    ? 'border-status-cancelada-text focus:ring-status-cancelada-bg'
                    : 'border-border focus:border-primary focus:ring-primary/15'
                }`}
              >
                <option value="">Selecione um cliente</option>
                {clientes.map((cliente) => (
                  <option key={cliente.id} value={cliente.id}>
                    {cliente.nome}
                  </option>
                ))}
              </select>
              {erros.cliente_id && (
                <span className="text-xs text-status-cancelada-text">{erros.cliente_id}</span>
              )}
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="descricao" className="text-sm font-semibold text-text">
                Descrição do problema
              </label>
              <textarea
                id="descricao"
                rows={3}
                value={form.descricao}
                onChange={handleChange('descricao')}
                aria-invalid={erros.descricao ? 'true' : undefined}
                placeholder="Descreva o problema relatado"
                className={`resize-y rounded-lg border px-3 py-2 text-sm text-text outline-none transition focus:ring-2 ${
                  erros.descricao
                    ? 'border-status-cancelada-text focus:ring-status-cancelada-bg'
                    : 'border-border focus:border-primary focus:ring-primary/15'
                }`}
              />
              {erros.descricao && (
                <span className="text-xs text-status-cancelada-text">{erros.descricao}</span>
              )}
            </div>

            <FormInput
              id="valor"
              label="Valor (R$)"
              type="number"
              min="0"
              step="0.01"
              value={form.valor}
              onChange={handleChange('valor')}
              error={erros.valor}
              placeholder="0,00"
            />

            {erroSalvar && (
              <p className="rounded-lg bg-status-cancelada-bg px-3 py-2 text-sm text-status-cancelada-text">
                {erroSalvar}
              </p>
            )}

            {sucesso && (
              <p className="rounded-lg bg-status-finalizada-bg px-3 py-2 text-sm text-status-finalizada-text">
                {sucesso}
              </p>
            )}

            <button
              type="submit"
              disabled={salvando}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {salvando && <Loader2 size={16} className="animate-spin" />}
              {salvando ? 'Salvando...' : 'Criar ordem de serviço'}
            </button>
          </form>
        )}
      </section>

      {/* Lista de OS */}
      <section className="flex flex-col gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-text">Ordens cadastradas</h2>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            {/* Busca textual */}
            <div className="relative sm:w-64">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 z-10 -translate-y-1/2 text-text-muted"
              />
              <input
                type="text"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Buscar por cliente ou descrição"
                aria-label="Buscar ordens de serviço"
                className="w-full rounded-lg border border-border py-2 pl-9 pr-9 text-sm text-text outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              />
              {busca && (
                <button
                  type="button"
                  onClick={() => setBusca('')}
                  aria-label="Limpar busca"
                  className="absolute right-2 top-1/2 z-10 -translate-y-1/2 text-text-muted hover:text-text"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Filtro por status */}
            <StatusSelect
              value={filtroStatus}
              onChange={(e) => setFiltroStatus(e.target.value)}
              includeAll
              aria-label="Filtrar por status"
            />
          </div>
        </div>

        {loading ? (
          <LoadingOverlay show label="Carregando ordens de serviço..." />
        ) : erro ? (
          <div className="flex flex-col items-start gap-2 rounded-lg border border-status-cancelada-text/30 bg-status-cancelada-bg px-4 py-3 text-sm text-status-cancelada-text">
            <span>{erro}</span>
            <button type="button" onClick={recarregarOrdens} className="font-semibold underline">
              Tentar novamente
            </button>
          </div>
        ) : ordensFiltradas.length === 0 ? (
          <p className="rounded-lg border border-border bg-white px-4 py-6 text-center text-sm text-text-muted">
            {ordens.length === 0
              ? 'Nenhuma ordem de serviço cadastrada ainda.'
              : 'Nenhuma ordem encontrada para os filtros aplicados.'}
          </p>
        ) : isMobile ? (
          <div className="flex flex-col gap-3">
            {ordensFiltradas.map((os) => (
              <div key={os.id} className="rounded-xl border border-border bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-text">{os.descricao}</span>
                  <StatusBadge status={os.status} />
                </div>
                <div className="mt-1 text-sm text-text-muted">{nomeCliente(os)}</div>
                <div className="mt-2 font-bold text-text">{formatBRL(os.valor)}</div>
                <div className="mt-3 flex items-center gap-2">
                  <StatusSelect
                    value={os.status}
                    onChange={(e) => handleStatusChange(os, e.target.value)}
                    disabled={atualizandoId === os.id}
                    aria-label={`Atualizar status da OS de ${nomeCliente(os)}`}
                    className="flex-1"
                  />
                  {atualizandoId === os.id && (
                    <Loader2 size={16} className="animate-spin text-text-muted" />
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Cliente</th>
                  <th className="px-4 py-3 font-semibold">Descrição</th>
                  <th className="px-4 py-3 font-semibold">Valor</th>
                  <th className="px-4 py-3 font-semibold">Status</th>
                  <th className="px-4 py-3 font-semibold">Atualizar</th>
                </tr>
              </thead>
              <tbody>
                {ordensFiltradas.map((os) => (
                  <tr key={os.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-text">{nomeCliente(os)}</td>
                    <td className="px-4 py-3 text-text">{os.descricao}</td>
                    <td className="px-4 py-3 font-semibold text-text">{formatBRL(os.valor)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={os.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <StatusSelect
                          value={os.status}
                          onChange={(e) => handleStatusChange(os, e.target.value)}
                          disabled={atualizandoId === os.id}
                          aria-label={`Atualizar status da OS de ${nomeCliente(os)}`}
                        />
                        {atualizandoId === os.id && (
                          <Loader2 size={16} className="animate-spin text-text-muted" />
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
