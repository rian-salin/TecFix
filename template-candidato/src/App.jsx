import React from 'react';
import { supabase } from './supabaseClient';

function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '60px auto', fontFamily: 'system-ui, sans-serif', padding: '0 20px', lineHeight: '1.6' }}>
      <header style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '20px', marginBottom: '20px' }}>
        <h1 style={{ color: '#0f172a', fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.025em' }}>
          🛠️ TecFix - Controle de Ordens de Serviço
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.1rem', marginTop: '8px' }}>
          Desenvolva aqui a interface da sua aplicação integrada ao Supabase.
        </p>
      </header>
      
      <main>
        <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ color: '#1e293b', fontSize: '1.25rem', marginBottom: '12px' }}>Como iniciar:</h2>
          <ul style={{ paddingLeft: '20px', color: '#334155' }}>
            <li style={{ marginBottom: '8px' }}>Consulte o arquivo <code>INSTRUCOES.md</code> na raiz do repositório para ver os requisitos de negócio e banco de dados.</li>
            <li style={{ marginBottom: '8px' }}>Crie o seu arquivo <code>.env</code> a partir de <code>.env.example</code> e insira as credenciais do seu Supabase.</li>
            <li style={{ marginBottom: '8px' }}>Importe o cliente do banco usando: <code>import { supabase } from './supabaseClient';</code></li>
            <li>Fique livre para criar novos componentes, instalar pacotes de ícones ou frameworks de CSS (como Tailwind) para enriquecer o seu projeto.</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

export default App;
