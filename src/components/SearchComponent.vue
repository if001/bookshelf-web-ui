<template>
    <v-container style="min-height: 600px;">
        <v-layout row wrap align-center>
            <v-flex lg8 md8 sm12 xs12 offset-lg2 offset-md2 class="pa-2">
            <v-form
                    id="title_box"
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
                        @click="scrollBox('title_box')"
                        @click:append-outer="searchTitle()"
                ></v-text-field>
            </v-form>

            <v-form
                    id="author_box"
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
                        @click="scrollBox('author_box')"
                        @click:append-outer="searchAuthor()"
                ></v-text-field>
            </v-form>
        </v-flex>
        </v-layout>

        <v-layout row wrap justify-start>
            <div v-if="isSearchLoading" style="margin: auto;">
                <div style="display:inline-block; padding-right: 15px;">loading...</div>
                <div class="loading loading-content">
                    <v-icon large>fa-book</v-icon>
                </div>
            </div>
            <v-flex v-else class="pa-2" v-for="result in getSearchResult" lg4 md6 sm12 xs12>
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
        <v-layout>
            <v-btn v-if="getSearchResult.length !== 0 && selectMultiBooks.length !==0"
                   fab
                   bottom
                   right
                   color="blue"
                   dark
                   fixed
                   :loading="isSaving"
                   @click="createBookMultiple">
                <!--@click="createModalIsOpen = !createModalIsOpen">-->
                <v-icon>add</v-icon>
            </v-btn>
        </v-layout>
    </v-container>
</template>


<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import api, {SearchResult, Book, Content, Author, Publisher, ContentResult} from "../api";
    import {AxiosPromise} from 'axios';

    export interface SearchResultWithCheck {
        isbn: string;
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
        private isSearchLoading: boolean = false;
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
        private select(book: Content) {}

        private mounted() {
            toTop();
        }

        private searchTitle() {
            if (this.validateTitleInput() && this.inputTitleForSearch.length !== 0) {
                toTop();
                this.isSearchLoading = true;
                this.searchType = 'title';
                api.rakuten.searchByTitle(this.inputTitleForSearch, this.page, this.perPage).then((res) => {
                    this.searchResult = res.data as SearchResult;
                    this.totalCount = this.searchResult.pageCount;
                    this.searchResultWithCheck = this.searchResult.Items.map((x) => {
                        return this.itemToResultWithCheck(x.Item);
                    });
                    this.isSearchLoading = false;
                }).catch(() => {
                    // console.log('search api error');
                });
            }
        }

        private searchAuthor() {
            if (this.validateAuthorInput() && this.inputAuthorForSearch.length !== 0) {
                toTop();
                this.isSearchLoading = true;
                this.searchType = 'author';
                api.rakuten.searchByAuthor(this.inputAuthorForSearch, this.page, this.perPage).then((res) => {
                    this.searchResult = res.data as SearchResult;
                    this.totalCount = this.searchResult.pageCount;
                    this.searchResultWithCheck = this.searchResult.Items.map((x) => {
                        return this.itemToResultWithCheck(x.Item);
                    });
                    this.isSearchLoading = false;
                }).catch(() => {
                    // console.log('search api error');
                });
            }
        }
        private itemToResultWithCheck(item: Content): SearchResultWithCheck {
            return {
                isbn: item.isbn,
                title: item.title,
                author: item.author,
                smallImageUrl: item.smallImageUrl,
                mediumImageUrl: item.mediumImageUrl,
                publisherName: item.publisherName,
                itemPrice: item.itemPrice,
                itemUrl: item.itemUrl,
                affiliateUrl: item.affiliateUrl,
                isChecked: this.isSelect(item.isbn),
            } as SearchResultWithCheck;
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

        private isSelect(isbn: string): boolean {
            let res = false;
            this.selectMultiBooks.forEach((x) => {
               if (x.isbn === isbn) {
                   res = true;
               }
            });
            return res;
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

            return new Promise<number[]>((resolve, reject) => {
                api.author.getCounted()
                    .then((res1) => {
                        this.authors = res1.data.content as Author[];
                        this.selectMultiBooks.forEach((x) => {
                            if (x.author !== '') {
                                const authorId = this.getAuthorIDByName(x.author);
                                if (authorId === -1) {
                                    if (!notCreateAuthors.includes(x.author)) {
                                        notCreateAuthors.push(x.author);
                                    }
                                } else {
                                    authorIds.push(authorId);
                                }
                            }
                        });
                        console.log(notCreateAuthors);
                        const createP: Array<AxiosPromise<ContentResult<Author>>> = notCreateAuthors.map((x: string) => {
                            return api.author.create({author_name: x});
                        });
                        return Promise.all(createP);
                    })
                    .then((res) => {
                        res.forEach((x) => {
                            const newAuthor = x.data.content as Author;
                            authorIds.push(newAuthor.id);
                        });
                        resolve(authorIds);
                    })
                    .catch(() => {
                        console.log('create author error');
                        reject();
                    })
            });
        }


        private createPublisherP() {
            const publisherIds: number[] = [];
            const notCreatePublishers: string[] = [];

            return new Promise<number[]>((resolve, reject) => {
                api.publisher.getCounted()
                    .then((res1) => {
                        this.publishers = res1.data.content as Publisher[];
                        this.selectMultiBooks.forEach((x) => {
                            if (x.publisherName !== '') {
                                const publisherId = this.getPublisherIDByName(x.publisherName);
                                if (publisherId === -1) {
                                    if (!notCreatePublishers.includes(x.publisherName)) {
                                        notCreatePublishers.push(x.publisherName);
                                    }
                                } else {
                                    publisherIds.push(publisherId);
                                }
                            }
                        });
                        const createP: Array<AxiosPromise<ContentResult<Publisher>>> = notCreatePublishers.map((x: string) => {
                            return api.publisher.create({publisher_name: x});
                        });
                        return Promise.all(createP);
                    })
                    .then((res) => {
                        res.forEach((x) => {
                            const newPublisher = x.data.content as Publisher;
                            publisherIds.push(newPublisher.id);
                        });
                        resolve(publisherIds);
                    })
                    .catch(() => {
                        console.log('create publisher error');
                        reject();
                    });
            });
        }

        private createBook(x: SearchResultWithCheck): AxiosPromise {
            const authorID = this.getAuthorIDByName(x.author);
            const publisherID = this.getPublisherIDByName(x.publisherName);
            const book = {
                isbn: x.isbn,
                title: x.title,
                author_id: authorID === -1 ? null : authorID,
                publisher_Id: publisherID === -1 ? null : publisherID,
                medium_image_url: x.mediumImageUrl,
                small_image_url: x.smallImageUrl,
                item_url: x.itemUrl,
                affiliate_url: x.affiliateUrl,
            };
            return api.books.create(book);
        }

        private createBookMultiple() {
            this.isSaving = true;
            Promise.all([this.createAuthorP(), this.createPublisherP()])
                .then(() => {
                    return Promise.all([api.author.getCounted(), api.publisher.getCounted()]);
                })
                .then((value) => {
                    this.authors = value[0].data.content as Author[];
                    this.publishers = value[1].data.content as Publisher[];
                    const p: AxiosPromise[] = this.selectMultiBooks.map((x) => {
                        return this.createBook(x);
                    });
                    return Promise.all(p);
                })
                .then(() => {
                    this.isSaving = false;
                    this.$router.push('/bookshelf');
                })
                .catch(() => {
                    console.log('create error');
                    localStorage.clear();
                    this.$router.push('/login');
                })
                .finally(() => {});
        }

        private scrollBox(elmId: string) {
            // const element: HTMLInputElement = document.getElementById(elmId) as HTMLInputElement;
            // const top: number = element.getBoundingClientRect().top;
            // console.log(top, element.scrollTop);
            // window.scrollTo(0, top);
        }
    }

    function toTop() {
        window.scrollTo(0, 0);
    }
</script>

<style scoped>
    .loading {
        display: inline-block;
        font-size: 3em;
    }

    .loading-content {
        animation: r1 1s linear infinite;
    }

    @keyframes r1 {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>