<template>
    <v-content>
        <v-toolbar>
            <v-toolbar-title>サイトタイトル</v-toolbar-title>
            <v-flex xs12 sm6 md3 class="ma-3">
                <v-text-field
                        label="hoge"
                        append-icon=search
                ></v-text-field>
            </v-flex>
            <v-icon right>exit_to_app</v-icon>
            <v-btn @click="logout">ログアウト</v-btn>
        </v-toolbar>
    </v-content>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
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
    }

</script>

<style scoped>

</style>