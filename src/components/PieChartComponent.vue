<script lang="ts">
    import {Component, Prop, Watch } from 'vue-property-decorator';
    import Chart from 'chart.js';
    import { Doughnut, mixins } from 'vue-chartjs';

    @Component({
        extends: Doughnut,
        mixins: [mixins.reactiveProp],
    })
    export default class PieChartComponent extends Doughnut {
        @Prop({ default: {}, type: Object }) public chartData!: Chart.ChartData;
        @Prop({ default: {}, type: Object }) public chartOptions!: Chart.ChartOptions;


        private chartOptionsDef: Chart.ChartOptions | null = null;
        private initChartOptions() {
            this.chartOptionsDef = {
                tooltips: {
                    callbacks: {
                        label: (tooltipItem: any, data: any) => {
                            return data.labels[tooltipItem.index] + ':' + data.datasets[0].data[tooltipItem.index] + ' 冊';
                        },
                    },
                },
            };
        }

        @Watch('chartData')
        private onValueChange(newValue: Chart.ChartData, oldValue: Chart.ChartData): void {
            this.renderChart(newValue, Object.assign(this.chartOptionsDef, this.chartOptions));
        }

        @Watch('chartOptions')
        private onValueChange2(newValue: Chart.ChartOptions, oldValue: Chart.ChartOptions): void {
            this.chartOptions = newValue;
            this.renderChart(this.chartData, Object.assign(this.chartOptionsDef, this.chartOptions));
        }

        private mounted() {
            this.initChartOptions();
            this.renderChart(this.chartData, Object.assign(this.chartOptionsDef, this.chartOptions));
        }

    }
</script>
