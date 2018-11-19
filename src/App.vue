<template>
  <div id="app" class="wrap">
    <!-- Start header -->
    <header class="header">
      <p><span>GTWR </span>云计算平台</p>
      <div v-if="username==''">
        <div class="login-container">
          <a class="loginLink" @click="login()" v-tip="msgForUserLogin">用户登录</a>
          <a class="loginLink"> / </a>
          <a class="loginLink" :class="{active : active == true && username==''}" @click="selected()" v-tip="msgForNonLogin">匿名登录</a>
	      </div>
      </div>
      <div v-else>
        <div class="login-container">
          <div class=userLogin>你好，{{username}} </div>
          <div class=exit @click="exit()" v-tip="msgForCancel">注销</div>
        </div>
     </div>
    </header>
    <!-- End  header -->
    <!-- Start 页面主体 -->
    <div class="main-content">
        <router-view></router-view>
    </div>
    <!-- End 页面主体 -->
    <!-- Start 登录遮罩 -->
    <cover-login v-show="login_show"></cover-login>
    <cover-sign v-show="sign_show"></cover-sign>
    <cover-reset v-show="reset_show"></cover-reset>
    <!-- End 登录遮罩 -->
  </div>
</template>

<script>
require('./style/app.scss')
import {mapState} from 'vuex'
import messageBus from './bus/messageBus.js'
import coverLogin from './components/login/coverForlogin.vue'
import coverSign from './components/login/coverForSign.vue'
import coverReset from './components/login/coverForReset.vue'

export default {
  name: 'App',
  data(){
  	return{
      active:false,
      login_show: false,
      sign_show: false,
      reset_show: false,
      img_par_show: false,
      msgForUserLogin:'点击后以用户名和密码登录系统，此处也是新用户注册、密码重设的入口',
      msgForNonLogin:'点击之后直接进入平台主界面，以游客方式使用平台',
      msgForCancel:'点击后可注销当前用户，以匿名方式登录'
  	}
  },
  mounted(){
    this.getShowPar();
  },
  computed:{
    ...mapState({
				username: state => state.username
		})
  },
  methods:{
    //获取cover遮罩是否显示的参数
    getShowPar:function(){
      let self = this;
      messageBus.$on('login-cover-show',function(val){
        self.login_show = val;
      });
      messageBus.$on('sign-cover-show',function(val){
        self.sign_show = val;
      });
      messageBus.$on('reset-cover-show',function(val){
        self.reset_show = val;
      });
    },
    //显示登录cover
    login:function(){
      this.login_show = true;
      this.active = this.username==''?true:false;
    },
    //登录成功，进入home页面
    selected(){
      this.$router.push({path:"/home"});
      this.active = true;
    },
    //注销
    exit:function(){
      this.$store.commit('username','');
      this.active = true;
    }
  },
  components:{
    coverLogin,
    coverSign,
    coverReset
  }
}
</script>

<style>

</style>
