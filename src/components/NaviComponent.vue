<template>


    <v-list>
        <v-list-item :to="{ name: 'booksView'}" @click="closeDrawer()">
            <v-list-item-icon>
                <v-icon>mdi-book-multiple</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>本の一覧</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item :to="{ name: 'register'}" @click="closeDrawer()">
            <v-list-item-icon>
                <v-icon>mdi-book-open-variant</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>本の登録</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item :to="{ name: 'analytics'}" @click="closeDrawer()">
            <v-list-item-icon>
                <v-icon>mdi-google-analytics</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>分析</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <div class="pa-3" style="position: absolute; bottom: 0;">
            <p class="ma-2" style="color: dimgrey; font-size: 1.0em;">login info</p>
            <p class="ma-2" style="color: dimgrey; font-size: 0.8em;">user name: {{getUser()}}</p>
            <p class="ma-2" style="color: dimgrey; font-size: 0.8em;">login by: {{getProviderData()}}</p>
            <p class="ma-2">
                <v-btn outlined small>ログアウト</v-btn>
            </p>
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
            if (user && user.displayName) {
                return user.displayName;
            } else if (user && user.email) {
                return user.email;
            } else {
                return '';
            }
        }
        private getProviderData(): string {
            const user = firebase.auth().currentUser;
            if (user && user.providerData && user.providerData.length >= 1 && user.providerData[0]) {
                const id = user.providerData[0].providerId;
                return id === 'password' ? 'email and password' : id;
            } else {
                return '';
            }
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
    }

</script>

<style scoped>

</style>
