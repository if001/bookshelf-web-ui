<template>
    <v-container style="min-height: 85vh;">
        <v-layout row wrap justify-space-around class="mb-3">
            <v-flex lg4 md5 xs12 class="ma-2">
                <v-card color="white" class="black--text">
                    <v-layout row>
                        <v-flex xs9>
                            <v-card-title primary-title class="">
                                <div v-if="!isOpen">
                                    <div style="font-size: 1.5em;">{{ bookName }}</div>
                                    <div>{{ authorNameForShow }} </div>
                                    <div>{{ publisherNameForShow }} </div>
                                    <!-- TODO 出版年はひとまず消す <div>(2013)</div>-->
                                </div>
                                <div v-if="isOpen">
<!--                                    一旦編集機能はなし-->
<!--                                    <v-form ref="form"-->
<!--                                            v-model="validEditBox"-->
<!--                                            lazy-validation>-->
<!--                                        <div class="pt-1" style="width: 100%">-->
<!--                                            <v-text-field-->
<!--                                                    v-model="bookName"-->
<!--                                                    maxlength="40"-->
<!--                                                    :counter="40"-->
<!--                                                    height="18"-->
<!--                                                    label="Book Title"-->
<!--                                            ></v-text-field>-->
<!--                                        </div>-->
<!--                                        <div class="pt-1" style="width: 100%">-->
<!--                                            <v-combobox-->
<!--                                                    v-model="authorNameForShow"-->
<!--                                                    :items="getAuthors"-->
<!--                                                    maxlength="40"-->
<!--                                                    :counter="40"-->
<!--                                                    height="18"-->
<!--                                                    label="author"-->
<!--                                            ></v-combobox>-->
<!--                                        </div>-->
<!--                                    </v-form>-->
<!--                                    <div class="pt-1" style="width: 100%">-->
<!--                                        <v-text-field-->
<!--                                                :counter="15"-->
<!--                                                height="18"-->
<!--                                                label="Publisher"-->
<!--                                        ></v-text-field>-->
<!--                                    </div>-->
                                    <div class="pt-1" style="width: 100%">
                                        <v-btn class="ma-0"
                                               outline
                                               small
                                               color="error"
                                               @click="deleteBook()">
                                            本の削除<v-icon small color="red darken-2">delete</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                                <v-btn v-if="!isOpen && !isLoadingBook"
                                       icon
                                       fab
                                       dark
                                       color="blue"
                                       small
                                       @click="isOpen=!isOpen"
                                       style="position:absolute; top: 80px; right: 85px;">
                                    <v-icon small dark>edit</v-icon>
                                </v-btn>
                                <v-btn v-if="!isOpen && isLoadingBook"
                                       icon
                                       fab
                                       color="blue"
                                       small
                                       disabled
                                       style="position:absolute; top: 80px; right: 85px;">
                                    <v-icon small dark>edit</v-icon>
                                </v-btn>
                                <v-btn v-if="isOpen && !isLoadingBook"
                                       icon
                                       fab
                                       dark
                                       color="blue"
                                       small
                                       @click="isOpen=!isOpen"
                                       style="position:absolute; top: 80px; right: 85px;">
                                    <v-icon small dark>done</v-icon>
                                </v-btn>
                                <v-btn v-if="isOpen && !isLoadingBook && isBookEdit()"
                                       icon
                                       fab
                                       dark
                                       color="green"
                                       small
                                       :loading="isUpdatingBook"
                                       @click="updateBookWithDetail"
                                       style="position:absolute; top: 80px; right: 85px;">
                                    <v-icon small dark>done</v-icon>
                                </v-btn>
                            </v-card-title>
                        </v-flex>
                        <v-flex xs3 style="height: 128px;">
                            <div v-if="bookImage != null && bookImage !== ''">
                                <a :href="bookDetail.affiliate_url" target="_blank">
                                    <img style="float:right;" :src="bookImage" height="128px" alt="bookImage">
                                </a>
                            </div>
                            <div v-else>
                                <img src="@/assets/not_found.png" alt="not_found" height="128px">
                            </div>

                        </v-flex>
                    </v-layout>
                    <v-divider light></v-divider>
<!--                    <v-layout column>-->
                    <v-layout nowrap class="pa-2" align-center>
                        <v-flex lg3 md3 sm4 xs4>
                            <v-layout align-center row>
                                <v-flex lg4 md4 sm4 xs4>
                                    <v-btn flat
                                           icon
                                           color="dark"
                                           class="ma-0"
                                           :loading="isLoadingBookState"
                                           @click="changeState(startAt, endAt)">
                                        <v-icon large
                                                color="blue-grey darken-1"> {{ bookState(startAt, endAt).icon }}
                                        </v-icon>
                                    </v-btn>
                                </v-flex>
                                <v-flex lg8 md8 sm8 xs8>
                                    <div class="pl-3" style="display: inline;">{{ bookState(startAt, endAt).label }} </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>

                        <v-flex lg9 md9 sm8 xs8 v-if="!isOpen" style="color: gray;">
                            <v-layout row wrap justify-center>
                                <v-flex lg5 md5 sm12 xs12>
                                    <div style="text-align: center;">
                                        {{formatNullDate(startAtFormatted)}}
                                    </div>
                                </v-flex>
                                <v-flex lg2 md2 sm12 xs12>
                                    <div style="text-align: center;">
                                        〜
                                    </div>
                                </v-flex>
                                <v-flex lg5 md5 sm12 xs12>
                                    <div style="text-align: center;">
                                        {{formatNullDate(endAtFormatted)}}
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>

                        <v-flex lg9 md9 sm8 xs8 v-else style="color: gray;">
                            <v-layout row wrap justify-center>
                                <v-flex lg5 md5 sm12 xs12>
                                    <v-icon small @click="isOpenDatePicker=!isOpenDatePicker">event</v-icon>
                                    <div class="text-center" style="text-align: center; display: inline;">
                                        {{formatNullDate(startAtDatePicker)}}
                                    </div>
                                </v-flex>
                                <v-flex lg2 md2 sm12 xs12>
                                    <div style="text-align: center;">
                                        〜
                                    </div>
                                </v-flex>
                                <v-flex lg5 md5 sm12 xs12>
                                    <div style="text-align: center;">
                                        {{formatNullDate(endAtFormatted)}}
                                    </div>
                                </v-flex>
                            </v-layout>
                        </v-flex>
                        <div v-if="isOpen && isOpenDatePicker">
                            <v-menu
                                    ref="menu"
                                    v-model="isOpenDatePicker"
                                    :close-on-content-click="false"
                                    :return-value.sync="startAtDatePicker"
                                    transition="scale-transition"
                                    offset-y
                                    full-width
                                    min-width="290px"
                            >
                                <v-date-picker
                                        v-model="startAtDatePicker"
                                        no-title
                                        :max="maxStartAt()"
                                        scrollable
                                        @input="isOpenDatePicker = false">
                                    <v-spacer></v-spacer>
                                    <v-btn text color="primary" @click="isOpenDatePicker = false">OK</v-btn>
                                </v-date-picker>
                            </v-menu>
                        </div>

                    </v-layout>

                    <v-divider light></v-divider>

                    <v-layout column justify-end class="pr-2 pl-2 pt-1 pb-1">
<!--                        <v-flex lg3 md3 ms3 xs3 offset-lg9 offset-md9 offset-ms9 offset-xs9>-->
                        <v-flex lg4 md4 ms4 xs4>
                            <div v-if="createTwitterURL() != null" class="twitter-link share-button">
                                <a :href="createTwitterURL()"
                                   onClick="window.open(encodeURI(decodeURI(this.href)), 'tweetwindow', 'width=650, height=470, personalbar=0, toolbar=0, scrollbars=1, sizable=1'); return false;"
                                   rel="nofollow"
                                   style="text-decoration:none;">
                                    <img src="@/assets/twitter-icon-96.png" alt="twittericon" height="24px" style="vertical-align: middle; ">
                                    Share
                                </a>
                            </div>
                            <div v-else class="twitter-link-disable share-button">
                                <img src="@/assets/twitter-icon-96-disable.png" alt="twittericon" height="24px" style="vertical-align: middle; padding: 2px">
                                Share
                            </div>
                        </v-flex>
                    </v-layout>

                        <!-- TODO Ratingはひとまずつけない -->
                        <!--<v-divider light></v-divider>-->
                        <!--<v-card-actions class="pl-3 pb-2 pt-2">-->
                            <!--Rate this book-->
                            <!--<v-spacer></v-spacer>-->
                            <!--<v-rating v-model="rating"-->
                                      <!--color="yellow darken-3"-->
                                      <!--background-color="grey darken-1"-->
                                      <!--half-increments-->
                                      <!--hover-->
                                      <!--class="mb-0 mr-2 ml-2 mt-2"-->
                                      <!--:size=ratingSize-->
                            <!--&gt;</v-rating>-->
                        <!--</v-card-actions>-->

                        <!-- TODO カテゴリ機能はひとまずつけない -->
                        <!--<v-divider light></v-divider>-->
                        <!--<v-flex class="pl-3 pt-2 pb-2">-->
                            <!--<div class="pa-1">カテゴリ-->
                                <!--<v-btn flat-->
                                       <!--icon-->
                                       <!--color="dark"-->
                                       <!--small-->
                                       <!--v-on:click="openFlag.category = !openFlag.category">-->
                                    <!--<v-icon small color="blue-grey darken-3">-->
                                        <!--{{ openFlag.category ? 'done' : 'edit' }}-->
                                    <!--</v-icon>-->
                                <!--</v-btn>-->
                            <!--</div>-->
                            <!--<div v-if="openFlag.category" style="padding: 10px;padding-top: 0;">-->
                                <!--<v-text-field-->
                                        <!--counter="10"-->
                                        <!--maxlength="10"-->
                                        <!--label="label"-->
                                        <!--style="width:40%"-->
                                        <!--v-model="inputCategory"-->
                                        <!--v-on:keydown.enter="appendCategory"-->
                                <!--&gt;</v-text-field>-->
                                <!--<div class="warning-font">{{msg}}</div>-->
                            <!--</div>-->

                            <!--<div>-->
                                <!--<div style="display: flex; flex-wrap: wrap;">-->
                                    <!--<div class="ma-0;width:auto;" v-for="category in getCategories">-->
                                        <!--<v-chip v-if="!openFlag.category"-->
                                                <!--v-model="category.chip"-->
                                                <!--color="blue lighten-1"-->
                                                <!--outline-->
                                                <!--text-color="black">{{ category.name }}-->
                                        <!--</v-chip>-->
                                        <!--<v-chip v-else-->
                                                <!--v-model="category.chip"-->
                                                <!--close-->
                                                <!--color="red"-->
                                                <!--outline-->
                                                <!--text-color="black"-->
                                        <!--&gt;{{ category.name }}-->
                                        <!--</v-chip>-->
                                    <!--</div>-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</v-flex>-->

                </v-card>
            </v-flex>
            <BookDescription
                    :bookID="bookID"
            ></BookDescription>
        </v-layout>
        <v-btn
                fab
                bottom
                right
                color="blue"
                dark
                fixed
                @click="toListPage()">
            <v-icon>arrow_back</v-icon>
        </v-btn>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import BookDescription from '@/components/BookDescriptionComponent.vue';
    import api, {Author, Book, Category, ContentResult, Description, errorRoute, Publisher} from '../api';
    import moment from 'moment';
    import {AxiosPromise} from 'axios';

    interface BookDetail extends Book {
        isOpen: boolean;
    }

    interface CategoryWithChip extends Category {
        chip: boolean;
    }

    @Component({
        components: {
            BookDescription,
        },
    })
    export default class BookDetailView extends Vue {
        private book: Book | null = null;
        private bookMount: BookDetail | null = null;
        private bookDetail: BookDetail | null = null;
        // private categories: Category[] = [];
        private authors: Author[] = [];

        // private rating = 0;
        private isOpen: boolean = false;
        private isOpenDatePicker: boolean = false;
        private isLoadingBook: boolean = false;
        private isLoadingBookState: boolean = false;
        private isUpdatingBook: boolean = false;
        private validEditBox: boolean = false;


        private rules: any =  {
            counter12: (value: any) => value.length <= 12 || 'Max 12 characters',
            counter15: (value: any) => value.length <= 15 || 'Max 15 characters',
        };

        private createTwitterURL(): string | null {
            if (this.bookDetail == null) {
                return '';
            } else {
                const base = 'https://twitter.com/intent/tweet';

                const state = this.bookState(this.bookDetail.start_at, this.bookDetail.end_at);
                let url = '';

                let text = '';
                let bookInfo = '';
                let bookURL = '';
                let hashTag = '';

                if (state.label === '未読') {
                    text = 'を読み始めた本に登録しました。';
                } else if (state.label === '読中') {
                    text = 'を読書中です。';
                } else if (state.label === '読了') {
                    text = 'を読み終わりました。';
                    hashTag = state.label;
                } else {
                    return null;
                }

                bookInfo = this.bookDetail.title;
                if (this.bookDetail.author != null) {
                    bookInfo += '(' + this.bookDetail.author.name + ')'
                }

                if (this.bookDetail.affiliate_url != null) {
                    bookURL = this.bookDetail.affiliate_url;
                }

                url = base + '?text=' + ' [' + bookInfo + '] ' + text + '&hashtags=' + hashTag + ',読書' + '&url=' + bookURL;
                return url;
            }
        }

        private mounted() {
            this.bookMount = null;
            // this.categories = [];
            // this.loadAuthors();
            this.loadBookDetail().then(() => this.isLoadingBook = false);
        }

        private loadBookDetail(): Promise<boolean> {
            return new Promise((resolve, reject) => {
                this.isLoadingBook = true;
                api.book.get(this.bookID)
                    .then((response) => {
                        this.book = response.data.content as Book;
                    })
                    .then(() => {
                        if (this.book == null) {
                            return reject(false);
                        }

                        // TODO カテゴリは一旦off
                        // if (this.book.categories != null) {
                        //     for (const category of this.book.categories) {
                        //         const c: Category = category;
                        //         const newC = {
                        //             id: c.id,
                        //             name: c.name,
                        //             chip: true,
                        //         } as CategoryWithChip;
                        //         this.categories.push(newC);
                        //     }
                        // }
                        this.bookMount = {
                            id: this.book.id,
                            title: this.book.title,
                            author: this.book.author,
                            publishedAt: this.book.publishedAt,
                            accountId: this.book.accountId,
                            publisher: this.book.publisher,
                            start_at: this.book.start_at,
                            end_at: this.book.end_at,
                            nextBookId: this.book.nextBookId,
                            prevBookId: this.book.prevBookId,
                            // categories: this.categories,
                            medium_image_url: this.book.medium_image_url,
                            small_image_url: this.book.small_image_url,
                            item_url: this.book.item_url,
                            affiliate_url: this.book.affiliate_url,
                            created_at: this.book.created_at,
                            updated_at: this.book.updated_at,
                            isOpen: false,
                        } as BookDetail;
                        this.copyValue();
                        resolve(true);
                    })
                    .catch((err) => {
                        console.log('load book error');
                        errorRoute(err.response.status, '/bookshelf');
                    })
                    .finally(() => {
                        this.isLoadingBook = false;
                    });
            });
        }

        private loadAuthors(): Promise<boolean> {
            return new Promise((resolve, reject) => {
            api.author.getCounted()
                .then((res) => {
                    this.authors = res.data.content as Author[];
                    resolve(true);
                })
                .catch(() => {
                    console.log('load author error');
                    reject(false);
                });
            });
        }

        get bookID(): number {
            return parseInt(this.$route.params.bookId, 10);
        }

        private copyValue() {
            let authorCopy: Author | null = null;
            if (this.bookMount != null) {
                // TODO カテゴリは一旦消す
                // if (this.bookDetailShow.categories != null) {
                //     for (const category of this.bookDetailShow.categories) {
                //         const c: Category = category;
                //         const newC = {
                //             id: c.id,
                //             name: c.name,
                //             chip: true,
                //         } as CategoryWithChip;
                //         this.categories.push(newC);
                //     }
                // }

                this.bookDetail = {...this.bookMount};
            }
        }

        get bookName(): string {
            if (this.bookDetail != null) {
                return this.bookDetail.title;
            } else {
                return 'Title not set';
            }
        }

        set bookName(v: string) {
            if (this.bookMount != null) {
                this.bookMount.title = v;
            }
        }

        get authorNameForShow() {
            if (this.bookDetail != null) {
                if (this.bookDetail.author != null) {
                    return this.bookDetail.author.name;
                } else {
                    return 'Author not set';
                }
            } else {
                return 'Author not set';
            }
        }
        set authorNameForShow(v: string) {
            const tmpAuthor = {
                id: 0,
                name: v,
            } as Author;
            if (this.bookDetail != null) {
                this.bookDetail.author = tmpAuthor;
            }
        }

        get authorNameForUpdate() {
            if (this.bookMount != null) {
                if (this.bookMount.author != null) {
                    return this.bookMount.author.name;
                } else {
                    return 'Author not set';
                }
            } else {
                return 'Author not set';
            }
        }

        get publisherNameForShow() {
            if (this.bookDetail != null) {
                if (this.bookDetail.publisher != null) {
                    return this.bookDetail.publisher.name;
                } else {
                    return 'Publisher not set';
                }
            } else {
                return 'Publisher not set';
            }
        }

        set publisherNameForShow(v: string) {
            const tmpPublisher = {
                id: 0,
                name: v,
            } as Publisher;
            if (this.bookDetail != null) {
                this.bookDetail.publisher = tmpPublisher;
            }
        }

        get publisherNameForUpdate() {
            if (this.bookMount != null) {
                if (this.bookMount.publisher != null) {
                    return this.bookMount.publisher.name;
                } else {
                    return 'Publisher not set';
                }
            } else {
                return 'Publisher not set';
            }
        }

        get startAtFormatted() {
            if (this.bookDetail != null) {
                return formatDate(this.bookDetail.start_at);
            } else {
                return null;
            }
        }

        get endAtFormatted() {
            if (this.bookDetail != null) {
                return formatDate(this.bookDetail.end_at);
            } else {
                return null;
            }
        }

        private maxStartAt(): string {
            if (this.bookDetail != null && this.bookDetail.end_at != null) {
                return this.bookDetail.end_at.substring(0, 10);
            } else {
                return new Date().toISOString().substring(0, 10);
            }
        }

        get startAtDatePicker() {
            if (this.bookDetail != null && this.bookDetail.start_at != null) {
                return this.bookDetail.start_at.substring(0, 10);
            } else {
                return '';
            }
        }

        set startAtDatePicker(date: string) {
            if (this.bookDetail != null && date != '') {
                this.bookDetail.start_at = date;
            }
        }

        get bookImage(): string | null {
            if (this.bookDetail != null) {
                    return this.bookDetail.medium_image_url;
            } else {
                return null;
            }
        }

        private isBookEdit(): boolean {
            if (this.bookMount != null && this.bookDetail != null) {
                const isBookChange = (this.bookMount.title !== this.bookDetail.title);
                const isAuthorChange = (this.authorNameForShow !== this.authorNameForUpdate);
                let isDateChange = false;
                if (this.bookMount.start_at != null && this.bookDetail.start_at != null) {
                    isDateChange = (this.bookMount.start_at.substring(0, 10) !== this.bookDetail.start_at.substring(0, 10));
                }
                if (this.bookMount.start_at === null && this.bookDetail.start_at != null) {
                    isDateChange = true;
                }
                return (isBookChange || isAuthorChange || isDateChange);
            } else {
                return false;
            }
        }

        private updateBookWithDetail() {
            //if (this.validateInput()  && this.bookMount != null) {
            if (this.bookMount != null && this.bookDetail != null) {
                if (this.isBookEdit()) {
                    this.isUpdatingBook = true;
                    const authorID: number | null = this.bookMount.author != null ? this.bookMount.author.id : null;
                    const publisherID: number | null = this.bookMount.publisher != null ? this.bookMount.publisher.id : null;

                    let startAt: string | null = null;
                    if (this.bookDetail.start_at != null) {
                        startAt = new Date(this.bookDetail.start_at).toISOString();
                    }
                    let endAt: string | null = null;
                    if (this.bookDetail.end_at != null) {
                        endAt = new Date(this.bookDetail.end_at).toISOString();
                    }

                    const book = {
                        id: this.bookMount.id,
                        title: this.bookMount.title,
                        author_id: authorID,
                        publisher_id: publisherID,
                        start_at: startAt,
                        end_at: endAt,
                    };
                    api.books.update(book)
                        .then((res) => {
                            this.bookMount = null;
                            // this.categories = [];
                        })
                        .then(() => {
                            return this.loadBookDetail();
                        })
                        .then(() => {
                            this.isUpdatingBook = false;
                            this.isLoadingBook = false;
                            this.isOpen = false;
                        })
                        // .then(() => { // TODO 編集機能OFFのためロードしない
                        //     return this.loadAuthors();
                        // })
                        .catch((err) => {
                            console.log('book create error');
                            this.errorRouteAtDetail(err.response.status);
                        });
                }
            }
        }

        get getAuthors() {
            const authorNames: string[] = [];
            this.authors.forEach((x) => {
                if (x.count > 3) {
                    authorNames.push(x.name);
                }
            });
            return authorNames;
        }

        private getAuthorIDByName(name: string): number {
            let id = 0;
            this.authors.forEach((x: Author) => {
                if (name === x.name) {
                    id = x.id;
                }
            });
            return id;
        }

        // TODO カテゴリは一旦消す
        // private appendCategory(event: any) {
        //     if (event.keyCode !== 13) {
        //         return;
        //     }
        //     if (this.bookDetail == null) {
        //         return;
        //     }
        //     const len = this.inputCategory.length;
        //     if (len === 0) {
        //         this.msg = 'no input!';
        //     } else if (len > 10) {
        //         this.msg = 'too many input!';
        //     } else {
        //         this.bookDetail.categories.push(
        //             {
        //                 id: 0,
        //                 name: this.inputCategory,
        //                 chip: true,
        //             }  as CategoryWithChip,
        //         );
        //         this.inputCategory = '';
        //         this.msg = '';
        //         this.openFlag.category = false;
        //     }
        // }

        get startAt() {
            if (this.bookDetail == null) {
                return null;
            } else {
                return this.bookDetail.start_at;
            }
        }

        get endAt() {
            if (this.bookDetail == null) {
                return null;
            } else {
                return this.bookDetail.end_at;
            }
        }

        private changeState(startAt: string | null, endAt: string | null) {
            let msg = '';
            if (startAt == null && endAt == null) {
                this.doChangeStateAPI('読み始めた本に設定しますか？', api.book.startRead);
            } else if (startAt != null && endAt == null) {
                this.doChangeStateAPI('読み終わった本に設定しますか？', api.book.endRead);
            } else if (startAt != null && endAt != null) {
                this.doChangeStateAPI('読み始めた本に設定しますか？', api.book.startRead);
            } else {
                console.log('bad read state');
            }
        }

        private doChangeStateAPI(msg :string, apiFunc: (id: number) => AxiosPromise<ContentResult<Book>>) {
            const res = confirm(msg);
            if (res && this.bookDetail != null) {
                this.isLoadingBookState = true;
                apiFunc(this.bookDetail.id)
                    .then(() => {
                        return this.loadBookDetail();
                    })
                    .then(() => {
                        this.isLoadingBook = false;
                        this.isLoadingBookState = false;
                    })
                    .catch((err) => {
                        this.errorRouteAtDetail(err.response.status);
                    });
            }
        }

        private bookState(startAt: string | null, endAt: string | null) {
            if (endAt == null && startAt == null) {
                return { icon : 'fa-book', label : '未読' };
            } else if (endAt == null) {
                return  { icon : 'bookmark', label : '読中' };
            } else {
                return  { icon : 'done', label : '読了' };
            }
        }

        private validateInput(): boolean {
            return (this.$refs.form as Vue & { validate: () => boolean }).validate();
        }

        private deleteBook() {
            const ans = confirm('関連するコメントも全て削除されます。本を削除しますか?');
            if (ans && this.bookDetail != null) {
                api.book.delete(this.bookDetail.id).then((res) => {
                    // console.log(res);
                    this.$router.push('/bookshelf');
                }).catch((err) => {
                    console.log('delete book error');
                    errorRoute(err.response.status, '/bookshelf');
                });
            }
        }

        private toListPage() {
            this.$router.push('/bookshelf');
        }
        private formatNullDate(d: string | null) {
            if (d === null || d === '') {
                return '----/--/--';
            } else {
                return d;
            }
        }
        private errorRouteAtDetail(status: number) {
            if (this.bookMount != null) {
                errorRoute(status, '/bookshelf/' + this.bookMount.id);
            } else {
                errorRoute(status, '/bookshelf');
            }
        }

    }
    function formatDate(d: string | null): string | null {
        if (d != null) {
            const date = moment(d);
            return date.format('YYYY') + '/' + date.format('MM') + '/' + date.format('DD');
        } else {
            return null;
        }
    }


</script>

<style scoped>
    .loading {
        display: inline-block;
        /*font-size: 3em;*/
    }

    .loading-content {
        animation: r1 1s linear infinite;
    }

    @keyframes r1 {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }

    .twitter-link {
        font-size: 0.9em;
        margin: 5px;
        padding-left: 8px;
        padding-right: 8px;
        font-weight: bold;
        color: #03a9f4;/*文字色*/
        background: #FFF;
        border: solid 1px #03a9f4;/*線*/
        border-radius: 10px;/*角の丸み*/
    }
    .twitter-link-disable {
        font-size: 0.9em;
        margin: 5px;
        padding-left: 8px;
        padding-right: 8px;
        font-weight: bold;
        color: gray;/*文字色*/
        background: #FFF;
        border: solid 1px gray;/*線*/
        border-radius: 10px;/*角の丸み*/
    }

    .share-button {
        width: 80px;
    }
    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
