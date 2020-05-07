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
                                :type="'password'"
                                :rules="passRules"
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
        private valid = false;
        private passRules = [
            (v: any) => !!v || 'Name is required',
        ];

        private emailRules = [
            (v: any) => !!v || 'E-mail is required',
            (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        ];
        private alreadyExistAccountCode = 'auth/email-already-in-use';

        private message = '';
        private alert = false;

        public mounted() {
            window.scrollTo(0, 0);
        }

        public create() {
            this.alert = false;
            if (!this.validateInput()) {
                return;
            }
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
                        this.$router.push('/bookshelf');
                    }).catch((err) => {
                    // console.log(err);
                    console.log('firebase get token error');
                });
            }).catch((err) => {
                this.message = 'アカウントの作成に失敗しました。';
                if (err.code && err.code === this.alreadyExistAccountCode) {
                    this.message = this.message + 'すでに存在するメールアドレスです。';
                }
                this.alert = true;
                // console.log(err);
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
