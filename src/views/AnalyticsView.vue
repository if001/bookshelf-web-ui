<template>
    <v-container class="mb-5">
        <v-row>
            <v-col>
                <div style="text-align: center;font-size:1.5em;color: dimgrey;">Analytics Your Book</div>
            </v-col>
        </v-row>
        <v-row align="center" justify="start">
            <v-col cols="6" lg="3" md="3" sm="3">
                <v-card class="pt-5 pb-5 pr-3 pl-3">
                    <div style="font-size: 0.8em;color: dimgrey">
                        {{formatMonth(dailyDate.toISOString())}}月に読み終わった本
                    </div>
                    <div style="font-size:1.2em;font-weight: 600;color: dimgrey">
                        {{monthEndSum}} 冊
                    </div>
                </v-card>
            </v-col>

            <v-col cols="6" lg="3" md="3" sm="3">
                <v-card class="pt-5 pb-5 pr-3 pl-3">
                    <div style="font-size: 0.8em;color: dimgrey">
                        {{formatMonth(dailyDate.toISOString())}}月に登録した本
                    </div>
                    <div style="font-size:1.2em;font-weight: 600;color: dimgrey">
                        {{monthRegisterSum}} 冊
                    </div>
                </v-card>
            </v-col>

            <v-col cols="6" lg="3" md="3" sm="3">
                <v-card class="pt-5 pb-5 pr-3 pl-3">
                    <div style="font-size: 0.8em;color: dimgrey">
                        {{formatMonth(dailyDate.toISOString())}}月に読み始めた本
                    </div>
                    <div style="font-size:1.2em;font-weight: 600;color: dimgrey">
                        {{monthStartSum}} 冊
                    </div>
                </v-card>
            </v-col>
        </v-row>


        <v-row justify="space-between">
<!--            <v-col cols="12" class="ma-0 pa-3">-->
<!--                <v-card raised>-->
<!--                    <v-card-actions class="ma-0 pr-3 pl-3 pb-0 pt-4">-->
<!--                        <v-row>-->
<!--                            <v-col cols="12" class="pa-0" style="text-align: center">-->
<!--                                <v-btn text icon small @click="backMonthly()">-->
<!--                                    <v-icon>-->
<!--                                        mdi-chevron-left-->
<!--                                    </v-icon>-->
<!--                                </v-btn>-->
<!--                                <span class="pr-2 pl-2" style="font-size: 1.2em;">{{formatMonthly(dailyDate.toISOString())}}</span>-->
<!--                                <v-btn text icon small @click="nextMonthly()">-->
<!--                                    <v-icon>-->
<!--                                        mdi-chevron-right-->
<!--                                    </v-icon>-->
<!--                                </v-btn>-->
<!--                            </v-col>-->
<!--                        </v-row>-->
<!--                    </v-card-actions>-->
<!--                    <bar-chart class="pa-4 pt-0" :chartData="bookDailyChartData" :chartOptions="bookDailyChartOptions"-->
<!--                               :height="($vuetify.breakpoint.xs)? 180 : 270"></bar-chart>-->
<!--                </v-card>-->
<!--            </v-col>-->

<!--            <v-col cols="12" lg="4" md="4" sm="4" class="ma-0 pa-3">-->
<!--                <v-card raised>-->
<!--                    <pie-chart class="pa-3" :chartData="authorChartData" :chartOptions="authorChartOptions"-->
<!--                               :height="270"></pie-chart>-->
<!--                    <v-divider></v-divider>-->
<!--                    <v-card-actions class="ma-0 pr-3 pl-3 pb-0 pt-0">-->
<!--                        <v-col cols="5" class="pa-0">-->
<!--                            <v-select-->
<!--                                    v-model="authorFilterKey"-->
<!--                                    :items="topFilter"-->
<!--                                    item-text="displayName"-->
<!--                                    item-value="topKey"-->
<!--                                    dense-->
<!--                                    @change="changeAuthorFilter()"-->
<!--                                    style="font-size: 0.9em;"-->
<!--                            ></v-select>-->
<!--                        </v-col>-->
<!--                    </v-card-actions>-->
<!--                </v-card>-->
<!--            </v-col>-->
<!--            <v-col cols="12" lg="4" md="4" sm="4" class="ma-0 pa-3">-->
<!--                <v-card raised>-->
<!--                    <pie-chart class="pa-3" :chartData="publisherChartData" :chartOptions="publisherChartOptions"-->
<!--                               :height="270"></pie-chart>-->
<!--                    <v-divider></v-divider>-->
<!--                    <v-card-actions class="ma-0 pr-3 pl-3 pb-0 pt-0">-->
<!--                        <v-col cols="5" class="pa-0">-->
<!--                            <v-select-->
<!--                                    v-model="publisherFilterKey"-->
<!--                                    :items="topFilter"-->
<!--                                    item-text="displayName"-->
<!--                                    item-value="topKey"-->
<!--                                    dense-->
<!--                                    @change="changePublisherFilter()"-->
<!--                                    style="font-size: 0.9em;"-->
<!--                            ></v-select>-->
<!--                        </v-col>-->
<!--                    </v-card-actions>-->
<!--                </v-card>-->
<!--            </v-col>-->

            <v-col cols="12" lg="4" md="4" sm="4" class="ma-0 pa-3">
                <v-card raised>
                    <bar-chart class="pa-3" :chartData="bookMonthlyChartData" :chartOptions="bookMonthlyChartOptions"
                               :height="270"></bar-chart>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';
    import api, {Book, CountedName, CountedTime, errorRoute, getToken} from '@/api';
    import PieChartComponent from '@/components/PieChartComponent.vue';
    import BarChartComponent from '@/components/BarChartComponent.vue';
    import LineChartComponent from '@/components/LineChartComponent.vue';
    import Chart from 'chart.js';
    import moment from 'moment';

    @Component({
        components: {
            'pie-chart': PieChartComponent,
            'bar-chart': BarChartComponent,
            'line-chart': LineChartComponent,
        },
    })
    export default class AnalyticsView extends Vue {
        private charBG = [
            '#5db8b4', '#e46b98', '#637dff', '#b661dd', '#66cdaa',
            '#dfc1ff', '#ff69b4', '#87ceeb', '#7ecd77', '#9370db',
            '#f08080', '#3f4be1', '#24cdaa', '#c97fdb', '#f0a086',
            '#5a4ce1', '#89cd1c', '#db43ad', '#f0d294', '#7e4ee1',
        ];

        private pieChartOptionsDef: Chart.ChartOptions = {
            // responsive: true,
            maintainAspectRatio: false,
            title: {
                display: true,
                text: '',
                fontSize: 13,
            },
            legend: {
                labels: {
                    fontSize: 10,
                },
                position: 'bottom',
            },
            cutoutPercentage: 70,
        };

        private barChartOptionsDef: Chart.ChartOptions = {
            maintainAspectRatio: false,
            title: {
                display: true,
                text: '',
                fontSize: 13,
            },
        };

        private lineChartOptionsDef: Chart.ChartOptions = {
            maintainAspectRatio: false,
            title: {
                display: false,
            },
        };

        private publisherChartData: Chart.ChartData = {};
        private publisherChartOptions: Chart.ChartOptions = JSON.parse(JSON.stringify(this.pieChartOptionsDef));
        private countedAuthor: CountedName[] = [];

        private authorChartData: Chart.ChartData = {};
        private authorChartOptions: Chart.ChartOptions = JSON.parse(JSON.stringify(this.pieChartOptionsDef));
        private countedPublisher: CountedName[] = [];

        private topFilter = [
            {displayName: 'top5', topKey: 5},
            {displayName: 'top10', topKey: 10},
            {displayName: 'top15', topKey: 15},
        ];
        private publisherFilterKey: number = 5;
        private authorFilterKey: number = 5;

        private bookDailyChartData: Chart.ChartData = {};
        private bookDailyChartOptions: Chart.ChartOptions = JSON.parse(JSON.stringify(this.lineChartOptionsDef));
        private countedBookRegisterDaily: CountedTime[] = [];
        private countedBookStartDaily: CountedTime[] = [];
        private countedBookEndDaily: CountedTime[] = [];
        private dailyDate: Date = new Date();

        private bookMonthlyChartData: Chart.ChartData = {};
        private bookMonthlyChartOptions: Chart.ChartOptions = JSON.parse(JSON.stringify(this.barChartOptionsDef));
        private countedBookMonthly: CountedTime[] = [];
        private monthlyDate: Date = new Date();
        private now: Date = new Date();

        private monthRegisterSum: number = 0;
        private monthStartSum: number = 0;
        private monthEndSum: number = 0;

        private mounted() {
            this.loadAuthor();
            this.loadPublisher();
            this.loadBookCountDaily();
            this.loadBookCountMonthly();
        }

        private loadAuthor() {
            getToken()
                .then((token) => {
                    return api.books.countedAuthorName(token);
                })
                .then((response) => {
                    this.countedAuthor = response.data.content as CountedName[];
                })
                .then(() => {
                    this.authorChartData = this.safeSliceChartData(this.countedAuthor, this.authorFilterKey);

                    if (this.authorChartOptions.title != null) {
                        this.authorChartOptions.title.text = '作者';
                    }
                })
                .catch((err) => {
                    errorRoute(err.toString());
                });
        }

        private loadPublisher() {
            getToken()
                .then((token) => {
                    return api.books.countedPublisherName(token);
                })
                .then((response) => {
                    this.countedPublisher = response.data.content as CountedName[];
                })
                .then(() => {
                    this.publisherChartData = this.safeSliceChartData(this.countedPublisher, this.publisherFilterKey);

                    if (this.publisherChartOptions.title != null) {
                        this.publisherChartOptions.title.text = '出版社';
                    }
                })
                .catch((err) => {
                    errorRoute(err.toString());
                });
        }

        private changeAuthorFilter() {
            this.authorChartData = this.safeSliceChartData(this.countedAuthor, this.authorFilterKey);
        }

        private changePublisherFilter() {
            this.publisherChartData = this.safeSliceChartData(this.countedPublisher, this.publisherFilterKey);
        }

        private safeSliceChartData(countedName: CountedName[], filterKey: number): Chart.ChartData {
            const tmp: CountedName[] = JSON.parse(JSON.stringify(countedName));

            let sliceLen = filterKey;
            if (filterKey > tmp.length) {
                sliceLen = tmp.length;
            }
            const sliced: CountedName[] = [];
            for (let i = 0; i < sliceLen; i++) {
                sliced[i] = tmp[i];
            }

            const result = {
                labels: sliced.map((x) => x.name),
                datasets: [{
                    data: sliced.map((x) => x.count),
                    backgroundColor: this.charBG,
                }],
            } as Chart.ChartData;

            return result;
        }


        private loadBookCountDaily() {
            const resigter = getToken()
                .then((token) => {
                    return api.books.countedRegisterDaily(token);
                })
                .then((response) => {
                    this.countedBookRegisterDaily = response.data.content as CountedTime[];
                });

            const start = getToken()
                .then((token) => {
                    return api.books.countedStartDaily(token);
                })
                .then((response) => {
                    this.countedBookStartDaily = response.data.content as CountedTime[];
                });


            const end = getToken()
                .then((token) => {
                    return api.books.countedEndDaily(token);
                })
                .then((response) => {
                    this.countedBookEndDaily = response.data.content as CountedTime[];
                });

            Promise.all([resigter, start, end])
                .then(() => {
                    this.bookDailyChartData = this.createDailyChartData(this.dailyDate, this.countedBookRegisterDaily,
                        this.countedBookStartDaily, this.countedBookEndDaily);
                })
                .catch((err) => {
                    errorRoute(err.toString());
                });
        }

        private loadBookCountMonthly() {
            getToken()
                .then((token) => {
                    return api.books.countedMonthly(token);
                })
                .then((response) => {
                    this.countedBookMonthly = response.data.content as CountedTime[];
                })
                .then(() => {
                    this.bookMonthlyChartData = this.createMonthlyChartData(this.monthlyDate, this.countedBookMonthly);

                    if (this.bookMonthlyChartOptions.title != null) {
                        this.bookMonthlyChartOptions.title.text = '読み終わった本の数（月別）';
                        this.bookMonthlyChartOptions.legend = {
                            display: false,
                            position: 'bottom',
                        };
                    }
                })
                .catch((err) => {
                    errorRoute(err.toString());
                });
        }

        private findByTime(countedTime: CountedTime[], time: string): CountedTime | null {
            let c: CountedTime | null = null;
            for (const v of countedTime) {
                if (v.time === time) {
                    c = v;
                }
            }
            return c;
        }

        private createDailyChartData(date: Date, countedRegister: CountedTime[],
                                     countedStart: CountedTime[], countedEnd: CountedTime[]): Chart.ChartData {
            const dailyArr = this.dailyArray(date);
            const register: number[] = this.countUp(dailyArr, countedRegister);
            const start: number[] = this.countUp(dailyArr, countedStart);
            const end: number[] = this.countUp(dailyArr, countedEnd);

            const day = dailyArr.map((x) => this.formatDay(x));

            const chartData = {
                labels: day,
                datasets: [
                    {
                        data: register,
                        fill: false,
                        borderColor: this.charBG[0],
                        backgroundColor: this.charBG[0],
                        lineTension: 0,
                        label: '登録した本',
                    },
                    {
                        data: start,
                        fill: false,
                        borderColor: this.charBG[1],
                        backgroundColor: this.charBG[1],
                        lineTension: 0,
                        label: '読み始めた本',
                    },
                    {
                        data: end,
                        fill: false,
                        borderColor: this.charBG[2],
                        backgroundColor: this.charBG[2],
                        lineTension: 0,
                        label: '読み終わった本',
                    },
                ],
            } as Chart.ChartData;

            this.monthRegisterSum = register.reduce((a, x) => a += x, 0);
            this.monthStartSum = start.reduce((a, x) => a += x, 0);
            this.monthEndSum = end.reduce((a, x) => a += x, 0);

            return chartData;
        }

        private createMonthlyChartData(date: Date, countedTime: CountedTime[]): Chart.ChartData {
            const monthArr = this.monthlyArray(date, 3);
            const data: number[] = monthArr.map((x) => {
                const c = this.findByTime(countedTime, x);
                if (c != null) {
                    return c.count;
                } else {
                    return 0;
                }
            });

            const chartData = {
                labels: monthArr,
                datasets: [{
                    data,
                    backgroundColor: this.charBG,
                }],
            } as Chart.ChartData;
            return chartData;
        }

        private backMonthly() {
            const now = new Date();
            // TODO 4ヶ月までは遡れる
            const d = new Date(now.getFullYear(), now.getMonth() - 4, 1);

            if (this.dailyDate.getTime() > d.getTime()) {
                this.dailyDate = new Date(this.dailyDate.getFullYear(), this.dailyDate.getMonth() - 1, 1);
                this.bookDailyChartData = this.createDailyChartData(this.dailyDate, this.countedBookRegisterDaily,
                    this.countedBookStartDaily, this.countedBookEndDaily);
            }
        }

        private nextMonthly() {
            const now = new Date();
            const d = new Date(now.getFullYear(), now.getMonth() + 1, 1);

            if (this.dailyDate.getTime() < d.getTime()) {
                this.dailyDate = new Date(this.dailyDate.getFullYear(), this.dailyDate.getMonth() + 1, 1);
                this.bookDailyChartData = this.createDailyChartData(this.dailyDate, this.countedBookRegisterDaily,
                    this.countedBookStartDaily, this.countedBookEndDaily);
            }

        }

        private monthlyArray(date: Date, numOfMonth: number): string[] {
            const start = new Date(date.getFullYear(), date.getMonth() + 1 - numOfMonth, 1);
            const end = new Date(date.getFullYear(), date.getMonth(), 1);
            const arr: string[] = [];

            for (const m = start; m <= end; m.setMonth(m.getMonth().valueOf() + 1)) {
                const month = this.formatMonthly(m.toISOString());
                arr.push(month);
            }
            return arr;
        }

        private dailyArray(date: Date) {
            const start = this.getFirstDate(date);
            const end = new Date(start.getFullYear(), start.getMonth() + 1, 1);

            const arr: string[] = [];

            for (const d = start; d < end; d.setDate(d.getDate() + 1)) {
                const month = this.formatDaily(d.toISOString());
                arr.push(month);
            }
            return arr;
        }

        private countUp(dailyArr: string[], countedTime: CountedTime[]): number[] {
            return dailyArr.map((x) => {
                const c = this.findByTime(countedTime, x);
                if (c != null) {
                    return c.count;
                } else {
                    return 0;
                }
            });
        }

        private formatMonthly(d: string): string {
            const date = moment(d);
            return date.format('YYYY') + '-' + date.format('MM');
        }

        private formatDaily(d: string): string {
            const date = moment(d);
            return date.format('YYYY') + '-' + date.format('MM') + '-' + date.format('DD');
        }

        private formatDay(d: string): string {
            const date = moment(d);
            return date.format('DD');
        }

        private formatMonth(d: string): string {
            const date = moment(d);
            return date.format('M');
        }

        private getFirstDate(d: Date) {
            return new Date(d.getFullYear(), d.getMonth(), 1);
        }

    }
</script>

<style scoped>

</style>
