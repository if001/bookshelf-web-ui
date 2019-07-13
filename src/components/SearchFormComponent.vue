<template>
    <v-flex lg8 md8 sm8 xs8 offset-lg2 offset-md2 offset-sm2 offset-xs2 class="pa-2">
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

</template>

<script lang="ts">
    import {Component, Emit, Vue} from 'vue-property-decorator';
    import api, {SearchResult} from '../api';

    @Component
    export default class SearchFormComponent extends Vue {
        private validTitleSearchBox: boolean = true;
        private validAuthorSearchBox: boolean = true;
        private searchResult: SearchResult | null = null;
        private inputTitleForSearch: string = '';
        private inputAuthorForSearch: string = '';

        @Emit()
        private complete(result: SearchResult){}

        private searchFormRules = [
            (v: any) => !!v || 'required',
        ];

        private searchTitle() {
            if (this.validateTitleInput() && this.inputTitleForSearch.length != 0) {
                api.rakuten.searchByTitle(this.inputTitleForSearch).then((res) => {
                    this.searchResult = res.data as SearchResult;
                    if (this.searchResult != null) {
                        this.complete(this.searchResult);
                    }
                }).catch(() => {
                    // console.log('search api error');
                });
            }
        }

        private searchAuthor() {
            if (this.validateAuthorInput() && this.inputAuthorForSearch.length != 0) {
                api.rakuten.searchByAuthor(this.inputAuthorForSearch).then((res) => {
                    this.searchResult = res.data as SearchResult;
                    if (this.searchResult != null) {
                        this.complete(this.searchResult);
                    }
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
    }

</script>

<style scoped>

</style>