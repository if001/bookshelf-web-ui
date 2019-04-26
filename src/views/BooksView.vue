<template>
    <v-container>
        <v-layout row wrap>


            <v-card class="ma-2" v-for="book in books">
                <v-layout row>
                    <v-card-title class="font-weight-light font title pa-2">タイトル５６７８９０１２３４</v-card-title>
                    <v-icon large right v-if="book.status==1">bookmark</v-icon>
                    <v-icon large right v-if="book.status==2">done</v-icon>
                    <v-icon large right v-if="book.status==3">close</v-icon>
                </v-layout>
                <v-card-text class="font-weight-thin　subheading pa-2">著者３４５６７８９０</v-card-text>

                <v-flex row sx-12 grey lighten-1>
                    <!-- TODO 無理やり１００％にして真ん中寄せにしたけどあってる？-->
                    <v-icon v-if="book.isOpen" style="width: 100%" @click="chengeBookDiscribe(book)">arrow_drop_up</v-icon>
                    <v-icon v-else style="width: 100%" @click="chengeBookDiscribe(book)">arrow_drop_down</v-icon>
                </v-flex>

                <v-flex row sx-12 v-if="book.isOpen">
                    <v-card>
                        <v-card-title>要素</v-card-title>
                        <v-flex row sx-12>
                            <v-btn outline round class="green">カテゴリ１</v-btn>
                        </v-flex>
                        <v-card-title>要素</v-card-title>
                        <v-card-title>要素</v-card-title>
                    </v-card>
                </v-flex>

            </v-card>


        </v-layout>

        <v-btn
                fab
                bottom
                right
                color="pink"
                dark
                fixed
                @click="dialog = !dialog">
            <v-icon>add</v-icon>
        </v-btn>
    </v-container>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    interface Book {
        status: number;
        isOpen: boolean;

    }

    @Component
    export default class BooksView extends Vue {
        private books = [
            {
                status: 1,
                isOpen: false,
            },
            {
                status: 2,
                isOpen: false,
            },
            {
                status: 3,
                isOpen: false,
            },
            {
                status: 3,
                isOpen: false,
            },
            {
                status: 3,
                isOpen: false,
            },
            {
                status: 3,
                isOpen: false,
            },

        ] as Book[];

        private chengeBookDiscribe(book: Book) {
            book.isOpen = !book.isOpen;
        }


    }

</script>

<style scoped>

</style>
