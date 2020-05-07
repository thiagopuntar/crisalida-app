import LoginService from '../services/LoginService';
const service = new LoginService();

function getAppData() {
  const token = sessionStorage.getItem('USER_TOKEN') || '';
  if (!token) {
    return '';
  } else {
    return JSON.parse(window.atob(token.split('.')[1]));
  }
}

export default {
  namespaced: true,
  state: {
    token: sessionStorage.getItem('USER_TOKEN') || '',
    appData: getAppData()
  },
  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.appData
  },
  mutations: {
    authenticate(state, { token }) {
      sessionStorage.setItem('USER_TOKEN', token);
      state.token = token;
      state.appData = getAppData();
    },
    logout(state) {
      sessionStorage.removeItem('USER_TOKEN');
      state.token = '';
    },
    setHeader(state) {
      service.setHeader(state.token);
    }
  },
  actions: {
    async login({ commit }, user) {
      try {
        const token = await service.login(user);
        commit('authenticate', { token });
      } catch (e) {
        return Promise.reject(e);
      }
    },
    logout({ commit }) {
      return new Promise((resolve, reject) => {
        commit('logout');
        resolve();
      });
    }
  }
}