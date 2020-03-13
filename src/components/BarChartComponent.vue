<script lang="ts">
    import {Component, Prop, Watch } from 'vue-property-decorator';
    import { Bar, mixins } from 'vue-chartjs';
    import {ChartData, ChartOptions} from 'chart.js';

    @Component({
        extends: Bar,
        mixins: [mixins.reactiveProp],
    })
    class BarChartComponent extends Bar {
        @Prop({ default: {} }) public chartData!: ChartData;
        @Prop({ default: {} }) public chartOptions!: ChartOptions;

        private barChartOptionsDef: Chart.ChartOptions | null = null;

        private initChartOptions() {
            this.barChartOptionsDef = {
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
        }


        @Watch('chartData')
        private onValueChange(newValue: ChartData, oldValue: ChartData): void {
            this.renderChart(newValue, Object.assign(this.chartOptions, this.barChartOptionsDef));
        }

        @Watch('chartOptions')
        private onValueChange2(newValue: ChartOptions, oldValue: ChartOptions): void {
            this.renderChart(this.chartData, Object.assign(newValue, this.barChartOptionsDef));
        }

        private mounted() {
            this.initChartOptions();
            this.renderChart(this.chartData, Object.assign(this.chartOptions, this.barChartOptionsDef));
        }
    }
    export default BarChartComponent;
</script>
