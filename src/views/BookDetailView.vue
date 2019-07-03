<template>
    <v-container>
        <v-layout row wrap justify-space-around class="mb-3" v-if="!expandDescription">
            <v-flex xs12 md5 class="ma-2">
                <v-card color="white" class="black--text">
                    <v-layout row>
                        <v-flex xs7>
                            <v-card-title primary-title class="">
                                <div v-if="!isOpen">
                                    <div class="headline">{{ bookName }}</div>
                                    <div>{{ authorName }}</div>
                                    <div>publisher</div>
                                    <div>(2013)</div>
                                </div>
                                <div v-if="isOpen">
                                    <div class="pt-1" style="width: 100%">
                                        <v-text-field
                                                :counter="12"
                                                v-model="bookName"
                                                height="18"
                                                label="Book Title"
                                        ></v-text-field>
                                    </div>
                                    <div class="pt-1" style="width: 100%">
                                        <v-text-field
                                                :counter="15"
                                                height="18"
                                                v-model="authorName"
                                                label="Author Name"
                                        ></v-text-field>
                                    </div>
                                    <div class="pt-1" style="width: 100%">
                                        <v-text-field
                                                :counter="15"
                                                height="18"
                                                label="Publisher"
                                        ></v-text-field>
                                    </div>
                                </div>
                                <v-btn v-if="!isOpen"
                                       icon
                                       fab
                                       dark
                                       color="blue"
                                       small
                                       @click="isOpen=!isOpen"
                                       style="position:absolute; top: 0; right: 0;">
                                    <v-icon small dark>edit</v-icon>
                                </v-btn>

                                <v-btn v-if="isOpen"
                                       icon
                                       fab
                                       dark
                                       :color="validateInput ? 'blue' : 'black' "
                                       small
                                       @click="updateBook"
                                       style="position:absolute; top: 0; right: 0;">
                                    <v-icon small dark>done</v-icon>
                                </v-btn>
                            </v-card-title>
                        </v-flex>
                        <v-flex xs5>
                            <img style="float:right;" src="@/assets/claudia.jpg" height="120px;">
                        </v-flex>
                    </v-layout>
                    <v-divider light></v-divider>
                    <v-layout column>
                        <v-layout nowrap class="pl-3 pt-2 pb-2 pr-3" align-content-end>

                            <v-btn flat
                                   icon
                                   color="dark"
                                   class="ma-0"
                                   @click="changeState(startAt, endAt)">
                                <v-icon large
                                        color="blue-grey darken-1"> {{ bookState(startAt, endAt).icon }}
                                </v-icon>
                            </v-btn>
                            <div class="pa-2">{{ bookState(startAt, endAt).label }} </div>


                            <v-spacer></v-spacer>
                            <div class="pa-2" style="color: gray;">{{startAtFormatted}} 〜 {{endAtFormatted}}</div>
                        </v-layout>

                        <!-- TODO Ratingもひとまずつけない -->
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

            <v-flex class="ma-3" xs12 md6>
                <h3>
                    コメント
                    <v-btn flat
                           icon
                           v-on:click="openFlag.description  = !openFlag.description">
                        <v-icon color="blue-grey darken-3">add_comment</v-icon>
                    </v-btn>
                </h3>

                <div v-if="openFlag.description">
                    <v-card class="pa-3">
                        <text-area-component
                                v-on:textarea-event="inputHandle"
                        ></text-area-component>

                        <div style="display: flex">
                            <div class="warning-font">{{msg}}</div>
                            <v-spacer></v-spacer>
                            <v-btn class="ma-0"
                                   outline
                                   small
                                   color="info"
                                   v-on:click="appendDiscription">SEND
                                <v-icon small color="blue" class="ml-2">send</v-icon>
                            </v-btn>
                        </div>
                    </v-card>
                </div>

                <div>
                    <div v-if="getDescriptions.length == 0" class="pa-3">
                        まだコメントがありません
                    </div>
                    <div style="max-height: 70vh; overflow: auto;">
                        <div v-for="description in getDescriptions" class=" pa-3">
                            <div class="ma-2" style="word-wrap: break-word;">{{description.content}}</div>
                            <v-layout>
                                <div class="ma-2 mr-5" style="color:dimgray; font-size: 0.8em;">{{createdAtFormatted}}</div>
                                <v-spacer></v-spacer>
                                <v-btn flat
                                       icon
                                       color="dark"
                                       small
                                       v-on:click="deleteDesription(description.id)">
                                    <v-icon small color="red darken-2">delete</v-icon>
                                </v-btn>
                                <!--TODO シェアボタン-->
                                <!--<v-btn color="info" small>share</v-btn>-->
                                <!--<v-btn color="success" small>share</v-btn>-->
                            </v-layout>
                            <v-divider></v-divider>
                        </div>
                    </div>
                </div>

            </v-flex>
        </v-layout>


        <!--<div class="box-shadow m1p pa-2" style="display: flex;flex-wrap: wrap;"-->
        <!--v-bind:class="[ this.$vuetify.breakpoint.xs ? w.w10Class : w.w5Class ]">-->

        <!--<div style="display: flex;flex-wrap: nowrap;overflow: auto; width: 100%;max-height: 250px;">-->
        <!--<div style="display: flex; flex-direction:column; flex-wrap: nowrap;overflow: auto; width: 50%; max-width: 50%;">-->
        <!--<div class="pr-1 pl-1 pt-1 pb-0 weight600" style="font-size: 2.1em;">title</div>-->
        <!--<div class="pa-1">author</div>-->
        <!--<div class="pa-1">publisher</div>-->
        <!--<div class="pa-1">publishedAt</div>-->
        <!--</div>-->
        <!--<div style="width: 50%;">-->
        <!--<img style="float:right;" src="@/assets/claudia.jpg" height="150px;">-->
        <!--</div>-->
        <!--</div>-->
        <!--</div>-->

        <!--<div class="box-shadow m1p pa-2" style="display: flex;flex-wrap: wrap;"-->
        <!--v-bind:class="[ this.$vuetify.breakpoint.xs ? w.w10Class : w.w4Class ]">-->
        <!--<div style="display: flex;flex-wrap: nowrap;">-->
        <!--<div class="">-->
        <!--<v-btn flat-->
        <!--icon-->
        <!--color="dark"-->
        <!--class="ma-0">-->
        <!--<v-icon large-->
        <!--color="blue-grey darken-1">bookmark-->
        <!--</v-icon>-->
        <!--</v-btn>-->
        <!--</div>-->
        <!--<div class="pa-2">未読</div>-->
        <!--<div class="pa-2" style="color: gray; font-size: 0.8em;">yyyy/mm/dd〜yyyy/mm/dd</div>-->
        <!--</div>-->
        <!--<div class="ma-2" style="width: 100%;">-->
        <!--<v-divider></v-divider>-->
        <!--</div>-->

        <!--<div class="pa-1">カテゴリ</div>-->

        <!--<div class="ma-2" style="width: 100%;">-->
        <!--<v-divider></v-divider>-->
        <!--</div>-->

        <!--<div style="width: 100%;display:flex;flex-wrap:nowrap;">-->
        <!--<div class="ma-2">rating</div>-->
        <!--<v-spacer style=""></v-spacer>-->
        <!--<v-rating v-model="rating"-->
        <!--color="yellow darken-3"-->
        <!--background-color="grey darken-1"-->
        <!--half-increments-->
        <!--hover-->
        <!--small-->
        <!--class="mb-0 mr-2 ml-2 mt-2"-->
        <!--&gt;</v-rating>-->
        <!--</div>-->
        <!--</div>-->


    </v-container>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import TextAreaComponent from '@/components/TextAreaComponent.vue';
    import api, {Author, Book, Category, Description} from '../api';
    import moment from 'moment';

    interface BookDetail extends Book {
        isOpen: boolean;
    }

    interface CategoryWithChip extends Category {
        chip: boolean;
    }

    class OpenFlag {
        public name: boolean = false;
        public author: boolean = false;
        public publisher: boolean = false;
        public category: boolean = false;
        public description: boolean = false;
        public rating: boolean = false;
    }

    @Component({
        components: {
            TextAreaComponent,
        },
    })
    export default class BookModal2 extends Vue {
        private book: Book | null = null;
        private bookMount: BookDetail | null = null;
        private bookDetail: BookDetail | null = null;
        private author: Author | null = null;
        private categories: Category[] = [];
        private descriptions: Description[] = [];

        private openFlag: OpenFlag = new OpenFlag();
        private inputDescription: string = '';
        private inputCategory: string = '';
        private msg = '';
        private rating = 0;

        private isOpen: boolean = false;
        private expandDescription: boolean = false;

        private rules: any =  {
            counter12: (value: any) => value.length <= 12 || 'Max 12 characters',
            counter15: (value: any) => value.length <= 15 || 'Max 15 characters',
        };

        public mounted() {
            this.msg = '';
            this.bookMount = null;
            this.author = null;
            this.categories = [];
            this.descriptions = [];
            // this.copyValue();
            this.load();
        }

        private inputHandle(description: any) {
            this.msg = '';
            this.inputDescription = description;
        }

        private load() {
            api.book.get(this.bookId).then((response) => {
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

                api.description.get(this.book.id).then((response) => {
                    this.descriptions = response.data.content as Description[];
                }).catch(() => {
                    console.log('book detail view: description get error');
                });

                this.bookMount = {
                    id: this.book.id,
                    title: this.book.title,
                    author: this.author,
                    publishedAt: this.book.publishedAt,
                    publisher: this.book.publisher,
                    accountId: this.book.accountId,
                    start_at: this.book.start_at,
                    end_at: this.book.end_at,
                    nextBookId: this.book.nextBookId,
                    prevBookId: this.book.prevBookId,
                    categories: this.categories,
                    created_at: this.book.created_at,
                    updated_at: this.book.updated_at,
                    isOpen: false,
                } as BookDetail;
            }).catch(() => {
                console.log('error');
            });
        }

        get bookId(): number {
            return parseInt(this.$route.params.bookId, 10);
        }

        private copyValue() {
            let author: Author | null = null;
            if (this.bookMount != null) {
                if (this.bookMount.author != null) {
                    author = {
                        id: this.bookMount.author.id,
                        name: this.bookMount.author.name,
                    } as Author;
                }
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
                this.bookDetail = {
                    id: this.bookMount.id,
                    title: this.bookMount.title,
                    author: author,
                    publishedAt: this.bookMount.publishedAt,
                    publisher: this.bookMount.publisher,
                    accountId: this.bookMount.accountId,
                    start_at: this.bookMount.start_at,
                    end_at: this.bookMount.end_at,
                    nextBookId: this.bookMount.nextBookId,
                    prevBookId: this.bookMount.prevBookId,
                    categories: this.categories,
                    created_at: this.bookMount.created_at,
                    updated_at: this.bookMount.updated_at,
                    isOpen: this.bookMount.isOpen,
                };
            }
        }

        get bookName(): string {
            if (this.bookMount != null) {
                return this.bookMount.title;
            } else {
                return 'Title not set';
            }
        }

        set bookName(v: string) {
            if (this.bookMount != null) {
                this.bookMount.title = v;
            }
        }

        get authorName() {
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

        set authorName(v: string) {
            const tmpAuthor = {
                id: 0,
                name: v,
            } as Author;
            if (this.bookMount != null) {
                this.bookMount.author = tmpAuthor;
            }
        }

        get startAtFormatted() {
            if (this.bookMount != null) {
                return this.format(this.bookMount.start_at);
            } else {
                return '';
            }
        }

        get endAtFormatted() {
            if (this.bookMount != null) {
                return this.format(this.bookMount.end_at);
            } else {
                return '----/--/--';
            }
        }

        get createdAtFormatted() {
            if (this.bookMount != null) {
                return this.formatDateTime(this.bookMount.created_at);
            } else {
                return '----/--/-- --:--';
            }
        }

        private format(d: string | null) {
            if (d != null) {
                const date = moment(d, 'YYYY-MM-DD HH:mm:ss');
                return date.year().toString() + '/' + (date.month() + 1).toString() + '/' + date.date();
            } else {
                return '----/--/--';
            }
        }

        private formatDateTime(d: string | null) {
            if (d != null) {
                const date = moment(d, 'YYYY-MM-DD HH:mm:ss');
                return date.year().toString() + '/' + (date.month() + 1).toString() + '/' + date.date()
                    + ' ' + date.hour() + ':' + date.minute();
            } else {
                return '----/--/--';
            }
        }

        get getDescriptions() {
            return this.descriptions.reverse();
        }

        get ratingSize() {
            switch (this.$vuetify.breakpoint.name) {
                case 'xs':
                    return 20;
                default:
                    return 20;
            }
        }
        private appendDiscription(event: any) {
            if (this.bookMount == null) {
                return;
            }
            const len = this.inputDescription.length;
            if (len === 0) {
                this.msg = 'no input!';
            } else if (len > 140) {
                this.msg = 'too many input!';
            } else {
                const description = {
                    book_id: this.bookMount.id,
                    content: this.inputDescription,
                };

                api.description.create(this.bookMount.id, description).then((res) => {
                    // console.log(res);
                    this.load();
                }).catch(() => {
                    console.log('append discription error');
                });

                this.msg = '';
                this.openFlag.description = false;
            }
        }

        private appendCategory(event: any) {
            if (event.keyCode !== 13) {
                return;
            }
            if (this.bookMount == null) {
                return;
            }
            const len = this.inputCategory.length;
            if (len === 0) {
                this.msg = 'no input!';
            } else if (len > 10) {
                this.msg = 'too many input!';
            } else {
                this.bookMount.categories.push(
                    {
                        id: 0,
                        name: this.inputCategory,
                        chip: true,
                    }  as CategoryWithChip,
                );
                this.inputCategory = '';
                this.msg = '';
                this.openFlag.category = false;
            }
        }

        get startAt() {
            if (this.bookMount == null) {
                return null;
            } else {
                return this.bookMount.start_at;
            }
        }

        get endAt() {
            if (this.bookMount == null) {
                return null;
            } else {
                return this.bookMount.end_at;
            }
        }

        private changeState(startAt: string | null, endAt: string | null) {
            if (endAt == null && startAt == null) {
                const res = confirm('読み始めた本に設定しますか？');
                if (res && this.bookMount != null) {
                    api.book.startRead(this.bookMount.id).then(() => {
                        this.load();
                    });
                }
            } else if (endAt == null) {
                const res = confirm('読み終わった本に設定しますか？');
                if (res && this.bookMount != null) {
                    api.book.endRead(this.bookMount.id).then(() => {
                        this.load();
                    });
                }
            } else {
                const res = confirm('読み始めた本に設定しますか？');
                if (res && this.bookMount != null) {
                    api.book.startRead(this.bookMount.id).then(() => {
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
                return  { icon : 'done', label : '了読' };
            }
        }

        private updateBook() {
            if (this.validateInput()) {
                this.isOpen = false;
            }
        }
        private deleteDesription(id: number) {
            const ans = confirm('削除しますか?');
            if (ans) {
                api.description.delete(id).then((res) => {
                    // console.log(res);
                    this.load();
                }).catch(() => {
                    console.log('delete discription error');
                });
            }
        }
        private validateInput(): boolean {
            if (this.bookMount != null) {
                if (this.bookMount.title.length > 15) {
                    return false;
                }

                if (this.bookMount.author != null) {
                    if (this.bookMount.author.name.length > 12) {
                        return false;
                    }
                }
            }
            return true;
        }
    }
</script>

<style scoped>
    /*
    .reverse{
        transform: scale(-1, 1);
    }
    .w3 {
        width: 30%;
    }

    .w4 {
        width: 40%;
    }

    .w5 {
        width: 50%;
    }

    .w6 {
        width: 60%;
    }

    .w9 {
        width: 90%;
    }

    .w10 {
        width: 100%;
    }

    .m1p {
        margin: 1%;
    }

    .weight600 {
        font-weight: 400;
    }

    .warning-font {
        color: #db4448;
        font-size: 1.0em;
    }
 */
    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */
    /*
    .font-small {
        font-size: 0.8em;
    }

    .modal-enter {
        opacity: 0;
    }

    .modal-leave-active {
        opacity: 0;
    }

    .modal-enter .modal-container,
    .modal-leave-active .modal-container {
        -webkit-transform: scale(1.1);
        transform: scale(1.1);
    } */
</style>