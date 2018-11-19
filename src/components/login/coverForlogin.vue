<template>
  <div class="cover-login">
    <div class="box-container">
      <div class="main">
        <hr color="lightgrey"/>
        <header class="login-title"><b>欢迎登录</b></header>
        <div class="login">
            <input type="text"   placeholder="输入用户名..."  v-model="username"><br/>
            <input type="text"  v-if="pwd_type"  placeholder="输入密码">
            <input type="password" placeholder="输入密码" v-else>
            <img :src="see ? seeImg : unseeImg"  @click="change_type()" class="eye_img" />
            <button @click="submitPar" ><span>登录</span></button>
            <div>
              <a @click="reset" style="float:right">忘记密码？</a>
              <a @click="sign"  style="float:left">注册</a>
            </div>
        </div>  
      </div>
    </div>
    <img src="../../assets/img/close.png" height="20" width="20" @click="submitPar">
  </div>
</template>

<script>
import messageBus from '../../bus/messageBus.js'
require('../../style/coverLogin.scss')
import {mapState} from 'vuex'

export default {
	name: 'coverForLogin',
  data () {
    return {
      see:'',
      unseeImg:require('../../assets/img/close_eye.png'),//看不见
      seeImg:require('../../assets/img/open_eye.png'),//看得见密码
      pwd_type:false, //此时文本框隐藏，显示密码框 
      username:this.$store.state.username
    }
  },
  mounted(){
  },
  methods:{
    //密码的显示隐藏
    change_type:function(){
      this.see = !this.see;//小眼睛的变化
      this.pwd_type=!this.pwd_type;//跟着小眼睛变化，密码框隐藏显示文本框，内容就显示了
    },
    submitPar:function(){
        messageBus.$emit('login-cover-show',false);//关闭遮罩层与登录面板
        this.$store.commit('username',this.username);
        this.$router.push({path:"/home"});
    },
    sign:function(){     
      messageBus.$emit('login-cover-show',false);//关闭遮罩层与登录忘记密码面板
      messageBus.$emit('reset-cover-show',false);     
      messageBus.$emit('sign-cover-show',true);//打开注册页面
    },
    reset:function(){      
      messageBus.$emit('login-cover-show',false);//关闭遮罩层与登录注册面板
      messageBus.$emit('sign-cover-show',false);     
      messageBus.$emit('reset-cover-show',true);//打开忘记密码页面
    }
  }   
}
</script>
