import Vue from 'vue';
import Router from 'vue-router';

// import BooksViews from './views/BooksView.vue';
// import MainViews from '@/views/MainViews.vue';
// import LoginViews from '@/views/LoginViews.vue';
// import SignUpViews from '@/views/SignUpView.vue';
// import ResetPasswordViews from '@/views/ResetPasswordView.vue';
// import RegisterBookViews from '@/views/RegisterBookView.vue';
// import BookDetailView from '@/views/BookDetailView.vue';
// import NotFoundViews from '@/views/NotFoundViews.vue';
// import PrivacyPolicy from '@/views/PrivacyPolicyView.vue';

const MainViews = () => import('@/views/MainViews.vue');
const LoginViews = () => import('@/views/LoginViews.vue');
const SignUpViews = () => import('@/views/SignUpView.vue');
const ResetPasswordViews = () => import('@/views/ResetPasswordView.vue');
const PrivacyPolicy = () => import('@/views/PrivacyPolicyView.vue');
const BooksViews = () => import('@/views/BooksView.vue');
const RegisterBookViews = () => import('@/views/RegisterBookView.vue');
const BookDetailView = () => import('@/views/BookDetailView.vue');
const SharePageView = () => import('@/views/SharePageView.vue');

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
            path: '/',
            component: LoginViews,
        },
        {
            path: '/signup',
            name: 'signUpViews',
            component: SignUpViews,
        },
        {
            path: '/reset_password',
            name: 'resetPasswordViews',
            component: ResetPasswordViews,
        },
        {
            path: '/policy',
            name: 'privacyPolicy',
            component: PrivacyPolicy,
        },
        {
            path: '/share/:isbn',
            name: 'sharePage',
            component: SharePageView,
        },
        {
            path: '/bookshelf',
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
                    path: '/register',
                    name: 'register',
                    component: RegisterBookViews,
                },
            ],
        },
        {
            path: '*',
            redirect: {name: '/loginViews'},
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
