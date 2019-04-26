<template>
    <div>
        <nav class="navbar navbar-dark bg-dark">
            <a class="navbar-brand" href="#">サイトタイトル</a>
            <form class="form-inline" style="display: inline;margin-right: 20px;">
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search">
            </form>
            <span style="display: inline"><v-fa icon="plus-circle" size="3x"/></span>
            <span><v-fa icon="sign-out-alt" size="3x"/></span>
        </nav>
        <div class="container-fluid">

            <div class="row">


                <div class="col-6 mx-auto" v-for="book in books">
                    <div class="card" style="margin:10px;padding: 5px;">
                        <div class="row" style="padding: 5px;">
                            <div class="col-6" style="font-size: 25px;">{{ book.title }}</div>
                            <div class="col-4" style="font-size: 15px; position: relative;">
                                <div style="position: absolute; bottom: 0;">{{ book.author }}</div>
                            </div>

                            <!-- TODO bookstatus周り直す-->
                            <div v-if="bookStatus(book.startAt, book.endAt) == 0" class="col-2" style="text-align: right;" @click="changeState"><v-fa icon="book" size="2x"/></div>
                            <div v-if="bookStatus(book.startAt, book.endAt) == 1" class="col-2" style="text-align: right;" @click="changeState"><v-fa icon="book-open" size="2x"/></div>
                            <div v-if="bookStatus(book.startAt, book.endAt) == 2" class="col-2" style="text-align: right;" @click="changeState"><v-fa icon="archive" size="2x"/></div>

                        </div>

                        <div style="background: darkgray; width: 100%;border-radius: 5px;" @click="book.isOpen = !book.isOpen">
                            <span v-if="!book.isOpen" class="description-open-btn"><v-fa icon="caret-down"/></span>
                            <span v-if="book.isOpen" class="description-open-btn"><v-fa icon="caret-up"/></span>
                        </div>
                        <div v-if="book.isOpen">
                            <div class="row">

                                <div class="col-6">
                                    <div class="book-info">
                                        <h5 class="book-description-h5">読書のステータス</h5>
                                        <div>
                                            <label class="book-description-label">読み始めた日:</label>
                                            <span class="badge badge-light badge-white badge-date">{{ book.startAt }}</span>
                                        </div>
                                        <div>
                                            <label class="book-description-label">読み終わった日: </label>
                                            <span class="badge badge-light badge-white badge-date">{{ book.endAt }}</span>
                                        </div>
                                    </div>
                                    <div class="book-info">
                                        <h5 class="book-description-h5">カテゴリー</h5>
                                        <span class="badge badge-light badge-white" v-for="category in book.categorys">{{ category }}</span>

<!--                                        <span class="badge badge-secondary badge-plus" @click="addCategory(book.categorys)"><v-fa icon="plus" size="1x"/></span>-->

                                        <span class="badge badge-secondary badge-plus">
                                            <input v-model="inputCategory" size="3"/>
                                            <v-fa icon="plus" size="1x" @click="addCategory(inputCategory, book.categorys)"/>
                                        </span>

                                    </div>
<!--                                    <div class="book-info">-->
<!--                                        出版日時： yyyy/MM/dd-->
<!--                                    </div>-->
<!--                                    <div class="book-info">-->
<!--                                        <h5 class="book-description-h5">登場人物</h5>-->
<!--                                        <span class="badge badge-light badge-white" v-for="charactor in book.charactors">{{ charactor }}</span>-->
<!--                                        <span class="badge badge-secondary badge-plus" @click="addCharactor(book.charactors)"><v-fa icon="plus" size="1x"/></span>-->
<!--                                    </div>-->
                                    <div class="book-info">
                                        <h5 class="book-description-h5">作品のつながり</h5>
                                        <div>
                                            <label class="book-description-label">前の作品:</label>
                                            <span v-if="book.prevBook != null" class="badge badge-light badge-white">{{ book.prevBook }}</span>
                                            <span v-if="book.prevBook == null" class="badge badge-secondary badge-plus"><v-fa icon="plus" size="1x"/></span>
                                        </div>
                                        <div>
                                            <label class="book-description-label">次の作品:</label>
                                            <span v-if="book.nextBook != null" class="badge badge-light badge-white">{{ book.nextBook }}</span>
                                            <span v-if="book.nextBook == null" class="badge badge-secondary badge-plus"><v-fa icon="plus" size="1x"/></span>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-6">
                                    <div class="card" style="margin: 5px;">
                                        <div style="padding: 5px;">
                                            {{text}}
                                        </div>
                                    </div>
                                    <div class="book-description-date">yyyy/MM/dd</div>
                                    <span class="badge badge-secondary book-description-plus"><v-fa icon="plus" size="1x"/></span>
                                </div>
                            </div>

                        </div>

                    </div>
                </div>






            </div>

        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue } from 'vue-property-decorator';

    interface Books {
        title: string;
        author: string;
        startAt: string;
        endAt: string;
        nextBook: number | null;
        prevBook: number | null;
        categorys: string[];
        charactors: string[];
        isOpen: boolean;
    }
    enum ReadStatus {
        notRead = 0,
        reading = 1,
        read = 2,
    }

    @Component
    export default class BooksView extends Vue {
        private isOpen = true;
        private text = 'メモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモメモ';
        private inputCategory = '';

        private books = Array(
            {
                title: '本のタイトル',
                author: '作者',
                startAt: '2019/04/22',
                endAt: '2019/04/23',
                nextBook: 1,
                prevBook: 2,
                categorys: Array('カテゴリー１', 'カテゴリー２', 'カテゴリー３'),
                charactors: Array('キャラ１', 'キャラ２', 'キャラ３'),
                isOpen: false,
            } as Books,
            {
                title: '本のタイトル2',
                author: '作者2',
                startAt: '2019/04/10',
                endAt: '2019/04/15',
                nextBook: null,
                prevBook: null,
                categorys: Array('カテゴリー4', 'カテゴリー5'),
                charactors: Array('キャラ4', 'キャラ5'),
                isOpen: false,
            } as Books,
        );

        private open() {
            this.isOpen = !this.isOpen;
        }

        private addCategory(add: string, categorys: string[]) {
            categorys.push(add);
            add = '';
        }
        private addCharactor(charactors: string[]) {
            charactors.push('charactor');
        }


        private bookStatus(startAt: string | null, endAt: string | null): ReadStatus {
            if (endAt == null && startAt == null) {
                return ReadStatus.notRead;
            } else if (endAt == null) {
                return ReadStatus.reading;
            } else {
                return ReadStatus.read;
            }
        }


        private changeState(startAt: string | null, endAt: string | null) {
            if (endAt == null && startAt == null) {
                const res = confirm('読み始めた本に設定しますか？');
                if (res) {
                    startAt = '2019/4/23';
                }
            } else if (endAt == null) {
                const res = confirm('読み終わった本に設定しますか？');
                if (res) {
                    endAt = '2019/4/23';
                }
            } else {
                const res = confirm('読み始めた本に設定しますか？');
                if (res) {
                    endAt = null;
                }
            }
        }

    }

</script>

<style scoped>
    .description-open-btn{
        width: 100%;
        display: inline-block;
        text-align: center;
    }
    .badge-white{
        margin: 2px;
        border: solid 1px #6c757d;
        color: #6c757d;
        cursor: pointer;
    }
    .badge-date{
        font-size: 0.9rem;
    }
    .badge-plus{
        margin: 2px;
        width: 65px;
        background: darkgray;
        cursor: pointer;
    }
    .book-info{
        margin: 20px;
        font-size: 0.90rem;
    }
    .book-description-plus{
        width: 100%;
        background: darkgray;
        cursor: pointer;
    }
    .book-description-date{
        font-size: 12px;
        color: #6c757d;
        float:right;
        margin-bottom: 10px;
    }
    .book-description-h5{
        font-size: 1.10rem;
        color: #4e4e4e;
    }
    .book-description-label{
        font-size: 0.95rem;
        margin-right: 5px;
        color: #4e4e4e;
    }
</style>