<template>
    <div>
        <div class="header">
            <div style="margin: auto;margin-left: 13.5px;font-weight: 600;font-size: 1.25em;">
                <router-link :to="{name:'booksView'}" class="title">{{title}}</router-link>
            </div>
            <v-spacer></v-spacer>
        </div>
        <div style="margin:20px;padding:20px;position:absolute; top:50px;">
            <div style="font-size:2em;">プライバシーポリシー</div>
            <div class="block">
                <h3>本アプリについて</h3>
                <p>本プライバシーポリシーは、BookStorage（以下、「本アプリ」とします。)の各種サービスにおいて、
                    本アプリの訪問者（以下、「訪問者」とします。）の個人情報もしくはそれに準ずる情報を取り扱う際に、
                    本アプリが遵守する方針を示したものです。</p>
            </div>

            <div class="block">
                <h3>基本方針</h3>
                <p>本アプリは、個人情報の重要性を認識し、個人情報を保護することが社会的責務であると考え、
                    個人情報に関する法令を遵守し、本アプリで取扱う個人情報の取得、利用、管理を適正に行います。
                    本アプリで収集した情報は、利用目的の範囲内で適切に取り扱います。</p>
            </div>

            <div class="block">
                <h3>適用範囲</h3>
                <p>本プライバシーポリシーは、本アプリにおいてのみ適用されます。</p>
            </div>

            <div class="block">
                <h3>個人情報の利用目的</h3>
                <p>本アプリ利用には、メールアドレス等の個人情報をご登録いただく必要があります。
                    これらの個人情報は、本アプリのサービス提供・運用のために利用され、それ以外の目的では利用しません。</p>
            </div>

            <div class="block">
                <h3>個人情報の第三者への開示</h3>
                <p>個人情報は適切に管理し、以下に該当する場合を除いて第三者に開示することはありません。</p>
                <ul style="margin-left: 50px;">
                    <li>本人のご了解がある場合</li>
                    <li>法令等への協力のため、開示が必要となる場合</li>
                </ul>
                <p></p>
            </div>

            <div class="block">
                <h3>個人情報の開示・訂正・追加・削除・利用停止</h3>
                <p>個人情報の開示・訂正・追加・削除・利用停止をご希望の場合には、
                    ご本人であることを確認したうえで、速やかに対応致します。</p>
            </div>

            <div class="block">
                <h3>アクセス解析ツールについて</h3>
                <p>本アプリでは、Googleによるアクセス解析ツール「Googleアナリティクス」を利用しています。
                    このGoogleアナリティクスはトラフィックデータの収集のためにCookieを使用しています。
                    このトラフィックデータは匿名で収集されており、個人を特定するものではありません。
                    この機能はCookieを無効にすることで収集を拒否することが出来ますので、
                    お使いのブラウザの設定をご確認ください。
                    この規約に関して、詳しくは
                    <a href="https://marketingplatform.google.com/about/analytics/terms/jp/" target="_blank">
                        ここをクリック
                    </a>
                    してください。</p>
            </div>

            <div class="block">
                <h3>免責事項</h3>
                <p>上記の提携サービスおよびシステム障害により生じる損害について、
                    本アプリ管理者は責任を負わないものとします。
                    本アプリで掲載している画像や動画の著作権・肖像権等は各権利所有者に帰属致します。</p>
                <p>本アプリでは、Rakuten Developersを利用し、本の情報を取得しています。</p>
                <!-- Rakuten Web Services Attribution Snippet FROM HERE -->
                <p><a href="https://webservice.rakuten.co.jp/" target="_blank">Supported by Rakuten Developers</a></p>
                <!-- Rakuten Web Services Attribution Snippet TO HERE -->
            </div>

            <div class="block">
                <h3>プライバシーポリシーの改定について</h3>
                <p>本アプリでは、プライバシーポリシーの全部または一部を告知なく改定することがあります。</p>
            </div>

            <div class="block">
                <h3>問い合わせ</h3>
                <p>連絡先: {{address}}</p>
                <p>最終更新日: 2019年10月27日</p>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';
    import {BaseComponent} from '@/utils/utils';

    @Component
    export default class PrivacyPolicyView extends BaseComponent {
        private title: string = 'BookStorage';
        private address: string = 'bookstorage.edgwbs@gmail.com';

        public mounted() {
            super.mounted();
        }

    }

</script>

<style scoped>
    .title {
        text-decoration: none;
        color:white;
    }
    .header{
        display: flex;
        flex-direction: row;
        position: fixed;
        top:0;
        height:50px;
        width: 100%;
        background-color: dodgerblue;
        z-index:2000;
    }
    .block{
        margin: 30px;
    }
    h3 {
        margin: 10px;
    }
    p {
        margin: 10px;
    }
</style>
