<template>
    <div>
        <!-- small -->
        <div v-if="sm">
            <!-- ebook japan-->
            <!-- 320 * 50-->
            <div v-if="rand === 0">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8Y3J1U+279M+BYLJL" rel="nofollow" target="_blank">
                    <img border="0" width="320" height="50" alt="" src="https://www25.a8.net/svt/bgt?aid=190914095541&wid=001&eno=01&mid=s00000010273002009000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=35NY9B+8Y3J1U+279M+BYLJL" alt="">
            </div>

            <!-- honto -->
            <!-- 320 * 50-->
            <div v-if="rand === 1">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8YOYNM+10UY+HWPVL" rel="nofollow" target="_blank">
                    <img border="0" width="320" height="50" alt="" src="https://www27.a8.net/svt/bgt?aid=190914095542&wid=001&eno=01&mid=s00000004777003008000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=35NY9B+8YOYNM+10UY+HWPVL" alt="">
            </div>

            <!-- 漫画全巻.com -->
            <div v-if="rand === 2">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8UIXF6+1892+601S1" rel="nofollow" target="_blank">
                    <img border="0" width="234" height="60" alt="" src="https://www27.a8.net/svt/bgt?aid=190914095535&wid=001&eno=01&mid=s00000005735001008000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www11.a8.net/0.gif?a8mat=35NY9B+8UIXF6+1892+601S1" alt="">
            </div>


            <!-- ダイヤモンド -->
            <div v-if="rand === 3">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8TXHTE+DCU+NU729" rel="nofollow" target="_blank">
                    <img border="0" width="234" height="60" alt="" src="https://www28.a8.net/svt/bgt?aid=190914095534&wid=001&eno=01&mid=s00000001731004004000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=35NY9B+8TXHTE+DCU+NU729" alt="">
            </div>

            <div v-if="rand === 4">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8RJREA+37DC+60H7L" rel="nofollow" target="_blank">
                    <img border="0" width="320" height="50" alt="" src="https://www20.a8.net/svt/bgt?aid=190914095530&wid=001&eno=01&mid=s00000014952001010000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=35NY9B+8RJREA+37DC+60H7L" alt="">
            </div>
        </div>


        <!-- medium -->
        <div v-if="md">
            <!-- ハイブリッド総合書店-->
            <!-- 468 * 60-->
            <div v-if="rand === 0">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8YOYNM+10UY+HX5B5" rel="nofollow" target="_blank">
                    <img border="0" width="468" height="60" alt="" src="https://www20.a8.net/svt/bgt?aid=190914095542&wid=001&eno=01&mid=s00000004777003010000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=35NY9B+8YOYNM+10UY+HX5B5" alt="">
            </div>


            <!-- 全巻.com-->
            <!-- 468 * 60-->
            <div v-if="rand === 1">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8UIXF6+1892+5ZMCH" rel="nofollow" target="_blank">
                    <img border="0" width="468" height="60" alt="" src="https://www28.a8.net/svt/bgt?aid=190914095535&wid=001&eno=01&mid=s00000005735001006000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=35NY9B+8UIXF6+1892+5ZMCH" alt="">
            </div>

            <!-- 復興ドットコム -->
            <!-- 468 * 60 -->
            <div v-if="rand === 2">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8RJREA+37DC+60WN5" rel="nofollow" target="_blank">
                    <img border="0" width="468" height="60" alt="" src="https://www26.a8.net/svt/bgt?aid=190914095530&wid=001&eno=01&mid=s00000014952001012000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=35NY9B+8RJREA+37DC+60WN5" alt="">
            </div>

            <!-- ひかりTV -->
            <!-- 468 * 60 -->
            <div v-if="rand === 3">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8V4D0Y+38M2+67RK1" rel="nofollow" target="_blank">
                    <img border="0" width="468" height="60" alt="" src="https://www25.a8.net/svt/bgt?aid=190914095536&wid=001&eno=01&mid=s00000015113001044000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=35NY9B+8V4D0Y+38M2+67RK1" alt="">
            </div>

            <!-- hanto -->
            <!-- 468 * 60 -->
            <div v-if="rand === 4">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8YOYNM+10UY+HX5B5" rel="nofollow" target="_blank">
                    <img border="0" width="468" height="60" alt="" src="https://www29.a8.net/svt/bgt?aid=190914095542&wid=001&eno=01&mid=s00000004777003010000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www15.a8.net/0.gif?a8mat=35NY9B+8YOYNM+10UY+HX5B5" alt="">
            </div>

            <!-- ダイヤモンド -->
            <div v-if="rand === 5">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8TXHTE+DCU+NTRMP" rel="nofollow" target="_blank">
                    <img border="0" width="468" height="60" alt="" src="https://www24.a8.net/svt/bgt?aid=190914095534&wid=001&eno=01&mid=s00000001731004002000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www19.a8.net/0.gif?a8mat=35NY9B+8TXHTE+DCU+NTRMP" alt="">
            </div>

            <!-- 復刊.com -->
            <div v-if="rand === 6">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8RJREA+37DC+60WN5" rel="nofollow" target="_blank">
                    <img border="0" width="468" height="60" alt="" src="https://www24.a8.net/svt/bgt?aid=190914095530&wid=001&eno=01&mid=s00000014952001012000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www13.a8.net/0.gif?a8mat=35NY9B+8RJREA+37DC+60WN5" alt="">
            </div>
        </div>


        <!-- large -->
        <div v-if="lg">
            <!-- ebook japan-->
            <!-- 728 * 90 -->
            <div v-if="rand === 0">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8Y3J1U+279M+C0IZL" rel="nofollow" target="_blank">
                    <img border="0" width="728" height="90" alt="" src="https://www23.a8.net/svt/bgt?aid=190914095541&wid=001&eno=01&mid=s00000010273002018000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www14.a8.net/0.gif?a8mat=35NY9B+8Y3J1U+279M+C0IZL" alt="">
            </div>

            <!-- SEshop -->
            <!-- 728 * 90 -->
            <div v-if="rand === 1">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8ZAE9E+407E+69HA9" rel="nofollow" target="_blank">
                    <img border="0" width="728" height="90" alt="" src="https://www29.a8.net/svt/bgt?aid=190914095543&wid=001&eno=01&mid=s00000018689001052000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=35NY9B+8ZAE9E+407E+69HA9" alt="">
            </div>

            <!-- -->
            <div v-if="rand === 2">
                <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8UIXF6+1892+6HU7L" rel="nofollow" target="_blank">
                    <img border="0" width="728" height="90" alt="" src="https://www27.a8.net/svt/bgt?aid=190914095535&wid=001&eno=01&mid=s00000005735001091000&mc=1"></a>
                <img border="0" width="1" height="1" src="https://www10.a8.net/0.gif?a8mat=35NY9B+8UIXF6+1892+6HU7L" alt="">
            </div>
        </div>


        <!-- ハイブリッド総合書店-->
        <!-- 320 * 100-->
        <div v-if="lm">
            <a href="https://px.a8.net/svt/ejp?a8mat=35NY9B+8YOYNM+10UY+HYNBL" rel="nofollow" target="_blank">
                <img border="0" width="320" height="100" alt="" src="https://www28.a8.net/svt/bgt?aid=190914095542&wid=001&eno=01&mid=s00000004777003017000&mc=1"></a>
            <img border="0" width="1" height="1" src="https://www17.a8.net/0.gif?a8mat=35NY9B+8YOYNM+10UY+HYNBL" alt="">
        </div>
    </div>
</template>

<script lang="ts">
    import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
    @Component
    export default class AdComponent extends Vue {
        @Prop()
        private small?: boolean;
        @Prop()
        private medium?: boolean;
        @Prop()
        private lMedium?: boolean;
        @Prop()
        private large?: boolean;

        private rand: number = 0;

        private sm: boolean = false;
        private md: boolean = false;
        private lm: boolean = false;
        private lg: boolean = false;

        private mounted() {
            if (this.small) {
                this.rand = getRandomInt(5);
                this.sm = true;
            } else if (this.medium) {
                this.rand = getRandomInt(7);
                this.md = true;
            } else if (this.lMedium) {
                this.rand = getRandomInt(2);
                this.lm = true;
            } else if (this.large) {
                this.rand = getRandomInt(3);
                this.lg = true;
            }
        }
    }

    function getRandomInt(max: number) {
        return Math.floor(Math.random() * Math.floor(max));
    }
</script>

<style scoped>

</style>
