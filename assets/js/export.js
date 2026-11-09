const Export = {
  // evita que o Excel trate uma resposta como fórmula (=, +, -, @)
  cell(value) {
    let s = value === null || value === undefined ? '' : String(value);
    if (/^[=+\-@]/.test(s)) s = "'" + s;
    if (/[",\n\r]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  },

  csv(state, plan) {
    const p = state.personal;
    const head = ['respondente_id', 'nome', 'idade', 'momento', 'cidade', 'versao', 'secao', 'pergunta_id', 'grupo', 'pergunta', 'resposta'];
    const rows = [head];
    plan.sections.forEach((sec) => {
      sec.questions.forEach((q) => {
        rows.push([
          state.respondentId,
          p.nome,
          p.idade,
          p.momentoLabel,
          p.cidade || '',
          plan.meta.nome,
          sec.title,
          q.id,
          q.dim,
          q.text,
          state.answers[q.id] === undefined ? '' : state.answers[q.id],
        ]);
      });
    });
    return rows.map((r) => r.map((c) => this.cell(c)).join(',')).join('\n');
  },

  fileName(state, ext) {
    const nome = (state.personal.nome || 'respondente')
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .toLowerCase();
    return `vocacional_${nome}_${new Date().toISOString().slice(0, 10)}.${ext}`;
  },

  download(content, filename, type) {
    const blob = new Blob(['﻿' + content], { type: `${type};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  },
};
