import Vue from 'vue';
import Router from 'vue-router';

import BooksViews from './views/BooksView.vue';
import BooksViewsOld from './views/BooksViewOld.vue';
import VuetifyTest from './views/VuetifyTest.vue';
import MainViews from '@/views/MainViews.vue';
import LoginViews from '@/views/LoginViews.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/login',
      name: 'loginViews',
      component: LoginViews,
    },
    {
      path: '/bookshelf',
      name: 'mainViews',
      component: MainViews,
      children: [
        {
          path: '/books',
          name: 'booksView',
          component: BooksViews,
        },
        {
          path: '/old',
          name: 'booksViewOld',
          component: BooksViewsOld,
        },
        {
          path: '/vuetify',
          name: 'vuetify',
          component: VuetifyTest,
        },
      ]
    },


  ],
});
