import { useEffect, useRef, useState } from 'react';
import { CircleDashed, CircleDot, CircleCheck, CircleX, ClipboardList, DollarSign } from 'lucide-react';
import SummaryCard from '../components/SummaryCard';
import LoadingOverlay from '../components/LoadingOverlay';
import { getResumoDashboard } from '../services/ordensService';
import { STATUS_OS, statusToToken } from '../constants/os';
import { formatBRL } from '../utils/format';

const ERRO_CARREGAR = 'Não foi possível carregar os dados do painel. Tente novamente.';

const STATUS_ICON = {
  pendente: CircleDashed,
  andamento: CircleDot,
  finalizada: CircleCheck,
  cancelada: CircleX,
};

const STATUS_ACCENT = {
  pendente: 'text-status-pendente-text',
  andamento: 'text-status-andamento-text',
  finalizada: 'text-status-finalizada-text',
  cancelada: 'text-status-cancelada-text',
};

export default function DashboardPage() {
  const [resumo, setResumo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [tentativa, setTentativa] = useState(0);

  // Referência para cancelar o setState caso o componente desmonte durante o fetch.
  const ativoRef = useRef(true);

  useEffect(() => {
    ativoRef.current = true;

    async function carregar() {
      if (ativoRef.current) setLoading(true);
      if (ativoRef.current) setErro(null);

      try {
        const dados = await getResumoDashboard();
        if (ativoRef.current) {
          setResumo(dados);
        }
      } catch {
        if (ativoRef.current) setErro(ERRO_CARREGAR);
      } finally {
        if (ativoRef.current) setLoading(false);
      }
    }

    carregar();

    return () => {
      ativoRef.current = false;
    };
  }, [tentativa]);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold text-text">Painel de Controle</h1>
        <p className="mt-1 text-sm text-text-muted">Resumo geral das ordens de serviço.</p>
      </div>

      <LoadingOverlay show={loading} label="Carregando dados do painel..." />

      {!loading && erro && (
        <div className="flex flex-col items-start gap-2 rounded-lg border border-status-cancelada-text/30 bg-status-cancelada-bg px-4 py-3 text-sm text-status-cancelada-text">
          <span>{erro}</span>
          <button
            type="button"
            onClick={() => setTentativa((n) => n + 1)}
            className="font-semibold underline"
          >
            Tentar novamente
          </button>
        </div>
      )}

      {!loading && !erro && resumo && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <SummaryCard
            label="Total de Ordens de Serviço"
            value={resumo.total}
            icon={ClipboardList}
            accentClass="text-primary"
          />

          <SummaryCard
            label="Faturamento Total"
            value={formatBRL(resumo.faturamento)}
            icon={DollarSign}
            accentClass="text-status-finalizada-text"
          />

          {STATUS_OS.map((status) => {
            const token = statusToToken[status];
            return (
              <SummaryCard
                key={status}
                label={status}
                value={resumo.porStatus[status] ?? 0}
                icon={STATUS_ICON[token]}
                accentClass={STATUS_ACCENT[token]}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
