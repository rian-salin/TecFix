import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import FormInput from '../components/FormInput';
import { listClientes, createCliente } from '../services/clientesService';
import { validarCliente } from '../utils/validators';

const FORM_INICIAL = { nome: '', email: '', telefone: '' };

function formatarData(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleDateString('pt-BR');
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

  const [form, setForm] = useState(FORM_INICIAL);
  const [erros, setErros] = useState({});
  const [salvando, setSalvando] = useState(false);
  const [erroSalvar, setErroSalvar] = useState(null);

  const carregarClientes = useCallback(async () => {
    setLoading(true);
    setErro(null);
    try {
      setClientes(await listClientes());
    } catch {
      setErro('Não foi possível carregar os clientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    carregarClientes();
  }, [carregarClientes]);

  function handleChange(campo) {
    return (e) => {
      setForm((atual) => ({ ...atual, [campo]: e.target.value }));
      setErros((atual) => ({ ...atual, [campo]: undefined }));
    };
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErroSalvar(null);

    const errosValidacao = validarCliente(form);
    if (Object.keys(errosValidacao).length > 0) {
      setErros(errosValidacao);
      return;
    }

    setSalvando(true);
    try {
      await createCliente(form);
      setForm(FORM_INICIAL);
      setErros({});
      await carregarClientes();
    } catch {
      setErroSalvar('Não foi possível cadastrar o cliente. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-primary-dark">Clientes</h1>

      {/* Formulário de cadastro */}
      <section className="rounded-xl border border-border bg-white p-6 shadow-sm sm:max-w-[480px]">
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
            value={form.telefone}
            onChange={handleChange('telefone')}
            error={erros.telefone}
            placeholder="(00) 00000-0000"
          />

          {erroSalvar && (
            <p className="rounded-lg bg-status-cancelada-bg px-3 py-2 text-sm text-status-cancelada-text">
              {erroSalvar}
            </p>
          )}

          <button
            type="submit"
            disabled={salvando}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {salvando && <Loader2 size={16} className="animate-spin" />}
            {salvando ? 'Salvando...' : 'Cadastrar cliente'}
          </button>
        </form>
      </section>

      {/* Lista de clientes */}
      <section>
        <h2 className="mb-3 text-sm font-semibold text-text">Clientes cadastrados</h2>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-text-muted">
            <Loader2 size={18} className="animate-spin" />
            Carregando clientes...
          </div>
        ) : erro ? (
          <div className="flex flex-col items-start gap-2 rounded-lg border border-status-cancelada-text/30 bg-status-cancelada-bg px-4 py-3 text-sm text-status-cancelada-text">
            <span>{erro}</span>
            <button type="button" onClick={carregarClientes} className="font-semibold underline">
              Tentar novamente
            </button>
          </div>
        ) : clientes.length === 0 ? (
          <p className="rounded-lg border border-border bg-white px-4 py-6 text-center text-sm text-text-muted">
            Nenhum cliente cadastrado ainda.
          </p>
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
