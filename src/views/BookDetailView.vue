<template>
    <v-container style="min-height: 87vh;">
        <v-row class="mb-3" justify="space-around" v-bind:class="[brackPointIsXS() ? 'ma-0' : 'ma-2' ]">
            <v-col cols=12 lg=4 md=5 class="ma-0 pa-0 pt-2 pb-2">
                <v-card color="white" v-bind:class="[brackPointIsXS() ? 'elevation-0' : ` elevation-${hover ? 12 : 2}`  ]">
                    <v-row no-gutters>
                        <v-col cols=8 class="pa-3 ma-0">
                            <v-row v-if="!isOpen">
                                <v-col cols="12" class="pa-1 pl-3" style="font-size: 1.2em;">{{ bookName }}</v-col>
                                <v-col cols="12" class="pa-1 pl-3" style="font-size: 0.8em;">{{ authorNameForShow }} </v-col>
                                <v-col cols="12" class="pa-1 pl-3" style="font-size: 0.8em;">{{ publisherNameForShow }} </v-col>
                                <!-- TODO 出版年はひとまず消す <div>(2013)</div>-->
                            </v-row>
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
                                               outlined
                                               small
                                               color="error"
                                               @click="deleteBook()">
                                            本の削除<v-icon small color="red darken-2">mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </div>
                            <v-btn v-if="!isOpen && !isLoadingBook"
                                   dark
                                   fab
                                   color="blue"
                                   small
                                   @click="isOpen=!isOpen"
                                   style="position:absolute; top: 80px; right: 90px;">
                                <v-icon small dark>mdi-border-color</v-icon>
                            </v-btn>
                            <v-btn v-if="!isOpen && isLoadingBook"
                                   fab
                                   color="blue"
                                   small
                                   disabled
                                   style="position:absolute; top: 80px; right: 90px;">
                                <v-icon small dark>mdi-border-color</v-icon>
                            </v-btn>
                            <v-btn v-if="isOpen && !isLoadingBook"
                                       fab
                                       dark
                                       color="blue"
                                       small
                                       @click="isOpen=!isOpen"
                                       style="position:absolute; top: 80px; right: 90px;">
                                    <v-icon small dark>mdi-close</v-icon>
                                </v-btn>
                            <v-btn v-if="isOpen && !isLoadingBook && isBookEdit()"
                                       fab
                                       dark
                                       color="green"
                                       small
                                       :loading="isUpdatingBook"
                                       @click="updateBookWithDetail"
                                       style="position:absolute; top: 80px; right: 130px;">
                                    <v-icon small dark>mdi-check</v-icon>
                                </v-btn>
                        </v-col>
                        <v-col cols=4 style="height: 128px;">
                            <div v-if="bookImage != null && bookImage !== '' && bookForShow.affiliate_url !== null">
                                <a :href="bookForShow.affiliate_url" target="_blank">
<!--                                    <img style="float:right;" :src="bookImage" height="128px" alt="bookImage">-->
                                    <v-tooltip bottom>
                                              <template v-slot:activator="{ on }">                                                  
                                                <img :src="bookImage" 
                                                    v-on="on"
                                                    style="float:right;" height="128px" alt="bookImage">
                                                </template>
                                              <span style="font-size: 0.9em">詳細を見る</span>
                                    </v-tooltip>
                                </a>
                            </div>
                            <div v-else>
                                <img src="@/assets/not_found.png" alt="not_found" height="128px" style="float:right;">
                            </div>

                        </v-col>
                    </v-row>

                    <v-divider light></v-divider>

                    <v-row class="ma-0 pa-2" justify="center" no-gutters>

                        <v-col cols=4 class="ma-0 pa-2" align-self="center">
                            <v-row no-gutters>
                                <v-col cols=3 class="ma-0 pa-0" align-self="center">
                                    <v-tooltip top>
                                              <template v-slot:activator="{ on }">                                                  
                                                    <v-btn text
                                                            icon
                                                            color="dark"
                                                            class="ma-0"
                                                            v-on="on"
                                                            :loading="isLoadingBookState"
                                                            @click="changeState(startAt, endAt)">
                                                    <v-icon large
                                                        color="blue-grey darken-1"> {{ bookState(startAt, endAt).icon }}
                                                    </v-icon>
                                                    </v-btn>
                                              </template>
                                             <span style="font-size: 0.9em">状態を変更する</span>
                                    </v-tooltip>

                                </v-col>
                                <v-col cols=9 class="ma-0 pl-3" align-self="center">
                                    {{ bookState(startAt, endAt).label }}
                                </v-col>
                            </v-row>
                        </v-col>

                        <v-col cols=8 class="ma-0 pa-0" style="color: gray;" align-self="center">
                            <v-row v-if="!isOpen" no-gutters justify="center" class="pa-0" style="text-align: center;">
                                <v-col cols=12 lg="5" md="5" align-self="center" class="ma-0 pa-1">
                                    {{formatNullDate(startAtFormatted)}}
                                </v-col>
                                <v-col cols=12 lg="2" md="2" align-self="center" class="ma-0 pa-1">
                                    〜
                                </v-col>
                                <v-col cols=12 lg="5" md="5" align-self="center" class="ma-0 pa-1">
                                    {{formatNullDate(endAtFormatted)}}
                                </v-col>
                            </v-row>
                            <v-row v-else no-gutters justify="center" class="pa-0" style="text-align: center;">
                                <v-col cols=12 lg="5" md="5" align-self="center" class="ma-0 pa-1">
                                    <v-icon small @click="isOpenDatePicker=!isOpenDatePicker">mdi-calendar</v-icon>
                                    {{formatNullDate(startAtDatePicker)}}
                                </v-col>
                                <v-col cols=12 lg="2" md="2" align-self="center" class="ma-0 pa-1">
                                    〜
                                </v-col>
                                <v-col cols=12 lg="5" md="5" align-self="center" class="ma-0 pa-1">
                                    {{formatNullDate(endAtFormatted)}}
                                </v-col>
                            </v-row>
                        </v-col>

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

                    </v-row>

                    <v-divider light></v-divider>

                    <v-row column justify-end class="ma-0 pr-2 pl-2 pt-1 pb-1" v-if="!isOpen">
                        <v-col class="pa-0" cols="4">
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
                        </v-col>
                    </v-row>
                    <v-divider light></v-divider>
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
            </v-col>
            <v-col xs="12" md="6" class="ma-0 pa-0 pt-2 pb-2" style="min-height: 35vh">
                <BookDescription
                        :bookID="bookID"
                ></BookDescription>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <div style="width: 100%;" align="center">
                    <ad :medium="true" :small="$vuetify.breakpoint.xs"></ad>
                </div>
            </v-col>
        </v-row>
        <v-fab-transition>
            <v-btn
                    fab
                    right
                    color="blue"
                    dark
                    fixed
                    v-show="!hiddenFab"
                    style="bottom: 26px"
                    @click="toListPage()">
                <v-icon>mdi-arrow-left</v-icon>
            </v-btn>
        </v-fab-transition>
    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import BookDescription from '@/components/BookDescriptionComponent.vue';
    import api, {Author, Book, Category, ContentResult, getToken, errorRoute, Publisher} from '../api';
    import moment from 'moment';
    import {AxiosPromise} from 'axios';
    import AdComponent from '@/components/AdComponent.vue';

    interface BookDetail extends Book {
        isOpen: boolean;
    }

    interface CategoryWithChip extends Category {
        chip: boolean;
    }

    @Component({
        components: {
            BookDescription,
            ad: AdComponent,
        },
    })
    export default class BookDetailView extends Vue {
        private book: Book | null = null;
        private bookForShow: BookDetail | null = null; // 表示する方
        private bookForEdit: BookDetail | null = null; // 書き換える方
        // private categories: Category[] = [];
        private authors: Author[] = [];

        // private rating = 0;
        private isOpen: boolean = false;
        private isOpenDatePicker: boolean = false;
        private isLoadingBook: boolean = false;
        private isLoadingBookState: boolean = false;
        private isUpdatingBook: boolean = false;
        private validEditBox: boolean = false;
        private hiddenFab: boolean = true;

        private rules: any =  {
            counter12: (value: any) => value.length <= 12 || 'Max 12 characters',
            counter15: (value: any) => value.length <= 15 || 'Max 15 characters',
        };

        private createTwitterURL(): string | null {
            if (this.bookForEdit == null) {
                return '';
            } else {
                const base = 'https://twitter.com/intent/tweet';

                const state = this.bookState(this.bookForEdit.start_at, this.bookForEdit.end_at);
                let text = '';
                let bookInfo = '';
                let bookURL = '';
                let hashTag = '読書';

                if (state.label === '未読') {
                    text = 'を読み始めた本に登録しました。%0a';
                } else if (state.label === '読中') {
                    text = 'を読書中です。%0a';
                } else if (state.label === '読了') {
                    text = 'を読み終わりました。%0a';
                    hashTag = ',' + state.label;
                } else {
                    return null;
                }

                bookInfo = this.bookForEdit.title;
                if (this.bookForEdit.author != null) {
                    bookInfo += '(' + this.bookForEdit.author.name + ')';
                }
                if (this.bookForEdit.affiliate_url != null) {
                    bookURL = 'https://bookstorage.edgwbs.net/share/' + this.bookForEdit.id.toString();
                    // bookURL = this.bookForEdit.affiliate_url;
                }
                return base + '?text=' + ' [' + bookInfo + '] ' + text + '&hashtags=' + hashTag + '&url=' + bookURL;
            }
        }

        private mounted() {
            window.scrollTo(0, 0);
            this.bookForEdit = null;
            this.bookForShow = null;
            // this.categories = [];
            // this.loadAuthors();
            this.loadBookDetail().then(() => this.isLoadingBook = false);
        }

        private loadBookDetail(): Promise<boolean> {
            return new Promise((resolve, reject) => {
                this.isLoadingBook = true;
                getToken()
                    .then((token) => {
                        return api.book.get(token, this.bookID);
                    })
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

                        this.bookForShow = {
                            ...this.book,
                            isOpen: false,
                        } as BookDetail;
                        this.copyValue();
                        resolve(true);
                    })
                    .catch((err) => {
                        errorRoute('book detail view: ' + err.toString());
                    })
                    .finally(() => {
                        this.isLoadingBook = false;
                        this.hiddenFab = false;
                    });
            });
        }

        private loadAuthors(): Promise<boolean> {
            return new Promise((resolve, reject) => {
                getToken()
                    .then((token) => {
                        return api.author.getCounted(token);
                    })
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
            // let authorCopy: Author | null = null;
            if (this.bookForShow != null) {
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

                this.bookForEdit = {...this.bookForShow};
            }
        }

        get bookName(): string {
            if (this.bookForShow != null) {
                return this.bookForShow.title;
            } else {
                return 'Title not set';
            }
        }

        set bookName(v: string) {
            if (this.bookForEdit != null) {
                this.bookForEdit.title = v;
            }
        }

        get authorNameForShow() {
            if (this.bookForShow != null) {
                if (this.bookForShow.author != null) {
                    return this.bookForShow.author.name;
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
            if (this.bookForEdit != null) {
                this.bookForEdit.author = tmpAuthor;
            }
        }

        get authorNameForUpdate() {
            if (this.bookForEdit != null) {
                if (this.bookForEdit.author != null) {
                    return this.bookForEdit.author.name;
                } else {
                    return 'Author not set';
                }
            } else {
                return 'Author not set';
            }
        }

        get publisherNameForShow() {
            if (this.bookForShow != null) {
                if (this.bookForShow.publisher != null) {
                    return this.bookForShow.publisher.name;
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
            if (this.bookForEdit != null) {
                this.bookForEdit.publisher = tmpPublisher;
            }
        }

        get publisherNameForUpdate() {
            if (this.bookForShow != null) {
                if (this.bookForShow.publisher != null) {
                    return this.bookForShow.publisher.name;
                } else {
                    return 'Publisher not set';
                }
            } else {
                return 'Publisher not set';
            }
        }

        get startAtFormatted() {
            if (this.bookForShow != null) {
                return formatDate(this.bookForShow.start_at);
            } else {
                return null;
            }
        }

        get endAtFormatted() {
            if (this.bookForShow != null) {
                return formatDate(this.bookForShow.end_at);
            } else {
                return null;
            }
        }

        private maxStartAt(): string {
            if (this.bookForEdit != null && this.bookForEdit.end_at != null) {
                return this.bookForEdit.end_at.substring(0, 10);
            } else {
                return new Date().toISOString().substring(0, 10);
            }
        }

        get startAtDatePicker() {
            if (this.bookForEdit != null && this.bookForEdit.start_at != null) {
                return this.bookForEdit.start_at.substring(0, 10);
            } else {
                return '';
            }
        }

        set startAtDatePicker(date: string) {
            if (this.bookForEdit != null && date !== '') {
                this.bookForEdit.start_at = date;
            }
        }

        get bookImage(): string | null {
            if (this.bookForEdit != null) {
                return this.bookForEdit.medium_image_url;
            } else {
                return null;
            }
        }

        private isBookEdit(): boolean {
            if (this.bookForShow != null && this.bookForEdit != null) {
                const isBookChange = (this.bookForShow.title !== this.bookForEdit.title);
                const isAuthorChange = (this.authorNameForShow !== this.authorNameForUpdate);
                let isDateChange = false;
                if (this.bookForShow.start_at != null && this.bookForEdit.start_at != null) {
                    isDateChange =
                        (this.bookForShow.start_at.substring(0, 10) !== this.bookForEdit.start_at.substring(0, 10));
                }
                if (this.bookForShow.start_at === null && this.bookForEdit.start_at != null) {
                    isDateChange = true;
                }
                return (isBookChange || isAuthorChange || isDateChange);
            } else {
                return false;
            }
        }

        private updateBookWithDetail() {
            // if (this.validateInput()  && this.bookForShow != null) {
            if (this.bookForShow != null && this.bookForEdit != null) {
                if (this.isBookEdit()) {
                    this.isUpdatingBook = true;
                    const authorID: number | null = this.bookForShow.author != null ?
                        this.bookForShow.author.id : null;

                    const publisherID: number | null = this.bookForShow.publisher != null ?
                        this.bookForShow.publisher.id : null;

                    let startAt: string | null = null;
                    if (this.bookForEdit.start_at != null) {
                        startAt = new Date(this.bookForEdit.start_at).toISOString();
                    }
                    let endAt: string | null = null;
                    if (this.bookForEdit.end_at != null) {
                        endAt = new Date(this.bookForEdit.end_at).toISOString();
                    }

                    const book = {
                        id: this.bookForShow.id,
                        title: this.bookForShow.title,
                        author_id: authorID,
                        publisher_id: publisherID,
                        start_at: startAt,
                        end_at: endAt,
                    };
                    getToken()
                        .then((token) => {
                            return api.books.update(token, book);
                        })
                        .then((res) => {
                            this.bookForShow = null;
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
                            errorRoute('book detail view:' + err.toString());
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
            if (this.bookForEdit == null) {
                return null;
            } else {
                return this.bookForEdit.start_at;
            }
        }

        get endAt() {
            if (this.bookForEdit == null) {
                return null;
            } else {
                return this.bookForEdit.end_at;
            }
        }

        private changeState(startAt: string | null, endAt: string | null) {
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

        private doChangeStateAPI(msg: string, apiFunc: (token: string, id: number) => AxiosPromise<ContentResult<Book>>) {
            const res = confirm(msg);
            if (res && this.bookForEdit != null) {
                this.isLoadingBookState = true;
                const tmp = this.bookForEdit;
                getToken()
                    .then((token) => {
                        return apiFunc(token, tmp.id);
                    })
                    .then(() => {
                        return this.loadBookDetail();
                    })
                    .then(() => {
                        this.isLoadingBook = false;
                        this.isLoadingBookState = false;
                    })
                    .catch((err) => {
                        errorRoute('book detail view:' + err.toString());
                    });
            }
        }

        private bookState(startAt: string | null, endAt: string | null) {
            if (endAt == null && startAt == null) {
                return { icon : 'fa-book', label : '未読' };
            } else if (endAt == null) {
                return  { icon : 'mdi-bookmark', label : '読中' };
            } else {
                return  { icon : 'mdi-check', label : '読了' };
            }
        }

        private validateInput(): boolean {
            return (this.$refs.form as Vue & { validate: () => boolean }).validate();
        }

        private deleteBook() {
            const ans = confirm('関連するコメントも全て削除されます。本を削除しますか?');
            if (ans && this.bookForEdit != null) {
                const tmp = this.bookForEdit;
                getToken()
                    .then((token) => {
                        return api.book.delete(token, tmp.id);
                    })
                    .then((res) => {
                        // console.log(res);
                        this.$router.push('/bookshelf');
                    })
                    .catch((err) => {
                        errorRoute('book detail view:' + err.toString());
                });
            }
        }

        private toListPage() {
            this.hiddenFab = true;
            this.$router.push('/bookshelf');
        }
        private formatNullDate(d: string | null) {
            if (d === null || d === '') {
                return '----/--/--';
            } else {
                return d;
            }
        }
        private brackPointIsXS(): boolean {
            return this.$vuetify.breakpoint.name === 'xs';
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
        /*width: 100px;*/
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
