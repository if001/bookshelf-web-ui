<script lang="ts">
    import {Component, Prop, Watch } from 'vue-property-decorator';
    import Chart from 'chart.js';
    import { Line, mixins } from 'vue-chartjs';

    @Component({
        extends: Line,
        mixins: [mixins.reactiveProp],
    })
    export default class LineChartComponent extends Line {
        @Prop({ default: {}, type: Object }) public chartData!: Chart.ChartData;
        @Prop({ default: {}, type: Object }) public chartOptions!: Chart.ChartOptions;


        private lineChartOptionsDef: Chart.ChartOptions = {
            maintainAspectRatio: false,
            legend: {
                display: true,
                labels: {
                    fontSize: 10,
                },
                position: 'bottom',
            },
            tooltips: {
                callbacks: {
                    label: (tooltipItem: any, data: any) => {
                        return data.datasets[0].data[tooltipItem.index] + ' 冊';
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
            this.renderChart(this.chartData, Object.assign(this.lineChartOptionsDef, this.chartOptions));
        }

        @Watch('chartOptions')
        private onValueChange2(newValue: Chart.ChartOptions, oldValue: Chart.ChartOptions): void {
            this.chartOptions = newValue;
            this.renderChart(this.chartData, Object.assign(this.lineChartOptionsDef, this.chartOptions));
        }

        private mounted() {
            this.renderChart(this.chartData, Object.assign(this.lineChartOptionsDef, this.chartOptions));
        }
    }
</script>
