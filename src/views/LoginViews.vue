<template>
    <v-app light>
        <v-container>
            <v-layout justify-center>
                <v-flex lg8 md8 sm8>
                    <v-card class="pa-2">
                        <div class="title">
                            ログイン
                        </div>
                        <v-form lazy-validation v-model="valid">
                            <v-text-field
                                    v-model="email"
                                    label="Email"
                                    :rules="emailRules"
                                    required
                            ></v-text-field>
                            <v-text-field
                                    v-model="password"
                                    label="Password"
                                    :type="'password'"
                                    :rules="passRules"
                                    required
                            ></v-text-field>
                        </v-form>
                        <v-layout justify-center>
                            <v-btn class="mr-4" @click="login">
                                ログイン
                            </v-btn>
                            <v-btn class="ml-4">
                                <router-link to="/bookshelf">アカウント作成</router-link>
                            </v-btn>
                        </v-layout>
                        <div class="warning-font">{{ message }}</div>
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
                        <img src="@/assets/btn_google.png" height="50px" @click="loginWithGoogle">
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import firebase from 'firebase';
    import store from '@/store';

    @Component
    export default class BookViews extends Vue {
        private email: string = '';
        private password: string = '';
        private valid = false;
        private passRules = [
            (v: any) => !!v || 'Name is required',
        ];

        private emailRules =  [
            (v: any) => !!v || 'E-mail is required',
            (v: any) => /.+@.+/.test(v) || 'E-mail must be valid'
        ];

        private message = '';

        public login() {
            this.loginOps(firebase.auth().signInWithEmailAndPassword(this.email, this.password));
        }

        public loginWithGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider();
            this.loginOps(firebase.auth().signInWithPopup(provider));
        }

        private loginOps(p: Promise<firebase.auth.UserCredential>) {
            p.then((res) => {
                if (res == null) {
                    // console.log('not get response');
                    // alert('auth failed');
                    return;
                }
                if (res.user == null) {
                    // console.log('user not found');
                    // alert('auth failed');
                    return;
                }
                res.user.getIdToken()
                    .then((idToken) => {
                        localStorage.setItem('token', idToken.toString());
                        this.$router.push('/bookshelf');
                    }).catch((err) => {
                    // console.log(err);
                    console.log('firebase get token error');
                });
            }).catch((err) => {
                this.message = 'メールアドレスかパスワードが間違っています。';
                // alert('ログインエラー');
                // console.log(err);
            });
        }

    }
</script>

<style scoped>
    .warning-font {
        color: #db4448;
        font-size: 1.0em;
    }
    .title {
        color: dimgray;
        font-size: 1.4em;
        font-family: Roboto,sans-serif;
        margin: 10px;
    }
</style>