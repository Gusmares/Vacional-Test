const STORAGE_KEY = 'vocacional_v2';
const LEGACY_KEYS = ['vocacional_v1'];

const Storage = {
  save(state) {
    try {
      const data = {
        tier: state.tier,
        screen: state.screen,
        si: state.si,
        qi: state.qi,
        personal: state.personal,
        answers: state.answers,
        respondentId: state.respondentId,
        startTime: state.startTime,
        endTime: state.endTime,
        savedAt: new Date().toISOString(),
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      /* modo privado ou armazenamento cheio: o teste segue funcionando, só não salva */
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  },

  clear() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
  },

  clearLegacy() {
    try {
      LEGACY_KEYS.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
  },

  hasProgress() {
    const d = this.load();
    return !!(d && d.tier && d.answers && Object.keys(d.answers).length > 0);
  },
};
