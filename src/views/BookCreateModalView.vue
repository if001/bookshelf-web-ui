<template>
    <transition name="modal">
        <div class="modal-mask">
            <div class="modal-wrapper">
                <div class="modal-container">
                    <div class="modal-header">
                        <slot name="header">
                            <h3>本の追加</h3>
                        </slot>
                        <v-divider></v-divider>
                    </div>

                    <div class="modal-body">
                        <div class="modal-flex-box">
                            <v-form
                                    ref="form"
                                    v-model="valid"
                                    lazy-validation
                            >
                            <h2 style="display: inline">
                                タイトル
                                <div style="display: inline; color:palevioletred;">*</div>
                            </h2>
                            <div class="pl-2 pb-2">
                                <div style="width: 40%">
                                    <v-text-field
                                            :counter="10"
                                            maxlength="10"
                                            label="title"
                                            v-model="bookName"
                                            required
                                            @blur="setFirstFocus"
                                    ></v-text-field>
                                </div>
                            </div>

                            <h2 class="">
                                作者
                            </h2>
                            <div class="pl-2 pb-2">
                                <div style="width: 40%">
                                    <v-text-field
                                            :counter="10"
                                            label="author"
                                            maxlength="10"
                                            v-model="authorName"
                                    ></v-text-field>
                                </div>
                            </div>

                                <!-- TODO カテゴリは一旦消しとく-->
                            <!--<h2 blue lighten-1>-->
                                <!--カテゴリ-->
                            <!--</h2>-->
                            <!--<div class="pl-2 pb-2">-->
                                <!--<div style="width:40%">-->
                                    <!--<v-text-field-->
                                            <!--:counter="10"-->
                                            <!--maxlength="10"-->
                                            <!--label="category"-->
                                            <!--v-model="inputCategory"-->
                                            <!--v-on:keydown.enter="appendCategory"-->
                                    <!--&gt;</v-text-field>-->
                                <!--</div>-->
                            <!--</div>-->

                            <!--<div>-->
                                <!--<div style="display: flex; flex-wrap: wrap;">-->
                                    <!--<div class="ma-0;width:auto;" v-for="category in categories">-->
                                        <!--<v-chip v-model="category.chip"-->
                                                <!--close-->
                                                <!--color="blue lighten-1"-->
                                                <!--outline-->
                                                <!--text-color="black"-->
                                        <!--&gt;{{ category.name }}-->
                                        <!--</v-chip>-->
                                    <!--</div>-->
                                <!--</div>-->
                            <!--</div>-->

                            </v-form>

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
                        <v-btn v-if="validateInput"
                               small
                               color="success"
                               outline
                               style="float: right"
                               @click="createBook()">SAVE
                            <v-icon small color="green" class="ml-2">done</v-icon>
                        </v-btn>
                        <v-btn v-else
                               small
                               color="success"
                               outline
                               style="float: right"
                               disabled>SAVE
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
    import {default as api, Author, Book, Category, Description} from '../api';

    interface CategoryWithChip extends Category {
        chip: boolean;
    }

    @Component({
        components: {
            TextAreaComponent,
        },
    })
    export default class BookCreateModal extends Vue {
        private bookName: string = '';
        private authorName: string = '';
        private inputCategory: string = '';
        private categories: CategoryWithChip[] = [];
        private valid: boolean = true;


        private isfirstFocusTitle: boolean = false;
        private isfirstFocusCategory: boolean = false;


        public mounted() {
            this.categories = [];
        }

        private setFirstFocus() {
            this.isfirstFocusTitle = true;
            this.isfirstFocusCategory = true;
        }

        private appendCategory(event: any) {
            if (event.keyCode !== 13) {
                return;
            }
            const len = this.inputCategory.length;

            if (len === 0 && len >= 10) {
                return;
            } else {
                this.categories.push(
                    {
                        id: 0,
                        name: this.inputCategory,
                        chip: true,
                    }  as CategoryWithChip,
                );
                this.inputCategory = '';
            }
        }
        private createBook() {
            const book = {
                title: this.bookName,
                // author_id : 0,
                // author_name: this.authorName,
            };

            api.books.create(book).then((res) => {
                this.$emit('closeCreate');
            }).catch(() => {
                console.log('book create error');
            });

        }

        get validateInput() {
             return this.bookName.length !== 0 && this.bookName.length <= 10 && this.authorName.length !== 0 && this.authorName.length <= 10;
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
        font-size: 1.7em;
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