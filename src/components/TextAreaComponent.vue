<template>
    <v-container class="pa-0 pa-0">
        <v-textarea
                outline
                rows="3"
                label="comment"
                auto-grow
                value=""
                single-line
                counter="140"
                maxlength="140"
                v-model="description"
                v-on:keyup="onChangeInput"
        ></v-textarea>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';

    @Component
    export default class TextAreaComponent extends Vue {
        private description = '';

        // TODO 最大文字数、cssの確認用
        private full = '１２３４５６７８９０１２３４５６７８９０１２３４５６７' +
            '８９０１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０' +
            '１２３４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３' +
            '４５６７８９０１２３４５６７８９０１２３４５６７８９０１２３４５６' +
            '７８９０１２３４５６７８９０';

        private onChangeInput(event: any) {
            this.$emit('textarea-event', this.description);
        }

    }
</script>

<style scoped>
</style>