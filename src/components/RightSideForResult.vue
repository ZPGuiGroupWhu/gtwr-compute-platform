<template>
    <div class="result-canel">
      <div class="content">
        <router-view></router-view>
      </div>    
      <div class="tab" id="tab" @click="switchTab">
          <button class="result-switch-tab" id="log" v-tip="tipForComputeLog">计算日志</button>
          <button class="result-switch-tab" id="chart" v-show="computeSuccess" v-tip="tipForChart">图表展示</button>         
          <button class="result-switch-tab" id="precision" v-show="computeSuccess" v-tip="tipForPrecision">精度评价</button>
      </div>
    </div>
</template>

<script>
require('../style/rightSideForResult.scss')
import {mapState} from 'vuex'
import messageBus from '../bus/messageBus';
import chartAnalysis from '../components/rightSideForResult/chartAnalysis.vue'
import computeLog from '../components/rightSideForResult/computeLog.vue'
import precision from '../components/rightSideForResult/precision.vue'

export default {
  name: 'RightSideForResult',
  data () {
    return {
      tipForChart: '计算结果可视化面板',
      tipForComputeLog: '计算过程的日志打印面板',
      tipForPrecision:'计算结果精度评价面板'
    }
  },
  components:{
    precision,
    chartAnalysis,
    computeLog
  },
  mounted(){
    this.$router.push({path:'/computeresult/computeLog'});//初试加载中页面路由指向计算日志模块
    document.getElementById("log").style.border="2px solid lightseagreen";
    this.listenComputeAgainTabHighlight();
  },
  computed:{
    ...mapState({
      computeSuccess: state => state.ComputeResultBtnShow.computeSuccess,
      rightContainerShow: state => state.rightContainerShow
    })
  },
  methods:{
    //重新计算之后更改右侧tab高亮
    listenComputeAgainTabHighlight:function(){
      messageBus.$on('judge-right-container-tab',(par)=>{
        par && this.handleBtnBorder(par);
      })
    },
    //切换tab跳转到对应的页面
    switchTab:function(e){
      let rootUrl = '/computeresult/';
      this.handleBtnBorder(e.target.id);//按钮高亮
      switch(e.target.id){
        case 'chart':
          this.$router.push({path:rootUrl+'chartAnalysis'});
          break;
        case 'log':
          this.$router.push({path:rootUrl+'computeLog'})
          break;
        case 'precision':
          this.$router.push({path:rootUrl+'precision'})
      }
    },
    /**
     * 调整按钮边框
     * @param String id [description] tab切换按钮的id
     */
    handleBtnBorder:function(id){
      let tab = document.getElementsByClassName('result-switch-tab');
      for (let i = 0; i< tab.length; i++) {
        if (tab[i].id != id) {
          tab[i].style.border="none"
        } else{
          tab[i].style.border="2px solid lightseagreen"
        };
      }
    }
  }
}
</script>
