<template>
    <v-container>
        <v-layout row wrap>

            <v-flex class="ma-2" v-for="book in books">
                <v-card>
                    <v-layout row>
                        <v-flex class="font-weight-light font title pa-2">タイトル５６７８９０１２３４</v-flex>
                        <v-icon large right v-if="book.status==1">bookmark</v-icon>
                        <v-icon large right v-if="book.status==2">done</v-icon>
                        <v-icon large right v-if="book.status==3">close</v-icon>
                    </v-layout>

                    <v-flex row class="font-weight-thin　subheading pa-2">著者３４５６７８９０</v-flex>

                    <v-btn block small>
                        <v-icon v-if="book.isOpen" style="width: 100%" @click="chengeBookDiscribe(book)">arrow_drop_up</v-icon>
                        <v-icon v-else style="width: 100%" @click="chengeBookDiscribe(book)">arrow_drop_down</v-icon>
                    </v-btn>

                    <v-layout v-if="book.isOpen" row>
                        <v-flex md6>
                            <v-card-title>要素</v-card-title>
                            <v-flex row sx-12>
                                <v-btn outline round class="green">カテゴリ１</v-btn>
                                <v-btn outline round class="green">カテゴリ１</v-btn>
                            </v-flex>
                            <v-card-title>要素</v-card-title>
                            <v-card-title>要素</v-card-title>
                        </v-flex>
                        <v-flex md6>
                            <v-textarea
                                    outline
                                    rows=3
                                    label="Outline textarea"
                                    value="The Woodman set to work at once"
                            ></v-textarea>
                        </v-flex>
                    </v-layout>

                </v-card>
            </v-flex>

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
