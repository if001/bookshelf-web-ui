<template>
    <v-row class="flex-column ma-0" v-else>
        <v-col class="pa-0" style="background-color: gray;">
            <div class="container mt-5 mb-5 pa-0">
                <div v-bind:class="{ 'pl-3': this.$vuetify.breakpoint.xs }">
                    <div class="mb-2">
                        <div class="footer-item pointer" @click="installApp()">ホーム画面に追加する</div>
                    </div>
                    <div class="mb-2">
                        <a class="footer-item" href="https://docs.google.com/forms/d/e/1FAIpQLSduyq2V4hdH671SdSJFcBJXmiEuac8k6dsgaeaa8UNnUKnYwg/viewform?usp=sf_link" target="_blank">お問い合わせ/質問はこちら</a>
                    </div>
                    <div class="mb-2">
                        <router-link class="footer-item" to="/about">BookStorageについて</router-link>
                    </div>
                    <div class="mb-2">
                        <router-link class="footer-item" to="/policy">privacy policy</router-link>
                    </div>
                    <div class="footer-item">
                        ver. {{version}} <span class="vertical-line">|</span> &copy;2019 <strong>edgwbs.net</strong>
                    </div>
                </div>
            </div>
        </v-col>
    </v-row>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';


    @Component
    export default class Footer extends Vue {
        @Prop({default: false}) private isForceFixed!: boolean;

        private version: string = '1.0.0';
        private hoge = "hoge";

        private breakPointIsXS(): boolean {
            return this.$vuetify.breakpoint.name === 'xs';
        }

        private installApp() {
            window.addEventListener('beforeinstallprompt', (e: any) => {
                let deferredPrompt;
                e.preventDefault();
                // Stash the event so it can be triggered later.
                deferredPrompt = e;
                deferredPrompt.prompt();
            });
        }
    }
</script>

<style scoped>
    .footer-item {
        text-decoration:none;
        color: lightgrey;
    }
    .pointer {
        cursor: pointer;
    }

    .vertical-line {
        margin: 0 5px 0;
    }
</style>
