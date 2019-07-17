<template>
    <v-container>
        <v-layout row wrap align-center>
            <v-flex lg8 md8 sm12 xs12 offset-lg2 offset-md2 class="pa-2">
            <v-form
                    ref="titleForm"
                    v-model="validTitleSearchBox"
                    lazy-validation>
                <v-text-field
                        flat
                        label="Search From Title"
                        v-model="inputTitleForSearch"
                        :roles="searchFormRules"
                        required
                        append-outer-icon="search"
                        @click:append-outer="searchTitle()"
                ></v-text-field>
            </v-form>

            <v-form
                    ref="authorForm"
                    v-model="validAuthorSearchBox"
                    lazy-validation>
                <v-text-field
                        flat
                        label="Search From Author"
                        v-model="inputAuthorForSearch"
                        :roles="searchFormRules"
                        required
                        append-outer-icon="search"
                        @click:append-outer="searchAuthor()"
                ></v-text-field>
            </v-form>
        </v-flex>
        </v-layout>


        <v-layout row wrap align-center v-if="getSearchResult.length !== 0">
            <v-flex lg12 md12 sm12 xs12>
                <v-btn v-if="getSearchResult.length !== 0 && selectMultiBooks.length !==0"
                       small
                       color="success"
                       outline
                       :loading="isSaving"
                       @click="createBookMultiple">CREATE
                    <v-icon small color="green" class="ml-2">done</v-icon>
                </v-btn>
                <v-btn v-else
                       small
                       color="success"
                       outline
                       :loading="isSaving"
                       disabled
                       @click="createBookMultiple">CREATE
                    <v-icon small color="green" class="ml-2">done</v-icon>
                </v-btn>
            </v-flex>
        </v-layout>


        <v-layout row wrap justify-start>
                <v-flex class="pa-2" v-for="result in getSearchResult" lg4 md6 sm12 xs12>
                    <v-card color="white" class="black--text" @click="selectBook(result)" style="cursor:pointer">
                        <v-layout row>
                            <v-flex xs8>
                                <div class="ma-1" style="width: 100%; float:left; font-size: 1.2em">{{result.title}}</div>
                                <div class="ma-1" style="width: 100%; float:left;">{{result.author}}</div>
                                <div class="ma-1" style="width: 100%; float:left;">{{result.publisherName}} / ￥ {{result.itemPrice}}</div>
                                <v-btn v-if="result.isChecked"
                                       icon
                                       fab
                                       dark
                                       color="blue"
                                       small
                                       style="position:absolute; top: 0; right: 0;">
                                    <v-icon small dark>done</v-icon>
                                </v-btn>
                            </v-flex>
                            <v-flex xs4 style="max-height: 128px;">
                            <img style="float:right;" :src="result.mediumImageUrl" height="128px;">
                            </v-flex>
                        </v-layout>
                    </v-card>
                </v-flex>
            </v-layout>
        <v-layout row nowrap justify-center v-if="getSearchResult.length !== 0">
                <v-flex md12 class="mt-2 mb-4 text-xs-center">
                    <v-pagination
                            v-model="page"
                            :length=totalCount
                            @input="pagenaite()"
                            color="#1e90ff"
                    ></v-pagination>
                </v-flex>
            </v-layout>

    </v-container>
</template>


<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import api, {SearchResult, Book, Content, Author, Publisher, ContentResult} from "../api";
    import {AxiosPromise} from 'axios';

    export interface SearchResultWithCheck {
        title: string;
        author: string;
        smallImageUrl: string;
        mediumImageUrl: string;
        publisherName: string;
        itemPrice: string;
        itemUrl: string;
        affiliateUrl: string;
        isChecked: boolean;
    }
    const maxRegisterNum: number = 5;

    @Component
    export default class SearchComponent extends Vue {
        private validTitleSearchBox: boolean = true;
        private validAuthorSearchBox: boolean = true;
        private searchResult: SearchResult | null = null;
        private searchResultWithCheck: SearchResultWithCheck[] = [];
        private inputTitleForSearch: string = '';
        private inputAuthorForSearch: string = '';
        private searchType = 'title';
        private page: number = 1;
        private perPage: number = 16;
        private totalCount: number = 1;
        private isSaving: boolean = false;
        private selectMultiBooks: SearchResultWithCheck[] = [];

        private authors: Author[] = [];
        private publishers: Publisher[] = [];

        private searchFormRules = [
            (v: any) => !!v || 'required',
        ];

        @Emit()
        private select(book: Content){}




        private searchTitle() {
            if (this.validateTitleInput() && this.inputTitleForSearch.length !== 0) {
                toTop();
                this.searchType = 'title';
                api.rakuten.searchByTitle(this.inputTitleForSearch, this.page, this.perPage).then((res) => {
                    this.searchResult = res.data as SearchResult;
                    this.totalCount = this.searchResult.pageCount;
                    this.searchResultWithCheck = this.searchResult.Items.map((x) => {
                        // console.log(this.itemToResultWithCheck(x));
                        return itemToResultWithCheck(x.Item);
                    });
                }).catch(() => {
                    // console.log('search api error');
                });
            }
        }

        private searchAuthor() {
            if (this.validateAuthorInput() && this.inputAuthorForSearch.length !== 0) {
                toTop();
                this.searchType = 'author';
                api.rakuten.searchByAuthor(this.inputAuthorForSearch, this.page, this.perPage).then((res) => {
                    this.searchResult = res.data as SearchResult;
                    this.totalCount = this.searchResult.pageCount;
                    this.searchResultWithCheck = this.searchResult.Items.map((x) => {
                        return itemToResultWithCheck(x.Item);
                    });
                }).catch(() => {
                    // console.log('search api error');
                });
            }
        }

        private validateTitleInput(): boolean {
            return (this.$refs.authorForm as Vue & { validate: () => boolean }).validate();
        }
        private validateAuthorInput(): boolean {
            return (this.$refs.titleForm as Vue & { validate: () => boolean }).validate();
        }

        get getSearchResult() {
            return this.searchResultWithCheck;
        }

        private pagenaite() {
            if (this.searchType === 'title') {
                this.searchTitle();
            } else if (this.searchType === 'author') {
                this.searchAuthor();
            } else {
                console.log('bad search type');
            }
        }

        private selectBook(book: SearchResultWithCheck) {
            if (book.isChecked) {
                book.isChecked = false;
                const ind = this.selectMultiBooks.indexOf(book);
                this.selectMultiBooks.splice(ind, 1);
            } else {
                if (this.selectMultiBooks.length < maxRegisterNum) {
                    book.isChecked = true;
                    this.selectMultiBooks.push(book);
                } else {
                    alert(`一括で登録できる数は${maxRegisterNum}個までです。`);
                }
            }
        }

        private getAuthorIDByName(name: string): number {
            let id = -1;
            this.authors.forEach((x: Author) => {
                if (name === x.name) {
                    id = x.id;
                }
            });
            return id;
        }

        private getPublisherIDByName(name: string): number {
            let id = -1;
            this.publishers.forEach((x: Publisher) => {
                if (name === x.name) {
                    id = x.id;
                }
            });
            return id;
        }

        private createAuthorP() {
            const authorIds: number[] = [];
            const notCreateAuthors: string[] = [];

            return new Promise<number[]>((resolve) => {
                api.author.getCounted().then((res1) => {
                    this.authors = res1.data.content as Author[];
                    this.selectMultiBooks.forEach((x) => {
                        const authorId = this.getAuthorIDByName(x.author);
                        if (authorId === -1) {
                            notCreateAuthors.push(x.author);
                        } else {
                            authorIds.push(authorId);
                        }
                    });
                    const createP: AxiosPromise<ContentResult<Author>>[] = notCreateAuthors.map((x: string) => {
                        return api.author.create({author_name: x})
                    });
                    Promise.all(createP).then((res) => {
                        res.forEach((x) => {
                            const newAuthor = x.data.content as Author;
                            authorIds.push(newAuthor.id);
                        })
                    });
                }).finally(() => {
                    resolve(authorIds);
                });
            });
        }


        private createPublisherP() {
            const publisherIds: number[] = [];
            const notCreatePublishers: string[] = [];

            return new Promise<number[]>((resolve) => {
                api.publisher.getCounted().then((res1) => {
                    this.publishers = res1.data.content as Publisher[];
                    this.selectMultiBooks.forEach((x) => {
                        const publisherId = this.getPublisherIDByName(x.publisherName);
                        if (publisherId === -1) {
                            notCreatePublishers.push(x.publisherName);
                        } else {
                            publisherIds.push(publisherId);
                        }
                    });
                    const createP: AxiosPromise<ContentResult<Publisher>>[] = notCreatePublishers.map((x: string) => {
                        return api.publisher.create({ publisher_name: x});
                    });
                    Promise.all(createP).then((res) => {
                        res.forEach((x) => {
                            const newPublisher = x.data.content as Publisher;
                            publisherIds.push(newPublisher.id);
                        });
                    });
                }).finally(() => {
                    resolve(publisherIds);
                });
            });
        }

        private createBook(x: SearchResultWithCheck): Promise<boolean> {
            return new Promise<boolean>((resolve) => {
                const book = {
                    title: x.title,
                    author_id: this.getAuthorIDByName(x.author),
                    publisher_Id: this.getPublisherIDByName(x.publisherName),
                    medium_image_url: x.mediumImageUrl,
                    small_image_url: x.smallImageUrl,
                    item_url: x.itemUrl,
                    affiliate_url: x.affiliateUrl,
                };
                api.books.create(book).then(() => {
                    resolve(true);
                });
            });
        }


        private createBookMultiple() {
            this.isSaving = true;
            Promise.all([this.createAuthorP(), this.createPublisherP()]).then(() => {
                Promise.all([api.author.getCounted(), api.publisher.getCounted()]).then((value) => {
                    this.authors = value[0].data.content as Author[];
                    this.publishers = value[1].data.content as Publisher[];
                    const p: Promise<boolean>[] = this.selectMultiBooks.map((x) => {
                        return this.createBook(x)
                    });
                    Promise.all(p).catch(() => {
                        console.log('books create error')
                    }).finally(() => {
                        this.isSaving = false;
                        this.$router.push('/bookshelf');
                    });
                });
            }).catch(() => {
                console.log('author/publisher create error')
            }).finally(() => {
                this.isSaving = false;
            });
        }
    }

    function toTop() {
        window.scrollTo(0, 0);
    }

    function itemToResultWithCheck(item: Content): SearchResultWithCheck {
        return {
            title: item.title,
            author: item.author,
            smallImageUrl: item.smallImageUrl,
            mediumImageUrl: item.mediumImageUrl,
            publisherName: item.publisherName,
            itemPrice: item.itemPrice,
            itemUrl: item.itemUrl,
            affiliateUrl: item.affiliateUrl,
            isChecked: false,
        } as SearchResultWithCheck;
    }
</script>

<style scoped>

</style>