<script lang="ts">
    import {Component, Prop, Mixins, Watch } from 'vue-property-decorator';
    import Chart from 'chart.js';
    import { Pie, Doughnut } from 'vue-chartjs';

    @Component({})
    export default class AnalyticsView extends Mixins(Pie, Doughnut) {
        @Prop() public chartData?: Chart.ChartData;
        @Prop() public chartOptions?: Chart.ChartOptions;

        private chartOptionsDef: Chart.ChartOptions = {
            tooltips: {
                callbacks: {
                    label: (tooltipItem: any, data: any) => {
                        return data.labels[tooltipItem.index] + ':' + data.datasets[0].data[tooltipItem.index] + ' 冊';
                    },
                },
            },
        };

        @Watch('chartData')
        private onValueChange(newValue: Chart.ChartData, oldValue: Chart.ChartData): void {
            this.chartData = newValue;
            this.renderChart(this.chartData, Object.assign(this.chartOptionsDef, this.chartOptions));
        }

        @Watch('chartOptions')
        private onValueChange2(newValue: Chart.ChartOptions, oldValue: Chart.ChartOptions): void {
            this.chartOptions = newValue;
            this.renderChart(this.chartData, Object.assign(this.chartOptionsDef, this.chartOptions));
        }
        private mounted() {
            this.renderChart(this.chartData, Object.assign(this.chartOptionsDef, this.chartOptions));
        }
    }
</script>
