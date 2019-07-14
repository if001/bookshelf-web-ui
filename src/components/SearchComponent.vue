<template>
    <v-container>
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
    <v-flex>
        <v-layout row wrap justify-start>
            <v-flex class="pa-2" v-for="result in getSearchResult" lg4 md6 sm12 xs12>
                <v-card color="white" class="black--text" @click="selectBook(result.Item)" style="cursor:pointer">
                    <v-layout row>
                        <v-flex xs8>
                            <div class="ma-1" style="width: 100%; float:left; font-size: 1.2em">{{result.Item.title}}</div>
                            <div class="ma-1" style="width: 100%; float:left;">{{result.Item.author}}</div>
                            <div class="ma-1" style="width: 100%; float:left;">{{result.Item.publisherName}} / ￥ {{result.Item.itemPrice}}</div>
                        </v-flex>
                        <v-flex xs4 style="max-height: 128px;">
                            <img style="float:right;" :src="result.Item.mediumImageUrl" height="128px;">
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
                        :total-visible="7"
                        @input="pagenaite()"
                        color="#1e90ff"
                ></v-pagination>
            </v-flex>
        </v-layout>
    </v-flex>
    </v-container>
</template>


<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import api, {Item, SearchResult} from '../api';

    @Component
    export default class SearchComponent extends Vue {
        private validTitleSearchBox: boolean = true;
        private validAuthorSearchBox: boolean = true;
        private searchResult: SearchResult | null = null;
        private inputTitleForSearch: string = '';
        private inputAuthorForSearch: string = '';
        private searchType = 'title';
        private page: number = 1;
        private perPage: number = 16;
        private totalCount: number = 1;

        private searchFormRules = [
            (v: any) => !!v || 'required',
        ];

        @Emit()
        private select(book: Item){}

        private searchTitle() {
            if (this.validateTitleInput() && this.inputTitleForSearch.length !== 0) {
                toTop();
                this.searchType = 'title';
                api.rakuten.searchByTitle(this.inputTitleForSearch, this.page, this.perPage).then((res) => {
                    this.searchResult = res.data as SearchResult;
                    this.totalCount = this.searchResult.pageCount;
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
            if (this.searchResult != null) {
                return this.searchResult.Items;
            } else {
                return [];
            }
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

        private selectBook(book: Item) {
            this.select(book);
        }

    }

    function toTop() {
        window.scrollTo(0, 0);
    }
</script>

<style scoped>

</style>