#!/usr/bin/env node
/* =========================================================
   Gera assets/js/careers.js a partir do O*NET e da curadoria em português.

   Uso:
     node tools/gerar-profissoes.js --baixar 31_0        (baixa os 3 CSVs da versão e gera)
     node tools/gerar-profissoes.js pasta-com-os-csvs 31.0   (usa arquivos que você já baixou)

   Arquivos usados (O*NET Database, CSV, licença CC BY 4.0):
     career_interest_types.csv  -> notas de interesse RIASEC (escala OI, 1 a 7) de cada ocupação
     job_zones.csv              -> nível de preparo exigido (1 a 5)
   A lista de profissões, os nomes em português, as descrições e a formação no Brasil
   vêm de tools/profissoes.txt. Para incluir ou tirar profissões, edite esse arquivo.
   ========================================================= */

const fs = require('fs');
const os = require('os');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const SAIDA = path.join(RAIZ, 'assets', 'js', 'careers.js');
const CURADORIA = path.join(__dirname, 'profissoes.txt');

const ELEMENTOS = { '1.B.1.a': 0, '1.B.1.b': 1, '1.B.1.c': 2, '1.B.1.d': 3, '1.B.1.e': 4, '1.B.1.f': 5 }; // R I A S E C

const FORMACAO_PADRAO = {
  1: 'Sem exigência formal',
  2: 'Ensino médio + curso profissionalizante',
  3: 'Curso técnico ou tecnólogo',
  4: 'Graduação',
  5: 'Graduação + pós-graduação ou residência',
};

function lerCsv(texto) {
  const linhas = [];
  let campo = '', linha = [], aspas = false;
  for (let i = 0; i < texto.length; i++) {
    const c = texto[i];
    if (aspas) {
      if (c === '"' && texto[i + 1] === '"') { campo += '"'; i++; }
      else if (c === '"') aspas = false;
      else campo += c;
    } else if (c === '"') aspas = true;
    else if (c === ',') { linha.push(campo); campo = ''; }
    else if (c === '\n' || c === '\r') {
      if (c === '\r' && texto[i + 1] === '\n') i++;
      linha.push(campo); campo = '';
      if (linha.length > 1 || linha[0] !== '') linhas.push(linha);
      linha = [];
    } else campo += c;
  }
  if (campo || linha.length) { linha.push(campo); linhas.push(linha); }
  const cab = linhas.shift();
  return linhas.map((l) => Object.fromEntries(cab.map((h, i) => [h, l[i]])));
}

async function obterArquivos(args) {
  if (args[0] === '--baixar') {
    const v = args[1] || '31_0';
    const pasta = fs.mkdtempSync(path.join(os.tmpdir(), 'onet-'));
    for (const nome of ['career_interest_types', 'job_zones']) {
      const url = `https://www.onetcenter.org/dl_files/database/db_${v}_csv/${nome}.csv`;
      const r = await fetch(url);
      if (!r.ok) throw new Error(`Falha ao baixar ${url} (${r.status})`);
      fs.writeFileSync(path.join(pasta, nome + '.csv'), Buffer.from(await r.arrayBuffer()));
    }
    return { pasta, versao: v.replace('_', '.') };
  }
  if (!args[0]) throw new Error('Informe a pasta com os CSVs ou use --baixar 31_0');
  return { pasta: args[0], versao: args[1] || '?' };
}

function mesAno(txt) {
  const [m, a] = txt.split('/');
  return Number(a) * 100 + Number(m);
}

(async () => {
  const { pasta, versao } = await obterArquivos(process.argv.slice(2));

  const interesses = lerCsv(fs.readFileSync(path.join(pasta, 'career_interest_types.csv'), 'utf8'));
  const zonas = lerCsv(fs.readFileSync(path.join(pasta, 'job_zones.csv'), 'utf8'));

  const ri = {};
  const datas = {};
  interesses.forEach((r) => {
    if (r['Scale ID'] !== 'OI' || !(r['Element ID'] in ELEMENTOS)) return;
    const cod = r['O*NET-SOC Code'];
    (ri[cod] = ri[cod] || [null, null, null, null, null, null])[ELEMENTOS[r['Element ID']]] = Number(r['Data Value']);
    (datas[cod] = datas[cod] || []).push(r['Date']);
  });
  const zona = Object.fromEntries(zonas.map((z) => [z['O*NET-SOC Code'], Number(z['Job Zone'])]));

  const itens = [];
  const faltando = [];
  const todasDatas = [];
  fs.readFileSync(CURADORIA, 'utf8')
    .split(/\r?\n/)
    .filter((l) => l.trim() && !l.trim().startsWith('#'))
    .forEach((l) => {
      const [codigo, nome, area, desc, formacao] = l.split('|').map((s) => s.trim());
      const cod = codigo + '.00';
      const notas = ri[cod] || ri[codigo];
      const z = zona[cod] || zona[codigo];
      if (!notas || notas.includes(null) || !z) { faltando.push(codigo); return; }
      (datas[cod] || datas[codigo] || []).forEach((d) => todasDatas.push(d));
      itens.push({ id: codigo, nome, area, desc, formacao: formacao || FORMACAO_PADRAO[z], zona: z, ri: notas });
    });

  const ordenadas = todasDatas.sort((a, b) => mesAno(a) - mesAno(b));
  const hoje = new Date().toISOString().slice(0, 10);

  const dados = {
    fonte: {
      nome: `O*NET ${versao} Database`,
      orgao: 'U.S. Department of Labor, Employment and Training Administration (USDOL/ETA)',
      licenca: 'CC BY 4.0',
      url: 'https://www.onetcenter.org/database.html',
      dadosDe: ordenadas[0] || '',
      dadosAte: ordenadas[ordenadas.length - 1] || '',
      geradoEm: hoje,
    },
    // pesos do cálculo (mexa aqui para ajustar)
    itens,
  };

  const cabecalho =
    '/* ARQUIVO GERADO por tools/gerar-profissoes.js. Não edite à mão: edite tools/profissoes.txt e rode o script de novo.\n' +
    '   ri = notas de interesse da ocupação, na ordem R, I, A, S, E, C (escala de 1 a 7 do O*NET). */\n';
  fs.writeFileSync(SAIDA, cabecalho + 'const CAREERS = ' + JSON.stringify(dados) + ';\n');

  console.log(`Profissões geradas: ${itens.length}`);
  console.log(`Fonte: ${dados.fonte.nome}, dados de ${dados.fonte.dadosDe} a ${dados.fonte.dadosAte}`);
  if (faltando.length) console.log('Códigos não encontrados na base (ficaram de fora):', faltando.join(', '));
})().catch((e) => { console.error(e.message); process.exit(1); });
