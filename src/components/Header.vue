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

            <v-toolbar-items class="hidden-sm-and-down">
                <div class="mr-5 mt-1 mb-0">
                    <v-select
                            :items="sort"
                            label="sort"
                    ></v-select>
                </div>
                <div class="mr-5 mt-1 mb-0">
                    <v-text-field
                            label="search"
                            append-icon=search
                    ></v-text-field>
                </div>
                <v-btn flat
                       color="dark"
                       small
                       right
                       v-on:click="logout">ログアウト
                    <v-icon small>exit_to_app</v-icon>
                </v-btn>
            </v-toolbar-items>

        </v-toolbar>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import store from '@/store';

    @Component
    export default class Header extends Vue {
        private  sort = ['Foo', 'Bar', 'Fizz', 'Buzz'];


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
    }

</script>

<style scoped>

</style>