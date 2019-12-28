<template>
    <v-app light>
    <v-container>
      <!--   <v-toolbar
                fixed
                color="blue accent-2"
                dark
                height="50">
            <div style="font-weight: 400;">
                <router-link :to="{name:'booksView'}" class="title">BookStorage</router-link>
            </div>
        </v-toolbar> -->
        <v-row justify="center">
            <v-col cols=10 lg=8 md=8 sm=8 class="ma-5 pa-0" offset=1 offset-lg=2 offset-md=2 offset-sm=2>
                <div style="text-align: center;background: #eeeeee; cursor:pointer;" @click="toRegisterPage">
                    <img src="@/assets/logo.png" width="12%">
                </div>
            </v-col>
        </v-row>

        <v-row v-if="searchResult != null" justify="center">
            <v-col cols=10 lg=8 md=8 sm=8 class="ma-0 pa-0" offset=1 offset-lg=2 offset-md=2 offset-sm=2>
                <v-card class="black--text ma-0">
                    <v-row justify="center">
                        <v-col cols=12 class="pa-6">
                            <v-card-text primary-title class="pa-0 ma-0">
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
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-col style="height: 200px;" cols=12 class="pa-6">
                            <div v-if="bookImage != null && bookImage !== ''" style="text-align: center;">
                                <v-tooltip top>
                                    <template v-slot:activator="{ on }">
                                        <a :href="searchResult.affiliateUrl" target="_blank">
                                            <img :src="searchResult.largeImageUrl" height="200px" alt="bookImage" style="text-align: center;" v-on="on">
                                        </a>
                                    </template>
                                    <span style="font-size: 0.9em">詳細を見る</span>
                                </v-tooltip>
                            </div>
                            <div v-else>
                                <img src="@/assets/not_found.png" alt="not_found" height="128px">
                            </div>
                        </v-col>
                    </v-row>

                    <v-row justify="center">
                        <v-col cols=12 class="pa-6">
                            <div style="font-size: 1.1em;">
                                概要
                            </div>
                            <div>
                                {{searchResult.itemCaption}}
                            </div>
                        </v-col>
                    </v-row>

                    <v-divider light></v-divider>

                    <v-row class="pa-2">
                        <v-col>
                            <v-btn text
                                   outlined
                                   :href="searchResult.affiliateUrl" target="_blank">
                                商品ページへ
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>

            <v-col cols=12 class="ma-3 mt-5">
                <div style="text-align: center">
                    <v-btn outlined @click="toRegisterPage">
                        本の管理を始める
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-container>
    </v-app>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import api, {Content, SearchResult, getToken} from '../api';

    @Component
    export default class SharePageView extends Vue {

        private searchResult: Content | null = null;

        private mounted() {
            const id = this.$route.params.id;
            if (id === '') {
                this.toRegisterPage()
            }
            api.book.getLimited(parseInt(id, 10))
                .then((res) => {
                    return new Promise<string>((resolve, reject) => {
                        if (res.data.content && res.data.content.isbn) {
                            resolve(res.data.content.isbn)
                        } else {
                            reject("not found")
                        }
                    })
                })
                .then((isbn: string) => {
                    return api.rakuten.searchByISBN(isbn)
                })
                .then((res) => {
                    const result  = res.data as SearchResult;
                    if (result.Items.length > 0) {
                        this.searchResult = result.Items[0].Item;
                    }
                })
                .catch((err) => {
                    // this.setAlertMessage('検索エラー');
                    // console.log('search api error:', err);
                    this.toRegisterPage()
                })
                .finally(() => {
                    // this.isSearchLoading = false;
                });
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
