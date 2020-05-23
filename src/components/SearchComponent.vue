<template>
    <v-container class="pr-0 pl-0 pt-0" style="">
        <v-row align="center" justify="center">
            <v-col cols=12 lg="8" md="8" class="pa-2 ma-0">
                <v-form
                        id="title_box"
                        ref="titleForm"
                        v-model="validTitleSearchBox"
                        lazy-validation
                        @submit.prevent="searchBook()"
                        >
                    <v-text-field
                            flat
                            label="Search By Title"
                            v-model="inputTitleForSearch"
                            required
                    ></v-text-field>
                    <v-text-field
                            flat
                            label="Search By Author"
                            v-model="inputAuthorForSearch"
                            required
                    ></v-text-field>
                    <v-text-field
                            flat
                            label="Search By ISBN(10桁)"
                            v-model="inputISBNForSearch"
                            required
                    ></v-text-field>
                    <v-row align="center" justify="center" class="d-flex flex-row">
                        <div class="d-flex flex-row align-center" cols="12" lg="3" md="3" align="center">
                            <div id="searchButton" class="pr-4">
                                <v-btn v-if="inputTitleForSearch.length !== 0 || inputAuthorForSearch.length !== 0 || inputISBNForSearch.length !== 0"
                                       type="submit"
                                       outlined
                                       :loading="isSearchLoading">
                                    search
                                    <v-icon>mdi-search-web</v-icon>
                                </v-btn>
                                <v-btn v-else
                                       outlined
                                       disabled>
                                    search
                                    <v-icon>mdi-search-web</v-icon>
                                </v-btn>
                            </div>
                            <v-select
                                    v-model="selectSearchCondition"
                                    :items="searchCondition"
                                    item-text="displayName"
                                    item-value="key"
                                    append-icon="mdi-chevron-down"
                                    label="検索条件"
                                    @change="changeSearchCondition()"
                                    return-object
                                    style="width: 100px;"></v-select>
                        </div>
                    </v-row>
                </v-form>
            </v-col>

            <v-col cols="12" lg="8" md="12" align="center">
            </v-col>
        </v-row>

        <v-row justify="center">
            <v-col cols="12" lg="6" md="6" sm="6">
                <v-alert
                        v-if="alert"
                        v-model="alert"
                        dismissible
                        color="error"
                        icon="mdi-alert"
                        outlined
                        @click="alert = false">
                    <div>{{ message }}</div>
                    <div>{{ message2 }}</div>
                </v-alert>
            </v-col>
        </v-row>

        <v-row justify="start">
            <div v-if="isSearchLoading" style="margin: auto;">
                <div style="display:inline-block; padding-right: 15px;">loading...</div>
                <div class="loading loading-content">
                    <v-icon large>fa-book</v-icon>
                </div>
            </div>
            <div v-if="searchResult != null && searchResult.Items.length === 0"
                 class="pa-5"
                 style="margin: auto;">
                検索結果はありません。
            </div>

            <v-col cols="12" lg="4" md="4" sm="6" v-else class="pa-2" v-for="result in getSearchResult" v-bind:key="result.isbn">
                <v-card raised color="white" class="black--text" @click="selectBook(result)" style="cursor:pointer">
                    <v-row no-gutters>
                        <v-col cols="8" class="ma-0 pa-2">
                            <div class="ma-1" style="width: 100%; float:left; font-size: 0.9em; font-weight: 600;">{{reshapeString(result.title)}}</div>
                            <div class="ma-1" style="width: 100%; float:left; font-size: 0.8em">{{result.author}}</div>
                            <div class="ma-1" style="width: 100%; float:left; font-size: 0.7em; color: dimgrey;">{{result.publisherName}} /  {{result.itemPrice}} 円</div>
                            <v-btn v-if="result.isChecked"
                                   fab
                                   dark
                                   color="blue"
                                   small
                                   style="position:absolute; top: 0; right: 0;">
                                <v-icon small dark>mdi-check</v-icon>
                            </v-btn>
                            <v-btn v-if="result.isAlreadyRegister"
                                   fab
                                   dark
                                   color="green"
                                   small
                                   style="position:absolute; top: 0; right: 0;">
                                済
                            </v-btn>
                        </v-col>
                        <v-col cols="4" class="ma-0 pa-0" style="max-height: 128px;">
                            <img style="float:right;" :src="result.mediumImageUrl" height="128px;">
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-row justify="center" v-if="getSearchResult.length !== 0">
            <v-col cols="12" class="mt-2 mb-4 text-xs-center">
                <v-pagination
                        v-model="page"
                        :length=totalCount
                        @input="pagenaite()"
                        total-visible="5"
                        color="#1e90ff"
                ></v-pagination>
            </v-col>
        </v-row>

        <v-row>
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
                <v-icon>mdi-plus</v-icon>
            </v-btn>
        </v-row>
    </v-container>
</template>


<script lang="ts">
    import {Component, Emit, Vue} from 'vue-property-decorator';
    import api, {Author, Publisher, ContentResult, getToken, errorRoute} from '@/api';
    import rakutenAPI, {SearchResult, Content, RakutenSearchQuery} from '@/rakutenAPI';
    import {AxiosPromise, AxiosResponse} from 'axios';

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
        isAlreadyRegister: boolean;
    }
    const maxRegisterNum: number = 8;

    @Component
    export default class SearchComponent extends Vue {
        private validTitleSearchBox: boolean = true;
        private validAuthorSearchBox: boolean = true;
        private searchResult: SearchResult | null = null;
        private searchResultWithCheck: SearchResultWithCheck[] = [];
        private isSearchLoading: boolean = false;
        private inputTitleForSearch: string = '';
        private inputAuthorForSearch: string = '';
        private inputISBNForSearch: string = '';

        private rakutenSearchQuery: RakutenSearchQuery | null = null;

        private page: number = 1;
        private perPage: number = 18;
        private totalCount: number = 1;
        private isSaving: boolean = false;
        private selectMultiBooks: SearchResultWithCheck[] = [];

        private authors: Author[] = [];
        private publishers: Publisher[] = [];

        private alert: boolean = false;
        private message: string = '';
        private message2: string = '';

        private searchCondition = [
            {key: 'book', displayName: '本'},
            {key: 'e_book', displayName: '電子書籍'},
        ];
        private selectSearchCondition = {key: 'book', displayName: '本'};

        private searchFunc = rakutenAPI.search;

        @Emit()
        private select(book: Content) {}

        private mounted() {
            toTop();
        }

        private searchBook() {
            this.resetAlertMessage();
            this.rakutenSearchQuery = new RakutenSearchQuery(
                this.inputTitleForSearch,
                this.inputAuthorForSearch,
                this.inputISBNForSearch,
                this.page,
                this.perPage,
                null,
            );
            this.searchByRakuten();
        }


        private searchByRakuten() {
            toTop();
            this.isSearchLoading = true;
            this.alert = false;

            if (!this.rakutenSearchQuery) {
                this.isSearchLoading = false;
                return;
            }
            if (this.inputAuthorForSearch.length === 0 && this.inputTitleForSearch.length === 0
                && this.inputISBNForSearch.length === 0) {
                this.setAlertMessage('入力してください');
                this.isSearchLoading = false;
                return;
            }

            this.searchFunc(this.rakutenSearchQuery)
                .then((res) => {
                    this.searchResult = res.data as SearchResult;
                    this.totalCount = this.searchResult.pageCount;
                    this.searchResultWithCheck = this.searchResult.Items.map((x) => {
                        return this.itemToResultWithCheck(x.Item);
                    });
                    toSearchBox();
                })
                .catch((e) => {
                    console.log(e);
                    this.setAlertMessage('検索エラー');
                    // console.log('search api error');
                })
                .finally(() => {
                    this.isSearchLoading = false;
                });
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
                isAlreadyRegister: false,
            } as SearchResultWithCheck;
        }

        get getSearchResult() {
            return this.searchResultWithCheck;
        }

        private pagenaite() {
            if (this.rakutenSearchQuery) {
                this.rakutenSearchQuery.setPaginate(this.page, this.perPage);
                this.searchByRakuten();
            }
        }

        private selectBook(book: SearchResultWithCheck) {
            book.isAlreadyRegister = false;
            if (book.isChecked) {
                book.isChecked = false;
                const ind = this.selectMultiBooks.indexOf(book);
                this.selectMultiBooks.splice(ind, 1);
            } else {
                if (this.selectMultiBooks.length < maxRegisterNum) {
                    book.isChecked = true;
                    this.selectMultiBooks.push(book);
                    if (this.selectSearchCondition.key === 'book') {
                        getToken()
                            .then((token) => {
                                return api.books.list(token, null, null, null, null, book.isbn, null);
                            })
                            .then((res) => {
                                if (res.data.content.total_count > 0) {
                                    book.isAlreadyRegister = true;
                                }
                            })
                            .catch((err) => {
                                console.log('get isbn error');
                            });
                    }
                } else {
                    alert(`一括で登録できる数は${maxRegisterNum}個までです。`);
                }
            }
        }

        private resetSelectBook() {
            this.selectMultiBooks.forEach((x) => {
                x.isChecked = false;
            });
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
            let tmpToken = '';
            return new Promise<number[]>((resolve, reject) => {
                getToken()
                    .then((token) => {
                        tmpToken = token;
                        return api.author.getCounted(token);
                    })
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
                        // TODO tmpTokenでは、thenの中の処理中にtokenが失効した場合に死ぬ
                        const createP: Array<AxiosPromise<ContentResult<Author>>> =
                            notCreateAuthors.map((x: string) => {
                                return api.author.create(tmpToken, {author_name: x});
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
                    });
            });
        }


        private createPublisherP() {
            const publisherIds: number[] = [];
            const notCreatePublishers: string[] = [];
            let tmpToken = '';

            return new Promise<number[]>((resolve, reject) => {
                getToken()
                    .then((token) => {
                        tmpToken = token;
                        return api.publisher.getCounted(token);
                    })
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
                        const createP: Array<AxiosPromise<ContentResult<Publisher>>>
                            = notCreatePublishers.map((x: string) => {
                            return api.publisher.create(tmpToken, {publisher_name: x});
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
            return getToken()
                .then((token) => {
                    return api.books.create(token, book);
                });
        }

        private createBookMultiple() {
            this.isSaving = true;
            Promise.all([this.createAuthorP(), this.createPublisherP()])
                .then(() => {
                    return getToken();
                })
                .then((token) => {
                    return Promise.all([api.author.getCounted(token), api.publisher.getCounted(token)]);
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
                    this.$router.push('/bookshelf');
                })
                .catch((err) => {
                    console.log(err);
                    console.log(err.response);
                    if (err.response.data && err.response.data.content) {
                        this.message2 = err.response.data.content.title;
                    }
                    this.setAlertMessage( '登録に失敗しました。');
                    this.resetSelectBook();
                    errorRoute('search component: ' + err.toString());
                })
                .finally(() => {
                    this.selectMultiBooks = [];
                    this.isSaving = false;
                });
        }

        private scrollBox(elmId: string) {
            // const element: HTMLInputElement = document.getElementById(elmId) as HTMLInputElement;
            // const top: number = element.getBoundingClientRect().top;
            // console.log(top, element.scrollTop);
            // window.scrollTo(0, top);
        }

        private resetAlertMessage() {
            this.message = '';
            this.message2 = '';
        }

        private setAlertMessage(msg: string) {
            this.alert = true;
            this.message = msg;
        }

        private reshapeString(st: string): string {
            if (st.length > 20) {
                return st.slice(0, 20) + '....';
            } else {
                return st;
            }
        }

        private changeSearchCondition() {
            if (this.selectSearchCondition.key === 'book') {
                this.searchFunc = rakutenAPI.search;
            } else if (this.selectSearchCondition.key === 'e_book') {
                this.searchFunc = rakutenAPI.searchEbook;
            }
        }
    }

    function toTop() {
        window.scrollTo(0, 0);
    }

    function toSearchBox() {
        const target = document.getElementById('searchButton');
        if (target) {
            const posY = target.getBoundingClientRect().top;
            window.scrollTo(0, posY + window.pageYOffset);
        }
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
    .booklist {
        font-size: 0.8em;
    }

    @keyframes r1 {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
</style>
