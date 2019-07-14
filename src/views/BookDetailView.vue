<template>
    <v-container>
        <v-layout row wrap justify-space-around class="mb-3">
            <v-flex xs12 md5 class="ma-2">
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
                                    <v-form ref="form"
                                            v-model="validEditBox"
                                            lazy-validation>
                                    <div class="pt-1" style="width: 100%">
                                        <v-text-field
                                                v-model="bookName"
                                                maxlength="25"
                                                :counter="25"
                                                height="18"
                                                label="Book Title"
                                        ></v-text-field>
                                    </div>
                                    <div class="pt-1" style="width: 100%">
                                        <v-combobox
                                                v-model="authorNameForShow"
                                                :items="getAuthors"
                                                maxlength="25"
                                                :counter="25"
                                                height="18"
                                                label="author"
                                        ></v-combobox>
                                    </div>
                                    </v-form>
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
                                       @click="updateBookWithDetail"
                                       style="position:absolute; top: 80px; right: 85px;">
                                    <v-icon small dark>done</v-icon>
                                </v-btn>
                            </v-card-title>
                        </v-flex>
                        <v-flex xs3>
                            <div v-if="bookImage != null && bookImage !== ''">
                                <img style="float:right;" :src="bookImage" height="128px" alt="bookImage">
                            </div>
                        </v-flex>
                    </v-layout>
                    <v-divider light></v-divider>
                    <v-layout column>
                        <v-layout nowrap class="pl-3 pt-2 pb-2 pr-3" align-content-end>
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
                            <div class="pa-2">{{ bookState(startAt, endAt).label }} </div>


                            <v-spacer></v-spacer>
                            <div class="pa-2" style="color: gray;">{{startAtFormatted}} 〜 {{endAtFormatted}}</div>
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
                    </v-layout>
                </v-card>
            </v-flex>
            <BookDescription
                    :bookID="bookID"
            ></BookDescription>
        </v-layout>

    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import BookDescription from '@/components/BookDescriptionComponent.vue';
    import api, {Author, Book, Category, Description, Publisher} from "../api";
    import moment from 'moment';

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
        private author: Author | null = null;
        // private categories: Category[] = [];
        private authors: Author[] = [];

        // private rating = 0;
        private isOpen: boolean = false;
        private isLoadingBook: boolean = false;
        private isLoadingBookState: boolean = false;
        private validEditBox: boolean = false;

        private rules: any =  {
            counter12: (value: any) => value.length <= 12 || 'Max 12 characters',
            counter15: (value: any) => value.length <= 15 || 'Max 15 characters',
        };

        private mounted() {
            this.bookMount = null;
            this.author = null;
            // this.categories = [];
            this.loadAuthors();
            this.load();
        }

        private load() {
            this.isLoadingBook = true;
            this.isLoadingBookState = true;
            api.book.get(this.bookID).then((response) => {
                this.book = response.data.content as Book;
            }).then(() => {
                if (this.book == null) {
                    return;
                }
                if (this.book.author != null) {
                    this.author = {
                        id: this.book.author.id,
                        name: this.book.author.name,
                    } as Author;
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
                    author: this.author,
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
                    created_at: this.book.created_at,
                    updated_at: this.book.updated_at,
                    isOpen: false,
                } as BookDetail;
                this.copyValue();
            }).catch(() => {
                console.log('error');
            }).finally(() => {
                this.isLoadingBook = false;
                this.isLoadingBookState = false;
            });
        }


        private loadAuthors() {
            api.author.getCounted()
                .then((res) => {
                    this.authors = res.data.content as Author[];
                })
                .finally(() => {})
                .catch(() => {
                    console.log('load author error');
                });
        }

        get bookID(): number {
            return parseInt(this.$route.params.bookId, 10);
        }

        private copyValue() {
            let authorCopy: Author | null = null;
            if (this.bookMount != null) {
                if (this.bookMount.author != null) {
                    authorCopy = {
                        id: this.bookMount.author.id,
                        name: this.bookMount.author.name,
                    } as Author;
                }
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
            if (this.bookMount != null) {
                this.bookMount.author = tmpAuthor;
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
            if (this.bookMount != null) {
                this.bookMount.publisher = tmpPublisher;
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
                return '';
            }
        }

        get endAtFormatted() {
            if (this.bookDetail != null) {
                return formatDate(this.bookDetail.end_at);
            } else {
                return '----/--/--';
            }
        }

        get bookImage(): string | null {
            if (this.bookDetail != null) {
                    return this.bookDetail.medium_image_url;
            } else {
                return null;
            }
        }

        private isBookChanged(): boolean {
            if (this.bookMount != null && this.bookDetail != null) {
                return (this.bookMount.title !== this.bookDetail.title);
            } else {
                return false;
            }
        }
        private isAuthorChanged(): boolean {
            if (this.bookMount != null && this.bookDetail != null && this.bookMount.author != null) {
                return (this.bookMount.author.name !== this.authorNameForUpdate);
            } else {
                return false;
            }
        }

        private updateBookWithDetail() {
            if (this.validateInput()  && this.bookMount != null) {
                this.isOpen = false;
                if (this.isBookChanged() || this.isAuthorChanged()) {
                    const authorId = this.getAuthorIDByName(this.authorNameForUpdate);
                    if (authorId === 0) {
                        const author = {
                            author_name: this.authorNameForUpdate,
                        };
                        api.author.create(author).then((res) => {
                            const newAuthor = res.data.content as Author;
                            this.updateBook(newAuthor.id);
                        }).catch(() => {
                            console.log('author create error');
                        });
                    } else {
                        this.updateBook(authorId);
                    }
                }
            }
        }

        private updateBook(authorID: number) {
            if (this.bookMount != null) { // 前段でbookMountはnullでないことは確認済み
                const book = {
                    id: this.bookMount.id,
                    title: this.bookMount.title,
                    author_id: authorID,
                    medium_image_url: this.bookMount.medium_image_url,
                    small_image_url: this.bookMount.small_image_url,
                };
                api.books.update(book).then((res) => {
                    this.bookMount = null;
                    this.author = null;
                    // this.categories = [];
                    this.load();
                }).catch(() => {
                    console.log('book create error');
                });
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

        // get ratingSize() {
        //     switch (this.$vuetify.breakpoint.name) {
        //         case 'xs':
        //             return 20;
        //         default:
        //             return 20;
        //     }
        // }


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
            if (endAt == null && startAt == null) {
                const res = confirm('読み始めた本に設定しますか？');
                if (res && this.bookDetail != null) {
                    api.book.startRead(this.bookDetail.id).then(() => {
                        this.load();
                    });
                }
            } else if (endAt == null) {
                const res = confirm('読み終わった本に設定しますか？');
                if (res && this.bookDetail != null) {
                    api.book.endRead(this.bookDetail.id).then(() => {
                        this.load();
                    });
                }
            } else {
                const res = confirm('読み始めた本に設定しますか？');
                if (res && this.bookDetail != null) {
                    api.book.startRead(this.bookDetail.id).then(() => {
                        this.load();
                    });
                }
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
                }).catch(() => {
                    console.log('delete book error');
                });
            }
        }
    }
    function formatDate(d: string | null) {
        if (d != null) {
            const date = moment(d);
            return date.format('YYYY') + '/' + date.format('MM') + '/' + date.format('DD');
        } else {
            return '----/--/--';
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