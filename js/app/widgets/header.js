export const header = {
    data: function() {
        return {
            user: {},
            parent:"",
            active:0,
            menu:0
        }
    },
    watch:{
    },
    mounted() {
        this.parent = this.$parent.$parent.$parent;
    },
    methods:{
        toggleMenu: function(event) {
            const dropdown = document.getElementById("dropdown-menu");
            dropdown.classList.toggle("active");
        },
        toggleActive(){
            if(this.active==1){
                this.active = 0;
            }else{
                this.active = 1;
            }
        }
    },
    template:`
<header class="header">
    <div class="header-wrapper">
        <div class="header-70">
            <div class="user-menu">
                <i class="fas fa-caret-down" @click="toggleMenu()"></i>
                <div class="user-avatar" @click="toggleMenu()">{{ parent.user.user[0] }}</div>
                <div id="dropdown-menu" :class="{'active': activeMenu}">
                    <a href="#" @click.prevent="parent.logout();">
                        {{ parent.user.user }} Log Out
                    </a>
                </div>
            </div>

            <div id="menu">
                <ul :class="{'active':menu==1}" v-if="parent.user && parent.user.type=='admin'">
                    <li v-if="menu==1" class="al"><i class="fas fa-times" @click="menu=0"></i></li>

                    <li>
                        <router-link :class="{'active':$route.path.search('user')==1}" to="/users">
                            Users <i class="fas fa-user"></i> 
                        </router-link>
                    </li>

                    <li>
                        <router-link :class="{'active':$route.path.search('campaign')==1}" to="/campaigns">
                            Campaigns <i class="fas fa-bullhorn"></i>
                        </router-link>
                    </li>
                </ul>
            </div>
        </div>

        <div class="header-30">
            <img class="logo" :src="parent.url + '/app/views/images/logo.svg'" />
        </div>
    </div>
    <msg ref="msg"></msg>
</header>
    `
};