<template>
    <v-app light>
        <v-header></v-header>
        <books-view></books-view>
    </v-app>
</template>
<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import BooksView from '@/views/BooksView.vue';
    import Header from '@/components/Header.vue';

    @Component({
        components: {
            'books-view': BooksView,
            'v-header': Header,
        },
    })
    export default class MainViews extends Vue {

    }

</script>

<style scoped>

</style>