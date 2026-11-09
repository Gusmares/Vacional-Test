/* =========================================================
   AFINIDADE ENTRE PERFIL E PROFISSÕES

   Como funciona:
   1. A pessoa tem 6 notas de interesse (R, I, A, S, E, C), de 0 a 100.
   2. Cada profissão tem 6 notas de interesse do O*NET (escala 1 a 7).
   3. Calculamos a CORRELAÇÃO entre os dois perfis (as 6 notas da pessoa contra as 6 da
      profissão). A literatura sobre a teoria de Holland aponta a correlação de perfis
      como uma das melhores medidas de "encaixe" entre pessoa e ocupação.
      Ela compara o FORMATO do perfil, não o tamanho: quem pontua alto em tudo e quem pontua
      baixo em tudo são comparados pelo que se destaca em cada um.
   4. Se a versão do teste mediu habilidades, entra um segundo perfil (o que a pessoa diz
      fazer bem), com peso menor.
   5. A correlação (-1 a 1) vira um índice de 0 a 100: (r + 1) / 2 * 100, mostrado em faixas (muito alta, alta, média).
      É um índice de comparação entre profissões, NÃO é uma probabilidade de dar certo.
   ========================================================= */

const Matching = {
  // Para ajustar: a soma deve dar 1
  PESOS: { interesses: 0.75, habilidades: 0.25 },
  // Quantas profissões do mesmo grupo aparecem entre as destacadas
  MAX_POR_AREA_NOS_DESTAQUES: 5,
  QTD_DESTAQUES: 12,
  // Perfil quase reto (todas as notas parecidas): não dá para ranquear com sentido
  SPREAD_MINIMO: 10,

  // A correlação fica muito próxima de 1 para várias profissões, então mostramos faixas
  // em vez de um número que pareça mais preciso do que é.
  rotulo(r) {
    if (r >= 0.85) return 'Muito alta';
    if (r >= 0.65) return 'Alta';
    if (r >= 0.4) return 'Média';
    return 'Baixa';
  },

  corr(a, b) {
    const n = a.length;
    const ma = a.reduce((s, x) => s + x, 0) / n;
    const mb = b.reduce((s, x) => s + x, 0) / n;
    let sab = 0, saa = 0, sbb = 0;
    for (let i = 0; i < n; i++) {
      sab += (a[i] - ma) * (b[i] - mb);
      saa += (a[i] - ma) ** 2;
      sbb += (b[i] - mb) ** 2;
    }
    if (saa === 0 || sbb === 0) return 0;
    return sab / Math.sqrt(saa * sbb);
  },

  vetor(linhas) {
    // garante a ordem R I A S E C
    return ['R', 'I', 'A', 'S', 'E', 'C'].map((k) => (linhas.find((x) => x.key === k) || {}).score);
  },

  confianca(scores, plan) {
    const sec = plan.sections.find((s) => s.id === 'atividades');
    const porTipo = sec ? sec.questions.length / 6 : 0;
    const spread = scores.spread;
    let nivel = 'baixa';
    if (porTipo >= 7 && spread >= 25) nivel = 'alta';
    else if (porTipo >= 4 && spread >= 15) nivel = 'média';

    let texto;
    if (spread < 15) {
      texto = 'Seus interesses ficaram parecidos entre si, então várias profissões empatam. Use a lista como inspiração, não como ranking.';
    } else if (porTipo < 4) {
      texto = 'A versão Rápida tem poucas frases por tipo de interesse. A ordem pode mudar bastante se você fizer a Equilibrada ou a Completa.';
    } else if (porTipo < 7) {
      texto = 'Com mais perguntas (versão Completa), a ordem da lista fica mais firme. Diferenças pequenas entre profissões vizinhas não são significativas.';
    } else {
      texto = 'Boa quantidade de perguntas. Mesmo assim, diferenças pequenas entre profissões vizinhas não são significativas.';
    }
    return { nivel, texto };
  },

  rank(scores, plan) {
    if (!scores.riasec || scores.riasec.length < 6) return { ok: false, motivo: 'sem-interesses' };
    if (typeof CAREERS === 'undefined') return { ok: false, motivo: 'sem-base' };
    if (scores.spread < this.SPREAD_MINIMO) return { ok: false, motivo: 'perfil-plano' };

    const u = this.vetor(scores.riasec);
    const h = scores.skills ? this.vetor(scores.skills) : null;
    const wI = h ? this.PESOS.interesses : 1;
    const wH = h ? this.PESOS.habilidades : 0;

    const lista = CAREERS.itens.map((c) => {
      const rI = this.corr(u, c.ri);
      const rH = h ? this.corr(h, c.ri) : 0;
      const r = wI * rI + wH * rH;
      return { ...c, r, indice: Math.round(((r + 1) / 2) * 100), rotulo: this.rotulo(r) };
    });
    lista.sort((a, b) => b.r - a.r);

    // áreas: média das 3 melhores profissões de cada área
    const porArea = {};
    lista.forEach((c) => {
      (porArea[c.area] = porArea[c.area] || []).push(c.indice);
    });
    const areas = Object.keys(porArea)
      .map((area) => {
        const top = porArea[area].slice(0, 3);
        return { area, indice: Math.round(top.reduce((s, x) => s + x, 0) / top.length) };
      })
      .sort((a, b) => b.indice - a.indice);

    return {
      ok: true,
      lista,
      areas,
      usouHabilidades: !!h,
      confianca: this.confianca(scores, plan),
    };
  },

  // filtro: 'todas' | 'tecnico' (sem exigir graduação) | 'superior'
  filtrar(lista, filtro) {
    if (filtro === 'tecnico') return lista.filter((c) => c.zona <= 3);
    if (filtro === 'superior') return lista.filter((c) => c.zona >= 4);
    return lista;
  },

  // escolhe os destaques evitando que uma só área ocupe tudo
  destaques(lista, quantidade) {
    const q = quantidade || this.QTD_DESTAQUES;
    const cont = {};
    const escolhidas = [];
    const resto = [];
    lista.forEach((c) => {
      cont[c.area] = cont[c.area] || 0;
      if (escolhidas.length < q && cont[c.area] < this.MAX_POR_AREA_NOS_DESTAQUES) {
        escolhidas.push(c);
        cont[c.area]++;
      } else resto.push(c);
    });
    return { escolhidas, resto };
  },
};
