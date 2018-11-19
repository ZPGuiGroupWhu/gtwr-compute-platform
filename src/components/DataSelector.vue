<template>
  <div class="data-selector">
    <header class="title"><p>计算数据选择</p></header>
    <!--数据列表-->
    <div class="data-list" id="data-list">
      <div v-for="data,index in data_list">       
        <div class="parent_node">
          <img :src="data.src">
          <b>{{data.name}}</b>
        </div>   
        <div class="child_list">
          <div class="data_drag_container" v-if="data.name == '私有数据'" style="position: relative;">        
            <img class="normalFace" src="../assets/img/add.png" height="30" width="30">
                <input  type="file"  id="file"  onchange="upload(this)" >
            <p>拖拽本地文件到此处</p>   
          </div>          
          <div v-for="child,index1 in data.data_type" >
              <div class="child_node">          
                  <p :data-parentIndex="index1" :class="{highlight: childIndex == index1}">
                    <img class="child_node_img" :src='ImgParentNodeSrc'>
                    {{child.name}}
                    <button v-show="($route.path.toString().indexOf('/computeresult/')==-1) && computeSuccess.computeSuccess && index1==computeSuccess.computeChildIndex && index == computeSuccess.computeParentIndex" @click="showComputeResult()" >查看计算结果</button>
                  </p>
              </div>
              <div class="grand_son_list2">
                <div class="grand_son_list">
                  <div v-for="grandson,index2 in child.children" class="grand_son_node">
                    <p> 
                      <img :src='ImgChildNodeSrc'>
                      {{grandson.decribeName}} {{grandson.name}}
                      <button :class="{highlight:  parentIndex == index && childIndex==index1 && grandsonIndex==index2 && viewOrdescription == 0 }" @click="showDataView(index,index1,index2)">预览</button>
                      <button :class="{highlight:  parentIndex == index && childIndex==index1 && grandsonIndex==index2 && viewOrdescription == 1}" @click="showDataDesCription(index,index1,index2)">说明</button>
                    </p>
                  </div>
                </div>
              </div>
          </div>
        </div> 
      </div>
    </div>
    <!--数据列表end-->
  </div>
</template>

<script>
require('../style/dataSelector.scss')
import {mapState} from 'vuex'
import messageBus from '../bus/messageBus';

export default {
  name: 'DataSelector',
  data () {
    return {
      parentIndex: 0,
      childIndex:0,
      grandsonIndex:0,
      viewOrdescription: 0,
      ImgChildNodeSrc:require('../assets/img/service.png'),
      ImgParentNodeSrc:require('../assets/img/mind_map.png'),
    }
  },
  mounted(){
    //控制点击节点，收起列表的动画
    $(document).ready(function (){  
        //找到所有的span，并且点击span以后，控制一下元素div的显示和隐藏  
        $(".parent_node").click(function (){  
          $(this).next().toggle("slow");  
        });   
        //初始化时隐藏状态  
        $(".child_list").each(function (index,domEle){  
          $(domEle).show("slow");  
        });
        $(".child_node").click(function (){  
          $(this).next().toggle("slow");  
        });
        $(".grand_son_list").each(function (index,domEle){  
          $(domEle).show("slow");  
        });
    });
  },
  computed:{
    ...mapState({
      computeSuccess: state => state.ComputeResultBtnShow,
      data_list: state => state.data_list,
      par_list:state=>state.par_list
    })
  },
  methods:{
    /**
     * 预览按钮
     * @param index   父节点索引,示例数据/本地数据
     * @param index1  数据节点索引，具体的数据名称
     * @param index2  属性节点索引，具体数据中的属性名称
     */
    showDataView:function(index,index1,index2){
      this.$router.push({path:'/home'});
      this.IndexChange(index,index1,index2);
      this.viewOrdescription = 0;
    },
    showDataDesCription:function(index,index1,index2){
      this.$router.push({path:'/description'});
      this.IndexChange(index,index1,index2);
      this.viewOrdescription = 1;
    },
    //传输目前选择的节点的index到vuex
    IndexChange:function(index,index1,index2){
      this.parentIndex = index;
      this.childIndex = index1;
      this.grandsonIndex = index2;
      this.$store.dispatch('parentIndexAction' , this.parentIndex);
      this.$store.dispatch('childIndexAction' , this.childIndex);
      this.$store.dispatch('grandSonIndexAction' , this.grandsonIndex);
    },
    //数据节点上查看计算结果的按钮响应函数
    showComputeResult:function(){
      this.$router.push({path:'/computeresult/computeLog'});
    }
  }
}
function upload(input) {
  //支持chrome IE10
  if (window.FileReader) {
    let file = input.files[0],reader = new FileReader();
    filename = file.name.split(".")[0];
    reader.onload = function() {
      console.log(this.result)
      alert(this.result);
    }
    reader.readAsText(file);
  } 
  //支持IE 7 8 9 10
  else if (typeof window.ActiveXObject != 'undefined'){
    let xmlDoc; 
    xmlDoc = new ActiveXObject("Microsoft.XMLDOM"); 
    xmlDoc.async = false; 
    xmlDoc.load(input.value); 
    alert(xmlDoc.xml); 
  } 
  //支持FF
  else if (document.implementation && document.implementation.createDocument) { 
    let xmlDoc; 
    xmlDoc = document.implementation.createDocument("", "", null); 
    xmlDoc.async = false; 
    xmlDoc.load(input.value); 
    alert(xmlDoc.xml);
  } else { 
    alert('error'); 
  } 
}



</script>