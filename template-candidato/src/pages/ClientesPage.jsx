import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import FormInput from '../components/FormInput';
import LoadingOverlay from '../components/LoadingOverlay';
import { useIsMobile } from '../hooks/useIsMobile';
import { listClientes, createCliente } from '../services/clientesService';
import { validarCliente } from '../utils/validators';

const FORM_INICIAL = { nome: '', email: '', telefone: '' };
const ERRO_CARREGAR = 'Não foi possível carregar os clientes. Tente novamente.';

function formatarData(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleDateString('pt-BR');
}

export default function ClientesPage() {
  const isMobile = useIsMobile();
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [form, setForm] = useState(FORM_INICIAL);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState(null);
  const [sucesso, setSucesso] = useState(null);

  const recarregarClientes = useCallback(async () => {
    setLoading(true);
    try {
      setClientes(await listClientes());
      setErro(null);
    } catch {
      setErro(ERRO_CARREGAR);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ativo = true;
    (async () => {
      try {
        const dados = await listClientes();
        if (ativo) {
          setClientes(dados);
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
  }, []);

  function handleChange(campo) {
    return (e) => {
      setForm((atual) => ({ ...atual, [campo]: e.target.value }));
      setErros((atual) => ({ ...atual, [campo]: undefined }));
    };
  }

  function handleTelefoneChange(e) {
    const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
    let masked = digits;
    if (digits.length > 10) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    } else if (digits.length > 6) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
    } else if (digits.length > 2) {
      masked = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
    } else if (digits.length > 0) {
      masked = `(${digits}`;
    }
    setForm((atual) => ({ ...atual, telefone: masked }));
    setErros((atual) => ({ ...atual, telefone: undefined }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroSalvar(null);
    setSucesso(null);

    const errosValidacao = validarCliente(form);
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao);
      return;
    }

    setSalvando(true);
    try {
      const novo = await createCliente(form);
      setForm(FORM_INICIAL);
      setErros({});
      setSucesso(`Cliente "${novo.nome}" cadastrado com sucesso.`);
      await recarregarClientes();
    } catch {
      setErroSalvar('Não foi possível cadastrar o cliente. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-text">Clientes</h1>

      <section className="rounded-xl border border-[#FF6B00] bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-sm font-semibold text-text">Novo cliente</h2>
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <FormInput
            id="nome"
            label="Nome"
            value={form.nome}
            onChange={handleChange('nome')}
            error={erros.nome}
            placeholder="Nome do cliente"
          />
          <FormInput
            id="email"
            label="E-mail"
            type="email"
            value={form.email}
            onChange={handleChange('email')}
            error={erros.email}
            placeholder="email@exemplo.com"
          />
          <FormInput
            id="telefone"
            label="Telefone"
            type="tel"
            value={form.telefone}
            onChange={handleTelefoneChange}
            error={erros.telefone}
            placeholder="(00) 00000-0000"
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
            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary-dark px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {salvando && <Loader2 size={16} className="animate-spin" />}
            {salvando ? 'Salvando...' : 'Cadastrar cliente'}
          </button>
        </form>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold text-text">Clientes cadastrados</h2>

        {loading ? (
          <LoadingOverlay show label="Carregando clientes..." />
        ) : erro ? (
          <div className="flex flex-col items-start gap-2 rounded-lg border border-status-cancelada-text/30 bg-status-cancelada-bg px-4 py-3 text-sm text-status-cancelada-text">
            <span>{erro}</span>
            <button type="button" onClick={recarregarClientes} className="cursor-pointer font-semibold underline">
              Tentar novamente
            </button>
          </div>
        ) : clientes.length === 0 ? (
          <p className="rounded-lg border border-border bg-white px-4 py-6 text-center text-sm text-text-muted">
            Nenhum cliente cadastrado ainda.
          </p>
        ) : isMobile ? (
          <div className="flex flex-col gap-3">
            {clientes.map((cliente) => (
              <div
                key={cliente.id}
                className="rounded-xl border border-border bg-white p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-text">{cliente.nome}</span>
                  <span className="text-xs text-text-muted">{formatarData(cliente.created_at)}</span>
                </div>
                <div className="mt-2 text-sm text-text">{cliente.email}</div>
                <div className="text-sm text-text-muted">{cliente.telefone}</div>
              </div>
            ))}
          </div>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">E-mail</th>
                  <th className="px-4 py-3 font-semibold">Telefone</th>
                  <th className="px-4 py-3 font-semibold">Cadastrado em</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-t border-border">
                    <td className="px-4 py-3 font-medium text-text">{cliente.nome}</td>
                    <td className="px-4 py-3 text-text">{cliente.email}</td>
                    <td className="px-4 py-3 text-text">{cliente.telefone}</td>
                    <td className="px-4 py-3 text-text-muted">{formatarData(cliente.created_at)}</td>
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
