<template>
    <v-app light>
        <v-container>

            <div style="position: absolute; top:1.0em; right: 2.0em;">
                <v-btn color="black" small outlined @click="toLoginBox()">ログイン</v-btn>
            </div>

            <about></about>

            <v-row justify="center" style="color: dimgrey;">
                <v-col cols="10" align="center" class="ma-5" id="loginBox">
                    <v-row align="stretch">
                        <v-col cols="12">
                            <div style="font-size: 1.5em;">ログインはこちらから</div>
                        </v-col>
                        <v-col cols="12" lg="6" md="6">
                            <v-card style="height: 100%;" class="pa-5">
                                <v-row justify="center" align="center">
                                    <v-col cols="12" class="pa-2"
                                           style="font-weight:bold; color:dimgrey;">
                                        外部サービスでログイン
                                    </v-col>
                                    <v-col cols="12" class="pa-3">
                                        <div class="google-login-a" @click="loginWithGoogleByRedirect"></div>
                                    </v-col>
                                    <v-col cols="12" class="pa-3">
                                        <v-btn class="twitter-login-btn"
                                               color="white" elevation="1"
                                               @click="loginWithTwitter">
                                            <img style="height: 25px;width: 25px;" src="@/assets/twitter-icon-96.png">
                                            <div style="font-size: 1.2em; color:dimgrey; padding-left: 10px;letter-spacing: -0.1px;">Sign in with Twitter</div>
                                        </v-btn>
                                    </v-col>
                                    <p style="font-size: 0.8em; color:dimgray">※ログインにのみ使われます</p>
                                </v-row>
                            </v-card>
                        </v-col>
                        <v-col cols="12" lg="6" md="6">
                            <v-card class="pa-5" style="height: 100%;">
                                <v-row justify="center" class="pa-0 ma-0">
                                    <v-col cols="12" class="pa-2"
                                           style="font-weight:bold; color:dimgrey;">
                                        メールアドレスでログイン
                                    </v-col>
                                    <v-col cols="10" class="pa-0 ma-0">
                                        <v-form ref="form"
                                                lazy-validation
                                                v-model="valid"
                                                @submit.prevent="login">
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
                                                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                                    @click:append="showPassword = !showPassword"
                                                    prepend-icon="mdi-lock"
                                                    required
                                            ></v-text-field>
                                            <v-btn id="login_button_landing" type="submit" :loading="isLoading" block color="black" outlined>
                                                ログイン
                                            </v-btn>
                                        </v-form>
                                    </v-col>
                                    <v-col cols="12">
                                        <div class="create-account-link pa-2" style="font-size: 0.8em;">
                                            <router-link to="/reset_password">パスワードを忘れた場合</router-link>
                                        </div>
                                    </v-col>
                                </v-row>
                            </v-card>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col class="pa-5">
                            <v-btn @click="toSignUpPage()" color="#1E90FF" dark>新規登録</v-btn>
                        </v-col>
                    </v-row>
                </v-col>
            </v-row>
        </v-container>
        <v-footer :isForceFixed="true"></v-footer>
        <v-dialog
                v-model="isLoading"
                hide-overlay
                persistent
                width="300">
            <v-card color="primary" dark>
                <v-card-text>
                    Login ...
                    <v-progress-linear
                            indeterminate
                            color="white"
                            class="mb-0"
                    ></v-progress-linear>
                </v-card-text>
            </v-card>
        </v-dialog>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import Footer from '@/components/Footer.vue';
    import About from '@/components/About.vue';
    import firebase from 'firebase/app';
    import 'firebase/auth';

    @Component({
        components: {
            'v-footer': Footer,
            'about': About,
        },
    })
    export default class LandingView extends Vue {
        private email: string = '';
        private password: string = '';
        private valid = false;
        private showPassword: boolean = false;
        private message = '';
        private isLoading: boolean = false;
        private alert: boolean = false;
        private isRedirectLogin = 'isRedirectLogin';
        private loginErrorMessage = 'メールアドレスまたはパスワードが間違っています';
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
            if (isRedirectAfter != null && isRedirectAfter === 'true') {
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

        public loginWithGoogleByRedirect() {
            localStorage.setItem('isRedirectLogin', 'true');
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    return firebase.auth().signInWithRedirect(provider);
                })
                .catch((err) => {
                    // console.log(err);
                    // this.message = err.toString();
                    localStorage.clear();
                    this.setAlertMessage(this.loginErrorMessage);
                    console.log('firebase sign in error');
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }

        private loginWithTwitter() {
            localStorage.setItem('isRedirectLogin', 'true');
            const provider = new firebase.auth.TwitterAuthProvider();
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then((res) => {
                    return firebase.auth().signInWithRedirect(provider);
                })
                .catch((err) => {
                    localStorage.clear();
                    this.setAlertMessage(this.loginErrorMessage);
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
                        this.$router.push('/bookshelf');
                    }
                })
                .catch((err) => {
                    // console.log(err);
                    // this.message = err.toString();
                    this.setAlertMessage(this.loginErrorMessage);
                })
                .finally(() => {
                    this.isLoading = false;
                });
        }

        private loginOps(p: Promise<firebase.auth.UserCredential>) {
            this.isLoading = true;
            firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(() => {
                    return p;
                })
                .then((res: firebase.auth.UserCredential) => {
                    if (res.user === null) {
                        return new Promise<string>((_, reject) => reject('user not found'));
                    }
                    return res.user.getIdToken();
                })
                .then((idToken: string) => {
                    this.$router.push('/bookshelf');
                })
                .catch((err) => {
                    this.setAlertMessage(this.loginErrorMessage);
                    // this.message = err.toString();
                    // console.log("firebase get token error");
                })
                .finally(() => {
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


        // todo booksViewでも使ってるのでまとめる
        private brackPointIsXS(): boolean {
            return this.$vuetify.breakpoint.name === 'xs';
        }
        // todo searchComponentでも使ってるのでまとめる
        private toLoginBox() {
            const target = document.getElementById('loginBox');
            if (target) {
                const posY = target.getBoundingClientRect().top;
                window.scrollTo(0, posY + window.pageYOffset);
            }
        }

        private toSignUpPage() {
            this.$router.push('/signup');
        }
    }


</script>

<style scoped>
    .google-login-a {
        cursor: pointer;
        background-image:url('../assets/btn_google_signin_light_normal_web.png');
        background-repeat:no-repeat;
        width: 191px;
        height: 46px;
    }
    .google-login-a:hover {
        cursor: pointer;
        background-image:url('../assets/btn_google_signin_light_pressed_web.png');
        background-repeat:no-repeat;
        width: 191px;
        height: 46px;
    }
    .google-login-icon {
        background-image:url('../assets/btn_google_light_normal_icon.svg');
    }
    .twitter-login-btn {
        text-transform: none;
        width: 191px;
        height:46px;
        font-size: 12px;
    }
    .pd-divier{
        padding-bottom: 5em;
    }

    .create-account-link {
        text-align: center;
        color: dimgray;
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
</style>
