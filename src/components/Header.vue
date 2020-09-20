<template>
    <div>
        <v-app-bar
                app
                color="blue accent-2"
                dark
                height="50"
                clipped-left
                absolute
                v-if="!isBackButton"
        >
            <v-app-bar-nav-icon @click.stop="closeDrawer()"></v-app-bar-nav-icon>
            <div style="font-weight: 400;">
                <router-link :to="{name:'booksView'}" class="title">{{title}}</router-link>
            </div>
            <v-spacer></v-spacer>
            <v-btn v-if="$vuetify.breakpoint.xs"
                   id="logout_button"
                   style="color: white"
                   icon
                   color="dark"
                   right
                   v-on:click="logout">
                <v-icon right>mdi-logout</v-icon>
            </v-btn>
            <v-btn v-else
                   id="logout_button_sm"
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

        <v-app-bar
                app
                color="blue accent-2"
                height="50"
                absolute
                v-if="isBackButton"
        >
            <v-btn icon @click="toTopPage()">
                <v-icon large color="white">mdi-chevron-left</v-icon>
            </v-btn>
        </v-app-bar>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import { Route } from 'vue-router';
    import firebase from 'firebase/app';

    @Component
    export default class Header extends Vue {
        private title: string = 'BookStorage';

        @Prop() private propIsOpen!: boolean;
        private isOpen: boolean = this.propIsOpen;

        private isBackButton: boolean = false;

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

        private toTopPage() {
            this.$router.push('/bookshelf');
        }

        @Watch('$route', { immediate: true, deep: true })
        private onUrlChange(route: Route) {
            switch (route.name) {
                case 'bookDetail':
                    this.isBackButton = true;
                    break;
                case 'register':
                    this.isBackButton = true;
                    break;
                default:
                    this.isBackButton = false;
            }
        }
    }

</script>

<style scoped>
    .title {
        text-decoration: none;
        color:white;
    }
</style>
