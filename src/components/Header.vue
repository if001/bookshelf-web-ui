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
            <v-toolbar-title>
                <router-link :to="{name:'booksView'}" class="title">{{title}}</router-link>
            </v-toolbar-title>
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
    import firebase from 'firebase';

    @Component
    export default class Header extends Vue {
        private title: string = 'SmartBookStorage';

        private logout() {
            store.dispatch('removeToken').then(() => {
                firebase.auth().signOut().then(() => {
                    localStorage.clear();
                    this.$router.push('/login');
                }).catch(() => {
                    console.log('firebase sign out error');
                });
            }).catch(() => {
                console.log('vuex remove token error');
            });
        }

        private search() {
            console.log('search!!');
        }
    }

</script>

<style scoped>
.title {
    text-decoration: none;
    color:white;
}
</style>