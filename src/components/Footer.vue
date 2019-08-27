<template>
    <!--<v-footer-->
            <!--absolute-->
            <!--height="20px"-->
            <!--class="grey lighten-1">-->
        <!--<v-layout row wrap justify-center>-->
            <!--<v-flex xs12 py-3 text-xs-center white&#45;&#45;text>-->
                <!--&copy;2018 — <strong>Vuetify</strong>-->
            <!--</v-flex>-->
        <!--</v-layout>-->
    <!--</v-footer>-->

<!--    v-bind:class="{ active: isActive }"-->
    <div v-bind:class="{ footer_main: !$vuetify.breakpoint.xs, footer_main_sx: $vuetify.breakpoint.xs }">
        <div style="color: lightgrey;margin: auto">
            <router-link class="policy" to="/policy">privacy policy</router-link>
            <span class="vertical-line">|</span>
            ver. {{version}}
            <span class="vertical-line">|</span>
            &copy;2019 <strong>edgwbs.net</strong>
        </div>
    </div>

</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Footer extends Vue {
        private version: string = '0.2.0';
    }

</script>

<style scoped>
    .footer_main{
        display: flex;
        flex-direction: row;
        position: fixed;
        bottom:0;
        height:25px;
        width: 100%;
        background-color: gray;
        justify-content:space-around;
    }

    .footer_main_sx {
        display: flex;
        flex-direction: row;
        height:25px;
        width: 100%;
        bottom:0;
        background-color: gray;
        justify-content:space-around;
        font-size: 0.8em;
    }

    .policy {
        text-decoration:none;
        color: lightgrey;
        margin-left: 20px;
    }

    .vertical-line {
        margin: 0 5px 0;
    }
</style>
