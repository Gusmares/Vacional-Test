// ===== STATE =====
const state = {
  screen: 'intro',         // intro | personal | part-intro | question | complete
  currentPart: 0,
  currentQuestion: 0,
  showingPartIntro: false,
  personalData: {},
  answers: {},
  respondentId: null,
  startTime: null,
  direction: 'forward',    // forward | backward
};

const MOTIVATIONAL = [
  'Cada resposta revela uma camada de quem você é.',
  'Não existe resposta errada. Só existe a sua verdade.',
  'Você está construindo autoconhecimento com cada clique.',
  'A clareza profissional começa com honestidade consigo mesmo.',
  'Continue. Cada pergunta importa.',
  'Você está no caminho certo.',
  'Suas respostas estão formando um retrato único de você.',
  'Autoconhecimento é o maior ativo de uma carreira.',
];

// ===== INIT =====
document.addEventListener('DOMContentLoaded', init);

function init() {
  const app = document.getElementById('app');

  // Check for saved progress
  if (Storage.hasProgress()) {
    const saved = Storage.load();
    if (saved && saved.screen !== 'complete') {
      showResumePrompt(saved);
      return;
    }
  }

  renderIntro(app);
  setupKeyboard();
}

function generateId() {
  return 'R' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
}

// ===== SCREEN TRANSITIONS =====
function transitionTo(renderFn) {
  const app = document.getElementById('app');
  app.style.opacity = '0';
  app.style.transform = 'translateY(6px)';
  app.style.transition = 'opacity 220ms ease, transform 220ms ease';
  setTimeout(() => {
    app.style.opacity = '';
    app.style.transform = '';
    app.style.transition = '';
    renderFn(app);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, 230);
}

// ===== RESUME PROMPT =====
function showResumePrompt(saved) {
  const app = document.getElementById('app');
  const answeredCount = Object.keys(saved.answers || {}).length;
  const pct = Math.round((answeredCount / QUESTIONS.total) * 100);

  app.innerHTML = `
    <div class="intro-screen">
      <div class="intro-bg"></div>
      <div class="intro-content">
        <div class="resume-card">
          <div class="resume-card-header">
            <div class="resume-card-icon">💾</div>
            <div>
              <div class="resume-card-title">Progresso salvo</div>
              <div class="resume-card-subtitle">${pct}% concluído · ${answeredCount} respostas</div>
            </div>
          </div>
          <div class="resume-card-body">
            Encontramos seu progresso anterior. Deseja continuar de onde parou?
          </div>
          <div class="resume-actions">
            <button class="btn-primary" onclick="resumeSession()" style="font-size:13px;padding:10px 20px">
              Continuar
            </button>
            <button class="btn-secondary" onclick="startFresh()" style="font-size:13px;padding:10px 20px">
              Começar do zero
            </button>
          </div>
        </div>
        <div class="intro-badge">
          <span class="intro-badge-dot"></span>
          Plataforma Vocacional
        </div>
        <h1 class="intro-headline">Descubra quem<br>você <span>realmente é</span>.</h1>
        <p class="intro-subtitle">
          Uma experiência de autoconhecimento profissional profunda, desenvolvida para revelar seus talentos e direção de carreira.
        </p>
      </div>
    </div>
  `;
}

window.resumeSession = function() {
  const saved = Storage.load();
  Object.assign(state, {
    respondentId: saved.respondentId,
    startTime: saved.startTime,
    personalData: saved.personalData || {},
    answers: saved.answers || {},
    currentPart: saved.currentPart || 0,
    currentQuestion: saved.currentQuestion || 0,
    screen: saved.screen || 'question',
    showingPartIntro: false,
  });
  const app = document.getElementById('app');
  setupKeyboard();
  if (state.screen === 'complete') {
    renderComplete(app);
  } else {
    renderQuestion(app);
  }
};

window.startFresh = function() {
  Storage.clear();
  const app = document.getElementById('app');
  renderIntro(app);
};

// ===== INTRO SCREEN =====
function renderIntro(app) {
  state.screen = 'intro';
  const totalQ = QUESTIONS.total;
  const likertQ = QUESTIONS.totalLikert;
  const openQ = QUESTIONS.totalOpen;

  app.innerHTML = `
    <div class="intro-screen stagger">
      <div class="intro-bg"></div>
      <div class="intro-content">
        <div class="intro-badge">
          <span class="intro-badge-dot"></span>
          Plataforma Vocacional
        </div>
        <h1 class="intro-headline">
          Descubra quem<br>você <span>realmente é</span>.
        </h1>
        <p class="intro-subtitle">
          Uma experiência de autoconhecimento profissional profunda — desenvolvida para revelar seus talentos únicos, valores e direção de carreira com clareza.
        </p>
        <div class="intro-stats">
          <div class="intro-stat">
            <span class="intro-stat-number">${totalQ}</span>
            <span class="intro-stat-label">Perguntas</span>
          </div>
          <div class="intro-stat-divider"></div>
          <div class="intro-stat">
            <span class="intro-stat-number">${QUESTIONS.parts.length}</span>
            <span class="intro-stat-label">Etapas</span>
          </div>
          <div class="intro-stat-divider"></div>
          <div class="intro-stat">
            <span class="intro-stat-number">~20</span>
            <span class="intro-stat-label">Minutos</span>
          </div>
        </div>
        <button class="btn-primary" onclick="startPersonal()">
          Começar agora
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
        <p class="intro-note">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zM6 4v3l2 1" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
          Suas respostas são salvas automaticamente neste dispositivo
        </p>
      </div>
    </div>
  `;
}

window.startPersonal = function() {
  transitionTo(renderPersonal);
};

// ===== PERSONAL DATA SCREEN =====
function renderPersonal(app) {
  state.screen = 'personal';

  app.innerHTML = `
    <div class="personal-screen">
      <div class="container container--narrow">
        <div class="form-card anim-fade-in-up">
          <div class="form-header">
            <div class="form-step-label">Etapa 1 de ${QUESTIONS.parts.length + 2}</div>
            <h2 class="form-title">Antes de começar</h2>
            <p class="form-subtitle">Precisamos de algumas informações básicas sobre você.</p>
          </div>
          <div class="form-grid">
            <div class="field">
              <label class="field-label" for="nome">
                Nome <span class="field-label-required">*</span>
              </label>
              <input
                class="field-input"
                type="text"
                id="nome"
                placeholder="Seu nome completo"
                autocomplete="given-name"
                value="${escapeHtml(state.personalData.nome || '')}"
              />
            </div>
            <div class="form-grid form-grid-2">
              <div class="field">
                <label class="field-label" for="idade">
                  Idade <span class="field-label-required">*</span>
                </label>
                <input
                  class="field-input"
                  type="number"
                  id="idade"
                  placeholder="Ex: 22"
                  min="12"
                  max="80"
                  value="${state.personalData.idade || ''}"
                />
              </div>
              <div class="field">
                <label class="field-label" for="genero">
                  Gênero
                  <span class="field-label-optional">opcional</span>
                </label>
                <select class="field-input" id="genero">
                  <option value="">Prefiro não dizer</option>
                  <option value="feminino" ${state.personalData.genero === 'feminino' ? 'selected' : ''}>Feminino</option>
                  <option value="masculino" ${state.personalData.genero === 'masculino' ? 'selected' : ''}>Masculino</option>
                  <option value="nao-binario" ${state.personalData.genero === 'nao-binario' ? 'selected' : ''}>Não-binário</option>
                  <option value="outro" ${state.personalData.genero === 'outro' ? 'selected' : ''}>Outro</option>
                </select>
              </div>
            </div>
            <div class="field">
              <label class="field-label" for="cidade">
                Cidade
                <span class="field-label-optional">opcional</span>
              </label>
              <input
                class="field-input"
                type="text"
                id="cidade"
                placeholder="Ex: São Paulo, SP"
                autocomplete="address-level2"
                value="${escapeHtml(state.personalData.cidade || '')}"
              />
            </div>
          </div>
          <div class="form-footer">
            <span class="form-footer-note">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/><circle cx="6" cy="3.5" r="0.5" fill="currentColor"/></svg>
              Dados usados apenas para identificação no CSV
            </span>
            <button class="btn-primary" onclick="submitPersonal()">
              Iniciar teste
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  document.getElementById('nome').focus();

  // Enter key on fields
  ['nome','idade','cidade'].forEach(id => {
    document.getElementById(id).addEventListener('keydown', e => {
      if (e.key === 'Enter') submitPersonal();
    });
  });
}

window.submitPersonal = function() {
  const nome = document.getElementById('nome').value.trim();
  const idade = document.getElementById('idade').value.trim();

  if (!nome) {
    shakeField('nome');
    return;
  }
  if (!idade || isNaN(idade) || Number(idade) < 12 || Number(idade) > 80) {
    shakeField('idade');
    return;
  }

  state.personalData = {
    nome,
    idade: Number(idade),
    genero: document.getElementById('genero').value,
    cidade: document.getElementById('cidade').value.trim(),
  };

  state.respondentId = generateId();
  state.startTime = new Date().toISOString();
  state.currentPart = 0;
  state.currentQuestion = 0;
  state.showingPartIntro = true;

  Storage.save(state);
  transitionTo(renderPartIntro);
};

function shakeField(id) {
  const el = document.getElementById(id);
  if (!el) return;
  el.style.animation = 'none';
  el.getBoundingClientRect();
  el.style.animation = 'shake 400ms cubic-bezier(0.36, 0.07, 0.19, 0.97)';
  el.focus();
  if (!document.getElementById('shake-style')) {
    const s = document.createElement('style');
    s.id = 'shake-style';
    s.textContent = '@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-6px)}40%{transform:translateX(6px)}60%{transform:translateX(-4px)}80%{transform:translateX(4px)}}';
    document.head.appendChild(s);
  }
}

// ===== PART INTRO SCREEN =====
function renderPartIntro(app) {
  state.showingPartIntro = true;
  const part = QUESTIONS.parts[state.currentPart];
  const overallProgress = calculateProgress();

  app.innerHTML = `
    ${renderProgressBar(overallProgress, 'Etapa ' + (state.currentPart + 1) + ': ' + part.title)}
    <div class="part-intro" style="padding-top:100px">
      <div class="part-intro-card stagger">
        <span class="part-emoji anim-float">${part.emoji}</span>
        <div class="part-number" style="color:${part.color}">
          Etapa ${state.currentPart + 1} de ${QUESTIONS.parts.length}
        </div>
        <h2 class="part-intro-title">${part.title}</h2>
        <p class="part-intro-subtitle">${part.subtitle}</p>
        <p class="part-intro-description">${part.intro}</p>
        <div class="part-intro-meta">
          <span class="part-meta-pill">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1a5 5 0 100 10A5 5 0 006 1zm0 4v3" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>
            ${part.questions.length} ${part.questions[0].type === 'open' ? 'reflexões' : 'afirmações'}
          </span>
          <span class="part-meta-pill">
            ${part.questions[0].type === 'likert' ? '⚡ Escala 1–5' : '✍️ Texto livre'}
          </span>
        </div>
        <button class="btn-primary" onclick="startPart()" style="background:${part.color}">
          Começar
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </button>
      </div>
    </div>
  `;
}

window.startPart = function() {
  state.showingPartIntro = false;
  state.currentQuestion = 0;
  transitionTo(renderQuestion);
};

// ===== QUESTION SCREEN =====
function renderQuestion(app) {
  state.screen = 'question';
  const part = QUESTIONS.parts[state.currentPart];
  const question = part.questions[state.currentQuestion];
  const overallProgress = calculateProgress();
  const currentAnswer = state.answers[question.id];
  const isAnswered = currentAnswer !== undefined && currentAnswer !== '';

  const isLastQuestion = state.currentQuestion === part.questions.length - 1;
  const isLastPart = state.currentPart === QUESTIONS.parts.length - 1;

  app.innerHTML = `
    ${renderProgressBar(overallProgress, part.title)}
    <div class="question-screen">
      <main class="question-main">
        <div class="question-wrap" id="question-wrap">
          <div class="question-meta">
            <span class="question-part-badge" style="background:${part.colorLight};color:${part.color}">
              ${part.emoji} ${part.title}
            </span>
            <span class="question-number">
              ${state.currentQuestion + 1} / ${part.questions.length}
            </span>
          </div>

          ${question.type === 'likert'
            ? renderLikertQuestion(question, currentAnswer, part)
            : renderOpenQuestion(question, currentAnswer, part)
          }

          <div class="question-nav">
            <div class="nav-left">
              ${(state.currentPart > 0 || state.currentQuestion > 0) ? `
                <button class="btn-icon" onclick="prevQuestion()" title="Voltar" aria-label="Pergunta anterior">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M10 3L5 8l5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
                </button>
              ` : '<div></div>'}
            </div>
            <div class="parts-dots">
              ${QUESTIONS.parts.map((p, i) => `
                <div class="part-dot ${i < state.currentPart ? 'done' : i === state.currentPart ? 'active' : ''}"
                     title="${p.title}"></div>
              `).join('')}
            </div>
            <div class="nav-right">
              <button
                class="btn-next ${isAnswered ? '' : question.type === 'open' ? '' : 'disabled-look'}"
                id="btn-next"
                onclick="nextQuestion()"
                ${question.type === 'likert' && !isAnswered ? 'disabled' : ''}
              >
                ${isLastQuestion && isLastPart ? 'Concluir' :
                  isLastQuestion ? 'Próxima etapa' : 'Próxima'}
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
              </button>
            </div>
          </div>

          ${question.type === 'likert' ? `
            <div class="keyboard-hint">
              <span class="key-badge">1</span>–<span class="key-badge">5</span>
              para responder &nbsp;·&nbsp;
              <span class="key-badge">→</span>
              para avançar
            </div>
          ` : ''}
        </div>
      </main>
    </div>
    <div id="answer-feedback" class="answer-feedback"></div>
  `;

  // Animate in
  const wrap = document.getElementById('question-wrap');
  if (wrap) {
    wrap.style.opacity = '0';
    wrap.style.transform = state.direction === 'forward' ? 'translateX(30px)' : 'translateX(-30px)';
    wrap.style.transition = 'none';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        wrap.style.transition = 'opacity 350ms ease, transform 350ms cubic-bezier(0.4, 0, 0.2, 1)';
        wrap.style.opacity = '1';
        wrap.style.transform = 'translateX(0)';
      });
    });
  }

  // Motivational text
  showMotivational();

  // Auto-focus textarea for open questions
  if (question.type === 'open') {
    setTimeout(() => {
      const ta = document.getElementById('open-answer');
      if (ta) ta.focus();
    }, 400);
  }

  Storage.save(state);
}

function renderLikertQuestion(question, currentAnswer, part) {
  const labels = ['Discordo totalmente', 'Discordo', 'Neutro', 'Concordo', 'Concordo totalmente'];
  const emojis = ['😟', '🙁', '😐', '🙂', '😊'];

  return `
    <div>
      <h2 class="question-text">${question.text}</h2>
      <div class="likert-wrap">
        <div class="likert-labels">
          <span class="likert-label">Discordo<br>totalmente</span>
          <span class="likert-label">Concordo<br>totalmente</span>
        </div>
        <div class="likert-options" role="radiogroup" aria-label="Escala de concordância">
          ${[1,2,3,4,5].map(n => `
            <button
              class="likert-btn ripple-container ${currentAnswer == n ? 'selected' : ''}"
              data-value="${n}"
              onclick="handleLikert(${n})"
              aria-label="${labels[n-1]}"
              role="radio"
              aria-checked="${currentAnswer == n ? 'true' : 'false'}"
              title="${labels[n-1]}"
            >
              <span class="likert-num">${n}</span>
              <span class="likert-dot"></span>
            </button>
          `).join('')}
        </div>
        <div class="likert-emoji-row">
          <span>${emojis[0]}</span>
          <span>${emojis[2]}</span>
          <span>${emojis[4]}</span>
        </div>
      </div>
    </div>
  `;
}

function renderOpenQuestion(question, currentAnswer, part) {
  return `
    <div class="open-question-wrap">
      <h2 class="question-text">${question.text}</h2>
      <div class="open-reflection-hint">
        ✨ Esta é uma pergunta aberta. Responda com honestidade e profundidade — não há julgamento aqui.
      </div>
      <textarea
        class="open-textarea"
        id="open-answer"
        placeholder="${question.placeholder || 'Escreva livremente...'}"
        maxlength="2000"
        rows="5"
        oninput="handleOpen(this)"
      >${currentAnswer || ''}</textarea>
      <div class="open-textarea-footer">
        <span class="open-char-count" id="char-count">${(currentAnswer || '').length} / 2000</span>
        <span class="open-skip-note">Pode deixar em branco se preferir</span>
      </div>
    </div>
  `;
}

// ===== ANSWER HANDLERS =====
window.handleLikert = function(value) {
  const part = QUESTIONS.parts[state.currentPart];
  const question = part.questions[state.currentQuestion];

  state.answers[question.id] = value;

  // Update UI
  document.querySelectorAll('.likert-btn').forEach(btn => {
    const v = parseInt(btn.dataset.value);
    btn.classList.toggle('selected', v === value);
    btn.setAttribute('aria-checked', v === value ? 'true' : 'false');
  });

  // Enable next button
  const btnNext = document.getElementById('btn-next');
  if (btnNext) {
    btnNext.disabled = false;
    btnNext.classList.remove('disabled-look');
  }

  // Ripple effect
  const selectedBtn = document.querySelector(`.likert-btn[data-value="${value}"]`);
  if (selectedBtn) addRipple(selectedBtn);

  Storage.save(state);

  // Auto-advance after short delay for Likert
  setTimeout(() => {
    const current = state.answers[question.id];
    if (current === value) {
      nextQuestion();
    }
  }, 320);
};

window.handleOpen = function(textarea) {
  const part = QUESTIONS.parts[state.currentPart];
  const question = part.questions[state.currentQuestion];
  const val = textarea.value;
  state.answers[question.id] = val;

  const counter = document.getElementById('char-count');
  if (counter) counter.textContent = `${val.length} / 2000`;

  const btnNext = document.getElementById('btn-next');
  if (btnNext) btnNext.disabled = false;

  Storage.save(state);
};

// ===== NAVIGATION =====
window.nextQuestion = function() {
  const part = QUESTIONS.parts[state.currentPart];
  const question = part.questions[state.currentQuestion];

  // Save open answer
  if (question.type === 'open') {
    const ta = document.getElementById('open-answer');
    if (ta) state.answers[question.id] = ta.value;
  }

  state.direction = 'forward';

  if (state.currentQuestion < part.questions.length - 1) {
    // Next question in same part
    state.currentQuestion++;
    transitionTo(renderQuestion);
  } else if (state.currentPart < QUESTIONS.parts.length - 1) {
    // Move to next part
    state.currentPart++;
    state.showingPartIntro = true;
    transitionTo(renderPartIntro);
  } else {
    // All done!
    transitionTo(renderComplete);
  }
};

window.prevQuestion = function() {
  state.direction = 'backward';

  if (state.currentQuestion > 0) {
    state.currentQuestion--;
    transitionTo(renderQuestion);
  } else if (state.currentPart > 0) {
    state.currentPart--;
    state.currentQuestion = QUESTIONS.parts[state.currentPart].questions.length - 1;
    transitionTo(renderQuestion);
  }
};

// ===== PROGRESS =====
function calculateProgress() {
  const answered = Object.keys(state.answers).length;
  return Math.min(Math.round((answered / QUESTIONS.total) * 100), 100);
}

function renderProgressBar(pct, partName) {
  const partIndex = state.currentPart;
  return `
    <div class="progress-bar-wrap">
      <div class="progress-bar-track">
        <div class="progress-bar-fill" style="width:${pct}%"></div>
      </div>
      <div class="progress-meta">
        <div class="progress-brand">
          <span class="progress-brand-dot"></span>
          Vocacional
        </div>
        <div class="progress-info">
          <span class="progress-part">${partName}</span>
          <span class="progress-pct">${pct}%</span>
        </div>
      </div>
    </div>
  `;
}

// ===== MOTIVATIONAL =====
let motivationalIndex = 0;
function showMotivational() {
  setTimeout(() => {
    const wrap = document.getElementById('question-wrap');
    if (!wrap) return;
    const existing = wrap.querySelector('.motivational-text');
    if (existing) existing.remove();
    const el = document.createElement('p');
    el.className = 'motivational-text';
    el.textContent = MOTIVATIONAL[motivationalIndex % MOTIVATIONAL.length];
    motivationalIndex++;
    wrap.appendChild(el);
  }, 800);
}

// ===== COMPLETE SCREEN =====
function renderComplete(app) {
  state.screen = 'complete';
  Storage.save(state);

  const answered = Object.keys(state.answers).length;
  const startDate = new Date(state.startTime);
  const duration = Math.round((Date.now() - startDate) / 60000);
  const openAnswered = QUESTIONS.flat.filter(q => q.type === 'open' && state.answers[q.id]).length;

  app.innerHTML = `
    <div class="complete-screen stagger">
      <div class="complete-icon">✅</div>
      <h1 class="complete-headline">Você concluiu!<br><span style="color:#059669">Parabéns.</span></h1>
      <p class="complete-subtitle">
        Suas respostas foram registradas com cuidado. Agora elas podem ser analisadas para revelar seu perfil vocacional completo.
      </p>
      <div class="complete-stats">
        <div class="complete-stat">
          <div class="complete-stat-value">${answered}</div>
          <div class="complete-stat-label">Respostas</div>
        </div>
        <div class="complete-stat">
          <div class="complete-stat-value">${duration}min</div>
          <div class="complete-stat-label">Duração</div>
        </div>
        <div class="complete-stat">
          <div class="complete-stat-value">${QUESTIONS.parts.length}</div>
          <div class="complete-stat-label">Etapas</div>
        </div>
      </div>
      <div class="complete-actions">
        <button class="btn-download" onclick="downloadCSV()">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M9 2v10M5 8l4 4 4-4M3 14h12" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
          Baixar resultados (CSV)
        </button>
        <p class="complete-note">
          O arquivo CSV contém todas as suas ${answered} respostas organizadas e prontas para análise por IA ou especialista vocacional.
        </p>
        <button class="btn-secondary" onclick="startFreshComplete()" style="margin-top:8px">
          Fazer o teste novamente
        </button>
      </div>
    </div>
  `;

  Storage.clear();
}

window.downloadCSV = function() {
  Export.download(state);
  showFeedback('CSV baixado com sucesso!');
};

window.startFreshComplete = function() {
  Storage.clear();
  Object.assign(state, {
    screen: 'intro',
    currentPart: 0,
    currentQuestion: 0,
    showingPartIntro: false,
    personalData: {},
    answers: {},
    respondentId: null,
    startTime: null,
    direction: 'forward',
  });
  transitionTo(renderIntro);
};

// ===== RIPPLE =====
function addRipple(element) {
  const ripple = document.createElement('span');
  ripple.classList.add('ripple');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = (rect.width - size) / 2 + 'px';
  ripple.style.top = (rect.height - size) / 2 + 'px';
  element.appendChild(ripple);
  setTimeout(() => ripple.remove(), 700);
}

// ===== FEEDBACK TOAST =====
function showFeedback(msg) {
  let el = document.getElementById('answer-feedback');
  if (!el) {
    el = document.createElement('div');
    el.id = 'answer-feedback';
    el.className = 'answer-feedback';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 2000);
}

// ===== KEYBOARD NAVIGATION =====
function setupKeyboard() {
  document.addEventListener('keydown', handleKeyboard);
}

function handleKeyboard(e) {
  if (state.screen !== 'question') return;

  // Ignore when typing in textarea
  if (document.activeElement && document.activeElement.tagName === 'TEXTAREA') return;
  if (document.activeElement && document.activeElement.tagName === 'INPUT') return;

  const part = QUESTIONS.parts[state.currentPart];
  if (!part) return;
  const question = part.questions[state.currentQuestion];
  if (!question) return;

  if (question.type === 'likert') {
    if (e.key >= '1' && e.key <= '5') {
      e.preventDefault();
      handleLikert(parseInt(e.key));
    }
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
      e.preventDefault();
      const btn = document.getElementById('btn-next');
      if (btn && !btn.disabled) nextQuestion();
    }
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevQuestion();
    }
  } else {
    if (e.key === 'Enter' && e.metaKey) {
      e.preventDefault();
      nextQuestion();
    }
  }
}

// ===== UTILS =====
function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
