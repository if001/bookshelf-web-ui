<template>
    <v-layout row wrap justify-start>
        <v-flex class="pa-2" v-for="result in getSearchResult" lg4 md6 sm12 xs12>
            <v-card color="white" class="black--text" @click="selectBook(result.Item)" style="cursor:pointer">
                <v-layout row>
                    <v-flex xs10>
                        <div class="ma-1" style="width: 100%; float:left; font-size: 1.2em">{{result.Item.title}}</div>
                        <div class="ma-1" style="width: 100%; float:left;">{{result.Item.author}}</div>
                        <div class="ma-1" style="width: 100%; float:left;">{{result.Item.publisherName}} / ￥ {{result.Item.itemPrice}}</div>
                    </v-flex>
                    <v-flex xs2 style="max-height: 128px;">
                        <img style="float:right;" :src="result.Item.mediumImageUrl" height="128px;">
                    </v-flex>
                </v-layout>
            </v-card>
        </v-flex>
<!--        <v-layout row nowrap justify-center>-->
<!--            <v-flex md12 class="mt-2 mb-4 text-xs-center">-->
<!--                <v-pagination-->
<!--                        v-model="page"-->
<!--                        :length=totalPageNumber-->
<!--                        :total-visible="7"-->
<!--                        @input="pagenaite()"-->
<!--                        color="#1e90ff"-->
<!--                ></v-pagination>-->
<!--            </v-flex>-->
<!--        </v-layout>-->
    </v-layout>
<!--    <div>-->
<!--        {{getSearchResult}}-->
<!--    </div>-->
</template>

<script lang="ts">
    import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
    import api, {Item, SearchResult} from '../api';

    @Component
    export default class SearchResultComponent extends Vue {
        @Prop()
        private readonly searchResult?: SearchResult | null;

        @Emit()
        private complete(result: Item) {}

        get getSearchResult() {
            if (this.searchResult != null) {
                console.log(this.searchResult);
                return this.searchResult.Items;
            } else {
                return [];
            }
        }
        private selectBook(select: Item) {
            this.complete(select);
        }

    }
</script>

<style scoped>

</style>