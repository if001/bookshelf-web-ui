<template>
    <v-container  style="height: 1000px;">
        <v-layout row wrap justify-start>
            <v-flex class="pa-2" v-for="book in books" lg4 md6 sm12 xs12>
                <v-card>
                    <v-layout class="font-weight-light font title pt-2 pl-2 pr-2 pb-0" row>
                        <v-flex align-self-center="true">{{book.title}}</v-flex>
                        <v-btn flat
                               icon
                               color="dark"
                               class="ma-0">
                            <v-icon large
                                    color="blue-grey darken-1">bookmark</v-icon>
                        </v-btn>
                    </v-layout>

                    <!--<v-icon large right v-if="book.status==1">bookmark</v-icon>-->
                    <!--<v-icon large right v-if="book.status==2">done</v-icon>-->
                    <!--<v-icon large right v-if="book.status==3">close</v-icon>-->
                    <v-layout class="font-weight-thin pt-0 pl-3 pr-2 pb-2" row>
                        <v-flex align-self-center="true">１２３４５６７８９０</v-flex>
                        <!--<v-btn outline small fab color="indigo" class="ma-0">-->
                        <!--<v-icon small>edit</v-icon>-->
                        <!--</v-btn>-->
                        <v-btn outline small fab color="light-blue darken-1" class="ma-0" @click="book.isOpen = true">
                            <v-icon small>edit</v-icon>
                        </v-btn>
                        <book-modal v-if="book.isOpen" @close="book.isOpen = false">
                        </book-modal>

                    </v-layout>
                </v-card>
                <!--<v-divider></v-divider>a-->
            </v-flex>

        </v-layout>


        <v-btn
                fab
                bottom
                right
                color="pink"
                dark
                fixed
                @click="dialog = !dialog">
            <v-icon>add</v-icon>
        </v-btn>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import BookModal from './BooksModalView.vue';

    @Component({
        components: {
            BookModal,
        },
    })
    export default class BooksView extends Vue {
        private books = [
            {
                title: '１２３４５６７８９０１２３',
                isOpen: false,
                describe: [
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                    {
                        content: 'hogehogee',
                        date: 'YYYY/mm/dd',
                    },
                ],
            },
            {
                title: '１２３４５６７８９０１',
                isOpen: false,
                describe: {
                    content: 'hogehogee',
                    date: 'YYYY/mm/dd',
                },
            },
            {
                title: '１２３４',
                isOpen: false,
                describe: {
                    content: 'hogehogee',
                    date: 'YYYY/mm/dd',
                },
            },
            {
                title: '１２３４５６７８９',
                isOpen: false,
                describe: {
                    content: 'hogehogee',
                    date: 'YYYY/mm/dd',
                },
            },
            {
                title: '１２３４５６７８９０１２３',
                isOpen: false,
                describe: {
                    content: 'hogehogee',
                    date: 'YYYY/mm/dd',
                },
            },
            {
                title: '１２３４５６７８９',
                isOpen: false,
                describe: {
                    content: 'hogehogee',
                    date: 'YYYY/mm/dd',
                },
            },
            {
                title: '１２３４５６７８９',
                isOpen: false,
                describe: {
                    content: 'hogehogee',
                    date: 'YYYY/mm/dd',
                },
            },
            {
                title: '１２３４５６７８９',
                isOpen: false,
                describe: {
                    content: 'hogehogee',
                    date: 'YYYY/mm/dd',
                },
            },
            {
                title: '１２３４５６７８９',
                isOpen: false,
                describe: {
                    content: 'hogehogee',
                    date: 'YYYY/mm/dd',
                },
            },
            {
                title: '１２３４５６７８９',
                isOpen: false,
                describe: {
                    content: 'hogehogee',
                    date: 'YYYY/mm/dd',
                },
            },
            {
                title: '１２３４５６７８９',
                isOpen: false,
                describe: {
                    content: 'hogehogee',
                    date: 'YYYY/mm/dd',
                },
            },
        ];
    }

</script>

<style scoped>

</style>
