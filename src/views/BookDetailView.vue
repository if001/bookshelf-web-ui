<template>
    <v-container>
        <v-layout row wrap justify-space-around class="mb-3" v-if="!expandDescription">
            <v-flex xs12 md5 class="ma-2">
                <v-card color="white" class="black--text">
                    <v-layout row>
                        <v-flex xs7>
                            <v-card-title primary-title class="pb-1">
                                <div v-if="!isOpen">
                                    <div class="headline">{{ bookName }}</div>
                                    <div>{{ authorName }}</div>
                                    <div>publisher</div>
                                    <div>(2013)</div>
                                </div>

                                <div v-if="isOpen">
                                    <div style="width: 100%">
                                        <v-text-field
                                                :counter="10"
                                                v-model="bookName"
                                                label="Book Title"
                                        ></v-text-field>
                                    </div>
                                    <div style="width: 100%">
                                        <v-text-field
                                                :counter="15"
                                                v-model="authorName"
                                                label="Author Name"
                                        ></v-text-field>
                                    </div>
                                    <div style="width: 100%">
                                        <v-text-field
                                                :counter="15"
                                                v-model="hoge"
                                                label="Publisher"
                                        ></v-text-field>
                                    </div>
                                </div>
                                <v-btn icon
                                       fab
                                       dark
                                       color="blue"
                                       small
                                       @click="isOpen=!isOpen;"
                                       style="position:absolute; top: 0px; right: 0px;">
                                    <v-icon small dark>{{ !isOpen ? "edit" : "done" }}</v-icon>
                                </v-btn>
                            </v-card-title>
                        </v-flex>
                        <v-flex xs5>
                            <img style="float:right;" src="@/assets/claudia.jpg" height="170px;">
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
                        <v-divider light></v-divider>
                        <v-card-actions class="pl-3 pb-2 pt-2">
                            Rate this book
                            <v-spacer></v-spacer>
                            <v-rating v-model="rating"
                                      color="yellow darken-3"
                                      background-color="grey darken-1"
                                      half-increments
                                      hover
                                      class="mb-0 mr-2 ml-2 mt-2"
                                      :size=ratingSize
                            ></v-rating>
                        </v-card-actions>

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

            <v-flex class="ma-3" xs12 md6 style="max-width: 100%;">
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
                    <div style="max-height: 500px;overflow: auto;">
                        <div v-for="description in getDescriptions" class=" pa-3">
                            <div class="ma-2">{{description.content}}</div>
                            <!--<div style="display: flex;flex-wrap: wrap;justify-content: flex-end;">-->
                            <v-layout>
                                <div class="ma-2 mr-5" style="color:dimgray">{{description.updatedAt}}</div>
                                <v-spacer></v-spacer>
                                <v-btn flat
                                       icon
                                       color="dark"
                                       small
                                       v-on:click="">
                                    <v-icon small color="red darken-2">delete</v-icon>
                                </v-btn>
                                <v-btn color="info" small>share</v-btn>
                                <v-btn color="success" small>share</v-btn>
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
        private bookDetail: BookDetail | null = null;
        private bookDetailShow: BookDetail | null = null;
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

        public mounted() {
            this.msg = '';
            this.bookDetail = null;
            this.author = null;
            this.categories = [];
            this.descriptions = [];
            // this.copyValue();
            this.load();
        }

        private inputHandle(description: any) {
            this.msg = '';
            this.inputDescription = description;
            console.log(this.inputDescription);
        }

        private load() {
            api.books.get(this.bookId).then((response) => {
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
                if (this.book.categories != null) {
                    for (const category of this.book.categories) {
                        const c: Category = category;
                        const newC = {
                            id: c.id,
                            name: c.name,
                            chip: true,
                        } as CategoryWithChip;
                        this.categories.push(newC);
                    }
                }
                if (this.book.descriptions != null) {
                    for (const description of this.book.descriptions) {
                        const d: Description = description;
                        const newD = {
                            id: d.id,
                            content: d.content,
                        } as Description;
                        this.descriptions.push(newD);
                    }
                }

                this.bookDetail = {
                    id: this.book.id,
                    name: this.book.name,
                    author: this.author,
                    publishedAt: this.book.publishedAt,
                    publisher: this.book.publisher,
                    accountId: this.book.accountId,
                    startAt: this.book.startAt,
                    endAt: this.book.endAt,
                    nextBookId: this.book.nextBookId,
                    prevBookId: this.book.prevBookId,
                    descriptions: this.descriptions,
                    categories: this.categories,
                    createdAt: this.book.createdAt,
                    updatedAt: this.book.updatedAt,
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
            if (this.bookDetailShow != null) {
                if (this.bookDetailShow.author != null) {
                    this.author = {
                        id: this.bookDetailShow.author.id,
                        name: this.bookDetailShow.author.name,
                    } as Author;
                }
                if (this.bookDetailShow.categories != null) {
                    for (const category of this.bookDetailShow.categories) {
                        const c: Category = category;
                        const newC = {
                            id: c.id,
                            name: c.name,
                            chip: true,
                        } as CategoryWithChip;
                        this.categories.push(newC);
                    }
                }

                if (this.bookDetailShow.descriptions != null) {
                    for (const description of this.bookDetailShow.descriptions) {
                        const d: Description = description;
                        const newD = {
                            id: d.id,
                            content: d.content,
                        } as Description;
                        this.descriptions.push(newD);
                    }
                }

                this.bookDetailShow = {
                    id: this.bookDetailShow.id,
                    name: this.bookDetailShow.name,
                    author: this.author,
                    publishedAt: this.bookDetailShow.publishedAt,
                    publisher: this.bookDetailShow.publisher,
                    accountId: this.bookDetailShow.accountId,
                    startAt: this.bookDetailShow.startAt,
                    endAt: this.bookDetailShow.endAt,
                    nextBookId: this.bookDetailShow.nextBookId,
                    prevBookId: this.bookDetailShow.prevBookId,
                    descriptions: this.descriptions,
                    categories: this.categories,
                    createdAt: this.bookDetailShow.createdAt,
                    updatedAt: this.bookDetailShow.updatedAt,
                    isOpen: this.bookDetailShow.isOpen,
                };
            }
        }

        get bookName(): string {
            if (this.bookDetail != null) {
                return this.bookDetail.name;
            } else {
                return 'Title not set';
            }
        }

        set bookName(v: string) {
            if (this.bookDetail != null) {
                this.bookDetail.name = v;
            }
        }

        get authorName() {
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

        set authorName(v: string) {
            const tmpAuthor = {
                id: 0,
                name: v,
            } as Author;
            if (this.bookDetail != null) {
                this.bookDetail.author = tmpAuthor;
            }
        }

        get startAtFormatted() {
            if (this.bookDetail != null) {
                return this.format(this.startAt);
            } else {
                return '';
            }
        }

        get endAtFormatted() {
            if (this.bookDetail != null) {
                return this.format(this.endAt);
            } else {
                return '----/--/--';
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

        get getCategories() {
            if (this.bookDetail != null) {
                if (this.bookDetail.categories != null) {
                    return this.bookDetail.categories;
                } else {
                    return [];
                }
            } else {
                return [];
            }
        }

        get getDescriptions() {
            if (this.bookDetail != null) {
                if (this.bookDetail.descriptions != null) {
                    return this.bookDetail.descriptions.reverse();
                } else {
                    return [];
                }
            } else {
                return [];
            }
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
            // console.log(event.keyCode);
            // if (event.keyCode !== 13) {
            //     return;
            // }

            if (this.bookDetail == null) {
                return;
            }
            const len = this.inputDescription.length;
            if (len === 0) {
                this.msg = 'no input!';
            } else if (len > 140) {
                this.msg = 'too many input!';
            } else {
                this.bookDetail.descriptions.push(
                    {
                        id: 0,
                        content: this.inputDescription,
                    }  as Description,
                );
                this.msg = '';
                this.openFlag.description = false;
            }
        }

        private appendCategory(event: any) {
            if (event.keyCode !== 13) {
                return;
            }
            if (this.bookDetail == null) {
                return;
            }
            const len = this.inputCategory.length;
            if (len === 0) {
                this.msg = 'no input!';
            } else if (len > 10) {
                this.msg = 'too many input!';
            } else {
                this.bookDetail.categories.push(
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

        private setBookDetail() {
            console.log(this.bookDetail);
        }

        get startAt() {
            if (this.bookDetail == null) {
                return null;
            } else {
                return this.bookDetail.startAt;
            }
        }

        get endAt() {
            if (this.bookDetail == null) {
                return null;
            } else {
                return this.bookDetail.endAt;
            }
        }

        private changeState(startAt: string | null, endAt: string | null) {
            if (endAt == null && startAt == null) {
                const res = confirm('読み始めた本に設定しますか？');
                if (res) {
                    startAt = '2019/4/23';
                }
            } else if (endAt == null) {
                const res = confirm('読み終わった本に設定しますか？');
                if (res) {
                    endAt = '2019/4/23';
                }
            } else {
                const res = confirm('読み始めた本に設定しますか？');
                if (res) {
                    endAt = null;
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

    }
</script>

<style scoped>
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

    .modal-mask {
        position: fixed;
        z-index: 9998;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .5);
        display: table;
        transition: opacity .3s ease;
    }

    .modal-wrapper {
        display: table-cell;
        vertical-align: middle;
    }

    .modal-container {
        width: 90%;
        margin: 0 auto;
        min-height: 100px;
        max-height: 580px;
        height: 80%;
        background-color: #fff;
        border-radius: 2px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
        transition: all .3s ease;
        font-family: Helvetica, Arial, sans-serif;
    }

    .modal-header {
        padding: 10px 20px;
        /* height: 10%; */
    }

    .modal-header h2 {
        margin: 0;
        font-size: 2.1em;
        color: #1E88E5;
    }

    .modal-body {
        min-height: 100px;
        max-height: 580px;
        height: 80%;
        /* margin: 0 20px; */
        margin: 0 2%;
        overflow: auto;
    }

    .modal-body h2 {
        margin: 0;
        font-size: 2.1em;
        color: #1E88E5;
    }

    .modal-body h3 {
        font-size: 1.3em;
        margin-top: 0;
        color: #989898;
    }

    .modal-content {
        padding: 10px;
        margin: 10px;
        max-width: 30%;
    }

    .modal-footer {
        /* padding: 10px 20px; */
        height: 40px;
    }

    .modal-default-button {
        float: right;
    }

    .modal-flex-box {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        height: 95%;
        overflow: auto;
    }

    .box-shadow {
        box-shadow: 2px 2px 8px rgba(0, 0, 0, .33);
    }

    .warning-font {
        color: #db4448;
        font-size: 1.0em;
    }

    /*
     * The following styles are auto-applied to elements with
     * transition="modal" when their visibility is toggled
     * by Vue.js.
     *
     * You can easily play with the modal transition by editing
     * these styles.
     */
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
    }
</style>