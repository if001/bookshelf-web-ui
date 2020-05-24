<template>
    <div>
        <v-row class="flex-row flex-row-reverse text-center" v-if="applySmall()">
            <v-col class="pa-0" style="background-color: gray;">
                <div class="container policy">
                    <router-link class="policy" to="/policy">お問い合わせ、質問はこちら</router-link><span class="ml-3 mr-3">/</span>
                    <router-link class="policy" to="/policy">BookStorageについて</router-link><span class="ml-3 mr-3">/</span>
                    <router-link class="policy" to="/policy">privacy policy</router-link><span class="ml-3 mr-3">/</span>
                    ver. {{version}} <span class="vertical-line">|</span> &copy;2019 <strong>edgwbs.net</strong>
                </div>
            </v-col>
        </v-row>

        <v-row class="flex-column" v-else>
            <v-col class="pa-0" style="background-color: gray;">
                <div class="container mt-5 mb-5">
                    <div  v-bind:class="{ 'pl-3': this.$vuetify.breakpoint.xs }">
                        <div class="mb-2">
                            <a class="policy" href="https://docs.google.com/forms/d/e/1FAIpQLSduyq2V4hdH671SdSJFcBJXmiEuac8k6dsgaeaa8UNnUKnYwg/viewform?usp=sf_link" target="_blank">お問い合わせ/質問はこちら</a>
                        </div>
                        <div class="mb-2">
                            <router-link class="policy" to="/about">BookStorageについて</router-link>
                        </div>
                        <div class="mb-2">
                            <router-link class="policy" to="/policy">privacy policy</router-link>
                        </div>
                        <div class="policy">
                            ver. {{version}} <span class="vertical-line">|</span> &copy;2019 <strong>edgwbs.net</strong>
                        </div>
                    </div>
                </div>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';


    @Component
    export default class Footer extends Vue {
        @Prop({default: false}) private isForceFixed!: boolean;

        private version: string = '1.0.0';

        private applySmall(): boolean {
            const route = this.$router.app.$route.path;
            return route === '/' || route === '/login' || route === '/signup';
        }
        private breakPointIsXS(): boolean {
            return this.$vuetify.breakpoint.name === 'xs';
        }
    }

</script>

<style scoped>
    .policy {
        text-decoration:none;
        color: lightgrey;
    }

    .vertical-line {
        margin: 0 5px 0;
    }
</style>
