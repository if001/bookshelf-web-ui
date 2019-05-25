<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            <h3 v-if="!openFlag.name">
                                {{ bookName }}
                                <v-btn flat
                                       icon
                                       small
                                       v-on:click="openFlag.name = !openFlag.name">
                                    <v-icon small>edit</v-icon>
                                </v-btn>
                            </h3>

                            <h3 v-if="openFlag.name">
                                <div style="width: 40%">
                                    <v-text-field
                                            :counter="10"
                                            v-model="bookDetail.name"
                                            :append-outer-icon="'done'"
                                            @click:append-outer="openFlag.name = !openFlag.name"
                                    ></v-text-field>
                                </div>
                                <!--<v-btn flat-->
                                <!--icon-->
                                <!--small-->
                                <!--v-on:click="openFlag.name = !openFlag.name">-->
                                <!--<v-icon small>done</v-icon>-->
                                <!--</v-btn>-->
                            </h3>

                            <v-divider></v-divider>
                        </slot>
                    </div>

                    <div class="modal-body">
                        <div class="modal-flex-box">
                            <h2>
                                作者
                                <v-btn flat
                                       icon
                                       small
                                       v-on:click="openFlag.author = !openFlag.author">
                                    <v-icon small color="blue-grey darken-3">
                                        {{ openFlag.author ? 'done' : 'edit' }}
                                    </v-icon>

                                </v-btn>
                            </h2>

                            <div class="pl-2 pb-2" v-if="!openFlag.author">
                                {{ authorName }}
                            </div>

                            <div class="pl-2 pb-2" v-if="openFlag.author">
                                <div style="width: 40%">
                                    <v-text-field
                                            :counter="10"
                                            v-model="bookDetail.author.name"
                                    ></v-text-field>
                                </div>
                            </div>


                            <h2>
                                ステータス
                                <v-btn flat
                                       icon
                                       small>
                                    <v-icon small color="blue-grey darken-3">edit</v-icon>
                                </v-btn>
                            </h2>
                            <div class="pl-2 pb-2">
                                YYYY/mm/dd 〜 YYYY/mm/dd
                            </div>

                            <h2 style="display: inline">
                                カテゴリ
                                <v-btn flat
                                       icon
                                       color="dark"
                                       small
                                       v-on:click="openFlag.category = !openFlag.category">
                                    <v-icon small color="blue-grey darken-3">
                                        {{ openFlag.category ? 'done' : 'edit' }}
                                    </v-icon>
                                </v-btn>
                            </h2>

                            <div v-if="openFlag.category" style="padding: 10px;padding-top: 0;">
                                <v-text-field
                                        counter="10"
                                        maxlength="10"
                                        label="label"
                                        style="width:40%"
                                        v-model="inputCategory"
                                        v-on:keydown.enter="appendCategory"
                                ></v-text-field>
                                <div class="warning-font">{{msg}}</div>
                            </div>

                            <div>
                                <div style="display: flex; flex-wrap: wrap;">
                                    <div class="ma-0;width:auto;" v-for="category in getCategories">
                                        <v-chip v-if="!openFlag.category"
                                                v-model="category.chip"
                                                color="blue lighten-1"
                                                outline
                                                text-color="black">{{ category.name }}</v-chip>
                                        <v-chip v-else
                                                v-model="category.chip"
                                                close
                                                color="blue lighten-1"
                                                outline
                                                text-color="black"
                                        >{{ category.name }}</v-chip>
                                    </div>
                                </div>
                            </div>

                            <h2>
                                コメント
                                <v-btn flat
                                       icon
                                       small
                                       v-on:click="openFlag.description  = !openFlag.description">
                                    <v-icon small color="blue-grey darken-3">edit</v-icon>
                                </v-btn>
                            </h2>

                            <!--<v-btn small-->
                            <!--outline-->
                            <!--color="info"-->
                            <!--style="width: 20%"-->
                            <!--v-on:click="openComment = !openComment">コメント-->
                            <!--<v-app style="height: 0"></v-app>-->
                            <!--<v-icon small-->
                            <!--color="blue" class="ml-2">add_comment</v-icon>-->
                            <!--</v-btn>-->

                            <div v-if="openFlag.description">
                                <div class="pt-4 pr-2 pl-2 pb-2 ml-2 box-shadow" style="width: 98%">
                                    <text-area-component
                                            v-on:textarea-event="inputHandle"
                                    ></text-area-component>
                                    <div class="ml-5 pl-5 warning-font">{{msg}}</div>
                                    <v-btn class="ma-0"
                                           outline
                                           small
                                           color="info"
                                           v-on:click="appendDiscription">SEND
                                        <v-icon small color="blue" class="ml-2">add_box</v-icon>
                                    </v-btn>
                                </div>
                            </div>


                            <div>
                                <div v-for="description in getDescriptions" class=" pa-3">
                                    <div class="ma-2">{{description.content}}</div>

                                    <div style="display: flex;flex-wrap: wrap;justify-content: flex-end;">
                                        <div class="ma-2 mr-5" style="color:dimgray">{{description.updatedAt}}</div>
                                        <v-btn flat
                                               icon
                                               color="dark"
                                               small
                                               v-on:click="">
                                            <v-icon small color="red darken-2">delete</v-icon>
                                        </v-btn>
                                        <v-btn color="info" small>share</v-btn>
                                        <v-btn color="success" small>share</v-btn>
                                    </div>
                                    <v-divider></v-divider>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="modal-footer white pt-0 pb-0">
                        <v-divider></v-divider>
                        <slot name="footer">
                        </slot>
                        <v-btn small
                               outline
                               color="black"
                               v-on:click="$emit('close')">CLOSE
                        </v-btn>
                        <v-btn small
                               color="success"
                               outline
                               style="float: right" @click="$emit('close')">SAVE
                            <v-icon small color="green" class="ml-2">done</v-icon>
                        </v-btn>
                    </div>

                </div>
            </div>
        </div>

    </transition>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import TextAreaComponent from '@/components/TextAreaComponent.vue';
    import {Author, Book, Category, Description} from '../api';

    interface BookShow extends Book {
        isOpen: boolean;
    }
    interface CategoryWithChip extends Book {
        chip: boolean;
    }

    class OpenFlag {
        public name: boolean = false;
        public author: boolean = false;
        public category: boolean = false;
        public description: boolean = false;
    }

    @Component({
        components: {
            TextAreaComponent,
        },
    })
    export default class BookModal extends Vue {
        @Prop()
        private readonly bookDetailProp!: BookShow;

        private bookDetail: BookShow | null = null;
        private author: Author | null = null;
        private categories: Category[] = [];
        private descriptions: Description[] = [];

        private openFlag: OpenFlag = new OpenFlag();
        private inputDescription: string = '';
        private inputCategory: string = '';
        private msg = '';

        public mounted() {
            this.msg = '';
            this.bookDetail = null;
            this.author = null;
            this.categories = [];
            this.descriptions = [];
            this.copyValue();
        }

        private inputHandle(description: any) {
            this.msg = '';
            this.inputDescription = description;
        }

        private copyValue() {
            if (this.bookDetailProp != null) {
                if (this.bookDetailProp.author != null) {
                    this.author = {
                        id: this.bookDetailProp.author.id,
                        name: this.bookDetailProp.author.name,
                    } as Author;
                }
                if (this.bookDetailProp.categories != null) {
                    for (const category of this.bookDetailProp.categories) {
                        const c: Category = category;
                        const newC = {
                            id: c.id,
                            name: c.name,
                            chip: true,
                        } as CategoryWithChip;
                        this.categories.push(newC);
                    }
                }

                if (this.bookDetailProp.descriptions != null) {
                    for (const description of this.bookDetailProp.descriptions) {
                        const d: Description = description;
                        const newD = {
                            id: d.id,
                            content: d.content,
                        } as Description;
                        this.descriptions.push(newD);
                    }
                }

                this.bookDetail = {
                    id: this.bookDetailProp.id,
                    name: this.bookDetailProp.name,
                    author: this.author,
                    publishedAt: this.bookDetailProp.publishedAt,
                    publisher: this.bookDetailProp.publisher,
                    accountId: this.bookDetailProp.accountId,
                    startAt: this.bookDetailProp.startAt,
                    endAt: this.bookDetailProp.endAt,
                    nextBookId: this.bookDetailProp.nextBookId,
                    prevBookId: this.bookDetailProp.prevBookId,
                    descriptions: this.descriptions,
                    categories: this.categories,
                    createdAt: this.bookDetailProp.createdAt,
                    updatedAt: this.bookDetailProp.updatedAt,
                    isOpen: this.bookDetailProp.isOpen,
                };
            }
        }

        get bookName() {
            if (this.bookDetail != null) {
                return this.bookDetail.name;
            } else {
                return 'not set';
            }
        }

        get authorName() {
            if (this.bookDetail != null) {
                if (this.bookDetail.author != null) {
                    return this.bookDetail.author.name;
                } else {
                    return 'not set';
                }
            } else {
                return 'not set';
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
                    return this.bookDetail.descriptions;
                } else {
                    return [];
                }
            } else {
                return [];
            }
        }

        private appendDiscription(event: any) {
            console.log(event.keyCode);
            if (event.keyCode !== 13) {
                return;
            }

            const len = this.inputDescription.length;
            if (len === 0) {
                this.msg = 'no input';
            } else if (len > 140) {
                this.msg = 'too many input';
            } else {
                this.descriptions.push(
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
            const len = this.inputCategory.length;

            if (len === 0) {
                this.msg = 'no input';
            } else if ( len > 10) {
                this.msg = 'too many input';
            } else {
                this.categories.push(
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
    }
</script>

<style scoped>
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

    .modal-header h3 {
        font-size: 1.4em;
        margin-top: 0;
        color: #1E88E5;
    }

    .modal-header {
        padding: 10px 20px;
        /* height: 10%; */
    }

    .modal-body {
        min-height: 100px;
        max-height: 580px;
        height: 80%;
        margin: 0 20px;
        overflow: auto;
    }

    .modal-body h2 {
        margin: 0;
        font-size: 1.2em;
        color: #989898;
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
        flex-wrap: nowrap;
        flex-direction: column;
        height: 95%;
        overflow: auto;
    }

    .box-shadow {
        box-shadow: 2px 2px 8px rgba(0, 0, 0, .33);
    }

    .warning-font {
        color: palevioletred;
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