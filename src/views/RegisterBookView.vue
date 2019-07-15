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
                        <v-tabs
                                v-model="selectTab"
                                fixed-tabs
                                color="#fafafa">
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
                <SearchComponent
                        @select="searchSelect"></SearchComponent>
            </v-layout>
            <v-layout row wrap v-else>
                <v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2 class="pa-2">
                    <v-form
                            ref="form"
                            v-model="validInputForm"
                            lazy-validation
                    >
                        <div class="pl-2 pb-2">
                            <v-text-field
                                    :counter="40"
                                    maxlength="40"
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
                                    maxlength="40"
                                    :counter="40"
                                    height="40px;"
                                    label="author"
                            ></v-combobox>
                        </div>

                        <div class="pl-2 pb-2">
                            <v-combobox
                                    v-model="publisherName"
                                    :items="getPublishers"
                                    maxlength="40"
                                    :counter="40"
                                    height="40px;"
                                    label="publisher"
                            ></v-combobox>
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
                    <div class="pl-2 pb-2">
                        <img style="float:right;" :src="mediumBookImage" :height="(mediumBookImage != null && mediumBookImage !=='')? '120px;':'0'">
                    </div>
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
                           :loading="isSaving"
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
    import SearchComponent from '@/components/SearchComponent.vue';
    import api, {Author, Category, Content, Publisher} from '../api';
    import Footer from '@/components/Footer.vue';

    interface CategoryWithChip extends Category {
        chip: boolean;
    }
    enum searchType {
        web = 0,
        input = 1,
    }
    @Component({
        components: {
            SearchComponent,
            'v-footer': Footer,
        },
    })
    export default class RegisterBookView extends Vue {
        private bookName: string = '';
        private authorName: string = '';
        private smallBookImage: string = '';
        private mediumBookImage: string = '';
        private publisherName: string = '';

        // private inputCategory: string = '';
        // private categories: CategoryWithChip[] = [];
        private validInputForm: boolean = true;

        private authors: Author[] = [];
        private publishers: Publisher[] = [];

        private isFirstFocusTitle: boolean = false;
        private isFirstFocusCategory: boolean = false;
        private isSaving: boolean = false;

        private tabObject = [
            {tag: searchType.web, displayName: 'Web検索から登録'},
            {tag: searchType.input, displayName: '入力して登録'},
        ];
        private selectTab: number = searchType.web;
        private isSearchWeb: boolean = true;
        private inputTitleForSarch: string = '';
        private inputAuthorForSarch: string = '';

        public mounted() {
            window.scrollTo(0, 0);
            // this.categories = [];
            this.authors = [];
            this.publishers = [];
            this.loadAuthors();
            this.loadPublishers();
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

        private loadPublishers() {
            api.publisher.getCounted()
                .then((res) => {
                    this.publishers = res.data.content as Publisher[];
                })
                .finally(() => {})
                .catch(() => {
                    console.log('load publisher error');
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

        get getPublishers() {
            const publisherNames: string[] = [];
            this.publishers.forEach((x) => {
                if (x.count > 3) {
                    publisherNames.push(x.name);
                }
            });
            return publisherNames;
        }

        private getAuthorIDByName(authors: Author[], name: string): number {
            let id = -1;
            authors.forEach((x: Author) => {
                if (name === x.name) {
                    id = x.id;
                }
            });
            return id;
        }

        private getPublisherIDByName(publishers: Publisher[], name: string): number {
            let id = -1;
            publishers.forEach((x: Publisher) => {
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

        private getAuthorIdP(authorName: string): Promise<number> {
            return api.author.getCounted().then((res) => {
                return new Promise<Author[]>((resolve) => {
                    resolve(res.data.content as Author[]);
                });
            }).then((authors) => {
                return new Promise<number>((resolve) => {
                    resolve(this.getAuthorIDByName(authors, authorName));
                });
            }).then((authorId: number) => {
                return new Promise<number>((resolve) => {
                    if (this.authorName.length === 0) {
                     resolve(-2);
                    }
                    else if (authorId === -1) {
                        const author = {
                            author_name: authorName,
                        };
                        api.author.create(author).then((res) => {
                            const newAuthor = res.data.content as Author;
                            resolve(newAuthor.id);
                        });
                    } else {
                        resolve(authorId);
                    }
                });
            });
        }

        private getPublisherIdP(publisherName: string): Promise<number> {
            return api.publisher.getCounted().then((res) => {
                return new Promise<Publisher[]>((resolve) => {
                    resolve(res.data.content as Publisher[]);
                });
            }).then((publishers: Publisher[]) => {
                return new Promise<number>((resolve) => {
                    resolve(this.getPublisherIDByName(publishers, publisherName));
                });
            }).then((publisherId: number) => {
                return new Promise<number>((resolve) => {
                    if (this.publisherName.length === 0) {
                        resolve(-2);
                    }
                    else if (publisherId === -1) {
                        const publisher = {
                            publisher_name: publisherName,
                        };
                        api.publisher.create(publisher).then((res) => {
                            const newPublisher = res.data.content as Publisher;
                            resolve(newPublisher.id);
                        });
                    } else {
                        resolve(publisherId);
                    }
                });
            });

        }


        private createBookWithDetail() {
            console.log(this.validateInput(), this.tmpValidateInput());
            if (this.validateInput() && this.tmpValidateInput()) {

                const authorIdP: Promise<number> = this.getAuthorIdP(this.authorName);
                const publisherIdP: Promise<number> = this.getPublisherIdP(this.publisherName);
                Promise.all([authorIdP, publisherIdP]).then((value) => {
                    const authorId: number | null = (value[0] === -2) ? null : value[0];
                    const publisherId: number | null = (value[1] === -2) ? null : value[1];
                    if (authorId !== -1 && publisherId !== -1) {
                        this.createBook(authorId, publisherId);
                    } else {
                        console.log('create author or publisher error');
                    }
                }).catch(() => {
                    console.log('create author/publisher error');
                });
            }
        }


        private createBook(authorID: number | null, publisherID: number | null) {
            const book = {
                title: this.bookName,
                author_id: authorID,
                publisher_Id: publisherID,
                medium_image_url: this.mediumBookImage,
                small_image_url: this.smallBookImage,
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

        private validateInput(): boolean {
            return (this.$refs.form as Vue & { validate: () => boolean }).validate();
        }

        private tmpValidateInput(): boolean {
            return (this.bookName.length !==0);
        }

        private changeTab(tab: number) {
            if (tab === searchType.web) {
                this.isSearchWeb = true;
            }  else if (tab === searchType.input) {
                this.isSearchWeb = false;
            }
        }

        private searchSelect(select: Content) {
            this.selectTab = searchType.input;
            this.bookName = select.title;
            this.authorName = select.author;
            this.smallBookImage = select.smallImageUrl;
            this.mediumBookImage = select.mediumImageUrl;
            this.publisherName = select.publisherName;
            this.isSearchWeb = false;
        }

    }
</script>

<style scoped>
</style>