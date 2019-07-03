<template>
    <!--<div-->
            <!--class="hide-overflow"-->
            <!--style="position: relative; height: 60px;"-->
    <!--&gt;-->
        <!--<v-toolbar-->
                <!--absolute-->
                <!--color="light-blue darken-1"-->
                <!--dark-->
                <!--scroll-off-screen-->
                <!--scroll-target="#scrolling-techniques"-->
        <!--&gt;-->
            <!--<v-toolbar-title>-->
                <!--<router-link :to="{name:'booksView'}" class="title">{{title}}</router-link>-->
            <!--</v-toolbar-title>-->
            <!--<v-spacer></v-spacer>-->
            <!--<v-btn icon-->
                   <!--flat-->
                   <!--color="dark"-->
                   <!--right-->
                   <!--v-on:click="logout"-->
                   <!--v-if="$vuetify.breakpoint.xs">-->
                <!--<v-icon>exit_to_app</v-icon>-->
            <!--</v-btn>-->
            <!--<v-btn flat-->
                   <!--color="dark"-->
                   <!--small-->
                   <!--right-->
                   <!--v-on:click="logout"-->
                   <!--v-else>ログアウト-->
                <!--<v-icon small>exit_to_app</v-icon>-->
            <!--</v-btn>-->


        <!--</v-toolbar>-->
    <!--</div>-->
    <div style=" display: flex;flex-direction: row;position: fixed; top:0; height:50px;width: 100%;background-color: #00bcd4;z-index:2000;">
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
        >ログアウト
            <v-icon small style="color: white">exit_to_app</v-icon>
        </v-btn>
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