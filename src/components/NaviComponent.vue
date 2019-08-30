<template>


    <v-list>
        <v-list-item>
            <v-list-item-icon>
                <v-btn icon text large @click="closeDrawer()">
                    <v-icon>mdi-menu</v-icon>
                </v-btn>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>BookStorage</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-divider></v-divider>
        <v-list-item link
                     :to="{ name: 'booksView'}"
        >
            <v-list-item-icon>
                <v-icon>mdi-book-multiple</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>ダッシュボード</v-list-item-title>
            </v-list-item-content>
        </v-list-item>

        <v-list-item link
                     :to="{ name: 'analytics'}"
        >
            <v-list-item-icon>
                <v-icon>mdi-google-analytics</v-icon>
            </v-list-item-icon>

            <v-list-item-content>
                <v-list-item-title>分析</v-list-item-title>
            </v-list-item-content>
        </v-list-item>
    </v-list>
</template>

<script lang="ts">
    import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

    @Component
    export default class NaviComponent extends Vue {
        @Prop() private propIsOpen!: boolean;
        private isOpen: boolean = this.propIsOpen;

        @Watch('propIsOpen')
        private onValueChange(newValue: boolean, oldValue: boolean): void {
            this.isOpen = newValue;
        }

        private closeDrawer() {
            this.isOpen = !this.isOpen;
            this.$emit('closeDrawer', this.isOpen);
        }
    }

</script>

<style scoped>

</style>
