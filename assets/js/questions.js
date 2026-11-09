/* =========================================================
   BANCO DE PERGUNTAS
   Base teórica:
   - Interesses: modelo RIASEC de Holland (mesma lógica do O*NET Interest Profiler)
   - Jeito de ser: Big Five em versão curta (estilo Mini-IPIP, com itens invertidos)
   - Valores: âncoras de carreira de Schein + valores de trabalho de Super
   Todas as frases são originais, escritas para o contexto brasileiro.

   COMO EDITAR
   - Cada lista está em ordem de prioridade. A versão Rápida usa as primeiras
     frases de cada grupo, a Equilibrada usa mais, a Completa usa todas.
   - Para mudar quantas perguntas cada versão tem, mexa só em TIERS (mais abaixo).
   - Item invertido (nota alta significa o contrário): use rev('texto').
   ========================================================= */

const rev = (t) => ({ t, rev: true });

/* ---------- Escalas de resposta ---------- */
const SCALES = {
  interesse: {
    ask: 'O quanto você gostaria de fazer isso?',
    labels: ['Não gostaria nada', 'Gostaria pouco', 'Tanto faz', 'Gostaria', 'Gostaria muito'],
  },
  competencia: {
    ask: 'O quanto você se sai bem nisso hoje?',
    labels: ['Tenho muita dificuldade', 'Tenho alguma dificuldade', 'Mais ou menos', 'Faço bem', 'Faço muito bem'],
  },
  concordo: {
    ask: 'O quanto isso parece com você?',
    labels: ['Nada a ver comigo', 'Pouco a ver comigo', 'Mais ou menos', 'Tem a ver comigo', 'É a minha cara'],
  },
  importancia: {
    ask: 'O quanto isso pesa na sua escolha de carreira?',
    labels: ['Não pesa nada', 'Pesa pouco', 'Pesa mais ou menos', 'Pesa bastante', 'É essencial'],
  },
};

/* ---------- Dimensões ---------- */
const RIASEC = {
  R: { nome: 'Realista', curto: 'mão na massa, ferramentas, máquinas, ar livre' },
  I: { nome: 'Investigativo', curto: 'pesquisar, analisar, entender como as coisas funcionam' },
  A: { nome: 'Artístico', curto: 'criar, expressar ideias, estética, originalidade' },
  S: { nome: 'Social', curto: 'ajudar, ensinar, cuidar, trabalhar com pessoas' },
  E: { nome: 'Empreendedor', curto: 'liderar, persuadir, negociar, abrir caminhos' },
  C: { nome: 'Convencional', curto: 'organizar, seguir processos, cuidar de detalhes e dados' },
};

const BIG5 = {
  E: { nome: 'Extroversão', curto: 'energia vinda do contato com pessoas' },
  A: { nome: 'Amabilidade', curto: 'cooperação, empatia, paciência com os outros' },
  C: { nome: 'Disciplina e organização', curto: 'planejamento, constância, cumprir o combinado' },
  S: { nome: 'Estabilidade emocional', curto: 'calma sob pressão, recuperação depois de frustrações' },
  O: { nome: 'Abertura ao novo', curto: 'curiosidade, ideias abstratas, gosto por mudança' },
};

const VALORES = {
  autonomia: { nome: 'Autonomia', curto: 'decidir como e quando trabalhar' },
  estabilidade: { nome: 'Estabilidade', curto: 'segurança e previsibilidade' },
  proposito: { nome: 'Propósito', curto: 'ajudar e fazer sentido' },
  desafio: { nome: 'Desafio e aprendizado', curto: 'problemas difíceis, crescer sempre' },
  equilibrio: { nome: 'Equilíbrio de vida', curto: 'tempo livre e flexibilidade' },
  remuneracao: { nome: 'Remuneração', curto: 'ganhar bem' },
  reconhecimento: { nome: 'Reconhecimento', curto: 'respeito, prestígio, ser referência' },
  criacao: { nome: 'Criar algo próprio', curto: 'inovar, empreender, fazer do seu jeito' },
};

/* ---------- Seções (a ordem aqui é a ordem do teste) ---------- */
const SECTIONS = [
  /* 1. ATIVIDADES (interesses RIASEC) */
  {
    id: 'atividades',
    title: 'Atividades',
    kind: 'dims',
    scale: 'interesse',
    meta: RIASEC,
    order: ['R', 'I', 'A', 'S', 'E', 'C'],
    intro:
      'Imagine que dinheiro, nota e a opinião dos outros não importam. Para cada atividade, diga o quanto você gostaria de fazer. Não precisa saber fazer, basta ter vontade.',
    items: {
      R: [
        'Consertar uma moto, uma bicicleta ou um eletrodoméstico.',
        'Montar ou construir algo com as próprias mãos, como um móvel ou uma estrutura.',
        'Trabalhar ao ar livre, com plantas, animais, terra ou obra.',
        'Operar máquinas, equipamentos ou veículos.',
        'Instalar a parte elétrica ou hidráulica de uma casa.',
        'Trabalhar em campo, oficina ou fábrica, e não em escritório.',
        'Aprender a usar ferramentas técnicas, como solda, torno ou drone.',
      ],
      I: [
        'Fazer experimentos para descobrir como algo funciona.',
        'Ler sobre descobertas científicas e entender o porquê das coisas.',
        'Analisar números ou dados para encontrar padrões e explicações.',
        'Resolver problemas difíceis de lógica, matemática ou quebra-cabeça.',
        'Pesquisar um assunto a fundo, por semanas, até entender tudo.',
        'Investigar a causa de um problema, como por que uma doença surge ou um sistema falha.',
        'Estudar o corpo humano, o cérebro ou a natureza em um laboratório.',
      ],
      A: [
        'Escrever histórias, letras de música, roteiros ou poesia.',
        'Desenhar, pintar ou criar o visual de marcas e projetos.',
        'Tocar, cantar, compor ou produzir música.',
        'Atuar, dançar ou se apresentar diante de um público.',
        'Fotografar, filmar e editar vídeos com estilo próprio.',
        'Criar ou decorar espaços, roupas ou objetos para ficarem bonitos e únicos.',
        'Inventar ideias originais, sem ter regras prontas para seguir.',
      ],
      S: [
        'Ajudar alguém que está passando por um problema pessoal ou emocional.',
        'Ensinar ou explicar uma matéria para quem tem dificuldade.',
        'Cuidar de pessoas doentes ou que precisam de ajuda no dia a dia.',
        'Participar de projetos de voluntariado ou de ação social na comunidade.',
        'Acompanhar o desenvolvimento de crianças ou adolescentes.',
        'Mediar uma briga e ajudar as pessoas a chegarem a um acordo.',
        'Atender pessoas e fazer com que elas se sintam acolhidas.',
      ],
      E: [
        'Montar um negócio próprio e correr atrás de clientes.',
        'Convencer pessoas a apoiarem uma ideia ou comprarem um produto.',
        'Liderar uma equipe e tomar as decisões difíceis.',
        'Negociar preços, contratos ou parcerias.',
        'Competir por metas e resultados, com ranking e premiação.',
        'Apresentar um projeto para investidores ou diretores.',
        'Organizar um evento ou uma campanha e fazer acontecer do zero.',
      ],
      C: [
        'Organizar planilhas, arquivos e documentos para que tudo fique em ordem.',
        'Cuidar das contas, do orçamento e dos registros financeiros de uma empresa.',
        'Seguir um procedimento passo a passo, sem errar nada.',
        'Conferir dados e documentos para achar erros e inconsistências.',
        'Planejar agenda, estoque ou entregas para que nada falte.',
        'Trabalhar com regras, normas e processos bem definidos.',
        'Preencher, revisar e controlar cadastros, notas ou relatórios com cuidado.',
      ],
    },
  },

  /* 2. HABILIDADES (autoavaliação por tipo RIASEC) */
  {
    id: 'habilidades',
    title: 'Habilidades',
    kind: 'dims',
    scale: 'competencia',
    meta: RIASEC,
    order: ['R', 'I', 'A', 'S', 'E', 'C'],
    intro:
      'Agora é sobre o que você faz bem hoje, e não sobre o que gostaria de fazer. Seja realista: nem modesto demais, nem exagerado.',
    items: {
      R: [
        'Usar ferramentas, consertar coisas e entender como equipamentos funcionam.',
        'Ter boa coordenação e habilidade com as mãos.',
      ],
      I: [
        'Entender matemática e ciências e aplicar na prática.',
        'Pesquisar, comparar informações e chegar a conclusões bem fundamentadas.',
      ],
      A: [
        'Ter ideias originais e transformar em algo concreto, como texto, imagem, som ou vídeo.',
        'Perceber o que é bonito e harmônico: cores, formas, ritmo, estilo.',
      ],
      S: [
        'Escutar alguém com atenção e perceber o que a pessoa realmente sente.',
        'Explicar algo difícil de um jeito que os outros entendem.',
      ],
      E: [
        'Convencer pessoas e tomar a frente quando o grupo está parado.',
        'Decidir e agir mesmo sem ter todas as informações.',
      ],
      C: [
        'Manter tudo organizado e cumprir prazos sem precisar ser lembrado.',
        'Cuidar dos detalhes e deixar passar poucos erros.',
      ],
    },
  },

  /* 3. JEITO DE SER (Big Five curto) */
  {
    id: 'jeito',
    title: 'Jeito de ser',
    kind: 'dims',
    scale: 'concordo',
    meta: BIG5,
    order: ['E', 'A', 'C', 'S', 'O'],
    intro:
      'Como você costuma ser no dia a dia. Responda pelo que você é hoje, não pelo que gostaria de ser. O primeiro impulso costuma ser o mais honesto.',
    items: {
      E: [
        'Fico à vontade em grupos e costumo puxar conversa.',
        rev('Depois de um dia com muita gente, preciso ficar sozinho para recuperar a energia.'),
        'Gosto de ser o centro das atenções de vez em quando.',
      ],
      A: [
        'Me preocupo de verdade com o que as outras pessoas estão sentindo.',
        rev('Os problemas dos outros costumam me afetar pouco.'),
        'Sou paciente e gentil mesmo com quem me irrita.',
      ],
      C: [
        'Gosto de deixar tudo planejado antes de começar algo.',
        rev('Costumo deixar as tarefas para a última hora.'),
        'Termino o que começo, mesmo quando perde a graça.',
      ],
      S: [
        'Mantenho a calma em situações de pressão.',
        rev('Fico ansioso ou preocupado com facilidade.'),
        'Me recupero rápido depois de uma decepção ou de uma crítica.',
      ],
      O: [
        'Gosto de conhecer ideias, culturas e jeitos de pensar bem diferentes do meu.',
        rev('Prefiro fazer do jeito que já deu certo a testar coisas novas.'),
        'Me empolgo com teorias, ideias abstratas e conversas profundas.',
      ],
    },
  },

  /* 4. VALORES (âncoras de carreira) */
  {
    id: 'valores',
    title: 'O que importa',
    kind: 'dims',
    scale: 'importancia',
    meta: VALORES,
    order: ['autonomia', 'estabilidade', 'proposito', 'desafio', 'equilibrio', 'remuneracao', 'reconhecimento', 'criacao'],
    intro:
      'O que precisa existir num trabalho para ele valer a pena para você. Quase tudo parece importante, então tente ser seletivo: reserve o "essencial" para o que realmente não abre mão.',
    items: {
      autonomia: [
        'Decidir sozinho como organizar meu tempo e meu jeito de trabalhar.',
        'Não ter ninguém me vigiando a cada detalhe.',
        'Poder escolher em quais projetos eu trabalho.',
      ],
      estabilidade: [
        'Ter um emprego seguro, sem medo de ser mandado embora.',
        'Receber um salário certo todo mês.',
        'Saber o que esperar do meu futuro, com uma carreira previsível.',
      ],
      proposito: [
        'Ajudar pessoas ou melhorar o mundo com o meu trabalho.',
        'Sentir que o que faço tem significado, e não só paga as contas.',
        'Contribuir com uma causa em que eu acredito.',
      ],
      desafio: [
        'Enfrentar problemas difíceis que me obriguem a crescer.',
        'Aprender coisas novas o tempo todo.',
        'Sentir que estou sendo testado, e não entediado.',
      ],
      equilibrio: [
        'Ter tempo de sobra para família, amigos e hobbies.',
        'Ter flexibilidade de horário e de local.',
        'Um trabalho que não invada minhas noites e fins de semana.',
      ],
      remuneracao: [
        'Ganhar muito bem, mesmo que isso exija mais esforço.',
        'Poder aumentar minha renda rápido quando entrego resultado.',
        'Conseguir pagar o estilo de vida que eu quero.',
      ],
      reconhecimento: [
        'Ser reconhecido e respeitado pelo que faço.',
        'Ter um cargo ou título de prestígio.',
        'Ser visto como referência no que faço.',
      ],
      criacao: [
        'Criar algo meu, do meu jeito.',
        'Ter o meu próprio negócio um dia.',
        'Ter espaço para inovar e propor ideias novas.',
      ],
    },
  },

  /* 5. DIA A DIA (preferências de contexto, sem pontuação por dimensão) */
  {
    id: 'dia',
    title: 'Dia a dia',
    kind: 'list',
    scale: 'concordo',
    intro: 'Como você imagina o seu dia a dia de trabalho ideal. Aqui não existe certo: cada resposta ajuda a separar ambientes que combinam ou não com você.',
    keys: ['remoto', 'startup', 'equipe', 'rotina', 'movimento', 'mudar'],
    items: [
      'Gosto da ideia de trabalhar de casa ou de qualquer lugar, sem ir a um escritório.',
      'Prefiro um lugar pequeno e em construção, onde tudo muda, a uma empresa grande e organizada.',
      'Rendo mais quando trabalho junto com outras pessoas do que quando trabalho sozinho.',
      'Me sinto bem numa rotina previsível, em que eu sei o que vai acontecer em cada dia.',
      'Prefiro um trabalho em que eu me movimento ou fico fora do escritório a ficar sentado o dia todo.',
      'Eu toparia mudar de cidade ou de país por uma boa oportunidade.',
    ],
  },

  /* 6. MOMENTO (maturidade da escolha, sem pontuação por dimensão) */
  {
    id: 'momento',
    title: 'Seu momento',
    kind: 'list',
    scale: 'concordo',
    intro: 'Como você está agora diante dessa escolha. Isso ajuda a análise a ser útil para o seu momento, e não só para o seu perfil.',
    keys: ['certeza', 'pressao', 'conhece'],
    items: [
      'Hoje eu já tenho uma ideia clara do que quero seguir profissionalmente.',
      'A pressão para escolher certo me deixa travado ou ansioso.',
      'Sei bem o que as profissões que mais me atraem fazem no dia a dia.',
    ],
  },

  /* 7. REFLEXÕES ABERTAS */
  {
    id: 'abertas',
    title: 'Em suas palavras',
    kind: 'open',
    intro:
      'Escreva do seu jeito. Poucas linhas já ajudam, e quanto mais você contar, mais personalizada fica a análise. Pode pular qualquer uma.',
    items: [
      {
        id: 'flow',
        t: 'Qual atividade faz o tempo passar sem você perceber? Pode ser estudo, jogo, trabalho, hobby, qualquer coisa.',
        ph: 'Ex.: quando estou editando vídeo, olho o relógio e já passaram 4 horas...',
      },
      {
        id: 'orgulho',
        t: 'Conte algo que você fez (na escola, no trabalho, em casa ou com amigos) e do qual se orgulha. O que exatamente você fez?',
        ph: 'Descreva a situação e o que foi a sua parte nela...',
      },
      {
        id: 'nao_quer',
        t: 'Que tipo de trabalho ou de dia a dia você NÃO quer de jeito nenhum?',
        ph: 'Saber o que não quer é tão útil quanto saber o que quer...',
      },
      {
        id: 'sonho',
        t: 'Se pudesse escolher qualquer profissão, sem se preocupar com dinheiro, nota ou o que os outros vão pensar, qual seria e por quê?',
        ph: 'Escreva sem filtro, mesmo que pareça maluco...',
      },
      {
        id: 'pedem',
        t: 'Para que as pessoas costumam te procurar quando precisam de ajuda ou de uma opinião?',
        ph: 'Amigos, família, colegas: o que eles pedem a você?',
      },
      {
        id: 'admira',
        t: 'Quem você admira profissionalmente e o que dessa pessoa te atrai?',
        ph: 'Pode ser alguém famoso, um parente, um professor...',
      },
      {
        id: 'dez_anos',
        t: 'Como seria um dia comum da sua vida daqui a 10 anos, se tudo desse certo?',
        ph: 'Onde você acorda, com quem fala, o que faz, como termina o dia...',
      },
    ],
    final: {
      id: 'contexto_livre',
      t: 'Tem algo que a gente precisa saber para te orientar melhor? Por exemplo: o que sua família espera, quanto dá para gastar com estudo, cidade onde você precisa ficar, cursos que já tentou ou largou, matérias de que gosta ou odeia.',
      ph: 'Qualquer coisa que influencie a sua escolha...',
    },
  },
];

/* ---------- Versões do teste ----------
   Os números são "perguntas por grupo" (por tipo ou por valor) nas seções por dimensão,
   "quantas frases" nas seções em lista, e "quantas perguntas abertas" (além da última,
   que é sempre incluída). Zero tira a seção inteira da versão. */
const TIERS = {
  rapido: {
    nome: 'Rápido',
    resumo: 'Uma primeira ideia',
    desc: 'Para quem tem pouco tempo ou só quer um empurrão inicial. Mede interesses e valores principais.',
    counts: { atividades: 3, habilidades: 0, jeito: 0, valores: 1, dia: 0, momento: 2, abertas: 1 },
  },
  equilibrado: {
    nome: 'Equilibrado',
    resumo: 'Recomendado',
    desc: 'Interesses, habilidades, jeito de ser e valores. Bom para a maioria das pessoas.',
    counts: { atividades: 4, habilidades: 1, jeito: 2, valores: 2, dia: 0, momento: 2, abertas: 3 },
    recomendado: true,
  },
  completo: {
    nome: 'Completo',
    resumo: 'Para decidir com calma',
    desc: 'Tudo do Equilibrado, com mais perguntas em cada área, o dia a dia que você quer e mais espaço para escrever. Ideal se você está em dúvida entre muitos caminhos.',
    counts: { atividades: 7, habilidades: 2, jeito: 3, valores: 3, dia: 6, momento: 3, abertas: 7 },
  },
};

/* ---------- Montagem do teste de uma versão ---------- */
function buildTest(tierKey) {
  const tier = TIERS[tierKey];
  const sections = [];

  SECTIONS.forEach((sec) => {
    const n = tier.counts[sec.id] || 0;
    if (!n) return;
    const qs = [];

    if (sec.kind === 'dims') {
      // intercala os grupos (R, I, A, S, E, C, R, I, ...) para não repetir o assunto em sequência
      for (let k = 0; k < n; k++) {
        sec.order.forEach((dim) => {
          const raw = sec.items[dim][k];
          if (!raw) return;
          qs.push({
            id: `${sec.id}_${dim}_${k + 1}`,
            section: sec.id,
            dim,
            text: raw.t || raw,
            rev: !!raw.rev,
            type: 'likert',
            scale: sec.scale,
          });
        });
      }
    } else if (sec.kind === 'list') {
      sec.items.slice(0, n).forEach((raw, k) => {
        qs.push({
          id: `${sec.id}_${sec.keys[k]}`,
          section: sec.id,
          dim: sec.keys[k],
          text: raw,
          rev: false,
          type: 'likert',
          scale: sec.scale,
        });
      });
    } else if (sec.kind === 'open') {
      sec.items.slice(0, n).concat([sec.final]).forEach((raw) => {
        qs.push({
          id: `aberta_${raw.id}`,
          section: sec.id,
          dim: raw.id,
          text: raw.t,
          placeholder: raw.ph,
          type: 'open',
        });
      });
    }

    sections.push({
      id: sec.id,
      title: sec.title,
      intro: sec.intro,
      kind: sec.kind,
      scale: sec.scale || null,
      meta: sec.meta || null,
      questions: qs,
    });
  });

  let idx = 0;
  const flat = [];
  sections.forEach((s) => {
    s.startIndex = idx;
    s.questions.forEach((q) => {
      q.index = idx++;
      flat.push(q);
    });
  });

  const totalLikert = flat.filter((q) => q.type === 'likert').length;
  const totalOpen = flat.length - totalLikert;

  return {
    tier: tierKey,
    meta: {
      nome: tier.nome,
      total: flat.length,
      totalLikert,
      totalOpen,
      etapas: sections.length,
      minMin: Math.round((totalLikert * 7 + totalOpen * 45) / 60),
      minMax: Math.round((totalLikert * 10 + totalOpen * 100) / 60),
    },
    sections,
    flat,
  };
}
