/* =========================================================
   MONTAGEM DO PROMPT PARA O CHATGPT
   Para mudar o tom, a estrutura da resposta ou as regras, edite os
   textos abaixo. Os dados da pessoa entram automaticamente.
   ========================================================= */

const PromptBuilder = {
  build(state, plan, scores) {
    const p = state.personal;
    const m = plan.meta;
    const L = [];

    const has = {
      skills: !!scores.skills,
      big5: !!scores.big5,
      dia: plan.sections.some((s) => s.id === 'dia'),
    };

    const naoMedido = [];
    if (!has.skills) naoMedido.push('habilidades');
    if (!has.big5) naoMedido.push('jeito de ser (personalidade)');
    if (!has.dia) naoMedido.push('preferências de ambiente de trabalho');

    /* ---------- Papel e regras ---------- */
    L.push(
      'Você é um orientador vocacional e de carreira experiente, com formação em psicologia e bom conhecimento do mercado de trabalho e do sistema educacional do Brasil. Acabei de fazer um teste vocacional e vou te passar os resultados. Quero uma análise honesta, prática e personalizada.'
    );
    L.push('');
    L.push('## Como responder');
    L.push(`- Fale comigo diretamente, em português do Brasil, com linguagem simples. Tenho ${p.idade} anos: ajuste a linguagem e o tipo de conselho a essa idade e ao meu momento.`);
    L.push('- Seja honesto. Não me elogie por elogiar. Aponte também contradições, pontos de atenção e riscos.');
    L.push('- Trate as notas calculadas como pistas. Confira com as respostas item a item e com o que escrevi. Se algo não bater, diga.');
    L.push(
      `- Este foi o teste na versão ${m.nome} (${m.total} perguntas). É uma ferramenta de autoconhecimento, não um diagnóstico. Para cada conclusão importante, diga seu nível de confiança (baixo, médio ou alto) e por quê.` +
        (m.total <= 35 ? ' Como a versão é curta, trate tudo como indicativo, e diga o que valeria confirmar.' : '')
    );
    if (naoMedido.length) L.push(`- Esta versão não mediu: ${naoMedido.join(', ')}. Não invente nada sobre isso.`);
    L.push('- Não me peça mais informações antes de responder. Se faltar algo, assuma uma hipótese de forma explícita e siga em frente.');
    L.push('- Não invente dados. Ao falar de faixas salariais, demanda ou mercado, deixe claro que são estimativas e que devo conferir em fontes atuais.');
    L.push('- Formate para leitura no celular: títulos curtos, listas curtas, sem tabelas largas.');
    L.push('');

    /* ---------- Estrutura pedida ---------- */
    const pedidos = [];
    pedidos.push('**Resumo do meu perfil** em 5 a 8 linhas, como se você me conhecesse.');
    pedidos.push(
      `**Meus interesses (código Holland ${scores.code})**: o que significa na prática, em que ambientes de trabalho tendo a me sentir bem e em quais tendo a me sentir mal.`
    );
    if (has.big5) pedidos.push('**Meu jeito de trabalhar**: como minha personalidade ajuda e atrapalha, e que tipo de equipe e de chefe combina comigo.');
    pedidos.push('**O que eu valorizo**: 3 coisas que parecem inegociáveis, 2 em que posso ceder, e qualquer conflito entre os meus valores.');
    if (has.skills) pedidos.push('**Interesse x habilidade**: onde o que eu gosto e o que eu faço bem se encontram, e onde não.');
    pedidos.push(
      '**Carreiras e áreas**: de 8 a 10 opções em ordem de encaixe. Para cada uma: por que combina comigo, como é o dia a dia real, qual a formação no Brasil (graduação, técnico, tecnólogo, curso livre ou autodidata), um ponto de atenção e o nível de encaixe (alto ou médio). Inclua 2 opções fora da curva que eu provavelmente não consideraria e 2 opções mais seguras.'
    );
    pedidos.push('**O que evitar**: 3 tipos de trabalho ou ambiente que provavelmente me fariam mal, com base nas minhas respostas.');
    pedidos.push(
      '**Plano de 30 dias para testar antes de decidir**: ações baratas e concretas (conversar com profissionais, aula experimental, projeto pequeno, voluntariado, curso gratuito) para as 3 opções principais.'
    );
    pedidos.push('**Perguntas que eu ainda devo me fazer** e o que ficou em aberto.');

    L.push('## O que quero na resposta (nesta ordem)');
    pedidos.forEach((t, i) => L.push(`${i + 1}. ${t}`));
    L.push('');
    L.push('Seja direto, mas completo (a resposta pode ser longa). No final, pergunte se quero que você aprofunde alguma carreira, compare duas opções ou monte um plano de estudos.');
    L.push('');

    /* ---------- Dados da pessoa ---------- */
    L.push('---');
    L.push('');
    L.push('## Sobre mim');
    L.push(`- Nome: ${p.nome}`);
    L.push(`- Idade: ${p.idade}`);
    L.push(`- Momento atual: ${p.momentoLabel}`);
    if (p.cidade) L.push(`- Cidade: ${p.cidade}`);
    L.push('');

    /* ---------- Notas calculadas ---------- */
    L.push('## Resultado calculado (notas de 0 a 100)');
    if (scores.riasec) {
      L.push('');
      L.push('Interesses (modelo Holland / RIASEC):');
      scores.riasec.forEach((r) => L.push(`- ${r.key} ${r.nome}: ${r.score} (${r.nivel})`));
      L.push(`Código Holland: ${scores.code}. Perfil de interesses ${scores.definicao} (diferença entre a maior e a menor nota: ${scores.spread} pontos; critério aproximado).`);
    }
    if (scores.skills) {
      L.push('');
      L.push('Habilidades que eu me atribuo (mesmos 6 tipos):');
      scores.skills.forEach((r) => L.push(`- ${r.key} ${r.nome}: ${r.score} (${r.nivel})`));
      if (scores.gaps && scores.gaps.length) {
        L.push('Diferenças grandes entre interesse e habilidade:');
        scores.gaps.forEach((g) => L.push(`- ${g.nome}: interesse ${g.interesse}, habilidade ${g.habilidade} (${g.leitura})`));
      } else {
        L.push('Não houve diferenças grandes entre meus interesses e as habilidades que me atribuí.');
      }
    }
    if (scores.big5) {
      L.push('');
      L.push('Jeito de ser (Big Five curto):');
      scores.big5.forEach((r) => L.push(`- ${r.nome}: ${r.score} (${r.nivel})`));
    }
    if (scores.valuesRank) {
      L.push('');
      L.push('Valores de trabalho, do mais ao menos importante:');
      scores.valuesRank.forEach((r) => L.push(`- ${r.nome}: ${r.score}`));
    }
    L.push('');

    /* ---------- Respostas item a item ---------- */
    L.push('## Minhas respostas, item a item');
    plan.sections.forEach((sec) => {
      if (sec.kind === 'open') return;
      const sc = SCALES[sec.scale];
      L.push('');
      L.push(`### ${sec.title}`);
      L.push(`${sc.ask} (1 = ${sc.labels[0]}, 5 = ${sc.labels[4]})`);
      sec.questions.forEach((q) => {
        const a = state.answers[q.id];
        L.push(`- (${a || 'sem resposta'}) ${q.text}`);
      });
    });
    L.push('');

    /* ---------- Respostas escritas ---------- */
    const abertas = plan.flat.filter((q) => q.type === 'open');
    if (abertas.length) {
      L.push('## O que escrevi com as minhas palavras');
      abertas.forEach((q) => {
        const a = (state.answers[q.id] || '').trim();
        L.push('');
        L.push(`### ${q.text}`);
        L.push(a || '(não respondi)');
      });
      L.push('');
    }

    L.push('---');
    L.push('Com base em tudo isso, faça a análise seguindo a estrutura pedida acima.');

    return L.join('\n');
  },
};
