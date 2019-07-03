<template>
    <v-app light>
        <v-header></v-header>
        <div style="padding-top: 50px;">
            <!--<books-view></books-view>-->
            <router-view/>
        </div>

        <v-footer></v-footer>
    </v-app>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import BooksView from '@/views/BooksView.vue';
    import Header from '@/components/Header.vue';
    import Footer from '@/components/Footer.vue';

    @Component({
        components: {
            'books-view': BooksView,
            'v-header': Header,
            'v-footer': Footer,
        },
    })
    export default class MainViews extends Vue {
    }

</script>

<style scoped>

</style>