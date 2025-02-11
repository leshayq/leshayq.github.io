export const ads = {
    data: function () {
      return {
        parent: "",
        data: {},
        loader: 1,
      };
    },
  
    mounted: function () {
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
            data.append('uid', this.parent.user.id);
            data.append('type', 'user');
            self.loader = 1;
            axios.post(this.parent.url + "/site/getBanners?auth=" + this.parent.user.auth, data)
                .then(function(response) {
                    self.loader = 0;
                    self.data = response.data;
                })
                .catch(function(error) {
                    self.parent.logout();
                });
        },
    
        copy: async function(text) {
            if (navigator && navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                this.$refs.header.$refs.msg.successFun("Successfully copied!");
                this.$refs.copy.active = 0;
            } else {
                this.$refs.header.$refs.msg.alertFun("Use https!");
            }
        }
    },
    template: `
     <div class="compaign-color-container">
        <div class="inside-content">
        <Header ref="header" />
        <div class="campaign-wrapper">
            <div id="spinner" v-if="loader"></div>
            <div class="campaigns-wrapper">
                <div class="panel">
                    <div class="campaigns-title">
                        <h1>Ads</h1>
                    </div>
            </div>

            <popup ref="copy" title="Copy banner">
                <div class="form inner-form">
                    <form v-if="parent.formData">
                    <div class="row">
                        <label>Code</label>
                        <textarea v-model="parent.formData.copy"></textarea>
                    </div>

                    <div class="row">
                        <button class="btn" @click.prevent="copy(parent.formData.copy)">Copy code</button>
                    </div>
                    </form>
                </div>
            </popup>
            <div class="table" v-if="data.items!=''">
                <table>
                    <thead>
                        <tr>
                            <th class="actions">Actions</th>
                            <th>Link</th>
                            <th class="id">Campaign</th>
                            <th class="id"></th>
                            <th class="id">#</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in data.items">
                                    <td class="actions">
                                    <a href="#" @click.prevent="parent.formData = item;$refs.copy.active=1;">
                                        <i class="fas fa-copy"></i>
                                    </a>
                                </td>
                            <td>
                                <a href="#" @click.prevent="parent.formData = item;$refs.new.active=1;">
                                   {{item.link}}
                                </a>
                            </td>
                            <td class="id">
                                <a href="#" @click.prevent="parent.formData = item;$refs.new.active=1;">
                                   {{ item.campaign_title }}
                                </a>
                            </td>
                            <td class="image">
                                <a href="#" @click.prevent="parent.formData = item;$refs.new.active=1;">
                                    <img :src="parent.url+'/'+item.img"/>
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