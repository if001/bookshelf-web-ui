<template>
    <v-footer height="auto" class="grey lighten-1">
        <v-layout row wrap justify-center>
            <v-flex xs12 py-3 text-xs-center white--text>
                &copy;2018 — <strong>Vuetify</strong>
            </v-flex>
        </v-layout>
    </v-footer>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class Footer extends Vue {

    }

</script>

<style scoped>

</style>