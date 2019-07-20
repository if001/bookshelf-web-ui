<template>
    <v-app light>
        <v-container text-xs-center>
            <v-layout row wrap>
                <v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2>
                    <div class="login-title">
                        Manage Your Book!
                    </div>
                </v-flex>

                <v-flex lg6 md6 sm6 xs12 offset-lg3 offset-md3 offset-sm3>
                    <v-alert
                            v-if="alert"
                            v-model="alert"
                            dismissible
                            color="error"
                            icon="warning"
                            outline
                            @click="alert = false">
                        {{message}}
                    </v-alert>
                </v-flex>

                <v-flex lg4 md4 sm4 xs10 offset-lg4 offset-md4 offset-sm4 offset-xs1>
                    <v-form ref="form"
                            lazy-validation
                            v-model="valid">
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
                                :type="showPassword ? 'text' : 'password'"
                                :rules="passRules"
                                :append-icon="showPassword ? 'visibility' : 'visibility_off'"
                                @click:append="showPassword = !showPassword"
                                prepend-icon="lock"
                                required
                        ></v-text-field>
                    </v-form>


                    <v-btn @click="login" :loading="isLoading" block color="#1E90FF" dark>
                        Login
                    </v-btn>
                    <!--                    <div class="warning-font">{{ message }}</div>-->
                </v-flex>

                <v-flex lg12 md12 sm12 xs12>
                    <div class="create-account-link pa-2">
                        <router-link to="/reset_password">Forgot Password?</router-link>
                    </div>
                </v-flex>

                <v-flex lg12 md12 sm12 xs12>
                    <div class="create-account-link pa-2">
                        Don't have an account?
                        <router-link to="/signup">Create account</router-link>
                    </div>
                </v-flex>

                <v-flex lg8 md8 sm8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2>
                    <v-btn
                            fab
                            color="gray"
                            disabled>
                        or
                    </v-btn>
                </v-flex>

                <!--<v-flex lg4 md4 sm4 offset-md4>-->
                <!--<hr class="divide" style="display: inline-block;width: 40%;">-->
                <!--<div style="display: inline-block; margin: 10px;">OR</div>-->
                <!--<hr class="divide" style="display: inline-block;width: 40%;">-->
                <!--</v-flex>-->
                <v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2>
                    <div class="pa-3">
                        <img class="google-login" src="@/assets/btn_google.png" @click="loginWithGoogle">
                    </div>
                </v-flex>

            </v-layout>
        </v-container>
        <v-footer></v-footer>
    </v-app>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import firebase from 'firebase/app';
    import 'firebase/auth';
    import Footer from '@/components/Footer.vue';

    @Component({
        components: {
            'v-footer': Footer,
        },
    })
    export default class LoginViews extends Vue {
        private email: string = '';
        private password: string = '';
        private valid = false;
        private showPassword: boolean = false;
        private message = '';
        private isLoading: boolean = false;
        private alert: boolean = false;

        private passRules = [
            (v: any) => !!v || 'Name is required',
        ];

        private emailRules = [
            (v: any) => !!v || 'E-mail is required',
            (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        ];

        public mounted() {
            window.scrollTo(0, 0);
        }


        public login() {
            if (this.validateInput()) {
                this.loginOps(firebase.auth().signInWithEmailAndPassword(this.email, this.password));
            }
        }

        public loginWithGoogle() {
            const provider = new firebase.auth.GoogleAuthProvider();
            this.loginOps(firebase.auth().signInWithPopup(provider));
        }

        private loginOps(p: Promise<firebase.auth.UserCredential>) {
            this.isLoading = true;
            p.then((res: firebase.auth.UserCredential) => {
                if (res.user == null) {
                    this.message = 'メールアドレスかパスワードが間違っています。';
                    this.alert = true;
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
                this.alert = true;
                // alert('ログインエラー');
                // console.log(err);
            }).finally(() => {
                this.isLoading = false;
            });
        }

        private validateInput(): boolean {
            return (this.$refs.form as Vue & { validate: () => boolean }).validate();
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
    .divide{
        border: 0 none;
        height: 2px;
        border-top: 1px solid #8c8b8b;
    }

</style>