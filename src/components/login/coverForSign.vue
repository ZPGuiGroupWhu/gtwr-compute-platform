<template>
  <div class="cover-login">
    <div class="box-container">
      <div class="main">
        <hr color="lightgrey"/>
        <header class="login-title"><b>新用户注册</b></header>
        <div class="login">
            <input type="text" placeholder="请输入手机号"   v-model= "LUserPhone" @blur="checkLPhone"><br/>
            <input type="text" v-if="pwdType" placeholder="请输入密码"  v-model="LUserPsd" @blur="checkLPsd" >   
            <input type="password"  placeholder="请输入密码"  v-model="LUserPsd" @blur="checkLPsd" v-else>
            <img :src="seen ? seenImg : unseenImg"  @click="changeType()" class="eye_img" /> 
            <input type="text" placeholder="输入用户名..."   v-model="username">
            <input type="text"  placeholder="请输入验证码" class="yanzhengma_input" v-model="picLyanzhengma">
            <input type="button"  @click="createCode"  class="verification"  v-model="checkCode">
            <div>
                  <input class="yanzhengma_input" type="text"  placeholder="短信验证码" />
                  <button @click="send"    class="send_msg" >
                  <span v-if="sendMsgDisabled">{{time+'秒后获取'}}</span>
                  <span v-if="!sendMsgDisabled">获取验证码</span></button>
            </div>
            <button @click="getview"    class="regist_button"><span>注册</span></button> 
        </div> 
      </div>
    </div>
    <img src="../../assets/img/close.png" height="20" width="20" @click="submitPar">
  </div>
</template>
<script>
var code="";
require('../../style/coverLogin.scss')
import messageBus from '../../bus/messageBus.js'

export default {
  name: 'coverForSign',
  data () {
    return {
        from:'system',
        coupon:{},
        id:'',
        username:'',
        message:'',
        userPhone:'',
        dialog: false,
        LUserPhone:'',
        LUserPsd:'',
        picLyanzhengma:'',
        checkCode:'', 
        time: 60, // 发送验证码倒计时
        sendMsgDisabled: false,
        seen:'',
        unseenImg:require('../../assets/img/close_eye.png'),//看不见
        seenImg:require('../../assets/img/open_eye.png'),//看得见密码
        pwdType:false, //此时文本框隐藏，显示密码框 
    }
  },
  mounted(){
    if (this.$route.query.from){
      this.form = this.$route.query.from
    }
    if (this.$route.query.id){
      this.form = this.$route.query.id
    }
    if (this.$route.query.from === 'system'){
      this.initCouponInfo()
    }
  },
  created()
  {
    this.createCode();
  },
  methods:{
  	//密码的显示隐藏
  	changeType:function(){
      this.seen = !this.seen;//小眼睛的变化
      this.pwdType=!this.pwdType;//跟着小眼睛变化，密码框隐藏显示文本框，内容就显示了
    },
    submitPar:function(){     
      messageBus.$emit('sign-cover-show',false);//关闭遮罩层与注册面板
    },
    send:function() {
      let me = this;
      me.sendMsgDisabled = true;
      let interval = window.setInterval(function() {
       if ((me.time--) <= 0) {
        me.time = 60;
        me.sendMsgDisabled = false;
        window.clearInterval(interval);
       }
      }, 1000);
    },
    checkUserPhone:function(){
      if(this.userPhone == ''){
        console.log(111)
        $(".hiddenTanchuang").removeClass('hiddenTanchuang')
      }
    },
    hiddenTanchuang(){
      $(".tanchuang").addClass("hiddenTanchuang")
    },     
    // 验证登陆手机号格式
    checkLPhone:function(){
        if(this.LUserPhone == ''){
            $(".login_content1 span:eq(0)").removeClass("disappear");
            $(".login_content1 span:eq(0)").text("请输入手机号。")
        }else if(this.LUserPhone.search(/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/)==0){
            $(".login_content1 span:eq(0)").addClass("disappear")
            return true;
        }else{
            $(".login_content1 span:eq(0)").removeClass("disappear");
            $(".login_content1 span:eq(0)").text("请输入正确手机号。")
        }
    },
    //验证登陆密码格式
    checkLPsd:function(){
        if(this.LUserPsd == ''){
            $(".login_content1 span:eq(1)").text("请输入密码");
            $(".login_content1 span:eq(1)").removeClass("disappear")
        }else if(this.LUserPsd.search(/^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,20}$/) == 0){
            $(".login_content1 span:eq(1)").addClass("disappear")
            return true;
        }else{
            $(".login_content1 span:eq(1)").removeClass("disappear");
            $(".login_content1 span:eq(1)").text("密码必须6-20位，包含字母与数字")
        }
    },
    // 图片验证码
    createCode(){
        this.code = "";
        this.checkCode = "";
        this.picLyanzhengma = ""; 
        let codeLength = 4, 
        random = new Array(0,1,2,3,4,5,6,7,8,9,'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z');  
        for(let i = 0; i < codeLength; i++) {
            let index = Math.floor(Math.random()*36);   
            this.code += random[index];   
        }
        this.checkCode = this.code; 
    },  
    getview:function(){
      messageBus.$emit('sign-cover-show',false);
      this.$router.push({path:"/home"});
      this.$store.commit('username',this.username);
    },
  }
}
</script>
