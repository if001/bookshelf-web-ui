<script lang="ts">
    import {Component, Prop, Mixins, Watch } from 'vue-property-decorator';
    import Chart from 'chart.js';
    import { Bar } from 'vue-chartjs';

    @Component({})
    export default class AnalyticsView extends Mixins(Bar) {
        @Prop() public chartData?: Chart.ChartData;
        @Prop() public chartOptions?: Chart.ChartOptions;

        private barChartOptionsDef: Chart.ChartOptions = {
            maintainAspectRatio: false,
            legend: {
                display: true,
                labels: {
                    fontSize: 10,
                },
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem: any, data: any) => {
                        return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + ' 冊';
                    },
                },
            },
            scales: {
                yAxes: [
                    {
                        ticks: {
                            display: true,
                            beginAtZero: true,
                            min: 0,
                            callback(value: any, index: any, values: any): string | number {
                                return value.toString() + '冊';
                            },
                            stepSize: 2,
                        },
                    },
                ],
                xAxes: [
                    {
                        ticks: {
                            display: true,
                            callback(value: any, index: any, values: any): string | number {
                                return value.toString() + '日';
                            },
                        },
                        gridLines: {
                            display: false,
                        },
                    },
                ],
            },
        };


        @Watch('chartData')
        private onValueChange(newValue: Chart.ChartData, oldValue: Chart.ChartData): void {
            this.chartData = newValue;
            this.renderChart(this.chartData, Object.assign(this.chartOptions, this.barChartOptionsDef));
        }

        @Watch('chartOptions')
        private onValueChange2(newValue: Chart.ChartOptions, oldValue: Chart.ChartOptions): void {
            this.chartOptions = newValue;
            this.renderChart(this.chartData, Object.assign(this.chartOptions, this.barChartOptionsDef));
        }
        private mounted() {
            this.renderChart(this.chartData, Object.assign(this.chartOptions, this.barChartOptionsDef));
        }

    }
</script>
