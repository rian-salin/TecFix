import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { listClientes } from '../services/clientesService';

function formatarData(valor) {
  if (!valor) return '—';
  return new Date(valor).toLocaleDateString('pt-BR');
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);

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

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-primary-dark">Clientes</h1>

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
            <button
              type="button"
              onClick={carregarClientes}
              className="font-semibold underline"
            >
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
