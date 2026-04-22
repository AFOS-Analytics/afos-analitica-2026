/* eslint-disable react/no-unescaped-entities */
import { S } from '../../how-it-works/styles'

export function AutomatedGovEs() {
  return (
    <>
      <p className="text-center text-sm font-extrabold text-primary uppercase tracking-[0.25em] mb-3">Metodología</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-2 tracking-tight">
        Gobernanza Automatizada
      </h1>
      <p className="text-center text-gray-600 text-base font-medium mb-10">
        Cómo se generan los análisis de AFOS — reglas en código, no en humanos
      </p>

      <h2 id="el-modelo" className={S.h2}>Dos formas de interactuar con la plataforma alojada</h2>
      <p className={S.p}>
        AFOS Analytics tiene dos caminos distintos para interactuar con la instancia en <code>afos-analytics.com</code>.
        Esta separación es lo que permite que el proyecto sea <strong>open-source genuino</strong> en el código mientras
        mantiene <strong>calidad auditable</strong> en la plataforma alojada.
      </p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Camino</th>
              <th className={S.th}>Qué es</th>
              <th className={S.th}>Involucramiento AFOS</th>
              <th className={S.th}>Reglas</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}>
              <td className={S.tdTop}>🍴 <strong>Fork</strong></td>
              <td className={S.tdTop}>Copias el código y operas tu propia versión</td>
              <td className={S.tdTop}>Cero</td>
              <td className={S.tdTop}>Solo Apache 2.0 (atribución, archivo NOTICE, sin uso de la marca AFOS)</td>
            </tr>
            <tr>
              <td className={S.tdTop}>🔌 <strong>Country Onboarding</strong></td>
              <td className={S.tdTop}>Contribuyes configuración que onboarda un nuevo país en la plataforma alojada</td>
              <td className={S.tdTop}>Revisión técnica del PR, una vez</td>
              <td className={S.tdTop}>Reglas de integridad en código — aplicadas automáticamente</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={S.p}>
        <strong>Mejoras al código en sí</strong> (bugs, features, nuevos validadores) siguen el flujo estándar de
        open-source vía <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CONTRIBUTING.md</a>{' '}
        — nada especial, es solo un PR.
      </p>

      <h2 id="fork" className={S.h2}>Fork (Apache 2.0 puro)</h2>
      <p className={S.p}>
        El código de AFOS está licenciado bajo <strong>Apache 2.0</strong>. Cualquier persona puede forkar, modificar,
        operar una instancia propia, cambiar el prompt, remover reglas, cambiar fuentes, usar comercialmente. Esto no
        es bug — es el contrato del open-source serio.
      </p>
      <p className={S.p}>
        <strong>Responsabilidad del forker: todo.</strong> Si forkeas y publicas análisis sesgados, es tu operación,
        no AFOS. Si tu instancia cae, es tuya. Si monetizas, es tu derecho. Las únicas obligaciones son las de la
        licencia Apache 2.0 (mantener atribución en NOTICE, citar copyright original) y nuestra{' '}
        <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/TRADEMARK.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          política de trademark
        </a>{' '}
        — el código es libre, pero el nombre "AFOS Analytics" y el logo son marcas registradas. Los forks operan bajo nombre propio.
      </p>
      <p className={S.p}>
        Este modelo tiene precedente: Linux kernel, PostgreSQL, React, Kubernetes — todos permiten forks y ninguno se
        responsabiliza por lo que sucede en instancias de terceros. AFOS sigue la misma lógica.
      </p>
      <h3 className={S.h3}>Por qué los forks fortalecen AFOS en vez de debilitarlo</h3>
      <p className={S.p}>
        Los forks no son una amenaza — son validación. Si alguien encuentra suficiente valor en AFOS para replicarlo,
        eso prueba que el método funciona. PostgreSQL se beneficia de la existencia de Supabase, Neon, Aiven; Linux se
        beneficia de Red Hat, Ubuntu, SUSE; React se beneficia de Next.js, Remix. Cada fork comercial exitoso amplía el
        mercado del upstream en vez de reemplazarlo.
      </p>
      <p className={S.p}>
        <strong>El moat real de AFOS no está en el código</strong> (que es libre por diseño). Está en:
      </p>
      <ul className={S.ul}>
        <li><strong>Histórico de datos</strong> persistido en Neon desde el lanzamiento — los forkers empiezan desde cero</li>
        <li><strong>Autoridad SEO</strong> construida mediante citas, backlinks y menciones en prensa — lleva años replicar</li>
        <li><strong>Velocidad de ejecución</strong> de un solo founder vs un comité corporativo — decisiones en minutos, no semanas</li>
        <li><strong>Comunidad</strong> de primeros contribuyentes, reviewers y Country Onboardings completados</li>
        <li><strong>Marca</strong> protegida por trademark — obliga a quien copie el código a construir reputación desde cero</li>
      </ul>
      <p className={S.p}>
        Nada de eso es forkeable. Es precisamente por eso que AFOS puede ser 100% open-source sin miedo.
      </p>

      <h2 id="country-onboarding" className={S.h2}>Country Onboarding (contribución de configuración)</h2>
      <p className={S.p}>
        Si quieres ayudar a expandir la plataforma alojada de AFOS a nuevos países, contribuyes con{' '}
        <strong>Country Onboarding</strong>. Es una configuración, no trabajo editorial diario.
      </p>
      <p className={S.p}><strong>Qué envías en un PR:</strong></p>
      <ul className={S.ul}>
        <li>Mapeo de eventos de Polymarket relevantes para el país</li>
        <li>Source map de encuestas (qué encuestadoras importan y por qué)</li>
        <li>Source map de noticias (medios de referencia)</li>
        <li>Contexto político local (actores, temas recurrentes, glosario)</li>
        <li>Scaffolding técnico (rutas, traducciones)</li>
      </ul>
      <p className={S.p}>
        <strong>Qué NO envías:</strong> análisis escritos. La plataforma genera los análisis diarios automáticamente
        usando tu configuración + pipeline + reglas de integridad. <strong>Contribuye una vez, impacto permanente.</strong>
      </p>
      <p className={S.p}>
        Guía técnica paso a paso:{' '}
        <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/docs/platform/add-your-country.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          docs/platform/add-your-country.md
        </a>{' '}
        — ~2 horas de trabajo, 1 PR.
      </p>

      <h2 id="plataforma-alojada" className={S.h2}>Plataforma alojada (gobernanza en código)</h2>
      <p className={S.p}>
        La instancia en <code>afos-analytics.com</code> es operada por AFOS. Los análisis publicados bajo la marca
        AFOS cargan nuestra responsabilidad. La gobernanza aquí es <strong>aplicada en código</strong>, no por editores
        humanos revisando cada análisis.
      </p>
      <p className={S.p}>Tres razones técnicas para esto:</p>
      <ol className={S.ol}>
        <li><strong>Consistencia.</strong> Reglas en código se aplican idénticamente a 100 análisis o 100.000. Revisores humanos varían por día, humor, contexto.</li>
        <li><strong>Escala.</strong> Un editor humano ≈ 10 análisis/día en el límite. Un pipeline ≈ infinitos. Queremos el segundo.</li>
        <li><strong>Auditabilidad.</strong> Reglas en código viven en git history, versionables, diffables. Decisiones editoriales humanas viven en la cabeza del revisor.</li>
      </ol>

      <h3 className={S.h3}>Los validadores automáticos</h3>
      <p className={S.p}>
        Antes de publicar cualquier análisis, el pipeline ejecuta validadores. Si alguno falla, el análisis no publica hasta que la causa sea corregida:
      </p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Validador</th>
              <th className={S.th}>Qué revisa</th>
              <th className={S.th}>Acción en fallo</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>Regla de 2 fuentes</strong></td><td className={S.td}>Toda afirmación fáctica cita ≥ 2 fuentes independientes</td><td className={S.td}>Bloquea publicación, regenera</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Detector de adjetivos partidistas</strong></td><td className={S.td}>Scan de blocklist ("autoritario", "corrupto", "salvador"...)</td><td className={S.td}>Bloquea, regenera sin el término</td></tr>
            <tr className={S.trRow}><td className={S.td}><strong>Verificador de simetría</strong></td><td className={S.td}>FORTALEZAS y DEBILIDADES tienen profundidad comparable (ratio de caracteres, número de bullets)</td><td className={S.td}>Bloquea si ratio fuera del rango</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Triangulación cruzada</strong></td><td className={S.td}>El análisis referencia ≥ 2 de los 3 vectores (mercado, encuestas, noticias)</td><td className={S.td}>Bloquea, exige cita explícita</td></tr>
            <tr><td className={S.td}><strong>Frescura de datos</strong></td><td className={S.td}>Datos ingeridos ≤ 48h</td><td className={S.td}>Aborta pipeline si datos están obsoletos</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={S.h3}>Reglas en el prompt (calibración del LLM)</h3>
      <p className={S.p}>
        El prompt del LLM que genera análisis incluye explícitamente: "no uses adjetivos partidistas", "atribuye
        motivaciones solo cuando estén documentadas", "señala cuando las fuentes diverjan en vez de fabricar certeza".
        Esta calibración está versionada en git — consulta{' '}
        <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/lib/ai/prompts.ts" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-mono text-sm">
          lib/ai/prompts.ts
        </a>{' '}
        — cualquier cambio pasa por PR revisado.
      </p>

      <h2 id="excepciones" className={S.h2}>Las 3 excepciones honestas donde el humano interviene</h2>
      <p className={S.p}>La transparencia exige nombrar el ~5% de casos donde el humano es inescapable:</p>
      <ol className={S.ol}>
        <li>
          <strong>Source drift.</strong> Una encuestadora deja de publicar, un sitio cambia de URL, un evento Polymarket se
          resuelve. El pipeline lo señala vía monitoreo; un mantenedor actualiza la configuración del país.
        </li>
        <li>
          <strong>Bypass del validador.</strong> Casos raros donde el análisis generado pasa todos los validadores pero
          contiene error fáctico o sesgo sutil. Lectores reportan vía GitHub issue; los mantenedores investigan y corrigen
          (ajustando el prompt o configuración, no editando el análisis individual).
        </li>
        <li>
          <strong>Emergencia legal o ética.</strong> Riesgo de difamación, violación de ley electoral, intento coordinado
          de manipulación. Canal: <a href="mailto:contact@afos-analytics.com" className="text-primary hover:underline">contact@afos-analytics.com</a>.
          El take-down es posible y está documentado en un log público de incidentes.
        </li>
      </ol>
      <p className={S.p}>
        Estas excepciones son el caso raro. El caso normal es el pipeline corriendo autónomo 24/7.
      </p>

      <h2 id="por-que-zero-touch" className={S.h2}>Por qué "zero-touch" es diferencial, no limitación</h2>
      <p className={S.p}>
        Los medios tradicionales venden el "juicio editorial humano" como calidad. AFOS invierte: las reglas en código
        son más honestas porque son:
      </p>
      <ul className={S.ul}>
        <li><strong>Auditables.</strong> Cualquier lector puede abrir el repositorio y ver exactamente qué regla se aplicó. Imposible en una redacción tradicional.</li>
        <li><strong>Reproducibles.</strong> La misma entrada genera la misma salida. Garantía de que ningún caso recibe trato diferente según quién esté de turno.</li>
        <li><strong>Escalables.</strong> 14 países hoy, 40 mañana, sin contratar editores. El newsroom model moriría en 20 países.</li>
        <li><strong>Atacables directamente.</strong> Si crees que una regla está mal, abre issue. Si crees que el prompt está sesgado, abre issue. La crítica es técnica, no opinativa.</li>
      </ul>

      <h2 id="como-contribuir" className={S.h2}>Cómo contribuir</h2>
      <ul className={S.ul}>
        <li>📘 <strong>Entender el modelo:</strong> <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/CONTRIBUTING.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">CONTRIBUTING.md</a> — 3 roles, responsabilidades, reglas</li>
        <li>🌎 <strong>Onboardar un país:</strong> <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/blob/main/docs/platform/add-your-country.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Guía "Add your country"</a> — 5 pasos, ~2h, 1 PR</li>
        <li>🔧 <strong>Proponer antes de codear:</strong> <a href="https://github.com/AFOS-Analytics/afos-analitica-2026/issues/new?template=country-onboarding.md" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Template Country Onboarding</a></li>
        <li>💬 <strong>Duda o reporte de bypass:</strong> <a href="mailto:contact@afos-analytics.com" className="text-primary hover:underline">contact@afos-analytics.com</a></li>
      </ul>

      <p className={S.p}>
        El nombre del juego es <strong>APIs conectadas + reglas en código + mínima intervención humana</strong>. Así es
        como AFOS escala desde el Laboratorio Brasil hasta decenas de países sin convertirse en una redacción.
      </p>
    </>
  )
}
