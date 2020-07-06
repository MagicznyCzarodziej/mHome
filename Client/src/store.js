export default {
  state: {
    API_IP: null,
    LIGHTS_UPDATE_INTERVAL: null,
    THERMOMETERS_UPDATE_INTERVAL: null,
  },
  set(key, value) {
    this.state[key] = value;
    localStorage.setItem(key, value);
  },
  loadFromLocalStorage() {
    Object.keys(this.state).forEach((key) => {
      this.state[key] = localStorage.getItem(key);
    });
  },
};
