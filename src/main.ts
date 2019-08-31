import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import './registerServiceWorker';
import firebase from 'firebase/app';
import {fireBaseConfig} from '@/firebase_config';
import { init, captureMessage } from '@sentry/browser';

init({
    dsn: 'https://3b925210340f49229e88590846ec45d7@sentry.io/1547538',
});

firebase.initializeApp(fireBaseConfig);

Vue.config.productionTip = false;

new Vue({
    router,
    store,
    vuetify,
    render: (h) => h(App),
}).$mount('#app');
