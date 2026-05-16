const STORAGE_KEY = 'vocacional_v1';

const Storage = {
  save(state) {
    try {
      const data = {
        respondentId: state.respondentId,
        startTime: state.startTime,
        savedAt: new Date().toISOString(),
        personalData: state.personalData,
        answers: state.answers,
        currentPart: state.currentPart,
        currentQuestion: state.currentQuestion,
        screen: state.screen,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save to localStorage:', e);
    }
  },

  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  },

  clear() {
    localStorage.removeItem(STORAGE_KEY);
  },

  hasProgress() {
    const data = this.load();
    if (!data) return false;
    return data.answers && Object.keys(data.answers).length > 0;
  }
};
