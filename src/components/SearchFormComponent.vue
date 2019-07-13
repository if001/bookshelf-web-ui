<template>
    <v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2 class="pa-2">
        <v-form
                ref="form"
                v-model="validSearchBox"
                lazy-validation>
            <v-text-field
                    flat
                    label="Search From Title"
                    v-model="inputTitleForSarch"
                    append-outer-icon="search"
                    @click:append-outer="searchTitle()"
            ></v-text-field>
        </v-form>

        <v-form
                ref="form"
                v-model="validSearchBox"
                lazy-validation>
            <v-text-field
                    flat
                    label="Search From Author"
                    v-model="inputAuthorForSarch"
                    append-outer-icon="search"
                    @click:append-outer="searchAuthor()"
            ></v-text-field>
        </v-form>
    </v-flex>

</template>

<script lang="ts">
    import {Component, Emit, Vue} from 'vue-property-decorator';
    import api, {SearchResult} from '../api';

    @Component
    export default class SearchFormComponent extends Vue {
        private validSearchBox: boolean = true;
        private searchResult: SearchResult | null = null;
        private inputTitleForSarch: string = '';
        private inputAuthorForSarch: string = '';

        @Emit()
        private complete(result: SearchResult){}

        private searchTitle() {
            api.rakuten.searchByTitle('そして誰もいなくなった').then((res) => {
                this.searchResult = res.data as SearchResult;
            }).catch(() => {
                // console.log('search api error');
            });
            if (this.searchResult != null) {
                this.complete(this.searchResult);
            }
        }

        private searchAuthor() {
            api.rakuten.searchByAuthor('そして誰もいなくなった').then((res) => {
                this.searchResult = res.data as SearchResult;
            }).catch(() => {
                // console.log('search api error');
            });
            if (this.searchResult != null) {
                this.complete(this.searchResult);
            }
        }

    }

</script>

<style scoped>

</style>