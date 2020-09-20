<template>
    <v-container v-bind:class="{ xs_height: $vuetify.breakpoint.xs }">
        <v-row justify="center" class="pa-0 pa-0">
            <v-col cols="12" class="ma-0 pa-0">
                <v-tabs bark
                        centered
                        grow
                        show-arrows
                        v-bind:class="[$vuetify.breakpoint.xs ? 'pr-0 pl-0 pt-3 pb-3' : 'pa-3']">
                    <v-tab class="pa-0 pb-3"
                            v-for="f in filterObject"
                            :key="f.displayName"
                            @change="changeFilter(f.filterKey)"
                            >
                        <span class="mr-2">{{ f.displayName }}</span><v-icon small>{{f.icon}}</v-icon>
                    </v-tab>
                </v-tabs>
            </v-col>
        </v-row>

        <v-row justify="center" class="pa-0">
            <v-col cols="12" class="ma-0 pb-2 pr-0 pl-0">
                <v-row class="ma-0">
                    <v-col cols="12" lg="6" md="6" sm="6"  class="pl-3 pr-3 pa-0">
                        <v-text-field
                                text
                                v-model="searchKeyForBook"
                                label="Title or Author or Publisher"
                                @click:append-outer="searchBook()"
                                append-outer-icon="mdi-magnify"
                                clear-icon="mdi-close-circle"
                                clearable
                                @click:clear="searchKeyRemove()">
                            <template v-slot:append-outer>
                                <v-tooltip
                                        bottom
                                >
                                    <template v-slot:activator="{ on }">
                                        <v-icon v-on="on" @click="searchBook()">mdi-magnify</v-icon>
                                    </template>
                                        検索
                                </v-tooltip>
                            </template>
                        </v-text-field>
                    </v-col>
                    <v-col cols=8 lg="4" md="4" sm="4" class="pl-3 pr-3 pa-0">
                        <v-select
                                v-model="selectSortKey"
                                :items="sortObject"
                                item-text="displayName"
                                item-value="sortKey"
                                append-icon="mdi-sort"
                                label="Sort"
                                @change="changeSort()"
                                return-object
                        ></v-select>
                    </v-col>
                    <v-col cols=4 lg="2" md="2" sm="2" class="pl-3 pr-3 pa-0">
                        <v-select
                                v-model="selectDisplayNumber"
                                :items="displayObject"
                                item-text="displayName"
                                item-value="displayValue"
                                append-icon="mdi-menu-down"
                                label="Display number"
                                @change="changePerPage()"
                                return-object
                        ></v-select>
                    </v-col>
                </v-row>
            </v-col>
        </v-row>

        <v-row justify="center">
            <div v-if="loading" class="loading-content">
                <div style="display:inline-block; padding-right: 15px;">loading...</div>
                <div class="loading">
                    <v-icon large>fa-book</v-icon>
                </div>
            </div>
            <div v-if="!loading && booksShow.length === 0 && selectStateFilter === null && searchKeyForBook === null" style="margin: auto;padding: 20px;height: 100%;">
                読みたい本を登録しましょう。
                <div align="center" class="ma-2">
                    <v-btn
                        outlined
                        @click="toRegister()">
                        本の追加<v-icon>mdi-plus</v-icon>
                    </v-btn>
                </div>
            </div>
            <v-col v-else cols="12" class="ma-0 pa-0">
                <v-row class="ma-0 pa-0 pb-3">
                    <v-col id="empty_book" class="ma-0 pa-0" align="center" style="font-size:0.875rem; color:  rgba(0, 0, 0, 0.6);">
                        <span>登録数:</span>
                        <span class="pl-2" style="font-size: 1.5em;">{{totalCount}}</span>
                    </v-col>
                </v-row>

                <transition-group row wrap class="row ma-0 pa-0" tag="div" name="fade-left">
                    <v-col v-for="book in booksShow"
                           :key="book.id"
                           cols="12" lg="4" md="6" sm="12"
                           v-bind:class="[$vuetify.breakpoint.xs ? 'pa-0 pt-0 pb-0' : 'pa-3 pt-2 pb-2']">
                        <v-hover>
                            <v-card
                                    slot-scope="{ hover }"
                                    @click="toBookDetail(book.id)"
                                    v-bind:class="[$vuetify.breakpoint.xs ? 'elevation-0' : ` elevation-${hover ? 12 : 2}`  ]">
                                <v-card-title style="font-size: 1.2em;padding-bottom: 0px;">
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
                                <v-card-text style="font-size: 0.8em;">
                                    <v-col align-self="center" :class="{ noset_font: (book.author == null)}" class="ma-0 pa-0">
                                        {{ (book.author != null) ? book.author.name : "not set" }}
                                        ({{ (book.publisher != null) ? book.publisher.name : "not set" }})
                                    </v-col>
                                </v-card-text>
                                <v-divider v-if="$vuetify.breakpoint.xs"></v-divider>
                            </v-card>
                        </v-hover>
                    </v-col>
                </transition-group>
            </v-col>
        </v-row>

        <v-row>
            <v-col cols=12 md="12" class="mt-2 mb-5 text-xs-center">
                <v-pagination
                        v-model="page"
                        :length=totalPageNumber
                        :total-visible="7"
                        @input="pagenaite()"
                        color="#1e90ff"
                ></v-pagination>
            </v-col>
        </v-row>
        <v-fab-transition>
            <v-btn
                    fab
                    right
                    color="pink"
                    dark
                    fixed
                    v-show="!hiddenFab"
                    style="bottom: 26px"
                    @click="toRegister()">
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-fab-transition>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import api, {Book, errorRoute, getToken} from '@/api';
    import {BaseComponent, toTop} from '@/utils/utils';

    interface BookShow extends Book {
        isOpen: boolean;
    }

    @Component
    export default class BooksView extends BaseComponent {
        private booksShow: BookShow[] = [];
        private books: Book[] = [];
        private totalCount: number = 0;
        private page = 1;
        private perPage: number = 20;
        private loading: boolean = true;

        private createModalIsOpen: boolean = false;
        private hiddenFab: boolean = true;

        private sortObject = [
            {sortKey: 'updated_at', displayName: '更新日'},
            {sortKey: 'created_at', displayName: '作成日'},
            {sortKey: 'title', displayName: 'タイトル'},
            {sortKey: 'author_id', displayName: '作者'},
            {sortKey: 'publisher_id', displayName: '出版社'},
        ];
        private selectSortKey = {sortKey: 'updated_at', displayName: '更新日'};
        private filterObject = [
            {filterKey: null, displayName: 'ALL', icon: ''},
            {filterKey: 'not_read', displayName: '未読', icon: 'fa-book'},
            {filterKey: 'reading', displayName: '読中', icon: 'mdi-bookmark'},
            {filterKey: 'read', displayName: '読了', icon: 'mdi-check'},
        ];
        private selectStateFilter: string | null = null;
        private displayObject = [
            {displayValue: 20, displayName: '20'},
            {displayValue: 30, displayName: '30'},
            {displayValue: 45, displayName: '45'},
        ];
        private selectDisplayNumber =  this.displayObject[0];

        private searchKeyForBook: string | null = null;

        public mounted() {
            super.mounted();
            this.load(this.page, this.perPage, this.selectSortKey.sortKey, this.selectStateFilter, this.searchKeyForBook);
        }

        private load(page: number | null, perPage: number | null, sortKey: string | null,
                     state: string | null, searchKeyForBook: string | null) {
            this.booksShow = [];
            this.loading = true;

            getToken()
                .then((token) => {
                    return api.books.list(token, page, perPage, sortKey, state, null, searchKeyForBook);
                })
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
                    errorRoute('books view: ' + err.toString());
                }).finally(() => {
                    this.hiddenFab = false;
                });
        }

        private searchBook() {
            this.page = 1;
            if (this.searchKeyForBook != null && this.searchKeyForBook !== '') {
                this.load(this.page, this.perPage, this.selectSortKey.sortKey, null, this.searchKeyForBook);
            }
        }

        private searchKeyRemove() {
            this.searchKeyForBook = null;
            this.load(this.page, this.perPage, this.selectSortKey.sortKey, this.selectStateFilter, this.searchKeyForBook);
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
            this.load(this.page, this.perPage, this.selectSortKey.sortKey, this.selectStateFilter, this.searchKeyForBook);
        }

        private changePerPage() {
            this.perPage = this.selectDisplayNumber.displayValue;
            this.load(this.page, this.perPage, this.selectSortKey.sortKey, this.selectStateFilter, this.searchKeyForBook);
            toTop();
        }

        private changeFilter(filter: string) {
            this.selectStateFilter = filter;
            this.page = 1;
            this.load(this.page, this.perPage, this.selectSortKey.sortKey, this.selectStateFilter, this.searchKeyForBook);
            toTop();
        }

        private pagenaite() {
            this.load(this.page, this.perPage, this.selectSortKey.sortKey, this.selectStateFilter, this.searchKeyForBook);
            toTop();
        }

        get totalPageNumber() {
            // return Math.floor(this.booksShow.length / this.perPage) + 1
            return Math.floor(this.totalCount / this.perPage) + 1;
        }

        private toBookDetail(id: number) {
            this.hiddenFab = true;
            this.$router.push('/bookshelf/' + id.toString());
        }
        private toRegister() {
            this.$router.push('/register');
        }
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


    .loading-content {
        position: fixed;
        top: 250px;
        z-index: 30;
        background-color: white;
        padding: 20px;
        color: gray;
    }

    .loading {
        display: inline-block;
        font-size: 3em;
        animation: r1 1s linear infinite;
    }

    @keyframes r1 {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
