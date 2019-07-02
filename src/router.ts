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
            meta: {requiresAuth: true},
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
            redirect: 'loginViews',
        },
    ],
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    // const token = store.getters.getToken;
    const token = localStorage.getItem('token');
    if (requiresAuth && token == null) {
        console.log('token not hold');
        localStorage.setItem('token', '');
        next({path: '/login'});
    } else {
        console.log('success');
        next();
    }
});

export default router;
