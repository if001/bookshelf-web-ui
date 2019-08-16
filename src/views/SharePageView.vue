<template>
    <v-container>
        <v-toolbar
                fixed
                color="blue accent-2"
                dark
                height="50">
            <div style="font-weight: 400;">
                <router-link :to="{name:'booksView'}" class="title">BookStorage</router-link>
            </div>
        </v-toolbar>


        <v-layout column class="ma-2"style="padding-top: 50px;">
<!--            <v-flex lg12 md12 sm12 xs12 class="ma-1 mb-3">-->
<!--                <h1>-->
<!--                    <router-link :to="{name:'booksView'}">Book Strage</router-link>-->
<!--                </h1>-->
<!--            </v-flex>-->

            <v-flex v-if="searchResult != null" lg8 md8 sm8 xs8>
                <v-card class="black--text">
                    <v-layout column>
                        <v-flex lg12 md12 sm12 xm12>
                            <v-card-text primary-title>
                                <div class="headline">
                                    {{searchResult.title}}
                                </div>
                                <div style="font-size: 1.2em;">
                                    {{searchResult.author}}
                                </div>
                                <div style="font-size: 1.2em;">
                                    ({{searchResult.publisherName}})
                                </div>
                            </v-card-text>
                        </v-flex>
                    </v-layout>

                    <v-layout column class="pa-3">
                        <v-flex style="height: 200px;" lg12 md12 sm12 xm12>
                            <div v-if="bookImage != null && bookImage !== ''">
                                <a :href="searchResult.affiliateUrl" target="_blank">
                                    <img :src="searchResult.largeImageUrl" height="200px" alt="bookImage">
                                </a>
                            </div>
                            <div v-else>
                                <img src="@/assets/not_found.png" alt="not_found" height="128px">
                            </div>
                        </v-flex>
                    </v-layout>

                    <v-layout class="pa-3">
                        <v-flex lg12 md12 sm12 xs12>
                            <div style="font-size: 1.1em;">
                                概要
                            </div>
                            <div>
                                {{searchResult.itemCaption}}
                            </div>
                        </v-flex>
                    </v-layout>

                    <v-divider light></v-divider>

                    <v-layout class="pa-2">
                        <v-flex>
                            <v-btn text
                                   outlined
                                   :href="searchResult.affiliateUrl" target="_blank">
                                商品ページへ
                            </v-btn>
                        </v-flex>
                    </v-layout>
                </v-card>
            </v-flex>

            <v-flex lg12 md12 sm12 xs12 class="ma-3 mt-5">
                <div style="text-align: center">
                    <v-btn outlined @click="toRegisterPage">
                        本の管理を開始する
                    </v-btn>
                </div>
            </v-flex>

        </v-layout>


    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import api, {Content, SearchResult} from '../api';

    @Component
    export default class SharePageView extends Vue {

        private searchResult: Content | null = null;

        private mounted() {
            const isbn = this.$route.params.isbn;
            if (isbn !== '') {
                api.rakuten.searchByISBN(isbn).then((res) => {
                    const result  = res.data as SearchResult;
                    console.log(result);
                    // this.searchResult = res.data as SearchResult;
                    if (result.Items.length > 0) {
                        this.searchResult = result.Items[0].Item;
                    }
                }).catch((err) => {
                    // this.setAlertMessage('検索エラー');
                    // console.log('search api error');
                }).finally(() => {

                    // this.isSearchLoading = false;
                });
            }
        }

        get bookImage(): string | null {
            if (this.searchResult != null) {
                return this.searchResult.mediumImageUrl;
            } else {
                return null;
            }
        }

        private toRegisterPage() {
            this.$router.push('/login');
        }

    }
</script>

<style scoped>
    .title {
        text-decoration: none;
        color:white;
    }
</style>
