import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLogin: false,
        token: '',
    },
    mutations: {
        login(state) {
            state.isLogin = true;
        },
        logout(state) {
            state.isLogin = false;
        },
        setToken(state, token: string) {
            state.token = token;
        },
        removeToken(state) {
            state.token = '';
        },
    },
    getters: {
        loginStatus(state) {
            return state.isLogin;
        },
        getToken(state) {
            console.log(state.token);
            return state.token;
        },
    },
    actions: {
        login({commit}) {
            commit('login');
        },
        logout({commit}) {
            commit('logout');
        },
        setToken({commit}, token: string) {
            commit('setToken', token);
        },
        removeToken({commit}) {
            commit('setToken');
        },
    },
});
