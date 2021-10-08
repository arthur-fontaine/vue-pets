// import { createApp } from 'vue'
// import App from './VuePets.vue'
//
// export default createApp(App).mount('#app')

// @ts-nocheck

import VuePets from './VuePets.vue'

const install = (Vue: any) => {
    Vue.component(VuePets.name, VuePets);
};

if (typeof window !== 'undefined' && window.Vue) {
    install(window.Vue);
}

VuePets.install = install;

export default VuePets;