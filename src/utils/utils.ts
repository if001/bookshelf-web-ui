export function toTop() {
    window.scrollTo(0, 0);
}

import { Vue } from 'vue-property-decorator';
export class BaseComponent extends Vue {
    public mounted() {
        toTop();
    }
}
