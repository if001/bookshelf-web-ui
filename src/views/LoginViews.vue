<template>
    <v-app light>
        <v-container text-xs-center>
            <v-layout row wrap>
                <v-flex lg8 md8 sm8 offset-md2>
                    <div class="login-title">
                        Manage Your Read Book!
                    </div>
                </v-flex>

                <v-flex lg4 md4 sm4 offset-md4>
                    <v-form lazy-validation v-model="valid">
                        <v-text-field
                                v-model="email"
                                label="Email"
                                :rules="emailRules"
                                prepend-icon="email"
                                required
                        ></v-text-field>
                        <v-text-field
                                v-model="password"
                                label="Password"
                                :type="'password'"
                                :rules="passRules"
                                prepend-icon="lock"
                                required
                        ></v-text-field>
                    </v-form>


                    <v-btn @click="login" block color="#1E90FF" dark>
                        Login
                    </v-btn>

                    <div class="warning-font">{{ message }}</div>
                </v-flex>

                <v-flex lg12 md12 sm12>
                    <div class="create-account-link pa-2">
                        <router-link to="/reset_password">Forgot Password?</router-link>
                    </div>
                </v-flex>

                <v-flex lg12 md12 sm12>
                    <div class="create-account-link pa-2">
                        Don't have an account?
                        <router-link to="/signUp">Create account</router-link>
                    </div>
                </v-flex>

                <v-flex lg8 md8 sm8 offset-md2>
                    <v-btn
                            fab
                            color="gray"
                            disabled>
                        or
                    </v-btn>
                </v-flex>

                <v-flex lg8 md8 sm8 offset-md2>
                    <div class="pa-3">
                        <img class="google-login" src="@/assets/btn_google.png" @click="loginWithGoogle">
                    </div>
                </v-flex>

            </v-layout>
        </v-container>
    </v-app>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import firebase from 'firebase';

    @Component
    export default class LoginViews extends Vue {
        private email: string = '';
        private password: string = '';
        private valid = false;
        private passRules = [
            (v: any) => !!v || 'Name is required',
        ];

        private emailRules = [
            (v: any) => !!v || 'E-mail is required',
            (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
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
        padding: 10px;
        text-align: center;
    }

    .login-title {
        color: dimgray;
        font-size: 1.8em;
        font-weight: 600;
        font-family: Roboto, sans-serif;
        padding: 15px;
        text-align: center;
        /*background-color: dodgerblue;*/
    }

    .create-account-link {
        text-align: center;
        font-color: dimgray;
    }

    .create-account-link a:link {
        color: dimgray;
        font-weight: 700;
    }

    .create-account-link a:visited {
        color: dimgray;
    }

    .create-account-link a:hover {
        color: dimgray;
    }

    .create-account-link a:active {
        color: dimgray;
    }

    .google-login {
        cursor: pointer;
        height: 50px;
    }

</style>