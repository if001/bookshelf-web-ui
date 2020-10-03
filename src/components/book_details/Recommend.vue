<template>
    <v-row class="pa-0 ma-0" v-if="isEndState() && !isOpenEdit">
        <v-col cols="12">
            <v-btn outlined
                   small
                   :loading="isSearchLoading"
                   @click="setRecommendByRakutenSearch()">おすすめの本を取得</v-btn>
        </v-col>

        <v-col cols="12" class="ma-0 pa-3 pb-0 body-2"
               style="color: dimgrey;"
               v-if="recommends.length !== 0">
            あなたへのおすすめ
        </v-col>

        <div v-for="book in recommends" class="pa-3">
            <div>
                <a v-if="book.smallImageUrl"
                   @click="openDetailModal(book)">
                    <v-tooltip top>
                        <template v-slot:activator="{ on }">
                            <img :src="book.smallImageUrl"
                                 v-on="on"
                                 style="float:right;" height="80px" alt="bookImage">
                        </template>
                        <span style="font-size: 0.9em">詳細を見る</span>
                    </v-tooltip>
                </a>
                <img v-else src="@/assets/not_found.png" alt="not_found" height="80px">
            </div>
            <div class="body-2" style="color: gray; max-width: 56px;">
                {{parseBookTitleAtRecommend(book.title)}}
            </div>
        </div>

        <div v-if="searchError" class="pa-3 pt-0 body-2">
            検索に失敗しました
        </div>
        <div v-if="searched && recommends.length === 0" class="pa-3 pt-0 body-2">
            現在おすすめはありません
        </div>


        <detail_modal :dialog="openDialog"
                      :isbn="selectBookISBN"
                      @closeDialogEvent="dialogPropsHandle"
                      @registerSuccessEvent="registerSuccessHandle"
        ></detail_modal>

        <div style="position: fixed; top: 60px; right: 1.0em; z-index: 100;">
            <v-alert v-model="registerAlert"
                     type="success"
                     border="left"
                     close-text="Close Alert"
                     dismissible>
                登録しました
            </v-alert>
        </div>
    </v-row>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {BookStateEnd, getBookState} from '@/models/BookState';
    import rakutenAPI, {Content, makeEmptyQuery, SearchResult} from '@/rakutenAPI';
    import NotRegisterBookDetailModalComponent from '@/components/book_details/NotRegisterBookDetailModalComponent.vue';
    import {Book} from '@/api';

    @Component({
        components: {
            detail_modal: NotRegisterBookDetailModalComponent,
        },
    })
    export default class Recommend extends Vue {
        @Prop() private isOpenEdit!: boolean;
        @Prop() private book!: Book;
        @Prop() private toStateEnd!: boolean;

        private recommends: Content[] = [];
        private isSearchLoading: boolean = false;
        private openDialog: boolean = false;
        private selectBookISBN: string | null = null;
        private registerAlert = false;
        private searchError: boolean = false;
        private searched: boolean = false;

        private openDetailModal(selectBook: Content) {
            this.selectBookISBN = selectBook.isbn;
            this.openDialog = true;
        }

        private setRecommendByRakutenSearch(): Promise<void> | undefined {
            this.searched = false;
            this.isSearchLoading = true;

            const query = makeEmptyQuery();
            query.setPaginate(1, 4);
            if (this.book && this.book.author) {
                let authorName = this.book.author.name;
                if (this.book.author.name.includes('/')) {
                    authorName = this.book.author.name.split('/')[0];
                }
                query.setAuthor(authorName);
                query.setSort('sales');
                return rakutenAPI.search(query).then()
                    .then((res) => {
                        const result  = res.data as SearchResult;
                        this.recommends = [];
                        this.recommends = result.Items.map((x) => x.Item);
                    })
                    .catch((e) => {
                        this.searchError = true;
                        setTimeout(() => {
                            this.searchError = false;
                        }, 3000);
                    })
                    .finally(() => {
                        this.isSearchLoading = false;
                        this.searched = true;
                    });
            }
        }

        private parseBookTitleAtRecommend(title: string): string {
            if (title.length > 15) {
                return title.slice(0, 15) + '...';
            } else {
                return title;
            }
        }

        private dialogPropsHandle(e: boolean) {
            this.openDialog = e;
        }
        private registerSuccessHandle(e: boolean) {
            this.registerAlert = e;
            setTimeout(() => {
                this.registerAlert = false;
            }, 3000);
        }

        @Watch('toStateEnd')
        private loadRecommend() {
            // TODO おすすめの本を表示するのは楽天のAPIを叩く回数を減らすため、ステータスを読了に変更したときのみとする
            if (this.book && this.toStateEnd) {
                this.setRecommendByRakutenSearch();
            }
        }

        private isEndState(): boolean {
            if (this.book) {
                return getBookState(this.book) === BookStateEnd;
            } else {
                return false;
            }
        }
    }
</script>
