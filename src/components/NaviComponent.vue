<template>


    <v-list>
        <v-list-item>
            <v-list-item-icon>
                <v-btn icon text large @click="closeDrawer()">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>BookStorage</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item link
                     :to="{ name: 'booksView'}"
        >
            <v-list-item-icon>
                <v-icon>mdi-book-multiple</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>ダッシュボード</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item link
                     :to="{ name: 'analytics'}"
        >
            <v-list-item-icon>
                <v-icon>mdi-google-analytics</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>分析</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <div class="pa-3" style="position: absolute; bottom: 0;">
            <p class="ma-2" style="color: dimgrey; font-size: 1.0em;">login user</p>
            <p class="ma-2" style="color: dimgrey; font-size: 0.8em;">{{getUser()}}</p>
        </div>
    </v-list>
</template>

<script lang="ts">
    import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
    import firebase from 'firebase/app';
    import 'firebase/auth';

    @Component
    export default class NaviComponent extends Vue {
        @Prop() private propIsOpen!: boolean;
        private isOpen: boolean = this.propIsOpen;

        @Watch('propIsOpen')
        private onValueChange(newValue: boolean, oldValue: boolean): void {
            this.isOpen = newValue;
        }

        private closeDrawer() {
            this.isOpen = !this.isOpen;
            this.$emit('closeDrawer', this.isOpen);
        }

        private getUser(): string {
            const user = firebase.auth().currentUser;
            if (user != null && user.email) {
                return user.email;
            } else {
                return '';
            }
        }


    }

</script>

<style scoped>

</style>
