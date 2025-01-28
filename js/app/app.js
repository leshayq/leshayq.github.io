import { router } from './router.js';

document.addEventListener('DOMContentLoaded', function () {
    const main = {
        data() {
            return {
                url: "http://affiliate.yanbasok.com",
                user: { name: "", phone: "", email: "", date: "", auth: "" },
                formData: {},
                title: "",
                date: "",
                time: "",
            };
        },
        watch: {
            $route: function () {
                this.init();
            },
        },
        mounted: function () {
            this.init();
        },
        methods: {
            init() {
            },
        },
    };

    var app = Vue.createApp(main)
        .use(router)
        .mount('#content');
});