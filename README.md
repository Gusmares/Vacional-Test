# Teste Vocacional

Teste vocacional em HTML, CSS e JavaScript puro, sem build e sem servidor. A pessoa responde, vê na hora as profissões que mais combinam com o seu perfil e recebe um texto pronto para colar no ChatGPT, que devolve a análise completa.

## Como abrir

Abra o `index.html` no navegador, ou publique a pasta em qualquer hospedagem estática (GitHub Pages, por exemplo).

## As 3 versões

| Versão | Perguntas | Tempo | O que mede |
|---|---|---|---|
| Rápido | 30 | 5 a 8 min | interesses, valores, momento |
| Equilibrado | 62 | 10 a 16 min | + habilidades e jeito de ser |
| Completo | 110 | 18 a 30 min | + dia a dia e mais perguntas escritas |

Mais perguntas deixam o resultado mais firme: a lista de profissões mostra uma "confiança" (baixa, média ou alta) que depende de quantas frases de interesse a pessoa respondeu e de quanto o perfil se destaca.

## Base do teste

- Interesses: modelo RIASEC de Holland (mesma lógica do O*NET Interest Profiler).
- Jeito de ser: Big Five curto, com itens invertidos.
- Valores: âncoras de carreira de Schein.
- As frases são originais, escritas para o contexto brasileiro. A pontuação de cada grupo vai de 0 a 100.

## Profissões e o cálculo de afinidade

Cada profissão tem 6 notas de interesse (R, I, A, S, E, C) vindas do **O*NET 31.0 Database** (dados de 11/2023 a 02/2026), do Departamento do Trabalho dos EUA. O site calcula a **correlação** entre o perfil da pessoa e o de cada profissão, e mostra as mais próximas. Quando a versão mede habilidades, elas entram com peso menor (`PESOS`, em `assets/js/matching.js`).

- A afinidade é uma faixa de comparação (muito alta, alta, média), não a chance de dar certo.
- A base é dos EUA. Os nomes, as descrições e a formação no Brasil foram escritos neste projeto, em `tools/profissoes.txt` (252 profissões). O mercado brasileiro pode ser diferente.
- A lista vai também dentro do texto enviado ao ChatGPT, como ponto de partida para ele confirmar, remover ou acrescentar profissões.

### Como atualizar a base de profissões

O O*NET publica uma versão nova todo ano. Para atualizar:

```bash
node tools/gerar-profissoes.js --baixar 32_0
```

O script baixa os arquivos `career_interest_types.csv` e `job_zones.csv` da versão indicada, cruza com `tools/profissoes.txt` e reescreve `assets/js/careers.js` (não edite esse arquivo à mão). A tela de resultado mostra a versão e as datas dos dados automaticamente. Para incluir ou tirar profissões, edite `tools/profissoes.txt` e rode o script de novo.

### Créditos (licença CC BY 4.0)

Este projeto inclui informações do O*NET 31.0 Database, do U.S. Department of Labor, Employment and Training Administration (USDOL/ETA), usadas sob a licença CC BY 4.0. O*NET® é marca registrada do USDOL/ETA. Este projeto selecionou, traduziu e adaptou as informações, e o USDOL/ETA não aprovou, endossou nem testou essas modificações. Os arquivos `tools/profissoes.txt` e `tools/gerar-profissoes.js` listam o que foi alterado.

## Onde mexer

| Quero mudar | Arquivo |
|---|---|
| Frases das perguntas, escalas de resposta | `assets/js/questions.js` |
| Quantas perguntas cada versão tem | `TIERS`, no fim de `assets/js/questions.js` |
| Texto e estrutura do prompt enviado ao ChatGPT | `assets/js/prompt.js` |
| Como as notas são calculadas | `assets/js/scoring.js` |
| Cálculo de afinidade com as profissões | `assets/js/matching.js` |
| Lista de profissões (nomes, descrições, formação) | `tools/profissoes.txt` + `node tools/gerar-profissoes.js` |
| Telas e botões | `assets/js/app.js` |
| Cores e tamanhos | `assets/css/main.css` (variáveis no topo) |

As frases de cada grupo estão em ordem de prioridade: a versão Rápida usa as primeiras, a Completa usa todas. Para inverter uma frase (nota alta quer dizer o contrário), use `rev('texto')`.

## Sobre o prompt

A estrutura segue o guia de prompts da OpenAI: identidade, regras, exemplo de formato e, no fim, os dados (separados por tags). Ele pede análise honesta, sem frases genéricas, com a fonte de cada conclusão e o nível de confiança. Também pede que o ChatGPT não presuma nada pelo nome, cidade ou idade, porque estudos mostram viés demográfico em recomendações de carreira feitas por modelos de linguagem.

## Privacidade

As respostas ficam no `localStorage` do aparelho. Nada é enviado a servidor. O texto só chega ao ChatGPT quando a pessoa cola lá.
