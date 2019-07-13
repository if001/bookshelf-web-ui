<template>
    <v-app light>
        <v-container text-xs-center>

            <v-layout row wrap>
                <v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2>
                    <slot name="header">
                        <h2>本の登録</h2>
                    </slot>
                </v-flex>
            </v-layout>
                <v-layout row nowrap justify-center>
                    <v-flex md12>
                        <v-tabs fixed-tabs color="#fafafa">
                            <v-tab
                                    v-for="f in tabObject"
                                    :key="f.displayName"
                                    @change="changeTab(f.tag)">
                                {{ f.displayName }}
                            </v-tab>
                        </v-tabs>
                    </v-flex>
                </v-layout>


            <v-layout row wrap v-if="isSearchWeb">
                <SearchFormComponent
                        @complete="searchComplete"></SearchFormComponent>
                <SearchResultComponent
                        v-if="searchComplete"
                        :searchResult=searchResult
                        @complete="searchResultSelect"></SearchResultComponent>
            </v-layout>
            <v-layout row wrap v-else>
                <v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2>
                    <v-form
                            ref="form"
                            v-model="validInputForm"
                            lazy-validation
                    >
                        <div class="pl-2 pb-2">
                            <v-text-field
                                    :counter="18"
                                    maxlength="18"
                                    label="title"
                                    v-model="bookName"
                                    required
                                    @blur="setFirstFocus"
                            ></v-text-field>
                        </div>

                        <div class="pl-2 pb-2">
                            <v-combobox
                                    v-model="authorName"
                                    :items="getAuthors"
                                    maxlength="18"
                                    :counter="18"
                                    height="40px;"
                                    label="author"
                            ></v-combobox>
                        </div>

                        <div class="pl-2 pb-2">
                            <img style="float:right;" :src="mediumBookImage" height="120px;">
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
                <v-flex lg6 md6 sm6 xs6>
                    <v-btn small
                           outline
                           color="black"
                           right
                           @click="closeRegister()">CLOSE
                    </v-btn>
                </v-flex>
                <v-flex lg6 md6 sm6 xs6>
                    <v-btn small
                           color="success"
                           outline
                           left
                           @click="createBookWithDetail()">SAVE
                        <v-icon small color="green" class="ml-2">done</v-icon>
                    </v-btn>
                </v-flex>
            </v-layout>

        </v-container>
        <v-footer></v-footer>
    </v-app>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import SearchFormComponent from '@/components/SearchFormComponent.vue';
    import SearchResultComponent from '@/components/SearchResultComponent.vue';
    import api, {Author, Category, Item, SearchResult} from '../api';
    import Footer from '@/components/Footer.vue';

    interface CategoryWithChip extends Category {
        chip: boolean;
    }

    @Component({
        components: {
            SearchFormComponent,
            SearchResultComponent,
            'v-footer': Footer,
        },
    })
    export default class RegisterBookView extends Vue {
        private bookName: string = '';
        private authorName: string = '';
        private smallBookImage: string = '';
        private mediumBookImage: string = '';

        private inputCategory: string = '';
        // private categories: CategoryWithChip[] = [];
        private validInputForm: boolean = true;

        private isFirstFocusTitle: boolean = false;
        private isFirstFocusCategory: boolean = false;
        private authors: Author[] = [];
        private searchResult: SearchResult | null = null;

        private tabObject = [
            {tag: 'web', displayName: 'Web検索から登録'},
            {tag: 'input', displayName: '入力して登録'},
        ];
        private isSearchWeb: boolean = true;
        private inputTitleForSarch: string = '';
        private inputAuthorForSarch: string = '';
        private isSearchComplete: boolean = false;

        public mounted() {
            window.scrollTo(0, 0);
            // this.categories = [];
            this.authors = [];
            this.loadAuthors();
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

        private setFirstFocus() {
            this.isFirstFocusTitle = true;
            this.isFirstFocusCategory = true;
        }

        // private appendCategory(event: any) {
        //     if (event.keyCode !== 13) {
        //         return;
        //     }
        //     const len = this.inputCategory.length;
        //
        //     if (len === 0 && len >= 10) {
        //         return;
        //     } else {
        //         this.categories.push(
        //             {
        //                 id: 0,
        //                 name: this.inputCategory,
        //                 chip: true,
        //             }  as CategoryWithChip,
        //         );
        //         this.inputCategory = '';
        //     }
        // }

        private createBookWithDetail() {
            const authorId = this.getAuthorIDByName(this.authorName);
            if (this.validateInput()) {
                if (authorId === 0) {
                    const author = {
                        author_name: this.authorName,
                    };
                    api.author.create(author).then((res) => {
                        const newAuthor = res.data.content as Author;
                        this.createBook(newAuthor.id);
                    }).catch(() => {
                        console.log('author create error');
                    });
                } else {
                    this.createBook(authorId);
                }
            }
        }

        private createBook(authorID: number) {
            const book = {
                title: this.bookName,
                author_id: authorID,
                medium_image_url: this.mediumBookImage,
                small_image_url: this.smallBookImage,
            };
            api.books.create(book).then((bookres) => {
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

        private validateInput(): boolean {
            return (this.$refs.form as Vue & { validate: () => boolean }).validate();
        }

        private changeTab(tab: string) {
            if (tab === 'web') {
                this.isSearchWeb = true;
            }  else if (tab === 'input') {
                this.isSearchWeb = false;
            }
        }

        private searchComplete(result: SearchResult) {
            this.searchResult = result;
        }

        private searchResultSelect(select: Item) {
            this.bookName = select.title;
            this.authorName = select.author;
            this.smallBookImage = select.smallImageUrl;
            this.mediumBookImage = select.mediumImageUrl;
            this.isSearchWeb = false;
        }

    }
</script>

<style scoped>
</style>