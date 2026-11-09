/* =========================================================
   MONTAGEM DO PROMPT PARA O CHATGPT

   Estrutura baseada no guia oficial de prompts da OpenAI:
   identidade, instruções, exemplo e, por último, o contexto (os dados da pessoa),
   com cabeçalhos em Markdown e tags XML para separar cada bloco de dados.

   Para mudar o tom, a estrutura da resposta ou as regras, edite os textos abaixo.
   Os dados da pessoa entram automaticamente.
   ========================================================= */

const PromptBuilder = {
  build(state, plan, scores, ranking) {
    const p = state.personal;
    const m = plan.meta;
    const L = [];

    const has = {
      skills: !!scores.skills,
      big5: !!scores.big5,
      dia: plan.sections.some((s) => s.id === 'dia'),
      lista: !!(ranking && ranking.ok),
    };

    const naoMedido = [];
    if (!has.skills) naoMedido.push('habilidades');
    if (!has.big5) naoMedido.push('jeito de ser (personalidade)');
    if (!has.dia) naoMedido.push('preferências de ambiente de trabalho');

    /* ---------- Identidade ---------- */
    L.push('# Identidade');
    L.push(
      'Você é um orientador vocacional e de carreira experiente, com formação em psicologia e bom conhecimento do mercado de trabalho e do sistema educacional do Brasil. Acabei de fazer um teste vocacional e vou te passar os resultados. Quero uma análise honesta, prática e personalizada.'
    );
    L.push('');

    /* ---------- Regras ---------- */
    L.push('# Regras');
    L.push(`- Fale comigo diretamente, em português do Brasil, com linguagem simples. Tenho ${p.idade} anos: use a idade só para ajustar a linguagem e a etapa de formação.`);
    L.push('- Seja honesto. Não me elogie por elogiar. Aponte também contradições, pontos de atenção e riscos.');
    L.push('- Evite frases genéricas que serviriam para qualquer pessoa. Toda afirmação importante deve mostrar de onde veio, entre parênteses: uma nota calculada ou uma resposta minha.');
    L.push('- Não presuma nada sobre mim pelo meu nome, cidade ou idade, e não limite opções por gênero, aparência ou origem. Baseie-se nos resultados e no que escrevi.');
    L.push('- Trate as notas como pistas. Confira com as respostas item a item e com os meus textos. Se algo não bater, diga.');
    L.push(
      `- Este foi o teste na versão ${m.nome} (${m.total} perguntas). É uma ferramenta de autoconhecimento, não um diagnóstico. Para cada conclusão importante, diga seu nível de confiança (baixo, médio ou alto) e por quê.` +
        (m.total <= 35 ? ' Como a versão é curta, trate tudo como indicativo e diga o que valeria confirmar.' : '')
    );
    if (naoMedido.length) L.push(`- Esta versão não mediu: ${naoMedido.join(', ')}. Não invente nada sobre isso.`);
    L.push('- Não me peça mais informações antes de responder. Se faltar algo, assuma uma hipótese de forma explícita e siga em frente.');
    L.push('- Não invente dados. Ao falar de faixas salariais, demanda ou mercado, deixe claro que são estimativas e que devo conferir em fontes atuais.');
    L.push('- Considere o contexto brasileiro quando fizer sentido para o meu momento: Enem, Sisu, Prouni, Fies, cursos técnicos, tecnólogos, concursos públicos e cursos livres.');
    L.push('- Se eu demonstrar sofrimento emocional forte nos meus textos, acolha com cuidado e sugira buscar apoio (por exemplo o CVV, telefone 188, ou um profissional de saúde mental), sem deixar de responder ao pedido.');
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
      has.lista
        ? '**Carreiras e áreas**: de 8 a 10 opções em ordem de encaixe, no formato do exemplo abaixo. Parta da pré-seleção de profissões que está nos dados, mas você pode confirmar, remover, reordenar ou acrescentar outras, explicando por quê. Inclua 2 opções fora da curva que eu provavelmente não consideraria e 2 opções mais seguras.'
        : '**Carreiras e áreas**: de 8 a 10 opções em ordem de encaixe, no formato do exemplo abaixo. Inclua 2 opções fora da curva que eu provavelmente não consideraria e 2 opções mais seguras.'
    );
    pedidos.push('**O que evitar**: 3 tipos de trabalho ou ambiente que provavelmente me fariam mal, com base nas minhas respostas.');
    pedidos.push(
      '**Plano de 30 dias para testar antes de decidir**: ações baratas e concretas (conversar com profissionais, aula experimental, projeto pequeno, voluntariado, curso gratuito) para as 3 opções principais.'
    );
    pedidos.push('**O que este teste não consegue dizer** e as perguntas que eu ainda devo me fazer.');

    L.push('# Estrutura da resposta (nesta ordem)');
    pedidos.forEach((t, i) => L.push(`${i + 1}. ${t}`));
    L.push('');
    L.push('Seja direto, mas completo (a resposta pode ser longa). No final, pergunte se quero que você aprofunde alguma carreira, compare duas opções ou monte um plano de estudos.');
    L.push('');

    /* ---------- Exemplo de formato ---------- */
    L.push('# Formato de cada carreira (o conteúdo abaixo é só ilustração do formato)');
    L.push('<exemplo>');
    L.push('**1. Nome da carreira** (encaixe: alto)');
    L.push('- Por que combina comigo: explicação ligada aos meus dados (Investigativo 82; resposta sobre gostar de resolver problemas)');
    L.push('- Dia a dia real: o que a pessoa faz de verdade numa semana comum');
    L.push('- Formação no Brasil: caminhos possíveis (graduação, técnico, tecnólogo, curso livre) e duração aproximada');
    L.push('- Ponto de atenção: o que pode não combinar comigo nessa carreira');
    L.push('</exemplo>');
    L.push('');

    /* ---------- Contexto (dados) ---------- */
    L.push('# Dados do teste');
    L.push('');
    L.push('<sobre_mim>');
    L.push(`- Nome: ${p.nome}`);
    L.push(`- Idade: ${p.idade}`);
    L.push(`- Momento atual: ${p.momentoLabel}`);
    if (p.cidade) L.push(`- Cidade: ${p.cidade}`);
    L.push('</sobre_mim>');
    L.push('');

    L.push('<notas_calculadas>');
    L.push('Notas de 0 a 100.');
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
    L.push('</notas_calculadas>');
    L.push('');

    /* ---------- Pré-seleção de profissões ---------- */
    if (has.lista) {
      const f = CAREERS.fonte;
      const top = Matching.destaques(ranking.lista, 15).escolhidas;
      L.push('<pre_selecao_de_profissoes>');
      L.push(
        `Lista calculada pelo site: correlação entre o meu perfil de interesses${ranking.usouHabilidades ? ' (com peso menor para as minhas habilidades)' : ''} e o perfil de cada ocupação na base ${f.nome}, com dados de ${f.dadosDe} a ${f.dadosAte}. Os nomes e as formações foram adaptados ao Brasil. "Afinidade" é uma faixa de comparação entre profissões, não uma chance de sucesso. Confiança desta lista: ${ranking.confianca.nivel}. ${ranking.confianca.texto}`
      );
      L.push('A base é dos EUA: confira se a profissão existe e funciona assim no Brasil.');
      L.push('');
      top.forEach((c, i) => L.push(`${i + 1}. ${c.nome} (${c.area}) | afinidade ${c.rotulo.toLowerCase()} | formação: ${c.formacao}`));
      L.push('');
      L.push('Áreas com maior afinidade: ' + ranking.areas.slice(0, 4).map((a) => a.area).join(', ') + '.');
      L.push('</pre_selecao_de_profissoes>');
      L.push('');
    }

    /* ---------- Respostas item a item ---------- */
    L.push('<respostas_item_a_item>');
    plan.sections.forEach((sec) => {
      if (sec.kind === 'open') return;
      const sc = SCALES[sec.scale];
      L.push('');
      L.push(`## ${sec.title}`);
      L.push(`${sc.ask} (1 = ${sc.labels[0]}, 5 = ${sc.labels[4]})`);
      sec.questions.forEach((q) => {
        const a = state.answers[q.id];
        L.push(`- (${a || 'sem resposta'}) ${q.text}`);
      });
    });
    L.push('</respostas_item_a_item>');
    L.push('');

    /* ---------- Respostas escritas ---------- */
    const abertas = plan.flat.filter((q) => q.type === 'open');
    if (abertas.length) {
      L.push('<respostas_escritas>');
      abertas.forEach((q) => {
        const a = (state.answers[q.id] || '').trim();
        L.push('');
        L.push(`## ${q.text}`);
        L.push(a || '(não respondi)');
      });
      L.push('</respostas_escritas>');
      L.push('');
    }

    L.push('Com base em tudo isso, faça a análise seguindo a estrutura pedida acima.');

    return L.join('\n');
  },
};
