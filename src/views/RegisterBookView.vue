<template>
    <v-app light>
        <v-container text-xs-center>
            <v-row justify="center">
                <v-col lg="8" md="8" sm="8" xs="8">
                    <slot name="header">
                        <div style="text-align: center;color: dimgray;font-size:1.2em;">本の登録</div>
                    </slot>
                </v-col>
            </v-row>

            <v-row cols="8" justify="center">
                <v-col lg="8" md="8" sm="8" xs="8">
                    <v-tabs v-model="selectTab"
                            background-color="grey lighten-5"
                            bark
                            :centered="true"
                            :grow="true">
                        <v-tab
                                color="grey lighten-5"
                                v-for="f in tabObject"
                                :key="f.displayName"
                                @click="changeTab(f.tag)"
                                class="ma-0">
                            {{ f.displayName }}
                        </v-tab>
                    </v-tabs>
                </v-col>
            </v-row>

            <v-row justify="center" cols="12"  v-if="isSearchWeb" >
                <v-col justify="center">
                    <SearchComponent
                            @select="searchSelect"></SearchComponent>
                </v-col>
            </v-row>

            <v-row cols="12" v-else>
                <v-col cols="12">

                    <v-row justify="center">
                        <v-col lg="8" md="8" sm="12" xs="12" class="pa-2">
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
                                    <v-text-field
                                            :counter="40"
                                            maxlength="40"
                                            label="author"
                                            v-model="authorName"
                                            @blur="setFirstFocus"
                                    ></v-text-field>
        <!--                            <v-combobox-->
        <!--                                    v-model="authorName"-->
        <!--                                    :items="getAuthors"-->
        <!--                                    maxlength="40"-->
        <!--                                    :counter="40"-->
        <!--                                    height="40px;"-->
        <!--                                    label="author"-->
        <!--                            ></v-combobox>-->
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
                        </v-col>
                    </v-row>



                    <v-row justify="center">
                        <v-col cols="12" align="center">
                            <v-btn class="ma-2"
                                   small
                                   outlined
                                   color="black"
                                   @click="closeRegister()">CLOSE
                            </v-btn>

                            <v-btn class="ma-2"
                                   small
                                   color="success"
                                   outlined
                                   :loading="isSaving"
                                   @click="createBookWithDetail()">SAVE
                                <v-icon small color="green" class="ml-2">mdi-check</v-icon>
                            </v-btn>
                        </v-col>
                    </v-row>

                </v-col>
            </v-row>

        </v-container>
    </v-app>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import SearchComponent from '@/components/SearchComponent.vue';
    import api, {Author, Category, Content, errorRoute, getToken, Publisher} from '../api';
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

        private validInputForm: boolean = true; // use template

        private authors: Author[] = [];
        private publishers: Publisher[] = [];

        private isFirstFocusTitle: boolean = false;
        private isFirstFocusCategory: boolean = false;
        private isSaving: boolean = false; // use template

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
            getToken()
                .then((token) => {
                    return api.author.getCounted(token);
                })
                .then((res) => {
                    this.authors = res.data.content as Author[];
                })
                .finally(() => {})
                .catch((err) => {
                    errorRoute('book detail view:' + err.toString());
                });
        }

        private loadPublishers() {
            getToken()
                .then((token) => {
                    return api.publisher.getCounted(token);
                })
                .then((res) => {
                    this.publishers = res.data.content as Publisher[];
                })
                .finally(() => {})
                .catch((err) => {
                    errorRoute('register book view: ' + err.toString());
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

        private getAuthorIDByName(authors: Author[], name: string): number | null {
            let id: number | null = null;
            authors.forEach((x: Author) => {
                if (name === x.name) {
                    id = x.id;
                }
            });
            return id;
        }

        private getPublisherIDByName(publishers: Publisher[], name: string): number | null {
            let id: number | null = null;
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

        private getAuthorIdP(authorName: string): Promise<number | null> {
            let tmpToken = '';
            return getToken()
                .then((token) => {
                    tmpToken = token;
                    return api.author.getCounted(token);
                })
                .then((res) => {
                    return new Promise<Author[]>((resolve) => {
                        resolve(res.data.content as Author[]);
                    });
                }).then((authors) => {
                    return new Promise<number | null>((resolve) => {
                        resolve(this.getAuthorIDByName(authors, authorName));
                    });
                }).then((authorId: number | null) => {
                    return new Promise<number | null>((resolve, reject) => {
                        if (authorName.length === 0 || this.authorName.length === 0) {
                            resolve(null);
                        } else if (authorId === null) {
                            const author = {
                                author_name: authorName,
                            };
                            api.author.create(tmpToken, author)
                                .then((res) => {
                                    const newAuthor = res.data.content as Author;
                                    resolve(newAuthor.id);
                                });
                        } else {
                            resolve(authorId);
                        }
                    });
                });
        }

        private getPublisherIdP(publisherName: string): Promise<number | null> {
            let tmpToken = '';
            return getToken()
                .then((token) => {
                    tmpToken = token;
                    return api.publisher.getCounted(token);
                })
                .then((res) => {
                    return new Promise<Publisher[]>((resolve) => {
                        resolve(res.data.content as Publisher[]);
                    });
                })
                .then((publishers: Publisher[]) => {
                    return new Promise<number | null>((resolve) => {
                        resolve(this.getPublisherIDByName(publishers, publisherName));
                    });
                })
                .then((publisherId: number | null) => {
                    return new Promise<number | null>((resolve, reject) => {
                        if (publisherName.length === 0 || this.publisherName.length === 0) {
                            resolve(null);
                        } else if (publisherId === null) {
                            const publisher = {
                                publisher_name: publisherName,
                            };
                            api.publisher.create(tmpToken, publisher)
                                .then((res) => {
                                    const newPublisher = res.data.content as Publisher;
                                    resolve(newPublisher.id);
                                })
                                .catch((err) => {
                                    reject(err.toString());
                                });
                        } else {
                            resolve(publisherId);
                        }
                    });
                });
        }


        private createBookWithDetail() {
            if (this.validateInput() && this.tmpValidateInput()) {
                const authorIdP: Promise<number | null> = this.getAuthorIdP(this.authorName);
                const publisherIdP: Promise<number | null> = this.getPublisherIdP(this.publisherName);
                Promise.all([authorIdP, publisherIdP])
                    .then((value) => {
                        const authorId: number | null = value[0];
                        const publisherId: number | null = value[1];
                        this.createBook(authorId, publisherId);
                    })
                    .catch((err) => {
                        console.log(err);
                        // errorRoute('register book view: ' + err.toString());
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
            getToken()
                .then((token) => {
                    return api.books.create(token, book);
                })
                .then((res) => {
                    // this.$emit("closeCreate");
                    this.$router.push('/bookshelf');
                })
                .catch((err) => {
                    errorRoute('register book view: ' + err.toString());
                });
        }

        private closeRegister() {
            if (this.bookName.length > 0 || this.authorName.length > 0 || this.publisherName.length > 0) {
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
            return (this.bookName.length !== 0);
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
