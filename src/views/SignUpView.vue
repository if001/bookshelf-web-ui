<template>
    <v-app light>
        <v-container>
            <v-layout justify-center>
                <v-flex lg8 md8 sm8>
                    <v-card class="pa-2">
                        <div class="login-title">
                            Sign Up
                        </div>
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

                        <v-layout row justify-center>
                            <v-flex lg12 md12 sm12>
                                <v-btn @click="create" block color="#ee82ee" dark>
                                    アカウント作成
                                </v-btn>
                            </v-flex>
                        </v-layout>

                        <div class="warning-font">{{ message }}</div>
                    </v-card>
                </v-flex>
            </v-layout>
            <v-layout row justify-center>
                <v-flex lg12 md12 sm12>
                    <div class="create-account-link pa-3">
                        Already have an account? <router-link to="/login">Log in here</router-link>
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
    export default class SignUpView extends Vue {
        private email: string = '';
        private password: string = '';
        private valid = false;
        private passRules = [
            (v: any) => !!v || 'Name is required',
        ];

        private emailRules =  [
            (v: any) => !!v || 'E-mail is required',
            (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        ];

        private message = '';

        public create() {
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then((res) => {
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
                this.message = 'アカウントの作成に失敗しました。';
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
        font-family: Roboto,sans-serif;
        padding: 15px;
        text-align: center;
    }
    .create-account-link {
        text-align: center;
        font-color:dimgray;
        text-decoration: none;
    }
    .create-account-link a:link {
        color: dimgray;
        /* text-decoration: none; */
        font-weight: 700;
    }
    .create-account-link a:visited { color: dimgray; }
    .create-account-link a:hover { color: dimgray; }
    .create-account-link a:active { color: dimgray; }

    .google-login{
        cursor: pointer;
        height: 50px;
    }

</style>