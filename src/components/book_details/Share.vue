<template xmlns:v-slot="http://www.w3.org/1999/XSL/Transform">
    <v-row column justify-end class="ma-0 pr-2 pl-2 pt-1 pb-1" v-if="!isOpenEdit">
        <v-col class="pa-0" cols="4">

            <v-tooltip top v-model="showShare">
                <template v-slot:activator="{ on }">
                    <div  class="twitter-link share-button" v-on="on">
                        <a v-if="hasLink"
                           :href="createTwitterURL()"
                           onClick="window.open(encodeURI(decodeURI(this.href)), 'tweetwindow', 'width=650, height=470, personalbar=0, toolbar=0, scrollbars=1, sizable=1'); return false;"
                           rel="nofollow"
                           style="text-decoration:none;">
                            <img src="@/assets/twitter-icon-96.png" alt="twittericon" height="24px" style="vertical-align: middle; ">
                            Share
                        </a>
                    </div>
                </template>
                <span>読み終わった本をShareしましょう</span>
            </v-tooltip>

            <!--            <div v-if="!hasLink" class="twitter-link-disable share-button">-->
            <!--                <img src="@/assets/twitter-icon-96-disable.png" alt="twittericon" height="24px" style="vertical-align: middle; padding: 2px">-->
            <!--                Share-->
            <!--            </div>-->
        </v-col>
    </v-row>
</template>


<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    import {Book} from '@/api';
    import {BookStateEnd, BookStateNotRead, BookStateReading, getBookState} from '@/models/BookState';

    @Component
    export default class Share extends Vue {
        @Prop() private showShareProp: boolean = false;
        @Prop() private book!: Book;
        @Prop() private isOpenEdit!: boolean;

        private showShare: boolean = false;
        private hasLink: boolean = false;

        @Watch('showShareProp')
        private setShowShare() {
            this.showShare = this.showShareProp;
        }

        @Watch('book')
        private createTwitterURL(): string {
            if (this.book == null) {
                this.hasLink = false;
                return '';
            } else {
                this.hasLink = true;
                const base = 'https://twitter.com/intent/tweet';
                let text = '';
                let hashTag = '読書';

                switch (getBookState(this.book)) {
                    case BookStateNotRead:
                        text = 'を読み始めた本に登録しました。%0a';
                        break;
                    case BookStateReading:
                        text = 'を読書中です。%0a';
                        break;
                    case BookStateEnd:
                        text = 'を読み終わりました。%0a';
                        hashTag = `${hashTag},読了`;
                        break;
                }

                let bookInfo = this.book.title;
                if (this.book.author != null) {
                    bookInfo += '(' + this.book.author.name + ')';
                }

                let bookURL = '';
                if (this.book.affiliate_url != null) {
                    bookURL = 'https://bookstorage.edgwbs.net/share/' + this.book.id.toString();
                    // bookURL = this.bookForEdit.affiliate_url;
                }
                return base + '?text=' + ' [' + bookInfo + '] ' + text + '&hashtags=' + hashTag + '&url=' + bookURL;
            }
        }

    }
</script>

<style scoped>
    .twitter-link {
        font-size: 0.9em;
        margin: 5px;
        padding-left: 8px;
        padding-right: 8px;
        font-weight: bold;
        color: #03a9f4;/*文字色*/
        background: #FFF;
        border: solid 1px #03a9f4;/*線*/
        border-radius: 10px;/*角の丸み*/
    }
    .twitter-link-disable {
        font-size: 0.9em;
        margin: 5px;
        padding-left: 8px;
        padding-right: 8px;
        font-weight: bold;
        color: gray;/*文字色*/
        background: #FFF;
        border: solid 1px gray;/*線*/
        border-radius: 10px;/*角の丸み*/
    }

    .share-button {
        /*width: 100px;*/
    }
</style>
