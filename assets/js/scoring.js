/* =========================================================
   PONTUAÇÃO
   Cada grupo vira uma nota de 0 a 100: (média - 1) / 4.
   Itens invertidos são virados (6 - resposta) antes da média.
   ========================================================= */

const Scoring = {
  level(score) {
    if (score >= 70) return 'alto';
    if (score >= 40) return 'médio';
    return 'baixo';
  },

  value(q, answers) {
    const a = Number(answers[q.id]);
    if (!a) return null;
    return q.rev ? 6 - a : a;
  },

  byDim(plan, answers, sectionId, order) {
    const sec = plan.sections.find((s) => s.id === sectionId);
    if (!sec) return null;
    const rows = [];
    order.forEach((key) => {
      const vals = sec.questions
        .filter((q) => q.dim === key)
        .map((q) => this.value(q, answers))
        .filter((v) => v !== null);
      if (!vals.length) return;
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const score = Math.round(((mean - 1) / 4) * 100);
      rows.push({ key, nome: sec.meta[key].nome, curto: sec.meta[key].curto, score, nivel: this.level(score), n: vals.length });
    });
    return rows.length ? rows : null;
  },

  compute(plan, answers) {
    const riasec = this.byDim(plan, answers, 'atividades', ['R', 'I', 'A', 'S', 'E', 'C']);
    const skills = this.byDim(plan, answers, 'habilidades', ['R', 'I', 'A', 'S', 'E', 'C']);
    const big5 = this.byDim(plan, answers, 'jeito', ['E', 'A', 'C', 'S', 'O']);
    const values = this.byDim(plan, answers, 'valores', [
      'autonomia', 'estabilidade', 'proposito', 'desafio', 'equilibrio', 'remuneracao', 'reconhecimento', 'criacao',
    ]);

    let code = '';
    let definicao = '';
    let spread = 0;
    if (riasec) {
      const sorted = [...riasec].sort((a, b) => b.score - a.score);
      code = sorted.slice(0, 3).map((r) => r.key).join('');
      spread = sorted[0].score - sorted[sorted.length - 1].score;
      definicao = spread >= 40 ? 'bem definido' : spread >= 20 ? 'moderadamente definido' : 'pouco diferenciado (interesses espalhados)';
    }

    // diferença entre o que gosta e o que diz fazer bem
    let gaps = null;
    if (riasec && skills) {
      gaps = [];
      skills.forEach((s) => {
        const i = riasec.find((r) => r.key === s.key);
        if (!i) return;
        const diff = i.score - s.score;
        if (Math.abs(diff) >= 25) {
          gaps.push({
            nome: s.nome,
            interesse: i.score,
            habilidade: s.score,
            leitura: diff > 0 ? 'gosta mais do que acha que faz bem' : 'faz bem, mas gosta menos',
          });
        }
      });
    }

    const valuesRank = values ? [...values].sort((a, b) => b.score - a.score) : null;

    return { riasec, skills, big5, values, valuesRank, code, definicao, spread, gaps };
  },
};
