<template>
    <v-container style="height: 100%">
        <v-row>
            <v-col style="position: static">
              <div id="cameraArea" class="camera_content">
                  <div v-show="isSearch" class="camera_content loading">
                      <v-btn
                              :loading="isSearch"
                              color="blue-grey"
                              class="ma-2 white--text"
                              fab
                              style="position: absolute; left: 120px; top:92px; z-index: 50;opacity: 1">
                          <v-icon dark>
                              mdi-check
                          </v-icon>
                      </v-btn>
                  </div>
              </div>
            </v-col>
        </v-row>

        <v-row v-if="initFail" justify="center" justify-content="space-around">
            <v-col cols="2" align="center">
                <v-btn v-on:click="initQuagga()">
                    ReStart Camera
                </v-btn>
            </v-col>
<!--            <v-col cols="2" align="center">-->
<!--                <v-btn v-on:click="addBook()">-->
<!--                    add-->
<!--                </v-btn>-->
<!--            </v-col>-->
        </v-row>

        <div id="books"
             class="pa-3 pl-0 register_content"
             style="width:0; position: static"
             v-bind:class="{ register_scroll: isScrollY,
             register_max90 : this.$vuetify.breakpoint.xs,
             register_max60: !this.$vuetify.breakpoint.xs}">
            <div v-for="book in searchResults" class="pa-3" style="display: inline-block">
                <div>
                    <a v-if="book.mediumImageUrl"
                       :href="book.affiliateUrl"
                       target="_blank">
                        <v-tooltip top>
                            <template v-slot:activator="{ on }">
                                <img :src="book.mediumImageUrl"
                                     v-on="on"
                                     style="float:right;" height="128px" alt="bookImage">
                            </template>
                            <span style="font-size: 0.9em">詳細を見る</span>
                        </v-tooltip>
                    </a>
                    <img v-else src="@/assets/not_found.png" alt="not_found" height="128px">
                </div>
                <div class="body-2" style="color: gray; max-width: 83px;">
                    {{parseBookTitleAtRecommend(book.title)}}
                </div>
                <v-btn fab dark x-small
                       color="grey darken-1"
                       class="remove_button"
                       v-on:click="removeBook(book.isbn)">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
            </div>
        </div>

        <v-row justify="center" v-if="searchResults.length !== 0">
            <v-col cols="10" lg="3" md="3" sm="3" align="center" class="pt-6">
                <v-btn v-on:click="registerBooks()"
                       :loading="isSaving"
                       color="info"
                       block>登録</v-btn>
            </v-col>
        </v-row>

        <div style="position: fixed; top: 60px; right: 1.0em; z-index: 100;">
            <v-alert
                    v-if="error.show"
                    v-model="error.show"
                    dismissible
                    color="error"
                    icon="mdi-alert"
                    border="left"
                    @click="error.show = false">
                <div>{{ error.msg }}</div>
            </v-alert>
            <v-alert
                    v-if="success.show"
                    v-model="success.show"
                    dismissible
                    color="success"
                    icon="mdi-check"
                    border="left"
                    @click="success.show = false">
                <div>{{ success.msg }}</div>
            </v-alert>
        </div>

    </v-container>
</template>

<script lang="ts">
    import {BaseComponent} from '@/utils/utils';
    import {Component} from 'vue-property-decorator';
    import rakutenAPI, {SearchResult, makeEmptyQuery} from '@/rakutenAPI';
    import {itemToResultWithCheck, SearchResultWithCheck} from '@/models/RakutenBook';
    import api, {getToken, PostBookForm} from '@/api';

    @Component
    export default class CameraRegisterComponent extends BaseComponent {
        private quagga = require('quagga');
        private codes: string[] = [];

        private bookWidth = 90 + 12 + 12;
        private isScrollY = false;

        private searchResults: SearchResultWithCheck[] = [];
        private rakutenSearchQuery = makeEmptyQuery();

        private isSearch = false;
        private isSaving = true;
        private initFail = false;
	
        private error = { show: false, msg : '登録に失敗しました' };
        private success = { show: false, msg: '登録に成功しました' };

        public mounted() {
            this.initQuagga();
        }

        private showAlert(msg: string) {
            this.error = {
                show: true,
                msg,
            };
            setTimeout(() => {
                this.error = {
                    show: false,
                    msg: '',
                };
            }, 5000);
        }

        private scrollToLeft() {
            const w = document && document.getElementById('books');
            if (w && this.searchResults.length * this.bookWidth > w.clientWidth) {
                const width = parseInt(w.style.width);
                w.style.width = (width + this.bookWidth) + 'px';
                this.isScrollY = true;
                w.scrollLeft += ((this.searchResults.length + 1) * this.bookWidth);
            }
        }

        private addBook() {
            this.searchBook('4151310800')
        }

        private searchBook(isbn: string) {
	    console.log("search!!!", isbn);
            this.isSearch = true;
            this.rakutenSearchQuery.setISBN(isbn);
            rakutenAPI.search(this.rakutenSearchQuery)
                .then((res) => {
                    const result = res.data as SearchResult;
                    if (result.Items.length === 1) {
                        this.searchResults.push(itemToResultWithCheck(result.Items[0].Item));
                        setTimeout(() => {
                            this.scrollToLeft();
                        }, 500);
                    } else {
                        this.showAlert('本が見つかりませんでした');
                    }
                })
                .catch((e) => {
                    this.showAlert('検索でエラーが発生しました');
                })
                .finally(() => {
                    this.isSearch = false;
                });
        }

        private removeBook(isbn: string) {
            const idx = this.searchResults.findIndex((x) => x.isbn === isbn);
            if (idx !== -1) {
                this.searchResults.splice(idx, 1);
            }
        }

        private registerBooks() {
            this.isSaving = true;
            getToken()
                .then((token) => {
                    return this.searchResults.map((x) => {
                        const b = {
                            isbn: x.isbn,
                            title: x.title,
                            author_name: x.author,
                            publisher_name: x.publisherName,
                            medium_image_url: x.mediumImageUrl,
                            small_image_url: x.smallImageUrl,
                            item_url: x.itemUrl,
                            affiliate_url: x.affiliateUrl,
                        } as PostBookForm;
                        return api.books.createWith(token, b);
                    });
                })
                .then((p) => {
                    return Promise.all(p);
                })
                .then(() => {
                    this.searchResults = [];
                    this.isSaving = false;
                    this.success.show = true;
                    this.isScrollY = false;
                    setTimeout(() => {
                        this.success.show = false;
                    }, 5000);
                })
                .catch((e) => {
                    this.showAlert('登録に失敗しました');
                });
        }

        private parseBookTitleAtRecommend(title: string): string {
            if (title.length > 15) {
                return title.slice(0, 15) + '...';
            } else {
                return title;
            }
        }

        private stopScan() {
            this.quagga.offProcessed(this.onProcessed);
            this.quagga.offDetected(this.onDetected);
            this.quagga.stop();
        }

        private initQuagga() {
            this.quagga.onProcessed(this.onProcessed);
            this.quagga.onDetected(this.onDetected);

            // 設定
            const config = {
                inputStream: {
                    name: 'Live',
                    type: 'LiveStream',
                    target: document.querySelector('#cameraArea'),
                    constraints: {facingMode: 'environment'},
                },
                numOfWorkers: navigator.hardwareConcurrency || 4,
                decoder: {readers: ['ean_reader', 'ean_8_reader']},
            };
            this.quagga.init(config, this.onInit);
        }

        private onInit(err: any) {
            if (err) {
                this.showAlert('カメラの起動に失敗しました');
                this.initFail = true;
                return;
            }
            console.info('Initialization finished. Ready to start');
            this.quagga.start();
        }

        private onDetected(success: any) {
            const code: string = success.codeResult.code;
            if (!this.isSearch && !this.codes.includes(code)) {
                this.codes.push(code);
                setTimeout(() => {
                    this.searchBook(code);
                }, 500);
            }
        }

        private onProcessed(result: any) {
            const drawingCtx = this.quagga.canvas.ctx.overlay;
            const drawingCanvas = this.quagga.canvas.dom.overlay;

            // 検出中の緑の線の枠
            if (result && result.boxes) {
                drawingCtx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                const hasNotRead = (box: number[][]) => box !== result.box;
                result.boxes.filter(hasNotRead).forEach((box: number[][]) => {
                    this.quagga.ImageDebug.drawPath(box, {x: 0, y: 1}, drawingCtx, {
                        color: 'green',
                        lineWidth: 2,
                    });
                });
            }

            // 検出に成功した瞬間の青い線の枠
            if (result && result.box) {
                this.quagga.ImageDebug.drawPath(
                    result.box,
                    {x: 0, y: 1},
                    drawingCtx,
                    {
                        color: 'blue',
                        lineWidth: 2,
                    },
                );
            }

            // 検出に成功した瞬間の水平の赤い線
            if (result && result.codeResult && result.codeResult.code) {
                this.quagga.ImageDebug.drawPath(
                    result.line,
                    {x: 'x', y: 'y'},
                    drawingCtx,
                    {
                        color: 'red',
                        lineWidth: 3,
                    },
                );
            }
        }
    }
</script>

<style>
    #cameraArea {
        overflow: hidden;
        width: 320px;
        height: 240px;
        margin: auto;
        position: relative;
        display: flex;
        align-items: center;
    }
    #cameraArea video,
    #cameraArea canvas {
        width: 320px;
        height: 240px;
    }

    .remove_button {
        position: relative;
        top: -180px;
        left: 65px;
    }
    .register_content {
        display: flex;
        min-height:191px;
        max-width: 90%;
        margin:auto;
    }
    .register_content * .item {
        background-color: black;
        width: 90px;
        height:128px;
    }
    .register_scroll {
        overflow-x: scroll;
    }
    .register_max90 {
        max-width: 90%;
    }
    .register_max60 {
        max-width: 60%;
    }
    .camera_content {
        margin:auto;
        width: 320px;
        height: 240px;
        left: 0;
        right: 0;
        position: absolute;
        border: solid 1px gray;
    }
    .camera_content.loading {
        opacity: 0.9;
        z-index:10;
        background-color: gray;
    }
</style>
