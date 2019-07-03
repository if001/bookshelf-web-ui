import Vue from 'vue';
import Router from 'vue-router';

import BooksViews from './views/BooksView.vue';
import BooksViewsOld from './views/BooksViewOld.vue';
import VuetifyTest from './views/VuetifyTest.vue';
import MainViews from '@/views/MainViews.vue';
import LoginViews from '@/views/LoginViews.vue';
import SignUpViews from '@/views/SignUpView.vue';
import ResetPasswordViews from '@/views/ResetPasswordView.vue';
import RegisterBookViews from '@/views/RegisterBookView.vue';
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
            path: '/signUp',
            name: 'signUpViews',
            component: SignUpViews,
        },
        {
            path: '/reset_password',
            name: 'resetPasswordViews',
            component: ResetPasswordViews,
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
                {
                    path: '/register',
                    name: 'register',
                    component: RegisterBookViews,
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
        localStorage.clear();
        next({path: '/login'});
    } else {
        console.log('success');
        next();
    }
});

export default router;
