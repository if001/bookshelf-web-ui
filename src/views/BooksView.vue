<template>
    <!--<v-container  style="height: 1000px;">-->
    <div>
        <v-container>
            <v-layout row nowrap justify-center>
                <v-flex md12>
                    <v-tabs fixed-tabs color="#fafafa">
                        <v-tab
                                v-for="f in filterObject"
                                :key="f.displayName"
                                @change="changeFilter(f.filterKey)"
                        >
                            {{ f.displayName }}
                        </v-tab>
                    </v-tabs>
                </v-flex>
            </v-layout>

            <v-layout row nowrap justify-center>
                <v-flex lg8 md8 sm8 xs8 class="ma-3">
                    <v-text-field
                            flat
                            label="Search"
                            append-icon=search
                            @click:append="search"
                    ></v-text-field>
                </v-flex>
                <v-flex lg4 md4 sm4 xs4 class="ma-3">
                    <v-select
                        v-model="selectSortKey"
                        :items="sortObject"
                        item-text="displayName"
                        item-value="sortKey"
                        append-icon="sort"
                        label="Sort"
                        @change="changeSort()"
                ></v-select>
                </v-flex>
            </v-layout>

            <v-layout row wrap justify-start>
                <div v-if="loading" style="margin: auto;">
                    <div style="display:inline-block; padding-right: 15px;">loading...</div>
                    <div class="loading loading-content">
                        <v-icon large>fa-book</v-icon>
                    </div>
                </div>
                <div v-if="!loading && booksShow.length === 0" style="margin: auto;padding: 20px;">
                    本がまだありません.
                </div>
                <v-flex v-else class="pa-2" v-for="book in booksShow" :key="book.id" lg4 md6 sm12
                        xs12>
                    <v-hover>
                        <v-card
                                slot-scope="{ hover }"
                                :class="`elevation-${hover ? 12 : 2}`"
                                :to="{ name: 'bookDetail', params: { bookId: book.id }}"
                        >
                            <v-layout class="font-weight-light font title pt-2 pl-3 pr-2 pb-0" row>
                                <v-flex align-self-center>{{book.title}}</v-flex>
                                <v-btn flat
                                       icon
                                       color="dark"
                                       class="ma-0">
                                    <v-icon large
                                            color="blue-grey darken-1"
                                    >{{ bookState(book.start_at, book.end_at).icon }}
                                    </v-icon>
                                </v-btn>
                            </v-layout>

                            <!--<v-icon large right v-if="book.status==1">bookmark</v-icon>-->
                            <!--<v-icon large right v-if="book.status==2">done</v-icon>-->
                            <!--<v-icon large right v-if="book.status==3">close</v-icon>-->
                            <v-layout class="pt-0 pl-4 pr-2 pb-2" row>
                                <v-flex align-self-center :class="{ noset_font: (book.author == null)}">
                                    {{ (book.author != null) ? book.author.name : "not set" }}
                                </v-flex>
                            </v-layout>
                        </v-card>
                    </v-hover>
                    <!--<v-divider></v-divider>-->
                </v-flex>
            </v-layout>

            <v-layout row nowrap justify-center>
                <v-flex md12 class="mt-2 mb-4 text-xs-center">
                    <v-pagination
                            v-model="page"
                            :length=totalPageNumber
                            :total-visible="7"
                            @input="pagenaite()"
                            color="#1e90ff"
                    ></v-pagination>
                </v-flex>
            </v-layout>
            <!--<book-create-modal-->
                    <!--v-if="createModalIsOpen"-->
                    <!--@close="createModalIsOpen = false"-->
                    <!--@closeCreate="closeCreate()">-->
            <!--</book-create-modal>-->
            <v-btn
                    fab
                    bottom
                    right
                    color="pink"
                    dark
                    fixed
                    @click="toRegister()">
                    <!--@click="createModalIsOpen = !createModalIsOpen">-->
                <v-icon>add</v-icon>
            </v-btn>
        </v-container>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import BookCreateModal from './BookCreateModalView.vue';
    import api, {Book} from '@/api';


    interface BookShow extends Book {
        isOpen: boolean;
    }

    @Component({
        components: {
            BookCreateModal,
        },
    })

    export default class BooksView extends Vue {
        private booksShow: BookShow[] = [];
        private books: Book[] = [];
        private totalCount: number = 0;
        private perPage: number = 16;
        private loading: boolean = true;

        private createModalIsOpen: boolean = false;

        private sortObject = [
            {sortKey: 'updated_at', displayName: '更新日'},
            {sortKey: 'created_at', displayName: '作成日'},
            {sortKey: 'title', displayName: '五十音順'},
        ];
        private selectSortKey = 'updated_at';
        private filterObject = [
            {filterKey: null, displayName: 'ALL'},
            {filterKey: 'not_read', displayName: '未読'},
            {filterKey: 'reading', displayName: '読中'},
            {filterKey: 'read', displayName: '読了'},
        ];
        private selectFilter: string | null = null;

        private page = 1;

        public mounted() {
            this.load(this.page, this.perPage, this.selectSortKey, this.selectFilter);
            this.toTop();
        }

        private toTop() {
            window.scrollTo(0, 0);
        }

        private load(page: number | null, perPage: number | null, sortKey: string | null, filter: string | null) {
            this.booksShow = [];
            this.loading = true;
            api.books.list(page, perPage, sortKey, filter).then((response) => {
                this.books = response.data.content.books as Book[];
                this.totalCount = response.data.content.total_count as number;
            }).then(() => {
                this.booksShow = this.books.map((book) => {
                    return {
                        id: book.id,
                        title: book.title,
                        author: book.author,
                        publishedAt: book.publishedAt,
                        publisher: book.publisher,
                        accountId: book.accountId,
                        start_at: book.start_at,
                        end_at: book.end_at,
                        nextBookId: book.nextBookId,
                        prevBookId: book.prevBookId,
                        categories: book.categories,
                        created_at: book.created_at,
                        updated_at: book.updated_at,
                        isOpen: false,
                    } as BookShow;
                });
                this.loading = false;
            }).catch((err) => {
                console.log('/books api error');
                // console.log(err);
                this.loading = false;
                this.$router.push('/login');
            });
        }

        private closeCreate() {
            this.createModalIsOpen = false;
            this.selectSortKey = 'created_at';
            this.load(this.page, this.perPage, this.selectSortKey, null);
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

        private changeSort() {
            this.page = 1;
            this.load(this.page, this.perPage, this.selectSortKey, this.selectFilter);
        }

        private changeFilter(filter: string) {
            this.selectFilter = filter;
            this.page = 1;
            this.load(this.page, this.perPage, this.selectSortKey, this.selectFilter);
            this.toTop();
        }

        private pagenaite() {
            this.load(this.page, this.perPage, this.selectSortKey, this.selectFilter);
            this.toTop();
        }

        get totalPageNumber() {
            // return Math.floor(this.booksShow.length / this.perPage) + 1
            return Math.floor(this.totalCount / this.perPage) + 1;
        }

        private toRegister() {
            this.$router.push('/register');
        }
    }

</script>

<style scoped>
    .reverse{
        transform: scale(-1, 1);
    }
    .noset_font {
        color: grey;
    }

    .loading {
        display: inline-block;
        font-size: 3em;
    }

    .loading-content {
        animation: r1 1s linear infinite;
    }

    @keyframes r1 {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
