<template>
    <div>
        <h3>
            コメント
            <v-btn text
                   icon
                   v-on:click="isOpenTextfield  = !isOpenTextfield">
                <v-icon color="blue-grey darken-3">mdi-comment-plus</v-icon>
            </v-btn>
        </h3>

        <div v-if="isOpenTextfield">
            <v-form
                    ref="form"
                    v-model="descriptionValid"
                    lazy-validation>

                <v-textarea
                        outlined
                        rows="3"
                        label="comment"
                        auto-grow
                        value=""
                        single-line
                        counter="140"
                        maxlength="140"
                        v-model="inputDescription"
                        :rules="descriptionRules"
                ></v-textarea>

                <div style="display: flex">
                    <v-spacer></v-spacer>
                    <v-btn class="ma-0"
                           outlined
                           small
                           color="info"
                           :loading="isSending"
                           :disabled="isSending"
                           @click="send()">SEND
                        <v-icon small color="blue" class="ml-2">mdi-send</v-icon>
                    </v-btn>
                </div>
            </v-form>
        </div>

        <div>
            <div v-if="isLoading" style="margin: auto;">
                <div style="display:inline-block; padding-right: 15px;">loading...</div>
                <div class="loading loading-content">
                    <v-icon>fa-book</v-icon>
                </div>
            </div>
            <div v-if="!isLoading && getDescriptions.length === 0" style="margin: auto;">
                本のコメントを追加しましょう
            </div>

            <div v-else v-bind:class="{ scroll_description: !$vuetify.breakpoint.xs}">
                <div v-for="description in getDescriptions" class=" pa-3">
                    <div class="ma-2" style="word-wrap: break-word;">{{description.content}}</div>
                    <v-layout>
                        <div class="ma-2 mr-5" style="color:dimgray; font-size: 0.8em;">{{createdAtFormatted(description.created_at)}}</div>
                        <v-spacer></v-spacer>
                        <v-btn color="dark"
                               text
                               icon
                               small
                               @click="deleteDescription(description.id)">
                            <v-icon small color="red darken-2">mdi-delete</v-icon>
                        </v-btn>
                        <!--TODO シェアボタン-->
                        <!--<v-btn color="info" small>share</v-btn>-->
                        <!--<v-btn color="success" small>share</v-btn>-->
                    </v-layout>
                    <v-divider></v-divider>
                </div>
            </div>
        </div>

    </div>
</template>


<script lang="ts">
    import {Component, Vue, Prop, Emit} from 'vue-property-decorator';
    import api, {Description, errorRoute, getToken} from '@/api';
    import moment from 'moment';


    @Component
    export default class BookDescriptionComponent extends Vue {
        @Prop()
        private readonly bookID?: number | null;

        private descriptions: Description[] = [];
        private isLoading: boolean = false;
        private descriptionValid: boolean = false;
        private isOpenTextfield: boolean = false;
        private isSending: boolean = false;

        private inputDescription: string = '';

        private descriptionRules = [
            (v: any) => (v || '').length > 0 || 'Description is required',
            (v: any) => (v || '').length <= 140 ||
                `A maximum of 140 characters is allowed`,
        ];

        get getDescriptions() {
            return this.descriptions;
        }

        private mounted() {
            this.load();
        }

        private load() {
            if (this.bookID != null) {
                this.isLoading = true;
                const tmpBookID = this.bookID;
                getToken()
                    .then((token) => {
                        return api.description.get(token, tmpBookID);
                    })
                    .then((response) => {
                        this.descriptions = [];
                        this.descriptions = response.data.content as Description[];
                        this.isLoading = false;
                    })
                    .catch((err) => {
                        errorRoute('book description: ' + err.toString());
                    })
                    .finally(() => {
                        // this.isLoading = false;
                    });
            }
        }

        private createdAtFormatted(created_at: string) {
            return formatDateTime(created_at);
        }

        private deleteDescription(id: number) {
            const ans = confirm('削除しますか?');
            if (ans) {
                getToken()
                    .then((token) => {
                        return api.description.delete(token, id);
                    })
                    .then((res) => {
                        this.load();
                    })
                    .catch((err) => {
                        errorRoute('book description: ' + err.toString());
                    });
            }
        }

        private send() {
            if (this.bookID != null) {
                if ((this.$refs.form as Vue & { validate: () => boolean }).validate()) {
                    const description = {
                        book_id: this.bookID,
                        content: this.inputDescription,
                    };
                    this.isSending = true;
                    const tmpBookID = this.bookID;
                    getToken()
                        .then((token) => {
                            return api.description.create(token, tmpBookID, description);
                        })
                        .then((res) => {
                            // console.log(res);
                            this.isOpenTextfield = false;
                            this.inputDescription = '';
                            this.load();
                        })
                        .catch((err) => {
                            errorRoute('book description: ' + err.toString());
                        })
                        .finally(() => {
                            this.isSending = false;
                        });
                }
            }
        }

    }


    function formatDateTime(d: string | null) {
        if (d != null) {
            const date = moment(d);
            return date.format('YYYY') + '/' + date.format('MM') + '/' + date.format('DD')
                + ' ' + date.format('HH') + ':' + date.format('mm');
        } else {
            return '----/--/-- --:--';
        }
    }
</script>

<style scoped>
    .loading {
        display: inline-block;
        /*font-size: 3em;*/
    }

    .loading-content {
        animation: r1 1s linear infinite;
    }

    .scroll_description {
        max-height: 70vh;
        overflow: auto;
    }

    @keyframes r1 {
        0%   { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    .custom-loader {
        animation: loader 1s infinite;
        display: flex;
    }
    @-moz-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-webkit-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @-o-keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
    @keyframes loader {
        from {
            transform: rotate(0);
        }
        to {
            transform: rotate(360deg);
        }
    }
</style>
