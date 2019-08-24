<template>
    <!--<v-container  style="height: 1000px;">-->
<!--    <div>-->
        <v-container v-bind:class="{ xs_height: $vuetify.breakpoint.xs}">
<!--            <v-tabs fixed-tabs color="#fafafa">-->
            <v-tabs class="pa-3"
                    background-color="grey lighten-5"
                    :centered="true"
                    :grow="true"
                    bark
                    >
                <v-tab
                        color="grey lighten-5"
                        v-for="f in filterObject"
                        :key="f.displayName"
                        @change="changeFilter(f.filterKey)"
                >
                    {{ f.displayName }}
                </v-tab>
            </v-tabs>

            <v-row justify="center" cols="12" class="pa-3">
                <v-col lg="8" md="8" sm="8" xs="8">
                    <v-text-field
                            text
                            label="Search"
                            append-icon="mdi-search"
                            @click:append="search"
                    ></v-text-field>
                </v-col>
                <v-col lg="4" md="4" sm="4" xs="4">
                    <v-select
                            v-model="selectSortKey"
                            :items="sortObject"
                            item-text="displayName"
                            item-value="sortKey"
                            append-icon="mdi-sort"
                            label="Sort"
                            @change="changeSort()"
                    ></v-select>
                </v-col>
            </v-row>

            <v-row justify="center">
                <div v-if="loading" style="margin: auto;">
                    <div style="display:inline-block; padding-right: 15px;">loading...</div>
                    <div class="loading loading-content">
                        <v-icon large>fa-book</v-icon>
                    </div>
                </div>
                <div v-if="!loading && booksShow.length === 0 && selectFilter === null" style="margin: auto;padding: 20px;">
                    読みたい本を登録しましょう。
                </div>

                <v-col v-else
                       class="pa-2"
                       v-for="book in booksShow"
                       :key="book.id"
                       lg="4" md="6" sm="12" xs="12">
                    <v-hover>
                        <v-card
                                slot-scope="{ hover }"
                                :class="`elevation-${hover ? 12 : 2}`"
                                :to="{ name: 'bookDetail', params: { bookId: book.id }}"
                        >
                            <v-card-title style="font-size: 1.2em;">
                                <v-col align-self="center" class="ma-0 pa-0 bot-char">{{book.title}}</v-col>
                                <v-btn
                                        text
                                        icon
                                        color="dark">
                                    <v-icon large
                                            color="blue-grey darken-1"
                                    >{{ bookState(book.start_at, book.end_at).icon }}
                                    </v-icon>
                                </v-btn>
                            </v-card-title>
                            <v-card-text style="font-size: 1.0em;">
                                <v-col align-self="center" :class="{ noset_font: (book.author == null)}" class="ma-0 pa-0">
                                    {{ (book.author != null) ? book.author.name : "not set" }}
                                    ({{ (book.publisher != null) ? book.publisher.name : "not set" }})
                                </v-col>
                            </v-card-text>
                        </v-card>
                    </v-hover>
                </v-col>
            </v-row>

            <v-row>
                <v-col md="12" class="mt-2 mb-5 text-xs-center">
                    <v-pagination
                            v-model="page"
                            :length=totalPageNumber
                            :total-visible="7"
                            @input="pagenaite()"
                            color="#1e90ff"
                    ></v-pagination>
                </v-col>
            </v-row>

            <v-btn
                    fab
                    bottom
                    right
                    color="pink"
                    dark
                    fixed
                    @click="toRegister()">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-container>
<!--    </div>-->
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import api, {Book, errorRoute} from '@/api';

    interface BookShow extends Book {
        isOpen: boolean;
    }

    @Component
    export default class BooksView extends Vue {
        private booksShow: BookShow[] = [];
        private books: Book[] = [];
        private totalCount: number = 0;
        private page = 1;
        private perPage: number = 16;
        private loading: boolean = true;

        private createModalIsOpen: boolean = false;

        private sortObject = [
            {sortKey: 'updated_at', displayName: '更新日'},
            {sortKey: 'created_at', displayName: '作成日'},
            {sortKey: 'title', displayName: 'タイトル'},
            {sortKey: 'author_id', displayName: '作者'},
            {sortKey: 'publisher_id', displayName: '出版社'},
        ];
        private selectSortKey = '';
        private filterObject = [
            {filterKey: null, displayName: 'ALL'},
            {filterKey: 'not_read', displayName: '未読'},
            {filterKey: 'reading', displayName: '読中'},
            {filterKey: 'read', displayName: '読了'},
        ];
        private selectFilter: string | null = null;

        public mounted() {
            this.load(this.page, this.perPage, this.selectSortKey, this.selectFilter);
            toTop();
        }

        private load(page: number | null, perPage: number | null, sortKey: string | null, state: string | null) {
            this.booksShow = [];
            this.loading = true;
            api.books.list(page, perPage, sortKey, state, null)
                .then((response) => {
                    this.books = response.data.content.books as Book[];
                    this.totalCount = response.data.content.total_count as number;
                })
                .then(() => {
                    this.booksShow = this.books.map((book) => {
                        return {
                            id: book.id,
                            title: book.title,
                            author: book.author,
                            publishedAt: book.publishedAt,
                            accountId: book.accountId,
                            publisher: book.publisher,
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
                })
                .catch((err) => {
                    this.loading = false;
                    errorRoute(err.response.status, '/bookshelf');
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
                return { icon : 'mdi-bookmark', label : '読中' };
            } else {
                return { icon : 'mdi-check', label : '了読' };
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
            toTop();
        }

        private pagenaite() {
            this.load(this.page, this.perPage, this.selectSortKey, this.selectFilter);
            toTop();
        }

        get totalPageNumber() {
            // return Math.floor(this.booksShow.length / this.perPage) + 1
            return Math.floor(this.totalCount / this.perPage) + 1;
        }

        private toRegister() {
            this.$router.push('/register');
        }
    }
    function toTop() {
        window.scrollTo(0, 0);
    }

</script>

<style scoped>
    .bot-char {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .reverse{
        transform: scale(-1, 1);
    }
    .noset_font {
        color: grey;
    }
    .xs_height {
        min-height: 87vh;
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
