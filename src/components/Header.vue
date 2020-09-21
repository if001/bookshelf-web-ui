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
            <div class="title" style="font-weight: 400;">
                <div>{{subPageTitle}}</div>
            </div>
        </v-app-bar>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import { Route } from 'vue-router';

    @Component
    export default class Header extends Vue {
        private title: string = 'BookStorage';

        @Prop() private propIsOpen!: boolean;
        private isOpen: boolean = this.propIsOpen;

        private isBackButton: boolean = false;
        private subPageTitle: string = '';

        @Watch('propIsOpen')
        private onValueChange(newValue: boolean, oldValue: boolean): void {
            this.isOpen = newValue;
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
                    this.subPageTitle = 'Register';
                    break;
                case 'analytics':
                    this.isBackButton = true;
                    this.subPageTitle = 'Analytics';
                    break;
                default:
                    this.isBackButton = false;
                    this.subPageTitle = '';
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
