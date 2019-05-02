import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLogin: false,
  },
  mutations: {
    login(state) {
      state.isLogin = true;
    },
    logout(state) {
      state.isLogin = false;
    },
  },
  getters: {
    loginStatus(state) {
      return state.isLogin;
    },
  },
  actions: {
    login({commit}) {
      commit('login');
    },
    logout({commit}) {
      commit('logout');
    },
  },
});
