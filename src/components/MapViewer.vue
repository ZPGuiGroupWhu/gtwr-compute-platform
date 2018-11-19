<template>
  	<div id="leafmap" style="width:100%;height:100%;z-index:1"></div> 
</template>

<script>
import Leaflet from 'leaflet'
import {mapState} from 'vuex'
import messageBus from '../bus/messageBus.js'
require('../style/main_style.scss')

var bgMapUrl = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2VtbWFhYWEiLCJhIjoiY2o2a2N5dzB1MWd1ZTMzcnlqMDhkM3ZjYyJ9.0vVVkY9k7t8z0e3uqMgQnQ';

export default {
  name: 'MapViewer',
  data () {
    return {
      	map: null,
        layer:null,
        highlightFromTable:null,
        legendLayer:null,
        legendColor:['#FFEDA0','#FED976','#FEB24C', '#FD8D3C','#FC4E2A','#E31A1C','#BD0026','#800026'],
        highlightLayerStyle:{
          weight: 3,
          color: 'lightseagreen',
          dashArray: '',
          fillOpacity: 0.7
        }
    }
  },
  mounted(){
  	this.initMap();
    this.addDataViewOnMap();
    this.listenToTable();
  },
  computed:{
    ...mapState({
      parentNodeIndex: state => state.parent_node_index,
      childNodeIndex: state => state.child_node_index,
      grandSonNodeIndex: state => state.grandson_node_index,
    }),
    dataA(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].url;},//节点数据，例如房价数据
    par(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].children[this.grandSonNodeIndex].name;},    //当前选择的参数，数据属性
    viewZoom(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].zoom;},    //当前数据适宜的缩放尺度
    centerPosition(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].centerPosition;},    //当前数据适宜的中心
    maxVal(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].children[this.grandSonNodeIndex].max;},    //当前数据属性对应的最大值
    minVal(){return this.$store.state.data_list[this.parentNodeIndex].data_type[this.childNodeIndex].children[this.grandSonNodeIndex].min;},    //当前数据属性对应的最小值
  },
  watch:{
	  par:'addDataViewOnMap'
  },
  methods:{
	  //初始化地图
  	initMap:function(){
  		if(!this.map){
        this.map = L.map('leafmap').setView([50.505,-108.09],3);
        L.tileLayer(bgMapUrl).addTo(this.map);
      }
  	},
	  //添加数据属性的可视化图层
    addDataViewOnMap:function(){
      this.layer && this.layer.remove();
      this.map.setView(this.centerPosition,this.viewZoom)
      let that = this;
      this.layer = L.geoJson(this.dataA,{
        pointToLayer: function(feature,latlng){
          return L.circleMarker(latlng,that.pointStyle(feature,that.par))
        },
        onEachFeature: this.onEachFeature
      }) 
      this.layer.addTo(this.map);	
      this.legendLayer && this.legendLayer.remove();
      this.addLegend();  
    },
    //添加地图图例
    addLegend: function(){
      let distance = (this.maxVal - this.minVal)/8, self = this;
      this.legendLayer = L.control({position: 'bottomright'});
      this.legendLayer.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'map_legend'),
            grades = self.minVal < self.maxVal ? [self.minVal.toFixed(2), (self.minVal+distance).toFixed(2), (self.minVal+distance*2).toFixed(2), (self.minVal+distance*3).toFixed(2), (self.minVal+distance*4).toFixed(2), (self.minVal+distance*5).toFixed(2), (self.minVal+distance*6).toFixed(2), (self.minVal+distance*7).toFixed(2),(self.maxVal).toFixed(2)]:[self.minVal.toFixed(2), (self.maxVal).toFixed(2)],
            labels = [], from, to;
        for (let i = 0; i < grades.length; i++) {
          from = grades[i];
          to = grades[i + 1];
          to && labels.push('<i class="map_legend_div" style="background:' + self.legendColor[i] + '"></i><i class="map_legend_font"> ' + from + '&ndash;' + to+'</i>');
        }
        div.innerHTML = labels.join('<br>');
        return div;
      };
      this.legendLayer.addTo(this.map);
    },
	  /**
     * 设置数据点分层设色的颜色
     * @param float d [description] 数据点属性值
     */
    GetColor:function(d) {
      let distance = (this.maxVal - this.minVal)/8
      return d > this.maxVal+distance*7 ? this.legendColor[7] :
             d > this.minVal+distance*6  ? this.legendColor[6] :
             d > this.minVal+distance*5  ? this.legendColor[5] :
             d > this.minVal+distance*4  ? this.legendColor[4] :
             d > this.minVal+distance*3   ? this.legendColor[3] :
             d > this.minVal+distance*2   ? this.legendColor[2] :
             d > this.minVal+distance   ? this.legendColor[1] : this.legendColor[0];
    },
    //设置数据点显示的样式
    pointStyle:function(feature,par){
      return {
            radius: 3,
            fillColor: this.GetColor(feature.properties[par],par),
            weight: 0,
            opacity: 1,
            fillOpacity: 0.8
      }
    },
    //鼠标滑过特征图块，高亮显示
    highlightFeature:function(e) {
      let layer = e.target;
      layer.setStyle(this.highlightLayerStyle);
      !L.Browser.ie && !L.Browser.opera && !L.Browser.edge && layer.bringToFront();
    },
    //鼠标移出，还原样式
    resetHighlight:function(e) {
      this.layer.resetStyle(e.target);
    },
	  //设置监听
    onEachFeature:function(feature, layer) {
        layer.on({
            mouseover: this.highlightFeature,
            mouseout: this.resetHighlight,
            click: this.handleClick
        });
    },
    //鼠标点击传输数据到dataViewer组件
    handleClick:function(e){
      let layer = e.target,prop = layer.feature.properties.name,self=this;
      this.highlightFromTable && this.highlightFromTable.remove();//清空已经高亮的图层
      self.highlightFromTable = L.geoJson(layer.feature,{
        pointToLayer: function(feature,latlng){
          return L.circleMarker(latlng,self.pointStyle(feature,self.par))
        }
      }).addTo(self.map)
      self.highlightFromTable.setStyle(self.highlightLayerStyle);
	    messageBus.$emit('event-to-chart',prop);
      
    },
    //监听从dataviewer中点击数据行所传输的数据，并在地图上显示点击数据行所对应的图块
    listenToTable:function(){
      const that = this;
      messageBus.$on('from-table-to-map',function(val){
        that.highlightFromTable && that.highlightFromTable.remove();//清空已经高亮的图层     
        const temp = that;
        that.highlightFromTable = L.geoJson(val,{   //叠加点击数据行对一个的小图块
          pointToLayer: function(feature,latlng){
            return L.circleMarker(latlng,temp.pointStyle(feature,temp.par))
          }
        }).addTo(that.map)
        that.highlightFromTable.setStyle(that.highlightLayerStyle);
      });
    }
  }
}

</script>

