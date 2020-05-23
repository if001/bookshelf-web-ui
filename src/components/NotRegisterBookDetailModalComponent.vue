<template>
    <v-dialog
            v-model="isOpenDialog"
            :width=dialogWidth()
    >
        <v-card class="pa-5">
            <v-row justify="center">
                <v-col col="10" lg="8" md="8" align="center">
<!--                    <h2>{{this.searchBook ? this.searchBook.title : ''}}</h2>-->
                    <p style="font-size: 1.4em;font-weight: bold;">{{title}}</p>
                    <p>{{author}}</p>
                    <p>{{publisher}}</p>
                    <p v-if="bookImage">
                        <a :href="aflink" target="_blank">
                            <v-tooltip bottom>
                                <template v-slot:activator="{ on }">
                                    <img v-on="on" :src="bookImage" alt="book_img" height="128px" style="">
                                </template>
                                <span v-if="aflink" style="font-size: 0.9em">商品ページを見る</span>
                            </v-tooltip>
                        </a>
                    </p>
                    <p v-else>
                        <img src="@/assets/not_found.png" alt="not_found" height="128px" style="">
                    </p>
                    <p>{{caption}}</p>
                    <v-btn @click="registerBook" outlined>登録 <v-icon small right style="color: black">mdi-plus</v-icon></v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
    import {Vue, Prop, Component, Watch} from 'vue-property-decorator';
    import rakutenAPI, {Content, makeEmptyQuery, RakutenSearchQuery, SearchResult} from '@/rakutenAPI';
    import api, {Author, Publisher, ContentResult, getToken, errorRoute} from '@/api';
    // import rakutenAPI, {SearchResult, Content, RakutenSearchQuery} from '@/rakutenAPI';
    import {AxiosPromise, AxiosResponse} from 'axios';

    interface Book extends Content{}

    @Component
    export default class NotRegisterBookDetailModalComponent extends Vue {
        @Prop() private isbn!: string | null;
        @Prop() private dialog!: boolean;
        private isOpenDialog: boolean = this.dialog;
        private searchBook: Book | null = null;

        @Watch('dialog')
        private onValueChange(newValue: boolean, oldValue: boolean): void {
            this.isOpenDialog = newValue;
            if (this.isOpenDialog && this.isbn) {
                const query = makeEmptyQuery();
                query.setISBN(this.isbn);
                this.loadBook(query);
            }
        }

        @Watch('isOpenDialog')
        private closeDialogProps() {
            this.$emit('closeDialogEvent', this.isOpenDialog);
        }

        get title() {
            return this.searchBook? this.searchBook.title: '';
        }
        get author() {
            return this.searchBook? this.searchBook.author: '';
        }
        get publisher() {
            return this.searchBook? this.searchBook.publisherName: '';
        }
        get caption() {
            return this.searchBook? this.searchBook.itemCaption: '';
        }
        get bookImage() {
            return this.searchBook? this.searchBook.mediumImageUrl: '';
        }
        get aflink() {
            return this.searchBook? this.searchBook.affiliateUrl: '';
        }

        private dialogWidth(): string {
            return this.breakPointXS() ? "90%" : '60%';
        }

        private loadBook(query: RakutenSearchQuery) {
            rakutenAPI.search(query)
                .then((res) => {
                    const result = res.data as SearchResult;
                    if (result.Items.length >= 1) {
                        this.searchBook = result.Items[0].Item;
                    }
                });
        }

        private registerBook() {
            if (this.searchBook) {
                registerBook(this.searchBook)
                    .then(() => {
                        this.isOpenDialog = false;
                        this.$emit('closeDialogEvent', this.isOpenDialog);
                        this.$emit('registerSuccessEvent', true);
                    })
                    .catch((err) => {
                        // todo エラーハンドルどうする？
                        // console.log(err);
                    });
            }
        }

        private breakPointXS(): boolean {
            return this.$vuetify.breakpoint.name === 'xs';
        }
    }

    function registerBook(searchBook: Book): AxiosPromise {
        return getToken()
            .then((token) => {
                const book = {
                    isbn: searchBook.isbn,
                    title: searchBook.title,
                    author_name: searchBook.author,
                    publisher_name: searchBook.publisherName,
                    medium_image_url: searchBook.mediumImageUrl,
                    small_image_url: searchBook.smallImageUrl,
                    item_url: searchBook.itemUrl,
                    affiliate_url: searchBook.affiliateUrl,
                };
                return api.books.createWith(token, book);
            });
    }

</script>

<style scoped>
.mw-9 {
    max-width: 90%;
}
.mw-6 {
    max-width: 60%;
}
</style>
