import Vue from 'vue';
import Router from 'vue-router';
import firebase from 'firebase/app';
import 'firebase/auth';


const MainViews = () => import('@/views/MainViews.vue');
const LoginViews = () => import('@/views/LoginViews.vue');
const SignUpViews = () => import('@/views/SignUpView.vue');
const ResetPasswordViews = () => import('@/views/ResetPasswordView.vue');
const PrivacyPolicy = () => import('@/views/PrivacyPolicyView.vue');
const BooksViews = () => import('@/views/BooksView.vue');
const RegisterBookViews = () => import('@/views/RegisterBookView.vue');
const BookDetailView = () => import('@/views/BookDetailView.vue');
const SharePageView = () => import('@/views/SharePageView.vue');
const AnalyticsView = () => import('@/views/AnalyticsView.vue');
const LandingView = () => import('@/views/LandingView.vue');

Vue.use(Router);

const router = new Router({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: [
        {
            path: '/',
            component: LandingView,
        },
        {
            path: '/login',
            name: 'loginViews',
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
            path: '/share/:id',
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
                {
                    path: '/analytics',
                    name: 'analytics',
                    component: AnalyticsView,
                },
            ],
        },
        {
            path: '*',
            redirect: {name: 'loginViews'},
        },
    ],
});

router.beforeEach((to, from, next) => {
    const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);
    if (requiresAuth) {
        firebase.auth().onAuthStateChanged( (user) => {
            if (user) {
                next();
            } else {
                next('/login');
            }
        });
    } else {
        next();
    }
});

export default router;
