export const payments = {
    data: function() {
        return {
            parent: "",
            data: {},
            loader: 1
        };
    },
    mounted: function() {
        this.parent = this.$parent.$parent;

        if (!this.parent.user) {
            this.parent.logout();
        }

        this.get();
    },
    methods: {
        get: function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
            data.append('id', this.parent.user.id);
            self.loader = 1;

            axios.post(this.parent.url + '/site/getPayments?auth=' + this.parent.user.auth, data)
                .then(function(response) {
                    self.loader = 0;
                    self.data = response.data;
                })
                .catch(function(error) {
                    self.parent.logout();
                });
        }
    },
    template: `
     <div class="compaign-color-container">
        <div class="inside-content">
        <Header ref="header" />
        <div class="campaign-wrapper">
            <div id="spinner" v-if="loader">
                <img src="images/loader.gif" alt="Loading..." />
            </div>
            <div class="campaigns-wrapper">
                <div class="panel">
                    <div class="campaigns-title">
                        <h1>Payments</h1>
                    </div>
            </div>

            <div class="table" v-if="data.items!=''">
                <table>
                    <thead>
                        <tr>
                            <th>Description</th>
                            <th>Date</th>
                            <th class="id">Value</th>
                            <th class="id">#</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in data.items">
                            <td class="id">
                                {{item.description}}
                            </td>
                            <td>
                                <a href="#" @click.prevent="parent.formData = item;$refs.payment.active=1;">
                                    {{item.date_title }}
                                </a>
                            </td>
                            <td class="id">
                                <a href="#" @click.prevent="parent.formData = item;$refs.payment.active=1;">
                                    {{item.value }}
                                </a>
                            </td>

                            <td class="id">
                                {{ item.id }}
                            </td>

                        </tr>
                    </tbody>
                </table>
            </div>
            <div class="empty" v-if="data.items==''">
                No items
            </div>
            </div>
        </div>
        </div>
    </div>
    `
};