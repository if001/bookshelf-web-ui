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

        <div style="padding-top: 50px;" @click="forceCloseDrawer">
            <router-view/>
        </div>

        <v-footer></v-footer>
    </v-app>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
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

        private handleClose(drawer: boolean) {
            this.drawer = drawer;
        }

        private forceCloseDrawer() {
            if (this.drawer) {
                this.drawer = false;
            }
        }
    }

</script>

<style scoped>
</style>
