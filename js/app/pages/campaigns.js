export const campaigns = {
    data: function () {
      return {
        parent: "",
        data: {},
        details: {},
        date: "",
        date2: "",
        q: "",
        sort: "",
        loader: 1,
        iChart:-1,
        id: 0,
        type: 0,
        all: true
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
        if(this.date!="") data.append('date', this.date);
        if(this.date2!="") data.append('date2', this.date2);
        this.loader = 1;
        axios.post(this.parent.url+"/site/getCampaigns?auth="+this.parent.user.auth, data).then(function(response){
            self.data = response.data;
            self.loader = 0;
        }).catch(function(error){
            self.parent.logout();
        });
    },
    
    action: function() {
        var self = this;
        self.parent.formData.copy = "";
        var data = self.parent.toFormData(self.parent.formData);
    
        axios.post(this.parent.url+"/site/actionCampaign?auth="+this.parent.user.auth, data).then(function(response){
            self.$refs.new.active = 0;
            if(self.parent.formData.id){
                self.$refs.header.$refs.msg.successFun("Successfully updated campaign!");
            }else{
                self.$refs.header.$refs.msg.successFun("Successfully added new campaign!");
            }
            self.get();
        }).catch(function(error){
            console.log('errors : ', error);
        });
    },
    del:async function() {
        if(await this.$refs.header.$refs.msg.confirmFun("Please confirm next action","Do you want to delete this campaign?")){
            var self = this;
            var data = self.parent.toFormData(self.parent.formData);

            axios.post(this.parent.url+"/site/deleteCampaign?auth="+this.parent.user.auth,data).then(function(response){
                if(response.data.error){
                    self.$refs.header.$refs.msg.alertFun(response.data.error);
                }else{
                    self.$refs.header.$refs.msg.successFun("Successfully deleted campaign!");
                    self.get();
                }

            }).catch(function(error){
                console.log('errors:', error);
            });
        }
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
    checkAll:function(prop){
        if(this.data.items[this.iChart].sites){
            for(let i in this.data.items[this.iChart].sites){
                this.data.items[this.iChart].sites[i].include = prop;
            }
        }
        this.parent.formData = this.data.items[this.iChart];
        this.get();
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
                    <div class="w20 al ptb20">
                        <a class="btnS" href="#" @click.prevent="parent.formData={};$refs.new.active=1">New <i class="fas fa-plus" style="margin-left: 5px;"></i></a>
                    </div>

                    <popup ref="new" :title="(parent.formData && parent.formData.id) ? 'Edit campaign' : 'New campaign'">
                        <div class="form inner-form">
                            <form @submit.prevent="action()" v-if="parent.formData">
                                <div class="row">
                                    <label>Name</label>
                                    <input type="text" v-model="parent.formData.title" required>
                                </div>

                                <div class="row">
                                    <button class="btn" v-if="parent.formData && parent.formData.id">Edit</button>
                                    <button class="btn" v-if="parent.formData && !parent.formData.id">ADD</button>
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
                        <h1>Campaigns</h1>
                    </div>
            </div>

                    <popup ref="chart" fullscreen="true" title="Chart">
                    <div class="campaign-detail-container">
                            <div class="campaign-detail-row">
                                <div class="campaign-detail-70">
                                    <div class="stats-container">
                                        <div class="stat-box ctr">
                                            <p>CTR:</p>
                                            <span class="campaign-stat-number">
                                                {{ (data.items[iChart].clicks * 100 / data.items[iChart].views).toFixed(2) }}%
                                            </span>
                                        </div>
                                        <div class="stat-box leads">
                                            <p>Leads</p>
                                            <span class="campaign-stat-number">{{ data.items[iChart].leads }}</span>
                                        </div>
                                        <div class="stat-box views">
                                            <p>Views</p>
                                            <span class="campaign-stat-number">{{ data.items[iChart].views }}</span>
                                        </div>
                                        <div class="stat-box clicks">
                                            <p>Clicks</p>
                                            <span class="campaign-stat-number">{{ data.items[iChart].clicks }}</span>
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
                                            <div class="site-item" v-if="data.items[iChart].sites" v-for="s in data.items[iChart].sites">
                                                <label>{{ s.site }}</label>
                                                <toogle v-model="s.include" @update:modelValue="s.include = $event; parent.formData = data.items[iChart]; get()" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                     </popup>


            <div class="table" v-if="data.items!=''">
                <table>
                    <thead>
                        <tr>
                            <th class="actions">Actions</th>
                            <th class="id">Fraud clicks</th>
                            <th class="id">Leads</th>
                            <th class="id">Clicks</th>
                            <th class="id">Views</th>
                            <th>Title</th>
                            <th class="id"></th>
                            <th class="id">#</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(item,i) in data.items">
                            <td class="actions">
                                <a href="#" @click.prevent="parent.formData = item;del();">
                                    <i class="fas fa-trash-alt"></i>
                                </a>

                                <a href="#" @click.prevent="parent.formData = item;iChart = i;$refs.chart.active=1;line(item)"> 
                                    <i class="fas fa-chart-bar"></i>
                                </a>

                                <router-link :to="'campaign/'+item.id">
                                    <i class="fas fa-edit"></i>
                                </router-link>
                            </td>
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
                                <a href="#" @click.prevent="$refs.details.active=1;getDetails(item.id,1)">
                                    {{item.views}}
                                </a>
                            </td>
                            <td>
                                <router-link :to="'/campaign/' + item.id">{{ item.title }}</router-link>
                            </td>
                            <td class="id">
                                <toogle v-model="item.published" @update:modelValue="parent.formData = item;action()" />
                            </td>
                            <td class="id">{{item.id}}</td>
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
    `};