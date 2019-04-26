import Vue from 'vue';
import Router from 'vue-router';

import BooksViews from './views/BooksView.vue';

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
  ],
});
