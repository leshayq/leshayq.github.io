export const statistics = {
    data: function () {
      return {
        parent: "",
        data: {},
        date:"",
        date2:"",
        loader: 1,
        type: 0,
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
    methods: {
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
            data.append('id', this.parent.user.id);
            data.append('type', 'user');
            if (this.date !== "") data.append('date', this.date);
            if (this.date2 !== "") data.append('date2', this.date2);
            if (this.type !== "") data.append('type', this.type);
            self.loader = 1;
            axios.post(this.parent.url + '/site/getStatistics?auth=' + this.parent.user.auth, data)
                .then(function(response) {
                    self.loader = 0;
                    self.data = response.data;
                    if (response.data.types[0] && !self.type) 
                        self.type = response.data.types[0].id;
                    self.parent.formData.copy = self.data.multi;
                })
                .catch(function(error) {
                    self.parent.logout();
                });
        },
        
        actionStatistic: function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
            data.append('uid', this.parent.user.id);
            axios.post(this.parent.url + '/site/actionStatistic?auth=' + this.parent.user.auth, data)
                .then(function(response) {
                    if (response.data.error) {
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                        return false;
                    } else {
                        // self.$refs.payment.active = 0;
                    }

                    if (self.parent.formData.id) {
                        self.$refs.header.$refs.msg.successFun("Successfully updated banner!");
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully added new banner!");
                    }

                    self.get();
                }).catch(function(error){
                    console.log("errors:", error)
                });
        },
        copy:async function(text) {
            if(navigator && navigator.clipboard) {
                await navigator.clipboard.writeText(text);
                this.$refs.header.$refs.msg.successFun("Successfully copied!");
                this.$refs.copy.active=0;
                this.parent.formData = {};
            } else {
                this.$refs.parent.$refs.msg.alertFun("Use https!")
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
                    <div class="w20 al ptb20">
                        <a class="btnS" href="#" @click.prevent="parent.formData.copy = data.multi;$refs.copy.active=1;">Multi banners <i class="fas fa-images" style="margin-left: 5px;"></i></a>
                    </div>

                    <popup ref="img" title="Banner">
                    <div class="ac">
                        <img :src="parent.url+'/'+parent.formData.img" v-if="parent.formData.img" />
                    </div>
                    </popup>

                    <popup ref="copy" title="Copy banner">
                    <div class="form inner-form">
                        <form v-if="parent.formData">
                        <div class="row">
                            <label>Code</label>
                            <textarea v-model="parent.formData.copy"></textarea>
                        </div>

                        <div class="row">
                            <label>Type</label>
                            <div class="custom-select">
                                <select v-model="type" @change="get()" required>
                                <option value="0">------</option>
                                <option v-if="data.types" v-for="c in data.types" :value="c.id">{{c.title}}</option>
                                </select>
                            </div>
                        </div>

                        <div class="row">
                            <button class="btn" @click.prevent="copy(parent.formData.copy)">Copy code</button>
                        </div>
                        </form>
                    </div>
                    </popup>


                    

                    <div class="date-container">
                            <div class="campaigns-dates">
                                <input type="date" v-model="date" @change="get()" /> -
                                <input type="date" v-model="date2" @change="get()" />
                            </div>
                        </div>
                    <div class="campaigns-title">
                        <h1>Statistics</h1>
                    </div>
            </div>

            <div class="table" v-if="data.items!=''">
                <table>
                    <thead>
                        <tr>
                            <th class="id">Fraud clicks</th>
                            <th class="id">Leads</th>
                            <th class="id">Clicks</th>
                            <th class="id">Views</th>
                            <th>Link</th>
                            <th class="id">Campaign</th>
                            <th class="id"></th>
                            <th class="id"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in data.items">
                            <td class="id">
                                <a href="#" @click.prevent="$refs.details.active=1;getDetails(item.id,4)">
                                    <template v-if="item.fclicks">{{item.fclicks}}</template>
                                    <template v-if="!item.fclicks">0</template>
                                </a>
                            </td>
                            <td class="id">
                                <a href="#" @click.prevent="$refs.details.active=1;getDetails(item.id,3)">
                                    <template v-if="item.leads">{{item.leads}}</template>
                                    <template v-if="!item.leads">0</template>
                                </a>
                            </td>
                            <td class="id">
                                <a href="#" @click.prevent="$refs.details.active=1;getDetails(item.id,2)">
                                    <template v-if="item.clicks">{{item.clicks}}</template>
                                    <template v-if="!item.clicks">0</template>
                                </a>
                            </td>
                            <td class="id">
                                {{item.views}}
                            </td>
                            <td>
                                {{item.link}}
                            </td>
                            <td class="id">
                                {{ item.campaign_title }}
                            </td>
                            <td class="image">
                                <a href="#" @click.prevent="parent.formData = item;$refs.img.active=1;">
                                    <img :src="this.parent.url+'/'+item.img"/>
                                </a>
                            </td>
                            <td class="id">
                                <toogle v-model="item.published" @update:modelValue="item.published = $event;parent.formData = item;actionStatistic();" />
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