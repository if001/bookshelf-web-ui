<template>
    <v-toolbar
            fixed
            color="blue accent-2"
            dark
            :scroll-off-screen="$vuetify.breakpoint.xs"
            :scroll-threshold="40"
            height="50"
    >
        <div style="font-weight: 400;">
            <router-link :to="{name:'booksView'}" class="title">{{title}}</router-link>
        </div>
        <v-spacer></v-spacer>
        <v-btn v-if="$vuetify.breakpoint.xs"
               style="color: white"
               icon
               flat
               color="dark"
               right
               v-on:click="logout">
            <v-icon>exit_to_app</v-icon>
        </v-btn>
        <v-btn v-else
               style="color: white"
               flat
               color="dark"
               small
               right
               v-on:click="logout"
        ><div style="margin-right: 5px;">Logout</div>
            <v-icon small style="color: white">exit_to_app</v-icon>
        </v-btn>
    </v-toolbar>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import store from '@/store';
    import firebase from 'firebase/app';

    @Component
    export default class Header extends Vue {
        private title: string = 'BookStorage';

        private logout() {
            firebase.auth().signOut()
                .then(() => {
                    localStorage.clear();
                    this.$router.push('/login');
                })
                .catch(() => {
                    console.log('firebase sign out error');
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

    .header {
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
