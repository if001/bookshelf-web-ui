<template>
    <v-app light>
        <v-container style="height: 100%;">
            <v-row justify="center">
                <v-col cols="12" lg="8" md="8">
                    <div class="login-title">
                        パスワードをリセットします
                    </div>
                </v-col>
            </v-row>

            <v-row justify="center">
                <v-col cols="10" lg="4" md="4" sm="4">
                    <div style="text-align: center;">パスワードをリセットするためにメールを送信します。</div>
                    <v-form lazy-validation 
                            v-model="valid"
                            ref="form"
                            @submit.prevent="resetPassword"
                            >
                        <v-text-field
                                v-model="email"
                                label="Email"
                                :rules="emailRules"
                                prepend-icon="mdi-email"
                                required
                        ></v-text-field>
                        <v-btn block color="#dc143c" dark>
                            Reset Password
                        </v-btn>
                    </v-form>
                </v-col>
            </v-row>

            <v-row justify="center" v-if="alert">
                <v-col lg="6" md="6" sm="6" xs="12" class="pa-1" >
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
                <v-col cols="12">
                    <div class="create-account-link pa-3">
                        すでにアカウントを持っている場合
                        <router-link to="/login">こちらからログイン</router-link>
                        できます
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
        private valid = false;
        private emailRules = [
            (v: any) => !!v || 'E-mail is required',
            (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        ];

        private message = '';
        private alert = false;

        public resetPassword() {
            this.alert = false;
            if (!this.validateInput()) {
                return;
            }
            firebase.auth().sendPasswordResetEmail(this.email).then((res) => {
                const ans = confirm('ご登録のメールアドレスに再設定のリンクを送付いたしました。');
                if (ans) {
                    this.$router.replace('/login');
                }
            }).catch((err) => {
                this.message = 'ご登録のアドレスがございません。再度メールアドレスのご確認をお願いします。';
                // alert('ログインエラー');
                // console.log(err);
                this.alert = true;
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
