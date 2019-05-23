<template>
    <v-container  style="height: 1000px;">
        <v-layout row wrap justify-start>
            <p v-if="booksShow.length == 0">loading...</p>
            <v-flex v-if="booksShow.length != 0" class="pa-2" v-for="book in booksShow" :key="book.id" lg4 md6 sm12 xs12>
                <v-card>
                    <v-layout class="font-weight-light font title pt-2 pl-3 pr-2 pb-0" row>
                        <v-flex align-self-center="true">{{book.name}}</v-flex>
                        <v-btn flat
                               icon
                               color="dark"
                               class="ma-0">
                            <v-icon large
                                    color="blue-grey darken-1">bookmark</v-icon>
                        </v-btn>
                    </v-layout>

                    <!--<v-icon large right v-if="book.status==1">bookmark</v-icon>-->
                    <!--<v-icon large right v-if="book.status==2">done</v-icon>-->
                    <!--<v-icon large right v-if="book.status==3">close</v-icon>-->
                    <v-layout class="font-weight-thin pt-0 pl-4 pr-2 pb-2" row>
                        <v-flex align-self-center="true">
                            {{ (book.author != null) ? book.author.name : "hoge" }}
                        </v-flex>
                        <!--<v-btn outline small fab color="indigo" class="ma-0">-->
                        <!--<v-icon small>edit</v-icon>-->
                        <!--</v-btn>-->
                        <v-btn outline small fab color="light-blue darken-1" class="ma-0" @click="book.isOpen = true">
                            <v-icon small>edit</v-icon>
                        </v-btn>
                        <book-modal
                                v-if="book.isOpen"
                                @close="book.isOpen = false"
                                :bookDetailProp="book">
                        </book-modal>

                    </v-layout>
                </v-card>
                <!--<v-divider></v-divider>a-->
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
    import {Component, Vue} from 'vue-property-decorator';
    import BookModal from './BooksModalView.vue';
    import api, {Book} from '@/api';

    interface BookShow extends Book {
        isOpen: boolean;
    }

    @Component({
        components: {
            BookModal,
        },
    })

    export default class BooksView extends Vue {
        private booksShow: BookShow[] = [];
        private books: Book[] = [];

        public mounted() {
            api.book.list().then((response) => {
                this.books = response.data.content as Book[];
            }).then(() => {
                this.booksShow = this.books.map((book) => {
                    return {
                        id: book.id,
                        name: book.name,
                        author: book.author,
                        publishedAt: book.publishedAt,
                        publisher: book.publisher,
                        accountId: book.accountId,
                        startAt: book.startAt,
                        endAt: book.endAt,
                        nextBookId: book.nextBookId,
                        prevBookId: book.prevBookId,
                        descriptions: book.descriptions,
                        categories: book.categories,
                        createdAt: book.createdAt,
                        updatedAt: book.updatedAt,
                        isOpen: false,
                    } as BookShow
                });
            }).catch(() => {
                console.log('error');
            });
        }
    }

</script>

<style scoped>

</style>
