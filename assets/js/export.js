const Export = {
  generateCSV(state) {
    const rows = [];

    // Header row
    const headers = [
      'respondente_id',
      'data_inicio',
      'data_conclusao',
      'duracao_minutos',
      'nome',
      'idade',
      'genero',
      'cidade',
      ...QUESTIONS.flat.map(q => q.id)
    ];
    rows.push(headers);

    // Data row
    const startTime = new Date(state.startTime);
    const endTime = new Date();
    const durationMins = Math.round((endTime - startTime) / 60000);

    const values = [
      state.respondentId,
      startTime.toISOString(),
      endTime.toISOString(),
      durationMins,
      this.escapeCsv(state.personalData.nome || ''),
      state.personalData.idade || '',
      this.escapeCsv(state.personalData.genero || ''),
      this.escapeCsv(state.personalData.cidade || ''),
      ...QUESTIONS.flat.map(q => this.escapeCsv(String(state.answers[q.id] || '')))
    ];
    rows.push(values);

    return rows.map(r => r.join(',')).join('\n');
  },

  escapeCsv(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    if (str.includes(',') || str.includes('"') || str.includes('\n') || str.includes('\r')) {
      return '"' + str.replace(/"/g, '""') + '"';
    }
    return str;
  },

  download(state) {
    const csv = this.generateCSV(state);
    const bom = '﻿';
    const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const date = new Date().toISOString().slice(0, 10);
    const nome = (state.personalData.nome || 'respondente').replace(/\s+/g, '_').toLowerCase();
    link.href = url;
    link.download = `vocacional_${nome}_${date}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
};
