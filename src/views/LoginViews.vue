<template>
    <v-app light>
        <v-container>
            <v-layout justify-center>
                <v-flex lg8 md8 sm8>
                    <v-card class="pa-2">
                        <v-card-title>
                            Login
                        </v-card-title>
                        <v-form v-model="valid">
                            <v-text-field
                                    v-model="email"
                                    :rules="nameRules"
                                    label="Email"
                                    required
                            ></v-text-field>
                            <v-text-field
                                    v-model="password"
                                    :rules="emailRules"
                                    label="Password"
                                    required
                            ></v-text-field>
                        </v-form>
                        <v-layout justify-center>
                            <v-btn class="mr-4">
                                <router-link to="/bookshelf">
                                    ログイン
                                </router-link>
                            </v-btn>
                            <v-btn class="ml-4">
                                <router-link to="/bookshelf">サインイン</router-link>
                            </v-btn>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>


            <v-layout justify-center>
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

            <v-layout justify-center>
                <v-flex lg8 md8 sm8>
                    <v-layout justify-center>
                        <img src="@/assets/btn_google.png" height="50px">
                    </v-layout>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class BookViews extends Vue {
        // TODO バリデーションつける

    }

</script>

<style scoped>

</style>