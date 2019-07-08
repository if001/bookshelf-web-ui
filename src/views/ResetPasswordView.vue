<template>
    <v-app light>
        <v-container>
            <v-layout row wrap>
                <v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2>
                    <div class="login-title">
                        For got your Password?
                    </div>
                </v-flex>

                <v-flex lg4 md4 sm4 xs10 offset-lg4 offset-md4 offset-sm4 offset-xs1>
                    <div style="text-align: center;">Send email to reset your password.</div>
                    <v-form lazy-validation v-model="valid">
                        <v-text-field
                                v-model="email"
                                label="Email"
                                :rules="emailRules"
                                prepend-icon="email"
                                required
                        ></v-text-field>
                    </v-form>

                    <v-btn @click="resetPassword" block color="#dc143c" dark>
                        Reset Password
                    </v-btn>

                    <div class="warning-font">{{ message }}</div>
                </v-flex>

                <v-flex lg12 md12 sm12 xs12>
                    <div class="create-account-link pa-3">
                        Already have an account?
                        <router-link to="/login">Log in here</router-link>
                    </div>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import firebase from 'firebase/app';
    import 'firebase/auth';

    @Component
    export default class SignUpView extends Vue {
        private email: string = '';
        private valid = false;
        private emailRules = [
            (v: any) => !!v || 'E-mail is required',
            (v: any) => /.+@.+/.test(v) || 'E-mail must be valid',
        ];

        private message = '';

        public resetPassword() {
            firebase.auth().sendPasswordResetEmail(this.email).then((res) => {
                const ans = confirm('ご登録のメールアドレスに再設定のリンクを送付いたしました。');
                if (ans) {
                    this.$router.replace('/login');
                }
            }).catch((err) => {
                this.message = 'ご登録のアドレスがございません。再度メールアドレスのご確認をお願いします。';
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