import Vue from 'vue';
import Router from 'vue-router';

import BooksViews from './views/BooksView.vue';
import VuetifyTest from './views/VuetifyTest.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'booksView',
      component: BooksViews,
    },
    {
      path: '/vuetify',
      name: 'vuetify',
      component: VuetifyTest,
    },

  ],
});
