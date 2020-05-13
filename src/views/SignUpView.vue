<template>
    <v-app light>
        <v-container text-xs-center style="height: 100%">
            <v-row justify="center">
                <v-col cols="8">
                    <div class="display-1" style="color:dimgrey; text-align: center">
                        BookStorage に新規登録
                    </div>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="10" lg="4" md="4" sm="4">
                    <v-form ref="form"
                            lazy-validation 
                            v-model="valid"
                            @submit.prevent="create">
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
                        <v-text-field
                                v-model="confirmPassword"
                                label="Confirm Password"
                                :type="showConfirmPassword ? 'text' : 'password'"
                                :rules="passRules"
                                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                                @click:append="showConfirmPassword = !showConfirmPassword"
                                prepend-icon="mdi-lock"
                                required
                        ></v-text-field>
                        <v-btn type="submit" block color="#ee82ee" dark>
                            登録
                        </v-btn>
                    </v-form>
                </v-col>
            </v-row>

             <v-row justify="center" v-if="alert">
                <v-col cols="6" lg="6" md="6" class="pa-1" >
                    <v-alert
                            v-if="alert"
                            v-model="alert"
                            dismissible
                            color="error"
                            icon="mdi-warning"
                            outlined
                            @click="alert = false">
                        {{message}}
                    </v-alert>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="12" stretch>
                    <div class="create-account-link pa-3">
                        登録済みの場合は
                        <router-link to="/login">こちらからログイン</router-link>
                        できます。
                    </div>
                </v-col>
            </v-row>

        </v-container>
        <v-footer></v-footer>
        <v-dialog
                v-model="isLoading"
                hide-overlay
                persistent
                width="300"
        >
            <v-card
                    color="primary"
                    dark
            >
                <v-card-text>
                    <p>{{modalMessage}}</p>
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
    import firebase from 'firebase/app';
    import 'firebase/auth';
    import Footer from '@/components/Footer.vue';

    @Component({
        components: {
            'v-footer': Footer,
        },
    })
    export default class SignUpView extends Vue {
        private email: string = '';
        private password: string = '';
        private confirmPassword: string = '';
        private showPassword: boolean = false;
        private showConfirmPassword: boolean = false;

        private valid = false;
        private passRules = [
            (v: any) => !!v || 'Password is required',
        ];

        private emailRules = [
            (v: any) => !!v || 'E-mail is required',
            (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        ];
        private alreadyExistAccountCode = 'auth/email-already-in-use';

        private message = '';
        private alert = false;
        private isLoading = false;
        // private isLoading = true;
        private modalMessage = '登録しています....';
        public mounted() {
            window.scrollTo(0, 0);
        }

        public create() {
            this.alert = false;
            this.message = '';
            if (!this.validateInput()) {
                return;
            }
            if (this.password !== this.confirmPassword) {
                this.alert = true;
                this.message = 'パスワードが一致しません';
                return;
            }
            this.isLoading = true;
            firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                .then((res) => {
                    if (res == null) {
                        // console.log('not get response');
                        this.isLoading = false;
                        return;
                    }
                    if (res.user == null) {
                        // console.log('user not found');
                        this.isLoading = false;
                        return;
                    }
                    return res.user.getIdToken();
                })
                .then((idToken) => {
                    this.modalMessage = '登録に成功しました。ログインします....';
                    // console.log(idToken);
                })
                .then(() => {
                    return new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                        }, 5 * 1000);
                    });
                })
                .then(() => {
                    this.$router.push('/bookshelf');
                })
                .catch((err) => {
                    this.message = 'アカウントの作成に失敗しました。';
                    if (err.code && err.code === this.alreadyExistAccountCode) {
                        this.message = this.message + 'すでに存在するメールアドレスです。';
                    }
                    this.alert = true;
                    // console.log(err);
                })
                .finally(() => {
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
        padding: 15px;
        text-align: center;
    }

    .create-account-link {
        text-align: center;
        font-color: dimgray;
        text-decoration: none;
    }

    .create-account-link a:link {
        color: dimgray;
        /* text-decoration: none; */
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
