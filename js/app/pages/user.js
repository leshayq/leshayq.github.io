export const user = {
    data: function() {
        return {
            parent: "",
            data: {},
            user: {},
            tab: 0,
            tabs: ["Statistic", "Sites", "Payments"],
            date: "",
            date2: "",
            iChart: -1,
            loader: 1
        };
    },
    mounted: function() {
        this.parent = this.$parent.$parent;

        if (!this.parent.user) {
            this.parent.logout();
        }

        if (!this.parent.$route.params.id) this.parent.page('/users');
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
            data.append('id', this.parent.$route.params.id);
            data.append('uid', this.parent.$route.params.id);
            if (this.date != "") data.append('date', this.date);
            if (this.date2 != "") data.append('date2', this.date2);
            self.loader = 1;
            axios.post(this.parent.url + '/site/getUser?auth=' + this.parent.user.auth, data)
                .then(function(response) {
                    self.loader = 0;
                    self.data = response.data;
                    if (self.data.info) self.user = self.data.info;
                    document.title = self.data.info.user;
                })
                .catch(function(error) {
                    self.parent.logout();
                });
        },
        
        action: function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
        
            axios.post(this.parent.url+'/site/actionUser?auth=' + this.parent.user.auth, data).then(function(response) {
                    if (response.data.error) {
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                        return false;
                    } else {
                        self.$refs.new.active = 0;
                    }

                    if (self.parent.formData.id) {
                        self.$refs.header.$refs.msg.successFun("Successfully updated user!");
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully added new user!");
                    }

                    self.get();
                }).catch(function(error){
                    console.log('errors: ', error)
                });
        },
        del: async function () {
            if(await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this user?")){
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);
        
                axios.post(this.parent.url+"/site/deleteUser?auth="+this.parent.user.auth, data).then(function(response){
                    if(response.data.error){
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                        return false;
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully deleted user!");
                        self.get();
                }
                }).catch(function(error){
                    console.log('errors: ', error);
                });
            }
        },
        actionStatistic: function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
            data.append('uid', this.parent.$route.params.id);
            axios.post(this.parent.url + "/site/actionStatistic?auth=" + this.parent.user.auth, data)
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
                })
                .catch(function(error) {
                    console.log('errors: ', error);
                });
        },
        
        actionPayment: function() {
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);
            data.append('uid', this.parent.$route.params.id);
            axios.post(this.parent.url + "/site/actionPayment?auth=" + this.parent.user.auth, data)
                .then(function(response) {
                    if (response.data.error) {
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                        return false;
                    } else {
                        self.$refs.payment.active=0;
                    }

                    if(self.parent.formData.id){
                        self.$refs.header.$refs.msg.successFun("Successfully updated payment!")
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully added new payment!")
                    }

                    self.get();
                })
                .catch(function(error) {
                    console.log('errors: ', error);
                });
        },
        delPayment:async function () {
            if(await this.$refs.header.$refs.msg.confirmFun("Please confirm next action", "Do you want to delete this payment?")){
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);

                axios.post(this.parent.url+'/site/deletePayment?auth='+this.parent.user.auth,data).then(function(response){
                    if (response.data.error) {
                        self.$refs.header.$refs.msg.alertFun(response.data.error);
                        return false;
                    } else {
                        self.$refs.header.$refs.msg.successFun("Successfully deleted payment");
                        self.get();
                    }
                }).catch(function(error){
                    console.log('errors', error);
                });
            }
        },

        actionSite:function(){
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url + "/site/actionSite?auth=" + this.parent.user.auth, data).then(function(response){
                if(self.parent.formData.id){
                    self.$refs.header.$refs.msg.successFun("Successfully updated site!");
                } else {
                    self.$refs.header.$refs.msg.successFun("Successfully added new site!");
                }

                self.get();
            }).catch(function(error){
                console.log('errors:', error);
            });
        },  
        line: function(item) {
            setTimeout(function() {
                let dates = [];
                let clicks = [];
                let views = [];
                let leads = [];
                if(item && item['line']) {
                    for(let i in item['line']) {
                        dates.push(i);
                            clicks.push(item['line'][i].clicks);
                            views.push(item['line'][i].views);
                            leads.push(item['line'][i].leads);
                    }
                }
                
        
                document.getElementById('chartOuter').innerHTML = 
                '<div id="chartHints"><div class="chartHintsViews">Views</div><div class="chartHintsClicks">Clicks</div></div>' +
                '<canvas id="myChart"></canvas>';
        
                const ctx = document.getElementById('myChart');
                const xScaleImage = {
                    id: "xScaleImage",
                    afterDatasetsDraw(chart, args, plugins) {
                        const { ctx, data, chartArea: { bottom }, scales: { x } } = chart;
                        ctx.save();
                        data.images.forEach((image, index) => {
                            const label = new Image();
                            label.src = image;
        
                            const width = 120;
                            ctx.drawImage(label, x.getPixelForValue(index) - (width / 2), x.top, width, width);
                        });
                    }
                }
                new Chart(ctx, {
                    type: 'line',
                
                    data: {
                        labels: dates,
                        datasets: [
                            {
                                label: "Clicks",
                                backgroundColor: "#00599D",
                                borderColor: "#00599D",
                                data: clicks
                            },
                            {
                                label: "Views",
                                backgroundColor: "#50008B",
                                borderColor: "#50008B",
                                data: views,
                                yAxisID: 'y2'
                            }
                        ]
                    },
                
                    options: {
                        responsive: true,
                        plugins: {
                            tooltip: {
                                bodyFontSize: 20,
                                usePointStyle: true,
                                callbacks: {
                                    title: (ctx) => {
                                        return ctx[0]['dataset'].label;
                                    },
                                }
                            },
                            legend:{
                                display:false
                            }
                        },
                        categoryPercentage: 0.2,
                        barPercentage: 0.8,
                        scales:{
                            y: {
                                id: 'y2',
                                position: 'right'
                            },
                            x:{
                                afterFit: (scale) => {
                                    scale.height = 120;
                                }
                            }
                        }
                    },
                });
            },100);
        },
        },
        template:`
            <div class="compaign-color-container">
            <div class="inside-content">
            <Header ref="header" />
            <div class="panel single-user-header">
                <div class="single-campaign-wrapper">
                <div class="add-edit-btns">
                    <a class="btnS" href="#" @click.prevent="parent.formData=data.info;$refs.new.active=1">
                        <span>Edit user</span> <i class="fas fa-edit"></i>
                    </a>
                </div>
                    <div class="campaigns-title">
                        <h1 v-if="data && data.info">{{ data.info.user }}</h1>
                    </div>
                </div>
                <div class="user-ar">
                    <div class="user-header-wrapper">
                        <div class="w20 al ptb20 center-email">
                            <p><b>Email: </b>{{data.info.email}}</p>
                        </div>
                        <div class="w20 al ptb20">
                            <p><b>Phone: </b>{{data.info.phone}}</p>
                        </div>
                    <div>
                </div>
                </div>
                
                </div>
                <div class="tabs">
                    <ul>
                        <li v-if="tabs" v-for="(t,i) in tabs" :class="{active:tab==i}" @click="tab=i">{{t}}</li>
                    </ul>
                </div>
            </div>
            <div class="campaign-wrapper">
                <div id="spinner" v-if="loader"></div>
                <div class="campaigns-wrapper">
                    <div class="panel">



                        <popup ref="new" :title="(parent.formData && parent.formData.id) ? 'Edit user' : 'New user'">
                        <div class="form inner-form">
                            <form @submit.prevent="action()" v-if="parent.formData">

                                <div class="row">
                                    <label>Name</label>
                                    <input type="text" v-model="parent.formData.user" required>
                                </div>

                                <div class="row">
                                    <label>Phone</label>
                                    <input type="text" v-model="parent.formData.phone" required>
                                </div>

                                <div class="row">
                                    <label>Email</label>
                                    <input type="text" v-model="parent.formData.email" required>
                                </div>

                                <div class="row">
                                    <label>Password</label>
                                    <input type="text" v-model="parent.formData.password">
                                </div>

                                <div class="row">
                                    <button class="btn" v-if="parent.formData && parent.formData.id">Edit</button>
                                    <button class="btn" v-if="parent.formData && !parent.formData.id">ADD</button>
                                </div>
                            </form>
                        </div>
                    </popup>
                </div>

                <div v-if="tab==1">
                    
                    <div class="date-container">
                                    <div class="campaigns-dates">
                                        <input type="date" v-model="date" @change="get()" /> -
                                        <input type="date" v-model="date2" @change="get()" />
                                    </div>
                                </div>
                            <div class="campaigns-title">
                                <h2>{{tabs[tab]}}</h2>
                            </div>

                    <popup ref="chart" fullscreen="true" title="Chart">
                        <div class="campaign-detail-container">
                                <div class="campaign-detail-row">
                                    <div class="campaign-detail-70">
                                        <div class="stats-container">
                                            <div class="stat-box ctr">
                                                <p>CTR:</p>
                                                <span class="campaign-stat-number">
                                                    {{ (data.sites[iChart].clicks * 100 / data.sites[iChart].views).toFixed(2) }}%
                                                </span> 
                                            </div>
                                            <div class="stat-box leads">
                                                <p>Leads</p>
                                                <span class="campaign-stat-number">{{ data.sites[iChart].leads }}</span>
                                            </div>
                                            <div class="stat-box views">
                                                <p>Views</p>
                                                <span class="campaign-stat-number">{{ data.sites[iChart].views }}</span>
                                            </div>
                                            <div class="stat-box clicks">
                                                <p>Clicks</p>
                                                <span class="campaign-stat-number">{{ data.sites[iChart].clicks }}</span>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                    <div class="campaign-detail-30">
                                        <div class="campaign-detail-header">
                                            <div class="detail-date-picker">
                                                <input type="date" v-model="date" @change="get();" /> - 
                                                <input type="date" v-model="date2" @change="get();" />
                                            </div>
                                        </div>
                                    </div>              
                                </div>
                                <div class="campaign-detail-row">
                                    <div class="campaign-detail-70">
                                        <div class="chart-container" id="chartOuter">
                                            <div id="chartHints">
                                                <div class="chartHintsViews">Views</div>
                                                <div class="chartHintsClicks">Clicks</div>
                                            </div>

                                            <canvas id="myChart"></canvas>
                                        </div>
                                    </div>
                                    <div class="campaign-detail-30">
                                        <div class="campaign-detail-content">
                                            <div class="site-filters">
                                                <div class="site-item" v-if="all">
                                                    <label>All</label>
                                                    <toogle v-model="all" @update:modelValue="all = $event; checkAll($event)" />
                                                </div>
                                                <div class="site-item" v-if="data.sites[iChart].sites" v-for="s in data.sites[iChart].sites">
                                                    <label>{{ s.site }}</label>
                                                    <toogle v-model="s.include" @update:modelValue="s.include = $event; parent.formData = data.sites[iChart]; get()" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                    </popup>


                    <div class="table" v-if="data.sites!=''">
                        <table>
                            <thead>
                                <tr>
                                    <th class="actions">Actions</th>
                                    <th class="id">Fraud clicks</th>
                                    <th class="id">Leads</th>
                                    <th class="id">Clicks</th>
                                    <th class="id">Views</th>
                                    <th class="id">Site</th>
                                    <th class="id"></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,i) in data.sites">
                                    <td class="actions">
                                        <a href="#" @click.prevent="parent.formData = item;iChart = i;$refs.chart.active=1;line(item)"> 
                                            <i class="fas fa-chart-bar"></i>
                                        </a>
                                    </td>
                                    <td class="id">
                                        <a href="#" @click.prevent="$refs.details.active=1;getDetails(item.id,4)">
                                            <template v-if="item.fclicks">{{item.fclicks}}</template>
                                            <template v-if="!item.fclicks">0</template>
                                        </a>
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
                                        {{ item.site }}
                                    </td>
                                    <td class="id">
                                        <toogle v-model="item.published" @update:modelValue="item.published = $event;parent.formData = item;actionSite();" />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>


                        <div class="empty" v-if="data.sites==''">
                            No items
                        </div>
                    </div>
                
                <div v-if="tab==2">
                    <div class="user-payments">
                        <a class="btnS" href="#" @click.prevent="parent.formData={};$refs.payment.active=1">
                        <span>Add payment</span> <i class="fas fa-plus"></i>
                        </a>
                    </div>
                    <div class="campaigns-title">
                        <h2>{{tabs[tab]}}</h2>
                    </div>

                    <popup ref="payment" :title="(parent.formData && parent.formData.id) ? 'Edit payment' : 'New payment'">
                        <div class="form inner-form">
                            <form @submit.prevent="actionPayment()" v-if="parent.formData">
                            <div class="row">
                                <label>Value</label>
                                <input type="number" v-model="parent.formData.value" required>
                            </div>
                            <div class="row">
                                <label>Date</label>
                                <input type="date" v-model="parent.formData.date" required>
                            </div>
                            <div class="row">
                                <label>Description</label>
                                <input type="text" v-model="parent.formData.description">
                            </div>

                            <div class="row">
                                <button class="btn" v-if="parent.formData && parent.formData.id">Edit</button>
                                <button class="btn" v-if="parent.formData && !parent.formData.id">Add</button>
                            </div>
                            </form>
                        </div>
                    </popup>

                    <div class="table" v-if="data.payments!=''">
                        <table>
                            <thead>
                                <tr>
                                    <th class="actions">Actions</th>
                                    <th>Description</th>
                                    <th>Date</th>
                                    <th class="id">Value</th>
                                    <th class="id">#</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item,i) in data.payments">
                                    <td class="actions">
                                        <a href="#" @click.prevent="parent.formData = item;delPayment();"> 
                                            <i class="fas fa-trash-alt"></i>
                                        </a>

                                        <a href="#" @click.prevent="parent.formData = item;$refs.payment.active=1;"> 
                                            <i class="fas fa-edit"></i>
                                        </a>

                                    </td>
                                    <td>
                                        {{item.description}}
                                    </td>

                                    <td>
                                        <a href="#" @click.prevent="parent.formData = item;$refs.ad.active=1;">
                                            {{item.date_title}}
                                        </a>
                                    </td>

                                    <td class="id">
                                        <a href="#" @click.prevent="parent.formData = item;$refs.ad.active=1;">
                                            {{item.value}}
                                        </a>
                                    </td>

                                    <td class="id">
                                        {{item.id}}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                    </div>
                        <div class="empty" v-if="data.payments==''">
                            No items
                        </div>
                </div>



                <div v-if="tab==0">
                    <div class="panel">
                        <div class="date-container">
                                <div class="campaigns-dates">
                                    <input type="date" v-model="date" @change="get()" /> -
                                    <input type="date" v-model="date2" @change="get()" />
                                </div>
                            </div>
                        <div class="user-tab-title">
                            <h1>{{tabs[tab]}}</h1>
                        </div>
                    </div>

                    <popup ref="img" title="Banner">
                        <div class="ac">
                            <img :src="this.parent.url+parent.formData.img" v-if="parent.formData.img" />
                        </div>
                    </popup>

                <div class="table" v-if="data.statistics!=''">
                <table>
                    <thead>
                        <tr>
                            <th class="id">Fraud clicks</th>
                            <th class="id">Leads</th>
                            <th class="id">Clicks</th>
                            <th class="id">Views</th>
                            <th>Link</th>
                            <th class="id">Size</th>   
                            <th>Campaign</th>   
                            <th class="id"></th>
                            <th class="id"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in data.statistics">
                            <td class="id">
                                <a href="#" @click.prevent="$refs.details.active=1;getDetails(item.id,4)">
                                    <template v-if="item.fclicks">{{item.fclicks}}</template>
                                    <template v-if="!item.fclicks">0</template>
                                </a>
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

                            <td>
                                {{item.link }}
                            </td>

                            <td class="id">
                                {{item.size }}
                            </td>

                            <td class="id">
                                {{item.campaign_title }}
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
            <div class="empty" v-if="data.statistics==''">
                No items
            </div>
            </div>
            </div>
        </div>
        `
};
