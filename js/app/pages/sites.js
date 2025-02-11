export const sites = {
    data: function () {
      return {
        parent: "",
        data: {},
        date:"",
        date2:"",
        loader: 1,
      };
    },
  
    mounted: function () {
        this.parent = this.$parent.$parent;
    
        if (!this.parent.user) {
          this.parent.logout();
        }
    
        this.get();
        this.GetFirstAndLastDate();
      },
    methods:{
        GetFirstAndLastDate: function () {
            var year = new Date().getFullYear();
            var month = new Date().getMonth();
            var firstDayOfMonth = new Date(year, month, 2);
            var lastDayOfMonth = new Date(year, month + 1, 1);
      
            this.date = firstDayOfMonth.toISOString().substring(0, 10);
            this.date2 = lastDayOfMonth.toISOString().substring(0, 10);
          },
          get: function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
        
            data.append('uid', this.parent.user.id);
            if (this.date != "") data.append('date', this.date);
            if (this.date2 != "") data.append('date2', this.date2);
            self.loader = 1;
            axios.post(this.parent.url + '/site/getSites?auth=' + this.parent.user.auth, data).then(function(response) {
                self.loader = 0;
                self.data = response.data;
            }).catch(function(error) {
                self.parent.logout();
            });
        },
        
        action: function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
        
            axios.post(this.parent.url + '/site/actionSite?auth=' + this.parent.user.auth, data).then(function(response) {
                // self.$refs.new.active = 0;
                if (self.parent.formData.id) {
                    self.$refs.header.$refs.msg.successFun("Successfully updated site!");
                } else {
                    self.$refs.header.$refs.msg.successFun("Successfully added new site!");
                }
        
                self.get();
            }).catch(function(error) {
                console.log('errors: ', error);
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
                    <div class="date-container">
                            <div class="campaigns-dates">
                                <input type="date" v-model="date" @change="get()" /> -
                                <input type="date" v-model="date2" @change="get()" />
                            </div>
                        </div>
                    <div class="campaigns-title">
                        <h1>Sites</h1>
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
                            <th class="id">Fraud clicks</th>
                            <th class="id">Leads</th>
                            <th class="id">Clicks</th>
                            <th class="id">Views</th>
                            <th class="id">Site</th>
                            <th class="id"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in data.items">
                            <td class="id">
                                <template v-if="item.fclicks">{{item.fclicks}}</template>
                                <template v-if="!item.fclicks">0</template>
                            </td>
                            <td class="id">
                                <template v-if="item.leads">{{item.leads}}</template>
                                <template v-if="!item.leads">0</template>
                            </td>
                            <td class="id">
                                <template v-if="item.clicks">{{item.clicks}}</template>
                                <template v-if="!item.clicks">0</template>
                            </td>

                            <td class="id">
                                {{item.views}}
                            </td>

                            <td class="id">
                                {{item.site}}
                            </td>

                            <td class="id">
                                <toogle v-model="item.published" @update:modelValue="parent.formData = $event;parent.formData = item;action();" />
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