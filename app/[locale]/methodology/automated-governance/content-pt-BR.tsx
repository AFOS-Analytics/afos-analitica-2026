/* eslint-disable react/no-unescaped-entities */
import { S } from '../../how-it-works/styles'

export function AutomatedGovPtBR() {
  return (
    <>
      <p className="text-center text-sm font-extrabold text-primary uppercase tracking-[0.25em] mb-3">Metodologia</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-2 tracking-tight">
        Governança Automatizada
      </h1>
      <p className="text-center text-gray-600 text-base font-medium mb-10">
        Como as análises do AFOS são geradas — regras em código, não em humanos
      </p>

      <h2 id="o-modelo" className={S.h2}>Duas formas de interagir com a plataforma hospedada</h2>
      <p className={S.p}>
        AFOS Analytics tem dois caminhos distintos de interação com a instância em <code>afos-analytics.com</code>.
        Essa separação é o que permite o projeto ser <strong>open-source verdadeiro</strong> no código enquanto
        mantém <strong>qualidade auditável</strong> na plataforma hospedada.
      </p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Caminho</th>
              <th className={S.th}>O que é</th>
              <th className={S.th}>Envolvimento AFOS</th>
              <th className={S.th}>Regras</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}>
              <td className={S.tdTop}>🍴 <strong>Fork</strong></td>
              <td className={S.tdTop}>Você copia o código e roda sua versão</td>
              <td className={S.tdTop}>Zero</td>
              <td className={S.tdTop}>Só Apache 2.0 (atribuição, NOTICE file, sem uso da marca AFOS)</td>
            </tr>
            <tr>
              <td className={S.tdTop}>🔌 <strong>Country Onboarding</strong></td>
              <td className={S.tdTop}>Você contribui configuração que onboarda um novo país na plataforma hospedada</td>
              <td className={S.tdTop}>Revisão técnica do PR, uma vez</td>
              <td className={S.tdTop}>Regras de integridade em código — aplicadas automaticamente</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={S.p}>
        <strong>Melhorias no código em si</strong> (bugs, features, novos validadores) seguem o fluxo padrão de
        open-source via <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CONTRIBUTING.md</a>{' '}
        — nada de especial, é só um PR.
      </p>

      <h2 id="fork" className={S.h2}>Fork (Apache 2.0 puro)</h2>
      <p className={S.p}>
        O código do AFOS é licenciado <strong>Apache 2.0</strong>. Qualquer pessoa pode forkar, modificar, operar
        uma instância própria, trocar o prompt, remover regras, mudar fontes, usar comercialmente. Isso não é bug —
        é o contrato do open-source sério.
      </p>
      <p className={S.p}>
        <strong>Responsabilidade do forker:</strong> tudo. Se você forkar e publicar análises enviesadas, isso é
        sua operação, não do AFOS. Se sua instância cair, é sua. Se você monetizar, é seu direito. As únicas
        obrigações são as da licença Apache 2.0 (atribuição no NOTICE, citar copyright original) e da nossa{' '}
        <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/TRADEMARK.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          política de trademark
        </a>{' '}
        — o código é livre, mas o nome "AFOS Analytics" e o logo são marcas registradas. Forks operam sob nome próprio.
      </p>
      <p className={S.p}>
        Esse modelo tem precedente: Linux kernel, PostgreSQL, React, Kubernetes — todos permitem forks e nenhum se
        responsabiliza pelo que acontece em instâncias terceiras. AFOS segue a mesma lógica.
      </p>
      <h3 className={S.h3}>Por que forks fortalecem o AFOS em vez de enfraquecer</h3>
      <p className={S.p}>
        Forks não são ameaça — são validação. Se alguém encontra valor suficiente no AFOS para replicar, isso prova
        que o método funciona. PostgreSQL se beneficia da existência de Supabase, Neon, Aiven; Linux se beneficia de
        Red Hat, Ubuntu, SUSE; React se beneficia de Next.js, Remix. Cada fork comercial bem-sucedido amplia o mercado
        do upstream, não substitui.
      </p>
      <p className={S.p}>
        <strong>O moat real do AFOS não está no código</strong> (que é livre por design). Está em:
      </p>
      <ul className={S.ul}>
        <li><strong>Histórico de dados</strong> persistido no Neon desde o lançamento — forkers começam do zero</li>
        <li><strong>Autoridade SEO</strong> construída com citações, backlinks e menções em imprensa — leva anos pra replicar</li>
        <li><strong>Velocidade de execução</strong> de solo-founder vs comitê corporativo — decisões em minutos, não semanas</li>
        <li><strong>Comunidade</strong> de primeiros contribuidores, reviewers e Country Onboardings concluídos</li>
        <li><strong>Marca</strong> protegida por trademark — força quem copiar o código a construir reputação do zero</li>
      </ul>
      <p className={S.p}>
        Nada disso é forkável. É exatamente por isso que o AFOS pode ser 100% open-source sem medo.
      </p>

      <h2 id="country-onboarding" className={S.h2}>Country Onboarding (contribuição de configuração)</h2>
      <p className={S.p}>
        Se você quer ajudar a expandir a plataforma hospedada do AFOS para novos países, contribui com{' '}
        <strong>Country Onboarding</strong>. É uma configuração, não trabalho editorial diário.
      </p>
      <p className={S.p}><strong>O que você envia em um PR:</strong></p>
      <ul className={S.ul}>
        <li>Mapeamento de eventos do Polymarket relevantes para o país</li>
        <li>Source map de pesquisas (quais institutos importam e por quê)</li>
        <li>Source map de notícias (veículos de referência)</li>
        <li>Contexto político local (atores, temas recorrentes, glossário)</li>
        <li>Scaffolding técnico (rotas, traduções)</li>
      </ul>
      <p className={S.p}>
        <strong>O que você NÃO envia:</strong> análises escritas. A plataforma gera as análises diárias automaticamente
        usando sua configuração + pipeline + regras de integridade. <strong>Contribua uma vez, impacto permanente.</strong>
      </p>
      <p className={S.p}>
        Guia técnico passo-a-passo:{' '}
        <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/docs/platform/add-your-country.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          docs/platform/add-your-country.md
        </a>{' '}
        — ~2 horas de trabalho, 1 PR.
      </p>

      <h2 id="plataforma-hospedada" className={S.h2}>Plataforma hospedada (governança em código)</h2>
      <p className={S.p}>
        A instância em <code>afos-analytics.com</code> é operada pelo AFOS. Análises publicadas sob a marca AFOS
        carregam nossa responsabilidade. A governança aqui é <strong>aplicada em código</strong>, não por editores
        humanos revisando cada análise.
      </p>
      <p className={S.p}>Três razões técnicas para isso:</p>
      <ol className={S.ol}>
        <li><strong>Consistência.</strong> Regras em código aplicam-se identicamente a 100 análises ou 100.000. Revisor humano varia por dia, humor, contexto.</li>
        <li><strong>Escala.</strong> 1 editor humano ≈ 10 análises/dia no limite. 1 pipeline ≈ infinitas. Queremos o segundo.</li>
        <li><strong>Auditabilidade.</strong> Regras em código vivem em git history, versionáveis, diff-áveis. Decisões editoriais humanas vivem na cabeça do revisor.</li>
      </ol>

      <h3 className={S.h3}>Os validadores automáticos</h3>
      <p className={S.p}>
        Antes de publicar qualquer análise, o pipeline roda validadores. Se algum falhar, a análise não publica até a causa ser corrigida:
      </p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Validador</th>
              <th className={S.th}>O que checa</th>
              <th className={S.th}>Ação em falha</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>Regra de 2 fontes</strong></td><td className={S.td}>Toda alegação factual cita ≥ 2 fontes independentes</td><td className={S.td}>Bloqueia publicação, regera</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Detector de adjetivos partidários</strong></td><td className={S.td}>Scan de blocklist ("autoritário", "corrupto", "salvador"...)</td><td className={S.td}>Bloqueia, regera sem o termo</td></tr>
            <tr className={S.trRow}><td className={S.td}><strong>Verificador de simetria</strong></td><td className={S.td}>FORTES e FRACOS têm profundidade comparável (ratio de caracteres, número de bullets)</td><td className={S.td}>Bloqueia se ratio fora da faixa</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Triangulação cruzada</strong></td><td className={S.td}>Análise referencia ≥ 2 dos 3 vetores (mercado, pesquisas, notícias)</td><td className={S.td}>Bloqueia, exige citação explícita</td></tr>
            <tr><td className={S.td}><strong>Frescor de dados</strong></td><td className={S.td}>Dados ingeridos ≤ 48h</td><td className={S.td}>Aborta pipeline se dados obsoletos</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={S.h3}>Regras no prompt (calibração do LLM)</h3>
      <p className={S.p}>
        O prompt do LLM que gera análises inclui explicitamente: "não use adjetivos partidários", "atribua motivações
        apenas quando documentadas", "sinalize quando fontes divergirem em vez de fabricar certeza". Essa calibração é
        versionada em git — veja{' '}
        <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/lib/ai/prompts.ts" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-sm">
          lib/ai/prompts.ts
        </a>{' '}
        — qualquer mudança passa por PR revisado.
      </p>

      <h2 id="excecoes" className={S.h2}>As 3 exceções honestas onde humano intervém</h2>
      <p className={S.p}>
        Transparência exige nomear os ~5% dos casos onde humano é inescapável:
      </p>
      <ol className={S.ol}>
        <li>
          <strong>Source drift.</strong> Um instituto para de publicar, um site muda URL, um evento Polymarket resolve.
          Pipeline sinaliza via monitoria; mantenedor atualiza a configuração do país.
        </li>
        <li>
          <strong>Bypass de validador.</strong> Caso raro em que a análise gerada passa em todos os validadores mas
          contém erro factual ou viés sutil. Leitor reporta via GitHub issue; mantenedor investiga e corrige (ajustando
          prompt ou configuração, não editando a análise individual).
        </li>
        <li>
          <strong>Emergência legal ou ética.</strong> Risco de difamação, violação de lei eleitoral, tentativa coordenada
          de manipulação. Canal: <a href="mailto:contact@afos-analytics.com" className="text-primary hover:underline">contact@afos-analytics.com</a>.
          Take-down é possível e documentado em log público de incidentes.
        </li>
      </ol>
      <p className={S.p}>
        Essas exceções são o caso raro. O caso normal é pipeline rodando autônomo 24/7.
      </p>

      <h2 id="por-que-zero-touch" className={S.h2}>Por que "zero-touch" é diferencial, não limitação</h2>
      <p className={S.p}>
        Jornais tradicionais vendem "julgamento editorial humano" como qualidade. AFOS inverte: regras em código são
        mais honestas porque:
      </p>
      <ul className={S.ul}>
        <li><strong>Auditáveis.</strong> Qualquer leitor pode abrir o repositório e ver exatamente qual regra foi aplicada. Impossível em redação tradicional.</li>
        <li><strong>Reproduzíveis.</strong> A mesma entrada gera a mesma saída. Garantia que nenhum caso recebe tratamento diferente por quem estava de plantão.</li>
        <li><strong>Escaláveis.</strong> 14 países hoje, 40 amanhã, sem contratar editor. Newsroom model morreria em 20 países.</li>
        <li><strong>Ataques diretos.</strong> Se achar que uma regra está errada, abra issue. Se achar que o prompt está enviesado, abra issue. A crítica é técnica, não opinativa.</li>
      </ul>

      <h2 id="como-contribuir" className={S.h2}>Como contribuir</h2>
      <ul className={S.ul}>
        <li>📘 <strong>Entender o modelo:</strong> <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CONTRIBUTING.md</a> — 3 roles, responsabilidades, regras</li>
        <li>🌎 <strong>Onboardar um país:</strong> <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/docs/platform/add-your-country.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Guia "Add your country"</a> — 5 passos, ~2h, 1 PR</li>
        <li>🔧 <strong>Propor antes de codar:</strong> <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/issues/new?template=country-onboarding.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Template Country Onboarding</a></li>
        <li>💬 <strong>Dúvida ou reporte de bypass:</strong> <a href="mailto:contact@afos-analytics.com" className="text-primary hover:underline">contact@afos-analytics.com</a></li>
      </ul>

      <p className={S.p}>
        O nome do jogo é <strong>APIs conectadas + regras em código + mínima intervenção humana</strong>. É assim que o AFOS escala do Laboratório Brasil para dezenas de países sem virar newsroom.
      </p>
    </>
  )
}
