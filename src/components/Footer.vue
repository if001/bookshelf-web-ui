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


    <div style=" display: flex;flex-direction: row;position: fixed; bottom:0; height:25px;width: 100%;background-color: gray;">
        <v-spacer></v-spacer>
        <div style="margin: auto;color: lightgrey;">
            &copy;2019 — <strong>edgwbs.net</strong>
        </div>
        <v-spacer></v-spacer>
    </div>

</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Footer extends Vue {

    }

</script>

<style scoped>

</style>