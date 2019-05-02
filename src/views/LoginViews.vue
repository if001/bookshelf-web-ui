<template>
    <v-app light>
        <v-container>
            <v-layout justify-center>
                <v-flex lg8 md8 sm8>
                    <v-card class="pa-2">
                        <v-card-title>
                            Login
                        </v-card-title>
                        <v-form v-model="valid">
                            <v-text-field
                                    v-model="email"
                                    label="Email"
                                    required
                            ></v-text-field>
                            <v-text-field
                                    v-model="password"
                                    label="Password"
                                    :type="'password'"
                                    required
                            ></v-text-field>
                        </v-form>
                        <v-layout justify-center>
                            <v-btn class="mr-4" @click="login">
                                ログイン
                            </v-btn>
                            <v-btn class="ml-4">
                                <router-link to="/bookshelf">サインイン</router-link>
                            </v-btn>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>


            <v-layout justify-center class="ma-2">
                <v-flex lg8 md8 sm8>
                    <v-layout justify-center>
                        <v-btn
                                fab
                                color="gray"
                                disabled>
                            or
                        </v-btn>
                    </v-layout>
                </v-flex>
            </v-layout>

            <v-layout justify-center class="ma-2">
                <v-flex lg8 md8 sm8>
                    <v-layout justify-center>
                        <img src="@/assets/btn_google.png" height="50px">
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import firebase from 'firebase';
    import store from '@/store';

    @Component
    export default class BookViews extends Vue {
        private email: string = '';
        private password: string = '';

        public login() {
            firebase.auth().signInWithEmailAndPassword(this.email, this.password).then((user) => {
                console.log(user);
                store.dispatch('login').then(() => {
                    this.$router.push('/bookshelf');
                }).catch(() => {
                    alert('login err');
                });
            }).catch((err) => {
                // console.log(err);
                alert('login err');
            });
        }
    }

</script>

<style scoped>

</style>