<template>
    <v-row justify="center" style="color: dimgrey;">
        <v-col cols="12" align="center" class="ma-5 pd-divier">
            <div class="display-2">Book Storage</div>
            <div class="pa-4">本の管理をシンプルに</div>
        </v-col>

        <v-col cols="10" align="center" class="ma-5 pd-divier">
            <v-row>
                <v-col cols="12" lg="5" md="5">
                    <v-row justify="center">
                        <v-col cols="4">
                            <v-icon class="book-icon">mdi-book-open-variant</v-icon>
                            <div class="circle" style="background-color:#e91e63; width: 30px; height: 30px;position:relative; bottom:20px;left:20px">
                                <v-icon color="white" style="font-size: 1.0em;">mdi-plus</v-icon>
                            </div>
                        </v-col>
                    </v-row>
                    <div>管理したい本を登録</div>
                </v-col>
                <v-col cols="12" lg="2" md="2">
                    <v-icon x-large style="height: 100%;" v-if="this.$vuetify.breakpoint.xs" class="pa-3">mdi-arrow-down-bold</v-icon>
                    <v-icon x-large style="height: 100%;" v-else>mdi-arrow-right-bold</v-icon>
                </v-col>
                <v-col cols="12" lg="5" md="5">
                    <v-row>
                        <v-col cols="4">
                            <v-icon class="book-icon">mdi-book-open-variant</v-icon>
                            <div class="circle" style="width: 30px; height: 30px;position:relative; bottom:20px;left:20px">
                                <v-icon color="white" style="font-size: 1.0em;">mdi-check</v-icon>
                            </div>
                        </v-col>
                        <v-col cols="4">
                            <v-icon class="book-icon">mdi-book-open-variant</v-icon>
                            <div class="circle" style="width: 30px; height: 30px;position:relative; bottom:20px;left:20px">
                                <v-icon color="white" style="font-size: 1.0em;">fa-book</v-icon>
                            </div>
                        </v-col>
                        <v-col cols="4">
                            <v-icon class="book-icon">mdi-book-open-variant</v-icon>
                            <div class="circle" style="width: 30px; height: 30px;position:relative; bottom:20px;left:20px">
                                <v-icon color="white" style="font-size: 1.0em;">mdi-bookmark</v-icon>
                            </div>
                        </v-col>
                    </v-row>
                    <div>一覧で読書の状態を管理</div>
                </v-col>
            </v-row>
        </v-col>

        <v-col cols="10" align="center" class="ma-5 pd-divier">
            <div class="pa-3">3つの状態で本を管理</div>
            <v-row>
                <v-col cols="4">
                    <div class="circle">
                        <v-icon color="#ffffff" style="top:12px;">fa-book</v-icon>
                    </div>
                    <div>未読</div>
                </v-col>
                <v-col cols="4">
                    <div class="circle">
                        <v-icon color="#ffffff" style="top:12px;">mdi-bookmark</v-icon>
                    </div>
                    <div>読中</div>
                </v-col>
                <v-col cols="4">
                    <div class="circle">
                        <v-icon color="#ffffff" style="top:12px;">mdi-check</v-icon>
                    </div>
                    <div>読了</div>
                </v-col>
            </v-row>
        </v-col>
    </v-row>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    @Component
    export default class About extends Vue {
    }
</script>

<style scoped>
    .book-icon {
        color: dimgrey;
        font-size: 3.5em;
    }
    .circle{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: dodgerblue;
    }
</style>
