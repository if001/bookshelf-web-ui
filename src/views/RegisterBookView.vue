<template>
    <v-app light>
        <v-container text-xs-center>
            <v-layout row wrap>
                <v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2>
                    <slot name="header">
                        <h3>本の追加</h3>
                    </slot>
                </v-flex>

                <v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2>
                    <v-form
                            ref="form"
                            v-model="valid"
                            lazy-validation
                    >
                        <!--<h2 style="display: inline">-->
                        <!--タイトル-->
                        <!--<div style="display: inline; color:palevioletred;">*</div>-->
                        <!--</h2>-->
                        <div class="pl-2 pb-2">
                            <v-text-field
                                    :counter="10"
                                    maxlength="10"
                                    label="title"
                                    v-model="bookName"
                                    required
                                    @blur="setFirstFocus"
                            ></v-text-field>
                        </div>

                        <!--<h2 class="">-->
                        <!--作者-->
                        <!--</h2>-->
                        <div class="pl-2 pb-2">
                            <v-text-field
                                    :counter="10"
                                    label="author"
                                    maxlength="10"
                                    v-model="authorName"
                            ></v-text-field>
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
                </v-flex>

                <!--<v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2>-->
                    <!--<v-divider></v-divider>-->
                <!--</v-flex>-->
            </v-layout>


            <v-layout row>
                <v-flex lg6 md6 sm6 xs6>
                    <v-btn small
                           outline
                           color="black"
                           right
                           @click="closeRegister()">CLOSE
                    </v-btn>
                </v-flex>
                <v-flex lg6 md6 sm6 xs6>
                    <v-btn v-if="validateInput"
                           small
                           color="success"
                           outline
                           left
                           @click="createBook()">SAVE
                        <v-icon small color="green" class="ml-2">done</v-icon>
                    </v-btn>
                    <v-btn v-else
                           small
                           color="success"
                           outline
                           left
                           disabled>SAVE
                        <v-icon small color="green" class="ml-2">done</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-app>
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
    export default class RegisterBookView extends Vue {
        private bookName: string = '';
        private authorName: string = '';
        private inputCategory: string = '';
        private categories: CategoryWithChip[] = [];
        private valid: boolean = true;


        private isfirstFocusTitle: boolean = false;
        private isfirstFocusCategory: boolean = false;


        public mounted() {
            window.scrollTo(0, 0);
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
                // this.$emit("closeCreate");
                this.$router.push('/bookshelf');
            }).catch(() => {
                console.log('book create error');
            });
        }

        private closeRegister() {
            if (this.bookName.length > 0 && this.authorName.length > 0) {
                const ans = confirm('このページを離れてよろしいですか。変更は保存されません。');
                if (ans) {
                    this.$router.push('/bookshelf');
                }
            } else {
                this.$router.push('/bookshelf');
            }
        }

        get validateInput() {
            return this.bookName.length !== 0 && this.bookName.length <= 10
                && this.authorName.length !== 0 && this.authorName.length <= 10;
        }
    }
</script>

<style scoped>
</style>