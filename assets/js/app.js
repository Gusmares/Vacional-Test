/* =========================================================
   APP
   Telas: intro -> personal -> section (intro da etapa) -> question -> result
   Os cliques usam data-action (delegação de eventos), sem onclick no HTML.
   ========================================================= */

const CHATGPT_URL = 'https://chatgpt.com/';

const MOMENTOS = {
  ensino_medio: 'Estou no ensino médio',
  pre_vestibular: 'Estou me preparando para o vestibular ou Enem',
  faculdade: 'Estou na faculdade ou em curso técnico',
  trabalhando_mudar: 'Já trabalho e quero crescer ou mudar de área',
  sem_trabalho: 'Estou sem trabalho e quero me recolocar',
  outro: 'Outro momento',
};

const state = {
  screen: 'intro', // intro | personal | section | question | result
  tier: 'equilibrado',
  si: 0, // índice da seção
  qi: 0, // índice da pergunta dentro da seção
  personal: {},
  answers: {},
  respondentId: null,
  startTime: null,
  endTime: null,
};

let plan = null;
let advanceTimer = null;
let promptText = '';
const PLANS = {};

/* ---------- utilidades ---------- */
const $ = (sel, root = document) => root.querySelector(sel);
const appEl = () => document.getElementById('app');

function getPlan(tier) {
  if (!PLANS[tier]) PLANS[tier] = buildTest(tier);
  return PLANS[tier];
}

function esc(str) {
  return String(str === null || str === undefined ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function render(html) {
  clearTimeout(advanceTimer);
  const el = appEl();
  el.innerHTML = html;
  window.scrollTo(0, 0);
}

function persist() {
  Storage.save(state);
}

function currentSection() {
  return plan.sections[state.si];
}
function currentQuestion() {
  return currentSection().questions[state.qi];
}

const ICON = {
  arrow: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M3 9h12M10 4l5 5-5 5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  back: '<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 4l-6 6 6 6" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3 8.5l3.2 3.2L13 4.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  copy: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><rect x="6" y="6" width="9" height="9" rx="2" stroke="currentColor" stroke-width="1.7"/><path d="M12 6V4.5A1.5 1.5 0 0010.5 3h-6A1.5 1.5 0 003 4.5v6A1.5 1.5 0 004.5 12H6" stroke="currentColor" stroke-width="1.7"/></svg>',
  external: '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true"><path d="M8 4H5a2 2 0 00-2 2v7a2 2 0 002 2h7a2 2 0 002-2v-3M11 3h4v4M15 3l-6 6" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* ---------- inicialização ---------- */
document.addEventListener('DOMContentLoaded', init);

function init() {
  Storage.clearLegacy();
  appEl().addEventListener('click', onClick);
  appEl().addEventListener('input', onInput);
  document.addEventListener('keydown', onKey);

  const saved = Storage.load();
  if (saved && saved.tier && TIERS[saved.tier] && saved.answers && Object.keys(saved.answers).length > 0) {
    if (saved.screen === 'result') {
      restore(saved);
      return renderResult();
    }
    return renderResume(saved);
  }
  renderIntro();
}

function restore(saved) {
  Object.assign(state, {
    screen: saved.screen,
    tier: saved.tier,
    si: saved.si || 0,
    qi: saved.qi || 0,
    personal: saved.personal || {},
    answers: saved.answers || {},
    respondentId: saved.respondentId,
    startTime: saved.startTime,
    endTime: saved.endTime,
  });
  plan = getPlan(state.tier);
  if (state.si >= plan.sections.length) state.si = 0;
  if (state.qi >= currentSection().questions.length) state.qi = 0;
}

function generateId() {
  return 'R' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

/* ---------- retomar ---------- */
function renderResume(saved) {
  const p = getPlan(saved.tier);
  const done = Object.keys(saved.answers).length;
  const pct = Math.min(100, Math.round((done / p.meta.total) * 100));
  render(`
    <div class="page fade">
      <div class="brand">Teste Vocacional</div>
      <div class="card resume">
        <h1 class="h2">Você tem um teste em andamento</h1>
        <p class="muted">Versão ${esc(p.meta.nome)}, ${pct}% respondido${saved.personal && saved.personal.nome ? ' por ' + esc(saved.personal.nome) : ''}. Quer continuar de onde parou?</p>
        <div class="stack">
          <button class="btn btn-primary btn-block" data-action="resume">Continuar</button>
          <button class="btn btn-ghost btn-block" data-action="fresh">Começar do zero</button>
        </div>
      </div>
    </div>
  `);
}

/* ---------- intro ---------- */
function includesLine(tierKey) {
  const names = { atividades: 'interesses', habilidades: 'habilidades', jeito: 'jeito de ser', valores: 'valores', dia: 'dia a dia', momento: 'seu momento', abertas: 'perguntas escritas' };
  return Object.keys(names)
    .filter((k) => TIERS[tierKey].counts[k] > 0)
    .map((k) => names[k])
    .join(', ');
}

function renderIntro() {
  state.screen = 'intro';
  const tiers = Object.keys(TIERS).map((k) => ({ k, t: TIERS[k], m: getPlan(k).meta }));

  render(`
    <div class="page fade">
      <div class="brand">Teste Vocacional</div>

      <h1 class="h1">Descubra quais carreiras combinam com você</h1>
      <p class="lead">Você responde perguntas simples e, no final, recebe um texto pronto para colar no ChatGPT. Ele devolve uma análise completa do seu perfil, com profissões, cursos e um plano para testar antes de decidir.</p>

      <section class="how" aria-labelledby="how-title">
        <h2 class="h3" id="how-title">Como funciona</h2>
        <ol class="how-list">
          <li><span class="how-n">1</span><span><strong>Escolha o tamanho.</strong> Rápido, Equilibrado ou Completo. Quanto mais perguntas, mais precisa fica a análise.</span></li>
          <li><span class="how-n">2</span><span><strong>Responda com sinceridade.</strong> Não existe resposta certa. Vale o primeiro impulso.</span></li>
          <li><span class="how-n">3</span><span><strong>Copie o texto final.</strong> No fim, um botão copia tudo para você.</span></li>
          <li><span class="how-n">4</span><span><strong>Cole no ChatGPT e envie.</strong> A versão gratuita já resolve. A análise sai em segundos.</span></li>
        </ol>
      </section>

      <section aria-labelledby="tier-title">
        <h2 class="h3" id="tier-title">Escolha o tamanho do teste</h2>
        <div class="tiers" role="radiogroup" aria-labelledby="tier-title">
          ${tiers
            .map(
              ({ k, t, m }) => `
            <button type="button" class="tier ${state.tier === k ? 'sel' : ''}" role="radio" aria-checked="${state.tier === k}" data-action="tier" data-tier="${k}">
              <span class="tier-dot" aria-hidden="true"></span>
              <span class="tier-body">
                <span class="tier-head">
                  <span class="tier-name">${esc(t.nome)}</span>
                  ${t.recomendado ? '<span class="tier-flag">Recomendado</span>' : ''}
                </span>
                <span class="tier-meta">${m.total} perguntas &middot; ${m.minMin} a ${m.minMax} min</span>
                <span class="tier-desc">${esc(t.desc)}</span>
                <span class="tier-inc">Mede: ${esc(includesLine(k))}.</span>
              </span>
            </button>`
            )
            .join('')}
        </div>
      </section>

      <p class="privacy">Suas respostas ficam só neste aparelho e nada é enviado para nenhum servidor. O texto só chega ao ChatGPT quando você mesmo colar lá.</p>

      <div class="actionbar">
        <button class="btn btn-primary btn-block" data-action="to-personal">Continuar ${ICON.arrow}</button>
      </div>
    </div>
  `);
}

/* ---------- dados pessoais ---------- */
function renderPersonal() {
  state.screen = 'personal';
  const p = state.personal;
  render(`
    <div class="page fade">
      <div class="topline">
        <button class="icon-btn" data-action="to-intro" aria-label="Voltar">${ICON.back}</button>
        <span class="topline-text">Antes de começar</span>
      </div>

      <h1 class="h2">Um pouco sobre você</h1>
      <p class="muted">Essas informações ajudam a análise a falar a sua língua e a respeitar o seu momento.</p>

      <form class="form" data-form="personal" novalidate>
        <div class="field">
          <label for="nome">Como podemos te chamar?</label>
          <input id="nome" name="nome" type="text" autocomplete="given-name" enterkeyhint="next" placeholder="Só o primeiro nome" maxlength="40" value="${esc(p.nome || '')}" />
          <p class="field-error" id="err-nome" hidden>Informe seu primeiro nome.</p>
        </div>
        <div class="field">
          <label for="idade">Idade</label>
          <input id="idade" name="idade" type="number" inputmode="numeric" enterkeyhint="next" min="12" max="80" placeholder="Ex.: 17" value="${esc(p.idade || '')}" />
          <p class="field-error" id="err-idade" hidden>Informe uma idade entre 12 e 80.</p>
        </div>
        <div class="field">
          <label for="momento">Seu momento</label>
          <select id="momento" name="momento">
            <option value="">Selecione</option>
            ${Object.keys(MOMENTOS)
              .map((k) => `<option value="${k}" ${p.momento === k ? 'selected' : ''}>${esc(MOMENTOS[k])}</option>`)
              .join('')}
          </select>
          <p class="field-error" id="err-momento" hidden>Escolha a opção que mais se parece com você.</p>
        </div>
        <div class="field">
          <label for="cidade">Cidade e estado <span class="opt-tag">opcional</span></label>
          <input id="cidade" name="cidade" type="text" autocomplete="address-level2" enterkeyhint="done" placeholder="Ex.: Goiânia, GO" maxlength="60" value="${esc(p.cidade || '')}" />
        </div>
      </form>

      <div class="actionbar">
        <button class="btn btn-primary btn-block" data-action="submit-personal">Começar o teste ${ICON.arrow}</button>
      </div>
    </div>
  `);
}

function submitPersonal() {
  const nome = $('#nome').value.trim();
  const idadeRaw = $('#idade').value.trim();
  const idade = Number(idadeRaw);
  const momento = $('#momento').value;
  const cidade = $('#cidade').value.trim();

  const checks = [
    ['nome', !nome],
    ['idade', !idadeRaw || isNaN(idade) || idade < 12 || idade > 80],
    ['momento', !momento],
  ];
  let firstBad = null;
  checks.forEach(([id, bad]) => {
    $('#err-' + id).hidden = !bad;
    $('#' + id).classList.toggle('invalid', bad);
    if (bad && !firstBad) firstBad = id;
  });
  if (firstBad) {
    $('#' + firstBad).focus();
    return;
  }

  state.personal = { nome, idade, momento, momentoLabel: MOMENTOS[momento], cidade };
  state.answers = {};
  state.respondentId = generateId();
  state.startTime = new Date().toISOString();
  state.endTime = null;
  state.si = 0;
  state.qi = 0;
  plan = getPlan(state.tier);
  renderSectionIntro();
}

/* ---------- abertura de etapa ---------- */
function progressPct() {
  const q = state.screen === 'section' ? currentSection().questions[0] : currentQuestion();
  return Math.round((q.index / plan.meta.total) * 100);
}

function renderSectionIntro() {
  state.screen = 'section';
  const sec = currentSection();
  const sc = sec.scale ? SCALES[sec.scale] : null;
  const n = sec.questions.length;
  persist();

  render(`
    <div class="page fade">
      <div class="progress" aria-hidden="true"><div class="progress-fill" style="width:${progressPct()}%"></div></div>
      <div class="topline">
        <button class="icon-btn" data-action="${state.si === 0 ? 'to-personal' : 'back-from-section'}" aria-label="Voltar">${ICON.back}</button>
        <span class="topline-text">Etapa ${state.si + 1} de ${plan.sections.length}</span>
      </div>

      <h1 class="h1 section-title">${esc(sec.title)}</h1>
      <p class="lead">${esc(sec.intro)}</p>

      ${
        sc
          ? `<div class="scale-box">
              <p class="scale-ask">${esc(sc.ask)}</p>
              <ol class="scale-list">
                ${sc.labels.map((l, i) => `<li><span class="scale-n">${i + 1}</span>${esc(l)}</li>`).join('')}
              </ol>
            </div>`
          : `<div class="scale-box"><p class="scale-ask">Resposta livre, no seu ritmo.</p></div>`
      }

      <p class="muted center">${n} ${sec.kind === 'open' ? (n === 1 ? 'pergunta' : 'perguntas') : n === 1 ? 'frase' : 'frases'} nesta etapa</p>

      <div class="actionbar">
        <button class="btn btn-primary btn-block" data-action="start-section">Começar ${ICON.arrow}</button>
      </div>
    </div>
  `);
}

/* ---------- pergunta ---------- */
function renderQuestion() {
  state.screen = 'question';
  const sec = currentSection();
  const q = currentQuestion();
  persist();

  const head = `
    <div class="qhead">
      <div class="progress" aria-hidden="true"><div class="progress-fill" style="width:${progressPct()}%"></div></div>
      <div class="qhead-row">
        <button class="icon-btn" data-action="prev" aria-label="Pergunta anterior">${ICON.back}</button>
        <span class="qhead-sec">${esc(sec.title)}</span>
        <span class="qhead-count">${q.index + 1} de ${plan.meta.total}</span>
      </div>
    </div>`;

  if (q.type === 'likert') {
    const sc = SCALES[q.scale];
    const cur = state.answers[q.id];
    render(`
      <div class="page fade page-q">
        ${head}
        <main class="qmain">
          <p class="q-ask">${esc(sc.ask)}</p>
          <h1 class="q-text">${esc(q.text)}</h1>
          <div class="options" role="radiogroup" aria-label="${esc(sc.ask)}">
            ${sc.labels
              .map(
                (label, i) => `
              <button type="button" class="opt ${cur === i + 1 ? 'sel' : ''}" role="radio" aria-checked="${cur === i + 1}" data-action="answer" data-value="${i + 1}">
                <span class="opt-num">${i + 1}</span>
                <span class="opt-label">${esc(label)}</span>
              </button>`
              )
              .join('')}
          </div>
        </main>
      </div>
    `);
  } else {
    const cur = state.answers[q.id] || '';
    const isLast = q.index === plan.meta.total - 1;
    render(`
      <div class="page fade page-q">
        ${head}
        <main class="qmain">
          <p class="q-ask">Pergunta escrita &middot; pode pular</p>
          <h1 class="q-text q-text-open">${esc(q.text)}</h1>
          <textarea id="open-answer" class="textarea" rows="6" maxlength="1500" placeholder="${esc(q.placeholder || 'Escreva livremente...')}" aria-label="Sua resposta"></textarea>
          <p class="counter" id="counter">0 / 1500</p>
        </main>
        <div class="actionbar">
          <button class="btn btn-primary btn-block" id="open-next" data-action="open-next">${cur.trim() ? 'Continuar' : 'Pular'} ${ICON.arrow}</button>
        </div>
      </div>
    `);
    const ta = $('#open-answer');
    ta.value = cur;
    updateCounter(ta);
    // no celular, abrir o teclado sozinho esconde a pergunta
    if (window.matchMedia && window.matchMedia('(pointer: fine)').matches) ta.focus();
  }
}

function updateCounter(ta) {
  const c = $('#counter');
  if (c) c.textContent = `${ta.value.length} / ${ta.maxLength}`;
  const b = $('#open-next');
  if (b) b.firstChild.textContent = ta.value.trim() ? 'Continuar ' : 'Pular ';
}

function onInput(e) {
  if (e.target.id === 'open-answer') {
    const q = currentQuestion();
    state.answers[q.id] = e.target.value;
    updateCounter(e.target);
    persist();
  }
  if (e.target.classList && e.target.classList.contains('invalid')) {
    e.target.classList.remove('invalid');
    const err = $('#err-' + e.target.id);
    if (err) err.hidden = true;
  }
}

function answer(value) {
  const q = currentQuestion();
  if (q.type !== 'likert') return;
  state.answers[q.id] = value;
  persist();
  document.querySelectorAll('.opt').forEach((b) => {
    const on = Number(b.dataset.value) === value;
    b.classList.toggle('sel', on);
    b.setAttribute('aria-checked', on ? 'true' : 'false');
  });
  clearTimeout(advanceTimer);
  advanceTimer = setTimeout(() => {
    if (state.screen === 'question' && currentQuestion() === q) next();
  }, 260);
}

function next() {
  const sec = currentSection();
  if (state.qi < sec.questions.length - 1) {
    state.qi++;
    renderQuestion();
  } else if (state.si < plan.sections.length - 1) {
    state.si++;
    state.qi = 0;
    renderSectionIntro();
  } else {
    finish();
  }
}

function prev() {
  if (state.qi > 0) {
    state.qi--;
    renderQuestion();
  } else if (state.si > 0) {
    state.si--;
    state.qi = currentSection().questions.length - 1;
    renderQuestion();
  } else {
    renderSectionIntro();
  }
}

function backFromSection() {
  state.si--;
  state.qi = currentSection().questions.length - 1;
  renderQuestion();
}

function finish() {
  state.screen = 'result';
  state.endTime = new Date().toISOString();
  persist();
  renderResult();
}

/* ---------- resultado ---------- */
function renderResult() {
  state.screen = 'result';
  plan = getPlan(state.tier);
  const scores = Scoring.compute(plan, state.answers);
  promptText = PromptBuilder.build(state, plan, scores);
  const canShare = !!navigator.share && window.matchMedia && window.matchMedia('(pointer: coarse)').matches;

  const bars = scores.riasec
    ? [...scores.riasec]
        .sort((a, b) => b.score - a.score)
        .map(
          (r) => `
        <div class="bar">
          <div class="bar-top"><span>${esc(r.nome)}</span><span class="bar-val">${r.score}</span></div>
          <div class="bar-track"><div class="bar-fill" style="width:${r.score}%"></div></div>
        </div>`
        )
        .join('')
    : '';

  const topValues = scores.valuesRank
    ? scores.valuesRank
        .slice(0, 3)
        .map((v) => esc(v.nome))
        .join(', ')
    : '';

  render(`
    <div class="page fade">
      <div class="brand">Teste Vocacional</div>

      <div class="done-badge">${ICON.check}<span>Teste concluído</span></div>
      <h1 class="h1">${esc(state.personal.nome)}, falta só um passo</h1>
      <p class="lead">Suas respostas viraram um texto pronto. Ele vai para o ChatGPT, que faz a análise completa. Siga os 3 passos abaixo.</p>

      <ol class="steps">
        <li class="step" id="step-1">
          <span class="step-n">1</span>
          <div class="step-body">
            <h2 class="step-title">Copie o texto</h2>
            <p class="muted">Ele já tem as suas respostas e as instruções para o ChatGPT.</p>
            <button class="btn btn-primary btn-block" id="btn-copy" data-action="copy">${ICON.copy}<span>Copiar texto para o ChatGPT</span></button>
          </div>
        </li>
        <li class="step" id="step-2">
          <span class="step-n">2</span>
          <div class="step-body">
            <h2 class="step-title">Abra o ChatGPT</h2>
            <p class="muted">Funciona na versão gratuita, no navegador ou no aplicativo.</p>
            <a class="btn btn-ghost btn-block" id="btn-open" href="${CHATGPT_URL}" target="_blank" rel="noopener noreferrer">${ICON.external}<span>Abrir o ChatGPT</span></a>
          </div>
        </li>
        <li class="step" id="step-3">
          <span class="step-n">3</span>
          <div class="step-body">
            <h2 class="step-title">Cole e envie</h2>
            <p class="muted">Toque e segure no campo de mensagem, escolha <strong>Colar</strong> e envie. No computador, use Ctrl+V. Se a resposta parar no meio, escreva <em>continue</em>.</p>
          </div>
        </li>
      </ol>

      <p class="note" id="copy-msg" role="status" aria-live="polite"></p>

      <details class="card details" id="prompt-details">
        <summary>Ver o texto que será copiado</summary>
        <textarea id="prompt-view" class="textarea mono" rows="12" readonly aria-label="Texto para o ChatGPT"></textarea>
      </details>

      ${
        scores.riasec
          ? `<section class="card">
              <h2 class="h3">Seu retrato rápido</h2>
              <p class="muted">Código de interesses (Holland): <strong>${esc(scores.code)}</strong>${topValues ? '. Valores que mais pesam: ' + topValues + '.' : '.'} A análise do ChatGPT aprofunda isso.</p>
              <div class="bars">${bars}</div>
            </section>`
          : ''
      }

      <section class="card">
        <h2 class="h3">Depois da primeira resposta, pergunte</h2>
        <ul class="plain-list">
          <li>"Compare as duas primeiras carreiras da lista para o meu caso."</li>
          <li>"Monte um plano de estudos de 6 meses para a carreira número 1."</li>
          <li>"Quais cursos e faculdades no Brasil levam a essa carreira?"</li>
        </ul>
        <p class="muted small">Outras IAs, como Claude e Gemini, também aceitam o mesmo texto.</p>
      </section>

      <div class="extras">
        ${canShare ? '<button class="btn btn-ghost btn-block" data-action="share">Compartilhar o texto com outro app</button>' : ''}
        <button class="btn btn-ghost btn-block" data-action="download-txt">Baixar o texto (.txt)</button>
        <button class="btn btn-ghost btn-block" data-action="download-csv">Baixar respostas (.csv)</button>
        <button class="btn btn-text btn-block" data-action="restart">Refazer o teste</button>
      </div>
    </div>
  `);
  $('#prompt-view').value = promptText;
}

async function copyPrompt() {
  const msg = $('#copy-msg');
  const btn = $('#btn-copy');
  let ok = false;
  try {
    await navigator.clipboard.writeText(promptText);
    ok = true;
  } catch (e) {
    try {
      const ta = $('#prompt-view');
      $('#prompt-details').open = true;
      ta.focus();
      ta.select();
      ta.setSelectionRange(0, ta.value.length);
      ok = document.execCommand('copy');
    } catch (e2) {
      ok = false;
    }
  }
  if (ok) {
    btn.classList.add('done');
    btn.querySelector('span').textContent = 'Texto copiado';
    $('#step-1').classList.add('done');
    $('#step-2').classList.add('active');
    msg.textContent = 'Pronto! Agora toque em "Abrir o ChatGPT" e cole lá.';
    msg.className = 'note ok';
  } else {
    $('#prompt-details').open = true;
    const ta = $('#prompt-view');
    ta.focus();
    ta.select();
    msg.textContent = 'Não consegui copiar sozinho. O texto está selecionado abaixo: toque nele, escolha Copiar e depois abra o ChatGPT.';
    msg.className = 'note warn';
  }
}

async function sharePrompt() {
  try {
    await navigator.share({ title: 'Meu teste vocacional', text: promptText });
  } catch (e) {
    /* usuário cancelou */
  }
}

function restart() {
  if (!confirm('Apagar as respostas e começar um novo teste?')) return;
  Storage.clear();
  Object.assign(state, {
    screen: 'intro',
    si: 0,
    qi: 0,
    personal: {},
    answers: {},
    respondentId: null,
    startTime: null,
    endTime: null,
  });
  renderIntro();
}

/* ---------- eventos ---------- */
function onClick(e) {
  const el = e.target.closest('[data-action]');
  if (!el) return;
  const a = el.dataset.action;

  switch (a) {
    case 'tier':
      state.tier = el.dataset.tier;
      document.querySelectorAll('.tier').forEach((t) => {
        const on = t.dataset.tier === state.tier;
        t.classList.toggle('sel', on);
        t.setAttribute('aria-checked', on ? 'true' : 'false');
      });
      break;
    case 'to-personal':
      renderPersonal();
      break;
    case 'to-intro':
      renderIntro();
      break;
    case 'submit-personal':
      submitPersonal();
      break;
    case 'start-section':
      renderQuestion();
      break;
    case 'back-from-section':
      backFromSection();
      break;
    case 'answer':
      answer(Number(el.dataset.value));
      break;
    case 'open-next':
      next();
      break;
    case 'prev':
      clearTimeout(advanceTimer);
      prev();
      break;
    case 'copy':
      copyPrompt();
      break;
    case 'share':
      sharePrompt();
      break;
    case 'download-txt':
      Export.download(promptText, Export.fileName(state, 'txt'), 'text/plain');
      break;
    case 'download-csv':
      Export.download(Export.csv(state, plan), Export.fileName(state, 'csv'), 'text/csv');
      break;
    case 'restart':
      restart();
      break;
    case 'resume': {
      const saved = Storage.load();
      restore(saved);
      if (state.screen === 'result') renderResult();
      else if (state.screen === 'question') renderQuestion();
      else if (state.screen === 'section') renderSectionIntro();
      else if (state.screen === 'personal') renderPersonal();
      else renderQuestion();
      break;
    }
    case 'fresh':
      Storage.clear();
      renderIntro();
      break;
  }
}

function onKey(e) {
  const tag = document.activeElement && document.activeElement.tagName;
  if (e.key === 'Enter' && state.screen === 'personal' && (tag === 'INPUT' || tag === 'SELECT')) {
    e.preventDefault();
    submitPersonal();
    return;
  }
  if (state.screen !== 'question') return;
  if (tag === 'TEXTAREA' || tag === 'INPUT') {
    if (tag === 'TEXTAREA' && e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      next();
    }
    return;
  }
  const q = currentQuestion();
  if (q.type !== 'likert') return;
  if (e.key >= '1' && e.key <= '5') {
    e.preventDefault();
    answer(Number(e.key));
  } else if (e.key === 'ArrowLeft') {
    e.preventDefault();
    clearTimeout(advanceTimer);
    prev();
  } else if ((e.key === 'ArrowRight' || e.key === 'Enter') && state.answers[q.id]) {
    e.preventDefault();
    next();
  }
}
