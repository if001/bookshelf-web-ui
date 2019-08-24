<template>
    <v-app light>
        <v-container>
            <v-row justify="center">
                <v-col lg="8" md="8" sm="8" xs="8">
                    <div class="login-title">
                        Manage Your Book!
                    </div>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col lg="6" md="6" sm="6" xs="12">
                    <v-alert
                            v-if="alert"
                            v-model="alert"
                            dismissible
                            color="error"
                            icon="mdi-warning"
                            outline
                            @click="alert = false">
                        {{message}}
                    </v-alert>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col lg="4" md="4" sm="4" xs="10">
                    <v-form ref="form"
                            lazy-validation
                            v-model="valid">
                        <v-text-field
                                v-model="email"
                                label="Email"
                                :rules="emailRules"
                                prepend-icon="mdi-email"
                                required
                        ></v-text-field>
                        <v-text-field
                                v-model="password"
                                label="Password"
                                :type="showPassword ? 'text' : 'password'"
                                :rules="passRules"
                                :append-icon="showPassword ? 'mdi-visibility' : 'mdi-visibility_off'"
                                @click:append="showPassword = !showPassword"
                                prepend-icon="mdi-lock"
                                required
                        ></v-text-field>
                    </v-form>

                    <v-btn @click="login" :loading="isLoading" block color="#1E90FF" dark>
                        Login
                    </v-btn>
                </v-col>
            </v-row>


            <v-row justify="center">
                <v-col>
                    <div class="create-account-link pa-2">
                        <router-link to="/reset_password">Forgot Password?</router-link>
                    </div>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col>
                    <div class="create-account-link pa-2">
                        Don't have an account?
                        <router-link to="/signup">Create account</router-link>
                    </div>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col lg="8" md="8" sm="8" xs="8" style="text-align: center">
                    <v-btn
                            fab
                            color="gray"
                            disabled>
                        or
                    </v-btn>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col lg=8 md=8 sm=8 xs=10 class="pa-3" v-if="isMobile()" style="text-align: center">
                    <img class="google-login" src="@/assets/btn_google.png" @click="loginWithGoogleAsMobile">
                    <p style="font-size: 0.8em; color:dimgray">※ログインにのみ使われます</p>
                </v-col>
                <v-col v-else lg=8 md=8 sm=8 xs=10 class="pa-3" style="text-align: center">
                    <img class="google-login" src="@/assets/btn_google.png" @click="loginWithGoogle">
                    <p style="font-size: 0.8em; color:dimgray">※ログインにのみ使われます</p>
                </v-col>
            </v-row>
        </v-container>
        <v-footer></v-footer>
    </v-app>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import {getExpireTimeByFirebase} from '@/api';
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
        private isRedirectLogin = 'isRedirectLogin';

        private passRules = [
            (v: any) => !!v || 'Name is required',
        ];

        private emailRules = [
            (v: any) => !!v || 'E-mail is required',
            (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        ];

        public mounted() {
            window.scrollTo(0, 0);
            const isRedirectAfter = localStorage.getItem(this.isRedirectLogin);
            if (this.isMobile() && isRedirectAfter != null && isRedirectAfter === 'true') {
                this.afterRedirect();
            }
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

        public loginWithGoogleAsMobile() {
            localStorage.setItem('isRedirectLogin', 'true');
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithRedirect(provider)
                .catch((err) => {
                    // console.log(err);
                    // this.message = err.toString();
                    localStorage.clear();
                    this.setAlertMessage('ログインエラー');
                    console.log('firebase sign in error');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }

        private afterRedirect() {
            this.isLoading = true;
            firebase.auth().getRedirectResult()
                .then((res: firebase.auth.UserCredential) => {
                    const user = firebase.auth().currentUser;
                    if (user === null) {
                        return new Promise<string>((resolve, reject) => resolve(''));
                    }
                    return user.getIdToken();
                })
                .then((idToken: string) => {
                    if (idToken !== '') {
                        localStorage.setItem('token', idToken.toString());
                        this.$router.push('/bookshelf');
                    }
                })
                .catch((err) => {
                    //console.log(err);
                    // this.message = err.toString();
                    localStorage.clear();
                    this.setAlertMessage('ログインエラー');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }

        private loginOps(p: Promise<firebase.auth.UserCredential>) {
            this.isLoading = true;
            p.then((res: firebase.auth.UserCredential) => {
                if (res.user === null) {
                    return new Promise<string>((_, reject) => reject('user not found'));
                }

                const expTime = getExpireTimeByFirebase();
                if (expTime === null) {
                    return new Promise<string>((_, reject) => reject('user not found'));
                }
                localStorage.setItem('expTime', expTime.toString());
                return res.user.getIdToken();
            }).then((idToken: string) => {
                localStorage.setItem('token', idToken.toString());
                this.$router.push('/bookshelf');
            }).catch((err) => {
                this.setAlertMessage('ログインエラー');
                // this.message = err.toString();
                // console.log("firebase get token error");
            }).finally(() => {
                this.isLoading = false;
            });
        }

        private validateInput(): boolean {
            return (this.$refs.form as Vue & { validate: () => boolean }).validate();
        }

        private setAlertMessage(msg: string) {
            this.alert = true;
            this.message = msg;
        }

        private isMobile(): boolean {
            const ua = navigator.userAgent.toLowerCase();
            const isiPhone = (ua.indexOf('iphone') > -1);
            const isiPad = (ua.indexOf('ipad') > -1);
            const isAndroid = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') > -1);
            const isAndroidTablet = (ua.indexOf('android') > -1) && (ua.indexOf('mobile') === -1);
            return (isiPhone || isiPad || isAndroid || isAndroidTablet);
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

    .divide {
        border: 0 none;
        height: 2px;
        border-top: 1px solid #8c8b8b;
    }

</style>
