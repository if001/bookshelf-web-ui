import Vue from 'vue';
import Router from 'vue-router';

import BooksViews from './views/BooksView.vue';
import BooksViewsOld from './views/BooksViewOld.vue';
import VuetifyTest from './views/VuetifyTest.vue';
import MainViews from '@/views/MainViews.vue';
import LoginViews from '@/views/LoginViews.vue';
import store from '@/store';
import BookDetailView from '@/views/BookDetailView.vue';
import NotFoundViews from '@/views/NotFoundViews.vue';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes:  [
    {
      path: '/login',
      name: 'loginViews',
      component: LoginViews,
    },
    {
      path: '/bookshelf',
      name: 'mainViews',
      component: MainViews,
      meta: { requiresAuth: false },
      children: [
          {
              path: '/',
              name: 'booksView',
              component: BooksViews,
          },
          {
              path: ':bookId',
              name: 'bookDetail',
              component: BookDetailView,
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
      ],
    },
    {
      path: '*',
      component: NotFoundViews,
    },
  ],
});

router.beforeEach((to, from, next) => {
  const isLogin = store.getters.loginStatus;
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (isLogin) {
      console.log('success');
      next();
    } else {
      next({path: '/login'});
    }
  } else {
    console.log('error');
    next();
  }
});

export default router;
