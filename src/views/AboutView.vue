<template>
    <v-app light>
        <v-container>
            <about></about>
        </v-container>
        <div class="ma-5" align="center">
            <v-btn @click="toTopPage()" outlined>
                Book Storageに戻る
            </v-btn>
        </div>
    </v-app>
</template>

<script lang="ts">
    import {Component} from 'vue-property-decorator';
    import About from '../components/About.vue';
    import {BaseComponent} from '@/utils/utils';

    @Component({
        components: {
            about: About,
        },
    })
    export default class AboutView extends BaseComponent {
        public mounted() {
            super.mounted();
        }

        private toTopPage() {
            this.$router.push('/');
        }
    }
</script>
<style scoped>
</style>
