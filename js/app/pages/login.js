export const login = {
        data: function() {
            return {
                img:1,
                parent:''
            }
        },
        mounted:function(){
            this.img = this.randomIntFromInterval(1,7);
            this.parent = this.$parent.$parent
        },
        methods:{
            randomIntFromInterval:function (min,max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            },
            login:function(){
                var self = this;
                var data = self.parent.toFormData(self.parent.formData);

                axios.post(this.parent.url+"/site/login",data).then(function(response){
                    if(response.data.error){
                        self.$refs.msg.alertFun(response.data.error)
                    }
                    if(response.data.user){
                        self.parent.user = response.data.user;
                        self.parent.page('/campaigns');
                        window.localStorage.setItem('user', JSON.stringify(self.parent.user));
                    }
                }).catch(function(error){
                    console.log('errors: ', error);
                });
            },
        },
        template: `
        <div class="flex">
    <msg ref="msg"/>
    
    <div id="left-area">
        <img :src="parent.url+'/app/views/images/Cover_'+img+'.jpg'" />
    </div>

    <div id="right-container">
        <div class="login-header">
            <div class="wrapper">
                <h1>Affiliate Sign in</h1>
                <div class="logo">
                    <img :src="parent.url+'/app/views/images/logo.svg'" />
                </div>
            </div>
        </div>

        <div id="right-area">
            <div class="form">
                <form @submit.prevent="login()" v-if="parent.formData">
                    <div class="row">
                        <label>Email</label>
                        <input type="email" v-model="parent.formData.email" required>
                    </div>

                    <div class="row">
                        <label>Password</label>
                        <input type="password" v-model="parent.formData.password" required autocomplete="on">
                    </div>

                    <div class="row">
                        <button class="btn">SIGN IN</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
`};