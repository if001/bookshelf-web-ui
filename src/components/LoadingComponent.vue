<template>
    <div v-if="isLoading" class="loading-content pa-3"
         v-bind:class="{'position-center': isFixedCenter, 'loading-content': true}">
        <div class="loading-text">loading...</div>
        <div class="loading-icon">
            <v-icon :large="large" :small="small">fa-book</v-icon>
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    @Component
    export default class LoadingComponent extends Vue {
        @Prop({ default: false })
        private large!: boolean;

        @Prop({ default: false })
        private small!: boolean;

        @Prop()
        private isLoading!: boolean;

        @Prop({ default: false })
        private isFixedCenter!: boolean;
    }
</script>

<style scoped>
    .loading-content {
        z-index: 30;
        background-color: white;
        color: gray;
    }

    .position-center {
        position: fixed;
        top: 300px;
    }

    .loading-icon {
        display: inline-block;
        font-size: 3em;
        animation: r1 1s linear infinite;
    }
    .loading-text {
        display:inline-block;
        padding-right: 15px;
    }

    @keyframes r1 {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
