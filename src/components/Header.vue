<template>
    <v-app-bar
            fixed
            color="blue accent-2"
            dark
            :scroll-off-screen="$vuetify.breakpoint.xs"
            :scroll-threshold="40"
            height="50"
            hide-on-scroll
    >
        <v-app-bar-nav-icon @click.stop="closeDrawer()"></v-app-bar-nav-icon>
        <div style="font-weight: 400;">
            <router-link :to="{name:'booksView'}" class="title">{{title}}</router-link>
        </div>
        <v-spacer></v-spacer>
        <v-btn v-if="$vuetify.breakpoint.xs"
               style="color: white"
               icon
               color="dark"
               right
               v-on:click="logout">
            <v-icon right>mdi-logout</v-icon>
        </v-btn>
        <v-btn v-else
               style="color: white"
               text
               color="dark"
               small
               right
               v-on:click="logout"
        ><div style="margin-right: 5px;">Logout</div>
            <v-icon small style="color: white">mdi-logout</v-icon>
        </v-btn>
    </v-app-bar>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import store from '@/store';
    import firebase from 'firebase/app';

    @Component
    export default class Header extends Vue {
        private title: string = 'BookStorage';

        @Prop() private propIsOpen!: boolean;
        private isOpen: boolean = this.propIsOpen;

        @Watch('propIsOpen')
        private onValueChange(newValue: boolean, oldValue: boolean): void {
            this.isOpen = newValue;
        }

        private logout() {
            firebase.auth().signOut()
                .then(() => {
                    this.$router.push('/login');
                })
                .catch(() => {
                    console.log('firebase sign out error');
                });
        }

        private search() {
            console.log('search!!');
        }

        private closeDrawer() {
            this.isOpen = !this.isOpen;
            this.$emit('closeDrawer', this.isOpen);
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
