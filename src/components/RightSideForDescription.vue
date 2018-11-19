<template>
  <div class="right-container-descrip">
    <div class="right-container-descrip-info">
      <header class="title"><p>数据内容描述</p></header><!-- /header -->
      <div class="right-container-descrip-info_detail">
        <p v-for="item in info">
          <span class="title">{{item.name}}:</span>
          <span class="content">{{item.content}}</span>
        </p>
      </div>
    </div>
    <div class="right-container-descrip-extent">
      <header class="title"><p>数据空间范围</p></header><!-- /header -->
      <div class="right-container-descrip-extent_map">
        <div class="right-container-descrip-extent_map_top"><span>North Bound</span><p>{{LogVal[1].toFixed(2)}}</p></div>
        <div class="right-container-descrip-extent_map_mid">
          <div class="left-cor"><span>West Bound</span><p>{{latVal[0].toFixed(2)}}</p></div>
          <div id="extent-map" ></div>
          <div class="right-cor"><span>East Bound</span><p>{{latVal[1].toFixed(2)}}</p></div>
        </div>  
        <div class="right-container-descrip-extent_map_bot"><span>South Bound</span><p>{{LogVal[0].toFixed(2)}}</p></div>
      </div>
    </div>
  </div>
</template>

<script>
import Leaflet from 'leaflet'
import {mapState} from 'vuex'
import messageBus from '../bus/messageBus';
require('../style/main_style.scss')

var bgMapUrl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2VtbWFhYWEiLCJhIjoiY2o2a2N5dzB1MWd1ZTMzcnlqMDhkM3ZjYyJ9.0vVVkY9k7t8z0e3uqMgQnQ';

export default {
  name: 'RightSideForDataView',
  data () {
    return {
      map: null,
      info:[{
        name:'Title',
        content:'Attributes for MRB_E2RF1 Catchements by Major River Basins in the Conterminous United States: Level 3 Nutrient Ecoregions'
      },{
        name:'Date',
        content:'2011'
      },{
        name:'Date Type',
        content:'publication date'
      },{
        name:'code',
        content:''
      },{
        name:'Hierachy level',
        content:'This tabular data set represents the area of each level 3 nutrient ecoregion in square meters compiled for every MRB_E2RF1 catchment of the Major River Basins'
      },{
        name:'Purpose',
        content:'referenced chatacteristics of watersheds, including contaminant sources and factors influencing terrestrial and stream transport'
      },{
        name:'status',
        content:'Complete'
      }]
    }
  },
  computed:{
    ...mapState({
      parentNodeIndex: state => state.parent_node_index,
      childNodeIndex: state => state.child_node_index,
      grandSonNodeIndex: state => state.grandson_node_index,
    }), 
    LogVal(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].children[this.grandSonNodeIndex].Logitude;},    //当前数据属性对应的最大值
    latVal(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].children[this.grandSonNodeIndex].latitude;},    //当前数据属性对应的最小值viewZoom(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].zoom;},    //当前数据适宜的缩放尺度
    viewZoom(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].zoom;},    //当前数据适宜的缩放尺度
    centerPosition(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].centerPosition;},    //当前数据适宜的中心
  },
  mounted(){
    this.initMap();
    this.grawExtent();
  },
  methods:{
    //初始化地图
  	initMap:function(){
  		if(!this.map){
        this.map = L.map('extent-map').setView([50.505,-108.09],3);
        L.tileLayer(bgMapUrl).addTo(this.map);
        this.map.setView(this.centerPosition,(this.viewZoom-2));
      }
    },
    //绘制区域
    grawExtent:function(){
      // define rectangle geographical bounds
      let bounds = [[this.latVal[0], this.LogVal[0]], [this.latVal[1], this.LogVal[1]]];
      // create an orange rectangle
      L.rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(this.map);
    }
  }
}
</script>
