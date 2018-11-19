<template>
	<div id="leafMapResultPart" style="width:100%;height:100%;"></div> 
</template>

<script>
import Leaflet from 'leaflet'
import {mapState} from 'vuex'
import Vue from "vue"
import messageBus from '../../bus/messageBus.js'
require('../../style/main_style.scss')

var bgMapUrl11 = 'https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoiZ2VtbWFhYWEiLCJhIjoiY2o2a2N5dzB1MWd1ZTMzcnlqMDhkM3ZjYyJ9.0vVVkY9k7t8z0e3uqMgQnQ';

export default {
  name: 'mapForResult',
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
    if(this.computeResult){
      this.initMap();
      this.addDataViewOnMap();
    }
  },
  computed:{
    ...mapState({
      computeResult: state => state.computeResult
    }),
  },
  watch:{
    computeResult:'addDataViewOnMap'
  },
  methods:{
    //初始化地图
  	initMap:function(){
      if(!this.map){
    		this.map = L.map('leafMapResultPart').setView([50.505,-108.09],3);
    		L.tileLayer(bgMapUrl11).addTo(this.map);
      }
    },
	  //添加数据属性的可视化图层
    addDataViewOnMap:function(){
      this.layer && this.layer.remove();
      this.map.setView(this.computeResult.centerPosition,this.computeResult.zoom)
      let that = this;
      this.layer = L.geoJson(this.computeResult.data,{
        pointToLayer: function(feature,latlng){
          return L.circleMarker(latlng,that.pointStyle(feature))
        },
        onEachFeature: this.onEachFeature
      }) 
      this.layer.addTo(this.map);
      this.legendLayer && this.legendLayer.remove();
      this.addLegend();	  
    },
    //添加地图图例
    addLegend: function(){
      let minVal = this.computeResult.minVal,
      maxVal = this.computeResult.maxVal,
      distance = (maxVal - minVal)/8, self = this;
      this.legendLayer = L.control({position: 'bottomright'});   
      this.legendLayer.onAdd = function(map) {
        let div = L.DomUtil.create('div', 'map_legend'),
            grades = minVal<maxVal?[minVal.toFixed(2), (minVal+distance).toFixed(2), (minVal+distance*2).toFixed(2), (minVal+distance*3).toFixed(2), (minVal+distance*4).toFixed(2), (minVal+distance*5).toFixed(2), (minVal+distance*6).toFixed(2), (minVal+distance*7).toFixed(2),maxVal.toFixed(2)]:[minVal.toFixed(2),maxVal.toFixed(2)],
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
	  //设置数据点分层设色的颜色
    GetColor:function(d) {
      let minVal = this.computeResult.minVal,maxVal = this.computeResult.maxVal,distance = (maxVal - minVal)/8;
      return d > maxVal+distance*7 ? this.legendColor[7] :
             d > minVal+distance*6  ? this.legendColor[6] :
             d > minVal+distance*5  ? this.legendColor[5] :
             d > minVal+distance*4  ? this.legendColor[4] :
             d > minVal+distance*3   ? this.legendColor[3] :
             d > minVal+distance*2   ? this.legendColor[2] :
             d > minVal+distance   ? this.legendColor[1] : this.legendColor[0];
    },
    //设置数据点显示的样式
    pointStyle:function(feature){
      return {
            radius: 3,
            fillColor: this.GetColor(feature.properties.yhat),
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
    //鼠标点击传输数据生成对应的图表
    handleClick:function(e){
      let layer = e.target,prop = layer.feature.properties,self=this;     
      this.highlightFromTable && this.highlightFromTable.remove();//清空已经高亮的图层
      this.highlightFromTable = L.geoJson(layer.feature,{
        pointToLayer: function(feature,latlng){
          return L.circleMarker(latlng,self.pointStyle(feature,self.par))
        }
      }).addTo(self.map)
      this.highlightFromTable.setStyle(this.highlightLayerStyle);     
      messageBus.$emit('data-for-chart',prop);//传输数据到chart中，支持图表联动
    }
  }
}
</script>
