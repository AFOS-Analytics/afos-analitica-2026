/* eslint-disable react/no-unescaped-entities */
import { Callout, Card, SectionIntro, NavFlag, SummaryFrame, TocCol, TocLink } from './components'
import { S } from './styles'

export function HowItWorksEs() {
  return (
    <>
      <p className="text-center text-sm font-extrabold text-primary uppercase tracking-[0.25em] mb-3">El Método</p>
      <h1 className="text-3xl md:text-4xl font-extrabold text-primary text-center mb-2 tracking-tight">Cómo funciona AFOS Analytics</h1>
      <p className="text-center text-gray-600 text-base font-medium mb-10">Guía didáctica para navegar la plataforma</p>

      <nav className="bg-white border border-blue-100 rounded-xl p-6 my-8 shadow-sm" aria-label="Tabla de contenidos">
        <div className="text-xs font-bold text-primary uppercase tracking-wider mb-4">Tabla de Contenidos</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <TocCol heading="Qué es AFOS">
            <TocLink href="#introducao">Por qué existe AFOS</TocLink>
            <TocLink href="#metodo">Cómo se cruzan los datos</TocLink>
            <TocLink href="#variacoes-pp">Entendiendo variaciones ↑↓pp</TocLink>
          </TocCol>
          <TocCol heading="Recorrido por la plataforma">
            <TocLink href="#header">1. Header</TocLink>
            <TocLink href="#modal-sobre">└ Modal Acerca de</TocLink>
            <TocLink href="#modal-metas">└ Modal Metas</TocLink>
            <TocLink href="#modal-global">└ Modal Global</TocLink>
            <TocLink href="#afos-daily-card">2. AFOS Daily, Síntesis Diaria</TocLink>
            <TocLink href="#cards-polymarket">3. 6 Cards Polymarket</TocLink>
            <TocLink href="#pesquisas">4. Encuestas Electorales</TocLink>
            <TocLink href="#criterios-institutos">└ Evaluación de encuestadoras</TocLink>
            <TocLink href="#analise-criteriosa">5. Análisis Detallado</TocLink>
            <TocLink href="#quadro-comparativo">6. Tabla Comparativa</TocLink>
            <TocLink href="#perfil-candidatos">7. Perfil de Candidatos</TocLink>
            <TocLink href="#paises">8. Países</TocLink>
            <TocLink href="#live-news">9. Live News 120'</TocLink>
            <TocLink href="#sentimento">10. Clima Político</TocLink>
            <TocLink href="#inss-lulinha">11. INSS y Caso Familiar del Incumbente</TocLink>
            <TocLink href="#banco-master">12. Banco Master</TocLink>
            <TocLink href="#stf">13. Credibilidad del STF</TocLink>
            <TocLink href="#footer">14. Footer</TocLink>
          </TocCol>
          <TocCol heading="Profundización">
            <TocLink href="#bastidores">Detrás de la plataforma</TocLink>
            <TocLink href="#perfis-usuario">Perfiles de usuarios</TocLink>
            <TocLink href="#limitacoes">Cuándo AFOS no sirve</TocLink>
            <TocLink href="#diferenciacao">Diferencia vs agregadores vs periódicos</TocLink>
            <TocLink href="#comece-aqui">Comienza aquí</TocLink>
          </TocCol>
        </div>
      </nav>

      <h2 id="introducao" className={S.h2}>Introducción, Por qué existe AFOS</h2>
      <p className={S.p}>Cada día abres un periódico y lees "Encuesta X dice que candidato Y tiene 37%". En otro, lees "32%". ¿A cuál creerle?</p>
      <p className={S.p}><strong className="text-primary">El problema:</strong> las encuestas electorales miden <em>intención declarada</em>, lo que la persona <em>dice</em> que hará. Pero la intención cambia, las encuestas tienen sesgo, y en Brasil ya salió mal varias veces (2018 y 2022 tuvieron grandes sorpresas).</p>
      <p className={S.p}><strong className="text-primary">La solución de AFOS:</strong> en lugar de confiar en UNA fuente, la plataforma cruza <strong>tres fuentes independientes en tiempo real</strong>:</p>

      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Fuente</th>
              <th className={S.th}>Qué mide</th>
              <th className={S.th}>Por qué importa</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}>
              <td className={S.tdTop}>🎯 <strong>Mercado de predicción, apuestas</strong> (Polymarket)</td>
              <td className={S.tdTop}>Donde gente real apuesta dinero real sobre quién ganará</td>
              <td className={S.tdTop}>Cuando alguien arriesga US$ 10.000, no miente por vanidad</td>
            </tr>
            <tr className={S.trAlt}>
              <td className={S.tdTop}>📊 <strong>Encuestadoras</strong> (17+ en Brasil, Datafolha, Quaest, AtlasIntel, Paraná Pesquisas, CNT/MDA, Veritá y otros)</td>
              <td className={S.tdTop}>Intención declarada en muestras</td>
              <td className={S.tdTop}>Captura el sentimiento del electorado tradicional</td>
            </tr>
            <tr>
              <td className={S.tdTop}>📰 <strong>Noticias en vivo</strong> (400+ fuentes vía Google News, grandes portales, agencias)</td>
              <td className={S.tdTop}>Narrativa del momento</td>
              <td className={S.tdTop}>Explica <em>por qué</em> cambiaron los números</td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className={S.p}>Cuando estas tres fuentes <strong>concuerdan</strong>, la previsión es robusta. Cuando <strong>divergen</strong>, es señal de que algo está en movimiento, y eso es información valiosísima.</p>

      <h2 id="metodo" className={S.h2}>Cómo se cruzan los datos (el método)</h2>
      <p className={S.p}>AFOS no hace estadística formal (regresión, modelos bayesianos). Hace algo diferente y más útil en el día a día: un <strong>cruce narrativo estructurado con reglas explícitas</strong>.</p>

      <h3 className={S.h3}>Regla de oro: convergencia vs divergencia</h3>
      <p className={S.p}>Para cada pregunta importante (ej: "¿quién gana la primera vuelta?"), la plataforma compara los valores de las 3 fuentes:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Situación</th>
              <th className={S.th}>Interpretación</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Diferencia Polymarket × Encuesta ≤ 3pp</td><td className={S.td}><strong>Convergencia</strong>, señal robusta, consenso</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Diferencia entre 3-5pp</td><td className={S.td}>Zona neutra, tensión leve</td></tr>
            <tr><td className={S.td}>Diferencia &gt; 5pp</td><td className={S.td}><strong>Divergencia</strong>, algo está cambiando, una fuente ve lo que la otra no</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={S.h3}>El oro está en la divergencia</h3>
      <p className={S.p}>Cuando Polymarket y las encuestas divergen, se investiga el porqué:</p>
      <ul className={S.ul}>
        <li><strong>Encuesta arriba, mercado abajo</strong> → o la encuesta está desactualizada/sesgada, o el mercado sabe algo (operación inminente, escándalo filtrándose)</li>
        <li><strong>Mercado arriba, encuesta abajo</strong> → o el mercado anticipa un giro, o es especulación con poco volumen</li>
      </ul>

      <h3 className={S.h3}>Ejemplo real, el salto y el retroceso del Candidato D</h3>
      <Callout title="18/Abr">
        <p>El Candidato D (gobernador regional) saltó en Polymarket "3er lugar" de 8.5% a 19.5% (↑11pp en 24h).</p>
        <ul>
          <li>Las encuestas todavía no lo habían captado</li>
          <li>Noticias mencionaban: "Candidato D puede ser vice del Candidato B"</li>
          <li><strong>Lectura AFOS:</strong> el dinero vio antes que la encuesta</li>
        </ul>
      </Callout>
      <Callout title="19/Abr">
        <p>El Candidato D cayó a 19% (↓0.5pp) y el presidencial retrocedió a 2.25% (↓0.85pp).</p>
        <ul>
          <li>El mercado desinfló la apuesta</li>
          <li>La articulación probablemente no se concretó</li>
          <li>Quien apostó demasiado rápido, perdió</li>
        </ul>
      </Callout>
      <p className={S.p}>Quien lee AFOS diariamente <strong>llega antes a la conclusión</strong>, porque ve el movimiento mientras ocurre, no después.</p>
      <SectionIntro>
        <strong>Nota de validez:</strong> los ejemplos concretos citados ilustran el <em>método</em>, no un punto definitivo. Este documento es revisado a medida que la plataforma evoluciona. Los datos en la plataforma están siempre en vivo.
      </SectionIntro>

      <h2 id="variacoes-pp" className={S.h2}>Entendiendo las variaciones ↑↓pp</h2>
      <p className={S.p}>"pp" = <strong>punto porcentual</strong>. Es la diferencia entre dos porcentajes. Diferente de "porcentaje".</p>
      <p className={S.p}><strong>Ejemplo:</strong> el Candidato A tenía 40%, hoy tiene 42%. Subió <strong>2 puntos porcentuales (2pp)</strong>. En términos relativos, es un crecimiento del 5% (2 sobre 40).</p>

      <h3 className={S.h3}>Por qué importan las variaciones pequeñas</h3>
      <p className={S.pTight}><strong>1. Liquidez:</strong> el Polymarket presidencial tiene US$ 54 millones en juego. Un cambio de 0.8pp significa que aproximadamente US$ 432 mil líquidos fueron reajustados. No es opinión, es compromiso financiero real.</p>
      <p className={S.pTight}><strong>2. Velocidad:</strong> 0.8pp en 1 día parece poco. Si sostiene el ritmo: 5.6pp por semana; 24pp por mes; reversión completa en 5 meses. Movimiento pequeño y persistente <strong>vence</strong> al movimiento grande y aislado.</p>
      <p className={S.p}><strong>3. Anticipación:</strong> cuando el mercado se mueve, se mueve <strong>antes</strong> del consenso de los periódicos. 48 horas después, vas a leer analistas diciendo lo que el mercado ya dijo.</p>

      <h3 className={S.h3}>Tabla de interpretación</h3>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Variación</th>
              <th className={S.th}>Qué significa</th>
              <th className={S.th}>Qué hacer</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>±0.0 a ±0.3pp</td><td className={S.td}>Ruido de mercado</td><td className={S.td}>Ignorar</td></tr>
            <tr className={S.trAlt}><td className={S.td}>±0.4 a ±1.0pp</td><td className={S.td}>Movimiento leve, dirección naciendo</td><td className={S.td}>Observar si persiste 2-3 días</td></tr>
            <tr className={S.trRow}><td className={S.td}>±1.0 a ±3.0pp</td><td className={S.td}>Movimiento significativo</td><td className={S.td}>Investigar noticias del día</td></tr>
            <tr className={S.trAlt}><td className={S.td}>±3.0 a ±5.0pp</td><td className={S.td}>Salto, algo grande pasó</td><td className={S.td}>Prioridad máxima</td></tr>
            <tr><td className={S.td}>±5.0pp+</td><td className={S.td}>Evento disruptivo</td><td className={S.td}>Releer todo el escenario</td></tr>
          </tbody>
        </table>
      </div>
      <blockquote className={S.quote}>
        <strong>Regla mental en una frase:</strong> "Un movimiento de 1pp es un tweet. 3pp es una entrevista. 5pp+ es un hecho consumado."
      </blockquote>

      <NavFlag title="Navegando la plataforma" description="Desde aquí, recorremos la plataforma en el orden en que la encuentras al abrir el sitio." />

      <h2 id="header" className={S.h2}>1. Header (parte superior)</h2>
      <p className={S.p}>En la parte superior ves el logo <strong>AFOS Analytics</strong> y tres botones de navegación:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}>Botón</th><th className={S.th}>Qué hace</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>Acerca de</strong></td><td className={S.td}>Explica la misión del proyecto, el problema que resuelve y el método</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Metas</strong></td><td className={S.td}>Muestra los objetivos públicos de la plataforma (cobertura de países, integración de fuentes, roadmap)</td></tr>
            <tr><td className={S.td}><strong>Global</strong></td><td className={S.td}>Vuelve al mapa mundial, útil cuando estás en medio de un análisis y quieres explorar otro país</td></tr>
          </tbody>
        </table>
      </div>
      <p className={S.p}>El header está presente en todas las páginas. Es el ancla de la navegación.</p>

      <Card title="Modal Acerca de" id="modal-sobre">
        <p>Hacer clic en <strong>Acerca de</strong> abre una ventana con 4 bloques: <em>Quiénes somos</em> (descripción de la plataforma y fuentes), <em>Para qué sirve</em> (preguntas que ayuda a responder), <em>Cómo usar</em> (perfiles sugeridos: elector, inversor, periodista) y <em>Qué significa AFOS</em> (sigla A-F-O-S: Astuteness, Fairness, Objectivity, Synthesis, los 4 valores que guían el proyecto).</p>
        <p>El modelo open-source está declarado: cualquier persona puede estudiar, auditar y contribuir. Los detalles de licenciamiento (Apache 2.0 para código, CC BY 4.0 para contenido editorial) están en el pie de página de todas las páginas y en la página de <a href="/es/terms" className="text-primary hover:underline">Términos de Uso</a>.</p>
      </Card>

      <Card title="Modal Metas" id="modal-metas">
        <p>Hacer clic en <strong>Metas</strong> abre el documento estratégico del proyecto: la tesis central (información política como infraestructura global), el impacto pretendido en tres dimensiones (económica, institucional, educacional) y el roadmap de cobertura por país.</p>
        <p>Aquí encuentras el "porqué" del proyecto: qué problema estructural resuelve, qué valor entrega a inversores institucionales, gobiernos, periodistas y ciudadanos. Es la página más densa institucionalmente, recomendada para quien evalúa la plataforma como aliada o referencia analítica.</p>
      </Card>

      <Card title="Modal Global" id="modal-global">
        <p>Hacer clic en <strong>Global</strong> abre el mapa mundial interactivo de las elecciones nacionales previstas para 2026 y años siguientes. Cada país con elección registrada aparece destacado, con volumen de mercado en Polymarket (cuando disponible) y candidato favorito según las odds.</p>
        <p>Actualmente, 14 países son monitoreados, con foco en América Latina (Brasil, Argentina, Chile, Colombia, Perú, México) y países clave globales (EE.UU., Francia, Reino Unido). Para cada uno, el card muestra fecha de la elección, principales candidatos y enlace a ficha detallada.</p>
        <p>Es la puerta de entrada para la expansión internacional de la plataforma. Si estás siguiendo una elección específica, el mapa global es el atajo más rápido para cambiar de contexto sin necesidad de volver a la home.</p>
      </Card>

      <h2 id="afos-daily-card" className={S.h2}>2. AFOS Daily, Síntesis Diaria</h2>
      <p className={S.p}>Justo debajo del header aparece el <strong>card AFOS Daily</strong>: un bloque azul claro con la fecha de hoy, un extracto de la síntesis narrativa del día (hasta 2 líneas) y un botón <strong>"Leer síntesis →"</strong>.</p>
      <p className={S.p}>Es la única pieza del dashboard que <strong>no es dato bruto</strong>, es una narrativa curada (~700 palabras, 4 minutos de lectura) cruzando las tres señales (mercado, encuesta, noticia) con enlace inline para cada afirmación. Publicada una vez al día, al final del día.</p>

      <Card title="Cómo funciona AFOS Daily">
        <p><strong>Estructura fija:</strong> lede de 2-3 líneas con 3 movimientos clave + 4 secciones numeradas (Mercado de predicción, Lo que las encuestadoras registraron, Lo que la prensa cubrió, Divergencias del día) + síntesis final en 3 bullets.</p>
        <p><strong>Reglas editoriales:</strong> cada afirmación con enlace inline a la fuente (mínimo 1 enlace por párrafo sustantivo); cero adjetivos partidarios; tono observacional ("el mercado precificó", "la encuesta registró"); fechas siempre explícitas (nunca "ayer"); variaciones ↑↓pp citadas.</p>
        <p><strong>Permalink permanente:</strong> cada día tiene URL propia (<code>/daily/2026-04-28</code>). Permite citar y enlazar una síntesis específica en redes sociales, reportajes o informes.</p>
        <p><strong>Histórico:</strong> dentro de la página de la síntesis, botones <strong>"← Síntesis anterior"</strong> y <strong>"Próxima síntesis →"</strong> navegan por los días del archivo.</p>
        <p><strong>3 idiomas:</strong> PT-BR · EN · ES. Cambiar de idioma preserva la fecha en lectura. Términos políticos brasileños sin traducción directa (TSE, STF, BolsoMaster, liderazgos envejecidos, etc.) quedan en portugués con enlace inline al <a href="/es/glossary" className="text-primary hover:underline">glosario</a> que los explica en 3 idiomas.</p>
        <p><strong>Tema visual:</strong> toggle en la esquina superior derecha alterna entre tema claro (predeterminado) y Sapphire Blue (fondo azul oscuro con texto claro, ideal para lectura nocturna).</p>
        <p><strong>Validación:</strong> la feature pasó por un piloto público de 7 días (22-28 de abril/2026) con decisión GO/NO-GO en el último día. Aprobada como feature permanente.</p>
      </Card>

      <p className={S.p}><strong>Cuándo vale la pena leer:</strong> cuando quieres entender <em>por qué</em> los números del dashboard se movieron, no solo <em>cuánto</em>. El dashboard muestra la foto del día; AFOS Daily explica la historia, con fuentes auditables para que verifiques cada paso.</p>

      <h2 id="cards-polymarket" className={S.h2}>3. Los 6 Cards Polymarket, Panel instantáneo</h2>
      <p className={S.p}>Justo después del header, aparecen <strong>seis cards lado a lado</strong> resumiendo los mercados más importantes de Polymarket en el momento. Cada card muestra un <strong>porcentaje</strong> (probabilidad precifada por el mercado) con la <strong>variación respecto al día anterior</strong> (↑↓pp).</p>

      <Card title="🏆 Card 1, Quién gana la presidencia en la 1ª vuelta">
        <p>Muestra las probabilidades de los principales candidatos de <strong>ganar en la primera vuelta</strong> (&gt;50% de votos válidos, evitando segunda vuelta).</p>
        <p><strong>Ejemplo hoy (19/Abr):</strong> Candidato B 39.6% × Candidato A 39.5% → <em>empate técnico</em>. Ninguno con chance real de victoria en la 1ª vuelta.</p>
        <p><strong>Cómo leer:</strong> si un candidato pasa de 50%, el mercado cree en victoria directa; por debajo de eso, habrá segunda vuelta.</p>
      </Card>
      <Card title="🥈 Card 2, Quién queda en 2º lugar">
        <p>Muestra la probabilidad de <strong>cada candidato ser el subcampeón</strong> (llegar a la segunda vuelta en segunda posición).</p>
        <p><strong>Ejemplo hoy:</strong> Candidato B 66.5% (↑0.5pp) × Candidato A 17% (↑1pp) × Candidato C 6.7%.</p>
        <p><strong>Cómo leer:</strong> este mercado <strong>consolida el escenario de segunda vuelta</strong>. Si el Candidato B lidera con 66.5%, significa que el dinero ve <em>casi seguro</em> que disputa la segunda vuelta, sin importar contra quién.</p>
      </Card>
      <Card title="🥉 Card 3, Quién queda en 3er lugar">
        <p>Muestra los favoritos a quedar en <strong>3ª posición</strong>, es decir, fuera de la segunda vuelta, pero con influencia decisiva (transfieren votos).</p>
        <p><strong>Ejemplo hoy:</strong> Candidato C 32% × Candidato D 19% × Candidato F 3.95%.</p>
        <p><strong>Cómo leer:</strong> este es el <strong>termómetro de la tercera vía</strong>. Cuando un nombre sube fuerte aquí (como el Candidato D de 8.5% → 19.5% el 18/Abr), el mercado está precificando una articulación política relevante.</p>
      </Card>
      <Card title="⚖️ Card 4, STF (Impeachment de ministro)">
        <p>Muestra la probabilidad de <strong>algún ministro del STF sufrir impeachment antes de 2027</strong>.</p>
        <p><strong>Ejemplo hoy:</strong> 11.5% (↓1.5pp, cayendo -4.5pp en 2 días).</p>
        <p><strong>Cómo leer:</strong> este número es el <strong>riesgo institucional</strong> precifado. Cuando sube, hay tensión real entre Congreso y STF. Cuando baja, el mercado cree que el sistema "se acomodará".</p>
      </Card>
      <Card title="🏛️ Card 5, Senado (Partido con más escaños)">
        <p>Muestra la probabilidad de <strong>cada partido ganar la mayoría de escaños</strong> en la elección del Senado 2026.</p>
        <p><strong>Ejemplo hoy:</strong> PL 76.5% (↓3pp) × MDB 10.5% × PSD 5.1% × União 3.1% × PT 2.4%.</p>
        <p><strong>Cómo leer:</strong> el Senado <strong>condiciona el próximo gobierno</strong>. Un presidente sin base en el Senado gobierna poco. Cuando el PL baja (↓3pp), el mercado precifica un escenario diferente de 2022, cuando el gobierno tuvo Senado adverso.</p>
      </Card>
      <Card title="📈 Card 6, Inflación 2026">
        <p>Muestra la probabilidad de <strong>en qué franja cerrará la inflación anual de 2026</strong>.</p>
        <p><strong>Ejemplo hoy:</strong> 5.00-5.49% tiene 39.45% de probabilidad (↑2.75pp) × 4.50-4.99%: 33.75% × 4.00-4.49%: 9.45%.</p>
        <p><strong>Cómo leer:</strong> este es el <strong>termómetro económico</strong>. La inflación alta presiona al gobierno, favorece a la oposición. Cuando la franja 5.00-5.49% se dispara (↑2.75pp en 1 día), el mercado está diciendo "olvídate de inflación baja", con consecuencia electoral directa.</p>
      </Card>

      <h2 id="pesquisas" className={S.h2}>4. Encuestas Electorales</h2>
      <p className={S.p}>Debajo de los cards Polymarket, encuentras la sección de encuestas electorales.</p>

      <h3 className={S.h3}>Cómo llegan las encuestas aquí</h3>
      <p className={S.p}>Todas las encuestas registradas en el <strong>TSE (Tribunal Superior Electoral) de Brasil</strong> son descargadas automáticamente todos los días. La base cuenta con <strong>más de 150 encuestas indexadas</strong> y crece con aproximadamente <strong>2 a 4 nuevas encuestas registradas por semana</strong>, ritmo que acelera a medida que avanza el ciclo electoral.</p>

      <h3 className={S.h3}>Encuestadoras monitoreadas</h3>
      <p className={S.p}>La plataforma acompaña más de 17 encuestadoras brasileñas. Las más frecuentes en el último mes:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}>Encuestadora</th><th className={S.th}>Encuestas recientes</th><th className={S.th}>Muestra promedio</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Paraná Pesquisas</td><td className={S.td}>3</td><td className={S.td}>1.593 entrevistados</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Datafolha</td><td className={S.td}>2</td><td className={S.td}>1.513</td></tr>
            <tr className={S.trRow}><td className={S.td}>100 Cidades</td><td className={S.td}>2</td><td className={S.td}>1.400</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Instituto Piauiense</td><td className={S.td}>2</td><td className={S.td}>800</td></tr>
            <tr><td className={S.td}>Veritá</td><td className={S.td}>1</td><td className={S.td}>1.220</td></tr>
          </tbody>
        </table>
      </div>

      <h3 className={S.h3}>Saber no solo lo que dicen las encuestas, sino lo que van a decir</h3>
      <p className={S.p}>Por la legislación brasileña, toda encuestadora está obligada a <strong>registrar cada encuesta en el TSE antes de divulgarla</strong>, con protocolo único, fecha de campo (cuándo está siendo aplicada), fecha prevista de publicación, tamaño de la muestra y costo. Este registro es <strong>público</strong> y queda disponible en la base oficial del TSE en el momento en que la encuestadora lo envía.</p>
      <p className={S.p}><strong>Ahí es donde entra la inteligencia de AFOS:</strong> la plataforma ejecuta ciclos automáticos de ingesta a lo largo del día consultando el TSE directamente. Cuando una encuesta nueva es registrada en la base oficial, en pocas horas ya está procesada, cruzada con Polymarket y mostrada en tu pantalla, <strong>sin depender de un periodista que la cubra o de nota oficial de la encuestadora</strong>.</p>

      <h3 className={S.h3}>Qué ves en cada encuesta</h3>
      <ul className={S.ul}>
        <li><strong>Encuestadora</strong> (ej: Paraná Pesquisas, Datafolha, Quaest)</li>
        <li><strong>Protocolo TSE</strong> (identificador único, auditable)</li>
        <li><strong>Campo:</strong> fechas en que los entrevistadores están recogiendo respuestas</li>
        <li><strong>Publicación prevista:</strong> cuándo la encuestadora divulgará el resultado</li>
        <li><strong>Muestra:</strong> número de entrevistados</li>
        <li><strong>Status:</strong> "publicada" (ya salió) o "campo activo" (todavía siendo aplicada)</li>
      </ul>

      <h3 className={S.h3}>Ejemplo real hoy (19/Abr)</h3>
      <blockquote className={S.quote}>
        Paraná Pesquisas, nacional, campo <strong>21-23/Abr (en curso)</strong>, publicación prevista <strong>24/Abr</strong>, muestra 1.680
      </blockquote>
      <p className={S.p}>Sabes <strong>con 5 días de anticipación</strong> que el jueves habrá una encuesta nacional de Paraná Pesquisas con casi 1.700 entrevistados.</p>
      <Callout title="Valor para ti">
        <p>La prensa y los analistas tradicionales solo descubren una encuesta <strong>cuando la encuestadora la divulga públicamente</strong>, y eso puede ser 5 a 10 días después del registro. AFOS la descubre <strong>el mismo día que el registro entra en el TSE</strong>, porque sus ciclos de ingesta operan automáticamente en intervalos de pocas horas. Esto transforma la lógica: dejas de <strong>reaccionar a noticias</strong> y pasas a <strong>anticiparlas</strong>.</p>
      </Callout>

      <h3 id="criterios-institutos" className={S.h3Anchor}>Criterios de evaluación de encuestadoras</h3>
      <p className={S.p}>Además de listar las encuestas, AFOS muestra en el dashboard un card llamado <strong>"Encuestadoras Monitoreadas, Confiabilidad"</strong>, donde cada encuestadora recibe una clasificación de 1 a 5 estrellas. Esta clasificación sirve como <strong>regla de peso editorial</strong> para ayudar al lector a decidir cuánto confiar cuando dos encuestas divergen.</p>
      <p className={S.p}><strong>Naturaleza de la clasificación:</strong> es una evaluación <em>editorial cualitativa</em>, no un score calculado automáticamente. Refleja el consenso público del mercado electoral brasileño (analistas, periodistas especializados, literatura metodológica). Funciona como primera aproximación honesta; la evolución hacia un score cuantitativo está en el roadmap de AFOS tras el ciclo electoral.</p>

      <h4 className={S.h4}>Los 5 criterios considerados</h4>
      <div className="overflow-x-auto my-4">
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Criterio</th>
              <th className={S.th}>Qué mide</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>Historial de precisión</strong></td><td className={S.td}>Cuánto acertó la encuestadora en elecciones pasadas (dentro del margen declarado). Ej: MDA tiene historial robusto de aciertos en ciclos anteriores.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Metodología de recolección</strong></td><td className={S.td}>Presencial (más representativa), Online (sesgo digital), Telefónica (sesgo demográfico), Mixta. La metodología aparece entre paréntesis en el card: "(Presencial)", "(Online)", etc.</td></tr>
            <tr className={S.trRow}><td className={S.td}><strong>Tradición y tiempo en el mercado</strong></td><td className={S.td}>Cuántos ciclos electorales cubrió la encuestadora. La tradición larga reduce el riesgo de error metodológico sistémico.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>Quién encarga</strong></td><td className={S.td}>Proxy indirecto de exigencia de calidad. Encuestas encargadas por bancos, inversores o grandes medios tienden a tener mayor rigor (costo típico R$100k-300k).</td></tr>
            <tr><td className={S.td}><strong>Frecuencia y alcance</strong></td><td className={S.td}>Cuántas encuestas publica, con qué regularidad, y si cubre escenarios nacionales, estatales o solo locales.</td></tr>
          </tbody>
        </table>
      </div>

      <h4 className={S.h4}>Escala de estrellas e interpretación</h4>
      <div className="overflow-x-auto my-4">
        <table className={S.table}>
          <thead>
            <tr>
              <th className={S.th}>Nivel</th>
              <th className={S.th}>Significado</th>
              <th className={S.th}>Cómo leer las encuestas de esta encuestadora</th>
            </tr>
          </thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}><strong>★★★★★</strong></td><td className={S.td}>Referencia nacional</td><td className={S.td}>Citar sin reservas. El dato suele ser robusto y auditable.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>★★★★</strong></td><td className={S.td}>Alta confiabilidad</td><td className={S.td}>Dato sólido. Bueno para formar opinión, idealmente con comparación cruzada.</td></tr>
            <tr className={S.trRow}><td className={S.td}><strong>★★★</strong></td><td className={S.td}>Confiable</td><td className={S.td}>Usar, pero siempre comparar con al menos 1-2 encuestas más del mismo período.</td></tr>
            <tr className={S.trAlt}><td className={S.td}><strong>★★</strong></td><td className={S.td}>Usar con precaución</td><td className={S.td}>Citar siempre con reservas. Historial metodológico inconsistente o encuestadora muy reciente.</td></tr>
            <tr><td className={S.td}><strong>★</strong></td><td className={S.td}>Baja confiabilidad</td><td className={S.td}>Evitar basar decisiones solo en esta fuente. Ninguna encuestadora brasileña está en este nivel actualmente.</td></tr>
          </tbody>
        </table>
      </div>

      <h4 className={S.h4}>Fuentes consultadas para la clasificación</h4>
      <ul className={S.ul}>
        <li><strong>Resultados electorales oficiales del TSE</strong>, comparación pública entre previsiones y resultados de urnas en ciclos anteriores (2018, 2022)</li>
        <li><strong>Literatura metodológica brasileña</strong>, ABEP (Asociación Brasileña de Empresas de Investigación), artículos académicos sobre precisión de encuestas electorales, análisis metodológicos en FGV y Poder360</li>
        <li><strong>Consenso periodístico especializado</strong>, analistas políticos de referencia (Folha, Estadão, O Globo, Poder360) que históricamente pesan las encuestadoras de forma similar</li>
        <li><strong>Historial público del TSE</strong>, protocolos de registro, tamaño de muestra, costo declarado, frecuencia de publicación (todos públicos y auditables)</li>
        <li><strong>Sitios web de las propias encuestadoras</strong>, metodología declarada, divulgación de cuestionario, transparencia sobre ponderación y estratificación</li>
      </ul>

      <Callout title="Limitación honesta">
        <p>La clasificación actual es <strong>editorial y subjetiva</strong>. Dos personas evaluando los mismos criterios podrían llegar a notas ligeramente diferentes. Para reducir esta subjetividad a largo plazo, el <strong>roadmap de AFOS prevé evolución hacia un score cuantitativo</strong> basado en datos históricos del TSE + resultados oficiales, tasa de acierto, error medio absoluto, muestra ponderada, frecuencia y transparencia metodológica, con cálculo reproducible publicado. Plazo dependiente de datos del ciclo electoral de octubre/2026.</p>
      </Callout>

      <h2 id="analise-criteriosa" className={S.h2}>5. Análisis Detallado (de los 4 primeros candidatos)</h2>
      <p className={S.p}>Esta es la sección más rica y la que exige lectura más lenta.</p>
      <p className={S.p}>El análisis se divide en <strong>4 secciones</strong>: Candidato A, Candidato B, Candidato C, y una sección agrupada con los candidatos D, E y F. Cada sección tiene <strong>tres bloques</strong>: FORTALEZAS, DEBILIDADES y ANÁLISIS.</p>

      <h3 className={S.h3}>🟢 Bloque "FORTALEZAS"</h3>
      <p className={S.p}>Todo lo que está jugando a favor del candidato <strong>ese día</strong>, con <strong>fuente, fecha y medio citados</strong>. No es opinión, es dato auditable.</p>
      <blockquote className={S.quote}>
        <strong>Ejemplo Candidato A hoy:</strong> "POLYMARKET (19/Abr): 39.5% (estable) mientras el Candidato B se desinfla. 2º lugar Poly Candidato A SUBE 17% (↑1pp). Folha: 'Candidato A intensifica agenda dirigida a las mujeres'. Poder360: 'Las mujeres se vuelven foco central'."
      </blockquote>

      <h3 className={S.h3}>🔴 Bloque "DEBILIDADES"</h3>
      <p className={S.p}>Todo lo que está <strong>en contra</strong> del candidato, con la misma profundidad que las fortalezas. AFOS es <strong>simétrico</strong>.</p>
      <blockquote className={S.quote}>
        <strong>Ejemplo Candidato A hoy:</strong> "Candidato B mantiene liderazgo mínimo. Paraná Pesquisas SP: 2da vuelta Candidato B 48.1% × Candidato A 40.3%. BNews: caída Candidato A / crecimiento Candidato B en el Nordeste. Gazeta do Povo: 'Cómo el Candidato A derritió su ventaja de 2022'."
      </blockquote>

      <h3 className={S.h3}>🔵 Bloque "ANÁLISIS"</h3>
      <p className={S.p}>La costura. Cómo los puntos de fortalezas y debilidades se conectan, y qué significa estratégicamente en ese momento.</p>

      <h2 id="quadro-comparativo" className={S.h2}>6. Tabla Comparativa</h2>
      <p className={S.p}>Una única tabla que resume candidato por candidato:</p>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}>Candidato</th><th className={S.th}>Encuesta vigente</th><th className={S.th}>Polymarket</th><th className={S.th}>Tendencia</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Candidato A (PT)</td><td className={S.td}>37% 1ª vuelta (Quaest) / 39.2% (CNT/MDA)</td><td className={S.td}>39.5% (estable)</td><td className={S.td}>Empate técnico con Candidato B</td></tr>
            <tr className={S.trAlt}><td className={S.td}>Candidato B (PL)</td><td className={S.td}>32% 1ª vuelta (Quaest) / 35.9% (Veritá)</td><td className={S.td}>39.6% (↓0.8pp)</td><td className={S.td}>Desinfla salto, mantiene liderazgo mínimo</td></tr>
            <tr className={S.trRow}><td className={S.td}>Candidato C (Missão)</td><td className={S.td}>4.4% (AtlasIntel)</td><td className={S.td}>6.25% (estable)</td><td className={S.td}>3er lugar recupera (Candidato D retrocede)</td></tr>
            <tr><td className={S.td}>...</td><td className={S.td}>...</td><td className={S.td}>...</td><td className={S.td}>...</td></tr>
          </tbody>
        </table>
      </div>
      <Callout title="Valor para ti">
        <p>En una sola mirada, ves el estado completo del juego.</p>
      </Callout>

      <h2 id="perfil-candidatos" className={S.h2}>7. Perfil de Candidatos</h2>
      <p className={S.p}>Esta sección presenta cada candidato en <strong>cards individuales</strong> con cinco campos:</p>
      <ul className={S.ul}>
        <li><strong>Nombre, partido, edad, cargo actual</strong></li>
        <li><strong>Polymarket:</strong> porcentaje actual en el mercado presidencial</li>
        <li><strong>Encuesta:</strong> número más reciente de intención de voto</li>
        <li><strong>Posicionamiento:</strong> ideología resumida (centro-izquierda, derecha liberal, etc.)</li>
        <li><strong>⚠️ Riesgo:</strong> el resumen del día, qué puede cambiar, qué está bajo presión, qué favorece</li>
      </ul>
      <Callout title="Valor para ti">
        <p>Es un "quién es quién" rápido. Si alguien pregunta "¿quién es el Candidato C?", abres, lees 20 segundos y respondes con datos.</p>
      </Callout>

      <h2 id="paises" className={S.h2}>8. Países, Botones Clicables</h2>
      <p className={S.p}>La plataforma cubre <strong>14+ países</strong> con elecciones monitoreadas. Cada país aparece como un botón clicable. Clickeando uno, ves el mismo tipo de cruce (Polymarket + encuestas locales + noticias) aplicado a esa elección.</p>
      <p className={S.p}><strong>Países en destaque actualmente:</strong> Brasil, EE.UU., Francia, Alemania, Reino Unido, Canadá, Australia, Corea del Sur, Colombia, Chile, entre otros.</p>
      <p className={S.p}><strong>Por qué importa:</strong> las decisiones políticas globales se influencian. El resultado de EE.UU. 2024 afecta la dinámica de Brasil 2026. Ver el mapa completo te da contexto.</p>

      <h2 id="live-news" className={S.h2}>9. Live Elecciones News 120'</h2>
      <p className={S.p}>Un feed en vivo que muestra las <strong>noticias publicadas en los últimos 120 minutos</strong> relacionadas con las elecciones monitoreadas. Las fuentes incluyen Google News, grandes portales brasileños y agencias internacionales.</p>
      <p className={S.p}><strong>Cómo funciona:</strong> cada 30 minutos, un robot busca noticias en 6 categorías diferentes (elección presidencial, candidatos específicos, escándalos, encuestas, aprobación del gobierno, disputas estatales) y en los 3 idiomas de la plataforma (PT-BR, EN, ES). El feed muestra las más relevantes en orden cronológico.</p>
      <Callout title="Valor para ti">
        <p>En lugar de abrir 10 pestañas de periódicos, tienes lo esencial en una única pantalla, filtrado por relevancia electoral.</p>
      </Callout>

      <h2 id="sentimento" className={S.h2}>10. Clima Político</h2>
      <p className={S.p}>Un panel dedicado a mostrar <strong>el clima general de la disputa</strong> en cuatro lentes simultáneas:</p>
      <ul className={S.ul}>
        <li><strong>Derecha:</strong> lo que está jugando a favor/en contra de los candidatos de derecha</li>
        <li><strong>Izquierda:</strong> ídem para candidatos de izquierda</li>
        <li><strong>Tercera vía:</strong> cómo se mueven los candidatos fuera del eje Candidato A / Candidato B</li>
        <li><strong>Polymarket consolidado:</strong> el número único del día que resume el escenario</li>
      </ul>
      <Callout title="Valor para ti">
        <p>En 30 segundos tienes la <strong>temperatura política</strong> del momento, sin necesidad de leer ningún análisis largo.</p>
      </Callout>

      <h2 id="inss-lulinha" className={S.h2}>11. Escándalo INSS y el Caso del Familiar del Incumbente</h2>
      <p className={S.p}>Card específico sobre el mayor escándalo económico de 2026, el fraude de los descuentos indebidos en el INSS (sistema de pensiones), y las ramificaciones que involucran a un familiar del incumbente.</p>
      <p className={S.p}><strong>Qué muestra:</strong> texto estructurado en 4 bloques:</p>
      <ul className={S.ul}>
        <li><strong>Contexto actual</strong> del caso (novedades del día)</li>
        <li><strong>Dinámica institucional</strong> (Congreso, PF, PGR, STF)</li>
        <li><strong>Impacto en el STF</strong> (probabilidad de impeachment en Polymarket)</li>
        <li><strong>Campo político</strong> (cómo el escándalo afecta a Candidato A vs Candidato B)</li>
      </ul>
      <Callout title="Valor para ti">
        <p>Un tema que involucra decenas de actores (ministros, senadores, delegados, jueces) queda <strong>consolidado en 2 minutos de lectura</strong>, con las conexiones ya hechas.</p>
      </Callout>

      <h2 id="banco-master" className={S.h2}>12. Impacto del Escándalo Banco Master</h2>
      <p className={S.p}>Card enfocado en el caso Banco Master y la delación del ejecutivo involucrado, otro escándalo económico que se despliega por capítulos.</p>
      <p className={S.p}><strong>Qué muestra:</strong></p>
      <ul className={S.ul}>
        <li>Últimos desarrollos (ej: el Banco Central aprobó el control del ejecutivo después de rechazarlo primero)</li>
        <li>Tensiones institucionales (Policía Federal × Procuraduría General, Comisión × STF)</li>
        <li>Cruce con Polymarket (¿el mercado cree en impeachment de ministro?)</li>
        <li>Consecuencias electorales</li>
      </ul>
      <Callout title="Valor para ti">
        <p>Al ser una historia <strong>larga y fragmentada</strong> en la prensa, tener un diario consolidado ahorra horas de búsqueda.</p>
      </Callout>

      <h2 id="stf" className={S.h2}>13. Credibilidad del STF, Impacto Electoral</h2>
      <p className={S.p}>Card dedicado a la <strong>lectura del Supremo como actor electoral</strong>, porque el STF, aunque no vota, influye decisivamente en las elecciones.</p>
      <p className={S.p}><strong>Qué muestra:</strong></p>
      <ul className={S.ul}>
        <li><strong>Ministro por ministro</strong> (Ministro 1, Ministro 2, Ministro 3, Ministro 4): qué está haciendo cada uno</li>
        <li><strong>Nexo:</strong> cómo las acciones individuales se conectan en estrategia institucional</li>
        <li><strong>Análisis:</strong> interpreta Polymarket, ¿el mercado espera ruptura (impeachment) o acomodación?</li>
      </ul>
      <blockquote className={S.quote}>
        <strong>Ejemplo hoy:</strong> "STF impeach cae 11.5% (↓1.5pp, -4.5pp en 2 días). El Supremo quiere endurecer las CPIs. Ministro 1 puede declararse impedido en el caso BRB."
      </blockquote>
      <p className={S.p}><strong>Traducción:</strong> el STF se está <strong>blindando</strong>. El mercado siente que no habrá impeachment, lo que reduce el riesgo para candidatos que apostarían a una ruptura institucional.</p>
      <Callout title="Valor para ti">
        <p>Entender al STF como <strong>actor político</strong>, no solo jurídico.</p>
      </Callout>

      <h2 id="footer" className={S.h2}>14. Footer (pie de página)</h2>
      <p className={S.p}>El footer se organiza en <strong>tres bloques enjutos</strong>, cada uno con propósito claro. Ningún link en el footer apunta a página vacía, cada uno entrega algo específico.</p>

      <h3 className={S.h3}>Bloque 1, Navegación</h3>
      <p className={S.pTight}>Atajos a las áreas principales de la plataforma:</p>
      <ul className={S.ul}>
        <li><strong>Dashboard</strong>, aplicación principal con los 6 cards Polymarket, análisis y cards temáticos</li>
        <li><strong>Mapa Global</strong>, visualización D3.js interactiva de los 14+ países monitoreados</li>
        <li><strong>América Latina</strong>, hub regional con Brasil, Colombia, Chile y México</li>
        <li><strong>Europa</strong>, hub regional con Francia, Alemania y Reino Unido</li>
      </ul>

      <h3 className={S.h3}>Bloque 2, Open Source</h3>
      <p className={S.pTight}>Transparencia completa sobre el proyecto, según el estándar de referencia en software open-source:</p>
      <ul className={S.ul}>
        <li><strong>Licencia Apache 2.0</strong>, uso, modificación y redistribución permitidos con atribución</li>
        <li><strong>⭐ GitHub</strong>, repositorio público con código fuente auditable</li>
        <li><strong>Seguridad</strong>, política de <em>disclosure</em> responsable para vulnerabilidades</li>
        <li><strong>Contribuir</strong>, guía para desarrolladores externos que quieran enviar mejoras</li>
        <li><strong>Código de Conducta</strong>, reglas de convivencia en la comunidad (Contributor Covenant)</li>
      </ul>

      <h3 className={S.h3}>Bloque 3, Contáctenos</h3>
      <p className={S.pTight}>Cuatro canales de email segmentados por propósito:</p>
      <ul className={S.ul}>
        <li>📧 <strong>Contacto</strong>, prensa, asociaciones y asuntos generales</li>
        <li>💬 <strong>Soporte</strong>, ayuda para uso de la plataforma</li>
        <li>🔒 <strong>Seguridad</strong>, reporte confidencial de vulnerabilidades</li>
        <li>👤 <strong>Founder</strong>, contacto directo con el fundador</li>
      </ul>

      <h3 className={S.h3}>Pie final</h3>
      <p className={S.p}>Línea inferior con identificación de la plataforma, fuentes de datos con frecuencias reales ("Polymarket 5min, 17+ Encuestadoras TSE, Google News 30min"), disclaimer de no afiliación con Polymarket y botón "volver arriba".</p>
      <Callout title="Por qué el footer es así">
        <p>Muchos sitios llenan el pie con decenas de links decorativos que no funcionan o llevan a páginas vacías. AFOS optó por lo opuesto: <strong>pocos links, todos funcionales</strong>. Si un link aparece en el footer, entrega algo real al clickear. Es la misma filosofía de proyectos open-source maduros como Supabase, Linear y Prisma.</p>
      </Callout>

      <div className="h-px bg-gray-200 my-12" />

      <h2 id="bastidores" className={S.h2}>Detrás de la plataforma</h2>
      <h3 className={S.h3}>Los datos llegan solos</h3>
      <p className={S.p}>Todo lo que lees viene de pipelines automatizados que funcionan 24 horas al día:</p>
      <ul className={S.ul}>
        <li><strong>Cada 30 minutos:</strong> Polymarket es consultado y los porcentajes actualizados</li>
        <li><strong>Cada 30 minutos:</strong> las noticias son recogidas en 6 categorías temáticas y 3 idiomas</li>
        <li><strong>Diariamente:</strong> nuevas encuestas registradas en el TSE son descargadas e indexadas</li>
        <li><strong>Dos veces al día (12h y 18h BRT):</strong> se ejecuta el cruce completo de las 3 fuentes, comparando el estado actual con el del día anterior (variaciones ↑↓pp), y se persiste en la base de datos para formar un historial auditable</li>
      </ul>

      <h3 className={S.h3}>Análisis generados por IA a partir de datos públicos</h3>
      <p className={S.p}>Los análisis detallados (los bloques <strong>Fortalezas</strong>, <strong>Debilidades</strong>, <strong>Análisis</strong>, el <strong>Cruce</strong> y los <strong>cuatro cards temáticos</strong>) son generados por <strong>inteligencia artificial</strong> que:</p>
      <ol className={S.ol}>
        <li>Lee los valores actuales de las 3 fuentes</li>
        <li>Compara con los valores del día anterior</li>
        <li>Consulta las noticias más relevantes de las últimas 24 horas</li>
        <li>Aplica las reglas de convergencia/divergencia descritas anteriormente</li>
        <li>Escribe la narrativa resultante, citando fuentes, fechas y medios</li>
      </ol>
      <p className={S.p}>Todos los datos usados son <strong>públicos y auditables</strong>, cualquiera puede verificar Polymarket, encuestas del TSE o noticias citadas.</p>
      <Callout title="Por qué es importante decirlo">
        <p>La transparencia sobre el uso de IA es estándar moderno, y es lo que diferencia un proyecto serio de uno opaco.</p>
      </Callout>

      <h2 id="perfis-usuario" className={S.h2}>Perfiles de usuarios</h2>
      <Card title="👤 Ciudadano curioso">
        <p><strong>Visita:</strong> 2x por semana, 5 minutos cada vez.</p>
        <p><strong>Qué hace:</strong> lee los 6 cards Polymarket + el card Clima Político.</p>
        <p><strong>Valor:</strong> se mantiene informado sin consumir periódicos sesgados. Forma opinión basada en datos.</p>
      </Card>
      <Card title="👤 Profesional (analista, consultor, periodista, asesor)">
        <p><strong>Visita:</strong> diariamente, 15 minutos.</p>
        <p><strong>Qué hace:</strong> lee el análisis detallado completo + la tabla comparativa + el feed de noticias 120'. Anota variaciones.</p>
        <p><strong>Valor:</strong> entiende antes que los competidores que el juego cambió. Cita fuentes auditables.</p>
      </Card>
      <Card title="👤 Inversor / gestor de riesgo">
        <p><strong>Visita:</strong> diariamente, 20 minutos.</p>
        <p><strong>Qué hace:</strong> lee Polymarket consolidado + card STF + card Inflación + card Banco Master. Cruza con posiciones del portafolio.</p>
        <p><strong>Valor:</strong> el riesgo político es <strong>precio de activo</strong>. Saber antes que el mercado precifique una inelegibilidad o un escándalo = ventaja concreta en trade/hedge.</p>
      </Card>

      <h2 id="limitacoes" className={S.h2}>Cuándo AFOS no sirve (limitaciones honestas)</h2>
      <p className={S.p}>Ninguna plataforma es útil para todas las preguntas. Ser honesto sobre lo que AFOS <em>no</em> entrega es lo que separa una herramienta seria de una promesa vaga.</p>

      <h3 className={S.h3}>AFOS no sustituye investigación estadística formal</h3>
      <p className={S.p}>Si necesitas <strong>margen de error, intervalo de confianza o muestreo científico controlado</strong> (en lenguaje simple: números con precisión matemática certificada y metodología auditable de muestreo), la fuente es la <strong>encuestadora</strong> (Datafolha, Quaest, IBGE, etc.). AFOS consolida y cruza estos datos, pero no produce encuesta nueva.</p>

      <h3 className={S.h3}>AFOS no predice resultados con precisión cuantitativa</h3>
      <p className={S.p}>El cruce es <strong>narrativo estructurado</strong>, no modelo estadístico. La plataforma no entrega previsiones con precisión matemática calculada. Entrega <strong>dirección, ritmo y convergencia</strong>, lecturas cualitativas útiles para apoyar decisión, pero que no sustituyen el modelado matemático formal que académicos y fondos cuantitativos usan.</p>

      <h3 className={S.h3}>AFOS depende de la calidad de los mercados de predicción</h3>
      <p className={S.p}>En países donde <strong>Polymarket no tiene mercados activos</strong> o tiene mercados con liquidez muy baja (por debajo de US$ 100 mil en volumen), la señal de mercado se vuelve ruidosa. AFOS señala estos casos, pero la confianza de los datos cae proporcionalmente.</p>

      <h3 className={S.h3}>AFOS no es recomendación de inversión ni de voto</h3>
      <p className={S.p}>Es <strong>información estructurada para apoyar decisión</strong>. La decisión sobre portafolio, apuestas o voto es responsabilidad exclusiva de quien usa. La plataforma no opera con cliente, no recibe comisión y no tiene conflicto de interés declarado, justamente para no tener que recomendar nada.</p>

      <h3 className={S.h3}>La cobertura actual está restringida a 14+ países</h3>
      <p className={S.p}>Los países fuera de esta lista no tienen pipeline de recolección específico. El mapa global muestra agregados, pero la profundidad de análisis (cruce encuestas × Polymarket × noticias) solo existe donde la infraestructura está lista. La expansión es continua, pero no universal.</p>

      <h2 id="diferenciacao" className={S.h2}>Qué hace diferente a AFOS de Google News o un periódico</h2>
      <div className={S.tableWrap}>
        <table className={S.table}>
          <thead><tr><th className={S.th}></th><th className={S.th}>Periódico tradicional</th><th className={S.th}>Google News</th><th className={S.th}>AFOS</th></tr></thead>
          <tbody>
            <tr className={S.trRow}><td className={S.td}>Sesgo editorial</td><td className={S.td}>Alto</td><td className={S.td}>Medio</td><td className={S.td}><strong>Transparente (muestra ambos lados)</strong></td></tr>
            <tr className={S.trAlt}><td className={S.td}>¿Integra dinero real?</td><td className={S.td}>No</td><td className={S.td}>No</td><td className={S.td}><strong>Sí, mercado de predicción</strong></td></tr>
            <tr className={S.trRow}><td className={S.td}>¿Cruza múltiples fuentes?</td><td className={S.td}>No</td><td className={S.td}>Agrega pero no cruza</td><td className={S.td}><strong>Sí, con lógica y método</strong></td></tr>
            <tr className={S.trAlt}><td className={S.td}>¿Muestra cambio en el tiempo?</td><td className={S.td}>No</td><td className={S.td}>No</td><td className={S.td}><strong>Sí (↑↓pp variaciones diarias)</strong></td></tr>
            <tr className={S.trRow}><td className={S.td}>¿Open source?</td><td className={S.td}>No</td><td className={S.td}>No</td><td className={S.td}><strong>Sí, Apache 2.0</strong></td></tr>
            <tr><td className={S.td}>¿Cuesta?</td><td className={S.td}>Suscripción</td><td className={S.td}>Gratis pero limitado</td><td className={S.td}><strong>100% gratis, sin login</strong></td></tr>
          </tbody>
        </table>
      </div>

      <h2 id="comece-aqui" className={S.h2}>Comienza aquí</h2>
      <p className={S.p}>Si es tu primera visita, este es el camino más rápido para extraer valor en <strong>5 minutos</strong>:</p>
      <Card title="Paso 1, Abre el Dashboard">
        <p>Los <strong>6 Cards Polymarket</strong> en la parte superior ya dan el panorama del día. Lee en orden: <em>1ª vuelta</em> → <em>2º lugar</em> → <em>STF</em> → <em>Senado</em>. Enfoque en las variaciones <strong>↑↓pp</strong>, dicen qué se movió desde ayer.</p>
      </Card>
      <Card title="Paso 2, Baja hasta el Análisis Detallado">
        <p>Elige un candidato que te interese y lee los bloques <strong>FORTALEZAS</strong> y <strong>DEBILIDADES</strong> lado a lado. Vas a sentir incomodidad honesta leyendo los puntos contra tu preferido, eso es señal de que el método funciona. AFOS muestra los dos lados de cada número.</p>
      </Card>
      <Card title="Paso 3, Consulta el Card Clima Político">
        <p>El resumen visual del clima político del día en <strong>30 segundos</strong>. Derecha, izquierda, 3ª vía y Polymarket consolidado, todo en una pantalla.</p>
      </Card>
      <Callout title="Después de eso">
        <p>Vuelve <strong>mañana</strong>. El valor real de AFOS aparece en la secuencia: un día da contexto, tres días dan patrón, una semana da tendencia. Leer una única vez es informarse; leer diariamente es <strong>anticipar</strong>.</p>
      </Callout>

      <SummaryFrame>
        AFOS Analytics es la primera plataforma que combina mercados de predicción con dinero real, encuestas oficiales y noticias en tiempo real para mostrar, con honestidad y transparencia, lo que los datos realmente dicen sobre política, sin sesgo, sin propaganda, libre y sin registro obligatorio.
      </SummaryFrame>

      <p className="text-center text-xs text-gray-400 mt-10 mb-2">Actualizado en abril de 2026</p>
    </>
  )
}
