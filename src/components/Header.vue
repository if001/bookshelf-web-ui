<template>
    <div class="header">
        <div style="margin: auto;margin-left: 13.5px;font-weight: 400;">
            <router-link :to="{name:'booksView'}" class="title">{{title}}</router-link>
        </div>
        <v-spacer></v-spacer>
        <v-btn v-if="$vuetify.breakpoint.xs"
               style="margin: auto;color: white"
               icon
               flat
               color="dark"
               right
               v-on:click="logout">
            <v-icon>exit_to_app</v-icon>
        </v-btn>
        <v-btn v-else
               style="margin: auto;color: white"
               flat
               color="dark"
               small
               right
               v-on:click="logout"
        ><div style="margin-right: 5px;">Logout</div>
            <v-icon small style="color: white">exit_to_app</v-icon>
        </v-btn>
    </div>

</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import store from '@/store';
    import firebase from 'firebase/app';

    @Component
    export default class Header extends Vue {
        // private title: string = 'SmartBookStorage';
        private title: string = 'BookShelf';

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
    .header{
        display: flex;
        flex-direction: row;
        position: fixed;
        top:0;
        height:50px;
        width: 100%;
        background-color: dodgerblue;
        z-index:2000;
    }
</style>