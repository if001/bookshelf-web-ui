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
            <router-link to="/login">ログアウト</router-link>
        </v-toolbar>
    </v-content>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Header extends Vue {

    }

</script>

<style scoped>

</style>