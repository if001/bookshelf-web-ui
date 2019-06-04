<template>
    <!--<v-container  style="height: 1000px;">-->
    <div>
        <v-container>
            <v-layout row nowrap justify-start>
                <v-flex md6 class="ma-3">
                    <v-select
                            :items="sort"
                            label="sort"
                    ></v-select>
                </v-flex>
                <v-flex md6 class="ma-3">
                    <v-text-field
                            flat
                            label="Search"
                            append-icon=search
                            @click:append="search"
                    ></v-text-field>
                </v-flex>
            </v-layout>

            <v-layout row wrap justify-start>
                <p v-if="booksShow.length == 0">loading...</p>
                <v-flex v-else class="pa-2" v-for="book in booksShow" :key="book.id" lg4 md6 sm12
                        xs12>
                    <v-hover>
                        <!--<v-card-->
                        <!--slot-scope="{ hover }"-->
                        <!--:class="`elevation-${hover ? 12 : 2}`"-->
                        <!--@click="book.isOpen = !book.isOpen"-->
                        <!--&gt;-->
                        <v-card
                                slot-scope="{ hover }"
                                :class="`elevation-${hover ? 12 : 2}`"
                                :to="{ name: 'bookDetail', params: { bookId: book.id }}"
                        >
                            <v-layout class="font-weight-light font title pt-2 pl-3 pr-2 pb-0" row>
                                <v-flex align-self-center="true">{{book.name}}({{book.id}})</v-flex>
                                <v-btn flat
                                       icon
                                       color="dark"
                                       class="ma-0">
                                    <v-icon large
                                            color="blue-grey darken-1"
                                            v-bind:class="{ reverse : bookState(book.startAt, book.endAt).label === '未読' }"
                                    >{{ bookState(book.startAt, book.endAt).icon }}
                                    </v-icon>
                                </v-btn>
                            </v-layout>

                            <!--<v-icon large right v-if="book.status==1">bookmark</v-icon>-->
                            <!--<v-icon large right v-if="book.status==2">done</v-icon>-->
                            <!--<v-icon large right v-if="book.status==3">close</v-icon>-->
                            <v-layout class="pt-0 pl-4 pr-2 pb-2" row>
                                <v-flex align-self-center>
                                    {{ (book.author != null) ? book.author.name : "not set" }}
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-hover>
                    <!--<v-divider></v-divider>-->
                    <book-modal
                            v-if="book.isOpen"
                            @closeDetail="book.isOpen = false"
                            :bookDetailProp="book">
                    </book-modal>
                </v-flex>

            </v-layout>

            <book-create-modal
                    v-if="isOpen"
                    @closeCreate="isOpen = false">
            </book-create-modal>
            <v-btn
                    fab
                    bottom
                    right
                    color="pink"
                    dark
                    fixed
                    @click="isOpen = !isOpen">
                <v-icon>add</v-icon>
            </v-btn>
        </v-container>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import BookCreateModal from './BookCreateModalView.vue';
    import Toolbar from '../components/Toolbar.vue';
    import api, {Book} from '@/api';

    interface BookShow extends Book {
        isOpen: boolean;
    }

    @Component({
        components: {
            BookCreateModal,
            Toolbar,
        },
    })

    export default class BooksView extends Vue {
        private booksShow: BookShow[] = [];
        private books: Book[] = [];
        private isOpen: boolean = false;
        private sort = ['Foo', 'Bar', 'Fizz', 'Buzz'];

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
                    } as BookShow;
                });
            }).catch(() => {
                console.log('error');
            });
        }

        private search() {
            console.log('search');
        }
        private bookState(startAt: string | null, endAt: string | null) {
            if (endAt == null && startAt == null) {
                return { icon : 'fa-book', label : '未読' };
            } else if (endAt == null) {
                return { icon : 'bookmark', label : '読中' };
            } else {
                return { icon : 'done', label : '了読' };
            }
        }

    }

</script>

<style scoped>
    .reverse{
        transform: scale(-1, 1);
    }
</style>
