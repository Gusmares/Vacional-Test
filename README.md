# Teste Vocacional

Teste vocacional em HTML, CSS e JavaScript puro, sem build e sem servidor. A pessoa responde, e no final o site monta um texto pronto para colar no ChatGPT, que devolve a análise completa.

## Como abrir

Abra o `index.html` no navegador, ou publique a pasta em qualquer hospedagem estática (GitHub Pages, por exemplo).

## As 3 versões

| Versão | Perguntas | Tempo | O que mede |
|---|---|---|---|
| Rápido | 30 | 5 a 8 min | interesses, valores, momento |
| Equilibrado | 62 | 10 a 16 min | + habilidades e jeito de ser |
| Completo | 110 | 18 a 30 min | + dia a dia e mais perguntas escritas |

## Base do teste

- Interesses: modelo RIASEC de Holland (mesma lógica do O*NET Interest Profiler).
- Jeito de ser: Big Five curto, com itens invertidos.
- Valores: âncoras de carreira de Schein.
- As frases são originais, escritas para o contexto brasileiro. A pontuação de cada grupo vai de 0 a 100.

## Onde mexer

| Quero mudar | Arquivo |
|---|---|
| Frases das perguntas, escalas de resposta | `assets/js/questions.js` |
| Quantas perguntas cada versão tem | `TIERS`, no fim de `assets/js/questions.js` |
| Texto e estrutura do prompt enviado ao ChatGPT | `assets/js/prompt.js` |
| Como as notas são calculadas | `assets/js/scoring.js` |
| Telas e botões | `assets/js/app.js` |
| Cores e tamanhos | `assets/css/main.css` (variáveis no topo) |

As frases de cada grupo estão em ordem de prioridade: a versão Rápida usa as primeiras, a Completa usa todas. Para inverter uma frase (nota alta quer dizer o contrário), use `rev('texto')`.

## Privacidade

As respostas ficam no `localStorage` do aparelho. Nada é enviado a servidor. O texto só chega ao ChatGPT quando a pessoa cola lá.
