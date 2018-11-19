<template>
  <div class="data-container">
  	<header class="title"><p>计算数据内容</p></header><!-- /header -->
  	<div class="data-head">
      <table>
        <tr>
          <th v-for="key in Object.keys(dataA[0].features[0].properties).length>11 ? (Object.keys(dataA[0].features[0].properties)).slice(0,11) : Object.keys(dataA[0].features[0].properties)">{{key}}</th>
        </tr>
	  </table>
	 </div>
	 <div class="data-table" id="data-table">
	  <table id="t1">
        <tbody>
          <tr v-for="line in dataA[0].features" :id="SpaceFilter(line.properties.name)" @click="InteractWithMap(line.properties.name,line)">
            <td v-for="key in Object.keys(line.properties).length>11 ? (Object.keys(line.properties)).slice(0,11) : Object.keys(line.properties)">{{line.properties[key]}}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
require('../style/dataViewer.scss')
import {mapState} from 'vuex'
import messageBus from '../bus/messageBus.js'

export default {
  name: 'DataViewer',
  data () {
    return {
      titlename:'', 
      proCol:[]    
    }
  },
  mounted(){
    this.getEventData();
  },
  computed:{
    ...mapState({
      parentNodeIndex: state => state.parent_node_index,
      childNodeIndex: state => state.child_node_index
	  }),
    dataA(){
      return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].url;
    },
  },
  methods:{
    //绘制表格
  	getEventData(){
  		const that = this;
  		messageBus.$on('event-to-chart',function(val){
        this.titlename=val 
        let id = '#'+that.SpaceFilter(this.titlename),
            $objTr = $(id), 
            t1 = document.getElementById('t1');
        for(var i=0;i<t1.rows.length;i++){
          t1.rows[i].style.backgroundColor='';
        } 
        $objTr.css("background-color","#DCDCDC"); //jquery方法,使表格中的滚动条滚动到指定位置，同时改变背景色
        let tableContainer = $("#data-table"),
            scrollLocation = $objTr.offset().top-tableContainer.offset().top+tableContainer.scrollTop();//计算滚动的位置
        tableContainer.animate({scrollTop:scrollLocation},"slow"); //定位tr 
      });
  	},
    /**
     * 字符串格式化，将name中包含空格的字符串进行格式化，如New Mexico=>New-Mexico
     * @param String string [description] name字符串
     */
    SpaceFilter:function(string){
      if (typeof string === 'string') {
        if(string.indexOf(" ") != -1) {
            let string_ = string.replace(' ','_');
            return string_;
        }
      }
      return string;
    },
    /**
     * 与地图交互，传输数据
     * @param string name [description] 数据行的name，用于标识不同的数据行
     * @param string line [description] 传输到地图端用于地图高亮的数据
     */
    InteractWithMap:function(name,line){
      let t1 = document.getElementById('t1');
      for(let i=0;i<t1.rows.length;i++){
        t1.rows[i].style.backgroundColor='';
      } 
      let id = '#'+name,//点击数据行的id
          $objTr = $(id); //找到数据行的dom 
      $objTr.css("background-color","#DCDCDC"); //设置点击行的css
      messageBus.$emit('from-table-to-map',line)
    }
  }
}
</script>
