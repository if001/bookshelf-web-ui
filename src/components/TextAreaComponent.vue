<template>
    <v-container class="pa-0 pa-0">
        <v-textarea
                outline
                rows="3"
                label="lavel"
                auto-grow
                value="The Woodman value"
        ></v-textarea>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    @Component
    export default class TextAreaComponent extends Vue {
        private value = '１２３４５６７８９０１２３４５６７８９０１２３４５６７' +
            '８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０' +
            '１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３' +
            '４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６' +
            '７８９０１２３４５６７８９０';
    }
</script>

<style scoped>
</style>