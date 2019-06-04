<template>
    <div
            class="hide-overflow"
            style="position: relative; height: 60px;"
    >
        <v-toolbar
                absolute
                color="light-blue darken-1"
                dark
                scroll-off-screen
                scroll-target="#scrolling-techniques"
        >
            <v-toolbar-title>サイトタイトル</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon
                   flat
                   color="dark"
                   right
                   v-on:click="logout"
                   v-if="$vuetify.breakpoint.xs">
                <v-icon>exit_to_app</v-icon>
            </v-btn>
            <v-btn flat
                   color="dark"
                   small
                   right
                   v-on:click="logout"
                   v-else>ログアウト
                <v-icon small>exit_to_app</v-icon>
            </v-btn>


        </v-toolbar>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import store from '@/store';

    @Component
    export default class Header extends Vue {
        private logout() {
            store.dispatch('logout').then(() => {
                console.log(store.getters.loginStatus);
                if (!store.getters.loginStatus) {
                    this.$router.push('/login');
                } else {
                    alert('ログアウトエラー');
                }
            });
        }

        private search() {
            console.log('search!!');
        }
    }

</script>

<style scoped>

</style>