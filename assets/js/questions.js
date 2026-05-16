const QUESTIONS = {
  parts: [
    {
      id: 'perfil',
      index: 0,
      title: 'Perfil Pessoal',
      subtitle: 'Como você se enxerga e age no dia a dia',
      emoji: '🧭',
      color: '#6366F1',
      colorLight: '#EEF2FF',
      intro: 'Vamos começar pelo mais importante: entender quem você é. Não há respostas certas ou erradas — apenas verdades suas.',
      questions: [
        { id: 'energia_social', type: 'likert', text: 'Prefiro trabalhar em equipe do que sozinho.' },
        { id: 'lideranca_natural', type: 'likert', text: 'Em grupos, costumo assumir naturalmente o papel de liderança.' },
        { id: 'comunicacao_oral', type: 'likert', text: 'Tenho facilidade em me expressar e articular ideias verbalmente.' },
        { id: 'comunicacao_escrita', type: 'likert', text: 'Prefiro me comunicar por escrito — textos, e-mails, mensagens — do que verbalmente.' },
        { id: 'organizacao_pessoal', type: 'likert', text: 'Sou naturalmente organizado: cuido do meu espaço, agenda e tarefas com facilidade.' },
        { id: 'criatividade_diaria', type: 'likert', text: 'Costumo pensar em formas novas e criativas de resolver problemas cotidianos.' },
        { id: 'analise_logica', type: 'likert', text: 'Prefiro resolver problemas com base em lógica, dados e raciocínio estruturado.' },
        { id: 'sensibilidade_emocional', type: 'likert', text: 'Sou emocionalmente sensível e percebo sutilezas no comportamento das pessoas ao meu redor.' },
        { id: 'foco_detalhe', type: 'likert', text: 'Prefiro trabalhar com detalhes e precisão ao invés de apenas com visão geral.' },
        { id: 'adaptabilidade', type: 'likert', text: 'Me adapto com facilidade a mudanças, imprevistos e novos contextos.' },
        { id: 'autonomia_trabalho', type: 'likert', text: 'Prefiro trabalhar com autonomia e independência, sem supervisão constante.' },
        { id: 'conforto_rotina', type: 'likert', text: 'Me sinto confortável e produtivo em rotinas e processos bem estabelecidos.' },
        { id: 'aprendizado_continuo', type: 'likert', text: 'Tenho um desejo genuíno e constante de aprender coisas novas.' },
        { id: 'paciencia_ensinar', type: 'likert', text: 'Tenho paciência e prazer em ensinar ou explicar algo para outras pessoas.' },
        { id: 'perfeccionismo', type: 'likert', text: 'Costumo querer que o trabalho esteja completo e refinado antes de considerar finalizado.' },
      ]
    },
    {
      id: 'interesses',
      index: 1,
      title: 'Interesses Profissionais',
      subtitle: 'O que desperta genuína curiosidade em você',
      emoji: '🔍',
      color: '#0EA5E9',
      colorLight: '#F0F9FF',
      intro: 'Agora exploramos seus interesses. Responda com o que realmente te move — não o que "deveria" te mover.',
      questions: [
        { id: 'interesse_tecnologia', type: 'likert', text: 'Tenho interesse genuíno por tecnologia, inovação e o futuro digital.' },
        { id: 'interesse_saude', type: 'likert', text: 'Me interessa profundamente trabalhar com saúde, cuidado e bem-estar das pessoas.' },
        { id: 'interesse_educacao', type: 'likert', text: 'Sinto vontade de trabalhar com educação, ensino e desenvolvimento humano.' },
        { id: 'interesse_arte_design', type: 'likert', text: 'Me atrai genuinamente a área de arte, design e expressão criativa visual.' },
        { id: 'interesse_negocios', type: 'likert', text: 'Sinto interesse pelo mundo dos negócios, estratégia e empreendedorismo.' },
        { id: 'interesse_ciencias_exatas', type: 'likert', text: 'Tenho fascínio por ciências exatas, matemática, física ou química.' },
        { id: 'interesse_ciencias_humanas', type: 'likert', text: 'Me interessa estudar comportamento humano, sociedade, cultura e história.' },
        { id: 'interesse_meio_ambiente', type: 'likert', text: 'Sinto conexão com natureza, ecologia, sustentabilidade e meio ambiente.' },
        { id: 'interesse_direito', type: 'likert', text: 'Me interessa o campo do direito, leis, ética e justiça.' },
        { id: 'interesse_comunicacao', type: 'likert', text: 'Sinto vontade de trabalhar com comunicação, jornalismo, marketing ou mídia.' },
        { id: 'interesse_financas', type: 'likert', text: 'Me interessa o mercado financeiro, economia, investimentos e análise de dados.' },
        { id: 'interesse_esportes', type: 'likert', text: 'Sinto atração por esporte, educação física, performance e movimento.' },
        { id: 'interesse_gastronomia', type: 'likert', text: 'Me interessa culinária, gastronomia, alimentação e cultura gastronômica.' },
        { id: 'interesse_musica', type: 'likert', text: 'Sinto conexão profunda com música, ritmo, composição ou performance sonora.' },
        { id: 'interesse_arquitetura', type: 'likert', text: 'Me interessa arquitetura, urbanismo, espaços e o ambiente construído.' },
        { id: 'interesse_engenharia', type: 'likert', text: 'Tenho vontade de criar, projetar e desenvolver soluções de engenharia.' },
        { id: 'interesse_medicina_clinica', type: 'likert', text: 'Tenho interesse pela medicina, diagnóstico clínico e ciências da saúde.' },
        { id: 'interesse_psicologia', type: 'likert', text: 'Me interessa compreender a mente humana, emoções e comportamento.' },
        { id: 'interesse_politica_social', type: 'likert', text: 'Sinto vontade de participar da vida política, social e de transformação coletiva.' },
        { id: 'interesse_moda_cultura', type: 'likert', text: 'Me interessa o universo da moda, estilo e identidade cultural.' },
      ]
    },
    {
      id: 'habilidades',
      index: 2,
      title: 'Habilidades e Comportamento',
      subtitle: 'Como você age, pensa e performa',
      emoji: '⚡',
      color: '#F59E0B',
      colorLight: '#FFFBEB',
      intro: 'Esta etapa revela como você opera. Seja honesto — é justamente na honestidade que as descobertas mais importantes aparecem.',
      questions: [
        { id: 'habilidade_negociacao', type: 'likert', text: 'Tenho facilidade em negociar, persuadir e encontrar acordos.' },
        { id: 'habilidade_escuta_ativa', type: 'likert', text: 'Sou um bom ouvinte — consigo entender as pessoas com profundidade e sem julgamento.' },
        { id: 'habilidade_planejamento', type: 'likert', text: 'Tenho facilidade em planejar, organizar e estruturar projetos complexos.' },
        { id: 'habilidade_criacao', type: 'likert', text: 'Consigo criar coisas novas com naturalidade — textos, arte, produtos, ideias.' },
        { id: 'habilidade_calculo', type: 'likert', text: 'Tenho facilidade com cálculos, raciocínio matemático e análise numérica.' },
        { id: 'habilidade_pesquisa_analise', type: 'likert', text: 'Gosto e tenho habilidade em pesquisar, analisar dados e extrair insights.' },
        { id: 'habilidade_apresentacao', type: 'likert', text: 'Consigo apresentar ideias de forma clara, envolvente e convincente.' },
        { id: 'habilidade_escrita_criativa', type: 'likert', text: 'Tenho facilidade com escrita criativa, narrativas e construção de textos.' },
        { id: 'habilidade_tecnica', type: 'likert', text: 'Me considero uma pessoa com boas habilidades técnicas na minha área de interesse.' },
        { id: 'habilidade_empatia', type: 'likert', text: 'Consigo me colocar genuinamente no lugar dos outros com facilidade.' },
        { id: 'comportamento_tolerancia_risco', type: 'likert', text: 'Me sinto confortável tomando riscos calculados em situações importantes.' },
        { id: 'comportamento_metodico', type: 'likert', text: 'Sigo processos e métodos com rigor — prefiro a consistência ao improviso.' },
        { id: 'comportamento_intuitivo', type: 'likert', text: 'Costumo confiar na intuição como guia para decisões importantes.' },
        { id: 'comportamento_competitivo', type: 'likert', text: 'Sou naturalmente orientado a resultados e me motivo com metas e desafios.' },
        { id: 'comportamento_colaborativo', type: 'likert', text: 'Prefiro construir resultados em conjunto com outros a trabalhar sozinho.' },
        { id: 'comportamento_inovador', type: 'likert', text: 'Gosto de propor ideias novas e questionar a forma como as coisas são feitas.' },
        { id: 'comportamento_executor', type: 'likert', text: 'Me sinto mais realizado executando e entregando do que apenas planejando.' },
        { id: 'comportamento_estrategico', type: 'likert', text: 'Penso de forma estratégica, com foco no longo prazo e no quadro geral.' },
        { id: 'gestao_tempo', type: 'likert', text: 'Tenho boa gestão do meu tempo e sei priorizar o que é importante.' },
        { id: 'resiliencia', type: 'likert', text: 'Me recupero bem de fracassos, críticas e situações difíceis.' },
        { id: 'iniciativa', type: 'likert', text: 'Costumo tomar a iniciativa sem precisar ser incentivado ou cobrado.' },
        { id: 'trabalho_pressao', type: 'likert', text: 'Funciono bem sob pressão — prazos e situações de alta exigência me ativam.' },
        { id: 'autonomia_decisao', type: 'likert', text: 'Me sinto seguro tomando decisões importantes de forma independente.' },
        { id: 'abertura_feedback', type: 'likert', text: 'Recebo bem críticas e feedbacks — os vejo como oportunidade de crescimento.' },
        { id: 'multitarefa', type: 'likert', text: 'Consigo trabalhar em várias frentes ao mesmo tempo sem perder eficiência.' },
        { id: 'foco_profundo', type: 'likert', text: 'Prefiro me concentrar profundamente em uma coisa de cada vez.' },
        { id: 'curiosidade_intelectual', type: 'likert', text: 'Tenho alta curiosidade intelectual — gosto de aprofundar e explorar temas com rigor.' },
        { id: 'disciplina', type: 'likert', text: 'Sou disciplinado e consistente nas minhas ações, mesmo sem pressão externa.' },
        { id: 'visao_sistemica', type: 'likert', text: 'Consigo visualizar como as partes de um sistema se conectam e se afetam.' },
        { id: 'resolucao_conflito', type: 'likert', text: 'Tenho facilidade em mediar e resolver conflitos entre pessoas.' },
      ]
    },
    {
      id: 'valores',
      index: 3,
      title: 'Valores e Futuro',
      subtitle: 'O que você quer construir e o que não abre mão',
      emoji: '🌱',
      color: '#10B981',
      colorLight: '#ECFDF5',
      intro: 'Esta etapa é sobre o que realmente importa para você. Seus valores são a bússola que vai guiar todas as escolhas profissionais.',
      questions: [
        { id: 'valor_proposito', type: 'likert', text: 'Ter propósito e significado no trabalho é mais importante para mim do que o salário.' },
        { id: 'valor_impacto_social', type: 'likert', text: 'Quero que meu trabalho gere impacto real e positivo na vida de outras pessoas.' },
        { id: 'valor_autonomia', type: 'likert', text: 'Autonomia e liberdade para tomar decisões são essenciais para mim no trabalho.' },
        { id: 'valor_estabilidade', type: 'likert', text: 'Prefiro estabilidade e segurança profissional a riscos e aventuras imprevisíveis.' },
        { id: 'valor_reconhecimento', type: 'likert', text: 'O reconhecimento público pelo meu trabalho é muito importante para mim.' },
        { id: 'valor_criatividade', type: 'likert', text: 'Preciso de espaço para criatividade e expressão no meu trabalho — sem isso, me sinto preso.' },
        { id: 'valor_aprendizado_continuo', type: 'likert', text: 'Quero estar sempre aprendendo, crescendo e evoluindo profissionalmente.' },
        { id: 'valor_remuneracao', type: 'likert', text: 'A remuneração financeira é um fator decisivo nas minhas escolhas de carreira.' },
        { id: 'valor_flexibilidade', type: 'likert', text: 'Flexibilidade de horário e local de trabalho é essencial para minha qualidade de vida.' },
        { id: 'valor_crescimento_hierarquico', type: 'likert', text: 'Me importa ter um plano claro de crescimento e progressão na carreira.' },
        { id: 'valor_trabalho_equipe', type: 'likert', text: 'Valorizo profundamente trabalhar com uma equipe de alto nível.' },
        { id: 'valor_inovacao', type: 'likert', text: 'Quero trabalhar em ambientes inovadores e de vanguarda.' },
        { id: 'valor_tradicao_empresas', type: 'likert', text: 'Me sinto confortável e motivado em empresas tradicionais e consolidadas.' },
        { id: 'valor_missao_social', type: 'likert', text: 'Quero que minha carreira tenha uma dimensão de contribuição social clara.' },
        { id: 'valor_atuacao_global', type: 'likert', text: 'Tenho vontade de trabalhar em contexto global ou internacional.' },
        { id: 'desejo_empreender', type: 'likert', text: 'Tenho vontade genuína de ter meu próprio negócio algum dia.' },
        { id: 'interesse_carreira_corporativa', type: 'likert', text: 'Me vejo construindo uma carreira dentro de uma empresa corporativa estruturada.' },
        { id: 'interesse_carreira_freelance', type: 'likert', text: 'Me vejo trabalhando de forma independente, como freelancer ou consultor.' },
        { id: 'interesse_carreira_academica', type: 'likert', text: 'Tenho interesse em seguir carreira acadêmica ou científica.' },
        { id: 'interesse_setor_publico', type: 'likert', text: 'Tenho interesse em servir ao setor público ou governamental.' },
        { id: 'clareza_futuro_profissional', type: 'likert', text: 'Já tenho uma visão clara de onde quero estar profissionalmente em 5 anos.' },
        { id: 'capacidade_autodidata', type: 'likert', text: 'Consigo aprender de forma autodidata com facilidade e disciplina.' },
        { id: 'interesse_experiencia_internacional', type: 'likert', text: 'Tenho interesse real em trabalhar ou estudar fora do Brasil.' },
        { id: 'possuo_projeto_proprio', type: 'likert', text: 'Tenho alguma ideia de projeto ou negócio que gostaria de desenvolver.' },
        { id: 'reflexao_legado_carreira', type: 'likert', text: 'Penso frequentemente no legado que quero deixar ao longo da minha carreira.' },
      ]
    },
    {
      id: 'cenarios',
      index: 4,
      title: 'Cenários Profissionais',
      subtitle: 'Imagine-se nesses contextos',
      emoji: '🎬',
      color: '#EC4899',
      colorLight: '#FDF2F8',
      intro: 'Esta etapa usa cenários reais. Imagine-se genuinamente em cada situação e responda conforme o que sentiria.',
      questions: [
        { id: 'cenario_resolver_problemas_complexos', type: 'likert', text: 'Quando há um problema complexo, gosto de ser o responsável por resolvê-lo.' },
        { id: 'cenario_apresentacao_publica', type: 'likert', text: 'Imaginar apresentar um projeto para uma plateia grande me deixa animado.' },
        { id: 'cenario_analise_dados', type: 'likert', text: 'Analisar um grande conjunto de dados para encontrar padrões me parece empolgante.' },
        { id: 'cenario_cuidado_pessoas', type: 'likert', text: 'Cuidar de alguém em dificuldade e ver sua melhora me gera profunda realização.' },
        { id: 'cenario_criar_produto', type: 'likert', text: 'Criar um produto do zero — da ideia até a entrega — me entusiasma genuinamente.' },
        { id: 'cenario_liderar_equipe', type: 'likert', text: 'Liderar uma equipe em um projeto desafiador me parece uma experiência empolgante.' },
        { id: 'cenario_pesquisa_profunda', type: 'likert', text: 'Pesquisar profundamente sobre um tema complexo por semanas me dá prazer e satisfação.' },
        { id: 'cenario_excelencia_operacional', type: 'likert', text: 'Executar processos operacionais com excelência e consistência me satisfaz.' },
        { id: 'cenario_negociacao_vendas', type: 'likert', text: 'Negociar com clientes, fechar acordos e vender me parece uma atividade estimulante.' },
        { id: 'cenario_ensinar_outros', type: 'likert', text: 'Ensinar algo que sei para alguém que não sabe me gera satisfação genuína.' },
        { id: 'cenario_construir_sistema', type: 'likert', text: 'Construir um sistema, estrutura ou processo do zero me entusiasma muito.' },
        { id: 'cenario_consultoria', type: 'likert', text: 'Ser consultado por outras pessoas e dar orientação estratégica me agrada.' },
        { id: 'cenario_trabalho_campo', type: 'likert', text: 'Trabalhar em campo — fora do escritório, no mundo real — me parece mais atraente.' },
        { id: 'cenario_trabalho_remoto', type: 'likert', text: 'Trabalhar de forma 100% remota, de qualquer lugar, me parece ideal.' },
        { id: 'cenario_startup_fase_inicial', type: 'likert', text: 'Trabalhar em uma startup em fase inicial, com incerteza e muito por construir, me parece empolgante.' },
        { id: 'cenario_grande_empresa', type: 'likert', text: 'Trabalhar em uma grande empresa estabelecida e estruturada me parece mais ideal.' },
        { id: 'cenario_missao_social_org', type: 'likert', text: 'Trabalhar em uma organização com forte missão social me atrai profundamente.' },
        { id: 'cenario_tecnologia_ponta', type: 'likert', text: 'Trabalhar com tecnologia de ponta e ferramentas do futuro me entusiasma.' },
        { id: 'cenario_arte_cultura', type: 'likert', text: 'Trabalhar em um ambiente cultural, artístico ou criativo me agrada muito.' },
        { id: 'cenario_saude_cuidado_direto', type: 'likert', text: 'Trabalhar diretamente com saúde, cuidado e bem-estar de pacientes ou clientes me realiza.' },
        { id: 'cenario_natureza_ambiente', type: 'likert', text: 'Trabalhar em contato com a natureza, campo ou meio ambiente me atrai.' },
        { id: 'cenario_educacao_formal', type: 'likert', text: 'Trabalhar dentro do sistema de educação formal me parece uma carreira significativa.' },
        { id: 'cenario_pesquisa_laboratorio', type: 'likert', text: 'Trabalhar em laboratório ou pesquisa científica de ponta me agrada.' },
        { id: 'cenario_mercado_financeiro', type: 'likert', text: 'Trabalhar no mercado financeiro, com investimentos e análise de mercados, me parece estimulante.' },
        { id: 'cenario_comunicacao_midia', type: 'likert', text: 'Trabalhar com comunicação, criação de conteúdo ou mídia me atrai.' },
        { id: 'cenario_arquitetura_design_espacos', type: 'likert', text: 'Trabalhar com arquitetura, design de interiores ou espaços me entusiasma.' },
        { id: 'cenario_gestao_pessoas', type: 'likert', text: 'Gerir, desenvolver e inspirar pessoas é algo que me parece uma atividade nobre e empolgante.' },
        { id: 'cenario_inovacao_social', type: 'likert', text: 'Criar soluções inovadoras para problemas sociais complexos me realiza.' },
        { id: 'cenario_logistica_operacoes', type: 'likert', text: 'Coordenar logística e operações complexas me parece interessante e estimulante.' },
        { id: 'cenario_juridico_legislacao', type: 'likert', text: 'Trabalhar com leis, contratos e questões jurídicas me atrai.' },
      ]
    },
    {
      id: 'abertas',
      index: 5,
      title: 'Reflexões Abertas',
      subtitle: 'Suas palavras, do jeito que você quiser',
      emoji: '✍️',
      color: '#8B5CF6',
      colorLight: '#F5F3FF',
      intro: 'A última etapa é a mais importante. Aqui você escreve com as suas próprias palavras. Não há respostas certas — apenas as suas.',
      questions: [
        {
          id: 'abertura_profissao_dos_sonhos',
          type: 'open',
          text: 'Se você pudesse escolher qualquer profissão sem restrições — financeiras, sociais ou de habilidade — qual seria? Por quê?',
          placeholder: 'Escreva livremente, sem filtros. Deixe a imaginação falar...'
        },
        {
          id: 'abertura_atividade_flow',
          type: 'open',
          text: 'Qual atividade — profissional ou não — faz o tempo "passar voando" sem você perceber?',
          placeholder: 'Pense em momentos onde você ficou completamente absorto em algo...'
        },
        {
          id: 'abertura_pessoa_admirada',
          type: 'open',
          text: 'Quem você mais admira profissionalmente e o que essa pessoa representa para você?',
          placeholder: 'Pode ser alguém famoso, próximo a você, ou até uma figura histórica...'
        },
        {
          id: 'abertura_maior_habilidade',
          type: 'open',
          text: 'Qual é a sua maior habilidade ou competência hoje — algo que você genuinamente sabe que faz bem?',
          placeholder: 'Não seja modesto. O que as pessoas reconhecem em você?'
        },
        {
          id: 'abertura_maior_desafio',
          type: 'open',
          text: 'Qual é o maior desafio ou limitação que você reconhece em si mesmo, com honestidade?',
          placeholder: 'A autoconsciência é o primeiro passo para qualquer evolução...'
        },
        {
          id: 'abertura_impacto_mundo',
          type: 'open',
          text: 'Como você quer impactar o mundo através do seu trabalho?',
          placeholder: 'Pode ser algo pequeno e local, ou algo grande e global. O que importa é que seja genuíno...'
        },
        {
          id: 'abertura_ambiente_ideal',
          type: 'open',
          text: 'Descreva o seu ambiente de trabalho ideal em detalhes — o local, as pessoas, o ritmo, a cultura.',
          placeholder: 'Feche os olhos e imagine o lugar onde você seria mais feliz trabalhando...'
        },
        {
          id: 'abertura_realizacao_profissional',
          type: 'open',
          text: 'O que te faria sentir completamente realizado profissionalmente daqui a 10 ou 20 anos?',
          placeholder: 'Pense no longo prazo — não na próxima etapa, mas no horizonte final...'
        },
        {
          id: 'abertura_o_que_nao_quer',
          type: 'open',
          text: 'Que tipo de trabalho ou contexto profissional você definitivamente NÃO quer para a sua vida?',
          placeholder: 'Às vezes saber o que não queremos é tão importante quanto saber o que queremos...'
        },
        {
          id: 'abertura_habilidade_desenvolver',
          type: 'open',
          text: 'Que habilidade ou conhecimento você mais gostaria de desenvolver nos próximos anos?',
          placeholder: 'Pode ser algo técnico, comportamental, criativo... O que te fascina aprender?'
        },
        {
          id: 'abertura_tres_valores',
          type: 'open',
          text: 'Quais são os 3 valores mais importantes para você na vida — aqueles que você não abre mão?',
          placeholder: 'Pense em princípios que guiam suas decisões mais importantes...'
        },
        {
          id: 'abertura_como_decide',
          type: 'open',
          text: 'Como você geralmente toma decisões importantes? Descreva seu processo.',
          placeholder: 'Você pesquisa muito? Confia na intuição? Conversa com alguém? Como é para você?'
        },
        {
          id: 'abertura_legado',
          type: 'open',
          text: 'Que legado você quer deixar — o que quer que as pessoas digam sobre você depois que você partir?',
          placeholder: 'Esta é uma das perguntas mais profundas. Reserve um momento para responder com cuidado...'
        },
        {
          id: 'abertura_complemento_livre',
          type: 'open',
          text: 'Há algo importante sobre você, seus sonhos ou sua história que as perguntas não capturaram? Este espaço é seu.',
          placeholder: 'Fale o que quiser. Este é um espaço completamente livre para você...'
        },
      ]
    }
  ]
};

// Flattened list for easy access
QUESTIONS.flat = QUESTIONS.parts.flatMap((part, pi) =>
  part.questions.map((q, qi) => ({ ...q, partIndex: pi, questionIndex: qi, partId: part.id }))
);

QUESTIONS.totalLikert = QUESTIONS.flat.filter(q => q.type === 'likert').length;
QUESTIONS.totalOpen = QUESTIONS.flat.filter(q => q.type === 'open').length;
QUESTIONS.total = QUESTIONS.flat.length;
