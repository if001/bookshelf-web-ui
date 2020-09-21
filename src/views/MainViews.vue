<template>
    <v-app light color="#fafafa">
        <v-header :propIsOpen="drawer"
                  @closeDrawer="handleClose"
        ></v-header>

        <v-navigation-drawer
                v-model="drawer"
                app
                clipped
                mobile-break-point="0"
        >
            <navi :propIsOpen="drawer" @closeDrawer="handleClose"></navi>
        </v-navigation-drawer>

        <div style="padding-top: 50px; height: 100%;" @click="forceCloseDrawer">
            <transition mode="out-in" :name="translate">
                <router-view/>
            </transition>
        </div>

        <v-footer></v-footer>
    </v-app>
</template>
<script lang="ts">
    import { Component, Vue, Watch } from 'vue-property-decorator';
    import { Route } from 'vue-router';
    import BooksView from '@/views/BooksView.vue';
    import Header from '@/components/Header.vue';
    import Footer from '@/components/Footer.vue';
    import Navi from '@/components/NaviComponent.vue';

    @Component({
        components: {
            'books-view': BooksView,
            'v-header': Header,
            'v-footer': Footer,
            'navi': Navi,
        },
    })
    export default class MainViews extends Vue {
        private drawer: boolean | null = false;
        private translate: string = 'fade-in';

        private handleClose(drawer: boolean) {
            this.drawer = drawer;
        }

        private forceCloseDrawer() {
            if (this.drawer) {
                this.drawer = false;
            }
        }

        @Watch('$route', { immediate: true, deep: true })
        private onUrlChange(route: Route) {
            this.$router.beforeEach((to, from, next) => {
                this.translate = getTranslate(
                    from.name ? from.name : '',
                    to.name ? to.name : '');
                next();
            });
        }
    }

    function getTranslate(from: string, to: string) {
        if (from === 'bookDetail' && to === 'booksView') {
            return 'fade-right';
        }
        if (from === 'booksView' && to === 'bookDetail') {
            return 'fade-left';
        }
        if (from === 'booksView' && to === 'analytics') {
            return 'fade-right';
        }
        if (from === 'analytics' && to === 'booksView') {
            return 'fade-left';
        }
        return 'fade-in';
    }

</script>

<style scoped>
</style>
